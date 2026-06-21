import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Zap, ArrowLeft, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateProject } from '../services/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Bonjour ! Je suis ton assistant IA. Décris-moi ton projet backend et je vais générer automatiquement ton modèle Clean Architecture. Par exemple : "Je veux un backend pour une boutique en ligne avec des produits et des utilisateurs"'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
            .filter(m => m.role === 'user' || m.role === 'assistant')
            .map(m => ({ role: m.role, content: m.content }))
        })
      });

      // Vérifier le status 429
      if (response.status === 429) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '⚠️ Trop de requêtes ! Tu as atteint la limite du serveur. Réessaie dans 15 minutes.'
        }]);
        return;
      }

      const data = await response.json();
      const assistantMessage = data.content;

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

      const modelMatch = assistantMessage.match(/<MODEL>([\s\S]*?)<\/MODEL>/);
      if (modelMatch) {
        try {
          const model = JSON.parse(modelMatch[1]);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '✅ Modèle généré ! Veux-tu que je génère et télécharge ton projet ZIP ?',
            model: model
          }]);
        } catch (e) {
          console.error('Erreur parsing JSON', e);
        }
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Erreur de connexion. Vérifie que le backend est lancé.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (model) => {
    setGenerating(true);
    try {
      await generateProject(model);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '🎉 Projet généré et téléchargé avec succès !'
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Erreur lors de la génération du projet.'
      }]);
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border px-8 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Zap className="text-primary" size={28} />
          <span className="text-xl font-bold text-white">BackendGen</span>
          <span className="text-gray-400 text-sm ml-2">— Assistant IA</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft size={18} /> Retour
        </button>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 max-w-4xl mx-auto w-full">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 mb-6 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'assistant' ? 'bg-primary' : 'bg-border'}`}>
              {message.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
            </div>

            <div className={`max-w-2xl ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              <div className={`rounded-xl px-4 py-3 ${message.role === 'assistant' ? 'bg-card border border-border text-gray-200' : 'bg-primary text-white'}`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {(message.content || '').replace(/<MODEL>[\s\S]*?<\/MODEL>/g, '')}
                </p>
              </div>

              {message.model && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGenerate(message.model)}
                  disabled={generating}
                  className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Génération...
                    </>
                  ) : (
                    '📦 Générer et Télécharger ZIP'
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="bg-card border border-border rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border px-8 py-4 max-w-4xl mx-auto w-full">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Décris ton projet... ex: Je veux un backend pour une boutique avec des produits et des commandes"
            className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all resize-none"
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-secondary text-white px-6 rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;