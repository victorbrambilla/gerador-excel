export interface FakerOption {
  key: string
  label: string
}

export const fakerOptionsList: FakerOption[] = [
  { key: "##ROW_INDEX##", label: "Número da Linha (ID Sequencial)" },
  { key: "string.uuid", label: "ID Único (UUID)" },
  { key: "person.fullName", label: "Pessoa: Nome Completo" },
  { key: "person.firstName", label: "Pessoa: Primeiro Nome" },
  { key: "person.lastName", label: "Pessoa: Sobrenome" },
  { key: "internet.email", label: "Contato: Email" },
  { key: "phone.number", label: "Contato: Telefone (Genérico)" },
  { key: "custom.phone_pt_BR", label: "Contato: Telefone (Brasil)" },
  { key: "custom.cpf", label: "Documento: CPF (Fictício Formatado)" },
  { key: "custom.cnpj", label: "Documento: CNPJ (Fictício Formatado)" },
  { key: "location.city", label: "Endereço: Cidade" },
  { key: "location.state", label: "Endereço: Estado" },
  { key: "location.streetAddress", label: "Endereço: Rua" },
  { key: "location.zipCode", label: "Endereço: CEP" },
  { key: "number.int", label: "Número: Inteiro" },
  { key: "number.float", label: "Número: Decimal" },
  { key: "date.past", label: "Data: Passada" },
  { key: "date.future", label: "Data: Futura" },
  { key: "date.recent", label: "Data: Recente" },
  { key: "custom.booleanSimNao", label: "Lógico: Sim/Não" },
  { key: "lorem.sentence", label: "Texto: Frase" },
  { key: "lorem.paragraph", label: "Texto: Parágrafo" },
  { key: "lorem.word", label: "Texto: Palavra" },
  { key: "company.name", label: "Empresa: Nome" },
  { key: "##EMPTY##", label: "Valor: Vazio" },
  { key: "##CUSTOM_VALUE##", label: "Valor Fixo (Personalizado)" },
  { key: "##RANDOM_OPTIONS##", label: "Valor Aleatório (Entre Opções)" },
]
