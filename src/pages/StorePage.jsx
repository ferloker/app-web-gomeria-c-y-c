import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import StoreModule from '../components/StoreModule';
import { useSettings, useInventory } from '../hooks/useFirebaseData';

export default function StorePage() {
  const navigate = useNavigate();
  const { settings, loading: settingsLoading } = useSettings();
  const { inventory, loading: inventoryLoading } = useInventory();

  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-100 pb-20">
      <Header isOpen={settings.is_open} />
      
      <main className="p-4 mt-2 max-w-md mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-slate-400">
          <span className="material-symbols-outlined">arrow_back</span> Volver al inicio
        </button>

        {inventoryLoading ? (
           <div className="text-center text-slate-400 py-10 flex flex-col items-center gap-3">
             <span className="material-symbols-outlined animate-spin">sync</span>
             <span>Cargando catálogo en vivo...</span>
           </div>
        ) : (
           <StoreModule products={inventory} />
        )}
      </main>
    </div>
  );
}
