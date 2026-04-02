import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, AlertCircle, Mic, MicOff, ArrowRight, MessageSquare, ShieldCheck, History, MoreVertical, Share2, Trash2 } from 'lucide-react';
import { ai, MODELS, SYSTEM_INSTRUCTIONS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../AuthContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const chat = ai.chats.create({
        model: MODELS.FLASH,
        config: {
          systemInstruction: SYSTEM_INSTRUCTIONS.SCHOLAR,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const response = await chat.sendMessage({ message: input });
      const modelMessage: Message = { role: 'model', text: response.text || "I'm sorry, I couldn't generate a response." };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Assistant error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "An error occurred while connecting to the scholar. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-14rem)] flex flex-col bg-white border border-slate-200 rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b bg-slate-900 text-white flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-900/40">
            <Bot size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">Ask a Scholar</h2>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              <span>AI-Powered Spiritual Guidance</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <button 
            onClick={clearChat}
            className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            title="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
          <div className="h-8 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-2 bg-brand-500/20 border border-brand-500/20 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-400">
            <ShieldCheck size={14} />
            <span>Verified Sources</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/30 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-lg mx-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-brand-50 text-brand-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-brand-100"
            >
              <Bot size={48} />
            </motion.div>
            <div className="space-y-4">
              <h3 className="text-3xl font-display font-bold text-slate-900">Assalamu Alaikum!</h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                I am your AI Islamic assistant, trained on authentic sources to help you with Fiqh, Seerah, and spiritual growth. How can I assist you today?
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {[
                "What are the benefits of Tahajjud?",
                "How can I improve focus in Salah?",
                "Explain the concept of Tawakkul",
                "Daily Sunnah habits for success"
              ].map((q, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(q)}
                  className="text-sm font-bold text-slate-600 bg-white border border-slate-200 p-5 rounded-2xl hover:border-brand-500 hover:text-brand-600 transition-all text-left shadow-sm hover:shadow-md flex items-center justify-between group"
                >
                  {q}
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-brand-600'
              }`}>
                {m.role === 'user' ? <User size={24} /> : <Bot size={24} />}
              </div>
              <div className={`max-w-[75%] p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/30 relative group ${
                m.role === 'user' 
                  ? 'bg-brand-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}>
                <div className={`prose prose-lg max-w-none ${m.role === 'user' ? 'prose-invert' : 'prose-slate'} font-medium leading-relaxed`}>
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
                <div className={`absolute top-4 ${m.role === 'user' ? '-left-12' : '-right-12'} opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-2`}>
                  <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                    <Share2 size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                    <History size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-white border border-slate-200 text-brand-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot size={24} />
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] rounded-tl-none shadow-xl shadow-slate-200/30 flex gap-2">
              <span className="w-3 h-3 bg-brand-400 rounded-full animate-bounce"></span>
              <span className="w-3 h-3 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-3 h-3 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-10 border-t bg-white relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
            <AlertCircle size={14} className="text-amber-500" />
            <span>AI responses should be verified with local scholars</span>
          </div>
        </div>

        <div className="relative flex items-center gap-4">
          <div className="relative flex-1 group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors">
              <MessageSquare size={24} />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask your question here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] pl-16 pr-32 py-6 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-lg text-slate-700"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button 
                onClick={() => setIsListening(!isListening)}
                className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-rose-100 text-rose-600' : 'hover:bg-slate-200 text-slate-400'}`}
              >
                {isListening ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-brand-600 text-white p-4 rounded-2xl hover:bg-brand-700 transition-all disabled:opacity-50 shadow-xl shadow-brand-900/40 group/send"
              >
                <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
