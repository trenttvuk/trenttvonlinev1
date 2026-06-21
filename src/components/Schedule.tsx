import React, { useState, useEffect } from "react";
import { ScheduleItem } from "../types";
import { 
  Calendar, 
  MapPin, 
  Radio, 
  Clock, 
  Loader2, 
  Sparkles, 
  LayoutGrid, 
  Compass, 
  Users, 
  ArrowRight,
  TrendingUp,
  Tv,
  ListCollapse,
  Search,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ScheduleProps {
  localSchedule: ScheduleItem[];
  currentDay: string;
  useExternalApi: boolean;
}

interface ProcessedShowItem extends ScheduleItem {
  computedDate: Date;
  computedDateStr: string;
  displayDayHeader: string;
  formattedCalendarDate: string;
}

export default function Schedule({ localSchedule, currentDay, useExternalApi }: ScheduleProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "weekly">("upcoming");
  const [activeDay, setActiveDay] = useState(currentDay);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [externalSchedule, setExternalSchedule] = useState<ScheduleItem[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Category styling lookup
  const CATEGORY_STYLES: Record<string, { bg: string; border: string; bullet: string }> = {
    news: { bg: "bg-rose-50 text-rose-700", border: "border-rose-100/80", bullet: "bg-rose-500" },
    sports: { bg: "bg-emerald-50 text-emerald-700", border: "border-emerald-100/80", bullet: "bg-emerald-500" },
    music: { bg: "bg-cyan-50 text-cyan-700", border: "border-cyan-100/80", bullet: "bg-cyan-500" },
    entertainment: { bg: "bg-violet-50 text-violet-700", border: "border-violet-100/80", bullet: "bg-violet-500" },
    other: { bg: "bg-amber-50 text-amber-700", border: "border-amber-100/80", bullet: "bg-amber-500" },
  };

  const getCategoryStyles = (category: string) => {
    return CATEGORY_STYLES[category.toLowerCase()] || { bg: "bg-slate-50 text-slate-700", border: "border-slate-150", bullet: "bg-slate-400" };
  };

  // Simulate pulling schedule from an external Student Radio & Media joint API
  const fetchExternalAPI = () => {
    setIsLoadingApi(true);
    setTimeout(() => {
      const mockApiSchedule: ScheduleItem[] = [
        {
          id: "ext-1",
          title: "National Student Media Awards Live Pre-Show",
          host: "NTU Journalism Union Team",
          startTime: "11:00",
          endTime: "12:30",
          day: "Monday",
          category: "news",
          description: "Exclusive joint broadcast with Nottingham Trent Student Union, reviewing this year's student television and media achievements.",
          isRecurring: true
        },
        {
          id: "ext-2",
          title: "The BBC Workshop Guest Broadcast",
          host: "Clara Amfo (BBC Radio 1 Host)",
          startTime: "15:00",
          endTime: "16:00",
          day: "Monday",
          category: "other",
          description: "A special masterclass session recorded live at the Boots Library, discussing professional newsroom journalism and presenting.",
          isRecurring: false,
          date: "2026-06-22"
        },
        {
          id: "ext-3",
          title: "Trent Tigers Basketball Live Coverage",
          host: "Sport Broadcast Roster",
          startTime: "18:00",
          endTime: "19:30",
          day: "Wednesday",
          category: "sports",
          description: "Live varsity match commentary on the key court from the Clifton Sports Arena.",
          isRecurring: true
        },
        {
          id: "ext-4",
          title: "Nottingham Music Scene Radio Co-production",
          host: "Fly FM DJs & Trent TV Crews",
          startTime: "16:00",
          endTime: "18:00",
          day: "Thursday",
          category: "music",
          description: "A joint television and radio broadcast bringing live acoustic sets from upcoming local Nottinghamshire talent playing at Level 2.",
          isRecurring: true
        },
        {
          id: "ext-5",
          title: "The Great Student Union Cook-off",
          host: "SU President & VP Engagement",
          startTime: "12:00",
          endTime: "13:30",
          day: "Friday",
          category: "entertainment",
          description: "Unplanned student culinary challenges broadcasted live from the campus residence kitchens.",
          isRecurring: false,
          date: "2026-06-26"
        }
      ];
      setExternalSchedule(mockApiSchedule);
      setIsLoadingApi(false);
    }, 850);
  };

  useEffect(() => {
    if (useExternalApi) {
      fetchExternalAPI();
    }
  }, [useExternalApi]);

  const activeScheduleRaw = useExternalApi ? externalSchedule : localSchedule;

  // Next-occurrence date computer for recurring items
  const getNextOccurrence = (dayName: string): Date => {
    const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetIdx = daysName.findIndex(d => d.toLowerCase() === dayName.toLowerCase());
    const today = new Date();
    
    if (targetIdx === -1) return today;
    
    const todayIdx = today.getDay();
    let diff = targetIdx - todayIdx;
    if (diff < 0) {
      diff += 7; // Occurs next week
    }
    
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + diff);
    return targetDate;
  };

  // Convert raw show listings to rich, structured chronological upcoming timeline dates
  const getTimelineSchedule = (): ProcessedShowItem[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return activeScheduleRaw.map((item) => {
      let showDate: Date;
      if (item.isRecurring === false && item.date) {
        showDate = new Date(item.date);
        if (isNaN(showDate.getTime())) {
          showDate = getNextOccurrence(item.day);
        }
      } else {
        // True recurring weekly slot
        showDate = getNextOccurrence(item.day);
      }

      showDate.setHours(0, 0, 0, 0);

      // Create format descriptors
      const dateOption: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", weekday: "short" };
      const formattedDate = showDate.toLocaleDateString("en-US", dateOption);

      const calendarOption: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
      const formattedCalendarDate = showDate.toLocaleDateString("en-US", calendarOption);

      const diffMs = showDate.getTime() - today.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      let displayDayHeader = formattedDate;
      if (diffDays === 0) {
        displayDayHeader = `Today (${formattedDate})`;
      } else if (diffDays === 1) {
        displayDayHeader = `Tomorrow (${formattedDate})`;
      } else if (diffDays > 1 && diffDays < 7) {
        displayDayHeader = `This ${item.day} (${formattedDate})`;
      } else if (diffDays >= 7) {
        displayDayHeader = `Next ${item.day} (${formattedDate})`;
      }

      return {
        ...item,
        computedDate: showDate,
        computedDateStr: showDate.toISOString().split("T")[0],
        displayDayHeader,
        formattedCalendarDate
      };
    })
    .filter(item => {
      // Show today’s and future events
      return item.computedDate >= today;
    })
    .sort((a, b) => {
      const dateCompare = a.computedDate.getTime() - b.computedDate.getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
  };

  // Filtering function for search and categories
  const matchesSearchAndCategory = (item: ScheduleItem) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      item.title.toLowerCase().includes(q) || 
      item.host.toLowerCase().includes(q) || 
      (item.description && item.description.toLowerCase().includes(q));
    
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  };

  const upcomingTimeline = getTimelineSchedule().filter(matchesSearchAndCategory);

  // Grouped timeline items by date headers to render elegant daily bento boxes
  const groupTimelineByDate = () => {
    const groups: { [key: string]: ProcessedShowItem[] } = {};
    upcomingTimeline.forEach((item) => {
      const header = item.displayDayHeader;
      if (!groups[header]) {
        groups[header] = [];
      }
      groups[header].push(item);
    });
    return Object.keys(groups).map((header) => ({
      header,
      dateStr: groups[header][0].formattedCalendarDate,
      items: groups[header]
    }));
  };

  const groupedTimeline = groupTimelineByDate();

  // Filter items specifically for the selected weekday (with search / category included)
  const filteredWeeklySchedule = activeScheduleRaw.filter((item) => {
    const dayMatches = item.day.toLowerCase() === activeDay.toLowerCase();
    return dayMatches && matchesSearchAndCategory(item);
  });

  // Helper count badges
  const getDayShowCount = (day: string) => {
    return activeScheduleRaw.filter(item => {
      return item.day.toLowerCase() === day.toLowerCase() && matchesSearchAndCategory(item);
    }).length;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F8FAFC] to-[#FFFFFF] text-slate-800 pb-20">
      
      {/* 1. HERO HEADER INTRO */}
      <div className="bg-[#01225A] relative overflow-hidden text-white pt-16 pb-20 px-6 sm:px-8">
        {/* Background ambient accents */}
        <div className="absolute inset-x-0 top-0 h-full w-full pointer-events-none opacity-25">
          <div className="absolute -left-10 -top-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute right-10 bottom-0 w-80 h-80 bg-[#4283ED] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-[#93C5FD] uppercase tracking-wider border border-white/5 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#4283ED]" />
            Broadcasting Schedule
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white font-sans">
            What's Coming Up
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
            No rigid, static timetables here. Our broadcasts are fluid, organic, and dynamic. Search upcoming standalone specials, discover core recurring student loops, or view our live television calendar.
          </p>
        </div>
      </div>

      {/* 2. LIVE SEARCH & CMS SWITCH BOARD */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4.5 rounded-2xl border border-slate-100 shadow-lg mb-8">
          
          {/* SEARCH BAR */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search upcoming shows and hosts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-xs text-slate-800 rounded-xl pl-9 pr-4 py-2.5 border border-slate-200 focus:outline-[#0D449F]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200/50 hover:bg-slate-200 px-1.5 py-0.5 rounded-md cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* VIEW SWITCHER TABS: TIMELINE vs PLANNER */}
          <div className="md:col-span-6 flex bg-slate-50 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "upcoming"
                  ? "bg-[#01225A] text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Upcoming Timeline Feed
            </button>
            <button
              onClick={() => setActiveTab("weekly")}
              className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "weekly"
                  ? "bg-[#01225A] text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Weekly Planner Grid
            </button>
          </div>
        </div>

        {/* MAIN RESULTS SECTION BOX */}
        <div className="space-y-8">
          
          {/* CATEGORIES BUTTON BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="block text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">
                Programming Stream Genre
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["all", "news", "sports", "music", "entertainment", "other"].map((category) => {
                  const isActive = filterCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all capitalize cursor-pointer border ${
                        isActive
                          ? "bg-[#0D449F]/10 border-[#0D449F]/25 text-[#01225A]"
                          : "bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:border-slate-350"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CONTENT SECTION GRID */}
          <div>
            {isLoadingApi ? (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <Loader2 className="w-10 h-10 text-[#4283ED] animate-spin mb-4" />
                <h4 className="text-sm font-extrabold text-slate-800 animate-pulse">Synchronizing joint electronic stream</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                  Loading direct TV timetable grids from Nottingham student junctions...
                </p>
              </div>
            ) : activeTab === "upcoming" ? (
              
              /* ====== SECTION A: UPCOMING CHRONOLOGICAL FEED ====== */
              groupedTimeline.length > 0 ? (
                <div className="space-y-12">
                  {groupedTimeline.map((group, groupIdx) => (
                    <div key={group.header} className="space-y-5">
                      
                      {/* Day Header */}
                      <div className="flex items-center gap-3">
                        <h2 className="text-sm sm:text-base font-black text-[#01225A] flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#4283ED]" />
                          {group.header}
                        </h2>
                        <div className="h-px bg-slate-100 flex-1" />
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                          {group.dateStr}
                        </span>
                      </div>

                      {/* Shows inside this day */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.items.map((item, index) => {
                          const style = getCategoryStyles(item.category);
                          return (
                            <motion.div
                              layout
                              key={item.id}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.04 }}
                              className="group bg-white border border-slate-150 rounded-2xl p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                            >
                              {/* Left Border accent colored key */}
                              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.bullet}`} />

                              <div>
                                <div className="flex items-center justify-between gap-2 mb-3.5 pl-2">
                                  <span className="text-xs font-bold text-[#01225A] flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#4283ED]" />
                                    {item.startTime} - {item.endTime}
                                  </span>
                                  
                                  <div className="flex items-center gap-1.5">
                                    {item.isRecurring === false ? (
                                      <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono bg-amber-50 text-amber-800 border border-amber-200/50 uppercase tracking-wide">
                                        One-off Spec
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono bg-blue-50 text-blue-800 border border-blue-100/60 uppercase tracking-wide">
                                        Recurring Weekly
                                      </span>
                                    )}
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border ${style.bg} ${style.border}`}>
                                      {item.category}
                                    </span>
                                  </div>
                                </div>

                                <h3 className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-[#01225A] pl-2 line-clamp-1 transition-colors">
                                  {item.title}
                                </h3>

                                <p className="text-xs text-slate-500 pl-2 mt-2 leading-relaxed font-normal">
                                  {item.description || "No specific details reported for this custom live segment."}
                                </p>
                              </div>

                              <div className="border-t border-slate-100/80 pt-3.5 mt-5 pl-2 flex items-center justify-between">
                                <div>
                                  <span className="text-[9px] text-slate-400 block font-extrabold uppercase tracking-wider">
                                    Presented By
                                  </span>
                                  <span className="text-xs font-bold text-slate-700">
                                    {item.host}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 text-[10px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span className="font-semibold">Byron Studio</span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 px-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
                  <LayoutGrid className="w-12 h-12 text-slate-350 mx-auto mb-3.5" />
                  <h4 className="text-sm font-bold text-slate-800">No upcoming broadcasts found</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    Try adjusting your filters, clearing your search queries, or checking the weekly grid to inspect archived recurring slots.
                  </p>
                </div>
              )
            ) : (
              
              /* ====== SECTION B: WEEKLY PLANNER GRID ====== */
              <div className="space-y-8">
                {/* Visual day choosing row */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
                  {daysOfWeek.map((day) => {
                    const isActive = activeDay.toLowerCase() === day.toLowerCase();
                    const showCount = getDayShowCount(day);
                    const isSystemToday = day === currentDay;

                    return (
                      <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          isActive
                            ? "bg-[#01225A] text-white shadow-sm"
                            : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 border border-slate-200"
                        }`}
                      >
                        {day}
                        
                        {showCount > 0 && (
                          <span className={`inline-flex items-center justify-center text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                            isActive ? "bg-[#4283ED] text-white" : "bg-slate-250 text-slate-700"
                          }`}>
                            {showCount}
                          </span>
                        )}

                        {isSystemToday && (
                          <span className="absolute -top-1 -right-0.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Grid details listing */}
                {filteredWeeklySchedule.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWeeklySchedule.map((item, index) => {
                      const style = getCategoryStyles(item.category);
                      return (
                        <div
                          key={item.id}
                          className="group bg-white border border-slate-150 rounded-2xl p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                        >
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.bullet}`} />
                          
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3.5 pl-2">
                              <span className="text-xs font-bold text-[#01225A] flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#4283ED]" />
                                {item.startTime} - {item.endTime}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border ${style.bg} ${style.border}`}>
                                {item.category}
                              </span>
                            </div>

                            <div className="pl-2">
                              {item.isRecurring === false && item.date && (
                                <span className="block text-[8px] font-black font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-max mb-2">
                                  📅 Scheduled on {item.date}
                                </span>
                              )}
                              <h3 className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-[#01225A] line-clamp-1 transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-3.5 mt-5 pl-2 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] text-slate-400 block font-extrabold uppercase tracking-wider">
                                Presented By
                              </span>
                              <span className="text-xs font-bold text-slate-700">
                                {item.host}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] text-slate-650 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span className="font-semibold">Byron Studio</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 px-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-800">No scheduled events on {activeDay}</h4>
                    <p className="text-xs text-slate-405 mt-1 max-w-sm mx-auto leading-relaxed">
                      We don’t have any broadcasts matching your filters saved for <strong>{activeDay}</strong>. Try choosing another day above!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* 4. PUBLIC ENGAGEMENT CALL TO ACTION BANNER */}
        <div className="mt-12 bg-linear-to-r from-[#01225A] to-[#0D449F] rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl text-white">
          <div className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border-4 border-white"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-blue-200">
                <Sparkles className="w-3 h-3" /> Get Involved
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white">
                Want to host your own broadcast?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-normal">
                Whether you aspire to host news roundups, curate a weekly student music show, or run technical sound desks, Trent TV welcomes all Nottingham Trent students!
              </p>
            </div>

            <a
              href="https://join.trenttv.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-[#01225A] text-sm font-black rounded-full shadow-lg hover:shadow-xl transition-all self-start md:self-center cursor-pointer group"
            >
              Join Our Crew Today
              <ArrowRight className="w-4 h-4 text-[#4283ED] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
