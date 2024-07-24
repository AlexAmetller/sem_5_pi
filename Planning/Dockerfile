FROM swipl:stable

WORKDIR /app

COPY ./prolog .

EXPOSE 3003

ENTRYPOINT ["swipl", "-f", "/app/server.pl", "-g", "run_server"]
