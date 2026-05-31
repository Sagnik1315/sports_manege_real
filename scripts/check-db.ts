import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { database } from "../firebase/config";
import { ref, get } from "firebase/database";

async function checkDatabase() {
  console.log("Checking Athletes...");
  const athletesSnap = await get(ref(database, "athletes"));
  if (athletesSnap.exists()) {
    console.log("Found Athletes:", Object.keys(athletesSnap.val()).length);
    console.log("Sample Athlete UIDs:", Object.values(athletesSnap.val()).map((a: any) => a.uid));
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
  process.exit(0);
}

checkDatabase();
