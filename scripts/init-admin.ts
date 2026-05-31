import { auth, database as db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

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

    await set(ref(db, `users/${user.uid}`), {
      uid: user.uid,
      email: user.email,
      name: "System Admin",
      role: "admin",
      createdAt: new Date().toISOString(),
    });

    // Initialize sports data
    console.log("Initializing sports data...");
    const sportsRef = ref(db, "sports");
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
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

initAdmin();
