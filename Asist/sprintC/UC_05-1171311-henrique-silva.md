# UC 05: Henrique Silva (1171311)

> Como administrador de sistemas quero que o processo da US C3 seja mantido no
> log do Linux, num contexto adequado, e alertado o administrador no acesso à
> consola se ocorrer uma falha grave neste processo.

O padrão `syslog` de log de mensagens no Linux é utilizado para guardar os
logs do script de backup da base de dados. Para isso, precisaé necessário 
garantir que o `daemon` de syslog do Ubuntu está instalado e o servico
ativo:

```sh
apt-get install rsyslog
service enable rsyslog
service start rsyslog
```

O script de backup regista no log as informações:
* informação de inicio do backup
* informação de fim do backup
* resultado final do backup
* erros surgidos durante o backup

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
LOGFILE="${DIR}/backup.log"

# cria o diretório onde serão colocados os backups
test -d $DIR || mkdir -p $DIR 

# log do início do backup (ver /var/log/syslog)
logger "$0[$SESSION]: Creating database backup: ${BACKUP}" \
    "- HOST: $HOST:$PORT, USER: $USER"

# cria um arquivo temporáro para guardar os erros
ERRFILE=$(mktemp)

PGPASSWORD=******************** pg_dump \
	--no-owner \
	-h $HOST \
	-p $PORT \
	-U $USER \
	$DATABASE > $BACKUP 2>"$ERRFILE"

# verifica o exit status do comando pg_dump e escreve no log o fim do backup
if [[ $? -eq 0 ]]; then
	logger "$0[$SESSION]: Database backup $BACKUP created successfully."
	exit 0
else
	logger "$0[$SESSION]: Error creating backup. See error file: $ERRFILE"
	echo "[$(date +"%d-%m-%Y:%Hh%mm%Ss")] Error creating backup $BACKUP" \
        "- $(cat $ERRFILE)" >> $LOGFILE
	exit 1
fi
```

Os logs gerados durante a execucão do script podem ser consultados no 
ficheiro _/var/log/syslog_, junto de outros logs do sistema:

```sh
root@vs757:~# tail -f /var/log/syslog
Dec 17 10:39:43 vs757 systemd[1]: Started Session 26140 of user root.
Dec 17 11:25:00 vs757 root: ./backup.sh[18075]: Creating database backup:
  /usr/share/backups/railway_20221217.sql - 
  HOST: containers-us-west-83.railway.app:5602, USER: postgres
Dec 17 11:25:04 vs757 root: ./backup.sh[18075]: Error creating backup. 
  See error file: /usr/share/backups/backup.log
```
De forma a que o administrador seja alertado alertado de qualquer falha no processo de backup, 
foi criado o ficheiro _/root/.ssh/rc_, que é carregado pela _shell_ do adminisstrador
quando acessa a consola via _SSH_, com o seguinte conteúdo:

```sh
echo "\n======================== Backup error log ============================"
cat ~/backups/backup.log
echo "\n"
```

Desta forma, quando o administrador logacessa via _SSH_ o sistema, são
apresentadas as mensagens de erro de backup, por exemplo:

```txt

======================== Backup error log ============================
[17-12-2022:11h12m18s] Error creating backup 
  /usr/share/backups/railway_20221217.sql - pg_dump: terminated by user
```

\pagebreak
