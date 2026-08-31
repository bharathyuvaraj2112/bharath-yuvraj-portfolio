import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";

export interface UploadProgressCallback {
  (progress: number, downloadUrl?: string, error?: string): void;
}

export function uploadFileToStorage(
  file: File,
  folder: "images" | "resumes" | "certifications",
  onProgress?: UploadProgressCallback
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate File Types
    if (folder === "resumes" && file.type !== "application/pdf") {
      const err = "Only PDF files are allowed for resume upload.";
      if (onProgress) onProgress(0, undefined, err);
      return reject(new Error(err));
    }

    if (folder !== "resumes" && !file.type.startsWith("image/")) {
      const err = "Only image files (JPEG, PNG, WebP) are allowed.";
      if (onProgress) onProgress(0, undefined, err);
      return reject(new Error(err));
    }

    // Size Validation (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      const err = "File size exceeds maximum limit of 10MB.";
      if (onProgress) onProgress(0, undefined, err);
      return reject(new Error(err));
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${folder}/${Date.now()}_${sanitizedName}`;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Storage upload error:", error);
        if (onProgress) onProgress(0, undefined, error.message);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          if (onProgress) onProgress(100, downloadUrl);
          resolve(downloadUrl);
        } catch (e: any) {
          reject(e);
        }
      }
    );
  });
}

export async function deleteStorageFileByUrl(fileUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (e) {
    console.warn("Could not delete file from storage (may already be removed):", e);
  }
}
