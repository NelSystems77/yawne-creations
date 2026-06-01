import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./firebase";
import { AdminExpiry, UserRecord } from "@/types";

function expiresAt(expiry: AdminExpiry): Timestamp {
  const d = new Date();
  const months = { "1m": 1, "3m": 3, "6m": 6, "12m": 12 };
  d.setMonth(d.getMonth() + months[expiry]);
  return Timestamp.fromDate(d);
}

export async function getAdmins(): Promise<UserRecord[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserRecord));
}

export async function createAdmin(
  email: string,
  password: string,
  expiry: AdminExpiry,
  createdByUid: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    role: "admin",
    expiresAt: expiresAt(expiry),
    createdAt: serverTimestamp(),
    createdBy: createdByUid,
  });
  return cred.user.uid;
}

export async function updateAdminExpiry(uid: string, expiry: AdminExpiry) {
  await updateDoc(doc(db, "users", uid), { expiresAt: expiresAt(expiry) });
}

export async function deleteAdmin(uid: string) {
  await deleteDoc(doc(db, "users", uid));
}
