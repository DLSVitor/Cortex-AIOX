import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cortex_prompts';

export function useStorage() {
  const [prompts, setPrompts] = useState(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn('Erro ao ler localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  }, [prompts]);

  const savePrompt = (prompt) => {
    if (prompt.id) {
      setPrompts(prev => prev.map(p => p.id === prompt.id ? { ...prompt, updatedAt: Date.now() } : p));
    } else {
      const newPrompt = {
        ...prompt,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setPrompts(prev => [newPrompt, ...prev]);
    }
  };

  const deletePrompt = (id) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  return { prompts, savePrompt, deletePrompt };
}
