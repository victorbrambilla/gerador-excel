"use client"

import { useEffect, useState } from "react"
import type { ColumnDefinition, SavedConfig } from "@/lib/interfaces"
import { fakerOptionsList } from "@/lib/fakerMappings"
import ColumnDefinitionComponent from "@/components/column-definition"

// Chave usada para salvar configurações no localStorage
const STORAGE_KEY = "excelGeneratorConfigs"

export default function ExcelGeneratorForm() {
  // Estados
  const [columns, setColumns] = useState<ColumnDefinition[]>([])
  const [numberOfRows, setNumberOfRows] = useState<number>(100)
  const [configName, setConfigName] = useState<string>("")
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([])
  const [selectedConfig, setSelectedConfig] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
      // ex: return faker.phone.number('## #####-####');

  // Carregar configurações salvas do localStorage ao montar o componente
  useEffect(() => {
    try {
      const storedConfigs = localStorage.getItem(STORAGE_KEY)
      if (storedConfigs) {
        setSavedConfigs(JSON.parse(storedConfigs))
      }
    } catch (err) {
      console.error("Erro ao carregar configurações:", err)
      setError("Não foi possível carregar as configurações salvas.")
    }
  }, [])

  // Carregar configuração compartilhada via URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get("config");
    if (configParam) {
      try {
        const shared = JSON.parse(decodeURIComponent(configParam));
        if (shared.columns && Array.isArray(shared.columns)) {
          setColumns(shared.columns);
          setNumberOfRows(shared.numberOfRows || numberOfRows);
          setConfigName(shared.name || "");
          setSuccess("Configuração compartilhada carregada!");
          setTimeout(() => setSuccess(null), 3000);
          // Limpa o parâmetro da URL sem recarregar a página
          window.history.replaceState(null, "", window.location.pathname);
        } else {
          setError("Dados da configuração compartilhada inválidos.");
        }
      } catch {
        setError("Não foi possível carregar a configuração compartilhada (formato inválido).");
      }
    }
  }, [numberOfRows]); // Adicionado numberOfRows como dependência caso seja definido na URL

  // Adicionar nova coluna
  const addColumn = () => {
    const newColumn: ColumnDefinition = {
      id: crypto.randomUUID(),
      headerName: "",
      fakerMappingKey: fakerOptionsList[0].key,
    }
    setColumns([...columns, newColumn])
  }

  // Atualizar coluna existente
  const updateColumn = (id: string, updatedColumn: ColumnDefinition) => {
    setColumns(columns.map((col) => (col.id === id ? updatedColumn : col)))
  }

  // Remover coluna
  const removeColumn = (id: string) => {
    setColumns(columns.filter((col) => col.id !== id))
  }

  // Limpar erro
  const clearError = () => setError(null)

  // Salvar configuração atual
  const saveConfig = () => {
    setError(null); // Limpa erros anteriores
    setSuccess(null); // Limpa sucessos anteriores

    if (!configName.trim()) {
      setError("Por favor, insira um nome para a configuração.")
      return
    }

    if (columns.length === 0) {
      setError("Por favor, adicione pelo menos uma coluna.")
      return
    }

    if (columns.some((col) => !col.headerName.trim())) {
      setError("Por favor, preencha todos os nomes de cabeçalho.")
      return
    }

    try {
      const newConfig: SavedConfig = { name: configName.trim(), columns } // Trim no nome
      // Garante que não haja nomes duplicados (case-insensitive)
      const updatedConfigs = savedConfigs.filter(
        (config) => config.name.toLowerCase() !== configName.trim().toLowerCase()
      );
      updatedConfigs.push(newConfig); // Adiciona a nova ou atualizada

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs))
      setSavedConfigs(updatedConfigs)
      setSelectedConfig(configName.trim()) // Seleciona a configuração salva
      setSuccess("Configuração salva com sucesso!")

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Erro ao salvar configuração:", err)
      setError("Não foi possível salvar a configuração. Verifique o console para mais detalhes.")
    }
  }

  // Compartilhar configuração atual via URL
  const shareConfig = () => {
    setError(null);
    setSuccess(null);

    if (columns.length === 0) {
      setError("Por favor, adicione pelo menos uma coluna antes de compartilhar.");
      return;
    }
    if (columns.some((col) => !col.headerName.trim())) {
      setError("Por favor, preencha todos os nomes de cabeçalho antes de compartilhar.")
      return
    }

    const shared = { name: configName.trim() || "Configuração Compartilhada", columns, numberOfRows };
    try {
      const encoded = encodeURIComponent(JSON.stringify(shared));
      const url = `${window.location.origin}${window.location.pathname}?config=${encoded}`;
      navigator.clipboard.writeText(url)
        .then(() => {
          setSuccess("URL da configuração copiada para a área de transferência!");
          setTimeout(() => setSuccess(null), 3000);
        })
        .catch(() => {
          setError("Falha ao copiar a URL. Tente manualmente.");
        });
    } catch (err) {
      console.error("Erro ao criar URL de compartilhamento:", err);
      setError("Não foi possível gerar a URL de compartilhamento.");
    }
  };

  // Carregar configuração selecionada
  const loadConfig = () => {
    setError(null);
    setSuccess(null);

    if (!selectedConfig) {
      setError("Por favor, selecione uma configuração para carregar.")
      return
    }

    const config = savedConfigs.find((config) => config.name === selectedConfig)
    if (config) {
      setConfigName(config.name)
      // Garante que as colunas carregadas tenham IDs únicos, caso não tenham sido salvas com IDs
      setColumns(config.columns.map(col => ({ ...col, id: col.id || crypto.randomUUID() })));
      // Poderia carregar numberOfRows também se fosse salvo na config
      // setNumberOfRows(config.numberOfRows || 100);
      setSuccess("Configuração carregada com sucesso!")
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError("Configuração selecionada não encontrada.")
      setSelectedConfig(""); // Limpa a seleção se não encontrada
    }
  }

  // Excluir configuração selecionada
  const deleteConfig = () => {
    setError(null);
    setSuccess(null);

    if (!selectedConfig) {
      setError("Por favor, selecione uma configuração para excluir.")
      return
    }

    try {
      const updatedConfigs = savedConfigs.filter((config) => config.name !== selectedConfig)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs))
      setSavedConfigs(updatedConfigs)
      setSelectedConfig("") // Limpa a seleção
      setConfigName("") // Opcional: Limpa o nome também
      setColumns([]) // Opcional: Limpa as colunas também
      setSuccess("Configuração excluída com sucesso!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Erro ao excluir configuração:", err)
      setError("Não foi possível excluir a configuração.")
    }
  }

  // Criar nova configuração (limpar formulário)
  const newConfig = () => {
    setError(null);
    setSuccess(null);
    setConfigName("")
    setColumns([])
    setSelectedConfig("")
    setNumberOfRows(100); // Reseta para o valor padrão
    setSuccess("Formulário limpo. Pronto para nova configuração!");
    setTimeout(() => setSuccess(null), 3000);
  }

  // Gerar planilha Excel
  const generateExcel = async () => {
    setError(null);
    setSuccess(null);

    if (columns.length === 0) {
      setError("Por favor, adicione pelo menos uma coluna.")
      return
    }

    if (columns.some((col) => !col.headerName.trim())) {
      setError("Por favor, preencha todos os nomes de cabeçalho.")
      return
    }

    if (numberOfRows <= 0) {
      setError("O número de linhas deve ser maior que zero.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          columns,
          count: numberOfRows,
          configName: configName.trim() || "Configuração Compartilhada",
        }),
      })

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: ${response.statusText || "Erro desconhecido"}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // Se não for JSON, usa a mensagem padrão
          console.warn("Resposta de erro não é JSON:", await response.text());
        }
        throw new Error(errorMessage)
      }

      const blob = await response.blob()
      let filename = "dados_gerados.xlsx"
      const contentDisposition = response.headers.get("Content-Disposition")
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1]
        }
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setSuccess("Planilha gerada com sucesso!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Erro ao gerar Excel:", err)
      setError(err instanceof Error ? err.message : "Erro ao gerar a planilha Excel.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Mensagens de erro e sucesso */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm relative">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <strong className="font-medium">Erro!</strong>
            <span className="ml-2">{error}</span>
          </div>
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={clearError}>
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 shadow-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <strong className="font-medium">Sucesso!</strong>
            <span className="ml-2">{success}</span>
          </div>
        </div>
      )}

      {/* Gerenciamento de configurações */}
      <div className="bg-white p-8 rounded-xl shadow-md mb-6 border border-gray-100 transition-all hover:shadow-lg">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Configurações</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label htmlFor="configName" className="block text-sm font-medium text-gray-700 mb-2">Nome da Configuração</label>
            <input
              id="configName"
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Digite um nome para a configuração"
            />
          </div>

          <div>
            <label htmlFor="savedConfigs" className="block text-sm font-medium text-gray-700 mb-2">Configurações Salvas</label>
            <select
              id="savedConfigs"
              value={selectedConfig}
              onChange={(e) => setSelectedConfig(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
              disabled={savedConfigs.length === 0}
            >
              <option value="">{savedConfigs.length === 0 ? "Nenhuma configuração salva" : "Selecione uma configuração"}</option>
              {savedConfigs.map((config) => (
                <option key={config.name} value={config.name}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={loadConfig}
                disabled={!selectedConfig || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Carregar
              </button>
              <button
                onClick={saveConfig}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Salvar
              </button>
              <button
                onClick={deleteConfig}
                disabled={!selectedConfig || isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Excluir
              </button>
              <button
                onClick={newConfig}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors shadow-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nova
              </button>
              <button
                onClick={shareConfig}
                disabled={isLoading || columns.length === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors shadow-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Definição de colunas */}
      <div className="bg-white p-8 rounded-xl shadow-md mb-6 border border-gray-100 transition-all hover:shadow-lg">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Definição de Colunas</h2>
        </div>

        {columns.length === 0 ? (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 mb-4">Nenhuma coluna definida. Clique em "Adicionar Cabeçalho" para começar.</p>
          </div>
        ) : (
          <div className="mb-6 space-y-4">
            {columns.map((column) => (
              <ColumnDefinitionComponent
                key={column.id}
                column={column}
                onUpdate={(updatedColumn) => updateColumn(column.id, updatedColumn)}
                onRemove={() => removeColumn(column.id)}
              />
            ))}
          </div>
        )}

        <button
          onClick={addColumn}
          disabled={isLoading}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Adicionar Cabeçalho
        </button>
      </div>

      {/* Geração da planilha */}
      <div className="bg-white p-8 rounded-xl shadow-md mb-6 border border-gray-100 transition-all hover:shadow-lg">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-green-100 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Geração da Planilha</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="numberOfRows" className="block text-sm font-medium text-gray-700 mb-2">Número de Linhas</label>
            <div className="relative">
              <input
                id="numberOfRows"
                type="number"
                min="1"
                value={numberOfRows}
                onChange={(e) => setNumberOfRows(Math.max(1, Number.parseInt(e.target.value, 10) || 1))} // Garante que seja pelo menos 1
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pl-10"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateExcel}
              disabled={isLoading || columns.length === 0}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Gerando...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Gerar Planilha</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}