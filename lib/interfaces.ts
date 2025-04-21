export interface ColumnDefinition {
  id: string
  headerName: string
  fakerMappingKey: string
  customValue?: string // Campo opcional para valor personalizado
}

export interface SavedConfig {
  name: string
  columns: ColumnDefinition[]
}
