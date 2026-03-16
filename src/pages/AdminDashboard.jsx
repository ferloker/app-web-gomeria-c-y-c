import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings, useInventory } from '../hooks/useFirebaseData';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, addDoc, collection, deleteDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory'); // inventory, settings
  const { settings, loading: settingsLoading } = useSettings();
  const { inventory, loading: inventoryLoading } = useInventory();
  
  // Auth state
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Form states
  const [file, setFile] = useState(null);
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState('Nuevo');
  const [priceOnly, setPriceOnly] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAuthError('');
    } catch (err) {
      setAuthError('Correo o contraseña incorrectos.');
    }
  };

  const handleLogout = () => signOut(auth);

  const handleAddItem = async () => {
    if (!brand || !size || !priceOnly) return alert('Campos obligatorios');
    setSubmitting(true);
    try {
      let image_url = '';
      if (file) {
        // Compress image to Base64
        image_url = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 400;
              const scaleSize = MAX_WIDTH / img.width;
              canvas.width = MAX_WIDTH;
              canvas.height = img.height * scaleSize;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL('image/jpeg', 0.6)); // Compressed JPEG
            };
          };
        });
      }

      await addDoc(collection(db, 'inventory'), {
        brand,
        size,
        type,
        price_only: Number(priceOnly),
        price_installed: Number(priceOnly) + 5000, // example
        stock: 1,
        active: true,
        image_url
      });
      
      setBrand(''); setSize(''); setPriceOnly(''); setFile(null);
      alert('¡Ítem registrado con éxito!');
    } catch (err) {
      alert('Error guardando ítem: ' + err.message);
    }
    setSubmitting(false);
  };

  const handleMarkAsSold = async (id) => {
    if(confirm('¿Marcar como vendido y ocultar de la tienda?')) {
       await updateDoc(doc(db, 'inventory', id), { stock: 0, active: false });
    }
  };

  const handleTogglePanic = async () => {
    await updateDoc(doc(db, 'settings', 'general'), { pause_auxilio: !settings.pause_auxilio });
  };

  const handleUpdateSettings = async (field, value) => {
    await updateDoc(doc(db, 'settings', 'general'), { [field]: value });
  };

  if (settingsLoading || inventoryLoading) {
    return <div className="min-h-screen bg-background-dark text-white p-6">Cargando datos del servidor...</div>;
  }

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl w-full max-w-sm">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-primary">lock</span> Admin Login</h2>
          {authError && <p className="text-red-500 mb-4 text-sm">{authError}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-900/50 border-white/10 rounded-lg p-3 text-white" required/>
            <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-900/50 border-white/10 rounded-lg p-3 text-white" required/>
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold">Ingresar al Panel</button>
          </form>
          <Link to="/" className="block text-center text-slate-500 mt-6 text-sm">Volver al sitio público</Link>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-100 pb-24">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center justify-between mb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white cursor-pointer" onClick={handleLogout} title="Cerrar sesión">
            <span className="material-symbols-outlined">logout</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Gomería Pro</h1>
        </div>
      </header>

      <main className="px-4 space-y-8">
        {activeTab === 'inventory' && (
          <>
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">inventory_2</span>
                  Gestión de Inventario
                </h2>
                <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold border border-primary/30 uppercase tracking-widest">
                  ID: N-12
                </div>
              </div>
                           <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <label className="w-full h-44 rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-800 cursor-pointer overflow-hidden">
                  {file ? (
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl text-slate-500">add_a_photo</span>
                      <p className="text-sm text-slate-400">Subir foto</p>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={e => setFile(e.target.files[0])} />
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">Marca</label>
                    <input value={brand} onChange={e=>setBrand(e.target.value)} className="bg-slate-900/40 border-slate-800 rounded-lg text-sm text-white" placeholder="Ej: Pirelli" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">Medida</label>
                    <input value={size} onChange={e=>setSize(e.target.value)} className="bg-slate-900/40 border-slate-800 rounded-lg text-sm text-white" placeholder="205/55R16" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">Estado</label>
                    <select value={type} onChange={e=>setType(e.target.value)} className="bg-slate-900/40 border-slate-800 rounded-lg text-sm text-white">
                      <option>Nuevo</option>
                      <option>Usado</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">Precio</label>
                    <input type="number" value={priceOnly} onChange={e=>setPriceOnly(e.target.value)} className="bg-slate-900/40 border-slate-800 rounded-lg text-sm text-white" placeholder="$" />
                  </div>
                </div>

                <button onClick={handleAddItem} disabled={submitting} className={`w-full py-3 rounded-lg font-bold text-white flex justify-center items-center gap-2 ${submitting ? 'bg-slate-600' : 'bg-primary active:scale-95'}`}>
                  {submitting ? 'Subiendo...' : <><span className="material-symbols-outlined">save</span> Registrar</>}
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Stock Rápido (Activos)</h3>
              <div className="space-y-3">
                {inventory.filter(i => i.stock > 0).map(item => (
                  <div key={item.id} className="bg-white/5 p-3 rounded-lg flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center overflow-hidden">
                        {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-slate-500">tire_repair</span>}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.brand}</p>
                        <p className="text-xs text-slate-500">{item.size} • ${item.price_only}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <button onClick={() => handleMarkAsSold(item.id)} className="text-xs bg-red-900/50 text-red-500 border border-red-500/50 px-3 py-1 rounded-md active:bg-red-500 active:text-white transition-colors">Marcar Vendido</button>
                    </div>
                  </div>
                ))}
                {inventory.filter(i => i.stock > 0).length === 0 && <p className="text-slate-500 text-sm">No hay ítems en stock.</p>}
              </div>
            </section>
          </>
        )}

        {activeTab === 'settings' && (
          <section>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">emergency_home</span> Centro de Control
            </h2>
            
            <div className={`bg-red-950/40 border rounded-2xl p-6 flex flex-col items-center gap-4 mb-6 transition-colors ${settings.pause_auxilio ? 'border-red-500 shadow-[0_0_20px_rgba(236,19,19,0.4)]' : 'border-slate-700'}`}>
              <button onClick={handleTogglePanic} className={`w-16 h-16 rounded-full flex items-center justify-center text-white active:scale-95 transition-colors ${settings.pause_auxilio ? 'bg-primary animate-pulse' : 'bg-slate-700'}`}>
                <span className="material-symbols-outlined text-3xl">power_settings_new</span>
              </button>
              <div className="text-center">
                <h3 className={`font-bold text-lg ${settings.pause_auxilio ? 'text-white' : 'text-slate-400'}`}>
                  {settings.pause_auxilio ? 'SERVICIO SOS PAUSADO' : 'PAUSAR SERVICIO SOS'}
                </h3>
                <p className="text-xs text-slate-500">Toca el botón para cambiar.</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-5 space-y-5 border border-white/10">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${settings.is_open ? 'text-green-500' : 'text-slate-500'}`}>store</span>
                  <div>
                    <p className="text-sm font-semibold text-white">Estado del Local</p>
                    <p className="text-xs text-slate-500">{settings.is_open ? 'Abierto al público' : 'Cerrado temporalmente'}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.is_open} onChange={(e) => handleUpdateSettings('is_open', e.target.checked)} className="sr-only peer" />
                  <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-slate-400">WhatsApp</label>
                <input value={settings.whatsapp_number} onChange={e=>handleUpdateSettings('whatsapp_number', e.target.value)} className="bg-slate-900/40 border-slate-800 rounded-lg text-sm text-white" />
                
                <label className="text-xs font-medium text-slate-400">Maps Link</label>
                <input value={settings.maps_link} onChange={e=>handleUpdateSettings('maps_link', e.target.value)} className="bg-slate-900/40 border-slate-800 rounded-lg text-sm text-white" />
              </div>
              
              <button 
                onClick={() => navigator.clipboard.writeText(`¡Hola! Gracias por elegir Gomería C y C. ¿Podrías dejarnos 5 estrellas en Google Maps? Haz clic aquí: ${settings.maps_link}`)}
                className="w-full bg-primary/20 border border-primary/30 py-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-primary mt-4 active:bg-primary/40"
              >
                <span className="material-symbols-outlined">content_copy</span> Copiar Mensaje Reseña
              </button>
            </div>
          </section>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background-dark/90 backdrop-blur-md border-t border-white/5 px-6 py-3 flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px]">Sitio</span>
        </Link>
        <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center gap-1 ${activeTab === 'inventory' ? 'text-primary' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="text-[10px] font-bold">Stock</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-primary' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined">tune</span>
          <span className="text-[10px] font-bold">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}
