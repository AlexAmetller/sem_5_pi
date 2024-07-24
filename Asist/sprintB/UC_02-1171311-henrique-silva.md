# UC 02: Henrique Silva (1171311)

> Como administrador do sistema quero que apenas os clientes da rede interna
> do DEI (cablada ou via VPN) possam aceder à solução.

Qualquer utilizador que esteja numa rede interna, diretamente ou por VPN,
obtém um endereço num dos intervalos de endereços privados:

- 10.0.0.0 a 10.255.255.255 (10.0.0.0 /8)
- 172.16.0.0 a 172.31.255.255 (172.16.0.0 /12)
- 192.168.0.0 a 192.168.255.255 (192.168.0.0 /16)

Assim podemos limitar que o acesso à solução seja apenas de endereços destas
gamas com recurso ao sistema de controlo de tráfego **Netfilter** presente no
kernel Linux.

1. Eliminar todas as regras existentes no sistema (opcional)

        $ sudo iptables -F

2. Definir a política de cada cadeia built-in (INPUT, OUTPUT, FORWARD)

        $ sudo iptables -P INPUT ACCEPT
          -P FORWARD ACCEPT
          -P OUTPUT ACCEPT

3. Definir as regras por cadeia 
 INPUT - permitir todos os acessos provenientes de uma gama privada e excluir todos os outros (por segurança devemos só autorizar as que estejam a ser utilizadas pela intranet).
 
        $ sudo iptables -A INPUT -s 192.168.0.0/16 -j ACCEPT
        $ sudo iptables -A INPUT -s 172.16.0.0/12 -j ACCEPT
        $ sudo iptables -A INPUT -s 10.0.0.0/8 -j ACCEPT

*Nota: podemos limitar ainda o acesso por protocolo (-p {protocolo}) e/ou porta (--dport {porta})*

4. Tornar as regras persistentes
Para que as regras sejam persistentes é necessário que as mensmas seja salvas. Para isso podemos instalar o pacote de persistência *iptables-persistence*.
 
        $ sudo apt install iptables-persistence

    Salvar as regras com o comando

        $ sudo netfilter-persistent save

\pagebreak
