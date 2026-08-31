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
import { SkillCategory, skillCategories } from "@/data/skills";

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
    console.warn("Firestore fetch skills failed, falling back to static skillCategories:", err);
  }
  return skillCategories;
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
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSkillCategoryFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, SKILLS_COLLECTION, id);
  await deleteDoc(docRef);
}
