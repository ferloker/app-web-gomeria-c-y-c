import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useSettings } from '../hooks/useGitData';

export default function Home() {
  const { settings, loading } = useSettings();
  const [vehicle, setVehicle] = useState('');
  const [service, setService] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const isPaused = settings?.pause_auxilio;
  const phoneNumber = settings?.whatsapp_number || '1234567890';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vehicle || !service || !formData.name || !formData.phone) return alert('Completa todos los datos obligatorios.');
    const locationMsg = 'https://maps.google.com'; 
    const msg = `🚨 *NUEVO PEDIDO DE AUXILIO* | Cliente: ${formData.name} | Tel: ${formData.phone} | Vehículo: ${vehicle} | Problema: ${service} | Ubicación GPS: ${locationMsg}`;
    window.location.href = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-100 pb-20">
      <Header isOpen={settings ? settings.is_open : true} />
      <main className="pb-8 space-y-6">
        {/* Banner Hero */}
        <section className="relative bg-gradient-to-b from-red-950/40 to-background-dark border-b border-red-500/20 pt-4 pb-10 px-4 rounded-b-[40px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
          <div className="max-w-md mx-auto relative z-10 text-center flex flex-col items-center">
             <div className="size-20 bg-slate-900 rounded-3xl border border-white/10 shadow-2xl mb-4 flex items-center justify-center overflow-hidden p-2">
                <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
             </div>
             <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Gomería <span className="text-primary">C y C</span></h1>
             <p className="text-slate-400 text-sm font-medium mb-5 px-4">Especialistas en neumáticos y auxilio en ruta. Calidad y velocidad garantizada en Santaní.</p>
             <div className="flex flex-wrap gap-2 justify-center">
               <span className="bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 shadow-inner flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-primary">emergency</span> Auxilio 24/7</span>
               <span className="bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 shadow-inner flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">sell</span> Llantas Nuevas</span>
               <span className="bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 shadow-inner flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">recycling</span> Usadas</span>
             </div>
          </div>
        </section>

        <div className="px-4 max-w-md mx-auto space-y-6">
        {/* Tienda Button */}
        <Link to="/tienda" className="relative overflow-hidden bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 active:scale-95 transition-transform flex items-center justify-between shadow-xl shadow-slate-900">
          <div className="relative z-10">
            <h2 className="text-2xl font-black tracking-tighter">Tienda de Neumáticos</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Ir al Catálogo de Llantas 🆕 y ♻️</p>
          </div>
          <div className="size-12 rounded-full bg-slate-800/80 border border-slate-700 outline outline-2 outline-transparent flex items-center justify-center relative z-10">
             <span className="material-symbols-outlined text-3xl text-slate-300">shopping_cart</span>
          </div>
          <span className="material-symbols-outlined absolute right-[-10px] bottom-[-10px] text-[100px] opacity-5 pointer-events-none text-slate-300">storefront</span>
        </Link>

        {/* SOS Formulario Directo */}
        <div className="bg-red-950/20 border border-red-500/20 px-5 pt-5 pb-6 rounded-3xl shadow-2xl relative overflow-hidden">
           <span className="material-symbols-outlined absolute right-[-20px] top-[-20px] text-[150px] opacity-[0.03] pointer-events-none text-red-500">emergency_home</span>
           
           <h2 className="text-2xl font-black mb-6 text-primary flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined">car_crash</span> Pedir Auxilio 24/7
           </h2>
           
           {isPaused ? (
             <div className="bg-slate-900/80 border border-white/5 p-6 rounded-2xl text-center relative z-10">
                <span className="material-symbols-outlined text-5xl text-slate-500 mb-2">no_crash</span>
                <h3 className="font-bold text-lg text-slate-300">Servicio Pausado</h3>
                <p className="text-sm text-slate-400 mt-1">El auxilio en ruta no está disponible en este momento.</p>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-300 ml-1">1. ¿Qué vehículo tienes?</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Auto', 'Camioneta', 'Camión', 'Moto'].map(v => (
                       <button type="button" key={v} onClick={() => setVehicle(v)} className={`py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 border transition-all ${vehicle === v ? 'bg-red-500/10 border-red-500 text-red-500 shadow-inner scale-105' : 'bg-slate-900/50 border-white/5 hover:border-white/10 text-slate-400'}`}>
                         <span className="material-symbols-outlined text-2xl">{v === 'Auto'?'directions_car':v==='Moto'?'two_wheeler':v==='Camioneta'?'airport_shuttle':'local_shipping'}</span>
                         <span className="text-[10px] font-bold uppercase tracking-wider">{v}</span>
                       </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-300 ml-1">2. Problema con tu vehículo</label>
                  <div className="relative">
                    <select required value={service} onChange={e=>setService(e.target.value)} className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-4 text-white appearance-none outline-none focus:border-red-500 focus:bg-slate-900 transition-colors shadow-inner">
                      <option value="" disabled>Selecciona la falla...</option>
                      <option value="Llanta pinchada">Llanta pinchada</option>
                      <option value="Batería descargada">Batería descargada</option>
                      <option value="Necesito grúa">Necesito grúa</option>
                      <option value="Otro problema mecánico">Otro problema mecánico</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-4 text-slate-500 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-300 ml-1">3. Tus Datos de Contacto</label>
                  <div className="space-y-3">
                    <input required type="text" placeholder="Tu Nombre y Apellido" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-red-500 focus:bg-slate-900 shadow-inner transition-colors" />
                    <input required type="tel" placeholder="Número de Celular" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-red-500 focus:bg-slate-900 shadow-inner transition-colors" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-red-500 py-4 rounded-xl font-black text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] flex justify-center items-center gap-2 active:scale-[0.98] transition-all text-lg border border-red-400/50 mt-4">
                  <span className="material-symbols-outlined text-[18px]">location_on</span> Enviar Ubicación y Pedir
                </button>
             </form>
           )}
        </div>

        {/* Info Card */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <h3 className="text-xl font-black text-white mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">store</span> Información Local
          </h3>
          
          <div className="space-y-5 mt-5">
            <div className="flex items-start gap-4">
               <div className="size-11 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 shadow-inner shrink-0 mt-1">
                 <span className="material-symbols-outlined">schedule</span>
               </div>
               <div className="space-y-2 w-full">
                  <p className="text-sm font-black text-slate-200 uppercase tracking-wide">Horarios de Atención</p>
                  <div className="bg-background-dark/50 border border-white/5 p-3 rounded-xl">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                       <span className="text-sm text-slate-400 font-medium tracking-tight">Lunes a Sábado</span>
                       <span className="text-xs font-bold text-white text-right w-1/2">{settings?.hours_weekdays || '07:00 a 19:00'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-400 font-medium tracking-tight">Domingos</span>
                       <span className="text-xs font-bold text-white text-right w-1/2">{settings?.hours_sundays || 'Cerrado'}</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex items-start gap-4">
               <div className="size-11 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 shadow-inner shrink-0 mt-1">
                 <span className="material-symbols-outlined">map</span>
               </div>
               <div className="space-y-3 w-full">
                  <p className="text-sm font-black text-slate-200 uppercase tracking-wide">Dónde Estamos</p>
                  
                  <div className="w-full h-40 bg-slate-800 rounded-xl overflow-hidden border border-white/5 relative shadow-inner animate-in zoom-in duration-1000 ease-out fill-mode-both">
                     <iframe 
                       src={`/map.html?lat=${settings?.map_lat || '-24.661366060311497'}&lng=${settings?.map_lng || '-56.44231702242412'}`} 
                       width="100%" 
                       height="100%" 
                       style={{ border: 0 }} 
                       allowFullScreen="" 
                       loading="lazy" 
                     ></iframe>
                  </div>

                  {settings?.maps_link ? (
                     <a href={settings.maps_link} target="_blank" rel="noreferrer" className="w-full bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold mt-2 shadow-inner border border-white/5">
                       <span className="material-symbols-outlined text-[18px]">directions</span> Abrir en Google Maps
                     </a>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium">San Estanislao, San Pedro, PY</p>
                  )}
               </div>
            </div>
          </div>
        </div>
        </div>
      </main>

      {/* Floating WhatsApp Global */}
      {settings?.whatsapp_number && (
        <a href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hola,%20tengo%20una%20consulta.`} target="_blank" rel="noreferrer" className="fixed bottom-6 right-4 z-40 size-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] active:scale-90 transition-transform hover:bg-[#20bd5a]">
           <img src="/assets/WhatsApp.png" className="w-8 h-8 object-contain" alt="WhatsApp" />
        </a>
      )}
    </div>
  );
}
