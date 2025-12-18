import React from 'react';

export const DaianaLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* 
        Conceito Daiana:
        1. A Lua (Crescente) formando a haste do "D" -> Deusa Diana, Lua.
        2. A Folha formando a curva do "D" -> Natureza, Selvagem.
        3. A Estrela/Brilho -> Divina, Iluminada.
      */}
      
      {/* A Lua (Haste do D) */}
      <path 
        d="M40 20 C 15 20, 15 80, 40 80 C 28 80, 28 20, 40 20 Z" 
        fill="currentColor" 
        className="text-primary-700"
      />
      
      {/* A Folha (Curva do D) - Conectando organicamente à lua */}
      <path 
        d="M40 78 C 85 78, 85 30, 40 30 C 55 30, 65 50, 40 78 Z" 
        fill="currentColor" 
        className="text-primary-500 opacity-90"
      />
      
      {/* O Brilho (Divina/Iluminada) - Estrela de 4 pontas */}
      <path 
        d="M75 15 L 78 22 L 85 25 L 78 28 L 75 35 L 72 28 L 65 25 L 72 22 Z" 
        fill="currentColor" 
        className="text-yellow-400 animate-pulse"
      />
    </svg>
  );
};