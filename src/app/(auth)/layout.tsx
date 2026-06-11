import { Radio, Volume2, Sparkles, Shield, Users } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans selection:bg-indigo-500/10 selection:text-indigo-600 text-slate-900 overflow-hidden">
      {/* Left Panel: App Showcase (Desktop only) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 bg-slate-50 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-200/80 select-none">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a03_1px,transparent_1px),linear-gradient(to_bottom,#0f172a03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Top: Branding */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-650 rounded-xl shadow-lg shadow-indigo-600/10">
            <Radio className="w-6 h-6 text-white animate-pulse" />
          </div>
          <span className="text-2xl font-black tracking-wider text-slate-900">
            WaveTalk
          </span>
        </div>

        {/* Center: Interactive UI Mockup */}
        <div className="relative z-10 flex flex-col items-center justify-center my-8">
          <div className="absolute -inset-4 bg-indigo-500/5 blur-3xl rounded-full opacity-60 -z-10" />
          
          {/* Mock Client Window */}
          <div className="w-full max-w-[420px] bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] backdrop-blur-md">
            {/* Window controls */}
            <div className="h-7 bg-slate-50 border-b border-slate-200/30 flex items-center px-4 space-x-1.5 justify-between">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="text-[10px] font-semibold text-slate-400 tracking-wide font-mono">wavetalk-desktop</div>
              <div className="w-10" />
            </div>
            
            <div className="flex h-[280px]">
              {/* Servers list */}
              <div className="w-14 bg-slate-50 flex flex-col items-center py-3 space-y-2.5 border-r border-slate-200/50">
                <div className="relative group">
                  <div className="absolute -left-1 top-2.5 w-1 h-5 bg-indigo-600 rounded-r-md" />
                  <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/10 transition-all cursor-default">
                    <Radio className="w-4.5 h-4.5 text-white" />
                  </div>
                </div>
                <div className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 hover:rounded-xl hover:bg-slate-50 transition-all cursor-default shadow-sm">
                  WT
                </div>
                <div className="w-9 h-9 bg-pink-100 rounded-full flex items-center justify-center text-[10px] font-bold text-pink-700 hover:rounded-xl transition-all cursor-default border border-pink-200/30">
                  DEV
                </div>
                <div className="w-6 h-[1px] bg-slate-200 rounded" />
                <div className="w-9 h-9 border border-dashed border-slate-300 rounded-full flex items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all text-xs cursor-default">
                  +
                </div>
              </div>

              {/* Channels list */}
              <div className="w-36 bg-slate-50/50 flex flex-col p-2.5 space-y-3.5 border-r border-slate-200/40">
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 tracking-wider">
                  <span>TEXT CHANNELS</span>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center px-2 py-1 bg-slate-200/60 rounded text-[11px] text-slate-800 font-semibold cursor-default">
                    <span className="text-slate-400 mr-1 text-xs">#</span> general
                  </div>
                  <div className="flex items-center px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 rounded cursor-default">
                    <span className="text-slate-400 mr-1 text-xs">#</span> announcements
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 tracking-wider">
                  <span>VOICE CHANNELS</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center px-2 py-0.5 text-[11px] text-indigo-600 font-semibold bg-indigo-50 rounded cursor-default">
                    <Volume2 className="w-3.5 h-3.5 mr-1 shrink-0" />
                    <span>Gaming Lounge</span>
                  </div>
                  <div className="pl-4 space-y-1.5">
                    {/* Active Speaker */}
                    <div className="flex items-center space-x-1.5">
                      <div className="relative">
                        <div className="w-4.5 h-4.5 rounded-full bg-slate-200 border border-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.2)] flex items-center justify-center overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-indigo-500" />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-700 font-medium truncate max-w-[70px]">Alex</span>
                      {/* Live soundwave */}
                      <div className="flex items-end space-x-[1.5px] h-2.5 ml-auto pr-0.5">
                        <span className="w-[1.5px] bg-emerald-500 rounded-full animate-wave-bar origin-bottom h-1"></span>
                        <span className="w-[1.5px] bg-emerald-500 rounded-full animate-wave-bar animation-delay-300 origin-bottom h-2"></span>
                        <span className="w-[1.5px] bg-emerald-500 rounded-full animate-wave-bar animation-delay-150 origin-bottom h-1.5"></span>
                      </div>
                    </div>
                    {/* Normal participant */}
                    <div className="flex items-center space-x-1.5">
                      <div className="w-4.5 h-4.5 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-tr from-pink-500 to-orange-400" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal truncate max-w-[70px]">Sarah</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat View */}
              <div className="flex-1 bg-white/40 flex flex-col p-3.5 justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-[9px] font-bold text-indigo-700">
                      AL
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1">
                        <span className="text-[9px] font-bold text-slate-800">Alex</span>
                        <span className="text-[7px] text-slate-400">12:34 PM</span>
                      </div>
                      <p className="text-[9px] text-slate-600 bg-slate-100/60 px-2 py-1 rounded-md border border-slate-200/30">
                        Who&apos;s down for a call? 🔊
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center shrink-0 text-[9px] font-bold text-pink-700">
                      SR
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1">
                        <span className="text-[9px] font-bold text-slate-800">Sarah</span>
                        <span className="text-[7px] text-slate-400">12:35 PM</span>
                      </div>
                      <p className="text-[9px] text-slate-600 bg-slate-100/60 px-2 py-1 rounded-md border border-slate-200/30">
                        Let&apos;s jump in! Audio sounds pristine.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Mock input */}
                <div className="h-6 bg-slate-50 border border-slate-200 rounded flex items-center px-2 text-[8px] text-slate-400 select-none">
                  Message #general
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Feature tags */}
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Introducing WaveTalk 2.0</span>
          </div>
          
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 max-w-md">
            Connect properly.
          </h2>
          
          <div className="grid grid-cols-2 gap-4 pt-2 max-w-lg">
            <div className="flex items-center space-x-2 text-slate-600">
              <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-medium">Secured Channels</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Volume2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-medium">HD 48kHz Stereo audio</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Users className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-medium">Community Servers</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-medium">Advanced Screen Share</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Container */}
      <div className="w-full lg:w-[55%] xl:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-white relative border-l border-slate-100">
        {/* Background blobs for right panel */}
        <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[10%] w-72 h-72 bg-purple-500/5 rounded-full filter blur-[80px] pointer-events-none" />

        {/* Mobile Logo & Header (Visible only on mobile/tablet) */}
        <div className="lg:hidden flex flex-col items-center mb-8 space-y-3 relative z-10 select-none">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/10">
            <Radio className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            WaveTalk
          </h1>
        </div>

        {/* Auth form wrapper */}
        <div className="relative z-10 w-full max-w-[480px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;