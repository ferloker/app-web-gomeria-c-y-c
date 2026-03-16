import { useState } from 'react';

export default function StoreModule({ products }) {
  const [tab, setTab] = useState('NUEVAS');
  const [search, setSearch] = useState('');

  // Auto format search as measure (basic mask)
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

  const filtered = products.filter(p => p.active && p.stock > 0 && p.type.toUpperCase() === tab)
    .filter(p => p.size.includes(search) || p.brand.toUpperCase().includes(search));

  return (
    <section className="space-y-4">
      <div className="flex border-b border-white/10 gap-8">
        <button onClick={() => setTab('NUEVAS')} className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 ${tab === 'NUEVAS' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>
          <p className="text-sm font-bold tracking-wide">🆕 NUEVAS</p>
        </button>
        <button onClick={() => setTab('USADAS')} className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 ${tab === 'USADAS' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>
          <p className="text-sm font-bold tracking-wide">♻️ USADAS</p>
        </button>
      </div>

      <div className="flex w-full items-stretch rounded-xl bg-white/5 border border-white/10 focus-within:border-primary/50 h-14 transition-all">
        <div className="text-slate-400 flex items-center justify-center pl-4">
          <span className="material-symbols-outlined">search</span>
        </div>
        <input 
          value={search}
          onChange={(e) => formatSearch(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-500 px-3 text-base outline-none" 
          placeholder="Medida (ej. 205/55R16) o Marca..." 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-3">
             <div className="relative aspect-square rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center">
                {item.image_url ? (
                  <img src={item.image_url} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-slate-500">tire_repair</span>
                )}
             </div>
             <div>
                <h4 className="text-slate-100 text-sm font-bold leading-tight truncate">{item.size}</h4>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-white font-black text-lg">${item.price_only}</span>
                </div>
             </div>
             <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-bold transition-colors">
                Añadir al Carrito
             </button>
          </div>
        ))}
      </div>
    </section>
  );
}
