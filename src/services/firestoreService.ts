import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface Question {
  id?: string;
  title: string;
  image: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  createdAt?: any;
}

const QUESTIONS_COLLECTION = 'questions';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export async function getQuestions(): Promise<Question[]> {
  try {
    const q = query(collection(db, QUESTIONS_COLLECTION), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Return empty array instead of throwing, so the app can fall back to defaults
    return [];
  }
}

export async function addQuestion(question: Omit<Question, 'id'>) {
  try {
    return await addDoc(collection(db, QUESTIONS_COLLECTION), {
      ...question,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, QUESTIONS_COLLECTION);
  }
}

export async function updateQuestion(id: string, question: Partial<Question>) {
  const path = `${QUESTIONS_COLLECTION}/${id}`;
  try {
    const questionRef = doc(db, QUESTIONS_COLLECTION, id);
    return await updateDoc(questionRef, question);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteQuestionFromDb(id: string) {
  const path = `${QUESTIONS_COLLECTION}/${id}`;
  try {
    const questionRef = doc(db, QUESTIONS_COLLECTION, id);
    return await deleteDoc(questionRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Initial migration if needed
export async function migrateDefaultData(defaultData: any[], forceAll = false) {
  try {
    const existing = await getQuestions();

    if (forceAll || existing.length === 0) {
      console.log("Migrating default data to Firestore...");
      // If forceAll, we only add what's missing by title to avoid duplicates
      for (const item of defaultData) {
        const isDuplicate = existing.some(q => q.question === item.question);
        if (!isDuplicate) {
          const { id, ...rest } = item;
          await addQuestion(rest);
        }
      }
      console.log("Migration complete!");
    }
  } catch (error) {
    console.error("Migration error:", error);
  }
}

// Check if empty and auto-migrate on first load
export async function ensureQuestionsExist(defaultData: any[]) {
  try {
    const existing = await getQuestions();
    if (existing.length === 0) {
      console.log("No questions found, auto-syncing defaults...");
      await migrateDefaultData(defaultData, true);
      return await getQuestions();
    }
    return existing;
  } catch (error) {
    console.error("Error ensuring questions exist:", error);
    return [];
  }
}
