# UC 03: Breno Pacheco (1180005)

> Como administrador de sistemas quero que seja realizada uma cópia de
> segurança da(s) DB(s) para um ambiente de Cloud através de um script que a
> renomeie para o formato <nome_da_db>_yyyymmdd sendo <nome_da_db> o nome da
> base de dados, yyyy o ano de realização da cópia, mm o mês de realização da
> cópia e dd o dia da realização da cópia.

Realizaremos backups de uma base de dados em Cloud do tipo `Postgresql`. Para
tanto, precisamos de utilizar o módulo `psql`, ferramenta de interface de
comando para conexão com a base de dados. Iniciamos pela instalacão dos
módulos adequados para a distribuicao Linux usada: __Ubuntu 20.04
LTS__.

```sh
$ apt-get install -y postgresql
$ psql --version
psql (PostgreSQL) 12.12
```

No entanto, a `m̀ajor version` da base de dados usada no servidor da Cloud deve
ser a mesma instalada. Por defeito, a versão 12 é incluído nos repositórios de
pacotes do Ubuntu. Precisamos, portanto, adicionar os repositórios
necessários, de acordo com a [documentacão
oficial](https://www.postgresql.org/download/linux/debian/) e instalar a
versão compatível:

```sh
# Create the file repository configuration:
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt \
  $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
# Import the repository signing key:
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc \
  | sudo apt-key add -
# Update the package lists:
sudo apt-get update
# Install the correct version of PostgreSQL.
sudo apt-get -y install postgresql-13
```


Realizamos então a conexão à base de dados:
```sh
$ PGPASSWORD=******** psql -h <host> -p <port> -U <username> \
    -d <database>
```

No entanto, não é necessário conectar interativamente à base de dados. Podemos
utilizar a ferramenta CLI `pg_dump` distribuída junto do pacote `postgresql`
para criar um backup da base de dados:

```sh
$ PGPASSWORD=******** pg_dump --no-owner -h <host> -p <port> \
    -U <username> <database> > file.sql
```

Devemos definir agora o formato `yyyymmdd` do nome do ficheiro de backup. Utilizamos o
comando `date` dos `coreutils` (ver: `man date`):
```sh
$ date +"%Y%m%d" # %Y year, %m month, %d day
20221214
```

Dessa forma, podemos escrever nosso script da seguinte forma (backup.sh):
```sh
#!/usr/bin/env bash

HOST=containers-us-west-83.railway.app
PORT=5602
USER=postgres
DATABASE=railway

# aceita como único parâmetro o diretório onde deve escrever o backup
DIR=${1:-/usr/share/backups}
BACKUP="${DIR}/${DATABASE}_$(date +"%Y%m%d").sql"
SESSION=$RANDOM

# criamos o diretório onde serão colocados os backups
test -d $DIR || mkdir -p $DIR 

PGPASSWORD=******************** pg_dump \
    --no-owner \
    -h $HOST \
    -p $PORT \
    -U $USER \
    $DATABASE > $BACKUP

exit $? # exit with same exit status as pg_dump
```

Ao executar o script, obtemos um arquivo como por exemplo  
_railway_20221217.sql_, com trechos de conteúdo seguindo o seguinte formato:

```txt
-- Dumped from database version 13.2
...
CREATE TABLE public."Deliveries" (
    "Id" text NOT NULL,
    "Code_Value" text,
...
COPY public."Deliveries" ("Id", "Code_Value", "Date", "Mass", ...
a19d8995-39ba-4ab4-a373-6769154524a4    4439    2022-11-27    ...
87d4e59b-bcca-4e17-805e-304df5f91a1e    4438    2022-11-27    ...
...

```

\pagebreak
