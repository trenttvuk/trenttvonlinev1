import React, { useState, useEffect } from "react";
import { LiveStreamConfig, ScheduleItem } from "../types";
import { Tv, Users, AlertCircle, Share2, Play, Heart, ExternalLink, Radio, Calendar } from "lucide-react";

interface WatchLiveProps {
  config: LiveStreamConfig;
  schedule: ScheduleItem[];
  currentDay: string;
}

// Convert common video URLs to embeddable URLs
function getEmbedUrl(url: string): string {
  if (!url) return "";
  try {
    if (url.includes("/embed/")) return url;
    
    if (url.includes("youtube.com/watch")) {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    
    if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      if (parts[1]) {
        const videoId = parts[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    }

    if (url.includes("twitch.tv/")) {
      const parts = url.split("twitch.tv/");
      if (parts[1]) {
        const channel = parts[1].split("/")[0].split("?")[0];
        return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}&muted=false`;
      }
    }
  } catch (err) {
    console.error("Url parsing error", err);
  }
  return url;
}

export default function WatchLive({ config, schedule, currentDay }: WatchLiveProps) {
  const [viewerCount, setViewerCount] = useState(config.viewerCount || 120);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(84);

  // Dynamic viewer count simulator for interactive testing
  useEffect(() => {
    if (!config.isEnabled) return;
    
    const timer = setInterval(() => {
      setViewerCount(prev => Math.max(80, prev + Math.floor(Math.random() * 9) - 4));
    }, 12000);

    return () => clearInterval(timer);
  }, [config.isEnabled]);

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  const todayPrograms = schedule
    .filter(item => item.day.toLowerCase() === currentDay.toLowerCase())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const embeddableUrl = getEmbedUrl(config.streamUrl);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10 space-y-6">
        
        {/* Embedded Stream Viewer State / Live Screen */}
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-100 shadow-md">
          {config.isEnabled && embeddableUrl ? (
            <iframe
              id="live-embed-iframe"
              src={embeddableUrl}
              title="Trent TV Live Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0 absolute inset-0"
            ></iframe>
          ) : (
            /* Poster Image State / Off-Air State */
            <div 
              className="w-full h-full bg-cover bg-center relative flex flex-col justify-between p-8 sm:p-10"
              style={{ backgroundImage: `url(${config.posterUrl})` }}
            >
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs" />

              {/* Off-air Top Bar Badge */}
              <div className="relative flex justify-between items-center z-10 w-full">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Off-Air Standby
                </div>
                <div className="hidden sm:block text-xs font-medium px-3 py-1 bg-white/10 text-white rounded-full">
                  Next Broadcast: Today at 17:00
                </div>
              </div>

              {/* Poster Screen Mid Call-to-action */}
              <div className="relative self-center text-center max-w-sm z-10">
                <div className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center mx-auto mb-4 cursor-pointer shadow-md">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Live Stream Offline
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  We are currently off-air. You can run simulated live broadcasts via the CMS Dashboard or explore our curated video catalog under the On Demand tab.
                </p>
              </div>

              {/* Bottom details of the Poster */}
              <div className="relative z-10 flex justify-between items-end border-t border-white/5 pt-4">
                <div>
                  <h4 className="text-xs font-medium text-white">
                    Trent TV Standby Feed
                  </h4>
                </div>
                <span className="text-xs text-slate-400">
                  Nottingham
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Video metadata under section */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {config.isEnabled ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-650 tracking-wide flex items-center gap-1 animate-pulse">
                    <Radio className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                    Live Program
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 tracking-wide flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Offline Station
                  </span>
                )}
                <span className="text-[11.5px] bg-slate-50 text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-100 font-medium">
                  Student Broadcaster Center
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                {config.title || "Trent TV Standby Stream"}
              </h1>
            </div>

            {/* Live stream social interactions */}
            <div className="flex items-center gap-3 self-start sm:self-center">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isLiked 
                    ? "bg-slate-900 text-white shadow-xs" 
                    : "bg-white hover:bg-slate-50 text-slate-705 border border-slate-205"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-white text-white" : "text-slate-400"}`} />
                {likesCount} Likes
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Trent TV Live stream link copied to clipboard!");
                }}
                className="p-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 transition-all text-slate-500 hover:text-slate-800 cursor-pointer text-xs"
                title="Share Live link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stream channel info / description */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-slate-500 text-xs sm:text-sm leading-relaxed space-y-2">
            <p>{config.description || "No official broadcast description loaded from the Trent TV CMS. Select Station CMS to change this content."}</p>
            <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full text-slate-600 border border-slate-100">
                <Users className="w-3 h-3" />
                {viewerCount} connected
              </span>
              <span>
                Location: <strong className="text-slate-700 font-medium">City Campus (Byron) Studio</strong>
              </span>
            </div>
          </div>
        </div>

        {/* UP NEXT SCHEDULE SUB-DRAWER FOR WATCH PAGE */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xs">
          <h2 className="text-base font-bold tracking-tight text-slate-955 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            Up Next Today ({currentDay})
          </h2>

          {todayPrograms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {todayPrograms.slice(0, 4).map((prog) => (
                <div 
                  key={prog.id} 
                  className="bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl transition-all duration-200 border border-slate-100"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-700">
                      {prog.startTime} - {prog.endTime}
                    </span>
                    <span className="text-[10px] font-medium capitalize px-2 py-0.5 rounded-full bg-white border border-slate-100 text-slate-600">
                      {prog.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{prog.title}</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">Presenter: {prog.host}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
              No scheduled shows left for today. Go to the Schedule page to see the entire week's agenda.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
