import { Link } from 'react-router-dom';
import { useSettings } from '../hooks/useGitData';

export default function Header({ isOpen }) {
  const { settings } = useSettings();

  // Helper para verificar si está abierto
  const checkIfOpen = () => {
    // Si desde el admin lo cerraron a la fuerza, pesa más
    if (settings && settings.is_open === false) return false;
    
    // Si no hay configuraciones o isOpen props viene en false, cerramos
    if (!settings) return isOpen; // fallback a props
    
    // Hora actual en Paraguay
    const options = { timeZone: 'America/Asuncion', hour: '2-digit', minute: '2-digit', hour12: false };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(new Date());
    const currentHour = parseInt(parts.find(p => p.type === 'hour').value, 10);
    const currentMinute = parseInt(parts.find(p => p.type === 'minute').value, 10);
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    const day = new Date().toLocaleString("en-US", {timeZone: "America/Asuncion", weekday: "long"}).toLowerCase();
    
    const isSunday = day === 'sunday';
    const hoursStr = isSunday ? settings.hours_sundays : settings.hours_weekdays;

    if (!hoursStr || hoursStr === 'Cerrado' || !hoursStr.includes('a')) return false;

    const [startStr, endStr] = hoursStr.split('a').map(s => s.trim());
    if (!startStr || !endStr) return false;

    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    
    const startMinutes = (startH * 60) + (startM || 0);
    const endMinutes = (endH * 60) + (endM || 0);

    return currentTimeMinutes >= startMinutes && currentTimeMinutes <= endMinutes;
  };

  const isActuallyOpen = checkIfOpen();

  return (
    <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center p-4 justify-between max-w-md mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Logo gomeria" className="h-10 object-contain" />
          <div className="flex flex-col">
            <h2 className="text-slate-100 text-sm font-extrabold leading-tight tracking-tight mt-1">GOMERÍA C Y C</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`size-2 rounded-full animate-pulse ${isActuallyOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isActuallyOpen ? 'text-green-500' : 'text-red-500'}`}>
                {isActuallyOpen ? 'Abierto Ahora' : 'Cerrado'}
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
