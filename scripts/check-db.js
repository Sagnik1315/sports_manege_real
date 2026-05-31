import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function checkDatabase() {
  console.log("Checking Athletes...");
  try {
    const athletesSnap = await get(ref(database, "athletes"));
    if (athletesSnap.exists()) {
      const data = athletesSnap.val();
      console.log("Found Athletes:", Object.keys(data).length);
      Object.entries(data).forEach(([id, a]) => {
        console.log(`- ID: ${id}, Name: ${a.personalDetails?.fullName}, UID: ${a.uid}`);
      });
    } else {
      console.log("No Athletes found in database.");
    }

    console.log("\nChecking Users...");
    const usersSnap = await get(ref(database, "users"));
    if (usersSnap.exists()) {
      console.log("Found Users:", Object.keys(usersSnap.val()).length);
    } else {
      console.log("No Users found in database.");
    }
  } catch (err) {
    console.error("Error checking DB:", err);
  }
  process.exit(0);
}

checkDatabase();
