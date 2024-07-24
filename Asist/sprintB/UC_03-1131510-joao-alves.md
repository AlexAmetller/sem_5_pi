# UC 03: João Alves (1131510)

> Como administrador do sistema quero que os clientes indicados na user story
> 2 possam ser definidos pela simples alteração de um ficheiro de texto.

## Descrição da solução

No sistema Linux, existem os ficheiros __hosts.allow__ e __hosts.deny__, que
determinam a permissão ou rejeição de conexões, respetivamente. Funcionam
especificamente com serviços TCP, sendo possível definir regras para endereços
IP, domínios ou hostnames.
 
Quando há um pedido de conexão, o __hosts.allow__ é consultado para saber se a
conexão é permitida, e após isso o __hosts.deny__ é consultado para saber se é
especificada alguma regra que rejeite a conexão.
Sendo ambos os ficheiros constituídos por uma estrutura simples, podem ser
utilizados como solução para o problema descrito.

## Configuração a aplicar

Como já indicado na US2:

> Qualquer utilizador que esteja numa rede interna, diretamente ou por VPN,
> obtém um endereço num dos intervalos de endereços privados:
> - 10.0.0.0 a 10.255.255.255 (10.0.0.0 /8)
> - 172.16.0.0 a 172.31.255.255 (172.16.0.0 /12)
> - 192.168.0.0 a 192.168.255.255 (192.168.0.0 /16)

## Abrir o ficheiro com um editor de texto e sintaxe

```sh
# Editar as regras de permissão de conexão
$ sudo vim /etc/hosts.allow
# Editar as regras de rejeição de conexão
$ sudo vim /etc/hosts.deny 
```

Podemos definir as regras de seguinte forma

```sh
service : host/network
```

__service__ indica o nome do serviço/daemon ao qual a regra vai ser definida.
Exemplo: _sshd_ para o serviço de conexão via SSH. Também pode ser utilizado
um wildcard como ALL para cobertura de todos os serviços/daemons.
__host/network__ o endereço IP/domínio/hostname ao qual a regra irá ser
aplicada. Também podem ser utilizados wildcards

## Definir os intervalos de endereços privados

Neste caso, iremos editar o __hosts.allow__ com o seguinte contéudo

```sh
# ALL é um wildcard para todos os serviços no sistema 
ALL: 10.0.0.0 /8
ALL: 172.16.0.0 /12
ALL: 192.168.0.0 /16
```

E também no __hosts.deny__

```sh
# Aqui o wildcard ALL é utilizado para todos os serviços e host/networks
ALL: 
```

Assim quando é feita uma conexão, irá verificar o __hosts.allow__ e é
permitida automaticamente qualquer endereço IP dentro daquele intervalo, e
qualquer endereço que não esteja na lista, irá passar depois pelo
__hosts.deny__, onde o wildcard _ALL_ irá bloquear qualquer endereço que não
tenha passado pelo ficheiro anterior.

\pagebreak


