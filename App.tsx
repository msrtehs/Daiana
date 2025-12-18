
import React, { useState, useEffect } from 'react';
import { BottomNav, Header } from './components/Navigation';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Profile } from './pages/Profile';
import { AIAdvisor } from './pages/AIAdvisor';
import { PartnerDashboard } from './pages/Dashboard';
import { Appointments } from './pages/Appointments';
import { Login, Signup } from './pages/Auth';
import { EditProfile } from './pages/EditProfile';
import { ScreenName, Appointment, User, Professional, Service, Review } from './types';
import { PROFESSIONALS as INITIAL_PROFESSIONALS } from './constants';
import { NavigationContext } from './context/NavigationContext';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('login');
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});
  const [history, setHistory] = useState<ScreenName[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>(INITIAL_PROFESSIONALS);
  const [dbError, setDbError] = useState<string | null>(null);

  // Sync Firebase Auth State with fallback to local state if Firestore is unavailable
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Attempt to get user from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid)).catch(err => {
            console.warn("Firestore fetch error:", err);
            return null;
          });

          if (userDoc && userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          } else {
            // If user doesn't exist in Firestore, try to create or just use Auth data
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Usuário Daiana',
              email: firebaseUser.email || '',
              type: 'client',
              avatarUrl: firebaseUser.photoURL || ''
            };
            
            // Try to persist but don't crash if it fails (e.g. database doesn't exist)
            await setDoc(doc(db, "users", firebaseUser.uid), newUser).catch(e => {
                setDbError("Modo offline: Alterações não serão salvas permanentemente.");
                console.error("Firestore persistence error:", e);
            });
            
            setCurrentUser(newUser);
          }
          
          if (currentScreen === 'login' || currentScreen === 'signup') {
            setCurrentScreen('home');
          }
        } catch (e) {
          console.error("Auth sync error:", e);
          // Fallback to minimal user object to keep app running
          setCurrentUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Usuário Daiana',
            email: firebaseUser.email || '',
            type: 'client',
            avatarUrl: firebaseUser.photoURL || ''
          });
          setCurrentScreen('home');
        }
      } else {
        setCurrentUser(null);
        setCurrentScreen('login');
      }
    });
    return () => unsubscribe();
  }, [currentScreen]);

  const login = (user: User) => setCurrentUser(user);
  
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const updateCurrentUserState = (data: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...data });
    }
  };

  const navigate = (screen: ScreenName, params: Record<string, any> = {}) => {
    setHistory(prev => [...prev, currentScreen]);
    setScreenParams(params);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(prevHist => prevHist.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      setCurrentScreen('home');
    }
  };

  const addAppointment = (apptData: any) => {
    const newAppt = { ...apptData, id: Date.now().toString(), status: 'pending' };
    setAppointments(prev => [newAppt, ...prev]);
  };

  const toggleFavorite = (id: string) => {
    if (!currentUser) return;
    const favorites = currentUser.favorites || [];
    const newFavorites = favorites.includes(id) ? favorites.filter(fid => fid !== id) : [...favorites, id];
    updateCurrentUserState({ favorites: newFavorites });
  };

  const renderScreen = () => {
    if (!currentUser) {
      return currentScreen === 'signup' ? <Signup /> : <Login />;
    }

    if (currentUser.type === 'professional' && currentScreen === 'home') {
      return <PartnerDashboard />;
    }

    switch (currentScreen) {
      case 'home': return <Home />;
      case 'search': return <Search />;
      case 'profile': return <Profile />;
      case 'ai-advisor': return <AIAdvisor />;
      case 'appointments': return <Appointments />;
      case 'partner-dashboard': return <PartnerDashboard />;
      case 'edit-profile': return <EditProfile />;
      default: return <Home />;
    }
  };

  return (
    <NavigationContext.Provider value={{ 
        currentScreen, screenParams, navigate, goBack, currentUser,
        login, logout, deleteAccount: () => {}, toggleFavorite,
        appointments, addAppointment, updateAppointmentStatus: () => {},
        professionals, addService: () => {}, updateProfessional: () => {}, addReview: () => {},
        updateCurrentUserState
    }}>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        {dbError && (
            <div className="bg-yellow-500 text-white text-[10px] font-bold text-center py-1 uppercase tracking-widest z-[100] sticky top-0">
                ⚠️ {dbError}
            </div>
        )}
        {currentUser ? (
          <div className="w-full max-w-7xl mx-auto bg-white min-h-screen shadow-xl relative flex flex-col">
            <Header />
            <div className="flex-1 w-full relative">{renderScreen()}</div>
            {currentUser.type === 'client' && <BottomNav />}
          </div>
        ) : <div className="w-full min-h-screen">{renderScreen()}</div>}
      </div>
    </NavigationContext.Provider>
  );
};

export default App;
