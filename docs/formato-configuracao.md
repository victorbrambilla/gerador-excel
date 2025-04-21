# Documentação do Formato de Configuração de Planilhas Excel

Este documento descreve o formato JSON para configurar a geração de planilhas Excel com dados fictícios usando o nosso sistema.

## Formato Geral

A configuração é um array de objetos, onde cada objeto representa um modelo de planilha salvo.

```json
[
  {
    "name": "nome_do_modelo",
    "columns": [
      // definições de colunas
    ]
  }
]
```

## Propriedades do Modelo

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `name` | string | Nome do modelo de planilha |
| `columns` | array | Array de objetos definindo as colunas |

## Definição de Coluna

Cada coluna é representada por um objeto com as seguintes propriedades:

| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `id` | string | Sim | Identificador único da coluna (UUID) |
| `headerName` | string | Sim | Nome que aparecerá no cabeçalho da coluna |
| `fakerMappingKey` | string | Sim | Tipo de dado a ser gerado |
| `customValue` | string | Não | Utilizado apenas quando `fakerMappingKey` é `##CUSTOM_VALUE##` |
| `randomOptions` | string[] | Não | Utilizado apenas quando `fakerMappingKey` é `##RANDOM_OPTIONS##` |

## Tipos de Dados Disponíveis (`fakerMappingKey`)

### Valores Especiais

| Valor | Descrição | Propriedade Extra |
|-------|-----------|-------------------|
| `##ROW_INDEX##` | Número da Linha (ID Sequencial) | - |
| `##EMPTY##` | Valor Vazio | - |
| `##CUSTOM_VALUE##` | Valor Fixo Personalizado | Requer `customValue` |
| `##RANDOM_OPTIONS##` | Valor Aleatório entre Opções | Requer `randomOptions` |

### Dados Pessoais

| Valor | Descrição |
|-------|-----------|
| `person.fullName` | Pessoa: Nome Completo |
| `person.firstName` | Pessoa: Primeiro Nome |
| `person.lastName` | Pessoa: Sobrenome |

### Dados de Contato

| Valor | Descrição |
|-------|-----------|
| `internet.email` | Contato: Email |
| `phone.number` | Contato: Telefone (Genérico) |
| `custom.phone_pt_BR` | Contato: Telefone (Brasil) |

### Documentos

| Valor | Descrição |
|-------|-----------|
| `custom.cpf` | Documento: CPF (Fictício Formatado) |
| `custom.cnpj` | Documento: CNPJ (Fictício Formatado) |

### Endereço

| Valor | Descrição |
|-------|-----------|
| `location.city` | Endereço: Cidade |
| `location.state` | Endereço: Estado |
| `location.streetAddress` | Endereço: Rua |
| `location.zipCode` | Endereço: CEP |

### Números

| Valor | Descrição |
|-------|-----------|
| `number.int` | Número: Inteiro |
| `number.float` | Número: Decimal |

### Datas

| Valor | Descrição |
|-------|-----------|
| `date.past` | Data: Passada |
| `date.future` | Data: Futura |
| `date.recent` | Data: Recente |

### Outros Tipos de Dados

| Valor | Descrição |
|-------|-----------|
| `custom.booleanSimNao` | Lógico: Sim/Não |
| `lorem.sentence` | Texto: Frase |
| `lorem.paragraph` | Texto: Parágrafo |
| `lorem.word` | Texto: Palavra |
| `company.name` | Empresa: Nome |
| `string.uuid` | ID Único (UUID) |

## Exemplos

### Exemplo 1: Modelo Básico

```json
{
  "name": "Clientes",
  "columns": [
    {
      "id": "7997102f-7289-4253-9fcf-21388cc90c79",
      "headerName": "ID",
      "fakerMappingKey": "##ROW_INDEX##"
    },
    {
      "id": "8b946017-9d40-4f29-afb9-d7f4ed8f769c",
      "headerName": "Nome",
      "fakerMappingKey": "person.fullName"
    }
  ]
}
```

### Exemplo 2: Com Valor Personalizado

```json
{
  "name": "Funcionários",
  "columns": [
    {
      "id": "7997102f-7289-4253-9fcf-21388cc90c79",
      "headerName": "Empresa",
      "fakerMappingKey": "##CUSTOM_VALUE##",
      "customValue": "Empresa ABC Ltda."
    },
    {
      "id": "8b946017-9d40-4f29-afb9-d7f4ed8f769c",
      "headerName": "Nome",
      "fakerMappingKey": "person.fullName"
    }
  ]
}
```

### Exemplo 3: Com Valores Aleatórios Entre Opções

```json
{
  "name": "Dados Fiscais",
  "columns": [
    {
      "id": "0fc1aedd-269e-4f65-a021-afde6c829e33",
      "headerName": "Tipo de Cliente",
      "fakerMappingKey": "##RANDOM_OPTIONS##",
      "randomOptions": [
        "cpf",
        "cnpj",
        "cei"
      ]
    },
    {
      "id": "8b946017-9d40-4f29-afb9-d7f4ed8f769c",
      "headerName": "Nome",
      "fakerMappingKey": "person.fullName"
    }
  ]
}
```

### Exemplo 4: Modelo Completo

```json
{
  "name": "Pedidos",
  "columns": [
    {
      "id": "7997102f-7289-4253-9fcf-21388cc90c79",
      "headerName": "Número do Pedido",
      "fakerMappingKey": "##ROW_INDEX##"
    },
    {
      "id": "8b946017-9d40-4f29-afb9-d7f4ed8f769c",
      "headerName": "Cliente",
      "fakerMappingKey": "person.fullName"
    },
    {
      "id": "9a157028-0e51-5f3a-bfb0-e8f5ed8f760d",
      "headerName": "Documento",
      "fakerMappingKey": "custom.cpf"
    },
    {
      "id": "2fc2bedd-358f-6f76-b132-cfde7d939f44",
      "headerName": "Status",
      "fakerMappingKey": "##RANDOM_OPTIONS##",
      "randomOptions": [
        "Pendente",
        "Em processamento",
        "Enviado",
        "Entregue",
        "Cancelado"
      ]
    },
    {
      "id": "3d268017-8e50-5f39-bfc9-e7f6ed8f761e",
      "headerName": "Valor",
      "fakerMappingKey": "number.float"
    },
    {
      "id": "4e379128-9f61-6f49-cfd9-f8g6fe9g872f",
      "headerName": "Data do Pedido",
      "fakerMappingKey": "date.past"
    }
  ]
}
```

## Notas Importantes

1. O `id` deve ser um identificador único para cada coluna (UUID)
2. Quando usar `##CUSTOM_VALUE##`, certifique-se de fornecer o campo `customValue`
3. Quando usar `##RANDOM_OPTIONS##`, forneça um array de strings no campo `randomOptions`
4. Todos os valores gerados serão no formato brasileiro (pt-BR)

Esta documentação descreve todas as possibilidades de configuração disponíveis atualmente no sistema de geração de planilhas Excel.