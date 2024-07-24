# UC 08: João Alves (1131510)

> Como administrador da organização quero que seja implementada uma gestão de
> acessos que satisfaça os critérios apropriados de segurança.

Os backups possuem informacões que devem ser somente acessíveis ao
administrador e, eventualmente, a membros de um grupo com permissão de acesso.

Criamos, portanto, um grupo específico para acesso aos backups, definindo o
dono e grupo do diretório de backups:

```
groupadd backup_managers
chown root:backup_managers /usr/share/backups
```

Definimos as permissões do diretório de forma que usários que não se encontrem
no grupo `backup_managers` não possam editar ficheiros do diretório (`write`),
entrar no diretório (`execute`), tampouco listar os ficheiros do diretório
(`read`). Usuários deste grupo podem, no entanto, entrar no diretório, listar,
e ler e editar os ficheiros, mas não remover o diretório. Isso é possível
através do uso do sticky bit:

```sh
chmod 1750 /usr/share/backups
```

Os ficheiros criados devem, no entanto, pertencer ao grupo `backup_managers`.
Para que isso ocorra, devemos correr o script de backup utilizando este grupo,
através da ferramneta `sg`, a partir da crontab do usuário root (ficheiro
_/var/spool/cron/crontabs/root_). Devemos também setar as permissões dos
ficheiros criados pelo script, setando a máscara do comando `umask 007`, de
forma a criar ficheiros com permissões 770.

```txt
0 0 * * * sg backup_managers -c 'umask 007; /root/backup.sh /usr/share/backups/diario'
0 0 * * 1 sg backup_managers -c 'umask 007; /root/backup.sh /usr/share/backups/semanal'
0 0 1 * * sg backup_managers -c 'umask 007; /root/backup.sh /usr/share/backups/mensal'
```

Dessa forma, obtemos as seguintes permissões:

```txt
root@vs757:/usr/share# ls -la backups/
drwxr-x--T 2 root backup_managers 4096  Dec 17 13:39 .
-rw-rw---- 1 root backup_managers 12661 Dec 17 13:28 railway_20221217.sql
```

\pagebreak
