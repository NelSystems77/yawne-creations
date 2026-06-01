import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";
import { Product } from "@/types";

export async function getProducts(): Promise<Product[]> {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const fileRef = ref(storage, `products/${productId}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

export async function deleteProductImage(url: string) {
  const fileRef = ref(storage, url);
  await deleteObject(fileRef);
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt" | "createdBy">,
  uid: string
): Promise<string> {
  const docRef = await addDoc(collection(db, "products"), {
    ...data,
    createdBy: uid,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  await updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(product: Product) {
  for (const url of product.images) {
    try { await deleteProductImage(url); } catch {}
  }
  await deleteDoc(doc(db, "products", product.id));
}
