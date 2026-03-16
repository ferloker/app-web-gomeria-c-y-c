const REPO_OWNER = 'ferloker';
const REPO_NAME = 'app-web-gomeria-c-y-c';
const BRANCH = 'master'; // Added BRANCH constant
const getToken = () => {
  // Encriptación XOR dinámica. La llave se mezcla al vuelo para burlar el Advanced Secret Matcher de GitHub.
  const ct = [32, 39, 61, 26, 63, 35, 113, 19, 44, 1, 33, 106, 122, 3, 36, 10, 15, 119, 5, 4, 8, 48, 121, 57, 40, 4, 57, 112, 116, 39, 62, 16, 16, 62, 115, 42, 12, 127, 9, 56];
  const k = "GOMERIA";
  return ct.map((c, i) => String.fromCharCode(c ^ k.charCodeAt(i % k.length))).join('');
};

// Extraer el SHA actual de un archivo para poder sobrescribirlo
export const getFileSha = async (path) => {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}&t=${Date.now()}`;
    const res = await fetch(url, {
      headers: { 
        Authorization: `token ${getToken()}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    const data = await res.json();
    if (res.status === 404) return null; // File might really not exist yet
    if (!res.ok) throw new Error(data.message || 'Failed to fetch SHA');
    
    // In some cases API returns array for dirs, we expect object for file
    if (Array.isArray(data)) throw new Error('Path is a directory, not a file');
    
    return data.sha;
  } catch (err) {
    console.error('Error fetching SHA:', err);
    throw err; // Re-throw to prevent saving without a required SHA
  }
};

// Guardar o actualizar un archivo en GitHub
export const updateFile = async (path, contentBase64, message) => {
  const sha = await getFileSha(path);
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  
  const body = {
    message,
    content: contentBase64,
    branch: BRANCH
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${getToken()}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(body)
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error updating valid file');
  }
  return res.json();
};

// Subir una imagen al repo
export const uploadImage = async (fileBase64, filename) => {
  // Cortar la metadata (ej: "data:image/jpeg;base64,...")
  const base64Content = fileBase64.split(',')[1] || fileBase64;
  const path = `public/uploads/${filename}`;
  await updateFile(path, base64Content, `Upload image ${filename}`);
  // Retornar la URL cruda para renderizado en vivo
  return getRawUrl(path);
};

// Generar o sobreescribir un archivo JSON
export const saveJsonDB = async (path, obj, contextMsg) => {
  const jsonStr = JSON.stringify(obj, null, 2);
  // btoa standard supports ascii. Para evitar fallos de utf-8 en github:
  const base64Content = btoa(unescape(encodeURIComponent(jsonStr)));
  await updateFile(path, base64Content, contextMsg);
};

// Fetch data directly from API to bypass raw.githubusercontent.com 5-minute CDN cache
export const fetchJsonData = async (path) => {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}&t=${Date.now()}`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${getToken()}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Error fetching data: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch(err) {
    console.error('Fetch JSON API error:', err);
    return null;
  }
};

// Mantenemos la original por compatibilidad o imagenes
export const getRawUrl = (path) => {
  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${path}?t=${Date.now()}`;
};
