## Plano de testes

#### *[Task #10](https://bitbucket.org/1180005/sem_5_pi_g80/issues/10)* - Criar armazém

- **Módulo**:          Gestão de Armazém
- **Componente**:      Controller
- **Objetivo**:        Criar um novo Armazém
- **Método de teste**: Automático

| Cenário                             | Teste                   | Resultado esperado                 |
| ---                                 | ---                     | ---                                |
| Armazém já existe                   | criar_armazem_existente | 400 Bad request, recurso existente |
| Armazém não existe, dados inválidos | criar_armazem_invalido  | 400 Bad request, campos inválidos  |
| Armazém não existe, dados válidos   | criar_armazem_valido    | 200 OK armazém                     |
| Ocorre erro com o repositório       | criar_armazem_falha     | 500 Internal server error          |


#### *[Task #11](https://bitbucket.org/1180005/sem_5_pi_g80/issues/11)* - Editar armazém

- **Módulo**:          Gestão de Armazém
- **Componente**:      Controller
- **Objetivo**:        Editar um armazém existente
- **Método de teste**: Automático

| Cenário                             | Teste                      | Resultado esperado                 |
| ---                                 | ---                        | ---                                |
| Armazém não existe                  | editar_armazem_inexistente | 404 NotFound, recurso existente    |
| Armazém existe, dados inválidos     | editar_armazem_invalido    | 400 Bad request, campos inválidos  |
| Armazém existe, dados válidos       | editar_armazem_invalido    | 200 OK armazém                     |
| Ocorre erro com o repositório       | editar_armazem_falha       | 500 Internal server error          |

#### *[Task #12](https://bitbucket.org/1180005/sem_5_pi_g80/issues/12)* - Listar armazens

- **Módulo**:          Gestão de Armazém
- **Componente**:      Controller
- **Objetivo**:        Listar armazéns
- **Método de teste**: Automático

| Cenário                             | Teste                      | Resultado esperado                 |
| ---                                 | ---                        | ---                                |
| Lista-se todos os armazéns          | listar_armazens            | 200 OK lista de armazém            |
| Lista-se um armazém por id          | listar_armazem             | 200 OK armazém(id)                 |
| Lista-se um armazém inexistente     | listar_armazem_invalido    | 404 NotFound recurso existente     |
| Ocorre erro com o repositório       | editar_armazem_falha       | 500 Internal server error          |

#### *[Task #14](https://bitbucket.org/1180005/sem_5_pi_g80/issues/14* - Editar entrega

- **Módulo**:          Gestão de Armazém
- **Componente**:      Controller
- **Objetivo**:        Editar uma entrega existente
- **Método de teste**: Automático

| Cenário                             | Teste                      | Resultado esperado                 |
| ---                                 | ---                        | ---                                |
| Entrega não existe                  | editar_entrega_inexistente | 404 NotFound, recurso existente    |
| Entrega existe, dados inválidos     | editar_entrega_invalida    | 400 Bad request, campos inválidos  |
| Entrega existe, dados válidos       | editar_entrega_invalida    | 200 OK entrega                     |
| Ocorre erro com o repositório       | editar_entrega_falha       | 500 Internal server error          |