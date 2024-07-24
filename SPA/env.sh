#!/usr/bin/env sh
#
# Load environment variables into env.js file when serving using nginx

add_env() {
  env | grep -E "^$1" | sed "s/\(\S\+\)=\(\S\+\)/window.\1 = '\2';/" \
    >> /usr/share/nginx/html/env.js
}

add_env "WAREHOUSE_URL"
add_env "LOGISTICS_URL"
add_env "AUTHZ_URL"
