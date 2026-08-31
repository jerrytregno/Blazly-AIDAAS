import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export type AssessmentPayload = {
  fullName: string
  email: string
  company: string
  phone: string
  assess: string[]
  objectives: string[]
  notes: string
}

export async function saveAssessmentRequest(payload: AssessmentPayload) {
  await addDoc(collection(db, 'assessmentRequests'), {
    ...payload,
    createdAt: serverTimestamp(),
    source: 'ai-daas-landing',
  })
}
