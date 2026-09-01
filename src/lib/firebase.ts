import { initializeApp } from 'firebase/app'
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)

const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() })

export function getAiModel(model = 'gemini-3.5-flash-lite') {
  return getGenerativeModel(ai, { model })
}
