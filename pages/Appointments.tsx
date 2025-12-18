import React, { useState } from 'react';
import { Calendar, Clock, RefreshCw, Scissors, CheckCircle, Star, X, Check, AlertCircle } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { Appointment } from '../types';

export const Appointments: React.FC = () => {
  const { appointments, navigate, addReview, currentUser, updateAppointmentStatus } = useNavigation();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  
  // -- PROFESSIONAL VIEW LOGIC --
  const isProfessional = currentUser?.type === 'professional';

  // Filter based on role
  const relevantAppointments = isProfessional 
    ? appointments.filter(a => a.professionalId === currentUser?.id)
    : appointments.filter(a => a.clientId === currentUser?.id);

  // Sorting: Pending/Scheduled first, then date
  const sortedAppointments = [...relevantAppointments].sort((a, b) => {
     if (a.status === 'pending' && b.status !== 'pending') return -1;
     if (a.status !== 'pending' && b.status === 'pending') return 1;
     return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleOpenReview = (appt: Appointment) => {
    setSelectedAppt(appt);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = (rating: number, comment: string) => {
    if (selectedAppt) {
      addReview(selectedAppt.professionalId, selectedAppt.id, { rating, comment });
      setReviewModalOpen(false);
      setSelectedAppt(null);
    }
  };

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">
                    {isProfessional ? 'Gestão de Agenda' : 'Meus Agendamentos'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    {isProfessional ? 'Gerencie as solicitações dos seus clientes.' : 'Gerencie suas visitas e histórico.'}
                </p>
            </div>
            {isProfessional && (
                 <button 
                 onClick={() => navigate('partner-dashboard')}
                 className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg"
                 >
                     Voltar ao Painel
                 </button>
            )}
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {sortedAppointments.length === 0 ? (
             <div className="mb-8 bg-white p-12 rounded-2xl border border-gray-100 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Calendar size={32} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Sua agenda está vazia</h3>
                <p className="text-gray-500 mt-2 mb-6">Ainda não há agendamentos registrados.</p>
                {!isProfessional && (
                    <button 
                        onClick={() => navigate('search')}
                        className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all"
                    >
                        Buscar serviços agora
                    </button>
                )}
            </div>
        ) : (
            <div className="grid gap-4">
                {sortedAppointments.map(app => (
                    <AppointmentCard 
                        key={app.id} 
                        appt={app} 
                        isProfessional={isProfessional} 
                        onStatusUpdate={updateAppointmentStatus}
                        onReview={handleOpenReview}
                        onRebook={() => navigate('search')}
                    />
                ))}
            </div>
        )}
      </div>

      {reviewModalOpen && selectedAppt && (
          <ReviewModal 
             professionalName={selectedAppt.professionalName}
             serviceName={selectedAppt.serviceName}
             onClose={() => setReviewModalOpen(false)}
             onSubmit={handleSubmitReview}
          />
      )}
    </div>
  );
};

const AppointmentCard = ({ appt, isProfessional, onStatusUpdate, onReview, onRebook }: { 
    appt: Appointment, 
    isProfessional: boolean, 
    onStatusUpdate: (id: string, status: any) => void,
    onReview: (appt: Appointment) => void,
    onRebook: () => void
}) => {
    
    const getStatusColor = (s: string) => {
        switch(s) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'completed': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            case 'rejected': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (s: string) => {
        switch(s) {
            case 'pending': return 'Pendente';
            case 'confirmed': return 'Confirmado';
            case 'completed': return 'Concluído';
            case 'cancelled': return 'Cancelado';
            case 'rejected': return 'Recusado';
            default: return s;
        }
    };

    const isUpcoming = appt.status === 'pending' || appt.status === 'confirmed';

    return (
        <div className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all ${isUpcoming ? 'opacity-100 border-l-4 border-l-primary-500' : 'opacity-80 hover:opacity-100'}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isUpcoming ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Scissors size={20} />
                    </div>
                    <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{appt.serviceName}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {isProfessional ? `Cliente: ${appt.clientName || 'Anônimo'}` : appt.professionalName}
                    </p>
                    </div>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide border ${getStatusColor(appt.status)}`}>
                    {getStatusText(appt.status)}
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-50 text-sm">
                 <div className="flex items-center gap-2 text-gray-600">
                     <Calendar size={16} className="text-primary-400"/> 
                     <span className="font-medium">{new Date(appt.date).toLocaleDateString('pt-BR')}</span>
                 </div>
                 <div className="flex items-center gap-2 text-gray-600">
                     <Clock size={16} className="text-primary-400"/> 
                     <span className="font-medium">{appt.time}</span>
                 </div>
                 <div className="flex items-center gap-2 text-gray-600">
                     <span className="font-bold text-gray-900">R$ {appt.price.toFixed(2)}</span>
                     <span className="text-xs text-gray-400">({appt.paymentMethod === 'credit_card' ? 'Cartão' : appt.paymentMethod === 'pix' ? 'Pix' : 'Dinheiro'})</span>
                 </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2 mt-2 pt-3 border-t border-gray-50">
                {/* PROFESSIONAL ACTIONS */}
                {isProfessional && appt.status === 'pending' && (
                    <>
                        <button 
                            onClick={() => onStatusUpdate(appt.id, 'confirmed')}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                            <Check size={16} /> Aceitar
                        </button>
                        <button 
                            onClick={() => onStatusUpdate(appt.id, 'rejected')}
                            className="flex-1 bg-red-50 text-red-600 border border-red-100 py-2 rounded-lg font-bold text-sm hover:bg-red-100 flex items-center justify-center gap-2"
                        >
                            <X size={16} /> Recusar
                        </button>
                    </>
                )}
                {isProfessional && appt.status === 'confirmed' && (
                     <button 
                        onClick={() => onStatusUpdate(appt.id, 'completed')}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={16} /> Marcar como Concluído
                    </button>
                )}

                {/* CLIENT ACTIONS */}
                {!isProfessional && appt.status === 'pending' && (
                     <button 
                        onClick={() => onStatusUpdate(appt.id, 'cancelled')}
                        className="text-red-500 font-bold text-sm hover:underline flex items-center gap-1"
                    >
                        <X size={14} /> Cancelar Solicitação
                    </button>
                )}
                
                {!isProfessional && (appt.status === 'completed' || appt.status === 'cancelled') && (
                    <div className="flex gap-2 w-full justify-end">
                        {appt.status === 'completed' && !appt.hasReviewed && (
                            <button
                                onClick={() => onReview(appt)}
                                className="flex items-center gap-1 text-yellow-600 border border-yellow-200 bg-yellow-50 font-bold text-xs hover:bg-yellow-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Star size={12} /> Avaliar
                            </button>
                        )}
                        <button 
                            onClick={onRebook}
                            className="flex items-center gap-1 text-primary-600 font-bold text-xs hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <RefreshCw size={12} /> Reagendar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const ReviewModal = ({ professionalName, serviceName, onClose, onSubmit }: { professionalName: string, serviceName: string, onClose: () => void, onSubmit: (rating: number, comment: string) => void }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(rating, comment);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
             <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                 <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                     <h3 className="font-bold text-gray-900">Avaliar Experiência</h3>
                     <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
                 </div>
                 <form onSubmit={handleSubmit} className="p-6">
                     <div className="text-center mb-6">
                         <p className="text-sm text-gray-500 mb-1">Como foi o serviço de</p>
                         <p className="font-bold text-gray-900 text-lg">{serviceName}</p>
                         <p className="text-xs text-primary-600 font-bold">com {professionalName}</p>
                     </div>

                     <div className="flex justify-center gap-2 mb-6">
                         {[1, 2, 3, 4, 5].map((star) => (
                             <button 
                               key={star} 
                               type="button"
                               onClick={() => setRating(star)}
                               className="transition-transform hover:scale-110 focus:outline-none"
                             >
                                 <Star 
                                   size={32} 
                                   className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-100"} 
                                   strokeWidth={1}
                                 />
                             </button>
                         ))}
                     </div>

                     <div className="mb-6">
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Comentário (Opcional)</label>
                         <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-200 outline-none resize-none h-24 bg-white text-gray-900"
                            placeholder="Conte como foi sua experiência..."
                         />
                     </div>

                     <button 
                       type="submit"
                       className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
                     >
                         Enviar Avaliação
                     </button>
                 </form>
             </div>
        </div>
    );
};