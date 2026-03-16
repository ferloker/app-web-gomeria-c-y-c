import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useSettings, useInventory } from '../hooks/useGitData';

export default function StorePage() {
  const { settings } = useSettings();
  const { inventory, loading: inventoryLoading } = useInventory();
  
  const [tab, setTab] = useState('NUEVO');
  const [search, setSearch] = useState('');
  
  // Checkout flow
  const [cart, setCart] = useState({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const formatSearch = (val) => {
    let clean = val.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
    if(clean.length > 3 && !isNaN(clean.substring(0,3))) {
       clean = clean.substring(0,3) + '/' + clean.substring(3);
    }
    if(clean.length > 6 && !isNaN(clean.substring(4,6))) {
       clean = clean.substring(0,6) + ' R' + clean.substring(6);
    }
    setSearch(clean);
  };

  const filtered = inventory.filter(p => p.active && p.stock > 0 && p.type.toUpperCase() === tab)
    .filter(p => p.size.includes(search) || p.brand.toUpperCase().includes(search));

  const totalItems = Object.values(cart).reduce((a, b) => a + b.qty, 0);
  const totalPrice = Object.values(cart).reduce((a, b) => a + (b.qty * b.price), 0);

  const addToCart = (item) => {
    setCart(prev => {
      const q = prev[item.id] ? prev[item.id].qty + 1 : 1;
      if (q > item.stock) return prev;
      return { ...prev, [item.id]: { id: item.id, qty: q, price: item.price_only, desc: `${item.type} - ${item.size} (${item.brand})` } };
    });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    const phoneNumber = settings?.whatsapp_number || '1234567890';
    let msg = `🛒 *NUEVO PEDIDO DE TIENDA*\nCliente: ${formData.name}\nTel: ${formData.phone}\n\n*Pedido:*\n`;
    Object.values(cart).forEach(item => {
      msg += `- ${item.qty}x [ID: ${item.id}] ${item.desc} (Gs. ${item.price})\n`;
    });
    msg += `\n*TOTAL: Gs. ${totalPrice}*`;
    window.location.href = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-100 pb-28">
      <Header isOpen={settings ? settings.is_open : true} />
      
      <main className="p-4 mt-2 max-w-md mx-auto animate-in fade-in duration-300">
        <Link to="/" className="mb-4 flex items-center gap-2 text-slate-400 w-fit hover:text-white transition-colors">
          <span className="material-symbols-outlined">arrow_back</span> Volver a Emergencias
        </Link>
        <h1 className="text-2xl font-black text-slate-100 mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-3xl">storefront</span> Nuestro Catálogo</h1>
        
        <div className="flex bg-slate-900/80 border border-white/5 p-1 rounded-xl mb-6">
          <button onClick={() => setTab('NUEVO')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${tab === 'NUEVO' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
            <span className="text-base tracking-wide">🆕 NUEVAS</span>
          </button>
          <button onClick={() => setTab('USADO')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${tab === 'USADO' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
            <span className="text-base tracking-wide">♻️ USADAS</span>
          </button>
        </div>

        <div className="flex w-full items-center rounded-2xl bg-slate-900 border border-white/5 focus-within:border-primary/50 focus-within:bg-slate-800 h-14 transition-all mb-8 shadow-inner px-4 overflow-hidden">
          <span className="material-symbols-outlined text-slate-400">search</span>
          <input value={search} onChange={(e) => formatSearch(e.target.value)} className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-500 px-3 text-base outline-none font-medium" placeholder="Buscar medida (205/55 R16)..." />
        </div>

        {inventoryLoading ? (
           <div className="text-center text-slate-400 py-10 flex flex-col items-center gap-3">
             <span className="material-symbols-outlined animate-spin text-3xl">sync</span>
             <span className="font-semibold text-sm animate-pulse">Sincronizando catálogo en vivo...</span>
           </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-8">
            {filtered.map(item => (
              <div key={item.id} className="bg-slate-900/80 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 shadow-lg hover:border-white/10 transition-colors">
                 <div className="relative aspect-square rounded-xl bg-background-dark overflow-hidden flex items-center justify-center border border-white/5 shadow-inner">
                    {item.image_url ? (
                      <img src={item.image_url} className="w-full h-full object-cover relative z-10" loading="lazy" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-slate-600 relative z-10">tire_repair</span>
                    )}
                 </div>
                 <div>
                    <h4 className="text-slate-100 text-[13px] font-black leading-tight flex flex-wrap gap-1">
                      {item.size} <span className="text-slate-400 font-medium">({item.brand})</span>
                    </h4>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-white font-black text-lg font-mono">Gs. {item.price_only}</span>
                    </div>
                 </div>
                 <button onClick={() => addToCart(item)} className="w-full bg-white/5 hover:bg-primary active:bg-red-500 py-2.5 rounded-lg text-xs font-bold transition-all flex justify-center items-center gap-1.5 mt-auto border border-white/5">
                    <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span> Comprar
                 </button>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-slate-500 text-center col-span-2 py-8 font-medium">No hay neumáticos con esta medida en formato {tab.toLowerCase()}.</p>}
          </div>
        )}
      </main>

      {/* Floating Cart Bottom Bar */}
      {totalItems > 0 && !checkoutOpen && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-4 bg-background-dark/90 backdrop-blur-md border-t border-white/10 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-md mx-auto">
            <button onClick={() => setCheckoutOpen(true)} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-zinc-950 h-14 rounded-2xl flex items-center justify-between px-6 shadow-[0_0_20px_rgba(37,211,102,0.3)] active:scale-95 transition-transform font-bold">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined font-black">shopping_bag</span>
                <span className="font-black text-lg tracking-tight">Ver Compra ({totalItems})</span>
              </div>
              <span className="font-black text-lg font-mono">Gs. {totalPrice}</span>
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 bg-background-dark/95 flex flex-col p-4 animate-in fade-in duration-200">
           <div className="max-w-md mx-auto w-full flex-1 flex flex-col mt-4">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-black flex items-center gap-2"><span className="material-symbols-outlined text-primary">shopping_bag</span> Tu Pedido</h2>
               <button onClick={() => setCheckoutOpen(false)} className="size-10 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center active:scale-95"><span className="material-symbols-outlined">close</span></button>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-3 pb-6 border-b border-white/10">
                {Object.values(cart).map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-900/80 p-4 rounded-2xl border border-white/5 shadow-sm">
                    <div>
                      <p className="font-bold text-sm text-slate-200">{item.qty}x {item.desc}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">Ref: {item.id}</p>
                    </div>
                    <span className="font-black text-white font-mono">Gs. {item.price * item.qty}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-4 px-2">
                   <h3 className="font-bold text-slate-400">Total a pagar:</h3>
                   <span className="font-black text-2xl text-primary font-mono">Gs. {totalPrice}</span>
                </div>
             </div>

             <form onSubmit={handleCheckout} className="pt-6 relative z-10 mb-8 space-y-4">
                <p className="font-bold text-slate-300 ml-1">Para coordinar la entrega:</p>
                <div className="space-y-3">
                  <input required type="text" placeholder="TU NOMBRE" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#25D366] font-medium transition-colors shadow-inner" />
                  <input required type="tel" placeholder="TU TELÉFONO" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#25D366] font-medium transition-colors shadow-inner" />
                </div>
                <button type="submit" className="w-full bg-[#25D366] py-4 rounded-xl font-black text-zinc-950 mt-2 shadow-[0_0_20px_rgba(37,211,102,0.3)] flex justify-center items-center gap-2 active:scale-[0.98] transition-all text-lg border border-transparent">
                  <span className="material-symbols-outlined">send</span> Enviar Pedido
                </button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}
