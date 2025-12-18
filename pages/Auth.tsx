
import React, { useState } from 'react';
import { DaianaLogo } from '../components/Logo';
import { useNavigation } from '../context/NavigationContext';
import { auth, googleProvider, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ArrowRight, Chrome } from 'lucide-react';

export const Login: React.FC = () => {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      alert("Erro Google: " + e.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      alert("Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-50/50 via-white to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="relative inline-block">
             <DaianaLogo className="w-24 h-24 mx-auto mb-4 text-primary-600 drop-shadow-sm" />
             <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-100 rounded-full -z-10 animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-bold font-serif text-gray-800 tracking-tight">Daiana</h1>
          <p className="text-primary-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Plataforma de Beleza</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
             <label className="text-[10px] font-black text-gray-400 uppercase ml-4">E-mail</label>
             <input 
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full p-5 rounded-2xl border border-primary-50 bg-white outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-200 transition-all text-gray-700 placeholder:text-gray-200 shadow-sm"
                placeholder="exemplo@email.com" required
             />
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Senha</label>
             <input 
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full p-5 rounded-2xl border border-primary-50 bg-white outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-200 transition-all text-gray-700 placeholder:text-gray-200 shadow-sm"
                placeholder="••••••••" required
             />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full bg-primary-600 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary-700 shadow-lg shadow-primary-200 active:scale-[0.98] transition-all"
          >
            {loading ? "Entrando..." : "Entrar na Minha Conta"} <ArrowRight size={20} />
          </button>
        </form>

        <div className="my-10 flex items-center gap-6">
          <div className="h-[1px] bg-primary-50 flex-1"></div>
          <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase">Ou conecte com</span>
          <div className="h-[1px] bg-primary-50 flex-1"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-primary-100 p-5 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-primary-50 transition-all text-gray-600 shadow-sm"
        >
          <Chrome size={22} className="text-primary-500" /> Entrar com o Google
        </button>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm font-medium">
            Não tem uma conta Daiana?
          </p>
          <button onClick={() => navigate('signup')} className="text-primary-600 font-black mt-2 uppercase text-xs tracking-widest hover:underline">
             Cadastre-se Agora Gratuitamente
          </button>
        </div>
      </div>
    </div>
  );
};

export const Signup: React.FC = () => {
  const { navigate } = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = { id: userCred.user.uid, name, email, type: 'client', avatarUrl: '' };
      await setDoc(doc(db, "users", userCred.user.uid), newUser);
    } catch (e: any) {
      alert("Erro ao criar conta. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary-50/50 via-white to-white">
       <div className="w-full max-w-md">
         <div className="text-center mb-10">
            <h1 className="text-4xl font-bold font-serif text-gray-800 mb-2">Seja bem-vinda</h1>
            <p className="text-gray-400 font-medium">Crie sua conta Daiana em poucos segundos.</p>
         </div>

         <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Nome Completo</label>
                <input 
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    className="w-full p-5 rounded-2xl border border-primary-50 bg-white outline-none focus:ring-4 focus:ring-primary-50 transition-all text-gray-700 shadow-sm" placeholder="Como quer ser chamada?" required
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">E-mail</label>
                <input 
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full p-5 rounded-2xl border border-primary-50 bg-white outline-none focus:ring-4 focus:ring-primary-50 transition-all text-gray-700 shadow-sm" placeholder="seu@email.com" required
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Senha de Acesso</label>
                <input 
                    type="password" value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full p-5 rounded-2xl border border-primary-50 bg-white outline-none focus:ring-4 focus:ring-primary-50 transition-all text-gray-700 shadow-sm" placeholder="Crie uma senha forte" required
                />
            </div>
            <button 
              type="submit" disabled={loading}
              className="w-full bg-primary-600 text-white p-5 rounded-2xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-100 active:scale-95 transition-all mt-4"
            >
              {loading ? "Criando conta..." : "Criar Minha Conta"}
            </button>
         </form>
         
         <div className="mt-10 text-center">
            <button onClick={() => navigate('login')} className="text-gray-400 font-bold hover:text-primary-600 transition-colors uppercase text-xs tracking-widest">
                Já sou cliente Daiana
            </button>
         </div>
       </div>
    </div>
  );
};
