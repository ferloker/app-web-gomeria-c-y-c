import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useSettings } from '../hooks/useFirebaseData';

export default function Home() {
  const { settings, loading } = useSettings();

  if (loading) {
    return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-background-dark font-display">
      <Header isOpen={settings.is_open} />
      
      <main className="p-4 space-y-6 pb-32 max-w-md mx-auto">
        <section className="mt-8 mb-10 space-y-3">
          <h1 className="text-4xl font-black text-slate-100 leading-tight">Expertos en<br/><span className="text-primary">Neumáticos y Auxilio</span></h1>
          <p className="text-slate-400 text-sm">Tu gomería de confianza, ahora en tu bolsillo. Solucionamos tu problema estés donde estés.</p>
        </section>

        <div className="grid gap-4">
          <Link to="/sos" className="relative overflow-hidden bg-gradient-to-br from-red-600 to-red-900 text-white rounded-2xl p-6 shadow-2xl shadow-primary/20 active:scale-95 transition-transform flex flex-col justify-center min-h-[140px]">
            <span className="material-symbols-outlined absolute right-[-10px] bottom-[-10px] text-8xl opacity-10">emergency_home</span>
            <span className="material-symbols-outlined text-4xl mb-3">car_crash</span>
            <h2 className="text-2xl font-black tracking-tighter">Pedir Auxilio</h2>
            <p className="text-white/80 text-sm font-medium">Asistencia rápida en ruta 24/7</p>
          </Link>

          <Link to="/tienda" className="relative overflow-hidden bg-slate-800 text-white border border-slate-700 rounded-2xl p-6 active:scale-95 transition-transform flex flex-col justify-center min-h-[140px]">
            <span className="material-symbols-outlined absolute right-[-10px] bottom-[-10px] text-8xl opacity-10">storefront</span>
            <span className="material-symbols-outlined text-4xl mb-3 text-slate-400">inventory_2</span>
            <h2 className="text-2xl font-black tracking-tighter">Catálogo de Tienda</h2>
            <p className="text-slate-400 text-sm font-medium">Llantas nuevas, usadas y repuestos</p>
          </Link>
        </div>
        
        <section className="bg-white/5 rounded-2xl p-5 border border-white/5 mt-8">
          <h4 className="text-slate-100 font-bold mb-4">Nuestros Servicios</h4>
          <div className="grid grid-cols-3 gap-4">
            {['Alineación', 'Balanceo', 'Lubricentro', 'Frenos', 'Baterías', 'Parches'].map(s => (
              <div key={s} className="flex flex-col items-center gap-2 text-center">
                <div className="size-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">build</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 leading-tight">{s}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <a href={`https://wa.me/${settings.whatsapp_number?.replace(/[^0-9]/g, '')}?text=Hola,%20tengo%20una%20consulta.`} target="_blank" rel="noreferrer" className="fixed bottom-6 right-4 z-40 size-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 active:scale-90 transition-transform">
         <img src="/assets/WhatsApp.png" className="w-8 h-8 object-contain" />
      </a>
    </div>
  );
}
