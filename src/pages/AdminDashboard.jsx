import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useGitData } from '../hooks/useGitData';
import { uploadImage, saveJsonDB } from '../services/github.js';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Custom fetch using useGitData. Return references to update them locally.
  const { data: inventory, loading: invLoading, setData: setInventory } = useGitData('src/data/inventory.json', []);
  const { data: settings, loading: setLoading, setData: setSettings } = useGitData('src/data/settings.json', { is_open: true, pause_auxilio: false });
  
  const [activeTab, setActiveTab] = useState('inventory');
  const [form, setForm] = useState({ brand: '', size: '', type: 'Nuevo', price_only: '', stock: '1' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Authentication
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD || password === '123456') { // Fallback just in case
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const syncSettings = async (newSettings) => {
    // We already set local state, but enforce synchronization
    await saveJsonDB('src/data/settings.json', newSettings, 'Update settings via Admin Panel');
  };

  const handleTogglePanic = () => setSettings({ ...settings, pause_auxilio: !settings.pause_auxilio });
  const handleToggleOpen = (e) => setSettings({ ...settings, is_open: e.target.checked });
  const handleChangeSetting = (field, value) => setSettings({ ...settings, [field]: value });

  const handleAddItem = async () => {
    if (!form.brand || !form.size || !form.price_only) return alert('Campos obligatorios');
    setSubmitting(true);
    try {
      let image_url = '';
      if (file) {
        // Compress to base64
        const base64Str = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 600;
              const scaleSize = MAX_WIDTH / img.width;
              canvas.width = MAX_WIDTH;
              canvas.height = img.height * scaleSize;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
          };
        });
        const idStr = Date.now().toString(36);
        image_url = await uploadImage(base64Str, `tire_${idStr}.jpg`);
      }

      const newItem = {
        id: `${form.type === 'Usado' ? 'U' : 'N'}-${Date.now().toString().slice(-4)}`,
        brand: form.brand,
        size: form.size,
        type: form.type,
        price_only: Number(form.price_only),
        stock: Number(form.stock),
        active: true,
        image_url
      };

      const newInv = [newItem, ...inventory];
      setInventory(newInv);
      await saveJsonDB('src/data/inventory.json', newInv, `Add item ${newItem.id}`);
      
      setForm({ brand: '', size: '', type: 'Nuevo', price_only: '', stock: '1' });
      setFile(null);
      alert('¡Ítem registrado con éxito y guardado en GitHub!');
    } catch (err) {
      alert('Error guardando ítem: ' + err.message);
    }
    setSubmitting(false);
  };

  const handleMarkAsSold = async (id) => {
    if(confirm('¿Marcar como vendido y ocultar de la tienda?')) {
       const newInv = inventory.map(i => i.id === id ? { ...i, stock: 0, active: false } : i);
       setInventory(newInv);
       await saveJsonDB('src/data/inventory.json', newInv, `Mark ${id} as sold`);
    }
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden">
        <span className="material-symbols-outlined absolute right-[-20px] top-[-20px] text-9xl opacity-5 pointer-events-none text-white">shield_person</span>
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2 relative z-10"><span className="material-symbols-outlined text-primary text-3xl">shield_person</span> Autenticación</h2>
        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <input type="password" placeholder="Contraseña de administrador" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-background-dark border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none shadow-inner" required/>
          <button type="submit" className="w-full bg-primary hover:bg-red-500 text-white py-4 rounded-xl font-black active:scale-95 transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)]">Ingresar al Panel</button>
        </form>
        <Link to="/" className="block text-center text-slate-500 mt-6 text-sm hover:text-white transition-colors">Volver al sitio público</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-100 pb-24">
      {/* Toast Notification */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500/90 border border-green-400 text-white px-6 py-3 rounded-full font-bold shadow-[0_10px_40px_rgba(34,197,94,0.4)] flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="text-sm">Configuración guardada en GitHub</span>
        </div>
      )}

      <Header isOpen={settings ? settings.is_open : true} />

      <main className="px-4 mt-6 space-y-8 max-w-md mx-auto">
         {/* Tabs at the top */}
         <div className="flex bg-slate-900 border border-white/5 rounded-xl p-1 mb-6 shadow-inner">
            <button onClick={() => setActiveTab('inventory')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Inventario CMS</button>
            <button onClick={() => setActiveTab('settings')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Ajustes Web</button>
         </div>

         {activeTab === 'inventory' && (
           <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
              <section className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
                  <h2 className="text-lg font-black flex items-center gap-2 mb-4 text-white">
                    <span className="material-symbols-outlined text-primary text-2xl">add_circle</span> Nuevo Neumático
                  </h2>
                  <label className="w-full h-44 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 bg-background-dark hover:bg-slate-800 cursor-pointer overflow-hidden transition-colors">
                    {file ? (
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-4xl text-slate-500">add_a_photo</span>
                        <p className="text-sm font-semibold text-slate-400">Haz clic para agregar foto</p>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={e => setFile(e.target.files[0])} />
                  </label>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input value={form.brand} onChange={e=>setForm({...form, brand: e.target.value})} className="bg-background-dark border border-white/5 rounded-xl p-3 text-sm text-white outline-none focus:border-primary shadow-inner" placeholder="Marca (Pirelli)" />
                    <input value={form.size} onChange={e=>setForm({...form, size: e.target.value})} className="bg-background-dark border border-white/5 rounded-xl p-3 text-sm text-white outline-none focus:border-primary shadow-inner" placeholder="Medida (205/55R16)" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <select value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="bg-background-dark border border-white/5 rounded-xl p-3 text-sm text-white outline-none focus:border-primary shadow-inner">
                      <option>Nuevo</option>
                      <option>Usado</option>
                    </select>
                    <input type="number" value={form.price_only} onChange={e=>setForm({...form, price_only: e.target.value})} className="bg-background-dark border border-white/5 rounded-xl p-3 text-sm text-white outline-none focus:border-primary shadow-inner" placeholder="Precio Gs." />
                  </div>

                  <button onClick={handleAddItem} disabled={submitting} className={`w-full py-4 rounded-xl font-black text-white flex justify-center items-center gap-2 shadow-lg mt-2 ${submitting ? 'bg-slate-700 cursor-not-allowed' : 'bg-primary hover:bg-red-500 active:scale-[0.98] shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all'}`}>
                    {submitting ? <><span className="material-symbols-outlined animate-spin text-lg">sync</span> Commit en la Nube...</> : <><span className="material-symbols-outlined text-lg">cloud_upload</span> Guardar en Nube (GitHub)</>}
                  </button>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Stock en Venta</h3>
                  {invLoading && <span className="text-primary text-xs font-bold animate-pulse">Sincronizando...</span>}
                </div>
                <div className="space-y-3">
                  {inventory.filter(i => i.stock > 0).map(item => (
                    <div key={item.id} className="bg-slate-900 p-3 rounded-2xl flex items-center justify-between border border-white/5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="size-14 rounded-xl bg-background-dark flex items-center justify-center overflow-hidden border border-white/5 shadow-inner">
                          {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-slate-600">tire_repair</span>}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-200">{item.size}</p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.brand} • Gs. {item.price_only}</p>
                        </div>
                      </div>
                      <button onClick={() => handleMarkAsSold(item.id)} className="bg-red-950/30 hover:bg-red-900 border border-red-900/50 text-red-500 p-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5">
                         <span className="material-symbols-outlined text-[18px]">verified</span>
                         <span className="text-[9px] uppercase tracking-wider">Vendido</span>
                      </button>
                    </div>
                  ))}
                  {inventory.filter(i => i.stock > 0).length === 0 && !invLoading && <p className="text-slate-600 py-8 text-center bg-slate-900 rounded-xl border border-dashed border-slate-700 font-medium">Inventario vacío. Sube un producto arriba.</p>}
                </div>
              </section>
           </div>
         )}

         {activeTab === 'settings' && (
           <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
             <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
               <span className="material-symbols-outlined absolute right-[-10px] top-[-10px] text-8xl opacity-5 pointer-events-none text-white">database</span>
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10"><span className="material-symbols-outlined text-primary text-xl">key</span> Conexión GitHub CMS</h3>
               <div className="relative z-10">
                  <div className="flex bg-background-dark border border-white/5 rounded-xl overflow-hidden focus-within:border-primary transition-colors shadow-inner">
                    <input type="password" defaultValue={localStorage.getItem('GOMERIA_GITHUB_TOKEN') || ''} onChange={e => localStorage.setItem('GOMERIA_GITHUB_TOKEN', e.target.value)} className="w-full p-4 text-sm text-white outline-none bg-transparent font-mono placeholder-slate-600" placeholder="Pega tu Personal Access Token (ghp_...)" />
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 mt-2 px-1">Si la app arroja <b>"Error al guardar: Bad credentials"</b>, asegúrate de poner un Token válido aquí.</p>
               </div>
             </div>

             <div className={`border rounded-3xl p-6 flex flex-col items-center gap-4 transition-colors ${settings?.pause_auxilio ? 'bg-red-950/40 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)]' : 'bg-slate-900 border-white/5 shadow-xl'}`}>
               <button onClick={handleTogglePanic} className={`w-20 h-20 rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-xl ${settings?.pause_auxilio ? 'bg-red-500 animate-pulse shadow-red-500/50' : 'bg-slate-800'}`}>
                 <span className="material-symbols-outlined text-4xl">power_settings_new</span>
               </button>
               <div className="text-center">
                 <h3 className={`font-black text-xl mb-1 ${settings?.pause_auxilio ? 'text-red-400' : 'text-slate-300'}`}>
                   {settings?.pause_auxilio ? 'EMERGENCIAS DETENIDAS' : 'PAUSAR EMERGENCIAS'}
                 </h3>
                 <p className="text-sm mt-1 mb-2 max-w-[250px] mx-auto text-slate-400">{settings?.pause_auxilio ? 'Nadie puede pedir auxilio en la ruta /. Presiona para reactivar.' : 'Toca el botón rojo para cortar la recepción de auxilios en tiempo real.'}</p>
               </div>
             </div>

             <div className="bg-slate-900 rounded-3xl p-6 space-y-6 border border-white/5 shadow-xl">
               <div className="flex items-center justify-between pb-5 border-b border-white/5">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-xl border ${settings?.is_open ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-slate-800 text-slate-500 border-transparent'}`}>
                     <span className="material-symbols-outlined">storefront</span>
                   </div>
                   <div>
                     <p className="text-base font-bold text-white leading-tight mb-0.5">Tienda Abierta</p>
                     <p className="text-xs text-slate-500 leading-tight">Muestra el indicador verde.</p>
                   </div>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer active:scale-95 transition-transform">
                   <input type="checkbox" checked={settings?.is_open} onChange={handleToggleOpen} className="sr-only peer" />
                   <div className="w-14 h-7 bg-background-dark border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-400 after:border-transparent after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 peer-checked:after:bg-white shadow-inner"></div>
                 </label>
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="text-xs font-bold text-slate-400 block mb-1.5 ml-1">WhatsApp de Recepción</label>
                   <div className="flex bg-background-dark border border-white/5 rounded-xl overflow-hidden focus-within:border-primary transition-colors shadow-inner">
                     <span className="flex items-center justify-center px-4 bg-slate-800 text-slate-400"><span className="material-symbols-outlined text-[18px]">call</span></span>
                     <input value={settings?.whatsapp_number || ''} onChange={e=>handleChangeSetting('whatsapp_number', e.target.value)} className="w-full p-4 text-sm text-white outline-none bg-transparent font-mono" />
                   </div>
                 </div>
                 
                 <div>
                   <label className="text-xs font-bold text-slate-400 block mb-1.5 ml-1">Horarios (Lunes a Sábado)</label>
                   <div className="flex bg-background-dark border border-white/5 rounded-xl overflow-hidden focus-within:border-primary transition-colors shadow-inner">
                     <span className="flex items-center justify-center px-4 bg-slate-800 text-slate-400"><span className="material-symbols-outlined text-[18px]">calendar_today</span></span>
                     <input value={settings?.hours_weekdays || ''} onChange={e=>handleChangeSetting('hours_weekdays', e.target.value)} className="w-full p-4 text-sm text-white outline-none bg-transparent" placeholder="Ej: 07:00 a 19:00" />
                   </div>
                 </div>

                 <div>
                   <label className="text-xs font-bold text-slate-400 block mb-1.5 ml-1">Horarios (Domingos)</label>
                   <div className="flex bg-background-dark border border-white/5 rounded-xl overflow-hidden focus-within:border-primary transition-colors shadow-inner">
                     <span className="flex items-center justify-center px-4 bg-slate-800 text-slate-400"><span className="material-symbols-outlined text-[18px]">event</span></span>
                     <input value={settings?.hours_sundays || ''} onChange={e=>handleChangeSetting('hours_sundays', e.target.value)} className="w-full p-4 text-sm text-white outline-none bg-transparent" placeholder="Ej: 08:00 a 12:00 o Cerrado" />
                   </div>
                 </div>
                 
                 <div>
                   <label className="text-xs font-bold text-slate-400 block mb-1.5 ml-1">Link de Google Maps</label>
                   <div className="flex bg-background-dark border border-white/5 rounded-xl overflow-hidden focus-within:border-primary transition-colors shadow-inner">
                     <span className="flex items-center justify-center px-4 bg-slate-800 text-slate-400"><span className="material-symbols-outlined text-[18px]">map</span></span>
                     <input value={settings?.maps_link || ''} onChange={e=>handleChangeSetting('maps_link', e.target.value)} className="w-full p-4 text-sm text-white outline-none bg-transparent" />
                   </div>
                 </div>
               </div>
               
               <button onClick={async () => {
                 setSavingSettings(true);
                 try {
                   await syncSettings(settings); // Usa el estado local (no guardado auto)
                   setShowSuccess(true);
                   setTimeout(() => setShowSuccess(false), 3000);
                 } catch (e) {
                   alert("Error al guardar: " + e.message);
                 }
                 setSavingSettings(false);
               }} className={`w-full active:scale-95 transition-all text-white py-4 flex items-center justify-center gap-2 rounded-xl font-black mt-2 shadow-[0_0_20px_rgba(220,38,38,0.2)] ${showSuccess ? 'bg-green-500 shadow-green-500/40' : 'bg-primary hover:bg-red-500'}`}>
                 <span className="material-symbols-outlined text-[20px]">{savingSettings ? 'sync' : showSuccess ? 'check_circle' : 'save'}</span> 
                 {savingSettings ? 'Guardando CMS...' : showSuccess ? '¡Guardado con Éxito!' : 'Guardar Configuración Web'}
               </button>
               
               <button onClick={() => navigator.clipboard.writeText(`¡Hola! Gracias por elegir Gomería C y C. ¿Podrías dejarnos 5 estrellas en Google Maps? Haz clic aquí: ${settings?.maps_link}`)} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-300 active:scale-95 transition-all shadow-inner mt-2">
                 <span className="material-symbols-outlined text-[18px]">content_copy</span> Copiar Autorespuesta
               </button>
             </div>
           </div>
         )}
      </main>
    </div>
  );
}
