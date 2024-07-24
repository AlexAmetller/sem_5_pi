#!/usr/bin/env bash
#
# Start swipl process and server.

sigint_handler()
{
  kill $PID
  exit
}

trap sigint_handler SIGINT SIGHUP

while true; do
  swipl -f ./prolog/server.pl -g run_server &
  PID=$!
  inotifywait -e modify -e move -e create -e delete -e attrib -r `pwd`
  kill $PID
  sleep 3
done
