import { Link } from 'react-router-dom';

export default function Header({ isOpen }) {
  return (
    <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center p-4 justify-between max-w-md mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Logo gomeria" className="h-10 object-contain" />
          <div className="flex flex-col">
            <h2 className="text-slate-100 text-sm font-extrabold leading-tight tracking-tight mt-1">GOMERÍA C y C</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`size-2 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
                {isOpen ? 'Abierto Ahora' : 'Cerrado'}
              </p>
            </div>
          </div>
        </Link>
        <Link to="/admin" className="text-slate-500 flex size-10 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/20 transition-colors">
           <span className="material-symbols-outlined text-xl">shield_person</span>
        </Link>
      </div>
    </header>
  );
}
