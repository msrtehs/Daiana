
import React from 'react';
import { Home, Search, Calendar, User, Sparkles, LogOut } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { DaianaLogo } from './Logo';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigate } = useNavigation();

  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'search', icon: Search, label: 'Buscar' },
    { id: 'ai-advisor', icon: Sparkles, label: 'Daiana AI' },
    { id: 'appointments', icon: Calendar, label: 'Agenda' },
    { id: 'partner-dashboard', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/90 backdrop-blur-xl border border-primary-50 py-3 px-6 flex justify-between items-center z-50 rounded-[2rem] shadow-[0_12px_24px_-8px_rgba(236,72,153,0.3)] ring-1 ring-primary-100/50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.id as any)}
          className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 ${
            currentScreen === item.id ? 'text-primary-600' : 'text-gray-400'
          }`}
        >
          <div className={`p-2 rounded-xl transition-all ${currentScreen === item.id ? 'bg-primary-50' : 'bg-transparent'}`}>
            <item.icon size={22} strokeWidth={currentScreen === item.id ? 2.5 : 2} />
          </div>
          <span className={`text-[9px] font-black uppercase tracking-tighter ${currentScreen === item.id ? 'opacity-100' : 'opacity-40'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export const Header: React.FC = () => {
  const { navigate, currentScreen, currentUser, logout } = useNavigation();

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'search', label: 'Buscar' },
    { id: 'ai-advisor', label: 'Daiana AI' },
    { id: 'appointments', label: 'Minha Agenda' },
    { id: 'partner-dashboard', label: 'Meu Perfil' },
  ];
  
  return (
    <header className="bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-40 border-b border-primary-50">
      <div className="flex items-center gap-6">
        <div 
          onClick={() => currentUser?.type === 'client' && navigate('home')}
          className={`flex items-center gap-2 transition-opacity group ${currentUser?.type === 'client' ? 'cursor-pointer hover:opacity-80' : ''}`}
        >
          <div className="text-primary-600 group-hover:scale-110 transition-transform duration-300">
             <DaianaLogo className="w-10 h-10" />
          </div>
          <span className="font-bold text-2xl text-gray-800 tracking-tight hidden sm:block font-serif">Daiana</span>
        </div>

        {/* Desktop Navigation */}
        {currentUser?.type === 'client' && (
          <nav className="hidden md:flex gap-6 ml-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id as any)}
                className={`text-sm font-bold transition-all px-2 py-1 uppercase tracking-widest text-[11px] ${
                  currentScreen === item.id 
                    ? 'text-primary-600' 
                    : 'text-gray-400 hover:text-primary-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
      
      {/* User Info & Logout */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-none">{currentUser?.name}</p>
            <p className="text-[10px] text-primary-500 font-black uppercase tracking-widest mt-1 opacity-60">{currentUser?.type === 'professional' ? 'Profissional' : 'Cliente'}</p>
        </div>
        <div className="relative">
            <img 
                src={currentUser?.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser?.name}`} 
                alt="avatar" 
                className="w-10 h-10 rounded-2xl border-2 border-primary-50 shadow-sm object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <button 
            onClick={logout}
            className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
            title="Sair"
        >
            <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
