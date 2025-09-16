'use client'
import { useState, useEffect } from 'react'

interface Comodo {
  id: number
  nome: string
}

interface Imovel {
  id: number
  nome: string
  endereco: string
  descricao?: string
  dataCompra?: string
  comodos: Comodo[]
}

export default function Home() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [nomeImovel, setNomeImovel] = useState('')
  const [enderecoImovel, setEnderecoImovel] = useState('')
  const [nomeComodo, setNomeComodo] = useState('')
  const [imovelSelecionado, setImovelSelecionado] = useState<number | null>(null)
  const [editImovelId, setEditImovelId] = useState<number | null>(null)
  const [editComodoId, setEditComodoId] = useState<number | null>(null)
  const [editNomeImovel, setEditNomeImovel] = useState('')
  const [editEnderecoImovel, setEditEnderecoImovel] = useState('')
  const [editDescricao, setEditDescricao] = useState('')
  const [editNomeComodo, setEditNomeComodo] = useState('')

  // Buscar imóveis
  const fetchImoveis = async () => {
    try {
      const res = await fetch('http://localhost:3000/imovel')
      const data = await res.json()
      setImoveis(data)
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error)
    }
  }

  useEffect(() => { fetchImoveis() }, [])

  // Criar imóvel
  const handleCreateImovel = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('http://localhost:3000/imovel/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nomeImovel,
        endereco: enderecoImovel,
        descricao: 'Sem descrição',
        dataCompra: new Date().toISOString(),
      }),
    })
    setNomeImovel('')
    setEnderecoImovel('')
    fetchImoveis()
  }

  // Adicionar cômodo
  const handleAddComodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (imovelSelecionado === null) return
    await fetch(`http://localhost:3000/imovel/${imovelSelecionado}/comodo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nomeComodo }),
    })
    setNomeComodo('')
    fetchImoveis()
  }

  // Apagar imóvel
  const handleDeleteImovel = async (id: number) => {
    await fetch(`http://localhost:3000/imovel/${id}`, { method: 'DELETE' })
    fetchImoveis()
  }

  // Apagar cômodo
  const handleDeleteComodo = async (id: number) => {
    await fetch(`http://localhost:3000/comodo/${id}`, { method: 'DELETE' })
    fetchImoveis()
  }

  // Editar imóvel
  const handleEditImovel = (imovel: Imovel) => {
    setEditImovelId(imovel.id)
    setEditNomeImovel(imovel.nome)
    setEditEnderecoImovel(imovel.endereco)
    setEditDescricao(imovel.descricao || '')
  }

  const handleSaveImovel = async (id: number) => {
    await fetch(`http://localhost:3000/imovel/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: editNomeImovel,
        endereco: editEnderecoImovel,
        descricao: editDescricao,
      }),
    })
    setEditImovelId(null)
    fetchImoveis()
  }

  // Editar cômodo
  const handleEditComodo = (c: Comodo) => {
    setEditComodoId(c.id)
    setEditNomeComodo(c.nome)
  }

  const handleSaveComodo = async (id: number) => {
    await fetch(`http://localhost:3000/comodo/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: editNomeComodo }),
    })
    setEditComodoId(null)
    fetchImoveis()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Imóveis</h1>

      {/* Criar Imóvel */}
      <form onSubmit={handleCreateImovel} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nome do imóvel"
          value={nomeImovel}
          onChange={(e) => setNomeImovel(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
        <input
          type="text"
          placeholder="Endereço"
          value={enderecoImovel}
          onChange={(e) => setEnderecoImovel(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded">Criar</button>
      </form>

      {/* Lista de imóveis */}
      <ul className="space-y-6">
        {imoveis.map((imovel) => (
          <li key={imovel.id} className="border p-4 rounded flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                {editImovelId === imovel.id ? (
                  <>
                    <input
                      type="text"
                      value={editNomeImovel}
                      onChange={(e) => setEditNomeImovel(e.target.value)}
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      value={editEnderecoImovel}
                      onChange={(e) => setEditEnderecoImovel(e.target.value)}
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      value={editDescricao}
                      onChange={(e) => setEditDescricao(e.target.value)}
                      className="border p-1 rounded"
                    />
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mt-1"
                      onClick={() => handleSaveImovel(imovel.id)}
                    >
                      Salvar
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{imovel.nome}</h2>
                    <p>{imovel.endereco}</p>
                    <p className="italic text-gray-500">{imovel.descricao}</p>
                    <p className="text-sm text-gray-400">
                      Comprado em: {new Date(imovel.dataCompra!).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteImovel(imovel.id)}
                >
                  Apagar
                </button>
                {editImovelId !== imovel.id && (
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEditImovel(imovel)}
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>

            {/* Lista de cômodos */}
            <p className="mt-2 font-semibold">Cômodos:</p>
            <ul className="ml-4 space-y-1">
              {imovel.comodos.map((c) => (
                <li key={c.id} className="flex justify-between items-center gap-2">
                  {editComodoId === c.id ? (
                    <>
                      <input
                        type="text"
                        value={editNomeComodo}
                        onChange={(e) => setEditNomeComodo(e.target.value)}
                        className="border p-1 rounded flex-1"
                      />
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => handleSaveComodo(c.id)}
                      >
                        Salvar
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{c.nome}</span>
                      <div className="flex gap-1">
                        <button
                          className="bg-red-400 text-white px-2 py-1 rounded"
                          onClick={() => handleDeleteComodo(c.id)}
                        >
                          X
                        </button>
                        <button
                          className="bg-yellow-400 text-white px-2 py-1 rounded"
                          onClick={() => handleEditComodo(c)}
                        >
                          Editar
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {/* Adicionar cômodo */}
            <form onSubmit={handleAddComodo} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Novo cômodo"
                value={imovelSelecionado === imovel.id ? nomeComodo : ''}
                onChange={(e) => {
                  setImovelSelecionado(imovel.id)
                  setNomeComodo(e.target.value)
                }}
                className="border p-2 rounded flex-1"
                required
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Adicionar</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}
