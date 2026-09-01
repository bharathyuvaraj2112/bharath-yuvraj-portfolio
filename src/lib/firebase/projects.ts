import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Project, projectsData } from "@/data/projects";

const PROJECTS_COLLECTION = "projects";

export async function getProjectsFromFirestore(): Promise<Project[]> {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy("title", "asc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Project[];
    }
  } catch (err) {
    console.warn("Firestore fetch projects failed:", err);
  }
  return [];
}

export async function getProjectFromFirestore(id: string): Promise<Project | null> {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Project;
    }
  } catch (e) {
    console.warn("Error getting project from Firestore:", e);
  }
  return null;
}

export async function createProjectInFirestore(projectData: Omit<Project, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
    ...projectData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProjectInFirestore(id: string, updates: Partial<Project>): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await setDoc(
    docRef,
    {
      ...updates,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteProjectFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await deleteDoc(docRef);
}
