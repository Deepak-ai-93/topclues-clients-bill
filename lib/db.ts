import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_FILE = path.join(process.cwd(), 'db.json');

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const computedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === computedHash;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'client';
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface Client {
  id: string;
  userId: string;
  companyName: string;
  clientName: string;
  email: string;
  phoneNumber: string;
  businessAddress: string;
  gstNumber?: string;
  notes?: string;
  packageId: string;
  packageValidity: string; // "YYYY-MM-DD"
  accountStatus: 'active' | 'suspended';
  lastLogin?: string;
  createdAt: string;
}

export interface Package {
  id: string;
  name: string;
  pricing: number;
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  includedServices: string[]; // e.g. ["SEO", "AdWords", "Content Marketing"]
  featureList: string[]; // e.g. ["Dedicated Manager", "Weekly Reports"]
  optionalAddOns: { name: string; price: number }[];
  supportLevel: 'Standard' | 'Priority' | '24/7 Dedicated';
  description: string;
  createdAt: string;
}

export interface ClientPackageHistory {
  id: string;
  clientId: string;
  packageId: string;
  assignedAt: string;
  validUntil: string;
  status: 'active' | 'expired' | 'upgraded';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  billingMonth: string; // "July 2026"
  issueDate: string;
  dueDate: string;
  paymentStatus: 'paid' | 'pending' | 'overdue' | 'void';
  amount: number;
  packageId: string;
  packageName: string;
  remarks?: string;
  pdfUrl: string; // Storage URL or base64 data URL or local /api/storage path
  pdfName: string;
  clientId: string;
  createdAt: string;
}

export interface UpgradeRequest {
  id: string;
  clientId: string;
  companyName: string;
  clientName: string;
  fromPackageId: string;
  fromPackageName: string;
  toPackageId: string;
  toPackageName: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNotes?: string;
  createdAt: string;
}

export interface ClientNotification {
  id: string;
  clientId: string;
  title: string;
  message: string;
  type: 'invoice' | 'package' | 'support' | 'announcement';
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  role: 'admin' | 'client';
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface LoginHistory {
  id: string;
  userId: string;
  email: string;
  role: 'admin' | 'client';
  loginTime: string;
  ipAddress: string;
  userAgent: string;
}

export interface SupportTicket {
  id: string;
  clientId: string;
  companyName: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  replies: {
    id: string;
    sender: 'admin' | 'client';
    senderName: string;
    message: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface AdminSettings {
  companyName: string;
  emailNotificationsEnabled: boolean;
  billingCycleDefaults: 'monthly' | 'annually';
  announcement: string;
}

export interface DatabaseSchema {
  users: User[];
  clients: Client[];
  packages: Package[];
  packageHistory: ClientPackageHistory[];
  invoices: Invoice[];
  upgradeRequests: UpgradeRequest[];
  notifications: ClientNotification[];
  activityLogs: ActivityLog[];
  loginHistory: LoginHistory[];
  supportTickets: SupportTicket[];
  settings: AdminSettings;
}

// Initial empty database
const INITIAL_DB: DatabaseSchema = {
  users: [],
  clients: [],
  packages: [],
  packageHistory: [],
  invoices: [],
  upgradeRequests: [],
  notifications: [],
  activityLogs: [],
  loginHistory: [],
  supportTickets: [],
  settings: {
    companyName: '',
    emailNotificationsEnabled: false,
    billingCycleDefaults: 'monthly',
    announcement: '',
  }
};

// Database helper functions with file locks
export function getDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      return INITIAL_DB;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    if (!content.trim()) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      return INITIAL_DB;
    }
    return JSON.parse(content) as DatabaseSchema;
  } catch (err) {
    console.error('Error reading database file, returning default', err);
    return INITIAL_DB;
  }
}

export function saveDb(db: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file', err);
  }
}

// Security Audit Logs Helper
export function logActivity(userId: string, userEmail: string, role: 'admin' | 'client', action: string, details: string) {
  const db = getDb();
  const newLog: ActivityLog = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    userEmail,
    role,
    action,
    details,
    ipAddress: '127.0.0.1',
    createdAt: new Date().toISOString(),
  };
  db.activityLogs.unshift(newLog);
  saveDb(db);
}
