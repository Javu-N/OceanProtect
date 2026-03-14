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
    console.log("Fetching questions from Firestore...");
    const q = query(collection(db, QUESTIONS_COLLECTION), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const questions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));
    console.log(`Found ${questions.length} questions in Firestore`);
    return questions;
  } catch (error: any) {
    console.error('Error fetching questions:', error?.code, error?.message);
    // If collection doesn't exist or is empty, return empty array
    if (error?.code === 'failed-precondition' || error?.code === 'not-found') {
      console.log("Collection may not exist yet, returning empty array");
      return [];
    }
    // For other errors, still return empty to not crash the app
    return [];
  }
}

export async function addQuestion(question: Omit<Question, 'id'>) {
  try {
    console.log("Adding question to Firestore...", question.title);
    const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), {
      ...question,
      createdAt: serverTimestamp()
    });
    console.log("Question added with ID:", docRef.id);
    return docRef;
  } catch (error: any) {
    console.error('Error adding question:', error?.code, error?.message);
    throw error;
  }
}

export async function updateQuestion(id: string, question: Partial<Question>) {
  const path = `${QUESTIONS_COLLECTION}/${id}`;
  try {
    console.log("Updating question:", id);
    const questionRef = doc(db, QUESTIONS_COLLECTION, id);
    await updateDoc(questionRef, question);
    console.log("Question updated successfully");
    return true;
  } catch (error: any) {
    console.error('Error updating question:', error?.code, error?.message);
    throw error;
  }
}

export async function deleteQuestionFromDb(id: string) {
  const path = `${QUESTIONS_COLLECTION}/${id}`;
  try {
    console.log("Deleting question:", id);
    const questionRef = doc(db, QUESTIONS_COLLECTION, id);
    await deleteDoc(questionRef);
    console.log("Question deleted successfully");
    return true;
  } catch (error: any) {
    console.error('Error deleting question:', error?.code, error?.message);
    throw error;
  }
}

// Initial migration if needed
export async function migrateDefaultData(defaultData: any[], forceAll = false, retryCount = 0) {
  try {
    console.log(`Starting migration check, forceAll: ${forceAll}, attempt: ${retryCount + 1}`);
    const existing = await getQuestions();

    if (forceAll || existing.length === 0) {
      console.log(`Migrating ${defaultData.length} default questions to Firestore...`);
      let addedCount = 0;
      let failedCount = 0;

      for (const item of defaultData) {
        try {
          const isDuplicate = existing.some(q => q.question === item.question);
          if (!isDuplicate) {
            const { id, ...rest } = item;
            await addQuestion(rest);
            addedCount++;
            console.log(`✓ Added: ${item.title}`);
          }
        } catch (itemError: any) {
          failedCount++;
          console.error(`✗ Failed to add ${item.title}:`, itemError?.message);
        }
      }

      console.log(`Migration complete! Added ${addedCount}, Failed: ${failedCount}`);
      return { success: true, addedCount, failedCount };
    } else {
      console.log(`Firestore already has ${existing.length} questions, skipping migration`);
      return { success: true, addedCount: 0, failedCount: 0 };
    }
  } catch (error: any) {
    console.error("Migration error:", error?.message, error?.code);
    // Retry once after 1 second if it fails
    if (retryCount < 1) {
      console.log("Retrying migration in 1 second...");
      await new Promise(r => setTimeout(r, 1000));
      return migrateDefaultData(defaultData, forceAll, retryCount + 1);
    }
    throw error;
  }
}

// Check if empty and auto-migrate on first load
export async function ensureQuestionsExist(defaultData: any[]) {
  try {
    console.log("Checking if questions exist...");
    const existing = await getQuestions();
    console.log(`Found ${existing.length} existing questions`);

    if (existing.length === 0) {
      console.log("No questions found, auto-syncing defaults...");
      const result = await migrateDefaultData(defaultData, true);

      // Wait a bit for the writes to propagate
      await new Promise(r => setTimeout(r, 2000));

      const freshQuestions = await getQuestions();
      console.log(`After sync, now have ${freshQuestions.length} questions`);
      return freshQuestions;
    }
    return existing;
  } catch (error: any) {
    console.error("Error ensuring questions exist:", error?.message, error?.code);
    return [];
  }
}
