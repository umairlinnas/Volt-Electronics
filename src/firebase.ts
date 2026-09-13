import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Product, Order, FlashOffer, AdminStaffMember } from './types';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Firestore with the project's provisioned Database ID
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Collections references
export const PRODUCTS_COLLECTION = 'products';
export const ORDERS_COLLECTION = 'orders';
export const OFFERS_COLLECTION = 'offers';
export const STAFF_COLLECTION = 'staff';

/**
 * Sync initial dataset to Firestore if collections are empty (first run initialization)
 */
export async function seedFirestoreIfEmpty(
  initialProducts: Product[],
  initialOffers: FlashOffer[],
  initialOrders: Order[],
  initialStaff: AdminStaffMember[]
) {
  try {
    const productsSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (productsSnap.empty && initialProducts.length > 0) {
      console.log('Seeding initial products into Firestore...');
      for (const prod of initialProducts) {
        await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), prod);
      }
    }

    const offersSnap = await getDocs(collection(db, OFFERS_COLLECTION));
    if (offersSnap.empty && initialOffers.length > 0) {
      console.log('Seeding initial offers into Firestore...');
      for (const off of initialOffers) {
        await setDoc(doc(db, OFFERS_COLLECTION, off.id), off);
      }
    }

    const ordersSnap = await getDocs(collection(db, ORDERS_COLLECTION));
    if (ordersSnap.empty && initialOrders.length > 0) {
      console.log('Seeding initial orders into Firestore...');
      for (const ord of initialOrders) {
        await setDoc(doc(db, ORDERS_COLLECTION, ord.id), ord);
      }
    }

    const staffSnap = await getDocs(collection(db, STAFF_COLLECTION));
    if (staffSnap.empty && initialStaff.length > 0) {
      console.log('Seeding initial staff members into Firestore...');
      for (const s of initialStaff) {
        await setDoc(doc(db, STAFF_COLLECTION, s.id), s);
      }
    }
  } catch (err) {
    console.warn('Firestore seeding notice (fallback active):', err);
  }
}

/**
 * Firestore Product Operations
 */
export async function fetchFirestoreProducts(): Promise<Product[]> {
  const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
  return snap.docs.map(d => d.data() as Product);
}

export async function saveFirestoreProduct(product: Product): Promise<void> {
  await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
}

export async function updateFirestoreProduct(id: string, updates: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), updates);
}

export async function deleteFirestoreProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

/**
 * Firestore Order Operations
 */
export async function fetchFirestoreOrders(): Promise<Order[]> {
  const snap = await getDocs(collection(db, ORDERS_COLLECTION));
  return snap.docs.map(d => d.data() as Order);
}

export async function saveFirestoreOrder(order: Order): Promise<void> {
  await setDoc(doc(db, ORDERS_COLLECTION, order.id), order);
}

export async function updateFirestoreOrderStatus(
  orderId: string, 
  status: string, 
  note?: string
): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  const snap = await getDoc(orderRef);
  if (snap.exists()) {
    const existing = snap.data() as Order;
    const history = existing.statusHistory || [];
    const updatedHistory = [
      ...history,
      {
        status: status as any,
        timestamp: new Date().toISOString(),
        note: note || `Status updated to ${status}`
      }
    ];
    await updateDoc(orderRef, {
      status,
      statusHistory: updatedHistory
    });
  }
}

/**
 * Firestore Offers Operations
 */
export async function fetchFirestoreOffers(): Promise<FlashOffer[]> {
  const snap = await getDocs(collection(db, OFFERS_COLLECTION));
  return snap.docs.map(d => d.data() as FlashOffer);
}

export async function saveFirestoreOffer(offer: FlashOffer): Promise<void> {
  await setDoc(doc(db, OFFERS_COLLECTION, offer.id), offer);
}

/**
 * Firestore Staff Operations
 */
export async function fetchFirestoreStaff(): Promise<AdminStaffMember[]> {
  const snap = await getDocs(collection(db, STAFF_COLLECTION));
  return snap.docs.map(d => d.data() as AdminStaffMember);
}

export async function saveFirestoreStaff(staff: AdminStaffMember): Promise<void> {
  await setDoc(doc(db, STAFF_COLLECTION, staff.id), staff);
}

export async function deleteFirestoreStaff(staffId: string): Promise<void> {
  await deleteDoc(doc(db, STAFF_COLLECTION, staffId));
}
