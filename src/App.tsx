import React, { useState, useEffect } from 'react';
import { 
  Cloud, Database, Shield, LayoutGrid, Smartphone, Monitor, Info,
  Sparkles, RefreshCw, Layers, CheckCircle2, Server, HelpCircle
} from 'lucide-react';
import AndroidFrame from './components/AndroidFrame';
import BackupHub from './components/BackupHub';
import CloudPortal from './components/CloudPortal';
import { DeviceState, BackupSnapshot, UserSession } from './types';
import { INITIAL_CONTACTS, INITIAL_MESSAGES, INITIAL_FILES, INITIAL_NOTES } from './initialData';

// Storage Keys
const LOCAL_STORAGE_KEY_DEVICE = 'phone_vault_device_state';
const LOCAL_STORAGE_KEY_BACKUPS = 'phone_vault_backups_list';
const LOCAL_STORAGE_KEY_SESSION = 'phone_vault_user_session';

export default function App() {
  // 1. Core State Handlers (Loaded from LocalStorage with clean fallbacks)
  const [deviceState, setDeviceState] = useState<DeviceState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DEVICE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      contacts: INITIAL_CONTACTS,
      messages: INITIAL_MESSAGES,
      files: INITIAL_FILES,
      notes: INITIAL_NOTES
    };
  });

  const [backups, setBackups] = useState<BackupSnapshot[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BACKUPS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Seed one historical backup snapshot to give the app immediate testability
    const totalSize = 245000 + 128 * 3 + 256 * 2 + 1024;
    return [
      {
        id: 'snap-archived-991',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        deviceName: 'Android Simulator Core',
        contacts: INITIAL_CONTACTS.slice(0, 3),
        messages: INITIAL_MESSAGES.slice(0, 2),
        files: [INITIAL_FILES[0]],
        notes: [INITIAL_NOTES[1]],
        totalSize: totalSize,
        version: 'v1.0.0'
      }
    ];
  });

  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SESSION);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      phoneNumber: '',
      isAuthenticated: false,
      isLocked: false,
      vaultPin: undefined
    };
  });

  // Active View Tab on mobile/tablet views
  // 'both' on desktop; 'device' or 'portal' on small screens
  const [activePane, setActivePane] = useState<'device' | 'portal'>('device');

  // 2. Persist state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_DEVICE, JSON.stringify(deviceState));
  }, [deviceState]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_BACKUPS, JSON.stringify(backups));
  }, [backups]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SESSION, JSON.stringify(session));
  }, [session]);

  return (
    <div id="application-container" className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans relative antialiased selection:bg-vault-800 selection:text-vault-200">
      
      {/* Absolute Decorative Glow Accents */}
      <div id="glow-1" className="absolute top-[-10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-vault-900/10 blur-[120px] pointer-events-none"></div>
      <div id="glow-2" className="absolute bottom-[-10%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-emerald-950/10 blur-[120px] pointer-events-none"></div>

      {/* Main Top Header Navigation */}
      <header id="main-header" className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div id="header-wrapper" className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div id="brand-box" className="flex items-center gap-3">
            <div id="brand-indicator" className="w-10 h-10 rounded-xl bg-vault-600 flex items-center justify-center shadow-lg shadow-vault-950/30 border border-vault-400">
              <Shield id="icon-header-shield" className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 id="brand-name-heading" className="text-base font-display font-bold tracking-tight text-white">Phone Vault Backup</h1>
                <span id="header-status-dot" className="inline-flex items-center gap-1 text-[9px] bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-900/50 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  SANDBOX SECURE
                </span>
              </div>
              <span id="brand-description-lbl" className="text-[11px] text-slate-400">Secure end-to-end phone backup and restoration environment</span>
            </div>
          </div>

          {/* Quick Informational / Action Controls */}
          <div id="header-actions" className="flex items-center gap-3">
            
            {/* Quick stats summarizing overall environment status */}
            <div id="system-stats-card" className="hidden lg:flex items-center gap-4 bg-slate-900/40 border border-slate-850 px-4 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-vault-400" />
                Vault Clusters: <strong className="text-white font-mono">{backups.length}</strong>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Local Contacts: <strong className="text-white font-mono">{deviceState.contacts.length}</strong>
              </span>
            </div>

            <button
              id="btn-reset-demo"
              onClick={() => {
                const conf = window.confirm("Reset all local storage? This will revert the sandbox device to the original seed data.");
                if (conf) {
                  localStorage.removeItem(LOCAL_STORAGE_KEY_DEVICE);
                  localStorage.removeItem(LOCAL_STORAGE_KEY_BACKUPS);
                  localStorage.removeItem(LOCAL_STORAGE_KEY_SESSION);
                  window.location.reload();
                }
              }}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset Sandbox"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Sandbox</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Panel Content Box */}
      <main id="main-content-area" className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Responsive Control Tab Toggler (Visible only on tablets/mobile viewports) */}
        <div id="responsive-view-switcher" className="md:hidden flex bg-slate-950 border border-slate-900 p-1 rounded-xl">
          <button
            id="btn-switch-device"
            onClick={() => setActivePane('device')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activePane === 'device' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Simulated Device</span>
          </button>
          <button
            id="btn-switch-portal"
            onClick={() => setActivePane('portal')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activePane === 'portal' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Cloud Console</span>
          </button>
        </div>

        {/* Dual Pane Layout wrapper */}
        <div id="dual-pane-layout" className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* L1: SIMULATED PHONE EMULATOR PANEL (4 cols on desktop) */}
          <div 
            id="pane-device"
            className={`md:col-span-5 lg:col-span-4 flex flex-col justify-center items-center ${
              activePane === 'device' ? 'block' : 'hidden md:flex'
            }`}
          >
            <div id="device-sticky-wrapper" className="w-full sticky top-24">
              <div id="sandbox-device-header" className="text-center mb-4 hidden md:block">
                <span id="sandbox-lbl" className="text-[10px] uppercase font-bold tracking-widest text-vault-400">Interaction Node A</span>
                <h3 id="sandbox-title" className="text-xs font-semibold text-slate-400 mt-1">Simulated Android Device</h3>
              </div>
              
              <AndroidFrame 
                onHomeClick={() => {
                  if (session.isAuthenticated) {
                    // Force return to phone home dashboard screen
                    const el = document.getElementById('category-item-contacts');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <BackupHub 
                  deviceState={deviceState}
                  setDeviceState={setDeviceState}
                  backups={backups}
                  setBackups={setBackups}
                  session={session}
                  setSession={setSession}
                />
              </AndroidFrame>
            </div>
          </div>

          {/* L2: DESKTOP CLOUD WEB PORTAL PANEL (7 cols on desktop) */}
          <div 
            id="pane-portal"
            className={`md:col-span-7 lg:col-span-8 flex flex-col ${
              activePane === 'portal' ? 'block' : 'hidden md:flex'
            }`}
          >
            <div id="portal-sticky-wrapper" className="flex-1 flex flex-col h-full">
              <div id="sandbox-portal-header" className="text-center md:text-left mb-4 hidden md:block">
                <span id="portal-node-lbl" className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Interaction Node B</span>
                <h3 id="portal-node-title" className="text-xs font-semibold text-slate-400 mt-1">Secure Cloud Administration Console</h3>
              </div>

              <CloudPortal 
                backups={backups}
                session={session}
                setSession={setSession}
              />
            </div>
          </div>

        </div>

        {/* Sandbox Walkthrough and Concept Overview Instructions Section */}
        <section id="demo-guide-section" className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 mt-4">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-vault-950 border border-vault-800 rounded-lg text-vault-400 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-200">How to evaluate this sandbox application:</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  This prototype models a complete full-stack backup-and-restore life cycle for an Android app. Interact with the two synchronized terminals below to trace the data flow:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850 space-y-1.5">
                  <span className="font-bold text-slate-200 block">1. Populate Local Device</span>
                  <p className="text-slate-400 text-[11px] leading-normal">
                    Authenticate the Simulated Phone (OTP: <strong>123456</strong>) and explore the database lists. Add new contacts, send SMS, write notes, or upload real files.
                  </p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850 space-y-1.5">
                  <span className="font-bold text-slate-200 block">2. Sealing & Synchronization</span>
                  <p className="text-slate-400 text-[11px] leading-normal">
                    Toggle your backup categories and click <strong>Backup Selected Data</strong>. Watch the terminal log trace the encryption protocol and instantly generate a secure cloud cluster snapshot.
                  </p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850 space-y-1.5">
                  <span className="font-bold text-slate-200 block">3. Recovering Data</span>
                  <p className="text-slate-400 text-[11px] leading-normal">
                    Click <strong>Wipe Local Device</strong> on the dashboard to clear all local data. Then, go to <strong>Restore from Vault</strong>, choose your backup, and watch your contacts and files return instantly!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Global Application Footer */}
      <footer id="main-footer" className="border-t border-slate-950 bg-slate-950/80 p-5 text-center text-slate-600 text-xs mt-auto shrink-0 font-mono tracking-tight">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px]">
          <span>Phone Vault Backup Sandbox Utility Engine v1.0.0</span>
          <span>Zero-Knowledge AES-GCM Encrypted Blocks</span>
        </div>
      </footer>

    </div>
  );
}
