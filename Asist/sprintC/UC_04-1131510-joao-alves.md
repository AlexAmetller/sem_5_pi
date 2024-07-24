# UC 04: João Alves (1131510)

> Como administrador de sistemas quero que utilizando o Backup elaborado na US
> C3, seja criado um script quer faça a gestão dos ficheiros resultantes desse
> backup, no seguinte calendário. 1 Backup por mês no último ano, 1 backup por
> semana no último mês, 1 backup por dia na última semana.

Utilizaremos a ferramenta `cron` de agendamento de tarefas para programar o
calendário de backups. Para tanto, devemos incialmente instalar a ferramenta e
habilitar o servico `cron`:

```sh
sudo apt update
sudo apt install cron
sudo systemctl enable cron
```

Deseja-se gerar os seguintes backups:

1. 1 backup por mês
2. 1 backup por semana
3. 1 backup por dia

Podemos então definir as tarefas relacionadas ao usuário `root` que devem ser
executadas, editando o ficheiro _/var/spool/cron/crontabs/root_ e adicionando
a instrucão de executar a script de backup uma vez por dia, uma vez por semana
e uma vez por mês:

```txt
0 0 * * * /root/backup.sh /usr/share/backups/diario
0 0 * * 1 /root/backup.sh /usr/share/backups/semanal
0 0 1 * * /root/backup.sh /usr/share/backups/mensal
```

Explicacão:

- Especificamos quando o comando deve ser corrido através do seguinte padrão
  `<minuto> <hora> <dia do mês> <mês> <dia da semana> <commando>`
- O padrão `0 0 * * *` especifica todo dia do mes, todos os meses, todos os
  dias da semana, às 00:00h.
- O padrão `0 0 * * 1` especifica todo dia do mês, todos os meses, na
  segunda-feria, às 00:00h.
- O padrão `0 0 1 * *` especifica todo dia 1 do mês, todos os meses, todos os
  dias da semana, às 00:00h.

\pagebreak
