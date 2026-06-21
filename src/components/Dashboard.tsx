/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { LiveStreamConfig, ScheduleItem, VideoItem } from "../types";
import { PRESET_POSTER_IMAGES } from "../data/defaultData";
import { 
  Sliders, Video, Calendar, Upload, RefreshCw, PlusCircle, Trash2, 
  Settings, CheckCircle2, UserCheck, Play, Save, ChevronRight, X, AlertCircle,
  Database, CloudDownload, LogIn
} from "lucide-react";

// --- FIREBASE IMPORTS ---
import { User } from "firebase/auth";
import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";

interface DashboardProps {
  streamConfig: LiveStreamConfig;
  setStreamConfig: React.Dispatch<React.SetStateAction<LiveStreamConfig>>;
  scheduleSetting?: { useExternalApi: boolean };
  setScheduleSetting?: React.Dispatch<React.SetStateAction<{ useExternalApi: boolean }>>;
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  videos: VideoItem[];
  setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
  onResetPresets: () => void;
  user: User | null;
  onLogin?: () => void;
}

export default function Dashboard({
  streamConfig,
  setStreamConfig,
  scheduleSetting,
  setScheduleSetting,
  schedule,
  setSchedule,
  videos,
  setVideos,
  onResetPresets,
  user,
  onLogin,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"live" | "schedule" | "youtube">("live");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status banners for saves
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Trigger brief alert
  const triggerSaveNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus(null);
    }, 4000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white border border-slate-205 rounded-3xl p-8 text-center shadow-xl relative overflow-hidden animate-fade-in animate-duration-200">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-5 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#0D449F]/10 border border-[#0D449F]/20 rounded-full flex items-center justify-center text-[#01225A] mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Staff Credentials Required</h1>
            <p className="text-slate-500 text-xs mt-2 max-w-sm leading-relaxed">
              The Nottingham Trent University TV station control panel requires active Media Staff clearance. Unauthenticated database updates are strictly prohibited.
            </p>
          </div>

          <div className="space-y-5 pt-2">
            <div className="text-left bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-705 uppercase tracking-wide">Security Boundaries:</h4>
              <ul className="text-xs text-slate-500 list-disc list-inside space-y-1 leading-relaxed">
                <li>Firestore read operations remain public for students.</li>
                <li>Write access limits mutations strictly inside security rules.</li>
                <li>Isolated volunteer listings protect contact PII.</li>
              </ul>
            </div>

            {onLogin && (
              <button
                onClick={onLogin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-[#01225A] text-white hover:bg-[#0D449F] cursor-pointer shadow-md transition-colors"
              >
                <LogIn className="w-4.5 h-4.5 text-[#4283ED]" />
                Authenticate Staff Account
              </button>
            )}

            <p className="text-[11px] text-slate-400 font-normal">
              Only authorized Trent TV personnel are permitted to sign in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SCHEDULE SETTING CONFIG (LOCAL vs EXTERNAL)
  const [useExternalApiSetting, setUseExternalApiSetting] = useState(scheduleSetting?.useExternalApi ?? false);

  useEffect(() => {
    if (scheduleSetting) {
      setUseExternalApiSetting(scheduleSetting.useExternalApi);
    }
  }, [scheduleSetting]);

  const handleToggleScheduleSetting = async (val: boolean) => {
    setUseExternalApiSetting(val);
    if (setScheduleSetting) {
      setScheduleSetting({ useExternalApi: val });
    }
    try {
      await setDoc(doc(db, "config", "scheduleSetting"), { useExternalApi: val });
      triggerSaveNotification(`Schedule setting synchronized: Timetable will display ${val ? "External API joint feed" : "Local Database schedule"}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, "config/scheduleSetting");
    }
  };

  // 1. LIVE CONFIG MANIPULATIONS
  const [liveUrlInput, setLiveUrlInput] = useState(streamConfig.streamUrl);
  const [liveTitleInput, setLiveTitleInput] = useState(streamConfig.title);
  const [liveDescInput, setLiveDescInput] = useState(streamConfig.description);
  const [livePosterInput, setLivePosterInput] = useState(streamConfig.posterUrl);
  const [isLiveActive, setIsLiveActive] = useState(streamConfig.isEnabled);

  const handleSaveLiveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const configData: LiveStreamConfig = {
      isEnabled: isLiveActive,
      streamUrl: liveUrlInput,
      title: liveTitleInput,
      description: liveDescInput,
      posterUrl: livePosterInput,
      viewerCount: isLiveActive ? Math.floor(Math.random() * 50) + 100 : 0
    };
    try {
      await setDoc(doc(db, "config", "liveStream"), configData);
      triggerSaveNotification("Live broadcast configuration synchronized successfully!");
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, "config/liveStream");
    }
  };

  // Poster Image Upload parser (Reads Base64 file locally so it loads in-app perfectly!)
  const handlePosterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Invalid format! Please pick an image file (.jpg, .png, .webp).");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const base64Url = event.target.result as string;
        setLivePosterInput(base64Url);
        try {
          await updateDoc(doc(db, "config", "liveStream"), { posterUrl: base64Url });
          triggerSaveNotification("Custom standby poster uploaded and saved successfully!");
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, "config/liveStream");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // 2. SCHEDULE MANAGER STATE & HANDLERS
  const [editingShow, setEditingShow] = useState<ScheduleItem | null>(null);
  const [newShowForm, setNewShowForm] = useState({
    title: "",
    host: "",
    startTime: "12:00",
    endTime: "13:00",
    day: "Monday",
    category: "entertainment" as ScheduleItem["category"],
    description: "",
    isRecurring: true,
    date: ""
  });

  const handleAddOrEditShow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShowForm.title || !newShowForm.host) {
      alert("Please specify show name and host details.");
      return;
    }

    if (!newShowForm.isRecurring && !newShowForm.date) {
      alert("Please select a specific date for one-off / stand-alone shows.");
      return;
    }

    const payload: any = {
      title: newShowForm.title,
      host: newShowForm.host,
      startTime: newShowForm.startTime,
      endTime: newShowForm.endTime,
      day: newShowForm.day,
      category: newShowForm.category,
      description: newShowForm.description,
      isRecurring: newShowForm.isRecurring,
      date: newShowForm.isRecurring ? "" : newShowForm.date
    };

    if (editingShow) {
      // Edit mode
      try {
        await setDoc(doc(db, "schedule", editingShow.id), {
          id: editingShow.id,
          ...payload
        });
        setEditingShow(null);
        triggerSaveNotification(`Modified: "${newShowForm.title}" update recorded.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `schedule/${editingShow.id}`);
      }
    } else {
      // Creation mode
      const showId = `show-${Date.now()}`;
      try {
        await setDoc(doc(db, "schedule", showId), {
          id: showId,
          ...payload
        });
        triggerSaveNotification(`Created: "${newShowForm.title}" schedule slot added.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `schedule/${showId}`);
      }
    }

    // Reset Form
    setNewShowForm({
      title: "",
      host: "",
      startTime: "12:00",
      endTime: "13:00",
      day: "Monday",
      category: "entertainment",
      description: "",
      isRecurring: true,
      date: ""
    });
  };

  const handleRemoveShow = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the broadcast grid?`)) {
      try {
        await deleteDoc(doc(db, "schedule", id));
        triggerSaveNotification(`Removed: "${name}" deleted.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `schedule/${id}`);
      }
    }
  };

  const triggerEditFill = (show: ScheduleItem) => {
    setEditingShow(show);
    setNewShowForm({
      title: show.title,
      host: show.host,
      startTime: show.startTime,
      endTime: show.endTime,
      day: show.day,
      category: show.category,
      description: show.description,
      isRecurring: show.isRecurring ?? true,
      date: show.date ?? ""
    });
  };

  // 3. YOUTUBE CMS STATE & HANDLERS
  const [editingVid, setEditingVid] = useState<VideoItem | null>(null);
  const [newVidForm, setNewVidForm] = useState({
    title: "",
    youtubeId: "",
    category: "News",
    duration: "10:00",
    description: "",
    featured: false,
  });

  const handleAddOrEditVid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVidForm.title || !newVidForm.youtubeId) {
      alert("Please provide the YouTube Video ID and Show Title.");
      return;
    }

    if (editingVid) {
      try {
        await setDoc(doc(db, "videos", editingVid.id), {
          id: editingVid.id,
          ...newVidForm
        });
        setEditingVid(null);
        triggerSaveNotification(`Updated catalog video: "${newVidForm.title}" modified.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `videos/${editingVid.id}`);
      }
    } else {
      const showId = `yt-${Date.now()}`;
      const generatedVid: VideoItem = {
        id: showId,
        ...newVidForm,
        views: Math.floor(Math.random() * 200) + 10,
        likes: Math.floor(Math.random() * 50) + 2,
        publishedDate: new Date().toISOString().split("T")[0]
      };
      try {
        await setDoc(doc(db, "videos", showId), generatedVid);
        triggerSaveNotification(`Appended video: "${newVidForm.title}" logged to On Demand.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `videos/${showId}`);
      }
    }

    // Reset Form
    setNewVidForm({
      title: "",
      youtubeId: "",
      category: "News",
      duration: "10:00",
      description: "",
      featured: false,
    });
  };

  const handleRemoveVid = async (id: string, name: string) => {
    if (confirm(`Delete "${name}" catalog video permanently?`)) {
      try {
        await deleteDoc(doc(db, "videos", id));
        triggerSaveNotification(`Purged: "${name}" deleted from library.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `videos/${id}`);
      }
    }
  };

  const triggerEditVidFill = (video: VideoItem) => {
    setEditingVid(video);
    setNewVidForm({
      title: video.title,
      youtubeId: video.youtubeId,
      category: video.category,
      duration: video.duration,
      description: video.description,
      featured: !!video.featured
    });
  };

  // 4. VOLUNTEER LIST ACTIONS - DEPRECATED: members join via NTSU directly

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Title header with status notification block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[10px] uppercase font-mono font-black text-[#0D449F] tracking-widest">
              <Settings className="w-3.5 h-3.5" />
              Nottingham Trent TV Media Center Control Panel
            </div>
            <h1 className="text-3xl font-black text-[#01225A] tracking-tight">Station CMS Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Configure live stream parameters, program listings, student catalogs, and view volunteer candidates.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetPresets}
              className="px-4.5 py-2 rounded-xl text-xs font-bold bg-[#0D449F] hover:bg-[#01225A] text-white border border-[#0D449F] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Reset state to original NTU media demo values"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Factory Reset Presets
            </button>
          </div>
        </div>

        {/* Transient save notice overlay banner */}
        {saveStatus && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-3 px-4 rounded-xl mb-6 flex items-center gap-2 animate-fade-in font-medium shadow-sm">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* CMS NAVIGATION SUBTABS BAR */}
        <div className="flex flex-wrap items-center gap-1.5 mb-8 bg-slate-100 border border-slate-200 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "live"
                ? "bg-white text-[#01225A] border border-slate-205 shadow-sm"
                : "text-slate-600 hover:text-[#01143A]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Live Stream Feed
          </button>

          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "schedule"
                ? "bg-white text-[#01225A] border border-slate-205 shadow-sm"
                : "text-slate-600 hover:text-[#01143A]"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Broadcast Grid ({schedule.length})
          </button>

          <button
            onClick={() => setActiveTab("youtube")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "youtube"
                ? "bg-white text-[#01225A] border border-slate-205 shadow-sm"
                : "text-slate-600 hover:text-[#01143A]"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Video Catalog ({videos.length})
          </button>
        </div>

        {/* ----------------- TAB SECTION A: LIVE FEED CONFIG ----------------- */}
        {activeTab === "live" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input params form */}
            <form onSubmit={handleSaveLiveConfig} className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-bold flex items-center gap-2 text-[#01225A] pb-3 border-b border-slate-100">
                Configure Live Stream Broadcast Source
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                    Live Stream Feed State
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsLiveActive(true)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isLiveActive
                          ? "bg-red-600 text-white border-red-500 shadow-sm"
                          : "bg-white hover:bg-slate-50 text-slate-400 border-slate-205"
                      }`}
                    >
                      ON AIR (Active Video)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLiveActive(false)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        !isLiveActive
                          ? "bg-[#0D449F] text-white border-[#0D449F]"
                          : "bg-white hover:bg-slate-50 text-slate-500 border-slate-205"
                      }`}
                    >
                      OFF AIR (Standby Poster)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                    Stream Source URL / YouTube Link
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://www.youtube.com/watch?v=5qap5aO4i9A"
                    value={liveUrlInput}
                    onChange={(e) => setLiveUrlInput(e.target.value)}
                    className="w-full bg-white text-xs text-slate-800 rounded-lg p-2.5 border border-slate-205 focus:outline-hidden focus:border-[#4283ED]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                    Broadcast Show Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Trent TV Live Morning segment"
                    value={liveTitleInput}
                    onChange={(e) => setLiveTitleInput(e.target.value)}
                    className="w-full bg-white text-xs text-slate-800 rounded-lg p-2.5 border border-slate-205 focus:outline-hidden focus:border-[#4283ED]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                    Stream Description / Broadcast Info
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter what students should know about this live stream..."
                    value={liveDescInput}
                    onChange={(e) => setLiveDescInput(e.target.value)}
                    className="w-full bg-white text-xs text-slate-800 rounded-lg p-2.5 border border-slate-205 focus:outline-hidden focus:border-[#4283ED]"
                  />
                </div>

                {/* POSTER CONFIGURATION BOX */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4.5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#01225A]">Standby Poster Setup</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Specify an image URL or upload a file directly to show when offline.</p>
                    </div>

                    {/* Fictional File upload trigger to Base64 utility */}
                    <div className="flex items-center gap-2">
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePosterFileUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-[#0D449F] hover:bg-[#01225A] transition-colors rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload Standby Poster Image
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#0D449F] mb-1 font-mono">
                      Current Poster URL (Live string)
                    </label>
                    <input
                      type="text"
                      placeholder="Or specify custom URL directly..."
                      value={livePosterInput}
                      onChange={(e) => setLivePosterInput(e.target.value)}
                      className="w-full bg-white text-xs text-slate-800 rounded-lg p-2.5 border border-slate-205 mb-3 focus:outline-hidden"
                    />
                  </div>

                  {/* Preset option pills */}
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-semibold text-slate-600 font-mono">
                      Quick Preset Overlays:
                    </span>
                    <div className="flex flex-wrap gap-2">
                       {PRESET_POSTER_IMAGES.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setLivePosterInput(preset.url)}
                          className={`px-3 py-1.5 border rounded-lg text-xs font-semibold hover:border-[#0D449F] transition-all cursor-pointer ${
                            livePosterInput === preset.url
                              ? "bg-[#0D449F]/10 text-[#0D449F] border-[#0D449F] font-bold"
                              : "bg-white text-slate-500 border-slate-205"
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0D449F] to-[#4283ED] text-white font-bold text-sm tracking-wide shadow-md hover:scale-102 transition-transform duration-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save & Synchronize Live Feed
                </button>
              </div>

            </form>

            {/* Watch Live Preview box inside CMS panel */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-extrabold text-[#01225A] text-md mb-3 flex items-center gap-1.5 justify-between">
                  Live Feed Preview
                  <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider ${isLiveActive ? "bg-red-600 text-white" : "bg-slate-500 text-slate-100"}`}>
                    {isLiveActive ? "Live" : "Offline"}
                  </span>
                </h3>

                <div 
                  className="aspect-video rounded-xl bg-cover bg-center overflow-hidden relative shadow-md flex items-center justify-center p-4 border border-slate-200"
                  style={{ 
                    backgroundImage: isLiveActive 
                      ? "none" 
                      : `url(${livePosterInput})` 
                  }}
                >
                  {isLiveActive ? (
                    <div className="bg-[#000a20] absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <Play className="w-8 h-8 text-red-500 fill-red-500 animate-pulse mb-2" />
                      <span className="text-xs font-bold text-white line-clamp-1">"{liveTitleInput}"</span>
                      <span className="text-[10px] text-gray-400 mt-1">Embed Live Feed loaded in browser portal.</span>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
                      <div className="relative text-center z-10 max-w-xs">
                        <span className="text-[8px] tracking-widest border border-yellow-500 text-yellow-500 font-mono font-bold uppercase rounded px-1.5 py-0.5 block w-max mx-auto mb-1">
                          Poster Injected
                        </span>
                        <h4 className="font-bold text-xs text-white line-clamp-1">{liveTitleInput}</h4>
                        <p className="text-[10px] text-gray-300 mt-1">Standby slide graphic is active</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2 mt-4 text-xs text-gray-300">
                  <p><strong>Configured Stream:</strong> <span className="font-mono text-[10px] break-all block text-[#4283ED] font-bold bg-[#01225A] p-1.5 rounded border border-[#0D449F]/30 mt-1">{liveUrlInput}</span></p>
                  <p className="text-gray-400 leading-snug">When the stream link is requested, students watching inside the Watch Live tab see the iframe load immediately if toggled "ON AIR".</p>
                </div>
              </div>
            </div>

          </div>
        )}

         {/* ----------------- TAB SECTION B: BROADCAST GRID CMS (SCHEDULE) ----------------- */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            
            {/* Direct Feed Switcher Panel */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <h3 className="text-sm font-extrabold text-[#01225A] flex items-center gap-2">
                  <span className="p-1 px-1.5 rounded-md bg-[#0D449F]/10 text-[#01225A] text-xs font-mono">STEP 1</span>
                  Select Public Broadcasting Source
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Toggle whether site visitors view the manually configured, local show listings from your Firestore database, or whether they view the joint Media Union radio/TV API feed automatically.
                </p>
              </div>

              <div className="bg-white p-1 rounded-full border border-slate-200 flex items-center self-start md:self-center shrink-0 shadow-xs">
                <button
                  type="button"
                  onClick={() => handleToggleScheduleSetting(false)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                    !useExternalApiSetting
                      ? "bg-[#01225A] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  Local database
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleScheduleSetting(true)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                    useExternalApiSetting
                      ? "bg-[#01225A] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <CloudDownload className="w-3.5 h-3.5" />
                  External API Feed
                </button>
              </div>
            </div>

            {/* Note about active selection */}
            {useExternalApiSetting && (
              <div className="bg-blue-50 border border-blue-100 text-[#0D449F] text-xs font-semibold p-4.5 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Notice:</strong> The external joint media feed is currently active. Any custom shows added below will continue saving to the database, but will not appear publicly on the Schedule timetable screen until switched back to Local database.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Creation form */}
            <form onSubmit={handleAddOrEditShow} className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-lg font-bold pb-2 border-b border-slate-100 text-[#01225A] flex items-center justify-between">
                <span>{editingShow ? "✏️ Edit Show Slot" : "➕ Append Schedule Slot"}</span>
                {editingShow && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingShow(null);
                      setNewShowForm({ title: "", host: "", startTime: "12:00", endTime: "13:00", day: "Monday", category: "entertainment", description: "", isRecurring: true, date: "" });
                    }}
                    className="p-1 rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </h2>

              {/* Schedule Type toggle field */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-205">
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2 font-mono">
                  Is this show recurring?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewShowForm(prev => ({ ...prev, isRecurring: true }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      newShowForm.isRecurring
                        ? "bg-[#01225A] text-white shadow-xs"
                        : "bg-white text-slate-500 border border-slate-200 hover:text-[#01143A]"
                    }`}
                  >
                    🔄 Weekly Recurring
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewShowForm(prev => ({ ...prev, isRecurring: false }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !newShowForm.isRecurring
                        ? "bg-[#01225A] text-white shadow-xs"
                        : "bg-white text-slate-500 border border-slate-200 hover:text-[#01143A]"
                    }`}
                  >
                    📅 One-off / Temporary
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {newShowForm.isRecurring ? (
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                      Day of Broadcast
                    </label>
                    <select
                      value={newShowForm.day}
                      onChange={(e) => setNewShowForm(prev => ({ ...prev, day: e.target.value }))}
                      className="w-full bg-white text-xs text-slate-800 rounded-lg p-2 border border-slate-205 focus:outline-hidden"
                    >
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                      Specific Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newShowForm.date}
                      onChange={(e) => {
                        const rawDate = e.target.value;
                        const dNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        const parsed = new Date(rawDate);
                        const weekday = isNaN(parsed.getTime()) ? "Monday" : dNames[parsed.getDay()];
                        setNewShowForm(prev => ({ ...prev, date: rawDate, day: weekday }));
                      }}
                      className="w-full bg-white text-xs text-slate-800 rounded-lg p-1.5 border border-slate-205 focus:outline-hidden"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                    Programming Category
                  </label>
                  <select
                    value={newShowForm.category}
                    onChange={(e) => setNewShowForm(prev => ({ ...prev, category: e.target.value as ScheduleItem["category"] }))}
                    className="w-full bg-white text-xs text-slate-800 rounded-lg p-2 border border-slate-205 focus:outline-hidden"
                  >
                    <option value="entertainment">Entertainment</option>
                    <option value="news">News bulletins</option>
                    <option value="sports">Campus Sports</option>
                    <option value="music">Live Sessions</option>
                    <option value="other">Special Broadcasts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                    Start Air Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 13:00"
                    value={newShowForm.startTime}
                    onChange={(e) => setNewShowForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-white text-xs text-slate-800 rounded-lg p-2 border border-slate-205 focus:outline-[#0D449F]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                    End Air Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14:30"
                    value={newShowForm.endTime}
                    onChange={(e) => setNewShowForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-white text-xs text-slate-800 rounded-lg p-2 border border-slate-205 focus:outline-[#0D449F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                  Show Name / Programming Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Trent Sports Update"
                  value={newShowForm.title}
                  onChange={(e) => setNewShowForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white text-xs text-slate-800 rounded-lg p-2.5 border border-slate-205 focus:outline-[#0D449F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                  Presenter Host / Team Crew
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins & Liam Cole"
                  value={newShowForm.host}
                  onChange={(e) => setNewShowForm(prev => ({ ...prev, host: e.target.value }))}
                  className="w-full bg-white text-xs text-slate-800 rounded-lg p-2.5 border border-slate-205 focus:outline-[#0D449F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                  Short Description for Students
                </label>
                <textarea
                  rows={3}
                  placeholder="Keep it brief, 2 sentences summarizing the segment details..."
                  value={newShowForm.description}
                  onChange={(e) => setNewShowForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-white text-xs text-slate-800 rounded-lg p-2.5 border border-slate-205 focus:outline-[#0D449F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#0D449F] hover:bg-[#01225A] transition-all font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                {editingShow ? <Save className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                {editingShow ? "Apply Modifications" : "Register Show Slot"}
              </button>
            </form>

            {/* Right Col: Listing grid with triggers */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-lg font-bold pb-2 border-b border-slate-100 text-[#01225A]">
                Active Weekly Programs Grid ({schedule.length})
              </h2>

              <div className="max-h-[500px] overflow-y-auto space-y-3.5 pr-2">
                {schedule.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#4283ED] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black font-mono uppercase bg-[#0D449F] text-white">
                          {item.day}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-semibold">
                          {item.startTime} - {item.endTime}
                        </span>
                        <span className={`text-[8px] tracking-widest font-mono font-black uppercase rounded px-1 text-slate-600 bg-slate-200`}>
                          {item.category}
                        </span>
                        {item.isRecurring === false ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-amber-50 text-amber-800 border border-amber-200/80">
                            📅 {item.date || "One-off"}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200/80">
                            🔄 Weekly
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm text-[#01225A] mt-1.5">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Host: <strong>{item.host}</strong></p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => triggerEditFill(item)}
                        className="px-2.5 py-1.5 rounded-lg border border-yellow-600 text-yellow-600 hover:bg-yellow-500/10 text-[10px] font-bold cursor-pointer"
                        title="Edit slot parameters"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveShow(item.id, item.title)}
                        className="p-1.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-500/10 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>
          </div>
        )}

        {/* ----------------- TAB SECTION C: VIDEO CATALOG CMS ----------------- */}
        {activeTab === "youtube" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col Form: addition */}
            <form onSubmit={handleAddOrEditVid} className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-lg font-bold pb-2 border-b border-slate-100 text-[#01225A] flex items-center justify-between">
                <span>{editingVid ? "✏️ Edit Video Entry" : "🎦 Append YouTube Showcase"}</span>
                {editingVid && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingVid(null);
                      setNewVidForm({ title: "", youtubeId: "", category: "News", duration: "10:00", description: "", featured: false });
                    }}
                    className="p-1 rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </h2>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                  YouTube Video ID (11 characters)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. S3mG6p_s65_E"
                    value={newVidForm.youtubeId}
                    onChange={(e) => setNewVidForm(prev => ({ ...prev, youtubeId: e.target.value.trim() }))}
                    className="flex-1 bg-white text-xs text-slate-800 rounded-lg p-2.5 border border-slate-205 focus:outline-[#0D449F]"
                  />
                  {newVidForm.youtubeId && (
                     <div className="w-14 h-10 rounded border border-slate-200 overflow-hidden bg-black">
                      <img 
                        src={`https://img.youtube.com/vi/${newVidForm.youtubeId}/default.jpg`} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-medium font-sans">This is the key inside the YouTube URL, e.g. youtube.com/watch?v=<strong>S3mG6p_s65_E</strong></p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                  Video / Program Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trent SU Election Debate Highlights"
                  value={newVidForm.title}
                  onChange={(e) => setNewVidForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white text-xs text-slate-800 rounded-lg p-2.5 border border-slate-205 focus:outline-[#0D449F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                    Genre / Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sports, News, Music"
                    value={newVidForm.category}
                    onChange={(e) => setNewVidForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white text-xs text-slate-800 rounded-lg p-2 border border-slate-205 focus:outline-[#0D449F]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                    Time Duration (mm:ss)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12:45"
                    value={newVidForm.duration}
                    onChange={(e) => setNewVidForm(prev => ({ ...prev, duration: e.target.value.trim() }))}
                    className="w-full bg-white text-xs text-slate-800 rounded-lg p-2 border border-slate-205 focus:outline-[#0D449F]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="checkbox-featured"
                    checked={newVidForm.featured}
                    onChange={(e) => setNewVidForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded text-[#0D449F] focus:ring---[#0D449F] bg-white w-4 h-4 border-slate-205 cursor-pointer"
                  />
                  <label htmlFor="checkbox-featured" className="text-xs font-bold text-[#01225A] cursor-pointer select-none">
                    Feature on Spotlight Billboard (Netflix styling header)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 font-mono">
                  Show Clip Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide details about what students will watch..."
                  value={newVidForm.description}
                  onChange={(e) => setNewVidForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-white text-xs text-slate-800 rounded-lg p-2.5 border border-slate-205 focus:outline-[#0D449F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#0D449F] hover:bg-[#01225A] transition-all font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                {editingVid ? <Save className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                {editingVid ? "Apply Video Fixes" : "Append Video to Library"}
              </button>
            </form>

            {/* Catalog inventory list */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-lg font-bold pb-2 border-b border-slate-100 text-[#01225A]">
                Showcase Video Catalog Inventory ({videos.length})
              </h2>

              <div className="max-h-[500px] overflow-y-auto space-y-3.5 pr-2">
                {videos.map((vid) => (
                  <div 
                    key={vid.id}
                    className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex gap-3.5 hover:border-[#4283ED] transition-colors items-start"
                  >
                    {/* Thumbnail box */}
                    <div className="w-20 sm:w-28 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0 border border-slate-200 relative">
                      <img 
                        src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {vid.featured && (
                        <span className="absolute top-1 left-1 bg-yellow-500 text-[#01225A] font-black text-[7px] tracking-wide px-1 rounded">
                          SPOTLIGHT
                        </span>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-1.5 font-bold font-mono uppercase bg-[#0D449F] text-white rounded">
                          {vid.category}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono font-semibold">
                          {vid.duration} mins
                        </span>
                      </div>

                      <h4 className="font-extrabold text-xs sm:text-sm text-[#01225A] line-clamp-1">{vid.title}</h4>
                      
                      <div className="flex items-center gap-3 pt-1 text-[9px] text-slate-500 font-mono">
                        <button 
                          onClick={() => triggerEditVidFill(vid)}
                          className="text-yellow-600 hover:underline font-bold cursor-pointer"
                        >
                          Modify Parameters
                        </button>
                        <span>•</span>
                        <button 
                          onClick={() => handleRemoveVid(vid.id, vid.title)}
                          className="text-red-500 hover:underline font-bold cursor-pointer"
                        >
                          Remove Video
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
