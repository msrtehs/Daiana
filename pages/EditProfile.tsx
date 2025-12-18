
import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Save, Lock, Mail, User as UserIcon, Loader2 } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { auth, db, storage } from '../firebase';
import { updateProfile, updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

export const EditProfile: React.FC = () => {
  const { currentUser, goBack, updateCurrentUserState } = useNavigation();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(currentUser?.avatarUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !currentUser) return;
    
    setLoading(true);
    try {
      let newAvatarUrl = currentUser.avatarUrl;

      // 1. Upload Photo if changed
      if (photoFile) {
        try {
            const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
            await uploadBytes(storageRef, photoFile);
            newAvatarUrl = await getDownloadURL(storageRef);
        } catch (storageErr) {
            console.warn("Storage upload failed, proceeding with profile updates:", storageErr);
        }
      }

      // 2. Update Firebase Auth Profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: newAvatarUrl
      });

      // 3. Update Email if changed
      if (email !== currentUser.email) {
        await updateEmail(auth.currentUser, email);
      }

      // 4. Update Password if provided
      if (password) {
        await updatePassword(auth.currentUser, password);
      }

      // 5. Update Firestore (Graceful failure)
      try {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userDocRef, {
            name: name,
            email: email,
            avatarUrl: newAvatarUrl
          });
      } catch (dbErr) {
          console.warn("Firestore update failed, local state updated:", dbErr);
      }

      updateCurrentUserState({ name, email, avatarUrl: newAvatarUrl });
      alert("Perfil atualizado!");
      goBack();
    } catch (error: any) {
      console.error(error);
      alert("Erro ao atualizar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 bg-white min-h-screen">
      <div className="bg-white px-6 py-6 border-b border-primary-50 sticky top-0 z-30 flex items-center gap-4">
        <button onClick={goBack} className="p-3 hover:bg-primary-50 rounded-2xl text-primary-600 transition-all active:scale-90">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 font-serif">Editar Perfil</h1>
      </div>

      <div className="p-6 max-w-xl mx-auto">
        <form onSubmit={handleSave} className="space-y-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img 
                src={previewUrl || `https://ui-avatars.com/api/?name=${name}`} 
                className="w-36 h-36 rounded-[2.5rem] object-cover border-8 border-white shadow-2xl shadow-primary-100"
                alt="Profile Preview"
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-primary-600 text-white p-3.5 rounded-2xl shadow-xl hover:bg-primary-700 transition-all active:scale-95"
              >
                <Camera size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-6 font-black uppercase tracking-[0.2em]">Alterar Foto de Perfil</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 ml-4 uppercase tracking-[0.2em]">
                <UserIcon size={14} className="text-primary-400" /> Nome Completo
              </label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-6 py-4 rounded-2xl border border-primary-50 bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-200 outline-none transition-all shadow-sm text-gray-700 placeholder:text-gray-200"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 ml-4 uppercase tracking-[0.2em]">
                <Mail size={14} className="text-primary-400" /> E-mail de Contato
              </label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-6 py-4 rounded-2xl border border-primary-50 bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-200 outline-none transition-all shadow-sm text-gray-700 placeholder:text-gray-200"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 ml-4 uppercase tracking-[0.2em]">
                <Lock size={14} className="text-primary-400" /> Alterar Senha
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-primary-50 bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-200 outline-none transition-all shadow-sm text-gray-700 placeholder:text-gray-200"
                placeholder="Deixe em branco para não alterar"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white font-bold py-5 rounded-[1.8rem] shadow-xl shadow-primary-200 hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            {loading ? "Salvando..." : "Salvar Perfil"}
          </button>
        </form>
      </div>
    </div>
  );
};
