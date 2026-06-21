/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { LiveStreamConfig, ScheduleItem, VideoItem, AboutUsData } from "./types";
import { 
  DEFAULT_LIVE_STREAM, 
  DEFAULT_SCHEDULE_ITEMS, 
  DEFAULT_YOUTUBE_VIDEOS, 
  DEFAULT_ABOUT_DATA 
} from "./data/defaultData";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import WatchLive from "./components/WatchLive";
import Schedule from "./components/Schedule";
import YoutubeCatalog from "./components/YoutubeCatalog";
import AboutUs from "./components/AboutUs";
import Dashboard from "./components/Dashboard";
import { Tv, Radio, HelpCircle, Heart, Star, Award, ExternalLink } from "lucide-react";

// --- FIREBASE IMPORTS ---
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { onSnapshot, doc, collection, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "./firebase";
import { seedFirestoreDatabase, autoSeedIfEmpty } from "./utils/firebaseSeeder";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  // Map route path to active tab for components
  const currentPath = location.pathname;
  let activeTab: "home" | "live" | "schedule" | "youtube" | "about" | "cms" = "home";
  if (currentPath === "/live") activeTab = "live";
  else if (currentPath === "/schedule") activeTab = "schedule";
  else if (currentPath === "/watch") activeTab = "youtube";
  else if (currentPath === "/about") activeTab = "about";
  else if (currentPath === "/cms") activeTab = "cms";

  const handleSetActiveTab = (tab: string) => {
    if (tab === "home") navigate("/");
    else if (tab === "youtube") navigate("/watch");
    else navigate(`/${tab}`);
  };

  // 1. Memory and local cache fallbacks
  const [streamConfig, setStreamConfig] = useState<LiveStreamConfig>(() => {
    const saved = localStorage.getItem("trenttv_live_config");
    return saved ? JSON.parse(saved) : DEFAULT_LIVE_STREAM;
  });

  const [scheduleSetting, setScheduleSetting] = useState<{ useExternalApi: boolean }>(() => {
    const saved = localStorage.getItem("trenttv_schedule_setting");
    return saved ? JSON.parse(saved) : { useExternalApi: false };
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem("trenttv_schedule");
    return saved ? JSON.parse(saved) : DEFAULT_SCHEDULE_ITEMS;
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem("trenttv_videos");
    return saved ? JSON.parse(saved) : DEFAULT_YOUTUBE_VIDEOS;
  });

  const [aboutData, setAboutData] = useState<AboutUsData>(() => {
    const saved = localStorage.getItem("trenttv_about");
    return saved ? JSON.parse(saved) : DEFAULT_ABOUT_DATA;
  });

  // 2. Track Firebase Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Automatically check and fill Firestore if database is fresh
        autoSeedIfEmpty();
      }
    });
    return unsub;
  }, []);

  // 3. Real-Time Sync with Firestore database doc & collection listeners
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "liveStream"), (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.data() as LiveStreamConfig;
        setStreamConfig(val);
        localStorage.setItem("trenttv_live_config", JSON.stringify(val));
      }
    }, (error) => {
      console.warn("Permission restricted or offline reading config/liveStream:", error);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "scheduleSetting"), (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.data() as { useExternalApi: boolean };
        setScheduleSetting(val);
        localStorage.setItem("trenttv_schedule_setting", JSON.stringify(val));
      }
    }, (error) => {
      console.warn("Permission restricted or offline reading config/scheduleSetting:", error);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "aboutUs"), (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.data() as AboutUsData;
        setAboutData(val);
        localStorage.setItem("trenttv_about", JSON.stringify(val));
      }
    }, (error) => {
      console.warn("Permission restricted or offline reading config/aboutUs:", error);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "schedule"), (snapshot) => {
      const list: ScheduleItem[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as ScheduleItem);
      });
      if (list.length > 0) {
        setSchedule(list);
        localStorage.setItem("trenttv_schedule", JSON.stringify(list));
      }
    }, (error) => {
      console.warn("Permission restricted or offline reading schedule:", error);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "videos"), (snapshot) => {
      const list: VideoItem[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as VideoItem);
      });
      if (list.length > 0) {
        setVideos(list);
        localStorage.setItem("trenttv_videos", JSON.stringify(list));
      }
    }, (error) => {
      console.warn("Permission restricted or offline reading videos:", error);
    });
    return unsub;
  }, []);

  // PII Isolation: Deprecated - roster applications removed

  // Auth logins implementation
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Staff authorization failed:", err);
      alert("Sign-In failed! Please double check popup blocking preferences.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Staff logout failed:", err);
    }
  };

  // Factory reset back to original NTU media values handler
  const handleResetPresets = async () => {
    if (confirm("Restore all settings, streams, program schedules, and video catalogs back to original Nottingham Trent University defaults in Firestore?")) {
      if (user) {
        try {
          await seedFirestoreDatabase();
          alert("Demographic settings reset to authentic Trent TV defaults in Firestore!");
        } catch (err) {
          alert("Reset failed. Verify that you are signed in and connected.");
        }
      } else {
        setStreamConfig(DEFAULT_LIVE_STREAM);
        setSchedule(DEFAULT_SCHEDULE_ITEMS);
        setVideos(DEFAULT_YOUTUBE_VIDEOS);
        setAboutData(DEFAULT_ABOUT_DATA);
        localStorage.clear();
        alert("Demographic settings reset to authentic Trent TV defaults locally!");
      }
    }
  };

  // Determine current day of week to filter automatically
  const [currentDay, setCurrentDay] = useState("Monday");
  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayIndex = new Date().getDay();
    const dayName = days[todayIndex];
    // If it's weekend, default schedule selection list day to Monday for robust display
    if (dayName === "Sunday" || dayName === "Saturday") {
      setCurrentDay("Monday");
    } else {
      setCurrentDay(dayName);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-slate-900 font-sans antialiased">
      
      {/* 3. STICKY DYNAMIC NAVIGATION BOARD */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={handleSetActiveTab} 
        isStreamingLive={streamConfig.isEnabled}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* 4. MAIN CONTENT VIEWPORT */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <Home 
              streamConfig={streamConfig}
              schedule={schedule}
              videos={videos}
              setActiveTab={handleSetActiveTab}
              currentDay={currentDay}
            />
          } />
          
          <Route path="/live" element={
            <WatchLive 
              config={streamConfig} 
              schedule={schedule}
              currentDay={currentDay}
            />
          } />
          
          <Route path="/schedule" element={
            <Schedule 
              localSchedule={schedule} 
              currentDay={currentDay}
              useExternalApi={scheduleSetting.useExternalApi}
            />
          } />
          
          <Route path="/watch" element={
            <YoutubeCatalog 
              videos={videos}
            />
          } />
          
          <Route path="/about" element={
            <AboutUs 
              data={aboutData} 
            />
          } />
          
          <Route path="/cms" element={
            <Dashboard
              streamConfig={streamConfig}
              setStreamConfig={setStreamConfig}
              scheduleSetting={scheduleSetting}
              setScheduleSetting={setScheduleSetting}
              schedule={schedule}
              setSchedule={setSchedule}
              videos={videos}
              setVideos={setVideos}
              onResetPresets={handleResetPresets}
              user={user}
              onLogin={handleLogin}
            />
          } />
        </Routes>
      </main>

      {/* 5. BRANDED FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 text-xs text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Branding Column */}
            <div className="space-y-4 md:col-span-2">
              <div className="inline-block bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:opacity-95 transition-opacity" onClick={() => handleSetActiveTab("home")}>
                <img 
                  src="https://res.cloudinary.com/trenttvuk/image/upload/v1782070919/LOGO_no_background_pj4m3e.png" 
                  alt="Trent TV Logo" 
                  referrerPolicy="no-referrer"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="text-slate-400 leading-relaxed max-w-sm text-[13px]">
                Trent TV is Nottingham Trent University's award-winning student TV station, operating in partnership with Nottingham Trent Students' Union. Managed and curated by students, for students.
              </p>
              <div className="text-[11px] text-slate-500">
                NTSU Media Hub, Nottingham Trent Students' Union, Shakespeare Street, Nottingham, NG1 4GH
              </div>
            </div>

            {/* Navigation links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-200 text-sm">Navigation</h4>
              <ul className="space-y-2 text-[13px]">
                <li><button onClick={() => handleSetActiveTab("home")} className="hover:text-white transition-colors cursor-pointer text-left">Home</button></li>
                <li><button onClick={() => handleSetActiveTab("live")} className="hover:text-white transition-colors cursor-pointer text-left">Watch Live</button></li>
                <li><button onClick={() => handleSetActiveTab("schedule")} className="hover:text-white transition-colors cursor-pointer text-left">Broadcast Schedule</button></li>
                <li><button onClick={() => handleSetActiveTab("youtube")} className="hover:text-white transition-colors cursor-pointer text-left">Watch On Demand</button></li>
                <li><button onClick={() => handleSetActiveTab("about")} className="hover:text-white transition-colors cursor-pointer text-left">Join Our Team</button></li>
                <li><button onClick={() => handleSetActiveTab("cms")} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer text-left">Admin Dashboard &rarr;</button></li>
              </ul>
            </div>

            {/* Associations & Logos */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-200 text-sm">Affiliated With</h4>
              <div className="flex flex-wrap gap-4 items-center pt-1">
                <a href="https://nasta.tv" target="_blank" rel="noopener noreferrer" className="hover:opacity-85 transition-opacity block" title="National Student Television Association">
                  <img 
                    src="https://res.cloudinary.com/trenttvuk/image/upload/v1782080126/NaSTA_Logo_White_sxfa3a.png" 
                    alt="NaSTA Logo" 
                    referrerPolicy="no-referrer"
                    className="h-9 w-auto object-contain opacity-90"
                  />
                </a>
                <a href="https://www.trentstudents.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-85 transition-opacity block" title="Nottingham Trent Students' Union">
                  <img 
                    src="https://res.cloudinary.com/trenttvuk/image/upload/v1782080126/NTSU_Logo_White_bknjyq.png" 
                    alt="NTSU Logo" 
                    referrerPolicy="no-referrer"
                    className="h-9 w-auto object-contain opacity-90"
                  />
                </a>
              </div>
            </div>

          </div>

          <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
            <span>&copy; {new Date().getFullYear()} Trent TV. Built with pride by NTU students.</span>
            <span>Trent TV is a society affiliated with Nottingham Trent Students' Union (NTSU).</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
