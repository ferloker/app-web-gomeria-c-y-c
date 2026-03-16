import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ isOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center p-4 justify-between">
          <button onClick={() => setMenuOpen(true)} className="text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 active:bg-white/10">
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <div className="flex flex-col items-center">
            <Link to="/" className="flex flex-col items-center">
              <img src="/assets/logo.png" alt="Logo gomeria" className="h-8 mb-1 object-contain" />
              <h2 className="text-slate-100 text-sm font-extrabold leading-tight tracking-tight">GOMERÍA C y C</h2>
            </Link>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`size-2 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
                {isOpen ? 'Abierto Ahora' : 'Cerrado'}
              </p>
            </div>
          </div>
          
          <div className="flex size-10 items-center justify-end"></div>
        </div>
      </header>

      {/* Hamburger Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-background-dark flex flex-col animate-in slide-in-from-left-full duration-200">
          <div className="flex items-center p-4 justify-between border-b border-white/5">
            <span className="text-primary font-bold text-lg">Menú Principal</span>
            <button onClick={() => setMenuOpen(false)} className="text-slate-100 flex size-10 items-center justify-center rounded-lg bg-white/5 active:bg-white/10">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <nav className="flex flex-col p-6 gap-6 mt-4">
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 text-xl font-medium text-white p-2 border-b border-white/5 pb-6">
              <span className="material-symbols-outlined text-slate-400">home</span> Inicio
            </Link>
            <Link to="/sos" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 text-xl font-medium text-white p-2 border-b border-white/5 pb-6">
              <span className="material-symbols-outlined text-primary">emergency_home</span> Pedir Auxilio VIP
            </Link>
            <Link to="/tienda" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 text-xl font-medium text-white p-2 border-b border-white/5 pb-6">
              <span className="material-symbols-outlined text-slate-400">storefront</span> Catálogo de Tienda
            </Link>
          </nav>

          <div className="mt-auto p-6 mb-8">
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 w-full bg-white/5 py-4 rounded-xl text-slate-400 font-semibold active:bg-white/10">
              <span className="material-symbols-outlined">shield_person</span> Acceso Administrador
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
