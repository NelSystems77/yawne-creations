/**
 * seed-products.mjs
 * Uploads initial product images from /productos and creates Firestore documents.
 * Run once: node scripts/seed-products.mjs
 * Requires GOOGLE_APPLICATION_CREDENTIALS or Firebase Admin SDK setup.
 *
 * Usage with env vars loaded from .env.local:
 *   node -r dotenv/config scripts/seed-products.mjs dotenv_config_path=.env.local
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTOS_DIR = path.join(__dirname, "../productos");
const SUPER_ADMIN_UID = process.env.SUPER_ADMIN_UID; // set in .env.local

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  console.error(
    "Set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON, or FIREBASE_SERVICE_ACCOUNT_JSON with the JSON content."
  );
  process.exit(1);
}

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  : undefined;

initializeApp({
  credential: serviceAccount ? cert(serviceAccount) : undefined,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});

const db = getFirestore();
const bucket = getStorage().bucket();

async function run() {
  const files = (await readdir(PRODUCTOS_DIR)).filter((f) =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(f)
  );

  console.log(`Found ${files.length} images in /productos`);

  for (const file of files) {
    const filePath = path.join(PRODUCTOS_DIR, file);
    const dest = `products/seed/${file}`;

    console.log(`Uploading ${file}...`);
    await bucket.upload(filePath, {
      destination: dest,
      metadata: { contentType: "image/jpeg" },
      public: true,
    });

    const url = `https://storage.googleapis.com/${bucket.name}/${dest}`;

    await db.collection("products").add({
      name: path.basename(file, path.extname(file)).replace(/[-_]/g, " "),
      description: "",
      price: null,
      images: [url],
      category: "",
      available: true,
      featured: false,
      createdAt: Timestamp.now(),
      createdBy: SUPER_ADMIN_UID ?? "seed",
    });

    console.log(`  ✓ Created product for ${file}`);
  }

  console.log("\nSeed complete!");
}

run().catch((e) => { console.error(e); process.exit(1); });
