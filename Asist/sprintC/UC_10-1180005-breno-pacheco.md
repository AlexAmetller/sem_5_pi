# UC 10: Breno Pacheco (1180005)

> Como administrador de sistemas quero que o administrador tenha um acesso SSH
> à maquina virtual, apenas por certificado, sem recurso a password.

É possível aceder ao servidor via protocolo secure-shell (_SSH_) utilizando,
por defeito, uma senha. O uso de senhas, no entanto, o mesmo não é seguro,
devendo ser criada um par de chaves criptográficas assimétricas para permitir
o acesso sem senhas. Comecamos por nos conectar ao servidor como _root_ e
criamos o par de chaves do tipo OpenSSH:

```sh
ssh root@vsgate-ssh.dei.isep.ipp.pt -p 10733 # conecta ao servidor
cd .ssh/                                     # cria par de chaves
ssh-keygen -t rsa -N "" -C "vs733" -f vs733  # vs733.public, vs733
```

A chave pública criada tem o seguinte formato:

```txt
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3XueLEw3TzWuZP ... vs733
```

E a chave privada:

```txt
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEAt17nixMN081rmT6tOl05WqfJtpDfQxSBdNInyBOxjMwWVaHTKdB+
```

Em sequência, adicionamos a chave pública criada à lista de chaves autorizadas
a autenticar como usuário `root`:

```sh
cat vs733.pub >> /root/.ssh/authorized_keys
```

Copiamos então a chave privada da VM para o nosso host e removemos a chave
privada da máquina, por seguranca:

```sh
scp root@vsgate-ssh.dei.isep.ipp.pt:/root/.ssh/vs757 \
  -P 10757 ~/.ssh/
ssh root@vsgate-ssh.dei.isep.ipp.pt -p 10757 "rm /root/.ssh/vs757"
```

É possível agora acessar o servidor usando a chave privada: 

```sh
ssh -i ~/.ssh/vs733 root@vsgate-ssh.dei.isep.ipp.pt -p 10733
```

Em seguida inibimos acesso com senha a qualquer usuário, desabilitando a flag
`PasswordAuthentication` do ficheiro de configuracão do servico sshd:

```sh
sed 's/^.*PasswordAuthentication yes/PasswordAuthentication no/' \
    -i /etc/ssh/sshd_config

```

Por fim, reiniciamos o serviço sshd para fazer valer a nova configuracao:
```sh
systemctl restart sshd.service
```

\pagebreak
