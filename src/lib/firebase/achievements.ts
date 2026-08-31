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
import { Achievement, achievementsData } from "@/data/achievements";

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
    console.warn("Firestore fetch achievements failed, falling back to static achievementsData:", err);
  }
  return achievementsData;
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
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAchievementFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, ACHIEVEMENTS_COLLECTION, id);
  await deleteDoc(docRef);
}
