"use client"

import React, { useState, useEffect } from "react"
import type { ColumnDefinition } from "@/lib/interfaces"
import { fakerOptionsList } from "@/lib/fakerMappings"

interface ColumnDefinitionProps {
  column: ColumnDefinition
  onUpdate: (column: ColumnDefinition) => void
  onRemove: () => void
}

export default function ColumnDefinitionComponent({
  column,
  onUpdate,
  onRemove,
}: ColumnDefinitionProps) {
  // Estado local para o valor personalizado
  const [customValueInput, setCustomValueInput] = useState<string>(
    column.customValue || "",
  )

  // Efeito para atualizar o estado local se a coluna mudar externamente
  useEffect(() => {
    setCustomValueInput(column.customValue || "")
  }, [column.customValue])

  const handleHeaderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...column, headerName: e.target.value })
  }

  const handleFakerMappingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newKey = e.target.value
    // Limpa o valor personalizado se a opção mudar para algo que não seja custom
    const updatedColumn = {
      ...column,
      fakerMappingKey: newKey,
      customValue: newKey === "##CUSTOM_VALUE##" ? column.customValue : undefined,
    }
    onUpdate(updatedColumn)
  }

  // Handler para o input de valor personalizado
  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomValueInput(value) // Atualiza o estado local imediatamente
    onUpdate({ ...column, customValue: value })
  }

  return (
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-wrap gap-4 items-start">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor={`header-name-${column.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Cabeçalho
          </label>
          <div className="relative">
            <input
              type="text"
              id={`header-name-${column.id}`}
              value={column.headerName}
              onChange={handleHeaderNameChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                         transition-colors pl-9"
              placeholder="Digite o nome do cabeçalho"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label htmlFor={`faker-mapping-${column.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Dado
          </label>
          <div className="relative">
            <select
              id={`faker-mapping-${column.id}`}
              value={column.fakerMappingKey}
              onChange={handleFakerMappingChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                         transition-colors appearance-none bg-white pl-9"
            >
              {fakerOptionsList.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {column.fakerMappingKey === "##CUSTOM_VALUE##" && (
          <div className="flex-1 min-w-[200px]">
            <label htmlFor={`custom-value-${column.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Valor Fixo
            </label>
            <div className="relative">
              <input
                type="text"
                id={`custom-value-${column.id}`}
                value={customValueInput}
                onChange={handleCustomValueChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                           transition-colors pl-9"
                placeholder="Digite o valor fixo desejado"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-end pt-6">
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-sm flex items-center"
            aria-label="Remover coluna"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
