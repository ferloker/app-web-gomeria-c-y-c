import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useSettings } from '../hooks/useFirebaseData';

export default function SosPage() {
  const navigate = useNavigate();
  const { settings, loading } = useSettings();
  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState('');
  const [service, setService] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const isPaused = settings.pause_auxilio;
  const phoneNumber = settings.whatsapp_number || '1234567890';

  const handleNext = () => setStep(step + 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const locationMsg = 'https://maps.google.com'; 
    const msg = `🚨 *NUEVO PEDIDO DE AUXILIO* | Cliente: ${formData.name} | Teléfono: ${formData.phone} | Vehículo: ${vehicle} | Servicio: ${service || 'General'} | Ubicación GPS: ${locationMsg}`;
    window.location.href = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-100 pb-20">
      <Header isOpen={settings.is_open} />
      
      <main className="p-4 mt-4 max-w-md mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-slate-400">
          <span className="material-symbols-outlined">arrow_back</span> Volver
        </button>

        {isPaused ? (
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl text-center">
            <span className="material-symbols-outlined text-6xl text-slate-500 mb-4">emergency_home</span>
            <h2 className="text-xl font-bold mb-2">Servicio Suspendido</h2>
            <p className="text-slate-400 text-sm">El servicio de auxilio no se encuentra disponible en este momento. Por favor, intenta más tarde.</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-black mb-6 text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">car_crash</span> Pedir Auxilio
            </h2>

            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-slate-300 font-medium text-lg">1. Selecciona tu vehículo:</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Auto', 'Camioneta', 'Camión', 'Moto'].map(v => (
                    <button 
                      key={v} 
                      onClick={() => { 
                        setVehicle(v); 
                        if(v==='Auto' || v==='Camioneta') { setStep(2); } 
                        else { setStep(2); } // Proceed to service selection for all to be safe, or skip
                      }} 
                      className="bg-slate-900/50 hover:bg-slate-800 border border-white/10 py-5 rounded-xl flex flex-col items-center justify-center gap-2 text-sm font-bold active:border-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-3xl text-slate-400 pb-1">
                        {v === 'Auto' ? 'directions_car' : v === 'Moto' ? 'two_wheeler' : v === 'Camioneta' ? 'local_shipping' : 'rv_hookup'}
                      </span>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-slate-300 font-medium text-lg">2. ¿Qué problema tienes?</p>
                <div className="space-y-3">
                  {['Llanta pinchada', 'Batería descargada', 'Necesito grúa', 'Otro problema mecánico'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => { setService(s); handleNext(); }} 
                      className="w-full bg-slate-900/50 hover:bg-slate-800 border-l-4 border-l-transparent hover:border-l-primary border border-white/10 py-4 px-4 rounded-xl font-semibold text-left flex justify-between items-center transition-all"
                    >
                      {s} <span className="material-symbols-outlined text-slate-500">chevron_right</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(1)} className="text-sm text-slate-500 pt-4 underline">Volver al paso anterior</button>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-slate-300 font-medium text-lg">3. Tus datos de contacto:</p>
                
                <div className="bg-slate-900/30 p-4 rounded-xl border border-white/5 mb-4 text-sm text-slate-400">
                  <span className="text-white font-bold">Resumen:</span> {vehicle} • {service}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-400">Nombre completo</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Ej: Juan Pérez" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-400">Número de Teléfono</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Ej: 0981 123 456" />
                </div>
                
                <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-black text-white mt-6 shadow-lg shadow-green-600/20 flex justify-center items-center gap-2 active:scale-95 transition-all">
                  <img src="/assets/WhatsApp.png" className="w-6 h-6 object-contain" /> Enviar ubicación y pedir
                </button>
                
                <button type="button" onClick={() => setStep(2)} className="text-sm text-slate-500 pt-2 w-full text-center underline">Volver al paso anterior</button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
