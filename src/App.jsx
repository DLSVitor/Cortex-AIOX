import { useState, useEffect } from 'react'
import { useStorage } from './useStorage'

export default function App() {
  const { prompts, savePrompt, deletePrompt } = useStorage();
  const [activePromptId, setActivePromptId] = useState(null);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({ title: '', tags: '', content: '' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activePromptId) {
      const p = prompts.find(p => p.id === activePromptId);
      if (p) setFormData(p);
    } else {
      setFormData({ title: '', tags: '', content: '' });
    }
  }, [activePromptId, prompts]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    savePrompt(formData);
    if (!formData.id) {
      // If it's a new prompt, we let the hook assign the ID.
      // To immediately select it, we could return the new ID from savePrompt,
      // but for simplicity, we clear the form to add another.
      setFormData({ title: '', tags: '', content: '' });
    }
  };

  const handleDelete = () => {
    if (activePromptId) {
      deletePrompt(activePromptId);
      setActivePromptId(null);
    }
  };

  const handleCopy = () => {
    if (!formData.content) return;
    navigator.clipboard.writeText(formData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.tags.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-vantablack">
      {/* Sidebar */}
      <aside className="w-[350px] bg-vantablack border-r border-gold-dim flex flex-col h-screen sticky top-0 overflow-hidden">
        <div className="p-6 border-b border-gold-dim">
          <h1 className="text-gold-muted uppercase tracking-executiveWide font-light text-xl mb-6">
            Córtex Central
          </h1>
          <button 
            onClick={() => setActivePromptId(null)}
            className="btn-gold w-full mb-6"
          >
            [ + Novo Prompt ]
          </button>
          
          <div className="relative">
            <span className="input-label">Busca de Arquivos</span>
            <input 
              type="text" 
              placeholder="FILTRAR..."
              className="input-executive"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {filteredPrompts.length === 0 ? (
            <p className="text-gray-500 text-xs uppercase tracking-executive">Nenhum registro encontrado.</p>
          ) : (
            filteredPrompts.map(prompt => (
              <div 
                key={prompt.id}
                onClick={() => setActivePromptId(prompt.id)}
                className={`card-prompt ${activePromptId === prompt.id ? 'border-gold-bright bg-[#0c0c0c]' : ''}`}
              >
                <h3 className="text-gold-bright text-sm uppercase tracking-executive mb-2">{prompt.title}</h3>
                <div className="text-xs text-gray-500 uppercase tracking-executive">
                  {prompt.tags ? prompt.tags.split(',').map(t => `[${t.trim()}] `) : 'SEM TAGS'}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Editor Central */}
      <main className="flex-1 bg-[#050505] p-12 flex flex-col h-screen overflow-y-auto">
        <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
          <header className="flex justify-between items-end border-b border-gold-dim pb-4 mb-8">
            <h2 className="text-gold-muted text-2xl uppercase tracking-executiveWide font-light">
              {activePromptId ? 'Modo Edição' : 'Novo Registro'}
            </h2>
            <div className="flex gap-4">
              {activePromptId && (
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 text-xs uppercase tracking-executiveWide transition-colors">
                  Deletar
                </button>
              )}
              {activePromptId && (
                <button onClick={handleCopy} className="btn-gold">
                  {copied ? '[ Copiado! ]' : '[ Copiar Prompt ]'}
                </button>
              )}
            </div>
          </header>

          <form onSubmit={handleSave} className="flex-1 flex flex-col gap-8">
            <div>
              <label className="input-label">Identificador (Título)</label>
              <input 
                type="text" 
                className="input-executive"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="input-label">Metadados (Tags separadas por vírgula)</label>
              <input 
                type="text" 
                className="input-executive"
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
              />
            </div>
            
            <div className="flex-1 flex flex-col">
              <label className="input-label">Carga Útil (Conteúdo)</label>
              <textarea 
                className="input-executive flex-1 min-h-[300px] resize-none"
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-gold">
                [ Salvar no Córtex ]
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
