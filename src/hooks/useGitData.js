import { useState, useEffect } from 'react';
import { fetchJsonData } from '../services/github.js';

export function useGitData(path, defaultConfig) {
  const [data, setData] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);

  const fetchData = async (isMounted = true) => {
    setLoading(true);
    try {
      const json = await fetchJsonData(path);
      if (json) {
        if (isMounted) setData(json);
      } else {
        // Si es null es porque aún no fue creado o hubo error 404
        if (isMounted) setData(defaultConfig);
      }
    } catch (err) {
      console.error('Error fetching data from github raw:', err);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => { isMounted = false; };
  }, [path]);

  return { data, loading, setData, refetch: () => fetchData(true) }; // devolvemos refetch para sincronizar manual
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
