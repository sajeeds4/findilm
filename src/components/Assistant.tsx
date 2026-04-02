import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, AlertCircle, Mic, MicOff } from 'lucide-react';
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

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b bg-emerald-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Ask a Scholar</h2>
            <p className="text-emerald-100 text-xs">Powered by Gemini AI • Authentic Knowledge</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-700/50 px-3 py-1 rounded-full text-xs font-medium">
          <Sparkles size={14} />
          <span>Verified Sources</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <Bot size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Assalamu Alaikum!</h3>
            <p className="text-slate-500">
              I am your AI Islamic assistant. You can ask me about Fiqh, Seerah, Hadith, or general spiritual advice.
            </p>
            <div className="grid grid-cols-1 gap-2 w-full">
              <button 
                onClick={() => setInput("What are the benefits of Tahajjud prayer?")}
                className="text-sm bg-white border border-slate-200 p-3 rounded-xl hover:border-emerald-500 transition-colors text-left"
              >
                "What are the benefits of Tahajjud?"
              </button>
              <button 
                onClick={() => setInput("How can I improve my focus in Salah?")}
                className="text-sm bg-white border border-slate-200 p-3 rounded-xl hover:border-emerald-500 transition-colors text-left"
              >
                "How can I improve my focus in Salah?"
              </button>
            </div>
          </div>
        )}

        {messages.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-emerald-600 shadow-sm'
            }`}>
              {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
            }`}>
              <div className="prose prose-sm max-w-none prose-emerald dark:prose-invert">
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-white border border-slate-200 text-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
              <Bot size={18} />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t bg-white">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your question here..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all pr-24"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button 
              onClick={() => setIsListening(!isListening)}
              className={`p-2 rounded-xl transition-colors ${isListening ? 'bg-red-100 text-red-600' : 'hover:bg-slate-200 text-slate-400'}`}
            >
              {isListening ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-200"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          <AlertCircle size={12} />
          <span>AI responses should be verified with local scholars for complex matters.</span>
        </div>
      </div>
    </div>
  );
}
