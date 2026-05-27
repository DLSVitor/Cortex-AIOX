import { useState, useEffect } from 'react'
import { useStorage } from './useStorage'

export default function App() {
  const { prompts, savePrompt, deletePrompt } = useStorage();
  const [activePromptId, setActivePromptId] = useState(null);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({ title: '', tags: '', content: '' });
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (activePromptId) {
      const p = prompts.find(p => p.id === activePromptId);
      if (p) setFormData(p);
    } else {
      setFormData({ title: '', tags: '', content: '' });
    }
    
    // Auto-fechar a sidebar no mobile ao selecionar um prompt
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [activePromptId, prompts]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    savePrompt(formData);
    if (!formData.id) {
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
    <div className="flex min-h-screen bg-vantablack overflow-hidden relative">
      
      {/* Overlay Escuro para Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`w-[85vw] sm:w-[350px] bg-vantablack border-r border-gold-dim flex flex-col h-screen fixed top-0 left-0 z-50 transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-[0_0_50px_rgba(0,0,0,1)]' : '-translate-x-full'}`}
      >
        <div className="p-6 border-b border-gold-dim flex justify-between items-center">
          <h1 className="text-gold-muted uppercase tracking-executiveWide font-light text-xl">
            Córtex Central
          </h1>
          <button 
            className="md:hidden text-gold-muted hover:text-gold-bright p-2 -mr-2"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 pb-2">
          <button 
            onClick={() => {
              setActivePromptId(null);
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
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
        
        <div className="flex-1 overflow-y-auto p-6 pt-2">
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
      <main className="flex-1 bg-[#050505] p-6 md:p-12 flex flex-col h-screen overflow-y-auto w-full">
        <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
          
          {/* Header Mobile com Hamburguer Menu */}
          <div className="md:hidden flex items-center mb-8 gap-4 border-b border-gold-dim pb-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-gold-muted hover:text-gold-bright transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <h2 className="text-gold-muted text-lg uppercase tracking-executiveWide font-light">
              Córtex Central
            </h2>
          </div>

          <header className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-gold-dim pb-4 mb-8 gap-4">
            <h2 className="text-gold-muted text-xl md:text-2xl uppercase tracking-executiveWide font-light">
              {activePromptId ? 'Modo Edição' : 'Novo Registro'}
            </h2>
            <div className="flex gap-4 items-center self-start sm:self-auto">
              {activePromptId && (
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 text-xs uppercase tracking-executiveWide transition-colors">
                  Deletar
                </button>
              )}
              {activePromptId && (
                <button onClick={handleCopy} className="btn-gold px-4 py-2 sm:px-8 sm:py-3 whitespace-nowrap">
                  {copied ? '[ Copiado! ]' : '[ Copiar Prompt ]'}
                </button>
              )}
            </div>
          </header>

          <form onSubmit={handleSave} className="flex-1 flex flex-col gap-6 md:gap-8">
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
                className="input-executive flex-1 min-h-[250px] md:min-h-[300px] resize-none"
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                required
              />
            </div>

            <div className="flex justify-end pt-4 pb-8 md:pb-0">
              <button type="submit" className="btn-gold w-full sm:w-auto">
                [ Salvar no Córtex ]
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
