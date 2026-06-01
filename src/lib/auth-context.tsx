"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserRecord } from "@/types";

interface AuthContextValue {
  user: User | null;
  userRecord: UserRecord | null;
  loading: boolean;
  isExpired: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userRecord: null,
  loading: true,
  isExpired: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRecord, setUserRecord] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snap.exists()) {
          setUserRecord({ uid: firebaseUser.uid, ...snap.data() } as UserRecord);
        }
      } else {
        setUserRecord(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const isExpired =
    userRecord?.expiresAt != null &&
    userRecord.expiresAt.toDate() < new Date();

  return (
    <AuthContext.Provider value={{ user, userRecord, loading, isExpired }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
