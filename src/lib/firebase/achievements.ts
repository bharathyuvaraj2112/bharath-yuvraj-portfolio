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
import { Achievement } from "@/data/achievements";

const ACHIEVEMENTS_COLLECTION = "achievements";

export async function getAchievementsFromFirestore(): Promise<Achievement[]> {
  try {
    const snapshot = await getDocs(collection(db, ACHIEVEMENTS_COLLECTION));
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Achievement[];
    }
  } catch (err) {
    console.warn("Firestore fetch achievements failed:", err);
  }
  return [];
}

export async function createAchievementInFirestore(achievement: Omit<Achievement, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, ACHIEVEMENTS_COLLECTION), {
    ...achievement,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAchievementInFirestore(id: string, updates: Partial<Achievement>): Promise<void> {
  const docRef = doc(db, ACHIEVEMENTS_COLLECTION, id);
  await setDoc(
    docRef,
    {
      ...updates,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteAchievementFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, ACHIEVEMENTS_COLLECTION, id);
  await deleteDoc(docRef);
}
