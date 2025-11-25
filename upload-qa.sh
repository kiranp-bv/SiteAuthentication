
aws s3 sync common s3://bv-loader-qa/siteauth/v2/qa \
  --acl bucket-owner-full-control \
  --profile swat-qa \
  --no-guess-mime-type \
  --cache-control "max-age=0, no-cache" \
  --content-type "text/html" \
  --metadata-directive REPLACE