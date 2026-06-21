/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Tv, 
  Radio, 
  Play, 
  Calendar, 
  Users, 
  Award, 
  Compass, 
  ChevronRight, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Clock,
  Video
} from "lucide-react";
import { LiveStreamConfig, ScheduleItem, VideoItem } from "../types";

interface HomeProps {
  streamConfig: LiveStreamConfig;
  schedule: ScheduleItem[];
  videos: VideoItem[];
  setActiveTab: (tab: "home" | "live" | "schedule" | "youtube" | "about" | "cms") => void;
  currentDay: string;
}

export default function Home({ streamConfig, schedule, videos, setActiveTab, currentDay }: HomeProps) {
  const isLive = streamConfig.isEnabled;

  // Find current day's programs for the ticker if live
  const todaysPrograms = schedule
    .filter(item => item.day.toLowerCase() === currentDay.toLowerCase())
    .slice(0, 3);

  // If no programs for today, show any 3 fallback programs
  const displayPrograms = todaysPrograms.length > 0 ? todaysPrograms : schedule.slice(0, 3);

  // When live, show 3 featured videos; when not live, show 6 videos to promote VOD content!
  const displayVideosCount = isLive ? 3 : 6;
  const featuredVideos = videos.slice(0, displayVideosCount);

  // Get top VOD video to showcase in our Hero section when off-air
  const topVideo = videos[0] || {
    id: "yt-1",
    title: "Nottingham Trent University: Campus Tour & City Life Vlog",
    youtubeId: "R-v_UjMyxU8",
    description: "Looking for a complete tour of Nottingham Trent University? Our student hosts take you through City Campus, Newton Building, Boots Library, and local student pubs.",
    duration: "12:14",
    views: 4521,
    likes: 312,
    publishedDate: "2026-04-12",
    category: "Documentary",
    featured: true,
  };

  // State for quick modal video preview on the landing page!
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      {/* 1. CINEMATIC HERO BILLBOARD */}
      <section className="relative overflow-hidden bg-white py-12 md:py-20 border-b border-slate-100">
        {/* Deep branding colored glowing backgrounds */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4283ED]/8 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#0D449F]/8 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Hero Left: Intro block */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Conditional Live Status badge */}
              {isLive ? (
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-650 bg-red-50 border border-red-100 rounded-full px-3.5 py-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                  <span className="uppercase tracking-wider">ON AIR LIVE NOW</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D449F] bg-[#0D449F]/5 border border-[#0D449F]/15 rounded-full px-3.5 py-1">
                  <span className="w-2 h-2 rounded-full bg-[#4283ED]"></span>
                  <span className="uppercase tracking-wider">OFFICIAL STUDENT BROADCASTS</span>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#01225A]">
                  Trent TV <span className="text-[#4283ED] block sm:inline">Broadcasting Nottingham</span>
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                  Welcome to Trent TV, the award-winning official student television station at Nottingham Trent University. Run entirely by students for students, we are a NaSTA affiliated staion producing high-quality live sports coverage, essential campus news, entertainment events, and original student documentaries since 2004.
                </p>
              </motion.div>

              {/* Action Buttons: Strictly point to Live only when isLive is true */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap items-center gap-3.5 pt-2"
              >
                {isLive ? (
                  <>
                    <button
                      id="hero-watch-live-btn"
                      onClick={() => setActiveTab("live")}
                      className="px-6 py-3 bg-[#01225A] hover:bg-[#0D449F] text-white font-bold rounded-full shadow-md transition-all flex items-center gap-2 text-xs hover:-translate-y-px duration-150 cursor-pointer"
                    >
                      <Radio className="w-4 h-4 text-red-400 animate-ping" />
                      Tune In Live Now
                    </button>
                    
                    <button
                      id="hero-demand-btn"
                      onClick={() => setActiveTab("youtube")}
                      className="px-6 py-3 bg-white hover:bg-slate-50 text-[#01225A] font-bold rounded-full border border-slate-200 transition-all flex items-center gap-2 text-xs hover:-translate-y-px duration-150 cursor-pointer shadow-xs"
                    >
                      <Tv className="w-4 h-4 text-slate-400" />
                      On Demand Library
                    </button>
                  </>
                ) : (
                  <>
                    {/* Offline state: No links or buttons to the Live page */}
                    <button
                      id="hero-demand-btn"
                      onClick={() => setActiveTab("youtube")}
                      className="px-6 py-3 bg-[#01225A] hover:bg-[#0D449F] text-white font-bold rounded-full shadow-md transition-all flex items-center gap-2 text-xs hover:-translate-y-px duration-150 cursor-pointer"
                    >
                      <Video className="w-4 h-4 text-[#4283ED]" />
                      Explore On Demand Catalog
                    </button>
                    
                    <button
                      id="hero-join-team-btn"
                      onClick={() => setActiveTab("about")}
                      className="px-6 py-3 bg-white hover:bg-slate-50 text-[#01225A] font-bold rounded-full border border-slate-200 transition-all flex items-center gap-2 text-xs hover:-translate-y-px duration-150 cursor-pointer shadow-xs"
                    >
                      <Users className="w-4 h-4 text-slate-400" />
                      About Our Team & Gear
                    </button>
                  </>
                )}
              </motion.div>

              {/* Quick statistics row */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 max-w-lg">
                <div>
                  <div className="font-extrabold text-2xl text-[#01225A]">35K+</div>
                  <div className="text-[11px] text-slate-550 font-bold uppercase tracking-wider">Student Reach</div>
                </div>
                <div>
                  <div className="font-extrabold text-2xl text-[#01225A]">NaSTA</div>
                  <div className="text-[11px] text-slate-550 font-bold uppercase tracking-wider">Affiliated</div>
                </div>
                <div>
                  <div className="font-extrabold text-2xl text-[#01225A]">Est. 2004</div>
                  <div className="text-[11px] text-slate-550 font-bold uppercase tracking-wider">Established</div>
                </div>
              </div>
            </div>

            {/* Hero Right: COVER VIDEO SPOTLIGHT PLAYER */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-150"
              >
                {/* Custom player status bar */}
                <div className="bg-slate-50 px-5 py-3 flex items-center justify-between border-b border-slate-200 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-[#01225A] font-black">
                    <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-[#0D449F]'}`}></span>
                    <span className="uppercase tracking-wide">{isLive ? "LIVE PREVIEW" : "FEATURED"}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 bg-white border border-slate-100 px-2 py-0.5 rounded-full">
                    {isLive ? `${streamConfig.viewerCount || 140} Live` : "Featured"}
                  </div>
                </div>

                {/* Cover Video Display Container */}
                <div className="relative aspect-video group bg-black">
                  <img
                    src={isLive ? streamConfig.posterUrl : `https://img.youtube.com/vi/${topVideo.youtubeId}/maxresdefault.jpg`}
                    alt={isLive ? streamConfig.title : "Trent TV Showcase"}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20 flex flex-col justify-between p-4">
                    
                    {/* Media category tag */}
                    <div className="self-end">
                      <span className="bg-[#01225A]/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] text-[#4283ED] font-bold uppercase tracking-wider border border-[#4283ED]/20">
                        {isLive ? "LIVE BROADCAST" : "STATION TRAILER"}
                      </span>
                    </div>

                    {/* Massive play trigger */}
                    <div className="self-center absolute inset-0 flex items-center justify-center">
                      <button 
                        onClick={() => {
                          if (isLive) {
                            setActiveTab("live");
                          } else {
                            setPreviewVideoId(topVideo.youtubeId);
                          }
                        }}
                        className="w-16 h-16 bg-[#0D449F]/95 hover:bg-[#01225A] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-[#4283ED]/30"
                        title={isLive ? "Redirect to live stream page" : "Click to play cover trailer video"}
                      >
                        <Play className="w-8 h-8 fill-current ml-1 text-white" />
                      </button>
                    </div>

                    {/* Meta descriptions overlay */}
                    <div className="p-2">
                      <h4 className="font-extrabold text-[#F8FAFC] text-sm md:text-base line-clamp-1">
                        {isLive ? streamConfig.title : "Inside Nottingham Student Television"}
                      </h4>
                      <p className="text-slate-300 text-xs line-clamp-1 mt-0.5 font-normal">
                        {isLive ? streamConfig.description : "Watch our official promo trailer and tour our Byron media spaces."}
                      </p>
                    </div>

                  </div>
                </div>
              </motion.div>

              {/* Fine Print Note - Only shows Live pointer when live */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 justify-center">
                {isLive ? (
                  <>
                    <span>Broadcasting live. <button onClick={() => setActiveTab("live")} className="text-[#0D449F] hover:underline font-bold ml-1">Open Player &rarr;</button></span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 text-[#0D449F]" />
                    <span>Click the player to load the official station trailer immediately</span>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DYNAMIC BROADCAST CONTENT BLOCK (LIVE PREMIER vs VOD CATEGORIES SHIELD) */}
      {isLive ? (
        <section className="bg-slate-55 py-16 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <span className="text-[11px] font-bold text-[#0D449F] uppercase tracking-wider block mb-1">PROGRAM DIRECTORY</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#01225A] tracking-tight">
                  On Air Today <span className="text-slate-450 font-normal font-sans">({currentDay})</span>
                </h2>
              </div>
              
              <button
                onClick={() => setActiveTab("schedule")}
                className="text-slate-700 hover:text-[#01225A] text-sm font-bold flex items-center gap-0.5 mt-3 md:mt-0 transition-colors group cursor-pointer"
              >
                <span>View full weekly timetable</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayPrograms.map((show) => (
                <div 
                  key={show.id}
                  className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#0D449F]/20 hover:shadow-xs relative transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-3 text-xs mb-4">
                    <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[#01225A] font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {show.startTime} - {show.endTime}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      show.category === "news" ? "bg-red-50 text-red-700 border-red-100" :
                      show.category === "sports" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      show.category === "music" ? "bg-purple-50 text-purple-700 border-purple-100" :
                      "bg-[#4283ED]/10 text-[#01225A] border-[#4283ED]/20"
                    }`}>
                      {show.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#01225A] text-base group-hover:text-[#0D449F] transition-colors">{show.title}</h3>
                    <p className="text-xs text-slate-450 mt-1">Host: {show.host}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">{show.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Broadcast schedule</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-[#0D449F] font-bold">
                      Details <ArrowRight className="w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      ) : (
        /* VOD SHIELD: CURATED ON-DEMAND PLAYLIST SELECTION (OFFLINE) */
        <section className="bg-white py-16 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[11px] font-bold text-[#0D449F] uppercase tracking-wider block mb-1">STATION ARCHIVES</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#01225A] tracking-tight">
                Curated Video Playlists
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                We organize our gold-standard student broadcasts, competitive varsity leagues, original vlogs, and campus news briefings for painless streaming.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Sports */}
              <div 
                onClick={() => setActiveTab("youtube")}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-[#0D449F]/20 hover:shadow-xs transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white text-slate-750 flex items-center justify-center mb-4 transition-all group-hover:bg-[#01225A] group-hover:text-white shadow-xs">
                    <span className="text-base">🏆</span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#01225A] group-hover:text-[#0D449F] transition-colors">Varsity Leagues</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                    Stream comprehensive mock broadcasts, local match highlights, and the legendary Nottingham Varsity series.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-1 text-[11px] text-[#0D449F] font-bold">
                  <span>Stream Sports</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Documentaries */}
              <div 
                onClick={() => setActiveTab("youtube")}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-[#0D449F]/20 hover:shadow-xs transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white text-slate-755 flex items-center justify-center mb-4 transition-all group-hover:bg-[#01225A] group-hover:text-white shadow-xs">
                    <span className="text-base">📹</span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#01225A] group-hover:text-[#0D449F] transition-colors">Factual & Docs</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                    Immerse yourself in campus vlogs, historical guidebooks, NTU showcase videos, and award-winning student films.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-1 text-[11px] text-[#0D449F] font-bold">
                  <span>Stream Docs</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: News */}
              <div 
                onClick={() => setActiveTab("youtube")}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-[#0D449F]/20 hover:shadow-xs transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white text-slate-755 flex items-center justify-center mb-4 transition-all group-hover:bg-[#01225A] group-hover:text-white shadow-xs">
                    <span className="text-base">🎤</span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#01225A] group-hover:text-[#0D449F] transition-colors">Student News</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                    Stay informed with student union election updates, city housing debates, local briefings, and academic features.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-1 text-[11px] text-[#0D449F] font-bold">
                  <span>Stream News</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 4: Entertainment */}
              <div 
                onClick={() => setActiveTab("youtube")}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-[#0D449F]/20 hover:shadow-xs transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white text-slate-755 flex items-center justify-center mb-4 transition-all group-hover:bg-[#01225A] group-hover:text-white shadow-xs">
                    <span className="text-base">🎵</span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#01225A] group-hover:text-[#0D449F] transition-colors">Campus Culture</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                    Tune into live Byron studio sets, Nottingham acoustic sessions, student debates, and society challenge broadcasts.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-1 text-[11px] text-[#0D449F] font-bold">
                  <span>Stream Culture</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* 3. FEATURED VIDEO SHOWCASE (ON-DEMAND PREVIEWS) */}
      <section className="bg-slate-50 py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-[11px] font-bold text-[#0D449F] uppercase tracking-wider block mb-1">STATION BROADCASTS</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#01225A] tracking-tight">
                {isLive ? "Trending On Demand Content" : "Recent Airings & Broadcasts"}
              </h2>
              <p className="text-slate-500 text-xs mt-1">Ready to watch at any hour. Discover student-led shorts, tours, and panel debates.</p>
            </div>
            
            <button
              onClick={() => setActiveTab("youtube")}
              className="text-[#0D449F] hover:text-[#01225A] text-sm font-extrabold flex items-center gap-0.5 mt-3 md:mt-0 transition-colors group cursor-pointer"
            >
              <span>Explore video catalog</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVideos.map(video => (
              <div 
                key={video.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-150 hover:border-[#0D449F]/30 hover:shadow-xs transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Video Card Thumbnail representation */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setPreviewVideoId(video.youtubeId)}>
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <span className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md transition-transform group-hover:scale-105 duration-200 border border-slate-100">
                      <Play className="w-4 h-4 fill-current ml-0.5 text-[#01225A]" />
                    </span>
                  </div>
                  {/* Duration marker */}
                  <span className="absolute bottom-2,5 right-2.5 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 text-[10px] text-white rounded">
                    {video.duration}
                  </span>
                  {/* Category marker */}
                  <span className="absolute top-2.5 left-2.5 bg-[#01225A]/90 backdrop-blur-md text-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full border border-white/10">
                    {video.category}
                  </span>
                </div>

                <div className="p-5 space-y-2 flex-grow flex flex-col justify-between bg-white text-left">
                  <div>
                    <h3 
                      onClick={() => setPreviewVideoId(video.youtubeId)}
                      className="font-extrabold text-sm text-[#01225A] hover:text-[#0D449F] transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                      {video.description}
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-450 font-medium">
                    <span>{video.views.toLocaleString()} plays</span>
                    <span>{video.publishedDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. BRAND BENTO GRID: WHY TRENT TV */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold text-[#0D449F] uppercase tracking-wider block mb-1">CRAFT & HARDWARE</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#01225A] tracking-tight">
              Broadcasting Sandbox & Byron Studio
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
              Based at NTU, Trent TV provides students with hands-on technical environments and high-grade multimedia gear to develop real broadcast experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Bento Card 1: Equipment */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-[#0D449F]/25 hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white text-[#0D449F] flex items-center justify-center mb-6 shadow-xs border border-slate-100">
                  <Tv className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#01225A] tracking-tight">Byron Media Suite Studio</h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  Train on industry-grade hardware including Sony FX30 cinema cameras, Blackmagic ATEM direct video switchers, wireless lav networks, and custom sound design desks.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab("about")}
                className="text-xs text-[#0D449F] hover:text-[#01225A] font-extrabold inline-flex items-center gap-1 mt-6 self-start group cursor-pointer"
              >
                Tour our equipment and suite &rarr;
              </button>
            </div>

            {/* Bento Card 2: Award-winning standard */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-105 hover:border-[#0D449F]/25 hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white text-amber-500 flex items-center justify-center mb-6 shadow-xs border border-slate-100">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#01225A] tracking-tight">National NaSTA Awards</h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  We are standard-setting participants in the National Student Television Association. Our student teams consistently contend for and win national media trophies.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab("about")}
                className="text-xs text-[#0D449F] hover:text-[#01225A] font-extrabold inline-flex items-center gap-1 mt-6 self-start group cursor-pointer"
              >
                Read award-winning stories &rarr;
              </button>
            </div>

            {/* Bento Card 3: Volunteer opportunities */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-105 hover:border-[#0D449F]/25 hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white text-[#4283ED] flex items-center justify-center mb-6 shadow-xs border border-slate-100">
                  <span className="text-lg">🤝</span>
                </div>
                <h3 className="text-lg font-black text-[#01225A] tracking-tight">Zero-Experience Required</h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  No prior production, sound engineering, editing, or presentation experience is needed. We offer step-by-step masterclasses to build your skillset from zero.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab("about")}
                className="text-xs text-[#0D449F] hover:text-[#01225A] font-extrabold inline-flex items-center gap-1 mt-6 self-start group cursor-pointer"
              >
                Sign up as volunteer &rarr;
              </button>
            </div>

          </div>

          {/* Majestic Call to action banner */}
          <div className="mt-12 bg-gradient-to-r from-[#01225A] to-[#0D449F] p-8 md:p-10 rounded-3xl border border-[#4283ED]/35 flex flex-col md:flex-row items-center justify-between gap-6 text-white text-left shadow-lg">
            <div className="space-y-1">
              <span className="text-[#4283ED] text-[10px] font-black tracking-widest uppercase block">JOIN THE STATION TEAM</span>
              <h3 className="text-base md:text-lg font-extrabold text-white">Inspired to anchor, film, or edit?</h3>
              <p className="text-xs text-slate-300 font-normal">We train anchors, researchers, sound experts, directors, and content writers. All NTU candidates welcome.</p>
            </div>
            <a
              href="https://join.trenttv.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-[#01225A] hover:bg-slate-50 font-black rounded-full transition-all text-xs inline-flex items-center gap-1 cursor-pointer hover:scale-102 shadow-md shrink-0"
            >
              Apply at join.trenttv.uk &rarr;
            </a>
          </div>

        </div>
      </section>

      {/* 5. IMMERSIVE LIGHTBOX VIDEO MODAL PLAYER */}
      {previewVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in">
          <div 
            onClick={() => setPreviewVideoId(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity" 
          />

          <div className="bg-[#01225A] border border-white/10 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl relative z-10">
            {/* Modal Header */}
            <div className="bg-slate-950 px-5 py-3.5 flex items-center justify-between border-b border-white/5">
              <span className="text-[12px] font-bold text-[#4283ED] uppercase tracking-wider">Trent TV Theater</span>
              <button 
                onClick={() => setPreviewVideoId(null)}
                className="text-slate-350 hover:text-white text-xs font-semibold px-3.5 py-1.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                Close Player
              </button>
            </div>
            
            {/* Aspect ratio video player */}
            <div className="aspect-video w-full bg-black">
              <iframe
                id="home-modal-iframe"
                src={`https://www.youtube.com/embed/${previewVideoId}?autoplay=1&mute=0`}
                title="Trent TV Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="referrer"
                allowFullScreen
                className="w-full h-full border-0"
              ></iframe>
            </div>

            {/* Modal bottom bar actions */}
            <div className="bg-slate-950 p-5 flex items-center justify-between border-t border-white/5 text-left">
              <p className="text-xs text-slate-400 font-normal">Stream our extensive collection of broadcasts anytime.</p>
              <button
                onClick={() => {
                  setPreviewVideoId(null);
                  setActiveTab("youtube");
                }}
                className="px-4.5 py-2 bg-[#0D449F] hover:bg-[#01225A] text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 cursor-pointer border border-[#4283ED]/20"
              >
                Browse All Videos <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
