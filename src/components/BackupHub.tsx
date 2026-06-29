import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, Shield, Cloud, Clock, CheckCircle, AlertCircle, 
  User, Users, MessageSquare, Folder, Image, FileText, 
  Trash2, Plus, ArrowRight, ShieldCheck, RefreshCw, KeyRound, 
  Upload, Download, FileCode, CheckCheck, Sparkles, ChevronRight,
  Fingerprint, Monitor, Check
} from 'lucide-react';
import { Contact, SMSMessage, VaultFile, SecureNote, BackupSnapshot, UserSession, DeviceState } from '../types';
import { INITIAL_CONTACTS, INITIAL_MESSAGES, INITIAL_FILES, INITIAL_NOTES } from '../initialData';

interface BackupHubProps {
  deviceState: DeviceState;
  setDeviceState: React.Dispatch<React.SetStateAction<DeviceState>>;
  backups: BackupSnapshot[];
  setBackups: React.Dispatch<React.SetStateAction<BackupSnapshot[]>>;
  session: UserSession;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
}

export default function BackupHub({
  deviceState,
  setDeviceState,
  backups,
  setBackups,
  session,
  setSession,
}: BackupHubProps) {
  // Navigation inside simulated phone app
  // Screens: 'login-phone' | 'login-otp' | 'dashboard' | 'contacts' | 'messages' | 'files' | 'notes' | 'backup-progress' | 'restore-list'
  const [currentScreen, setCurrentScreen] = useState<string>('login-phone');
  
  // Login input states
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Backup progress states
  const [backupStep, setBackupStep] = useState(0);
  const [backupStatus, setBackupStatus] = useState('');
  const [backupLog, setBackupLog] = useState<string[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Active inputs inside app tabs
  // 1. Contacts
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', group: 'Friends' as any });
  const [isAddingContact, setIsAddingContact] = useState(false);
  
  // 2. Messages
  const [newMsgText, setNewMsgText] = useState('');
  const [selectedContactForMsg, setSelectedContactForMsg] = useState<Contact | null>(null);

  // 3. Notes
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [pinUnlockInput, setPinUnlockInput] = useState('');
  const [pinSetupInput, setPinSetupInput] = useState('');
  const [pinError, setPinError] = useState('');

  // 4. File uploads & drag-n-drop
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active categories selected for backup
  const [backupCategories, setBackupCategories] = useState({
    contacts: true,
    messages: true,
    files: true,
    notes: true,
  });

  // Load correct initial screen based on session state
  useEffect(() => {
    if (session.isAuthenticated) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('login-phone');
    }
  }, [session.isAuthenticated]);

  // Handle Simulated SMS OTP Trigger
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 8) {
      setLoginError('Please enter a valid phone number.');
      return;
    }
    setLoginError('');
    setIsOtpSending(true);

    setTimeout(() => {
      setIsOtpSending(false);
      setOtpSent(true);
      setCurrentScreen('login-otp');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput !== '123456') {
      setLoginError('Invalid verification code. Hint: Use 123456');
      return;
    }

    setLoginError('');
    setSuccessAnimation(true);

    setTimeout(() => {
      setSuccessAnimation(false);
      setSession(prev => ({
        ...prev,
        phoneNumber: phoneInput,
        isAuthenticated: true,
      }));
      setCurrentScreen('dashboard');
    }, 1000);
  };

  // Run Simulated Interactive Backup with Progress Logger
  const triggerBackup = () => {
    if (isBackingUp) return;
    setIsBackingUp(true);
    setBackupStep(0);
    setBackupLog([]);
    setCurrentScreen('backup-progress');

    const addLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setBackupLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
          resolve();
        }, delay);
      });
    };

    const steps = async () => {
      setBackupStatus('Initializing safe tunnel...');
      await addLog('Establishing connection to secure Vault servers...', 500);
      await addLog('Tunnel established using quantum-resistant AES-256...', 600);
      
      setBackupStep(1);
      setBackupStatus('Preparing device snapshots...');
      if (backupCategories.contacts) {
        await addLog(`Scanning contacts database: Found ${deviceState.contacts.length} entries.`, 600);
        await addLog('Compressing and hashing contact list elements.', 500);
      } else {
        await addLog('Skipping contacts backup (User bypassed).', 100);
      }

      setBackupStep(2);
      setBackupStatus('Archiving communications...');
      if (backupCategories.messages) {
        await addLog(`Packaging SMS threads: Found ${deviceState.messages.length} messages.`, 600);
        await addLog('Indexing chat payloads for high-speed restoration.', 500);
      } else {
        await addLog('Skipping messages backup (User bypassed).', 100);
      }

      setBackupStep(3);
      setBackupStatus('Encrypting user files...');
      if (backupCategories.files) {
        await addLog(`Preparing storage directories: ${deviceState.files.length} active files.`, 600);
        await addLog('Validating files signatures & checking storage capacity.', 500);
      } else {
        await addLog('Skipping files & photos backup (User bypassed).', 100);
      }

      setBackupStep(4);
      setBackupStatus('Locking secure notes...');
      if (backupCategories.notes) {
        await addLog(`Encrypting offline notes: ${deviceState.notes.length} notes identified.`, 600);
        await addLog('Securing notes with double-wrap key block.', 400);
      } else {
        await addLog('Skipping secure notes backup (User bypassed).', 100);
      }

      setBackupStep(5);
      setBackupStatus('Synchronizing state to Vault...');
      await addLog('Transmitting payloads securely (AES-GCM encrypted block)...', 800);
      await addLog('Upload complete. Synchronizing cloud storage registries...', 600);

      // Create actual Backup Snapshot in history state!
      const totalSize = 
        (backupCategories.contacts ? deviceState.contacts.length * 128 : 0) +
        (backupCategories.messages ? deviceState.messages.length * 256 : 0) +
        (backupCategories.files ? deviceState.files.reduce((sum, f) => sum + f.size, 0) : 0) +
        (backupCategories.notes ? deviceState.notes.length * 1024 : 0);

      const newSnapshot: BackupSnapshot = {
        id: 'snap-' + Date.now(),
        timestamp: new Date().toISOString(),
        deviceName: 'Android Simulator Core',
        contacts: backupCategories.contacts ? [...deviceState.contacts] : [],
        messages: backupCategories.messages ? [...deviceState.messages] : [],
        files: backupCategories.files ? [...deviceState.files] : [],
        notes: backupCategories.notes ? [...deviceState.notes] : [],
        totalSize: totalSize || 1024, // fallback min size
        version: 'v1.0.0'
      };

      setBackups(prev => [newSnapshot, ...prev]);
      await addLog('Vault registration verified. Backup ID: ' + newSnapshot.id, 400);
      await addLog('Backup successfully stored & sealed!', 300);

      setBackupStep(6);
      setBackupStatus('Backup Completed!');
      setTimeout(() => {
        setIsBackingUp(false);
        setCurrentScreen('dashboard');
      }, 1500);
    };

    steps();
  };

  // Perform Restore operation from a specific Snapshot
  const handleRestoreBackup = (snapshot: BackupSnapshot) => {
    // Overwrite device data with snapshot data (or merge, but overwrite shows the clear recovery)
    setDeviceState({
      contacts: [...snapshot.contacts],
      messages: [...snapshot.messages],
      files: [...snapshot.files],
      notes: [...snapshot.notes]
    });

    // Flash screen success or direct redirect
    alert(`Success! Restored device to backup snapshot from ${new Date(snapshot.timestamp).toLocaleString()}`);
    setCurrentScreen('dashboard');
  };

  // Handle Add Contact on local device
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    
    const contact: Contact = {
      id: 'c-' + Date.now(),
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email || 'no-email@vault.local',
      group: newContact.group,
      createdAt: new Date().toISOString()
    };

    setDeviceState(prev => ({
      ...prev,
      contacts: [contact, ...prev.contacts]
    }));

    setNewContact({ name: '', phone: '', email: '', group: 'Friends' });
    setIsAddingContact(false);
  };

  // Handle Remove Contact on local device
  const handleRemoveContact = (id: string) => {
    setDeviceState(prev => ({
      ...prev,
      contacts: prev.contacts.filter(c => c.id !== id)
    }));
  };

  // Handle Add Message (Simulate Sending/Receiving SMS)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim() || !selectedContactForMsg) return;

    const myMsg: SMSMessage = {
      id: 'm-' + Date.now(),
      contactName: selectedContactForMsg.name,
      contactPhone: selectedContactForMsg.phone,
      message: newMsgText,
      timestamp: new Date().toISOString(),
      type: 'outgoing'
    };

    setDeviceState(prev => ({
      ...prev,
      messages: [...prev.messages, myMsg]
    }));

    setNewMsgText('');

    // Simulate quick incoming auto-response to keep the thread alive and interactive!
    setTimeout(() => {
      const replyMsg: SMSMessage = {
        id: 'm-reply-' + Date.now(),
        contactName: selectedContactForMsg.name,
        contactPhone: selectedContactForMsg.phone,
        message: `Replied: Thanks! Received on my device. Auto backup is active.`,
        timestamp: new Date().toISOString(),
        type: 'incoming'
      };
      setDeviceState(prev => ({
        ...prev,
        messages: [...prev.messages, replyMsg]
      }));
    }, 1500);
  };

  // Handle File Upload and drag/drop helpers
  const processUploadedFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newFile: VaultFile = {
        id: 'f-' + Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: typeof reader.result === 'string' ? reader.result : undefined,
        createdAt: new Date().toISOString()
      };

      setDeviceState(prev => ({
        ...prev,
        files: [newFile, ...prev.files]
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Delete File
  const handleDeleteFile = (id: string) => {
    setDeviceState(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== id)
    }));
  };

  // Handle Secure Notes
  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;

    const note: SecureNote = {
      id: 'n-' + Date.now(),
      title: newNote.title,
      content: newNote.content,
      isLocked: !!session.vaultPin, // auto lock if vault PIN is active
      createdAt: new Date().toISOString()
    };

    setDeviceState(prev => ({
      ...prev,
      notes: [note, ...prev.notes]
    }));

    setNewNote({ title: '', content: '' });
    setIsAddingNote(false);
  };

  const handleDeleteNote = (id: string) => {
    setDeviceState(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
  };

  const handleSetupPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinSetupInput.length !== 4 || isNaN(Number(pinSetupInput))) {
      setPinError('PIN must be exactly 4 digits.');
      return;
    }
    setSession(prev => ({ ...prev, vaultPin: pinSetupInput, isLocked: false }));
    setPinSetupInput('');
    setPinError('');
    // apply lock to all current notes
    setDeviceState(prev => ({
      ...prev,
      notes: prev.notes.map(n => ({ ...n, isLocked: true }))
    }));
  };

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinUnlockInput === session.vaultPin) {
      setSession(prev => ({ ...prev, isLocked: false }));
      setPinUnlockInput('');
      setPinError('');
    } else {
      setPinError('Incorrect security PIN. Access denied.');
    }
  };

  const handleLockVault = () => {
    setSession(prev => ({ ...prev, isLocked: true }));
  };

  // Wipe whole local device state to showcase restore functionality!
  const wipeLocalDevice = () => {
    const confirm = window.confirm('WARNING: This will wipe all contacts, messages, notes, and files currently residing on this device. You will need to restore from a backup to recover them. Proceed?');
    if (confirm) {
      setDeviceState({
        contacts: [],
        messages: [],
        files: [],
        notes: []
      });
      alert('Local device storage has been wiped. Add some content or restore from a previous backup snapshot.');
    }
  };

  // Helper formats
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div id="backup-hub-root" className="flex flex-col h-full bg-slate-950">
      
      {/* 1. LOGIN SCREEN: PHONE INPUT */}
      {currentScreen === 'login-phone' && (
        <div id="screen-login-phone" className="flex-1 flex flex-col justify-between p-6 bg-slate-950 text-white">
          <div id="login-header" className="pt-12 text-center">
            <div id="logo-icon-box" className="mx-auto w-16 h-16 rounded-2xl bg-vault-600 flex items-center justify-center shadow-lg shadow-vault-950 border border-vault-400 mb-4 animate-bounce">
              <Database id="icon-db" className="w-8 h-8 text-white" />
            </div>
            <h1 id="app-title" className="text-2xl font-display font-bold tracking-tight text-white mb-2">Phone Vault</h1>
            <p id="app-subtitle" className="text-xs text-slate-400 max-w-[250px] mx-auto">
              Secure, zero-knowledge cloud backups for your Android communications, contacts & files.
            </p>
          </div>

          <form id="form-phone-login" onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label id="lbl-phone-number" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Enter Mobile Number
              </label>
              <div id="phone-input-group" className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl focus-within:border-vault-500 transition-colors">
                <span id="phone-country-code" className="pl-4 pr-2 text-slate-400 text-sm font-semibold border-r border-slate-800">+1</span>
                <input
                  id="input-phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div id="phone-login-error" className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 p-3 rounded-lg border border-red-900/30">
                <AlertCircle id="icon-error-phone" className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              id="btn-send-otp"
              type="submit"
              disabled={isOtpSending}
              className="w-full bg-vault-600 hover:bg-vault-500 text-white font-medium py-3.5 px-4 rounded-xl shadow-lg hover:shadow-vault-900/40 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              {isOtpSending ? (
                <>
                  <RefreshCw id="icon-otp-loading" className="w-4 h-4 animate-spin" />
                  <span>Requesting Secure OTP...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Phone</span>
                  <ArrowRight id="icon-otp-arrow" className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div id="login-footer" className="text-center pb-4 text-[10px] text-slate-500">
            <span id="footer-encryption-tag" className="flex items-center justify-center gap-1">
              <Shield id="icon-shield-footer" className="w-3.5 h-3.5 text-slate-400" />
              AES-256 Cloud Vault Encryption Standard
            </span>
          </div>
        </div>
      )}

      {/* 2. LOGIN SCREEN: OTP VERIFICATION */}
      {currentScreen === 'login-otp' && (
        <div id="screen-login-otp" className="flex-1 flex flex-col justify-between p-6 bg-slate-950 text-white">
          <div id="otp-header" className="pt-12 text-center">
            <div id="otp-shield-box" className="mx-auto w-16 h-16 rounded-2xl bg-emerald-950/80 flex items-center justify-center shadow-lg border border-emerald-500/30 mb-4">
              <KeyRound id="icon-key-otp" className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 id="otp-title" className="text-xl font-display font-bold tracking-tight text-white mb-2">Enter OTP Code</h1>
            <p id="otp-subtitle" className="text-xs text-slate-400 max-w-[280px] mx-auto">
              We sent a simulated 6-digit code to <span className="text-slate-200 font-semibold">+1 {phoneInput}</span>.
            </p>
            <span id="otp-hint-badge" className="mt-2 inline-block bg-slate-900 text-slate-400 border border-slate-800 text-[10px] px-2 py-0.5 rounded-full font-mono">
              Use test code: 123456
            </span>
          </div>

          <form id="form-otp-verify" onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <input
                id="input-otp"
                type="text"
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                required
              />
            </div>

            {loginError && (
              <div id="otp-error-box" className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 p-3 rounded-lg border border-red-900/30">
                <AlertCircle id="icon-error-otp" className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              id="btn-verify-otp"
              type="submit"
              disabled={successAnimation}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 px-4 rounded-xl shadow-lg hover:shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 text-sm active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {successAnimation ? (
                <>
                  <CheckCheck id="icon-otp-success" className="w-4 h-4 animate-ping" />
                  <span>Verified! Opening Vault...</span>
                </>
              ) : (
                <>
                  <ShieldCheck id="icon-otp-verify-shield" className="w-4 h-4" />
                  <span>Verify OTP Code</span>
                </>
              )}
            </button>

            <button
              id="btn-otp-back"
              type="button"
              onClick={() => setCurrentScreen('login-phone')}
              className="w-full text-slate-400 hover:text-slate-300 text-xs text-center py-2 underline"
            >
              Change phone number
            </button>
          </form>

          <div id="otp-security-footer" className="text-center pb-4 text-[10px] text-slate-500">
            <span>Secured with end-to-end sandbox handshake</span>
          </div>
        </div>
      )}

      {/* 3. MAIN DASHBOARD OVERVIEW */}
      {currentScreen === 'dashboard' && (
        <div id="screen-dashboard" className="flex-1 flex flex-col bg-slate-950">
          
          {/* Dashboard Header Banner */}
          <div id="dash-banner" className="bg-gradient-to-br from-slate-900 to-vault-950 p-5 border-b border-slate-800/80 relative overflow-hidden shrink-0">
            <div id="dash-banner-decor" className="absolute top-0 right-0 p-8 opacity-5">
              <Cloud id="decor-cloud" className="w-32 h-32 text-white" />
            </div>
            
            <div id="dash-user-badge" className="flex justify-between items-start">
              <div>
                <span id="dash-user-label" className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Encrypted Backup Active</span>
                <span id="dash-user-phone" className="text-sm font-semibold text-slate-200">{session.phoneNumber}</span>
              </div>
              <button
                id="btn-app-logout"
                onClick={() => setSession({ phoneNumber: '', isAuthenticated: false, isLocked: false })}
                className="text-[10px] text-slate-400 hover:text-red-400 transition-colors bg-slate-850 hover:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-800"
              >
                Log Out
              </button>
            </div>

            {/* Simulated Cloud Backup Sync Status Banner */}
            <div id="sync-status-banner" className="mt-4 flex items-center gap-3 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <div id="sync-status-icon-box" className="p-2 bg-vault-900/80 border border-vault-500/30 rounded-lg">
                <Cloud id="icon-cloud-status" className="w-5 h-5 text-vault-400" />
              </div>
              <div>
                <span id="sync-status-title" className="text-xs font-semibold text-slate-100 block">
                  {backups.length > 0 ? 'Your Vault is Synchronized' : 'Backup Needed'}
                </span>
                <span id="sync-status-desc" className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock id="icon-clock-desc" className="w-3 h-3" />
                  {backups.length > 0 
                    ? `Last Backup: ${new Date(backups[0].timestamp).toLocaleDateString()}` 
                    : 'No backups stored in vault yet.'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Quick Categories Navigation Panel */}
          <div id="dash-panel-body" className="flex-1 p-4 space-y-4">
            
            <h3 id="panel-title-categories" className="text-xs font-bold uppercase tracking-wider text-slate-500">Local Device Content</h3>
            
            <div id="categories-grid" className="grid grid-cols-2 gap-3">
              {/* Contacts Category */}
              <button
                id="category-item-contacts"
                onClick={() => setCurrentScreen('contacts')}
                className="bg-slate-900 hover:bg-slate-850 p-3 rounded-xl border border-slate-800/80 text-left flex flex-col justify-between h-24 relative hover:border-slate-700 transition-all cursor-pointer"
              >
                <div id="cat-header-contacts" className="flex justify-between items-start w-full">
                  <div id="icon-contacts-box" className="p-2 bg-blue-950 rounded-lg text-blue-400 border border-blue-900/30">
                    <Users id="icon-cat-users" className="w-4 h-4" />
                  </div>
                  <ChevronRight id="arrow-cat-users" className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <span id="cat-count-contacts" className="text-base font-bold font-mono text-white block">{deviceState.contacts.length}</span>
                  <span id="cat-label-contacts" className="text-[10px] text-slate-400">Contacts</span>
                </div>
              </button>

              {/* Messages Category */}
              <button
                id="category-item-messages"
                onClick={() => setCurrentScreen('messages')}
                className="bg-slate-900 hover:bg-slate-850 p-3 rounded-xl border border-slate-800/80 text-left flex flex-col justify-between h-24 relative hover:border-slate-700 transition-all cursor-pointer"
              >
                <div id="cat-header-messages" className="flex justify-between items-start w-full">
                  <div id="icon-messages-box" className="p-2 bg-purple-950 rounded-lg text-purple-400 border border-purple-900/30">
                    <MessageSquare id="icon-cat-sms" className="w-4 h-4" />
                  </div>
                  <ChevronRight id="arrow-cat-sms" className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <span id="cat-count-messages" className="text-base font-bold font-mono text-white block">{deviceState.messages.length}</span>
                  <span id="cat-label-messages" className="text-[10px] text-slate-400">SMS Messages</span>
                </div>
              </button>

              {/* Photos & Files Category */}
              <button
                id="category-item-files"
                onClick={() => setCurrentScreen('files')}
                className="bg-slate-900 hover:bg-slate-850 p-3 rounded-xl border border-slate-800/80 text-left flex flex-col justify-between h-24 relative hover:border-slate-700 transition-all cursor-pointer"
              >
                <div id="cat-header-files" className="flex justify-between items-start w-full">
                  <div id="icon-files-box" className="p-2 bg-amber-950 rounded-lg text-amber-400 border border-amber-900/30">
                    <Folder id="icon-cat-files" className="w-4 h-4" />
                  </div>
                  <ChevronRight id="arrow-cat-files" className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <span id="cat-count-files" className="text-base font-bold font-mono text-white block">{deviceState.files.length}</span>
                  <span id="cat-label-files" className="text-[10px] text-slate-400">Files & Photos</span>
                </div>
              </button>

              {/* Secure Notes Category */}
              <button
                id="category-item-notes"
                onClick={() => setCurrentScreen('notes')}
                className="bg-slate-900 hover:bg-slate-850 p-3 rounded-xl border border-slate-800/80 text-left flex flex-col justify-between h-24 relative hover:border-slate-700 transition-all cursor-pointer"
              >
                <div id="cat-header-notes" className="flex justify-between items-start w-full">
                  <div id="icon-notes-box" className="p-2 bg-rose-950 rounded-lg text-rose-400 border border-rose-900/30">
                    <Shield id="icon-cat-notes" className="w-4 h-4" />
                  </div>
                  <ChevronRight id="arrow-cat-notes" className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <span id="cat-count-notes" className="text-base font-bold font-mono text-white block">{deviceState.notes.length}</span>
                  <span id="cat-label-notes" className="text-[10px] text-slate-400">Secure Notes</span>
                </div>
              </button>
            </div>

            {/* Quick backup selection toggles */}
            <div id="backup-selector-card" className="bg-slate-900/50 rounded-xl border border-slate-800 p-3 space-y-2.5">
              <span id="selector-card-title" className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-1">Select Back Up Payload</span>
              
              <div id="selector-toggles-grid" className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={backupCategories.contacts}
                    onChange={(e) => setBackupCategories(prev => ({ ...prev, contacts: e.target.checked }))}
                    className="accent-vault-500 rounded" 
                  />
                  <span>Contacts</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={backupCategories.messages}
                    onChange={(e) => setBackupCategories(prev => ({ ...prev, messages: e.target.checked }))}
                    className="accent-vault-500 rounded" 
                  />
                  <span>Messages</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={backupCategories.files}
                    onChange={(e) => setBackupCategories(prev => ({ ...prev, files: e.target.checked }))}
                    className="accent-vault-500 rounded" 
                  />
                  <span>Files & Photos</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={backupCategories.notes}
                    onChange={(e) => setBackupCategories(prev => ({ ...prev, notes: e.target.checked }))}
                    className="accent-vault-500 rounded" 
                  />
                  <span>Secure Notes</span>
                </label>
              </div>
            </div>

            {/* Action Buttons: Trigger Backup & View Restore History */}
            <div id="dashboard-actions-box" className="space-y-2.5 pt-1">
              <button
                id="btn-trigger-backup-now"
                onClick={triggerBackup}
                className="w-full bg-gradient-to-r from-vault-600 to-vault-500 hover:from-vault-500 hover:to-vault-400 text-white py-3.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-vault-950 hover:shadow-vault-900/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Database id="icon-db-action" className="w-4 h-4" />
                <span>Backup Selected Data</span>
              </button>

              <div id="restore-wipe-split" className="grid grid-cols-2 gap-2.5">
                <button
                  id="btn-show-restores"
                  onClick={() => setCurrentScreen('restore-list')}
                  className="bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <RefreshCw id="icon-restore-trigger" className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Restore from Vault</span>
                </button>

                <button
                  id="btn-wipe-phone"
                  onClick={wipeLocalDevice}
                  className="bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 hover:border-red-900/50 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Trash2 id="icon-wipe-trigger" className="w-3.5 h-3.5 text-red-500" />
                  <span>Wipe Local Device</span>
                </button>
              </div>
            </div>

          </div>

          {/* Quick Stats Footer */}
          <div id="dash-footer-stats" className="bg-slate-900/40 border-t border-slate-900 p-3 text-center text-[10px] text-slate-500">
            <span>Powered by secure military-grade on-device sandboxing.</span>
          </div>

        </div>
      )}

      {/* 4. CONTACTS LIST SCREEN */}
      {currentScreen === 'contacts' && (
        <div id="screen-contacts" className="flex-1 flex flex-col bg-slate-950 text-slate-100">
          
          <div id="contacts-header" className="p-4 bg-slate-900 border-b border-slate-800/80 flex justify-between items-center shrink-0">
            <div>
              <h2 id="contacts-title" className="text-base font-semibold text-slate-200">Device Contacts</h2>
              <span id="contacts-subtitle" className="text-[10px] text-slate-400">{deviceState.contacts.length} saved on device</span>
            </div>
            <button
              id="btn-toggle-add-contact"
              onClick={() => setIsAddingContact(!isAddingContact)}
              className="bg-vault-600 hover:bg-vault-500 text-white p-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
              title="Add New Contact"
            >
              <Plus id="icon-add-contact" className="w-4 h-4" />
            </button>
          </div>

          {/* Add Contact Panel Overlay Form */}
          {isAddingContact && (
            <form id="form-add-contact" onSubmit={handleAddContact} className="p-4 bg-slate-900 border-b border-slate-800 space-y-3 shrink-0">
              <span id="add-contact-title" className="text-xs font-bold text-slate-300 block mb-1">Add New Contact</span>
              
              <div id="add-contact-inputs" className="space-y-2">
                <input
                  id="input-contact-name"
                  type="text"
                  placeholder="Full Name"
                  required
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-vault-500"
                />
                <input
                  id="input-contact-phone"
                  type="tel"
                  placeholder="Phone Number (e.g., (555) 012-3456)"
                  required
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-vault-500"
                />
                <input
                  id="input-contact-email"
                  type="email"
                  placeholder="Email (Optional)"
                  value={newContact.email}
                  onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-vault-500"
                />
                <div id="contact-group-select" className="flex items-center gap-2">
                  <span id="lbl-group" className="text-[10px] text-slate-400">Group:</span>
                  {(['Family', 'Work', 'Friends', 'Other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setNewContact(prev => ({ ...prev, group: g }))}
                      className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                        newContact.group === g 
                          ? 'bg-vault-950 text-vault-300 border-vault-500' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div id="add-contact-actions" className="flex justify-end gap-2 pt-1">
                <button
                  id="btn-cancel-contact"
                  type="button"
                  onClick={() => setIsAddingContact(false)}
                  className="text-[10px] text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded bg-slate-950 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-contact"
                  type="submit"
                  className="text-[10px] text-white bg-vault-600 hover:bg-vault-500 px-3 py-1.5 rounded font-medium"
                >
                  Save Contact
                </button>
              </div>
            </form>
          )}

          {/* Contacts List */}
          <div id="contacts-list" className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {deviceState.contacts.length === 0 ? (
              <div id="contacts-empty" className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <Users id="icon-no-contacts" className="w-8 h-8 text-slate-700" />
                <span id="no-contacts-msg" className="text-xs">No contacts on this local device.</span>
              </div>
            ) : (
              deviceState.contacts.map((contact) => (
                <div
                  key={contact.id}
                  id={`contact-item-${contact.id}`}
                  className="bg-slate-900 border border-slate-850/60 rounded-xl p-3 flex items-center justify-between"
                >
                  <div id="contact-info" className="flex items-center gap-3">
                    <div id="contact-avatar" className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-vault-300 uppercase">
                      {contact.name.substring(0, 2)}
                    </div>
                    <div>
                      <span id="contact-name" className="text-xs font-semibold text-slate-200 block">{contact.name}</span>
                      <span id="contact-phone" className="text-[10px] text-slate-400 block font-mono">{contact.phone}</span>
                      <span id={`contact-group-tag-${contact.id}`} className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-slate-950 text-vault-400 border border-slate-800">
                        {contact.group}
                      </span>
                    </div>
                  </div>
                  
                  <div id="contact-actions" className="flex items-center gap-1.5">
                    <button
                      id={`btn-chat-contact-${contact.id}`}
                      onClick={() => {
                        setSelectedContactForMsg(contact);
                        setCurrentScreen('messages');
                      }}
                      className="p-1.5 hover:bg-slate-850 rounded text-slate-400 hover:text-purple-400 transition-colors"
                      title="Message contact"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      id={`btn-delete-contact-${contact.id}`}
                      onClick={() => handleRemoveContact(contact.id)}
                      className="p-1.5 hover:bg-slate-850 rounded text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* 5. MESSAGES & SMS LOGS SCREEN */}
      {currentScreen === 'messages' && (
        <div id="screen-messages" className="flex-1 flex flex-col bg-slate-950 text-slate-100">
          
          <div id="messages-selector-header" className="p-4 bg-slate-900 border-b border-slate-800/80 shrink-0">
            <span id="sms-sel-label" className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Select Active Thread</span>
            
            <div id="sms-sel-contacts" className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              {deviceState.contacts.map((c) => (
                <button
                  key={c.id}
                  id={`thread-select-${c.id}`}
                  onClick={() => setSelectedContactForMsg(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border shrink-0 transition-all cursor-pointer ${
                    selectedContactForMsg?.id === c.id
                      ? 'bg-purple-950 border-purple-500 text-purple-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Chat Conversation Panel */}
          {selectedContactForMsg ? (
            <div id="chat-thread-container" className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Message History Scroller */}
              <div id="sms-scroller" className="flex-1 overflow-y-auto p-4 space-y-3">
                <div id="chat-start-alert" className="text-center py-2">
                  <span className="text-[9px] bg-slate-900 text-slate-500 border border-slate-850 px-2.5 py-1 rounded-full font-mono">
                    Encryption: On-device AES-256 logs
                  </span>
                </div>

                {deviceState.messages
                  .filter(m => m.contactPhone === selectedContactForMsg.phone)
                  .map((msg) => (
                    <div
                      key={msg.id}
                      id={`msg-bubble-${msg.id}`}
                      className={`flex flex-col max-w-[80%] ${
                        msg.type === 'outgoing' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl text-xs ${
                          msg.type === 'outgoing'
                            ? 'bg-purple-600 text-white rounded-tr-none'
                            : 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <span className="text-[8px] text-slate-500 mt-1 px-1 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Chat Input Bar */}
              <form id="form-chat-send" onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 shrink-0">
                <input
                  id="input-chat-text"
                  type="text"
                  placeholder={`Send SMS to ${selectedContactForMsg.name}...`}
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
                <button
                  id="btn-chat-send"
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white px-3 rounded-xl flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                  title="Send message"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div id="sms-thread-empty" className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <MessageSquare id="icon-no-active-chat" className="w-10 h-10 text-slate-700 mb-2" />
              <span id="no-active-chat-msg" className="text-xs font-semibold">Select a contact above to write or simulate SMS message logs.</span>
            </div>
          )}

        </div>
      )}

      {/* 6. PHOTOS & FILES SCREEN */}
      {currentScreen === 'files' && (
        <div id="screen-files" className="flex-1 flex flex-col bg-slate-950 text-slate-100">
          
          <div id="files-header" className="p-4 bg-slate-900 border-b border-slate-800/80 shrink-0">
            <h2 id="files-title" className="text-base font-semibold text-slate-200">Device Local Storage</h2>
            <span id="files-subtitle" className="text-[10px] text-slate-400">Upload or drop files/photos to simulate phone storage.</span>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            id="drag-drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`m-4 p-5 rounded-2xl border-2 border-dashed text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
              isDragging 
                ? 'border-vault-500 bg-vault-950/40 text-vault-300' 
                : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 text-slate-400 hover:border-slate-700'
            }`}
          >
            <input
              id="input-file-system"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload id="icon-drop-upload" className="w-7 h-7 text-vault-400 animate-pulse" />
            <span id="drop-text-primary" className="text-xs font-semibold">Drag & Drop or Click to Upload</span>
            <span id="drop-text-secondary" className="text-[9px] text-slate-500">Supports image files, txt, docs, and configurations</span>
          </div>

          {/* Files List on Local Storage */}
          <div id="files-list" className="flex-1 overflow-y-auto px-4 pb-4 space-y-2.5">
            <span id="title-local-files" className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Active On-Device Files</span>

            {deviceState.files.length === 0 ? (
              <div id="files-empty" className="py-8 text-center text-slate-600 flex flex-col items-center justify-center gap-1.5">
                <Folder id="icon-no-files" className="w-8 h-8 text-slate-800" />
                <span id="no-files-msg" className="text-xs">No media or files currently stored locally.</span>
              </div>
            ) : (
              deviceState.files.map((file) => (
                <div
                  key={file.id}
                  id={`file-item-${file.id}`}
                  className="bg-slate-900 border border-slate-850/60 rounded-xl p-3 flex items-center justify-between"
                >
                  <div id="file-meta" className="flex items-center gap-3 overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      file.dataUrl ? (
                        <img 
                          id={`img-thumb-${file.id}`}
                          src={file.dataUrl} 
                          alt={file.name} 
                          className="w-9 h-9 rounded bg-slate-950 object-cover border border-slate-800"
                        />
                      ) : (
                        <div id={`icon-thumb-fallback-${file.id}`} className="w-9 h-9 rounded bg-amber-950 flex items-center justify-center text-amber-400 border border-amber-900/30 shrink-0">
                          <Image className="w-4 h-4" />
                        </div>
                      )
                    ) : (
                      <div id={`icon-thumb-doc-${file.id}`} className="w-9 h-9 rounded bg-blue-950 flex items-center justify-center text-blue-400 border border-blue-900/30 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <span id={`file-name-${file.id}`} className="text-xs font-semibold text-slate-200 block truncate" title={file.name}>
                        {file.name}
                      </span>
                      <span id={`file-size-${file.id}`} className="text-[9px] text-slate-400 font-mono block">
                        {formatBytes(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button
                    id={`btn-delete-file-${file.id}`}
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-1.5 hover:bg-slate-850 rounded text-slate-400 hover:text-red-400 transition-colors shrink-0"
                    title="Delete file"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* 7. SECURE NOTES SCREEN */}
      {currentScreen === 'notes' && (
        <div id="screen-notes" className="flex-1 flex flex-col bg-slate-950 text-slate-100">
          
          <div id="notes-header" className="p-4 bg-slate-900 border-b border-slate-800/80 flex justify-between items-center shrink-0">
            <div>
              <h2 id="notes-title" className="text-base font-semibold text-slate-200">Personal Secure Notes</h2>
              <span id="notes-subtitle" className="text-[10px] text-slate-400">{deviceState.notes.length} note items</span>
            </div>
            
            <div id="notes-actions-header" className="flex gap-2">
              {session.vaultPin && !session.isLocked && (
                <button
                  id="btn-lock-vault-action"
                  onClick={handleLockVault}
                  className="bg-red-950/80 text-red-400 hover:text-red-300 px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 border border-red-900/30 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Lock Notes
                </button>
              )}
              
              <button
                id="btn-toggle-add-note"
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="bg-vault-600 hover:bg-vault-500 text-white p-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
                title="Add New Note"
              >
                <Plus id="icon-add-note" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Secure Notes Access Barrier Form */}
          {session.vaultPin && session.isLocked ? (
            <div id="vault-pin-barrier" className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div id="pin-lock-icon-box" className="w-16 h-16 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 animate-pulse">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 id="pin-lock-title" className="text-sm font-semibold text-slate-200">Notes Encrypted & Sealed</h3>
              <p id="pin-lock-desc" className="text-xs text-slate-400 max-w-[240px]">
                To view or edit notes, unlock using your 4-digit Vault Security PIN.
              </p>
              
              <form id="form-unlock-pin" onSubmit={handleUnlockPin} className="space-y-3 w-full max-w-[200px]">
                <input
                  id="input-unlock-pin"
                  type="password"
                  maxLength={4}
                  placeholder="PIN code"
                  value={pinUnlockInput}
                  onChange={(e) => setPinUnlockInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-red-500"
                />
                
                {pinError && (
                  <span id="pin-error-msg" className="block text-[10px] text-red-400">{pinError}</span>
                )}

                <button
                  id="btn-submit-unlock"
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Decrypt Notes
                </button>
              </form>
            </div>
          ) : (
            <div id="notes-content-view" className="flex-1 flex flex-col overflow-hidden">
              
              {/* If no PIN configured, show setup warning */}
              {!session.vaultPin && (
                <div id="setup-pin-alert" className="m-4 p-3.5 bg-amber-950/25 border border-amber-900/30 rounded-xl space-y-2 shrink-0">
                  <div className="flex gap-2 text-amber-400 text-xs font-semibold">
                    <Shield className="w-4 h-4 shrink-0" />
                    <span>Vault PIN Protection Inactive</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Set a 4-digit master PIN to cryptographically lock and secure notes on this device and in backups.
                  </p>
                  
                  <form id="form-setup-pin" onSubmit={handleSetupPin} className="flex gap-2">
                    <input
                      id="input-setup-pin"
                      type="password"
                      maxLength={4}
                      placeholder="e.g., 2580"
                      value={pinSetupInput}
                      onChange={(e) => setPinSetupInput(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono w-24 text-center placeholder-slate-700"
                    />
                    <button
                      id="btn-submit-pin-setup"
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] px-3 py-1 rounded font-semibold cursor-pointer"
                    >
                      Set PIN
                    </button>
                  </form>
                </div>
              )}

              {/* Add Note Form Panel */}
              {isAddingNote && (
                <form id="form-add-note" onSubmit={handleCreateNote} className="p-4 bg-slate-900 border-b border-slate-800 space-y-3 shrink-0">
                  <span id="add-note-title" className="text-xs font-bold text-slate-300 block mb-1">Create Secure Note</span>
                  
                  <div id="add-note-inputs" className="space-y-2">
                    <input
                      id="input-note-title"
                      type="text"
                      placeholder="Note Title"
                      required
                      value={newNote.title}
                      onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-vault-500"
                    />
                    <textarea
                      id="input-note-content"
                      placeholder="Note Contents..."
                      required
                      rows={3}
                      value={newNote.content}
                      onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-vault-500"
                    />
                  </div>

                  <div id="add-note-actions" className="flex justify-end gap-2 pt-1">
                    <button
                      id="btn-cancel-note"
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="text-[10px] text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded bg-slate-950 border border-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      id="btn-submit-note"
                      type="submit"
                      className="text-[10px] text-white bg-vault-600 hover:bg-vault-500 px-3 py-1.5 rounded font-medium"
                    >
                      Encrypt & Save
                    </button>
                  </div>
                </form>
              )}

              {/* Notes List Scroller */}
              <div id="notes-list" className="flex-1 overflow-y-auto p-4 space-y-3">
                {deviceState.notes.length === 0 ? (
                  <div id="notes-empty" className="py-12 text-center text-slate-600 flex flex-col items-center justify-center gap-1.5">
                    <FileText id="icon-no-notes" className="w-8 h-8 text-slate-800" />
                    <span id="no-notes-msg" className="text-xs">No secure notes stored in device memory.</span>
                  </div>
                ) : (
                  deviceState.notes.map((note) => (
                    <div
                      key={note.id}
                      id={`note-item-${note.id}`}
                      className="bg-slate-900 border border-slate-850 rounded-xl p-3.5 space-y-2 shadow"
                    >
                      <div className="flex justify-between items-start">
                        <span id={`note-title-${note.id}`} className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          {note.title}
                        </span>
                        
                        <button
                          id={`btn-delete-note-${note.id}`}
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p id={`note-content-${note.id}`} className="text-[11px] text-slate-400 whitespace-pre-line leading-relaxed pl-4.5 border-l border-slate-800">
                        {note.content}
                      </p>

                      <div id="note-stamp-container" className="pt-1 text-[8px] text-slate-500 pl-4.5 font-mono">
                        Sealed: {new Date(note.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* 8. ACTIVE BACKUP PROGRESS LOOPS SCREEN */}
      {currentScreen === 'backup-progress' && (
        <div id="screen-backup-progress" className="flex-1 flex flex-col justify-between p-6 bg-slate-950 text-white scanline-effect select-none">
          
          <div id="backup-anim-header" className="pt-6 text-center space-y-2">
            <div id="backup-spin-box" className="mx-auto w-16 h-16 rounded-full bg-vault-950 border border-vault-500 flex items-center justify-center relative shadow-lg">
              <RefreshCw id="icon-backup-spinner" className="w-8 h-8 text-vault-400 animate-spin" />
              <div id="spinner-radar" className="absolute inset-0 rounded-full border-2 border-vault-500/20 animate-ping"></div>
            </div>
            <h1 id="backup-anim-title" className="text-lg font-display font-semibold tracking-wide text-vault-200">{backupStatus}</h1>
            <span id="backup-anim-progress-pct" className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              Encryption Stage {backupStep + 1} / 7
            </span>
          </div>

          {/* Backup Action Flow Progress Logger Console */}
          <div id="backup-terminal-log" className="flex-1 my-6 bg-slate-900 rounded-xl p-4 border border-slate-850 font-mono text-[9px] text-slate-400 flex flex-col gap-1.5 overflow-y-auto">
            {backupLog.map((log, index) => (
              <div key={index} id={`log-line-${index}`} className="leading-normal">
                <span className="text-vault-400">⚡</span> {log}
              </div>
            ))}
            <div id="terminal-cursor" className="w-2 h-3.5 bg-vault-400 animate-pulse inline-block mt-1"></div>
          </div>

          <div id="backup-anim-footer" className="space-y-3 pb-4">
            {/* Incremental Multi-Bar Indicators */}
            <div id="prog-bars-list" className="flex gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                    backupStep >= i ? 'bg-vault-400 shadow-sm shadow-vault-500' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <span id="term-foot-tag" className="block text-center text-[9px] text-slate-500 font-mono">
              Do not lock device screen or clear process
            </span>
          </div>

        </div>
      )}

      {/* 9. RESTORE HISTORY SELECTION SCREEN */}
      {currentScreen === 'restore-list' && (
        <div id="screen-restore-list" className="flex-1 flex flex-col bg-slate-950 text-slate-100">
          
          <div id="restore-header" className="p-4 bg-slate-900 border-b border-slate-800/80 shrink-0">
            <h2 id="restore-title" className="text-base font-semibold text-slate-200">Vault Restore Registry</h2>
            <span id="restore-subtitle" className="text-[10px] text-slate-400">Browse historical snapshots and restore device state.</span>
          </div>

          <div id="restore-scroller" className="flex-1 overflow-y-auto p-4 space-y-3">
            {backups.length === 0 ? (
              <div id="restore-empty" className="py-16 text-center text-slate-600 flex flex-col items-center justify-center gap-2">
                <Cloud id="icon-no-restore" className="w-10 h-10 text-slate-800" />
                <span id="no-restore-msg" className="text-xs font-semibold">No secure backups registered for this device yet.</span>
                <p className="text-[10px] text-slate-500 max-w-[200px] leading-relaxed mx-auto">
                  Click 'Backup Selected Data' on your Dashboard to generate your first encrypted snapshot.
                </p>
              </div>
            ) : (
              backups.map((snap) => (
                <div
                  key={snap.id}
                  id={`snap-item-${snap.id}`}
                  className="bg-slate-900 border border-slate-850 rounded-xl p-3.5 space-y-3 shadow-md hover:border-slate-800 transition-colors"
                >
                  <div id="snap-info" className="flex justify-between items-start">
                    <div>
                      <span id={`snap-date-${snap.id}`} className="text-xs font-bold text-slate-200 block">
                        {new Date(snap.timestamp).toLocaleString()}
                      </span>
                      <span id={`snap-id-${snap.id}`} className="text-[9px] text-vault-400 font-mono block uppercase">
                        ID: {snap.id}
                      </span>
                    </div>
                    
                    <span id={`snap-size-${snap.id}`} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-emerald-400 border border-slate-800">
                      {formatBytes(snap.totalSize)}
                    </span>
                  </div>

                  {/* Summary of what's inside this backup */}
                  <div id="snap-inventory" className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/60 p-2 rounded-lg border border-slate-850/50">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-400 shrink-0" />
                      Contacts: <strong className="text-slate-200">{snap.contacts.length}</strong>
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-purple-400 shrink-0" />
                      Messages: <strong className="text-slate-200">{snap.messages.length}</strong>
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Folder className="w-3 h-3 text-amber-400 shrink-0" />
                      Files: <strong className="text-slate-200">{snap.files.length}</strong>
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-rose-400 shrink-0" />
                      Notes: <strong className="text-slate-200">{snap.notes.length}</strong>
                    </span>
                  </div>

                  <button
                    id={`btn-restore-snap-${snap.id}`}
                    onClick={() => handleRestoreBackup(snap)}
                    className="w-full bg-slate-950 hover:bg-slate-850 text-emerald-400 hover:text-emerald-300 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-950 hover:border-emerald-900 active:scale-98 transition-all cursor-pointer"
                  >
                    <Download id="icon-snap-restore" className="w-3.5 h-3.5" />
                    <span>Apply Backup Restore</span>
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}
