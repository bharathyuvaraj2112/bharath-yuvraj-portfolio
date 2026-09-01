import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Certification } from "@/data/certifications";

const CERTIFICATIONS_COLLECTION = "certifications";

export async function getCertificationsFromFirestore(): Promise<Certification[]> {
  try {
    const snapshot = await getDocs(collection(db, CERTIFICATIONS_COLLECTION));
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Certification[];
    }
  } catch (err) {
    console.warn("Firestore fetch certifications failed:", err);
  }
  return [];
}

export async function createCertificationInFirestore(cert: Omit<Certification, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, CERTIFICATIONS_COLLECTION), {
    ...cert,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCertificationInFirestore(id: string, updates: Partial<Certification>): Promise<void> {
  const docRef = doc(db, CERTIFICATIONS_COLLECTION, id);
  await setDoc(
    docRef,
    {
      ...updates,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteCertificationFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, CERTIFICATIONS_COLLECTION, id);
  await deleteDoc(docRef);
}
