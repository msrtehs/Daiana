import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Professional } from '../types';

interface Props {
  professional: Professional;
  onClick: () => void;
}

export const ProfessionalCard: React.FC<Props> = ({ professional, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer mb-4"
    >
      <div className="relative h-32 bg-gray-200">
        <img 
          src={professional.coverUrl} 
          alt={professional.businessName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute -bottom-6 left-4">
          <img 
            src={professional.avatarUrl} 
            alt={professional.name} 
            className="w-16 h-16 rounded-full border-4 border-white object-cover"
          />
        </div>
        {professional.isOpen && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
            Aberto
          </span>
        )}
      </div>
      
      <div className="pt-8 pb-4 px-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{professional.businessName}</h3>
            <p className="text-gray-500 text-sm mt-0.5">{professional.role}</p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-yellow-700">{professional.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 border-t border-gray-50 pt-3">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{professional.distance} • {professional.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
