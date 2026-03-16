import Header from '../components/Header';
import SosWizard from '../components/SosWizard';
import StoreModule from '../components/StoreModule';
import { useSettings, useInventory } from '../hooks/useFirebaseData';

export default function Home() {
  const { settings, loading: settingsLoading } = useSettings();
  const { inventory, loading: inventoryLoading } = useInventory();

  if (settingsLoading || inventoryLoading) {
    return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">Cargando...</div>;
  }

  return (
    <>
      <Header isOpen={settings.is_open} />
      
      <main className="p-4 space-y-6 pb-32">
        <SosWizard isPaused={settings.pause_auxilio} phoneNumber={settings.whatsapp_number} />
        
        <StoreModule products={inventory} />
        
        <section className="bg-primary/5 rounded-2xl p-4 border border-primary/20 mt-6">
          <h4 className="text-slate-100 font-bold mb-3">Nuestros Servicios</h4>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {['Alineación', 'Balanceo', 'Lubricentro', 'Frenos', 'Baterías'].map(s => (
              <div key={s} className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="size-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">car_repair</span>
                </div>
                <span className="text-[10px] font-bold text-slate-300">{s}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <a href={`https://wa.me/${settings.whatsapp_number?.replace(/[^0-9]/g, '')}?text=Hola,%20tengo%20una%20consulta%20general.`} target="_blank" className="fixed bottom-24 right-4 z-40 size-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 active:scale-90 transition-transform">
         <img src="/assets/WhatsApp.png" className="w-8 h-8 object-contain" />
      </a>

      <nav className="fixed bottom-0 inset-x-0 z-50 px-4 pb-8 pt-4 bg-background-dark/80 backdrop-blur-md border-t border-white/5">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => alert('Carrito TBD')} className="flex-1 bg-primary text-white h-14 rounded-xl flex items-center justify-between px-6 shadow-xl shadow-primary/30 active:scale-95 transition-transform">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="font-black tracking-tight">VER CARRITO</span>
            </div>
          </button>
        </div>
      </nav>
    </>
  );
}
