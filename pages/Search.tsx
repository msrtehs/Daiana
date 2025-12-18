
import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { CATEGORIES } from '../constants';
import { ProfessionalCard } from '../components/ProfessionalCard';

export const Search: React.FC = () => {
  const { screenParams, navigate, professionals } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(screenParams?.category || null);

  const filteredProfessionals = useMemo(() => {
    return professionals.filter(prof => {
      const matchesSearch = 
        prof.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        prof.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.services.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory 
        ? prof.services.some(s => s.category === selectedCategory)
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, professionals]);

  return (
    <div className="pb-24 min-h-screen bg-white">
      {/* Search Header */}
      <div className="bg-white/95 backdrop-blur-md px-6 py-8 border-b border-primary-50 sticky top-0 md:top-14 z-30">
        <div className="max-w-5xl mx-auto">
            <div className="relative group">
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-300 group-focus-within:text-primary-500 transition-colors" size={22} />
                <input
                    autoFocus
                    type="text"
                    placeholder="Encontre o salão perfeito para você..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white text-gray-700 border border-primary-100 rounded-[2rem] py-5 pl-14 pr-6 outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-200 text-lg transition-all shadow-sm placeholder:text-gray-300"
                />
            </div>
            
            {/* Category Pills */}
            <div className="flex gap-3 overflow-x-auto mt-8 pb-2 no-scrollbar">
                <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`whitespace-nowrap px-8 py-3 rounded-2xl text-sm font-bold border transition-all ${
                    !selectedCategory 
                        ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200 scale-105' 
                        : 'bg-white border-primary-50 text-gray-500 hover:border-primary-200 hover:text-primary-600'
                    }`}
                >
                    Todos
                </button>
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                        className={`whitespace-nowrap px-8 py-3 rounded-2xl text-sm font-bold border transition-all ${
                            selectedCategory === cat.id 
                            ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200 scale-105' 
                            : 'bg-white border-primary-50 text-gray-500 hover:border-primary-200 hover:text-primary-600'
                        }`}
                    >
                        {cat.icon} {cat.name}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 px-2">
           <div>
               <h2 className="font-bold text-gray-800 text-2xl tracking-tight">
                 {searchTerm || selectedCategory ? 'Resultados da busca' : 'Profissionais em destaque'}
               </h2>
               <p className="text-gray-400 text-sm font-medium">{filteredProfessionals.length} opções disponíveis</p>
           </div>
           <button className="flex items-center gap-2 px-5 py-3 bg-white border border-primary-50 rounded-2xl text-sm text-gray-600 font-bold hover:bg-primary-50 hover:border-primary-100 transition-all">
             <Filter size={18} className="text-primary-500" /> Filtros
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProfessionals.map(prof => (
             <ProfessionalCard 
               key={prof.id} 
               professional={prof}
               onClick={() => navigate('profile', { professionalId: prof.id })}
             />
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
        <div className="text-center py-24">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-200">
                <SearchIcon size={40} />
            </div>
            <p className="text-xl font-bold text-gray-400">Poxa, não encontramos nada aqui.</p>
            <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory(null);}}
                className="text-primary-600 font-black mt-4 hover:underline uppercase text-xs tracking-widest"
            >
            Limpar todos os filtros
            </button>
        </div>
        )}
      </div>
    </div>
  );
};
