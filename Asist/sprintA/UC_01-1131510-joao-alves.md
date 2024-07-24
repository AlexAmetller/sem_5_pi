# UC 01: João Alves (1131510)

> Como administrador do sistema quero alterar a informação apresentada no
> terminal do sistema Linux antes de me autenticar, alterando a informação por
> omissão por uma mais criativa que contenha obrigatoriamente a data e o número
> de utilizadores ativos.

No sistema Linux, os passos efetuados pelo login Shell são:

1. Mostrar o conteúdo de /etc/issue  
2. Perguntar pelas credenciais, username e password  
3. Mostrar a Mensagem do Dia contida em:  
  + a) __/etc/motd__  
  + b) __/etc/update-motd.d__  
4. Iniciar a Shell do utilizador em __/etc/profile__ e __~/.bash_profile__

O ficheiro __/etc/issue__ é um ficheiro de texto que contém uma mensagem ou
sistema de identificação a ser imprimida antes de o utilizador autenticar-se no
sistema. Pode conter sequências `@char` e `\char`, como por exemplo:

```
\d : inserir a data atual.
\t : inserir o tempo atual.
\s : inserir o nome do sistema, e o nome do sistema operativo.
\o : inserir o nome de dominío do sistema.
\u : inserir o número de utilizadores atualmente autenticados no sistema.
```

Assim sendo, de forma a alterar a mensagem antes da autenticação, alteramos o
conteúdo do ficheiro __/etc/issue__ para o conteúdo fixo pretendido que seja
apresentado, por exemplo a data e o número de utilizadores ativos.

```sh
$ sudo nano /etc/issue
```

Por exemplo:
```
Bem-vindo à máquina do Grupo 80
\d
Utilizadores autenticados: \u
Por favor, autentique-se
```
