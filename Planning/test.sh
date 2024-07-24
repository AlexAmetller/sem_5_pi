#!/usr/bin/env bash
#
# Start server and try creating a schedule

swipl -f ./prolog/server.pl -g run_server &
sleep 3
PID=$!

curl -v -d "@input.json" \
	-H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
	http://localhost:3003/schedule

kill $PID
