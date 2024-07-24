FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine AS publish
RUN apk upgrade

WORKDIR /app

COPY . .

RUN dotnet restore --runtime alpine-x64

RUN dotnet publish \
  -c Release \
  -o publish \
  --no-restore \
  --runtime alpine-x64 \
  --self-contained true \
  /p:PublishSingleFile=true \
  ./API/API.csproj

FROM mcr.microsoft.com/dotnet/runtime-deps:7.0-alpine AS final
RUN apk upgrade

WORKDIR /app

RUN apk add --no-cache icu-libs
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

COPY --from=publish /app/publish .

RUN adduser --disabled-password --home /app --gecos '' dotnet-user && chown -R dotnet-user /app
USER dotnet-user

EXPOSE 3001

ENTRYPOINT ["./API", "--urls", "http://+:3001"]
