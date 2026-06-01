/**
 * init-users.mjs
 * Crea los documentos de usuarios en Firestore usando la REST API.
 *
 * ANTES de ejecutar:
 *   1. Ve a Firebase Console → Firestore → Rules
 *   2. Cambia temporalmente a: allow read, write: if true;
 *   3. Ejecuta: node scripts/init-users.mjs
 *   4. Restaura las reglas desde firestore.rules
 */

const PROJECT_ID = "yawne-creations";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const now = new Date().toISOString();

const users = [
  {
    uid: "mYbOO5qequbVao6rE7OoOlitZBx1",
    data: {
      email:      { stringValue: "admin@nelsystems.com" },
      role:       { stringValue: "superadmin" },
      expiresAt:  { nullValue: null },
      createdAt:  { timestampValue: now },
      createdBy:  { stringValue: "system" },
    },
  },
  {
    uid: "YbgmFXfTxzU2LyaBP8jAZf9BWNj1",
    data: {
      email:      { stringValue: "maria_fernanda@yawnecreations.com" },
      role:       { stringValue: "admin" },
      expiresAt:  { timestampValue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() },
      createdAt:  { timestampValue: now },
      createdBy:  { stringValue: "mYbOO5qequbVao6rE7OoOlitZBx1" },
    },
  },
];

async function createUser({ uid, data }) {
  const url = `${BASE_URL}/users/${uid}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: data }),
  });

  const json = await res.json();
  if (!res.ok) {
    console.error(`✗ Error con ${uid}:`, json.error?.message ?? JSON.stringify(json));
    return false;
  }
  console.log(`✓ Documento creado: users/${uid}`);
  return true;
}

console.log("Creando documentos en Firestore...\n");
for (const user of users) {
  await createUser(user);
}
console.log("\nListo. Restaura las reglas de Firestore ahora.");
