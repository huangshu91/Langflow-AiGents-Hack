import { get, ref, update } from "firebase/database";
import { db } from "@/main";

export async function getFieldValue<T>(field: string) {
  const dbRef = ref(db, field);
  try {
    const snapshot = await get(dbRef);
    if (!snapshot.exists()) {
      // throw new Error("No data available");
      return undefined;
    }
    return snapshot.val() as T;
  }
  catch (error) {
    throw new Error(String(error));
  }
}

export async function updateFieldValue<T>(
  path: string,
  field: string,
  value: T,
) {
  const dbRef = ref(db, path);
  const payload = { [field]: value };

  try {
    await update(dbRef, payload);
  }
  catch (error) {
    throw new Error(String(error));
  }
}
