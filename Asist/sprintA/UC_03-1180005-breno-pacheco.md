# UC 03: Breno Pacheco (1180005) 

> Como administrador do sistema quero usar no sistema Linux o módulo PAM
> “pam_succeed_if.so” para condicionar o acesso ao sistema, permitindo acesso
> apenas aos utilizadores com UID inferior a 7000 e que pertençam ao grupo
> lasistgrupo.

Adicionar a seguinte configuracao ao ficheiro __/etc/pam.d/common-auth__, a
ser incluido nas configuracões de **Auth** nos ficheiros de configuracao dos
diversos servicos usando `@include common-auth`:

```
# Verifica auth usando /etc/passwd e /etc/shadow,
# pula pam_deny se sucesso.
auth [success=2 default=ignore] pam_unix.so nullok_secure
# Verifica auth usando LDAP, pula pam_deny se sucesso.
auth [success=1 default=ignore] pam_ldap.so
# Falha autenticacao.
auth requisite pam_deny.so

# Requer usuário com UID menor que 7000, falhando caso contrário.
auth requisite pam_succeed_if.so uid >= 2000
# Requer que o usuário pertenca ao grupo `lasistgrupo`, 
# falhando caso contrário.
auth requisite pam_succeed_if.so user ingroup lasistgrupo

# Autoriza autenticacao
auth required pam_permit.so
```


