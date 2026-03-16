import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import StoreModule from '../components/StoreModule';
import { useSettings, useInventory } from '../hooks/useFirebaseData';

export default function StorePage() {
  const navigate = useNavigate();
  const { settings, loading: settingsLoading } = useSettings();
  const { inventory, loading: inventoryLoading } = useInventory();

  if (settingsLoading || inventoryLoading) {
    return <div className="min-h-screen bg-background-dark text-white p-6">Cargando catálogo...</div>;
  }

  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-100 pb-20">
      <Header isOpen={settings.is_open} />
      
      <main className="p-4 mt-2 max-w-md mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-slate-400">
          <span className="material-symbols-outlined">arrow_back</span> Volver al inicio
        </button>

        <StoreModule products={inventory} />
      </main>
    </div>
  );
}
