import React, { useState } from 'react';
import { 
  Cloud, HardDrive, ShieldCheck, Download, Users, MessageSquare, 
  Folder, FileText, Clock, AlertCircle, KeyRound, ArrowRight,
  UserCheck, Shield, Lock, Unlock, ExternalLink, RefreshCw, Layers,
  ChevronRight, Image
} from 'lucide-react';
import { BackupSnapshot, UserSession, Contact, SMSMessage, VaultFile, SecureNote } from '../types';

interface CloudPortalProps {
  backups: BackupSnapshot[];
  session: UserSession;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
}

export default function CloudPortal({ backups, session, setSession }: CloudPortalProps) {
  // Navigation inside cloud portal
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>('');
  const [exploreTab, setExploreTab] = useState<'contacts' | 'messages' | 'files' | 'notes'>('contacts');
  
  // Login fields
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pin Unlock Barrier inside Web Portal
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isWebNotesUnlocked, setIsWebNotesUnlocked] = useState(false);

  // Active snapshot calculation
  const activeSnapshot = backups.find(b => b.id === selectedSnapshotId) || backups[0];

  // Auto-initialize active snapshot selection when backups change
  React.useEffect(() => {
    if (backups.length > 0 && !selectedSnapshotId) {
      setSelectedSnapshotId(backups[0].id);
    }
  }, [backups, selectedSnapshotId]);

  // Handle Login Flow
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 8) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    setErrorMsg('');
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput !== '123456') {
      setErrorMsg('Incorrect OTP. Use 123456 to verify.');
      return;
    }
    setErrorMsg('');
    setSession(prev => ({
      ...prev,
      phoneNumber: phoneInput,
      isAuthenticated: true,
    }));
  };

  // Trigger File Download in browser
  const triggerDownloadFile = (file: VaultFile) => {
    if (file.dataUrl) {
      const link = document.createElement('a');
      link.href = file.dataUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Simulate download text file for placeholder files
      const blob = new Blob([`Simulated secure restore block for: ${file.name}\nSize: ${file.size} bytes`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Decrypt Notes with Master PIN
  const handleUnlockNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === session.vaultPin) {
      setIsWebNotesUnlocked(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Incorrect security PIN. Decryption failure.');
    }
  };

  const handleLogout = () => {
    setSession({ phoneNumber: '', isAuthenticated: false, isLocked: false });
    setIsWebNotesUnlocked(false);
  };

  // Storage metric calculation
  const totalStorageUsed = backups.reduce((sum, b) => sum + b.totalSize, 0);
  const storageLimit = 15 * 1024 * 1024; // 15 MB free tier limit
  const storagePercent = Math.min((totalStorageUsed / storageLimit) * 100, 100);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div id="cloud-portal-container" className="h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative select-none">
      
      {/* Portal Top Nav */}
      <div id="portal-navbar" className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div id="portal-logo" className="flex items-center gap-2.5">
          <div id="portal-logo-indicator" className="w-9 h-9 rounded-xl bg-vault-600 flex items-center justify-center border border-vault-400">
            <Cloud id="icon-portal-cloud" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 id="portal-title-text" className="text-sm font-display font-bold tracking-tight text-white flex items-center gap-1">
              Phone Vault Cloud
              <span id="badge-portal-version" className="text-[9px] bg-vault-950 text-vault-300 px-1.5 py-0.2 rounded border border-vault-700 uppercase font-mono">Web Console</span>
            </h1>
            <span id="portal-subtitle-text" className="text-[10px] text-slate-500 block">Military-Grade Backup Server Terminal</span>
          </div>
        </div>

        {session.isAuthenticated && (
          <div id="portal-user-meta" className="flex items-center gap-4">
            <div id="portal-user-badge-wrapper" className="hidden sm:flex items-center gap-2 text-right">
              <div>
                <span id="portal-lbl-phone" className="text-[10px] text-slate-400 block font-mono">Authenticated Owner</span>
                <span id="portal-num-phone" className="text-xs font-semibold text-slate-200">{session.phoneNumber}</span>
              </div>
              <div id="portal-avatar-icon" className="w-8 h-8 rounded-full bg-slate-850 border border-slate-800 flex items-center justify-center text-slate-400">
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <button
              id="btn-portal-logout"
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-semibold cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* 1. NOT AUTHENTICATED: LANDING & WEB LOGIN */}
      {!session.isAuthenticated ? (
        <div id="portal-unauth-view" className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900/60 max-w-lg mx-auto w-full">
          <div id="landing-banner" className="text-center mb-8">
            <div id="landing-circle-shield" className="mx-auto w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-vault-400 mb-4 shadow-xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 id="landing-title" className="text-xl font-display font-semibold text-slate-100">Access Cloud Storage</h2>
            <p id="landing-desc" className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
              Log in with your verified mobile phone number to securely inspect, restore, or export files stored inside your private vault.
            </p>
          </div>

          <div id="portal-login-card" className="w-full bg-slate-950 border border-slate-800/80 p-6 rounded-2xl shadow-xl space-y-4">
            {!otpSent ? (
              <form id="form-portal-login-phone" onSubmit={handleRequestOtp} className="space-y-4">
                <div id="input-portal-phone-box" className="space-y-1.5">
                  <label id="lbl-portal-phone" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Registered Phone Number</label>
                  <div id="portal-phone-input-group" className="flex bg-slate-900 border border-slate-800 rounded-xl focus-within:border-vault-500 transition-colors overflow-hidden">
                    <span className="bg-slate-850 px-4 py-3 text-slate-400 text-sm font-semibold border-r border-slate-800">+1</span>
                    <input
                      id="input-portal-phone"
                      type="tel"
                      placeholder="(555) 012-3456"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-slate-600 focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                {errorMsg && (
                  <span id="portal-error-p1" className="text-xs text-red-400 block">{errorMsg}</span>
                )}

                <button
                  id="btn-portal-request-otp"
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full bg-vault-600 hover:bg-vault-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSendingOtp ? 'Transmitting handshake...' : 'Send Secure OTP'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form id="form-portal-login-otp" onSubmit={handleVerifyOtp} className="space-y-4">
                <div id="input-portal-otp-box" className="space-y-1.5">
                  <label id="lbl-portal-otp" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">6-Digit Access Code</label>
                  <input
                    id="input-portal-otp"
                    type="text"
                    placeholder="0 0 0 0 0 0"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-3 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-vault-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 text-center block mt-1">Hint: Use 123456</span>
                </div>

                {errorMsg && (
                  <span id="portal-error-p2" className="text-xs text-red-400 block">{errorMsg}</span>
                )}

                <button
                  id="btn-portal-submit-otp"
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Authorize Console Session
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* 2. AUTHENTICATED: VAULT SERVER EXPLORER */
        <div id="portal-explorer-layout" className="flex-1 flex overflow-hidden flex-col md:flex-row bg-slate-950/20">
          
          {/* Left panel: Backup snap lists & metrics */}
          <div id="portal-side-panel" className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 p-5 flex flex-col justify-between shrink-0 bg-slate-950/40">
            
            <div id="portal-side-top" className="space-y-6">
              {/* Storage Consumption Bar */}
              <div id="storage-metrics-box" className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3 shadow">
                <div id="storage-metrics-header" className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400 flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-vault-400" />
                    Cloud Vault Storage
                  </span>
                  <span className="text-slate-200 font-mono text-[10px]">
                    {formatBytes(totalStorageUsed)} / {formatBytes(storageLimit)}
                  </span>
                </div>
                
                <div id="storage-bar-outer" className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    id="storage-bar-inner"
                    style={{ width: `${storagePercent}%` }}
                    className="h-full bg-gradient-to-r from-vault-500 to-emerald-500 transition-all duration-500"
                  />
                </div>
                
                <div id="storage-limits-desc" className="flex justify-between items-center text-[9px] text-slate-500">
                  <span>Spark Sandbox Allocation</span>
                  <span>{storagePercent.toFixed(1)}% occupied</span>
                </div>
              </div>

              {/* Backups History Selectors */}
              <div id="portal-history-box" className="space-y-3">
                <span id="lbl-select-snap" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Select Backup Snapshot</span>
                
                <div id="history-scroller-vertical" className="space-y-2 max-h-[300px] overflow-y-auto">
                  {backups.length === 0 ? (
                    <div id="portal-history-empty" className="py-8 text-center text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl">
                      No backups received.
                    </div>
                  ) : (
                    backups.map((snap) => (
                      <button
                        key={snap.id}
                        id={`portal-snap-select-${snap.id}`}
                        onClick={() => setSelectedSnapshotId(snap.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                          selectedSnapshotId === snap.id
                            ? 'bg-vault-950 border-vault-500 shadow-sm shadow-vault-900/10'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <span id={`portal-snap-time-${snap.id}`} className="text-xs font-semibold text-slate-200 block">
                            {new Date(snap.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          <span id={`portal-snap-dev-${snap.id}`} className="text-[9px] text-slate-500 font-mono mt-0.5 block">
                            Device: {snap.deviceName}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Portal security disclaimer */}
            <div id="portal-side-bottom" className="pt-4 border-t border-slate-800/60 hidden md:block">
              <span id="disclaimer-title" className="text-[9px] font-bold uppercase text-slate-600 block mb-1">Vault Server Handshake</span>
              <p id="disclaimer-body" className="text-[9px] text-slate-500 leading-relaxed">
                Vault endpoints are protected with client-side Zero-Knowledge decryption bounds. All backups are stored as isolated cryptographic clusters.
              </p>
            </div>

          </div>

          {/* Right panel: Active Snapshot Content Explorer */}
          <div id="portal-content-panel" className="flex-1 flex flex-col overflow-hidden bg-slate-900/10">
            
            {activeSnapshot ? (
              <div id="portal-active-explorer" className="flex-1 flex flex-col overflow-hidden">
                {/* Active Snapshot Summary Bar */}
                <div id="active-snap-bar" className="bg-slate-950/60 border-b border-slate-800 p-5 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span id="portal-lbl-browsing" className="text-[10px] font-bold uppercase text-vault-400 tracking-widest block">Browsing Snapshot</span>
                    <h3 id="portal-browse-id" className="text-base font-semibold text-slate-100 mt-0.5 flex items-center gap-1.5 font-mono">
                      {activeSnapshot.id}
                    </h3>
                  </div>

                  <div id="portal-snap-meta-indicators" className="flex gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block">Backup Date</span>
                      <span className="font-semibold text-slate-300">{new Date(activeSnapshot.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block">Total Volume</span>
                      <span className="font-semibold text-emerald-400 font-mono">{formatBytes(activeSnapshot.totalSize)}</span>
                    </div>
                  </div>
                </div>

                {/* Explorer Tabs Navigation */}
                <div id="explorer-tabs-container" className="bg-slate-950/20 px-4 border-b border-slate-800 shrink-0 flex gap-2">
                  {[
                    { id: 'contacts', label: 'Contacts', count: activeSnapshot.contacts.length, icon: Users },
                    { id: 'messages', label: 'SMS Threads', count: activeSnapshot.messages.length, icon: MessageSquare },
                    { id: 'files', label: 'Files & Photos', count: activeSnapshot.files.length, icon: Folder },
                    { id: 'notes', label: 'Secure Notes', count: activeSnapshot.notes.length, icon: FileText },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      id={`tab-portal-${tab.id}`}
                      onClick={() => setExploreTab(tab.id as any)}
                      className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                        exploreTab === tab.id
                          ? 'border-vault-500 text-vault-300 bg-vault-950/10'
                          : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                      <span className="text-[9px] font-mono bg-slate-950 border border-slate-800 px-1.5 py-0.2 rounded-full text-slate-400">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Interactive Explorer Data Views */}
                <div id="explorer-tab-content" className="flex-1 overflow-y-auto p-6 bg-slate-950/10">
                  
                  {/* T1: CONTACTS VIEW */}
                  {exploreTab === 'contacts' && (
                    <div id="explorer-contacts-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeSnapshot.contacts.length === 0 ? (
                        <div className="col-span-2 py-16 text-center text-slate-500 text-xs">
                          No contacts stored in this snapshot.
                        </div>
                      ) : (
                        activeSnapshot.contacts.map((contact) => (
                          <div
                            key={contact.id}
                            id={`portal-contact-${contact.id}`}
                            className="bg-slate-900 border border-slate-850 p-3.5 rounded-xl flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-vault-300 border border-slate-700">
                                {contact.name.substring(0,2)}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-200 block">{contact.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{contact.phone}</span>
                                <span className="text-[9px] text-slate-500 block">{contact.email}</span>
                              </div>
                            </div>

                            <span className="text-[9px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-semibold uppercase">
                              {contact.group}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* T2: SMS MESSAGES VIEW */}
                  {exploreTab === 'messages' && (
                    <div id="explorer-messages-list" className="space-y-3.5 max-w-2xl mx-auto">
                      {activeSnapshot.messages.length === 0 ? (
                        <div className="py-16 text-center text-slate-500 text-xs">
                          No text messages archived in this snapshot.
                        </div>
                      ) : (
                        activeSnapshot.messages.map((msg) => (
                          <div
                            key={msg.id}
                            id={`portal-msg-${msg.id}`}
                            className={`p-4 rounded-xl border flex flex-col space-y-1.5 ${
                              msg.type === 'outgoing'
                                ? 'bg-slate-950/40 border-slate-850/60 ml-8'
                                : 'bg-slate-900 border-slate-800 mr-8'
                            }`}
                          >
                            <div className="flex justify-between items-center text-[10px] font-semibold">
                              <span className={msg.type === 'outgoing' ? 'text-purple-400 font-mono' : 'text-slate-300 font-mono'}>
                                {msg.type === 'outgoing' ? `To: ${msg.contactName} (${msg.contactPhone})` : `From: ${msg.contactName} (${msg.contactPhone})`}
                              </span>
                              <span className="text-slate-500 font-mono">
                                {new Date(msg.timestamp).toLocaleString()}
                              </span>
                            </div>
                            
                            <p className="text-xs text-slate-200 leading-relaxed font-sans">
                              {msg.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* T3: FILES & PHOTOS VIEW */}
                  {exploreTab === 'files' && (
                    <div id="explorer-files-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeSnapshot.files.length === 0 ? (
                        <div className="col-span-3 py-16 text-center text-slate-500 text-xs">
                          No files or media archived in this snapshot.
                        </div>
                      ) : (
                        activeSnapshot.files.map((file) => (
                          <div
                            key={file.id}
                            id={`portal-file-${file.id}`}
                            className="bg-slate-900 border border-slate-850 rounded-xl overflow-hidden flex flex-col justify-between"
                          >
                            <div className="p-4 flex items-start gap-3">
                              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-vault-400">
                                {file.type.startsWith('image/') ? <Image className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                              </div>
                              <div className="overflow-hidden">
                                <span className="text-xs font-bold text-slate-200 block truncate" title={file.name}>
                                  {file.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono block mt-1">
                                  {formatBytes(file.size)}
                                </span>
                              </div>
                            </div>

                            <button
                              id={`btn-dl-portal-${file.id}`}
                              onClick={() => triggerDownloadFile(file)}
                              className="w-full bg-slate-950 hover:bg-slate-850 text-slate-300 py-2.5 text-[10px] font-bold border-t border-slate-850 hover:border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-vault-400" />
                              <span>Decrypt & Download</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* T4: SECURE NOTES VIEW */}
                  {exploreTab === 'notes' && (
                    <div id="explorer-notes-list" className="max-w-2xl mx-auto space-y-4">
                      {activeSnapshot.notes.length === 0 ? (
                        <div className="py-16 text-center text-slate-500 text-xs">
                          No notes archived in this snapshot.
                        </div>
                      ) : session.vaultPin && !isWebNotesUnlocked ? (
                        /* Notes unlock wall on web portal */
                        <div id="web-vault-notes-unlock" className="py-12 text-center bg-slate-900 border border-slate-850 p-6 rounded-2xl max-w-sm mx-auto space-y-4">
                          <div className="mx-auto w-12 h-12 rounded-full bg-red-950/80 border border-red-500/30 flex items-center justify-center text-red-400">
                            <Lock className="w-5 h-5" />
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-200">Decrypt Notes Payload</h4>
                            <p className="text-[10px] text-slate-400 leading-normal">
                              These secure notes are cryptographically shielded by your on-device master PIN.
                            </p>
                          </div>

                          <form id="form-web-notes-unlock" onSubmit={handleUnlockNotes} className="flex flex-col gap-2.5 items-center">
                            <input
                              id="input-web-pin"
                              type="password"
                              maxLength={4}
                              placeholder="4-digit PIN"
                              value={pinInput}
                              onChange={(e) => setPinInput(e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-center text-sm font-mono tracking-widest text-white w-28 focus:outline-none focus:border-red-500"
                            />
                            {pinError && <span className="text-[10px] text-red-400">{pinError}</span>}
                            
                            <button
                              id="btn-web-pin-submit"
                              type="submit"
                              className="text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold px-4 py-1.5 rounded-md border border-slate-700 cursor-pointer"
                            >
                              Decrypt Payload
                            </button>
                          </form>
                        </div>
                      ) : (
                        /* Unlocked list */
                        activeSnapshot.notes.map((note) => (
                          <div
                            key={note.id}
                            id={`portal-note-${note.id}`}
                            className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2.5 relative"
                          >
                            <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                              <Shield className="w-4 h-4 text-rose-400 shrink-0" />
                              {note.title}
                            </span>
                            
                            <p className="text-xs text-slate-300 font-sans whitespace-pre-line leading-relaxed pl-4 border-l border-slate-800">
                              {note.content}
                            </p>
                            
                            <span className="block text-[8px] text-slate-500 font-mono pl-4">
                              Sealed in backup: {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div id="portal-explorer-unloaded" className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <Cloud className="w-12 h-12 text-slate-800 mb-2" />
                <span className="text-xs font-bold">Waiting for First Device Backup Sync...</span>
                <p className="text-[10px] text-slate-500 max-w-sm mt-1">
                  Once you trigger a backup on the simulated phone, the encrypted data snapshots will instantly sync and appear in this web console directory.
                </p>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
