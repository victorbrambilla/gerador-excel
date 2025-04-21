export interface ColumnDefinition {
  id: string
  headerName: string
  fakerMappingKey: string
  customValue?: string // Campo opcional para valor personalizado
  randomOptions?: string[] // Novo campo para opções aleatórias
}

export interface SavedConfig {
  name: string
  columns: ColumnDefinition[]
}
