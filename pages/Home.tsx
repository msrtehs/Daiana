import React from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { useNavigation } from '../context/NavigationContext';

export const Home: React.FC = () => {
  const { navigate, professionals } = useNavigation();

  return (
    <div className="pb-12 md:pb-8">
      {/* Hero / Search Trigger */}
      <div className="px-6 py-8 bg-white border-b border-gray-100 md:border-0">
        <div className="max-w-4xl mx-auto text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Olá, Beleza! ✨</h1>
            <p className="text-gray-500 md:text-lg mb-6">Encontre os melhores profissionais perto de você.</p>
            
            <div 
            onClick={() => navigate('search')}
            className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-500 cursor-pointer hover:bg-white hover:shadow-md transition-all max-w-2xl md:mx-0 mx-auto"
            >
            <Search size={20} />
            <span className="text-sm md:text-base">Buscar serviços, profissionais, salões...</span>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Categories */}
        <div className="mt-8 px-6">
            <div className="flex justify-between items-end mb-4">
            <h2 className="font-bold text-xl text-gray-900">Categorias</h2>
            <button 
                onClick={() => navigate('search')}
                className="text-primary-600 text-sm font-semibold hover:underline"
            >
                Ver todas
            </button>
            </div>
            
            <div className="flex overflow-x-auto gap-4 md:gap-8 pb-4 no-scrollbar">
            {CATEGORIES.map((cat) => (
                <div 
                key={cat.id} 
                onClick={() => navigate('search', { category: cat.id })}
                className="flex flex-col items-center gap-3 min-w-[80px] cursor-pointer group"
                >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-sm border border-gray-100 group-hover:border-primary-200 group-hover:bg-primary-50 group-hover:scale-105 transition-all">
                    {cat.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{cat.name}</span>
                </div>
            ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 mt-8">
            {/* Promo Banner - Takes 1 col on LG, full on mobile */}
            <div className="lg:col-span-1 order-first lg:order-last">
                 <div className="bg-gradient-to-br from-purple-700 to-primary-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden h-full min-h-[200px] flex flex-col justify-center">
                    <div className="relative z-10">
                        <h3 className="font-bold text-2xl md:text-3xl mb-2">Semana do Cabelo</h3>
                        <p className="text-purple-100 mb-6">Até 30% OFF em tratamentos e coloração.</p>
                        <button className="bg-white text-primary-700 px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-gray-50 active:scale-95 transition-all">
                        Ver ofertas
                        </button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-20 transform translate-x-4 translate-y-4">
                        <SparklesIcon size={180} />
                    </div>
                </div>
            </div>

            {/* Featured Professionals - Takes 2 cols on LG */}
            <div className="lg:col-span-2">
                <h2 className="font-bold text-xl text-gray-900 mb-4">Recomendados para você</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {professionals.slice(0, 4).map((prof) => (
                        <ProfessionalCard 
                        key={prof.id} 
                        professional={prof} 
                        onClick={() => navigate('profile', { professionalId: prof.id })}
                        />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L14.39 9.26L22 12L14.39 14.74L12 22L9.61 14.74L2 12L9.61 9.26L12 2Z" />
  </svg>
);