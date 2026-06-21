import React, { useState } from "react";
import { VideoItem } from "../types";
import { Play, Search, Heart, Sparkles, FileVideo, PlusCircle, X, ThumbsUp, Calendar, Clock, Eye } from "lucide-react";

interface YoutubeCatalogProps {
  videos: VideoItem[];
}

export default function YoutubeCatalog({ videos }: YoutubeCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  const categories = ["All", ...Array.from(new Set(videos.map(v => v.category)))];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || video.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredVideo = videos.find(v => v.featured) || videos[0];

  const handleOpenVideo = (video: VideoItem) => {
    setSelectedVideo(video);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* 1. HERO SPOTLIGHT BANNER: Netflix Style */}
      {featuredVideo && (
        <div className="relative w-full h-[400px] md:h-[480px] bg-slate-950 overflow-hidden flex items-end">
          
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{ 
              backgroundImage: `url(https://img.youtube.com/vi/${featuredVideo.youtubeId}/maxresdefault.jpg)` 
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Hero Meta Details */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pb-10 relative z-10">
            <div className="max-w-2xl space-y-3.5">
              
              <div className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-medium rounded-full bg-white/10 text-white backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                Featured broadcast
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                {featuredVideo.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-350 line-clamp-2 leading-relaxed">
                {featuredVideo.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featuredVideo.duration} mins
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {featuredVideo.views.toLocaleString()} plays
                </span>
                <span>•</span>
                <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-white text-[10px] capitalize">
                  {featuredVideo.category}
                </span>
              </div>

              {/* Play CTA trigger */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  id="hero-play-btn"
                  onClick={() => handleOpenVideo(featuredVideo)}
                  className="px-5 py-2 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-medium text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current text-slate-950" />
                  Stream now
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. CATALOG CORE: Streaming Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        
        {/* Search & Category Filter Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              <FileVideo className="w-5 h-5 text-slate-400" />
              On demand library
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Browse previous Trent TV broadcasts, student shorts, mock debate panels, and university events.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Category selection pill boxes */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-slate-105 overflow-x-auto self-start sm:self-center">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? "bg-slate-200 text-slate-950 font-bold"
                      : "text-slate-500 hover:text-slate-950 font-medium"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Keyword Search field */}
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-xs text-slate-805 pl-9 pr-4 py-2.5 rounded-full border border-slate-105 focus:outline-none focus:border-slate-350 focus:ring-1 focus:ring-slate-350 transition-colors shadow-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Video stream list displays */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div 
                key={video.id}
                onClick={() => handleOpenVideo(video)}
                className="group cursor-pointer bg-white border border-slate-105 rounded-3xl overflow-hidden hover:shadow-xs transition-all duration-300 relative flex flex-col justify-between"
              >
                
                {/* Simulated Thumbnail Frame */}
                <div className="aspect-video relative overflow-hidden bg-slate-950">
                  <img 
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute inset-0 bg-black/10 transition-colors flex items-center justify-center">
                    <span className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md transition-transform group-hover:scale-105 duration-200">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </span>
                  </div>

                  {/* Program Duration Tag */}
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 text-[10px] text-white rounded">
                    {video.duration}
                  </span>

                  {/* Show Category Badge on Card */}
                  <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-white px-2.5 py-0.5 text-[10px] font-medium capitalize rounded-full">
                    {video.category}
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-4.5 space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-slate-950 line-clamp-2 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 mt-2">
                    <span>
                      {video.views.toLocaleString()} plays
                    </span>
                    <span>
                      {video.publishedDate}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-slate-200 p-16 rounded-3xl text-center text-slate-500 bg-white shadow-xs">
            <p className="text-xs font-semibold text-slate-900">No student videos match your query</p>
            <p className="text-[11px] text-slate-400 mt-1">Try resetting the selection tags or query keywords.</p>
          </div>
        )}

      </div>

      {/* 3. IN-APP THEATER POPUP MODAL (YOUTUBE EMBED PLAYER) */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs transition-opacity" 
          />

          <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl relative z-10">
            
            {/* Modal action bar header */}
            <div className="bg-slate-950 px-5 py-4 flex items-center justify-between border-b border-white/5">
              <span className="text-[12px] font-medium text-slate-400">Trent TV player theater</span>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="text-slate-300 hover:text-white text-xs font-medium px-3 py-1.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>

            {/* Video Play Container */}
            <div className="relative aspect-video bg-black">
              <iframe
                id="theater-iframe"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0 absolute inset-0"
              />
            </div>

            {/* Metadata overlay on dialog footer */}
            <div className="p-6 md:p-8 space-y-3 bg-slate-950 border-t border-white/5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-medium capitalize text-[10px]">
                  {selectedVideo.category}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 text-[11px]">
                  Published {selectedVideo.publishedDate}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 text-[11px]">
                  {selectedVideo.duration} Minutes
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-white leading-tight">
                {selectedVideo.title}
              </h2>

              <p className="text-slate-400 text-xs leading-relaxed font-normal">
                {selectedVideo.description}
              </p>

              {/* Stats Bar */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5 text-xs">
                <div className="flex items-center gap-4 text-slate-400 font-normal">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                    {selectedVideo.likes.toLocaleString()} Likes
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    {selectedVideo.views.toLocaleString()} Views
                  </span>
                </div>

                <span className="text-[10px] text-slate-500">
                  Nottingham Trent TV
                </span>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
