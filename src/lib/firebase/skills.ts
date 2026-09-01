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
import { SkillCategory, skillCategories as defaultSkillCategories } from "@/data/skills";

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
    console.warn("Firestore fetch skills failed, returning static fallback:", err);
  }
  return defaultSkillCategories;
}

export async function createSkillCategoryInFirestore(category: Omit<SkillCategory, "id"> & { id?: string }): Promise<string> {
  if (category.id) {
    const docRef = doc(db, SKILLS_COLLECTION, category.id);
    await setDoc(docRef, {
      title: category.title,
      description: category.description || "",
      skills: category.skills || [],
      createdAt: serverTimestamp(),
    });
    return category.id;
  }

  const docRef = await addDoc(collection(db, SKILLS_COLLECTION), {
    title: category.title,
    description: category.description || "",
    skills: category.skills || [],
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

export async function seedSkillsToFirestore(): Promise<SkillCategory[]> {
  const createdCats: SkillCategory[] = [];
  for (const cat of defaultSkillCategories) {
    const docId = await createSkillCategoryInFirestore({
      id: cat.id,
      title: cat.title,
      description: cat.description,
      skills: cat.skills,
    });
    createdCats.push({ ...cat, id: docId });
  }
  return createdCats;
}

