import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { fireStore } from "./firebaseInitialization";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  type User,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { ensureError, err, ok, type Result } from "shared/result";

const auth = getAuth();
setPersistence(auth, browserLocalPersistence);

export async function emailSignUp(username: string, email: string, password: string): Promise<Result<User>> {
  const q = query(collection(fireStore, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return err(Error("Username already taken"));
  }
  const res = await createUser(email, password);
  if (res.isErr()) return res;
  try {
    await addDoc(collection(fireStore, "users"), {
      username: username,
      primaryEmail: email,
    });
  } catch (error) {
    return err(ensureError(error));
  }
  return res;
}

export async function signIn(email: string, password: string): Promise<Result<User>> {
  const auth = getAuth();
  try {
    const user = (await signInWithEmailAndPassword(auth, email, password)).user;
    return ok(user);
  } catch (error) {
    return err(ensureError(error));
  }
}

export async function signOut(): Promise<Result<void>> {
  const auth = getAuth();
  try {
    await firebaseSignOut(auth);
    return ok();
  } catch (e) {
    return err(ensureError(e));
  }
}

async function createUser(email: string, password: string): Promise<Result<User>> {
  const auth = getAuth();
  try {
    const user = (await createUserWithEmailAndPassword(auth, email, password)).user;
    return ok(user);
  } catch (e) {
    return err(ensureError(e));
  }
}
