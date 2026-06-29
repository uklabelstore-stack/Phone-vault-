export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  group: 'Family' | 'Work' | 'Friends' | 'Other';
  createdAt: string;
}

export interface SMSMessage {
  id: string;
  contactName: string;
  contactPhone: string;
  message: string;
  timestamp: string;
  type: 'incoming' | 'outgoing';
}

export interface VaultFile {
  id: string;
  name: string;
  size: number; // in bytes
  type: string; // mime-type
  dataUrl?: string; // for uploaded images or text files
  createdAt: string;
}

export interface SecureNote {
  id: string;
  title: string;
  content: string;
  isLocked: boolean;
  createdAt: string;
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  deviceName: string;
  contacts: Contact[];
  messages: SMSMessage[];
  files: VaultFile[];
  notes: SecureNote[];
  totalSize: number; // calculated total size in bytes
  version: string;
}

export interface UserSession {
  phoneNumber: string;
  isAuthenticated: boolean;
  isLocked: boolean;
  vaultPin?: string;
}

export interface DeviceState {
  contacts: Contact[];
  messages: SMSMessage[];
  files: VaultFile[];
  notes: SecureNote[];
}
