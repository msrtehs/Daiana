
import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, MapPin, Heart, ExternalLink, Check, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { Professional, Service, Appointment } from '../types';

export const Profile: React.FC = () => {
  const { screenParams, navigate, goBack, addAppointment, professionals, toggleFavorite, currentUser } = useNavigation();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const professionalId = screenParams?.professionalId;
  const professional = professionals.find(p => p.id === professionalId);

  if (!professional) return <div>Profissional não encontrado</div>;

  const isFavorite = currentUser?.favorites?.includes(professional.id);

  const handleBookClick = (service: Service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (date: string, time: string, paymentMethod: Appointment['paymentMethod']) => {
      if(selectedService && professional) {
          addAppointment({
              serviceId: selectedService.id,
              serviceName: selectedService.name,
              professionalId: professional.id,
              professionalName: professional.businessName,
              date: date,
              time: time,
              price: selectedService.price,
              paymentMethod: paymentMethod
          });
          setIsBookingModalOpen(false);
          navigate('appointments');
      }
  };

  const openMap = () => {
    const query = encodeURIComponent(`${professional.businessName} ${professional.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pb-24 relative">
      {isBookingModalOpen && selectedService && (
        <BookingModal 
          service={selectedService} 
          professional={professional} 
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleConfirmBooking}
        />
      )}

      {/* Header Image */}
      <div className="h-64 md:h-80 relative group overflow-hidden">
        <img src={professional.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt="cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10"></div>
        <button 
          onClick={goBack}
          className="absolute top-6 left-6 bg-white/90 hover:bg-white p-3 rounded-2xl shadow-xl text-gray-800 transition-all z-10 hover:scale-110 active:scale-90"
        >
          <ArrowLeft size={22} />
        </button>
        
        <button 
          onClick={() => toggleFavorite(professional.id)}
          className="absolute top-6 right-6 bg-white/90 hover:bg-white p-3 rounded-2xl shadow-xl transition-all z-10 hover:scale-110 active:scale-90"
        >
          <Heart size={22} className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:gap-12 lg:gap-20">
            
            {/* Left Column: Profile Info */}
            <div className="md:w-1/3 -mt-20 md:-mt-24 relative z-10 mb-8">
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-primary-100/40 border border-primary-50">
                    <div className="flex md:flex-col justify-between items-end md:items-center mb-6">
                        <div className="relative">
                            <img 
                                src={professional.avatarUrl} 
                                className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] border-8 border-white shadow-xl object-cover"
                                alt="avatar"
                            />
                            {professional.isOpen && <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>}
                        </div>
                        <div className="flex flex-col items-end md:items-center mb-2 md:mt-6">
                            <h1 className="text-2xl font-bold text-gray-800 hidden md:block text-center leading-tight">{professional.businessName}</h1>
                            <p className="text-primary-500 text-[10px] font-black uppercase tracking-widest hidden md:block mb-4">{professional.role}</p>
                            
                            <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-100">
                                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-yellow-700">{professional.rating}</span>
                                <span className="text-yellow-200 text-xs">|</span>
                                <span className="text-yellow-600 text-[10px] font-black uppercase">{professional.reviewCount} avaliações</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile Only Title */}
                    <div className="md:hidden mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">{professional.businessName}</h1>
                        <p className="text-primary-500 font-bold uppercase text-[10px] tracking-widest">{professional.role}</p>
                    </div>
                    
                    <button 
                        onClick={openMap}
                        className="w-full mt-4 flex items-center gap-3 text-gray-500 text-sm md:justify-center bg-primary-50/30 p-4 rounded-2xl hover:bg-primary-50 transition-all border border-transparent hover:border-primary-100"
                    >
                        <MapPin size={18} className="shrink-0 text-primary-400" />
                        <span className="truncate font-medium">{professional.location}</span>
                        <ExternalLink size={14} className="ml-auto md:ml-2 opacity-30" />
                    </button>

                    <div className="mt-8">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Sobre o Studio</h3>
                        <p className="text-gray-600 text-sm leading-relaxed font-medium">{professional.about}</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Services */}
            <div className="md:w-2/3 md:mt-12 pb-20">
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-10">
                        <h3 className="font-bold text-3xl text-gray-800 tracking-tight">Serviços</h3>
                        <div className="h-[2px] bg-primary-50 flex-1"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                    {professional.services.map(service => (
                        <div key={service.id} className="group flex flex-col sm:flex-row justify-between items-start bg-white p-6 rounded-[2rem] border border-primary-50 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100/50 transition-all">
                            <div className="flex-1">
                                <div className="flex items-center justify-between sm:justify-start gap-4 mb-2">
                                    <h4 className="font-bold text-xl text-gray-800 group-hover:text-primary-600 transition-colors">{service.name}</h4>
                                    <span className="sm:hidden text-primary-600 font-black text-lg">R$ {service.price.toFixed(2)}</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4 max-w-md font-medium">{service.description}</p>
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary-50 text-primary-600 text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-2 uppercase tracking-widest">
                                        <Clock size={14} /> {service.durationMinutes} minutos
                                    </span>
                                </div>
                            </div>
                            <div className="hidden sm:flex flex-col items-end gap-4 min-w-[140px]">
                                <p className="text-primary-600 font-black text-2xl tracking-tighter">R$ {service.price.toFixed(2)}</p>
                                <button 
                                    onClick={() => handleBookClick(service)}
                                    className="bg-primary-600 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-95 transition-all w-full"
                                >
                                    Agendar
                                </button>
                            </div>
                            <button 
                                onClick={() => handleBookClick(service)}
                                className="sm:hidden mt-6 bg-primary-600 text-white px-8 py-4 rounded-2xl text-sm font-bold w-full shadow-lg shadow-primary-200 active:scale-95 transition-all"
                            >
                                Agendar
                            </button>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const BookingModal = ({ service, professional, onClose, onConfirm }: { service: Service, professional: Professional, onClose: () => void, onConfirm: (date: string, time: string, payment: Appointment['paymentMethod']) => void }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Appointment['paymentMethod']>('credit_card');

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary-900/10 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full sm:max-w-xl rounded-t-[2.5rem] sm:rounded-[3rem] h-[90vh] sm:h-auto max-h-[95vh] flex flex-col shadow-2xl border border-primary-50 animate-slide-up">
        
        {/* Header */}
        <div className="p-8 border-b border-primary-50 flex justify-between items-center bg-white sm:rounded-t-[3rem]">
          <div>
              <h3 className="font-bold text-2xl text-gray-800 tracking-tight">Confirmar Agendamento</h3>
              <p className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Sua beleza em boas mãos</p>
          </div>
          <button onClick={onClose} className="text-primary-200 hover:text-primary-500 p-2 rounded-2xl hover:bg-primary-50 transition-all">
              <Check size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="flex items-center gap-6 p-6 border border-primary-50 rounded-[2rem] bg-primary-50/20">
             <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shrink-0 shadow-sm border border-primary-100 p-1">
               {service.imageUrl ? <img src={service.imageUrl} className="w-full h-full object-cover rounded-xl" /> : <div className="w-full h-full bg-primary-50 flex items-center justify-center text-primary-200"><Star /></div>}
             </div>
             <div>
               <h4 className="font-bold text-gray-800 text-xl leading-tight">{service.name}</h4>
               <p className="text-sm text-primary-500 font-bold">{professional.businessName}</p>
               <p className="text-primary-600 font-black text-2xl mt-2 tracking-tighter">R$ {service.price.toFixed(2)}</p>
             </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">1. Quando você prefere?</label>
            <div className="relative group">
                <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-300 group-focus-within:text-primary-500" size={20} />
                <input 
                    type="date" 
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-primary-50 rounded-2xl py-5 pl-14 pr-6 text-gray-700 bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-200 outline-none transition-all shadow-sm font-medium"
                />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">2. Qual o melhor horário?</label>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
              {['09:00', '10:00', '11:30', '14:00', '15:30', '17:00', '18:30', '19:00'].map(t => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`py-4 rounded-2xl text-sm font-bold border-2 transition-all ${
                    time === t 
                      ? 'border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-200 scale-105' 
                      : 'border-transparent bg-primary-50/50 text-primary-400 hover:bg-primary-100 hover:text-primary-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">3. Escolha o Pagamento</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {id: 'pix', label: 'Pix', icon: '💠'},
                    {id: 'credit_card', label: 'Cartão', icon: '💳'},
                    {id: 'cash', label: 'Local', icon: '💵'}
                  ].map((method) => (
                    <button 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${paymentMethod === method.id ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-transparent bg-primary-50/30 text-primary-300 hover:bg-primary-50'}`}
                    >
                        <span className="text-xl">{method.icon}</span>
                        <span className="font-bold text-xs uppercase tracking-widest">{method.label}</span>
                    </button>
                  ))}
              </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-primary-50 bg-white sm:rounded-b-[3rem]">
           <button 
             disabled={!date || !time}
             onClick={() => onConfirm(date, time, paymentMethod)}
             className="w-full bg-primary-600 disabled:opacity-20 disabled:grayscale text-white font-bold py-5 rounded-[1.8rem] shadow-xl shadow-primary-200 transition-all hover:bg-primary-700 active:scale-95 text-lg"
           >
             Agendar Agora
           </button>
        </div>
      </div>
    </div>
  );
};
