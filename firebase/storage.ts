import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";
import imageCompression from "browser-image-compression";

export type UploadProgressCallback = (progress: number) => void;

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };
  return imageCompression(file, options);
}

export async function uploadFile(
  path: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const storageRef = ref(storage, path);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(pct));
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function uploadAthleteFile(
  athleteId: string,
  docType: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  let processedFile = file;
  if (file.type.startsWith("image/")) {
    processedFile = await compressImage(file);
  }
  const ext = file.name.split(".").pop();
  const path = `athletes/${athleteId}/${docType}.${ext}`;
  return uploadFile(path, processedFile, onProgress);
}

export async function uploadCoachFile(
  coachId: string,
  docType: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  let processedFile = file;
  if (file.type.startsWith("image/")) {
    processedFile = await compressImage(file);
  }
  const ext = file.name.split(".").pop();
  const path = `coaches/${coachId}/${docType}.${ext}`;
  return uploadFile(path, processedFile, onProgress);
}

export async function deleteStorageFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
