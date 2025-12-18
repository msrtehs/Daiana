
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User as UserIcon, TrendingUp, DollarSign, Info } from 'lucide-react';
import { getAIRecommendation } from '../services/geminiService';
import { useNavigation } from '../context/NavigationContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isTyping?: boolean;
  type?: 'text' | 'insight';
  insightType?: 'price' | 'popularity' | 'help';
}

export const AIAdvisor: React.FC = () => {
  const { professionals } = useNavigation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasWelcomed = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!hasWelcomed.current) {
        hasWelcomed.current = true;
        setTimeout(() => {
            setMessages([
                { 
                  id: 'welcome', 
                  sender: 'ai', 
                  text: 'Olá! Sou a Daiana, sua consultora de beleza pessoal. 💎\n\nEstou aqui para tirar suas dúvidas sobre a plataforma e te dar insights exclusivos.',
                  type: 'text'
                },
                {
                  id: 'welcome-insight',
                  sender: 'ai',
                  text: '💡 Dica Daiana: Posso encontrar para você o **Melhor Preço** ou o profissional **Mais Popular** para qualquer serviço. Experimente perguntar "Qual o melhor preço para design de unhas?"',
                  type: 'insight',
                  insightType: 'help'
                }
            ]);
        }, 500);
    }
  }, []);

  const calculateInsights = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const allServices = professionals.flatMap(p => p.services.map(s => ({...s, professionalName: p.businessName, professionalId: p.id, rating: p.rating, reviewCount: p.reviewCount})));
    const relevantServices = allServices.filter(s => 
        s.name.toLowerCase().includes(lowerQuery) || 
        s.category.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery)
    );

    let insights = { bestPrice: null as any, mostPopular: null as any, found: false };
    if (relevantServices.length > 0) {
        insights.bestPrice = relevantServices.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
        const relevantProfs = professionals.filter(p => p.services.some(s => relevantServices.includes(s as any)));
        if (relevantProfs.length > 0) {
            insights.mostPopular = relevantProfs.reduce((prev, curr) => prev.reviewCount > curr.reviewCount ? prev : curr);
        }
        insights.found = true;
    }
    return insights;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input, type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const typingId = 'typing-' + Date.now();
    setMessages(prev => [...prev, { id: typingId, sender: 'ai', text: '...', isTyping: true, type: 'text' }]);

    const insights = calculateInsights(userMessage.text);
    let insightsContextString = "";
    
    if (insights.found) {
        insightsContextString = `
        [INSIGHTS DO SISTEMA]:
        - O serviço mais barato para esta busca é: ${insights.bestPrice.name} no ${insights.bestPrice.professionalName} por R$ ${insights.bestPrice.price}.
        - O local mais popular/procurado é: ${insights.mostPopular.businessName} com ${insights.mostPopular.reviewCount} avaliações.
        `;
    }

    const context = JSON.stringify(professionals.map(p => ({
      name: p.name,
      business: p.businessName,
      location: p.location,
      reviewCount: p.reviewCount,
      services: p.services.map(s => ({ name: s.name, price: s.price }))
    }))) + insightsContextString;

    const responseText = await getAIRecommendation(userMessage.text, context);
    setMessages(prev => prev.filter(m => m.id !== typingId));

    if (insights.found) {
         setMessages(prev => [...prev, {
             id: 'insight-price-' + Date.now(),
             sender: 'ai',
             text: `💰 Melhor Preço: ${insights.bestPrice.name} por R$ ${insights.bestPrice.price.toFixed(2)} em ${insights.bestPrice.professionalName}.`,
             type: 'insight',
             insightType: 'price'
         }]);
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'ai',
      text: responseText,
      type: 'text'
    }]);
  };

  return (
    <div className="flex justify-center bg-white h-[calc(100vh-80px)] p-0 md:p-6">
        <div className="w-full max-w-2xl bg-white shadow-2xl shadow-primary-100/50 md:rounded-[2.5rem] flex flex-col overflow-hidden border border-primary-50">
            {/* Chat Header */}
            <div className="bg-white/80 backdrop-blur-md p-5 border-b border-primary-50 flex items-center gap-4 z-10">
                <div className="w-12 h-12 bg-gradient-to-tr from-primary-500 to-pink-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200 relative rotate-3">
                    <Sparkles size={24} className="-rotate-3" />
                    <div className="absolute -bottom-1 -right-1 bg-green-400 border-2 border-white w-4 h-4 rounded-full"></div>
                </div>
                <div>
                  <h1 className="font-bold text-gray-800 text-lg leading-tight">Daiana AI</h1>
                  <p className="text-[10px] text-primary-500 font-bold uppercase tracking-widest">Consultora Virtual</p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-gradient-to-b from-white to-primary-50/20">
                {messages.map((msg) => {
                    if (msg.type === 'insight') {
                        return (
                            <div key={msg.id} className="flex justify-center animate-slide-up">
                                <div className={`max-w-[90%] w-full rounded-2xl p-4 border shadow-sm flex items-start gap-3 ${
                                    msg.insightType === 'price' 
                                        ? 'bg-white border-green-100 text-green-800' 
                                        : msg.insightType === 'popularity'
                                        ? 'bg-white border-purple-100 text-purple-800'
                                        : 'bg-white border-blue-100 text-blue-800'
                                }`}>
                                    <div className={`p-2 rounded-xl shrink-0 ${
                                         msg.insightType === 'price' ? 'bg-green-50 text-green-600' : 
                                         msg.insightType === 'popularity' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        {msg.insightType === 'price' && <DollarSign size={18} />}
                                        {msg.insightType === 'popularity' && <TrendingUp size={18} />}
                                        {msg.insightType === 'help' && <Info size={18} />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-tighter">Insight Especial</p>
                                        <p className="text-sm font-semibold leading-relaxed">{msg.text}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    return (
                        <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                msg.sender === 'user' ? 'bg-white border border-gray-100 text-gray-400' : 'bg-primary-50 text-primary-500'
                            }`}>
                                {msg.sender === 'user' ? <UserIcon size={18} /> : <Bot size={18} />}
                            </div>
                            
                            <div className={`max-w-[80%] p-4 rounded-3xl text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-sm border ${
                                msg.sender === 'user' 
                                    ? 'bg-primary-600 border-primary-500 text-white rounded-tr-none' 
                                    : 'bg-white border-primary-50 text-gray-700 rounded-tl-none'
                            }`}>
                                {msg.isTyping ? <div className="flex gap-1 py-1"><div className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]"></div></div> : msg.text}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-8 bg-white/80 backdrop-blur-md border-t border-primary-50">
                <div className="flex items-center gap-3 bg-white border border-primary-100 rounded-[1.5rem] p-1.5 pr-2 shadow-inner-sm focus-within:border-primary-300 focus-within:ring-4 focus-within:ring-primary-50 transition-all">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pergunte sobre cílios, preços, etc..."
                        className="flex-1 bg-transparent border-none px-4 py-3 outline-none text-gray-700 placeholder:text-gray-300 text-base"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="bg-primary-600 text-white p-3 rounded-2xl hover:bg-primary-700 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-primary-200 active:scale-90"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-center text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-widest">Daiana analisa centenas de preços e avaliações em tempo real</p>
            </div>
        </div>
    </div>
  );
};
