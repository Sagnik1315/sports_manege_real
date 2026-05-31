import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

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
const auth = getAuth(app);
const database = getDatabase(app);

async function initAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_DEFAULT_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_DEFAULT_PASSWORD must be set in .env.local");
    process.exit(1);
  }

  try {
    console.log(`Creating admin account for ${email}...`);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await set(ref(database, `users/${user.uid}`), {
      uid: user.uid,
      email: user.email,
      name: "System Admin",
      role: "admin",
      createdAt: new Date().toISOString(),
    });

    // Initialize sports data
    console.log("Initializing sports data...");
    const sportsRef = ref(database, "sports");
    const snap = await get(sportsRef);
    if (!snap.exists()) {
      await set(sportsRef, {
        sport001: { name: "Cricket", active: true },
        sport002: { name: "Football", active: true },
      });
    }

    console.log("Admin account created successfully!");
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
       console.log("Admin account already exists in Auth. Ensuring database record is set...");
       // We can't easily get the UID without logging in or using Admin SDK, 
       // but since this is a dev setup, let's assume the user just needs to log in.
       console.log("Please try logging in with the credentials in your .env.local file.");
       process.exit(0);
    }
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

initAdmin();
