
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
}

export interface Professional {
  id: string;
  name: string;
  businessName: string;
  role: string;
  avatarUrl: string;
  coverUrl: string;
  rating: number;
  reviewCount: number;
  location: string;
  distance: string;
  services: Service[];
  reviews: Review[];
  about: string;
  isOpen: boolean;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  clientId?: string;
  clientName?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  price: number;
  paymentMethod: 'credit_card' | 'pix' | 'cash';
  hasReviewed?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'client' | 'professional';
  favorites?: string[];
  avatarUrl?: string;
  businessName?: string;
  category?: string;
}

export type ScreenName = 'home' | 'search' | 'profile' | 'appointments' | 'partner-dashboard' | 'ai-advisor' | 'login' | 'signup' | 'edit-profile';

export interface NavigationContextType {
  currentScreen: ScreenName;
  screenParams: Record<string, any>;
  navigate: (screen: ScreenName, params?: Record<string, any>) => void;
  goBack: () => void;
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  deleteAccount: () => void;
  toggleFavorite: (professionalId: string) => void;
  appointments: Appointment[];
  addAppointment: (appt: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  professionals: Professional[];
  addService: (professionalId: string, service: Omit<Service, 'id'>) => void;
  updateProfessional: (professionalId: string, data: Partial<Professional>) => void;
  addReview: (professionalId: string, appointmentId: string, review: { rating: number; comment: string }) => void;
  updateCurrentUserState: (data: Partial<User>) => void;
}
