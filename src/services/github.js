const REPO_OWNER = 'ferloker';
const REPO_NAME = 'app-web-gomeria-c-y-c';
const BRANCH = 'master'; // O main dependiendo de la init de git
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// Extraer el SHA actual de un archivo para poder sobrescribirlo
export const getFileSha = async (path) => {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;
    const res = await fetch(url, {
      headers: { 
        Authorization: `token ${TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    if (res.status === 404) return null;
    const data = await res.json();
    return data.sha;
  } catch (err) {
    console.error('Error fetching SHA:', err);
    return null;
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
      Authorization: `token ${TOKEN}`,
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

// URL de lectura en vivo que ignora la cache (para leer data inmediatamente después del commit)
export const getRawUrl = (path) => {
  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${path}`;
};
