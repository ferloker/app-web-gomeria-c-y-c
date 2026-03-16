import { useState } from 'react';

export default function SosWizard({ isPaused, phoneNumber }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState('');
  const [service, setService] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleOpen = () => {
    if (isPaused) return;
    setIsOpen(true);
  };

  const handleNext = () => setStep(step + 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const locationMsg = 'https://maps.google.com'; // In a real app, grab HTML5 geoloc
    const msg = `🚨 *NUEVO PEDIDO DE AUXILIO* | Cliente: ${formData.name} | Teléfono: ${formData.phone} | Vehículo: ${vehicle} | Servicio: ${service || 'General'} | Ubicación GPS: ${locationMsg}`;
    window.location.href = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
    setIsOpen(false);
  };

  return (
    <>
      <section className="relative overflow-hidden rounded-xl p-1 shadow-2xl shadow-primary/20" style={{background: isPaused ? '#475569' : 'linear-gradient(to bottom right, #ec1313, #7f1d1d)'}}>
        <button 
          onClick={handleOpen}
          disabled={isPaused}
          className={`relative w-full flex flex-col items-center justify-center py-8 px-4 rounded-lg active:scale-95 transition-transform ${isPaused ? 'bg-slate-600 cursor-not-allowed' : 'bg-primary cursor-pointer'}`}
        >
          <div className="absolute top-2 right-2 opacity-20">
            <span className="material-symbols-outlined text-6xl">emergency_home</span>
          </div>
          <span className="text-white text-2xl font-black tracking-tighter mb-1">
            {isPaused ? 'SERVICIO SUSPENDIDO' : '🚨 PEDIR AUXILIO AHORA'}
          </span>
          <p className="text-white/80 text-xs font-medium uppercase tracking-[0.2em]">Asistencia en ruta 24/7</p>
        </button>
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">Pedir Auxilio</h3>
            
            {step === 1 && (
              <div className="space-y-4">
                <p>Selecciona tu vehículo:</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Auto', 'Camioneta', 'Camión', 'Moto'].map(v => (
                    <button key={v} onClick={() => { setVehicle(v); if(v==='Auto' || v==='Camioneta') handleNext(); else { setService('-'); setStep(3); } }} className="bg-white/5 border border-white/10 py-4 rounded-xl flex flex-col items-center text-sm font-semibold active:bg-primary">
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p>¿Qué servicio necesitas?</p>
                <div className="space-y-3">
                  {['Motocarro', 'Moto para llanta'].map(s => (
                    <button key={s} onClick={() => { setService(s); handleNext(); }} className="w-full bg-white/5 border border-white/10 py-3 rounded-xl font-semibold active:bg-primary">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Nombre</label>
                  <input required type="text" onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Teléfono</label>
                  <input required type="tel" onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                </div>
                <button type="submit" className="w-full bg-primary py-3 rounded-lg font-bold text-white mt-4">Enviar a WhatsApp</button>
              </form>
            )}
            
            <button onClick={() => setIsOpen(false)} className="mt-4 text-sm text-slate-500 w-full text-center">Cancelar</button>
          </div>
        </div>
      )}
    </>
  );
}
