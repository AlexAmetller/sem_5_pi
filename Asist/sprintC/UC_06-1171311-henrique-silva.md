# UC 06: Henrique Silva (1171311)

> Como administrador de sistemas quero que a cópia de segurança da US C3 tenha
> um tempo de vida não superior a 7 (sete) dias exceto no indicado na US C4.

Para garantir que não existe cópias de seguranca com mais de 7 dias de vida,
criamos um script _backup_cleanup.sh_. Este procura por arquivos `sql` no
diretório de _backups_ criados a mais de 7 dias, removendo os mesmos:


```sh
#!/usr/bin/env bash
# diretório dos backups é passado como parâmetro
DIR=${1:-/usr/share/backups/}

find $DIR -type f -mtime +7 -name '*.sql' -execdir rm -- '{}' \;
```

Explicacão do comando:

* `find`: comando do coreutils para encontrar ficheiros/diretórios/links  
* `$DIR`: o diretório onde pretendemos encontrar os ficheiros  
* `-type f`: procura somente por ficheiros, ignorando outros tipos de `inodes`  
* `-name '*.sql'`: filtra os resultados por ficheiros `sql`  
* `-ctime +7`: seleciona ficheiros com última modificacão do `inode` há mais
  de 7 dias. Ou seja, ficheiros cuja criacão foi feita há mais de 7 dias.  
* `-execdir`: para cada resultado encontrado, execute o seguinte comando  
* `rm -- '{}'`: remove o ficheiro, substituindo `{}` pelo nome do ficheiro  


Desejamos executar esse script de limpeza de forma frequente. Para isso,
criamos um `cronjob` que corre __todos os dias__ realizando a limpeza.

Editamos o ficheiro _/var/spool/cron/crontabs/root_, adicionando a seguinte
linha:

```txt
0 0 * * * /root/backup_cleanup.sh
```

\pagebreak
