import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { EducationItem, educationData } from "@/data/education";

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
    console.warn("Firestore fetch education failed, falling back to static educationData:", err);
  }
  return educationData;
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
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEducationFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, EDUCATION_COLLECTION, id);
  await deleteDoc(docRef);
}
