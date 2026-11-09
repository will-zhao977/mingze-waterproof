#!/bin/bash
COOKIE='JSESSIONID=382E914854821C1876EBFDA0C05B5B55; XSRF-TOKEN=d9954a2a-5053-4b32-b53f-3f3e951d8215; cookie2=14233d29ef3d73a26aa40ea20b73d26d; _tb_token_=ee399db739e7; t=c4edd8bd5d2028dff8db808ac6c2a63e; cna=P6amIVwMWioBASQJijyTf1iE; isg=BAwM2Z6Civv-pZ08rrTtcwNm3Ww-RbDva1p-UWbNGLda8az7jlWAfwJDlflJhOhH; xman_i=aid=2216324214490; cnaui=2216324214490; aui=2216324214490; xman_status2=0; xman_us_f=x_locale=zh_CN&x_user=CN%7CZi%20Song%7CLiu%7Ccgs%7C274881388&no_popup_today=n&x_l=1; xman_us_t=l_source=alibaba&sign=y&need_popup=y&x_lid=wfmingze; ali_apache_track=mt=3%7Cmid=wfmingze; intl_locale=zh_CN; NWG=NNW; arms_uid=e9cfa57e-4b71-40c1-87e7-49427fc7fa21'
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
mkdir -p /Users/chengzhi/workspace/mingze/materials/阿里国际站培训
cd /Users/chengzhi/workspace/mingze/materials/阿里国际站培训 || exit 1

dl () {
  out="$5.pdf"
  curl -sS -L --max-time 90 -A "$UA" -H "Cookie: $COOKIE" -H "Referer: https://peixun.alibaba.com/" \
    -G "https://peixun.alibaba.com/openvideo/downLoadCourseWare.json" \
    --data-urlencode "courseWare=$1" \
    --data-urlencode "fileName=$2" \
    --data-urlencode "courseWareId=$3" \
    --data-urlencode "courseId=$4" \
    -o "$out"
  echo "$out | $(file -b "$out" | cut -c1-45) | $(wc -c < "$out") bytes"
}

dl "Hb2fa58e9121f41c385bcbd3296ab1281T.pdf" "AI时代效果广告投放.pdf" "2292003" "PX002D17I" "2-1_AI时代效果广告投放"
dl "H28856f8dc6e64249a47e1354b2e4496ci.pdf" "产品速览.pdf" "2286007" "PX002CZ8Q" "2-2_产品速览"
dl "H12cf54bb61474e1994914278b15b03a5U.pdf" "日预算版.pdf" "2293005" "PX002DL6N" "2-3_全站推日预算版实操"
dl "H10ad0ab941694b4dbf3c4756fb1ba53cv.pdf" "省心版.pdf" "2283011" "PX002DAIR" "2-4_全站推省心版实操"
dl "Hec83d5672bda4e19ba801e54e9b7cef5r.pdf" "常见疑问.pdf" "2283012" "PX002DAIS" "2-5_常见疑问解答"
dl "H055bc34dc12c423d84007c1b0aa7e365Q.pdf" "如何查看及优化  「全站推」投放效果.pdf" "2278001" "PX002D5L6" "2-6_如何查看及优化投放效果"
dl "H1fb462e2dae645e08922c93df2f759adE.pdf" "2.9月采购节直通车备战攻略.pdf" "2293018" "PX002DLR4" "1-1_9月采购节直通车备战攻略"
dl "H1964b92f67e740eeacf1033a6cf6051ef.pdf" "全站推极简溢价升级-邱佳2026.07.pdf" "2294002" "PX002DOA2" "1-2_全站推极简溢价升级"
dl "H669bd3c8e7ff4c76a2c74e8803fa70b2h.pdf" "4-直通车营销等级升级.pdf" "2291003" "PX002DMKW" "1-3_直通车营销等级升级"
dl "H9c49dd104d43401cb3a03757fc5d6880n.pdf" "全站推1-如何提升商机质量.pdf" "2283006" "PX002DACM" "3-1_聚焦高质量商机"
dl "H03f65e97f7aa47bf828998519839995c2.pdf" "全站推2-L3+买家溢价.pdf" "2282010" "PX002DCN9" "3-2_L3+买家溢价"
dl "Hd6417e5223ce4e1d83b6a39b8150172cA.pdf" "全站推3-重点国家溢价.pdf" "2282011" "PX002DCNA" "3-3_重点国家溢价"
dl "H067304d8dcb947189c83b48eb871feacv.pdf" "全站推4-高意向商机.pdf" "2287003" "PX002DH78" "3-4_高意向商机"
