import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';

export function useSettings() {
  const [settings, setSettings] = useState({ 
    is_open: true, 
    whatsapp_number: '+5491112345678', 
    pause_auxilio: false,
    maps_link: 'https://maps.google.com'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      } else {
        // Init default settings if not exists
        setDoc(doc(db, 'settings', 'general'), settings);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { settings, loading };
}

export function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'inventory'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventory(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { inventory, loading };
}
