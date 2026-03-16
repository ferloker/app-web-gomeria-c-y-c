import { Link } from 'react-router-dom';

export default function Header({ isOpen }) {
  return (
    <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-primary/10">
      <div className="flex items-center p-4 justify-between">
        <div className="text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <span className="material-symbols-outlined">menu</span>
        </div>
        <div className="flex flex-col items-center">
          <img src="/assets/logo.png" alt="Logo gomeria" className="h-8 mb-1 object-contain" />
          <h2 className="text-slate-100 text-sm font-extrabold leading-tight tracking-tight">GOMERÍA C y C</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`size-2 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
              {isOpen ? 'Abierto Ahora' : 'Cerrado'}
            </p>
          </div>
        </div>
        <Link to="/admin" className="flex size-10 items-center justify-end">
          <span className="material-symbols-outlined text-slate-100">person</span>
        </Link>
      </div>
    </header>
  );
}
