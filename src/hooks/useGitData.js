import { useState, useEffect } from 'react';
import { getRawUrl } from '../services/github.js';

export function useGitData(path, defaultConfig) {
  const [data, setData] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      // Usar timestamp para romper la cache estresante de GitHub Raw
      const url = `${getRawUrl(path)}?t=${new Date().getTime()}`;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) setData(json);
        } else {
          // Si es 404 es porque aún no fue creado en main (ej: primer deploy)
          if (isMounted) setData(defaultConfig);
        }
      } catch (err) {
        console.error('Error fetching data from github raw:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [path]);

  return { data, loading, setData }; // devolvemos setData por si queremos hacer un intent de Optimistic UI update
}

export function useSettings() {
  const defaultSettings = {
    is_open: true,
    whatsapp_number: "595981123456",
    pause_auxilio: false,
    maps_link: "https://maps.google.com"
  };
  const { data: settings, loading } = useGitData('src/data/settings.json', defaultSettings);
  return { settings, loading };
}

export function useInventory() {
  const { data: inventory, loading } = useGitData('src/data/inventory.json', []);
  return { inventory, loading };
}
