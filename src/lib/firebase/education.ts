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
import { EducationItem } from "@/data/education";

const EDUCATION_COLLECTION = "education";

export async function getEducationFromFirestore(): Promise<EducationItem[]> {
  try {
    const snapshot = await getDocs(collection(db, EDUCATION_COLLECTION));
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as EducationItem[];
    }
  } catch (err) {
    console.warn("Firestore fetch education failed:", err);
  }
  return [];
}

export async function createEducationInFirestore(item: Omit<EducationItem, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, EDUCATION_COLLECTION), {
    ...item,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateEducationInFirestore(id: string, updates: Partial<EducationItem>): Promise<void> {
  const docRef = doc(db, EDUCATION_COLLECTION, id);
  await setDoc(
    docRef,
    {
      ...updates,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteEducationFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, EDUCATION_COLLECTION, id);
  await deleteDoc(docRef);
}
