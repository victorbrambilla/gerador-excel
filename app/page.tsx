import ExcelGeneratorForm from "@/components/ExcelGeneratorForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-2">Gerador de Planilhas Excel</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Crie, salve e gerencie facilmente seus modelos de planilhas com dados gerados automaticamente.</p>
        </div>

        {/* Renderiza o componente cliente que contém toda a lógica e UI interativa */}
        <ExcelGeneratorForm />

        <footer className="text-center text-gray-500 text-sm mt-10">
          <p>Gerador de Planilhas Excel © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  )
}