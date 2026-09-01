import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { ProfileData, profileData } from "@/data/profile";

const PROFILE_COLLECTION = "settings";
const PROFILE_DOC_ID = "profile";

export async function getProfileFromFirestore(): Promise<ProfileData> {
  try {
    const docRef = doc(db, PROFILE_COLLECTION, PROFILE_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as ProfileData;
      if (
        !data.profilePhotoUrl ||
        data.profilePhotoUrl.includes("unsplash") ||
        data.profilePhotoUrl.includes("placeholder")
      ) {
        data.profilePhotoUrl = "/profile.jpg";
      }
      return data;
    }
  } catch (err) {
    console.warn("Firestore fetch profile failed, falling back to static profileData:", err);
  }
  return profileData;
}

export async function updateProfileInFirestore(data: Partial<ProfileData>): Promise<void> {
  const docRef = doc(db, PROFILE_COLLECTION, PROFILE_DOC_ID);
  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
