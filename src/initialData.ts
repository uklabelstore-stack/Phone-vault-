import { Contact, SMSMessage, VaultFile, SecureNote } from './types';

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Sarah Connor',
    phone: '+1 (555) 019-2834',
    email: 'sarah.connor@sky.net',
    group: 'Family',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c2',
    name: 'Marcus Wright',
    phone: '+1 (555) 042-9981',
    email: 'marcus@projectangel.org',
    group: 'Work',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c3',
    name: 'John Connor',
    phone: '+1 (555) 011-1991',
    email: 'john.resistance@future.io',
    group: 'Family',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c4',
    name: 'Dr. Silberman',
    phone: '+1 (555) 987-6543',
    email: 'silberman@pescadetopsych.com',
    group: 'Other',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const INITIAL_MESSAGES: SMSMessage[] = [
  {
    id: 'm1',
    contactName: 'Sarah Connor',
    contactPhone: '+1 (555) 019-2834',
    message: 'Are you safe? Keep your phone backup updated at all times.',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    type: 'incoming',
  },
  {
    id: 'm2',
    contactName: 'Sarah Connor',
    contactPhone: '+1 (555) 019-2834',
    message: 'Yes, just synced everything to the encrypted cloud vault.',
    timestamp: new Date(Date.now() - 2.9 * 3600 * 1000).toISOString(),
    type: 'outgoing',
  },
  {
    id: 'm3',
    contactName: 'John Connor',
    contactPhone: '+1 (555) 011-1991',
    message: 'Did you get the system files? We need them backed up.',
    timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    type: 'incoming',
  }
];

export const INITIAL_FILES: VaultFile[] = [
  {
    id: 'f1',
    name: 'system_schematic.png',
    size: 245000,
    type: 'image/png',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'f2',
    name: 'confidential_journal.txt',
    size: 4120,
    type: 'text/plain',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const INITIAL_NOTES: SecureNote[] = [
  {
    id: 'n1',
    title: 'Cyberdyne Entry Codes',
    content: 'Main gate: 4892\nServer Room: 0012\nEmergency override: *#9999#',
    isLocked: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'n2',
    title: 'Resistance Safehouses',
    content: 'Sector 4: Abandoned subway tunnel below 5th St.\nSector 7: Warehouse with green doors near harbor.',
    isLocked: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];
