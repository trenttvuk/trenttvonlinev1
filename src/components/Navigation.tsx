import React, { useState } from "react";
import { 
  Tv, 
  Calendar, 
  PlaySquare, 
  Info, 
  Settings, 
  Radio, 
  Compass, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  Users,
  ArrowUpRight,
  User as UserIcon 
} from "lucide-react";
import { User } from "firebase/auth";

interface NavigationProps {
  activeTab: "home" | "live" | "schedule" | "youtube" | "about" | "cms";
  setActiveTab: (tab: "home" | "live" | "schedule" | "youtube" | "about" | "cms") => void;
  isStreamingLive: boolean;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navigation({ 
  activeTab, 
  setActiveTab, 
  isStreamingLive,
  user,
  onLogin,
  onLogout
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Block */}
          <div 
            onClick={() => setActiveTab("home")} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center">
              <img 
                src="https://res.cloudinary.com/trenttvuk/image/upload/v1782070919/LOGO_no_background_pj4m3e.png" 
                alt="Trent TV Logo" 
                referrerPolicy="no-referrer"
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              />
              {isStreamingLive && (
                <span className="absolute -top-1 -right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
                activeTab === "home"
                  ? "bg-[#01225A] text-white shadow-sm"
                  : "text-slate-605 hover:text-[#01225A] hover:bg-[#0D449F]/5"
              }`}
            >
              <Compass className="w-4 h-4" />
              Home
            </button>

            <button
              onClick={() => setActiveTab("live")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
                activeTab === "live"
                  ? "bg-[#01225A] text-white shadow-sm"
                  : "text-slate-605 hover:text-[#01225A] hover:bg-[#0D449F]/5"
              }`}
            >
              <div className="relative">
                <Radio className="w-4 h-4" />
                {isStreamingLive && (
                  <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
                )}
              </div>
              Watch Live
            </button>

            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
                activeTab === "schedule"
                  ? "bg-[#01225A] text-white shadow-sm"
                  : "text-slate-605 hover:text-[#01225A] hover:bg-[#0D449F]/5"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </button>

            <button
              onClick={() => setActiveTab("youtube")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
                activeTab === "youtube"
                  ? "bg-[#01225A] text-white shadow-sm"
                  : "text-slate-605 hover:text-[#01225A] hover:bg-[#0D449F]/5"
              }`}
            >
              <PlaySquare className="w-4 h-4" />
              On Demand
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
                activeTab === "about"
                  ? "bg-[#01225A] text-white shadow-sm"
                  : "text-slate-605 hover:text-[#01225A] hover:bg-[#0D449F]/5"
              }`}
            >
              <Info className="w-4 h-4" />
              About Us
            </button>

            <div className="w-px h-5 bg-slate-200 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5" title={`Logged in as ${user.displayName || user.email}`}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User Avatar" className="w-4.5 h-4.5 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="text-[12px] font-bold max-w-[85px] truncate text-[#01225A]">
                    {user.displayName?.split(" ")[0] || "Staff"}
                  </span>
                  <button 
                    onClick={onLogout}
                    className="p-0.5 hover:text-red-650 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => setActiveTab("cms")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold border cursor-pointer transition-colors ${
                    activeTab === "cms"
                      ? "bg-[#01225A] text-white border-[#01225A]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Dashboard
                </button>
              </div>
            ) : (
              <a
                href="https://join.trenttv.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-extrabold bg-[#01225A] text-white hover:bg-[#0D449F] cursor-pointer transition-colors shadow-sm"
              >
                <Users className="w-4 h-4 text-[#4283ED]" />
                Join Our Crew
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </a>
            )}
          </nav>

          {/* Mobile hamburger icon */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -mr-2 text-slate-650 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 py-4 px-6 animate-fade-in">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === "home" ? "bg-slate-50 text-slate-900" : "text-slate-600"
              }`}
            >
              <Compass className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={() => { setActiveTab("live"); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === "live" ? "bg-slate-50 text-slate-900" : "text-slate-600"
              }`}
            >
              <Radio className="w-4 h-4" />
              Watch Live
            </button>
            <button
              onClick={() => { setActiveTab("schedule"); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === "schedule" ? "bg-slate-50 text-slate-900" : "text-slate-600"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
            <button
              onClick={() => { setActiveTab("youtube"); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === "youtube" ? "bg-slate-50 text-slate-900" : "text-slate-600"
              }`}
            >
              <PlaySquare className="w-4 h-4" />
              On Demand
            </button>
            <button
              onClick={() => { setActiveTab("about"); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === "about" ? "bg-slate-50 text-slate-900" : "text-slate-600"
              }`}
            >
              <Info className="w-4 h-4" />
              About Us
            </button>

            <div className="h-px bg-slate-100 my-2"></div>

            {user ? (
              <div className="space-y-2 pt-2 text-left">
                <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-slate-50 text-slate-750">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-[#01225A]" />
                    <span className="text-sm font-bold text-[#01225A]">{user.displayName || "Staff Member"}</span>
                  </div>
                  <button onClick={onLogout} className="text-red-650 hover:text-red-800 text-xs font-bold cursor-pointer">Sign Out</button>
                </div>
                <button
                  onClick={() => { setActiveTab("cms"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold border cursor-pointer ${
                    activeTab === "cms" ? "bg-[#01225A] text-white border-[#01225A]" : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Dashboard (CMS)
                </button>
              </div>
            ) : (
              <a
                href="https://join.trenttv.uk"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-black bg-[#01225A] text-white hover:bg-[#0D449F] shadow-xs cursor-pointer transition-colors"
              >
                <Users className="w-4 h-4 text-[#4283ED]" />
                Join Our Crew
                <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
              </a>
            )}
          </nav>
        </div>
      )}
      
      {/* High-end understated streamer prompt */}
      {isStreamingLive && activeTab !== "live" && (
        <div className="bg-slate-950 text-slate-200 text-[12.5px] py-2 px-6 text-center select-none font-normal flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
          <span>We are broadcasting live.</span>
          <button 
            onClick={() => setActiveTab("live")} 
            className="underline font-medium text-white hover:text-slate-200 cursor-pointer ml-1"
          >
            Watch Broadcast Now
          </button>
        </div>
      )}
    </header>
  );
}
