import type { Faker } from "@faker-js/faker"
import { ColumnDefinition } from "./interfaces"

// Função para gerar CPF formatado
export function generateFakeCpf(faker: Faker): string {
  const numbers = Array.from({ length: 9 }, () => faker.number.int(9))

  // Cálculo do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += numbers[i] * (10 - i)
  }
  const firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  // Cálculo do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 9; i++) {
    sum += numbers[i] * (11 - i)
  }
  sum += firstDigit * 2
  const secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  // Formatação do CPF
  return `${numbers[0]}${numbers[1]}${numbers[2]}.${numbers[3]}${numbers[4]}${numbers[5]}.${numbers[6]}${numbers[7]}${numbers[8]}-${firstDigit}${secondDigit}`
}

// Função para gerar CNPJ formatado
export function generateFakeCnpj(faker: Faker): string {
  const numbers = Array.from({ length: 12 }, () => faker.number.int(9))

  // Cálculo do primeiro dígito verificador
  let sum = 0
  let weight = 5
  for (let i = 0; i < 12; i++) {
    sum += numbers[i] * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  const firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  // Cálculo do segundo dígito verificador
  sum = 0
  weight = 6
  for (let i = 0; i < 12; i++) {
    sum += numbers[i] * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  sum += firstDigit * 2
  const secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  // Formatação do CNPJ
  return `${numbers[0]}${numbers[1]}.${numbers[2]}${numbers[3]}${numbers[4]}.${numbers[5]}${numbers[6]}${numbers[7]}/${numbers[8]}${numbers[9]}${numbers[10]}${numbers[11]}-${firstDigit}${secondDigit}`
}

// Função principal para gerar valores baseados na chave de mapeamento
export function generateValue(
  faker: Faker,
  column: ColumnDefinition, // Alterado para receber o objeto ColumnDefinition completo
  rowIndex: number,
): any {
  const { fakerMappingKey, customValue } = column // Desestruturar para obter a chave e o valor personalizado

  try {
    // Casos especiais
    if (fakerMappingKey === "##ROW_INDEX##") {
      return rowIndex + 1
    }

    if (fakerMappingKey === "##EMPTY##") {
      return ""
    }

    // Caso para valor personalizado
    if (fakerMappingKey === "##CUSTOM_VALUE##") {
      return customValue !== undefined ? customValue : "" // Retorna o valor personalizado ou vazio se não definido
    }

    // Casos customizados
    if (fakerMappingKey === "custom.cpf") {
      return generateFakeCpf(faker)
    }

    if (fakerMappingKey === "custom.cnpj") {
      return generateFakeCnpj(faker)
    }

    if (fakerMappingKey === "custom.phone_pt_BR") {
      return faker.phone.number()
    }

    if (fakerMappingKey === "custom.booleanSimNao") {
      return faker.datatype && typeof faker.datatype.boolean === "function"
        ? faker.datatype.boolean()
          ? "Sim"
          : "Não"
        : Math.random() > 0.5
          ? "Sim"
          : "Não" // Fallback se datatype.boolean não existir
    }

    // Mapeamento direto para métodos do Faker
    const [namespace, method] = fakerMappingKey.split(".")

    // Verificar se o namespace existe
    if (!faker[namespace]) {
      console.warn(`Namespace '${namespace}' não encontrado no Faker`)
      return ""
    }

    // Verificar se o método existe
    if (typeof faker[namespace][method] !== "function") {
      console.warn(`Método '${method}' não encontrado no namespace '${namespace}' do Faker`)
      return ""
    }

    // Chamar o método do Faker
    return faker[namespace][method]()
  } catch (error) {
    console.error(`Erro ao gerar valor para ${fakerMappingKey}:`, error)
    return "" // Retornar string vazia em caso de erro
  }
}
