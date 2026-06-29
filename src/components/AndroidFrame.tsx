import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, ArrowLeft } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onHomeClick?: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export default function AndroidFrame({
  children,
  onHomeClick,
  onBackClick,
  showBackButton = false,
}: AndroidFrameProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="android-device-outer" className="relative mx-auto w-full max-w-[380px] h-[780px] bg-slate-900 rounded-[50px] p-3.5 shadow-2xl border-4 border-slate-800 flex flex-col select-none ring-1 ring-white/10">
      {/* Speaker and Camera Notch */}
      <div id="notch-container" className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-between px-6">
        <div id="camera-lens" className="w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-900 flex-shrink-0"></div>
        <div id="speaker-grill" className="w-16 h-1 bg-slate-800 rounded-full flex-shrink-0"></div>
        <div id="sensor" className="w-1.5 h-1.5 rounded-full bg-slate-800 flex-shrink-0"></div>
      </div>

      {/* Internal Screen Area */}
      <div id="android-screen-inner" className="relative flex-1 bg-slate-950 rounded-[38px] overflow-hidden flex flex-col border border-slate-900/40 shadow-inner">
        {/* Status Bar */}
        <div id="status-bar" className="h-10 bg-slate-950/80 backdrop-blur-sm px-6 flex items-center justify-between text-[11px] font-mono tracking-tight text-slate-300 z-40 select-none border-b border-slate-900/10">
          <span id="status-time" className="font-semibold">{time}</span>
          <div id="status-icons" className="flex items-center gap-1.5">
            <Signal id="icon-signal" className="w-3.5 h-3.5" />
            <Wifi id="icon-wifi" className="w-3.5 h-3.5" />
            <div id="battery-status-container" className="flex items-center gap-0.5">
              <span id="battery-percent" className="text-[10px]">98%</span>
              <Battery id="icon-battery" className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Mobile App Navigation Bar (simulated inside screen) */}
        {showBackButton && (
          <div id="sim-app-header" className="h-12 bg-slate-900 border-b border-slate-800/60 px-4 flex items-center gap-3 z-30 shrink-0">
            <button
              id="btn-nav-back"
              onClick={onBackClick}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-300 active:scale-95 transition-all cursor-pointer"
              title="Go back"
            >
              <ArrowLeft id="icon-arrow-left" className="w-5 h-5" />
            </button>
            <span id="sim-header-title" className="text-sm font-semibold tracking-wide text-slate-200">Phone Vault</span>
          </div>
        )}

        {/* Interactive Content View */}
        <div id="android-screen-content" className="android-screen flex-1 overflow-y-auto bg-slate-950 relative flex flex-col">
          {children}
        </div>

        {/* Bottom Simulated Gesture Bar or Navigation buttons */}
        <div id="android-gesture-bar-container" className="h-6 bg-slate-950 flex items-center justify-center shrink-0">
          <button
            id="btn-android-gesture"
            onClick={onHomeClick}
            className="w-24 h-1 bg-slate-700 hover:bg-slate-500 transition-colors rounded-full cursor-pointer"
            title="Home Gesture"
          ></button>
        </div>
      </div>

      {/* Physical button simulations on the side */}
      <div id="physical-power" className="absolute right-[-6px] top-32 w-[6px] h-12 bg-slate-800 rounded-l-md border-r-2 border-slate-950"></div>
      <div id="physical-vol-up" className="absolute left-[-6px] top-28 w-[6px] h-10 bg-slate-800 rounded-r-md border-l-2 border-slate-950"></div>
      <div id="physical-vol-down" className="absolute left-[-6px] top-40 w-[6px] h-10 bg-slate-800 rounded-r-md border-l-2 border-slate-950"></div>
    </div>
  );
}
