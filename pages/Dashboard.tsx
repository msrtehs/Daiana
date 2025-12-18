
import React from 'react';
import { LogOut, Trash2, Mail, User as UserIcon, Edit3 } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const PartnerDashboard: React.FC = () => {
  const { currentUser, logout, navigate } = useNavigation();

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative inline-block mb-4">
            <img 
              src={currentUser?.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser?.name}`} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              alt="avatar"
            />
            <button 
              onClick={() => navigate('edit-profile')}
              className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-lg hover:bg-primary-700"
            >
              <Edit3 size={16} />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{currentUser?.name}</h1>
          <p className="text-gray-500">{currentUser?.email}</p>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <button 
          onClick={() => navigate('edit-profile')}
          className="w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <UserIcon size={18} /> Editar Minhas Informações
        </button>

        <button 
          onClick={logout}
          className="w-full bg-white text-red-500 border border-red-100 py-3 rounded-xl font-bold hover:bg-red-50 flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Sair da Conta
        </button>
      </div>
    </div>
  );
};
