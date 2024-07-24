# UC 02: Henrique Silva (1171311)

> Como administrador do sistema quero alterar a informação apresentada no
> terminal do sistema Linux após me autenticar, alterando a informação por
> omissão por uma mais criativa que contenha obrigatoriamente a data e o nome
> do utilizador.

No sistema Linux, os passos efetuados pelo login Shell são:

1. Mostrar o conteúdo de /etc/issue  
2. Perguntar pelas credenciais, username e password  
3. Mostrar a Mensagem do Dia contida em:  
  + a) __/etc/motd__  
  + b) __/etc/update-motd.d__  
4. Iniciar a Shell do utilizador em __/etc/profile__ e __~/.bash_profile__

Assim sendo, de forma a alterar a mensagem após autenticação, tenho de mudar o
conteúdo do ficheiro __/etc/motd__ para o conteúdo fixo que pretendo que seja
apresentado, por exemplo um banner.

```sh
$ sudo nano /etc/motd
```

Por exemplo:
```
	$  __  __  __      __     __   __  
	$ / _ |__)/  \/  \|__)   (__) /  \ 
	$ \__)| \ \__/\__/|      (__) \__/ 
 	$                                           
```
 
Para que seja apresentado conteúdo dinâmico, como username e a data, temos que
criar um script em /etc/update-motd.d. O nome deste script tem de começar por
XX-NOME_DO_SCRIPT em que XX são 2 algarismos. O ficheiro não deve de conter
extensão.

```sh
$ sudo nano /etc/update-motd.d/99-myscript
```

Escrever o script na linguagem que preferirmos e que o sistema consiga correr,
por exemplo em bash

```sh
$ #!/bin/bash
$ u=$(whoami)
$ now=$(date)
$ echo "Welcome back $u. Today is $now"
```
 
Tornar executavel
 
```sh
$ chmod +x /etc/update-motd.d/99-myscript
```
 
Devemos também desativar ou apagar todos os script que estejam no diretório
__/etc/update-motd.d__ que não pretendemos que corram

```sh
$ chmod -x nome_do_script
```
