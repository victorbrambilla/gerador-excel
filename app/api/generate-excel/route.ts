import { type NextRequest, NextResponse } from "next/server"
import { Workbook } from "exceljs"
import { Faker, pt_BR } from "@faker-js/faker"
import type { ColumnDefinition } from "@/lib/interfaces"
import { generateValue } from "@/lib/fakerUtils"

export async function POST(request: NextRequest) {
  try {
    // Extrair dados da requisição
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: "Formato de requisição inválido. Verifique se o corpo da requisição é um JSON válido." },
        { status: 400 },
      )
    }

    const { columns, count, configName } = body

    // Validar dados
    if (!columns || !Array.isArray(columns) || !count || count <= 0) {
      return NextResponse.json(
        { error: "Dados inválidos. Verifique as colunas e a quantidade de linhas." },
        { status: 400 },
      )
    }

    // Instanciar Faker com locale pt_BR
    const faker = new Faker({
      locale: [pt_BR],
    })

    // Criar um novo workbook e worksheet
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet("Dados Gerados")

    // Extrair nomes dos cabeçalhos
    const headers = columns.map((col: ColumnDefinition) => col.headerName)

    // Adicionar linha de cabeçalho
    worksheet.addRow(headers)

    // Estilizar cabeçalhos (opcional)
    worksheet.getRow(1).font = { bold: true }

    // Gerar linhas de dados
    for (let rowIndex = 0; rowIndex < count; rowIndex++) {
      const rowData = columns.map((column: ColumnDefinition) => generateValue(faker, column, rowIndex)) // Correção: Passar o objeto 'column' completo
      worksheet.addRow(rowData)
    }

    // Ajustar largura das colunas automaticamente
    worksheet.columns.forEach((column) => {
      column.width = Math.max(15, (column.header?.length || 0) + 2)
    })

    // Escrever para buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Criar nome do arquivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `${configName}_${timestamp}.xlsx`

    // Retornar resposta com o buffer do Excel
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Erro ao gerar Excel:", error)

    // Garantir que a resposta de erro seja sempre JSON válido
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Ocorreu um erro ao gerar a planilha Excel.",
      },
      { status: 500 },
    )
  }
}
