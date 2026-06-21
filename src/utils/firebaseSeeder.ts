/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, writeBatch, collection, getDocs, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { 
  DEFAULT_LIVE_STREAM, 
  DEFAULT_SCHEDULE_ITEMS, 
  DEFAULT_YOUTUBE_VIDEOS, 
  DEFAULT_ABOUT_DATA 
} from "../data/defaultData";

/**
 * Resets/populates Firestore database with original NTU student media seed presets.
 */
export async function seedFirestoreDatabase() {
  const batch = writeBatch(db);

  try {
    // 1. Seed Config Live Stream
    const liveDocRef = doc(db, "config", "liveStream");
    batch.set(liveDocRef, DEFAULT_LIVE_STREAM);

    // 2. Seed Config About Us
    const aboutDocRef = doc(db, "config", "aboutUs");
    batch.set(aboutDocRef, DEFAULT_ABOUT_DATA);

    // 3. Seed Schedule Items (delete existing first if any, then insert presets)
    const scheduleCol = collection(db, "schedule");
    const scheduleSnap = await getDocs(scheduleCol);
    scheduleSnap.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });
    DEFAULT_SCHEDULE_ITEMS.forEach((item) => {
      const docRef = doc(db, "schedule", item.id);
      batch.set(docRef, item);
    });

    // 4. Seed Youtube Videos (delete existing first, then insert presets)
    const videosCol = collection(db, "videos");
    const videosSnap = await getDocs(videosCol);
    videosSnap.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });
    DEFAULT_YOUTUBE_VIDEOS.forEach((vid) => {
      const docRef = doc(db, "videos", vid.id);
      batch.set(docRef, vid);
    });

    await batch.commit();
    console.log("Firestore successfully initialized with Nottingham Trent default presets.");
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, "seeder/batch");
  }
}

/**
 * Checks if Firestore collections are empty and automatically seeds them if authorized.
 */
export async function autoSeedIfEmpty() {
  try {
    const scheduleCol = collection(db, "schedule");
    const scheduleSnap = await getDocs(scheduleCol);
    if (scheduleSnap.empty) {
      console.log("Firestore schedule is empty. Initiating automatic seeding...");
      await seedFirestoreDatabase();
    }
  } catch (err) {
    console.warn("Auto-seeding check skipped due to lack of write credentials or offline state.");
  }
}
