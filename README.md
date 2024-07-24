# SEM_5_PI_80

Projeto Integrador 5, ano 2022/1 -
[Documentacão](./doc/index.md) | [Backlog](./doc/backlog.md) | [Review](./doc/review.md) | [Guia de contribuicão](./CONTRIBUTING.md) | [Requisitos](./doc/requirements)

## Deployments:

- [SPA](https://eletricacme.azurewebsites.net)  
- [Logistics](https://logisticsg80.azurewebsites.net)  
- [WarehouseManagement](https://warehouseg80.azurewebsites.net)  
- [Planning](https://planningg80.azurewebsites.net)  
- [Authz](https://authz80.azurewebsites.net)  

## Iniciando os servicos (docker)

Os servicos podem ser iniciados usando Docker:

```sh
# Restaurar dependencies
npm i --prefix ./Logistics
dotnet restore ./WarehouseManagement/WarehouseManagement.sln

# Iniciar servicos
docker-compose up
```

| Service              | Port  | Image         |
| ---                  | ---   | ---           |
| spa-app              | 3000  | node          |
| warehouse-app        | 3001  | dotnet sdk    |
| logistics-app        | 3002  | node          |
| planning-app         | 3003  | swipl         |
| authz-app            | 3004  | node          |
| warehouse-dashboard  | 3011  | mongo-express |
| logitstics-dashboard | 3012  | pgadmin4      |
| warehouse-db         | 5432  | postgresql    |
| logistics-db         | 27017 | mongodb       |

## Iniciando os servicos (manual)

Uma base de dados Mongo e Postgresql remota são fornecidas para desenvolvimento, através das connection string:

```sh
postgresql://postgres:kq5qfG8ybFvOuBkOjpzo@containers-us-west-83.railway.app:5602/railway
mongodb://mongo:qgJGY5HHex4OczsM63Bw@containers-us-west-105.railway.app:7078
```

A aplicacão de Gestão de Armazéns pode ser manualmente iniciada:

```sh
env ConnectionStrings__Database="User ID=postgres;Password=kq5qfG8ybFvOuBkOjpzo;Host=containers-us-west-83.railway.app;Port=5602;Database=railway;Pooling=true;" \
	dotnet run --project ./WarehouseManagement/API
```

A aplicacão de Logística pode ser manualmente iniciada:

```sh
env MONGODB_URI=mongodb://mongo:qgJGY5HHex4OczsM63Bw@containers-us-west-105.railway.app:7078 \
	npm run --prefix Logistics start
```

### Tools
``` Migrations
dotnet tool install --global dotnet-ef
// Add migration (docker)
env ConnectionStrings__Database="User ID=user;Password=password;Host=localhost;Port=5432;Database=postgres;Pooling=true;" dotnet ef migrations add InitialCreate --project ./WarehouseManagement/Infrastructure --startup-project ./WarehouseManagement/API
```
