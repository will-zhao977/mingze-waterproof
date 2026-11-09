"""Read-only product collection and queries; requires an authorized host context."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import time
from datetime import datetime, timezone


LIST_TOOL = "list_products_by_score"
DETAIL_TOOL = "query_product_by_id"
PRODUCT_FIELDS = (
    "productId", "title", "keywords", "categoryId", "status", "auditStatus",
    "createTimeMillis", "modifyTimeMillis", "sellerModifyTimeMillis",
    "originalCurrencyCode", "priceDTO", "mediaInfoDTO", "propertyPairList",
    "skuList", "productUnit", "structuredDescDTO", "detailPageUrl",
    "productFulfillmentDTO", "productCustomizationInfoDTO", "sampleDTO",
)
PRIVATE_KEYS = {
    "sellerqueryresultdto", "shopqueryresultdto", "companyid", "aliid",
    "memberid", "memberseq", "accountid", "email", "phone", "telephone",
    "mobile", "address", "token", "accesstoken", "refreshtoken", "cookie",
    "authorization", "password", "secret", "credential", "expandmap",
    "featuremap", "descriptionfeaturemap",
}


def now():
    return datetime.now(timezone.utc).isoformat()


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def safe_fields(value):
    if isinstance(value, dict):
        return {
            key: safe_fields(item) for key, item in value.items()
            if key.lower().replace("_", "").replace("-", "") not in PRIVATE_KEYS
        }
    if isinstance(value, list):
        return [safe_fields(item) for item in value]
    return value


def error_code(exc):
    message = str(exc)
    known = {
        "source_unsuccessful_or_invalid_envelope", "source_business_error",
        "nested_source_business_error", "source_non_json_response",
        "source_envelope_missing_inner", "mcp_error_envelope_unparsable",
        "unexpected_product_list_shape", "missing_or_invalid_product_id",
        "unexpected_detail_shape", "missing_product_query_result",
        "detail_product_id_mismatch", "tool_not_allowlisted",
    }
    prefixes = ("transient_", "source_business_error_", "source_process_failed_exit_")
    if message in known or message.startswith(prefixes):
        return message
    return type(exc).__name__


def checked_response(response):
    if not isinstance(response, dict) or response.get("success") is not True:
        raise ValueError("source_unsuccessful_or_invalid_envelope")
    for envelope in (response, response.get("errorDTO", {})):
        if isinstance(envelope, dict) and (
            envelope.get("errorCode") or envelope.get("errorMsg")
        ):
            raise ValueError("source_business_error")
    data = response.get("data")
    if isinstance(data, str):
        data = json.loads(data)
    if isinstance(data, dict):
        if data.get("success") is False or data.get("errorCode") or data.get("errorMsg"):
            raise ValueError("nested_source_business_error")
    return data


class TransientSourceError(ValueError):
    """Retryable upstream failure such as a downstream timeout (-32000)."""


TRANSIENT_ERROR_CODES = {"-32000"}
TRANSIENT_HINTS = ("超时", "timeout", "timed out", "connection reset", "请稍后重试")


def unwrap_envelope(payload):
    """Unwrap the MCP envelope and classify upstream failures.

    Returns the inner business envelope dict. Raises TransientSourceError for
    retryable upstream failures and ValueError for fatal ones.
    """
    if not isinstance(payload, dict):
        raise ValueError("source_non_json_response")
    if "content" in payload or "isError" in payload:
        text = None
        content = payload.get("content")
        if isinstance(content, list) and content and isinstance(content[0], dict):
            text = content[0].get("text")
        inner = None
        if isinstance(text, str):
            try:
                inner = json.loads(text)
            except json.JSONDecodeError:
                inner = None
        if not isinstance(inner, dict):
            if payload.get("isError"):
                raise TransientSourceError("mcp_error_envelope_unparsable")
            raise ValueError("source_envelope_missing_inner")
        if payload.get("isError") or inner.get("success") is False:
            code = str(inner.get("errorCode") or "")
            message = str(inner.get("errorMsg") or "")
            if code in TRANSIENT_ERROR_CODES or any(h in message.lower() or h in message for h in TRANSIENT_HINTS):
                raise TransientSourceError("transient_" + (code or "unknown"))
            raise ValueError("source_business_error_" + (code or "unknown"))
        return inner
    return payload


def call_source(tool, params, max_attempts=3):
    if tool not in (LIST_TOOL, DETAIL_TOOL):
        raise ValueError("tool_not_allowlisted")
    attempt = 0
    while True:
        attempt += 1
        try:
            completed = subprocess.run(
                ["accio-mcp-cli", "call", tool, "--json", json.dumps(params), "--raw"],
                capture_output=True, text=True, timeout=150, check=False,
            )
            if completed.returncode:
                raise TransientSourceError("source_process_failed_exit_" + str(completed.returncode))
            try:
                payload = json.loads(completed.stdout)
            except json.JSONDecodeError as exc:
                raise TransientSourceError("source_non_json_response") from exc
            return unwrap_envelope(payload)
        except TransientSourceError as exc:
            if attempt >= max_attempts:
                exc.args = (exc.args[0] + "_retries_exhausted",)
                raise
            time.sleep(2 * attempt)


def normalize_listing(response):
    data = checked_response(response)
    if not isinstance(data, list):
        raise ValueError("unexpected_product_list_shape")
    result = []
    for item in data:
        product_id = str(item.get("productId", ""))
        if not product_id.isdigit():
            raise ValueError("missing_or_invalid_product_id")
        title = item.get("title")
        if isinstance(title, dict):
            title = title.get("defaultText")
        result.append({
            "product_id": product_id,
            "title": title,
            "category": safe_fields(item.get("categoryQueryResultDTO")),
            "source": LIST_TOOL,
        })
    return result


def normalize_detail(response, product_id):
    data = checked_response(response)
    if not isinstance(data, dict):
        raise ValueError("unexpected_detail_shape")
    product = data.get("productQueryResult")
    if isinstance(product, str):
        product = json.loads(product)
    if not isinstance(product, dict):
        raise ValueError("missing_product_query_result")
    if str(product.get("productId")) != str(product_id):
        raise ValueError("detail_product_id_mismatch")
    result = safe_fields({key: product.get(key) for key in PRODUCT_FIELDS})
    result["productId"] = str(product_id)
    for sku in result.get("skuList") or []:
        for key in ("skuId", "productId", "innerId", "outerId"):
            if sku.get(key) is not None:
                sku[key] = str(sku[key])
    return {
        "product_id": str(product_id),
        "source": DETAIL_TOOL,
        "fields": result,
        "missing_fields": [key for key in PRODUCT_FIELDS if product.get(key) is None],
        "desc_component_data": safe_fields(data.get("descComponentData")),
    }


def collect_products(source, binding, seeds=None, detail_seeds=None,
                     max_pages=100, detail_limit=5, pause=0.5):
    seeds = seeds or {}
    detail_seeds = detail_seeds or {}
    rows, seen, page_fingerprints = [], set(), set()
    pages, errors, details = [], [], []
    terminal_empty = False
    stop_reason = "page_limit_reached"
    for page in range(1, max_pages + 1):
        try:
            response = seeds.get(page)
            if response is None:
                response = source(LIST_TOOL, {"minScore": 0, "maxScore": 100, "page": page})
                time.sleep(pause)
            items = normalize_listing(response)
            ids = [item["product_id"] for item in items]
            pages.append({"page": page, "row_count": len(items), "seed_reused": page in seeds})
            if not items:
                terminal_empty, stop_reason = True, "empty_page"
                break
            fingerprint = tuple(sorted(ids))
            if fingerprint in page_fingerprints:
                stop_reason = "repeated_page"
                errors.append({"stage": "list", "page": page, "code": stop_reason})
                break
            if len(set(ids)) != len(ids) or seen.intersection(ids):
                stop_reason = "overlapping_product_ids"
                errors.append({"stage": "list", "page": page, "code": stop_reason})
                break
            page_fingerprints.add(fingerprint)
            seen.update(ids)
            rows.extend(items)
        except (ValueError, KeyError, TypeError, subprocess.TimeoutExpired) as exc:
            stop_reason = "source_error"
            errors.append({"stage": "list", "page": page, "code": error_code(exc)})
            break
    for row in rows[:detail_limit]:
        product_id = row["product_id"]
        try:
            response = detail_seeds.get(product_id)
            if response is None:
                response = source(DETAIL_TOOL, {"productId": int(product_id)})
                time.sleep(pause)
            details.append(normalize_detail(response, product_id))
        except (ValueError, KeyError, TypeError, subprocess.TimeoutExpired) as exc:
            errors.append({"stage": "detail", "product_id": product_id, "code": error_code(exc)})
            break
    return {
        "schema": "mingze-product-readonly/v1",
        "collected_at": now(),
        "store_binding": binding,
        "binding_evidence": "operator_confirmed_host_context_not_independently_verified",
        "source_query": {"tool": LIST_TOOL, "minScore": 0, "maxScore": 100},
        "coverage": {
            "listing_rows": len(rows), "details_rows": len(details),
            "listing_exhausted_for_score_query": terminal_empty,
            "all_store_products_verified": False,
            "details_complete_for_collected_list": terminal_empty and len(details) == len(rows),
            "requested_detail_limit": detail_limit, "max_pages": max_pages,
            "stop_reason": stop_reason, "pages": pages,
        },
        "warnings": [
            "Score-filtered listing does not prove inclusion of all draft, offline, unrated or deleted products.",
            "This is a current snapshot, not change history or product performance.",
            "Source status codes are retained without inferred labels.",
            "Contact metadata keys are excluded; free-text and media may still contain contact details. External sharing requires review.",
        ],
        "errors": errors, "products": rows, "details": details,
    }


def load_listing_ids(listing_path):
    data = load_json(listing_path)
    if data.get("schema") != "mingze-product-readonly/v1":
        raise ValueError("unsupported_listing_schema")
    ids = [str(p["product_id"]) for p in data.get("products", [])]
    if len(set(ids)) != len(ids):
        raise ValueError("duplicate_ids_in_listing")
    return ids


def completed_detail_ids(jsonl_path):
    done = set()
    if not Path(jsonl_path).exists():
        return done
    with Path(jsonl_path).open(encoding="utf-8") as stream:
        for line in stream:
            line = line.strip()
            if not line:
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError:
                continue
            pid = row.get("product_id")
            if row.get("status") == "ok" and pid:
                done.add(str(pid))
    return done


def collect_details_batch(source, listing_path, jsonl_path, batch_size, pause=0.4):
    """Append up to batch_size product details to a JSONL file, resumable.

    Skips product_ids already recorded with status=ok. Writes one compact JSON
    object per line; never returns detail bodies to the caller.
    """
    all_ids = load_listing_ids(listing_path)
    done = completed_detail_ids(jsonl_path)
    pending = [pid for pid in all_ids if pid not in done]
    batch = pending[:batch_size]
    errors = []
    ok_now = 0
    path = Path(jsonl_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as stream:
        for pid in batch:
            record = {"product_id": pid, "source": DETAIL_TOOL}
            try:
                response = source(DETAIL_TOOL, {"productId": int(pid)})
                record.update(status="ok", **normalize_detail(response, pid))
                ok_now += 1
            except (ValueError, KeyError, TypeError, subprocess.TimeoutExpired) as exc:
                record.update(status="error", code=error_code(exc))
                errors.append({"product_id": pid, "code": error_code(exc)})
            record["fetched_at"] = now()
            stream.write(json.dumps(record, ensure_ascii=False) + "\n")
            stream.flush()
            time.sleep(pause)
    done_after = completed_detail_ids(jsonl_path)
    return {
        "schema": "mingze-product-detail-batch-receipt/v1",
        "listing_total": len(all_ids),
        "batch_requested": batch_size,
        "processed_now": len(batch),
        "ok_now": ok_now,
        "errors_now": errors,
        "total_completed": len(done_after),
        "remaining": len(all_ids) - len(done_after),
        "exhausted": len(done_after) >= len(all_ids),
        "jsonl_path": str(path.resolve()),
    }


def summary(data):
    return {key: data[key] for key in (
        "schema", "collected_at", "store_binding", "binding_evidence",
        "source_query", "coverage", "warnings", "errors",
    )}


def parse_seed(values):
    result = {}
    for value in values:
        key, path = value.split("=", 1)
        result[key] = load_json(path)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="action", required=True)
    collect = sub.add_parser("collect")
    collect.add_argument("--output", required=True)
    collect.add_argument("--store-binding", required=True)
    collect.add_argument("--confirm-bound-context", action="store_true")
    collect.add_argument("--seed-page", action="append", default=[])
    collect.add_argument("--seed-detail", action="append", default=[])
    collect.add_argument("--max-pages", type=int, default=100)
    collect.add_argument("--detail-limit", type=int, default=5)
    query = sub.add_parser("query")
    query.add_argument("--input", required=True)
    query.add_argument("--product-id")
    query.add_argument("--limit", type=int, default=20)
    details = sub.add_parser("details-batch")
    details.add_argument("--listing", required=True)
    details.add_argument("--jsonl", required=True)
    details.add_argument("--store-binding", required=True)
    details.add_argument("--confirm-bound-context", action="store_true")
    details.add_argument("--batch-size", type=int, default=25)
    args = parser.parse_args()
    if args.action == "collect":
        if not args.confirm_bound_context:
            parser.error("Explicit confirmation of the active host store binding is required.")
        if args.max_pages < 1 or args.detail_limit < 0:
            parser.error("Invalid collection bounds.")
        output = Path(args.output).resolve()
        if output.exists() or not output.parent.is_dir():
            parser.error("Output must be a new file inside an existing directory.")
        seeds = {int(k): v for k, v in parse_seed(args.seed_page).items()}
        details = parse_seed(args.seed_detail)
        data = collect_products(call_source, args.store_binding, seeds, details,
                                args.max_pages, args.detail_limit)
        content = json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8")
        fd = os.open(str(output), os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, "wb") as stream:
            stream.write(content)
        receipt = summary(data)
        receipt.update(output_path=str(output), sha256=hashlib.sha256(content).hexdigest())
        print(json.dumps(receipt, ensure_ascii=False, indent=2))
        return 2 if data["errors"] or not data["coverage"]["listing_exhausted_for_score_query"] else 0
    if args.action == "details-batch":
        if not args.confirm_bound_context:
            parser.error("Explicit confirmation of the active host store binding is required.")
        if args.batch_size < 1 or args.batch_size > 100:
            parser.error("Batch size must be between 1 and 100.")
        receipt = collect_details_batch(call_source, args.listing, args.jsonl, args.batch_size)
        print(json.dumps(receipt, ensure_ascii=False, indent=2))
        return 0 if not receipt["errors_now"] and receipt["exhausted"] else 2
    data = load_json(args.input)
    if data.get("schema") != "mingze-product-readonly/v1":
        parser.error("Unsupported input schema.")
    if args.limit < 1 or args.limit > 100:
        parser.error("Query limit must be between 1 and 100.")
    result = summary(data)
    if args.product_id:
        result["products"] = [x for x in data["products"] if x["product_id"] == args.product_id]
        result["details"] = [x for x in data["details"] if x["product_id"] == args.product_id]
    else:
        result["products"] = data["products"][:args.limit]
        result["returned_rows"] = len(result["products"])
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
