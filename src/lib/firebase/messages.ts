import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt?: any;
}

const MESSAGES_COLLECTION = "messages";

export async function submitContactMessage(msg: Omit<ContactMessage, "id" | "status" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
    ...msg,
    status: "unread",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getMessagesFromFirestore(): Promise<ContactMessage[]> {
  try {
    const q = query(collection(db, MESSAGES_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as ContactMessage[];
  } catch (err) {
    console.warn("Firestore fetch messages failed:", err);
    return [];
  }
}

export async function markMessageStatusInFirestore(id: string, status: "unread" | "read" | "replied"): Promise<void> {
  const docRef = doc(db, MESSAGES_COLLECTION, id);
  await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
}

export async function deleteMessageFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, MESSAGES_COLLECTION, id);
  await deleteDoc(docRef);
}

export function subscribeUnreadCount(callback: (count: number) => void) {
  const q = query(collection(db, MESSAGES_COLLECTION), where("status", "==", "unread"));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.size);
    },
    (err) => {
      console.warn("Unread messages listener warning:", err);
      callback(0);
    }
  );
}
