import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  addDoc
} from 'firebase/firestore';

export type UserRole = 'customer' | 'ambassador' | 'admin';

export interface UserProfile {
  uid: string;
  phone: string;
  role: UserRole;
  createdAt: any;
  hospitalitiesGiven: number;
}

export interface Restaurant {
  id: string; // The slug, e.g. alburger
  name: string;
  validDays: number;
  cooldownDays: number;
  maxDishes: number | null; // null means unlimited
  createdAt: any;
}

export interface Hospitality {
  id?: string;
  restaurantId: string;
  ambassadorId: string;
  customerId: string;
  customerPhone: string;
  status: 'pending' | 'redeemed' | 'expired';
  createdAt: any;
  expiresAt: any;
  redeemedAt?: any;
}

// --- Users ---
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) return null;
  const docRef = doc(db, 'users', uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const createUserProfile = async (uid: string, phone: string, role: UserRole = 'customer') => {
  if (!db) return null;
  const docRef = doc(db, 'users', uid);
  const data: UserProfile = {
    uid,
    phone,
    role,
    createdAt: serverTimestamp(),
    hospitalitiesGiven: 0
  };
  await setDoc(docRef, data);
  return data;
};

export const updateUserRole = async (uid: string, role: UserRole) => {
  if (!db) return;
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, { role });
};

// --- Restaurants ---
export const getRestaurant = async (slug: string): Promise<Restaurant | null> => {
  if (!db) return null;
  const docRef = doc(db, 'restaurants', slug);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as Restaurant) : null;
};

export const createRestaurant = async (data: Omit<Restaurant, 'createdAt'>) => {
  if (!db) return null;
  const docRef = doc(db, 'restaurants', data.id);
  const restaurant = { ...data, createdAt: serverTimestamp() };
  await setDoc(docRef, restaurant);
  return restaurant;
};

export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  if (!db) return [];
  const collRef = collection(db, 'restaurants');
  const snap = await getDocs(collRef);
  return snap.docs.map(doc => doc.data() as Restaurant);
};

// --- Hospitalities ---
export const createHospitality = async (data: Omit<Hospitality, 'id' | 'createdAt' | 'status'>) => {
  if (!db) return null;
  const collRef = collection(db, 'hospitalities');
  const docData = { ...data, status: 'pending', createdAt: serverTimestamp() };
  const docRef = await addDoc(collRef, docData);
  return { id: docRef.id, ...docData };
};

export const getHospitality = async (id: string): Promise<Hospitality | null> => {
  if (!db) return null;
  const docRef = doc(db, 'hospitalities', id);
  const snap = await getDoc(docRef);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Hospitality) : null;
};

export const redeemHospitality = async (id: string) => {
  if (!db) return;
  const docRef = doc(db, 'hospitalities', id);
  await updateDoc(docRef, {
    status: 'redeemed',
    redeemedAt: serverTimestamp()
  });
};
