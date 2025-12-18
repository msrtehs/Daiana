
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Substitua 'NOME_DO_REPOSITORIO' pelo nome exato do seu repositório no GitHub
export default defineConfig({
  plugins: [react()],
  base: './', 
});
