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
import { SkillCategory } from "@/data/skills";

const SKILLS_COLLECTION = "skills";

export async function getSkillsFromFirestore(): Promise<SkillCategory[]> {
  try {
    const snapshot = await getDocs(collection(db, SKILLS_COLLECTION));
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as SkillCategory[];
    }
  } catch (err) {
    console.warn("Firestore fetch skills failed:", err);
  }
  return [];
}

export async function createSkillCategoryInFirestore(category: Omit<SkillCategory, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, SKILLS_COLLECTION), {
    ...category,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateSkillCategoryInFirestore(id: string, updates: Partial<SkillCategory>): Promise<void> {
  const docRef = doc(db, SKILLS_COLLECTION, id);
  await setDoc(
    docRef,
    {
      ...updates,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteSkillCategoryFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, SKILLS_COLLECTION, id);
  await deleteDoc(docRef);
}
