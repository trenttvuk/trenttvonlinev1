/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LiveStreamConfig, ScheduleItem, VideoItem, AboutUsData } from "../types";

export const DEFAULT_LIVE_STREAM: LiveStreamConfig = {
  isEnabled: true,
  streamUrl: "https://www.youtube.com/embed/5qap5aO4i9A", // Elegant live-looking placeholder (Lo-fi / chill nature stream)
  title: "Trent TV: Freshers Week Live Broadcast",
  description: "Live from our City Campus Studio! Join the team as we tour the Boots Library, chat with the Trent SU President, and review the best club nights in Nottingham.",
  posterUrl: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=1200", // Broadcasting studio wallpaper
  viewerCount: 142,
};

export const DEFAULT_SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    id: "1",
    title: "Trent TV Breakfast Show",
    host: "Emma Watson & Jack Wright",
    startTime: "09:00",
    endTime: "10:30",
    day: "Monday",
    description: "Start your week at NTU with morning news, campus chatter, and weather reports across Clifton, city, and Brackenhurst campuses.",
    category: "news",
  },
  {
    id: "2",
    title: "Trent Sport Clash",
    host: "Danielle Cox",
    startTime: "13:00",
    endTime: "14:30",
    day: "Monday",
    description: "Highlights and reviews of our varsity sports teams. Checking in on NTU Rugby, Soccer, and Lacrosse matches.",
    category: "sports",
  },
  {
    id: "3",
    title: "The Clifton Session",
    host: "DJ Ollie",
    startTime: "16:00",
    endTime: "17:30",
    day: "Monday",
    description: "Live acoustic performances and interviews with promising bands gigging around Nottingham's student scene.",
    category: "music",
  },
  {
    id: "4",
    title: "Trent Talk TV",
    host: "Sarah Jenkins & Liam Cole",
    startTime: "10:00",
    endTime: "11:30",
    day: "Tuesday",
    description: "Deep dive interviews with NTU professors, student union executives, and local business owners on student life.",
    category: "news",
  },
  {
    id: "5",
    title: "Nottingham Night Out Guide",
    host: "Chloe Andrews",
    startTime: "19:00",
    endTime: "21:00",
    day: "Tuesday",
    description: "Your comprehensive guide to Nottingham's incredible student nightlife, live events, gigs, and drink deals.",
    category: "entertainment",
  },
  {
    id: "6",
    title: "Mid-Week Mashup",
    host: "Marcus Vance",
    startTime: "14:00",
    endTime: "15:30",
    day: "Wednesday",
    description: "Our weekly comedy-variety show featuring student sketch comedy, campus pranks, and trivia challenges.",
    category: "entertainment",
  },
  {
    id: "7",
    title: "NTU Varsity Hour",
    host: "Sam Peterson",
    startTime: "17:00",
    endTime: "18:30",
    day: "Wednesday",
    description: "The official broadcast covering the fierce rivalry athletic games between Trent and University of Nottingham.",
    category: "sports",
  },
  {
    id: "8",
    title: "Acoustic Hour",
    host: "Lois Bradley",
    startTime: "13:00",
    endTime: "14:30",
    day: "Thursday",
    description: "Raw, acoustic performances recorded live in our studio lounge with upcoming Nottingham singer-songwriters.",
    category: "music",
  },
  {
    id: "9",
    title: "Trent Gaming Zone",
    host: "Ethan Vance & Tom Parker",
    startTime: "17:00",
    endTime: "19:00",
    day: "Thursday",
    description: "Reviewing the latest game releases, esports news, and live co-op challenges with guests from the NTU Gaming Society.",
    category: "entertainment",
  },
  {
    id: "10",
    title: "Trent Film Show",
    host: "Jessica Taylor",
    startTime: "15:00",
    endTime: "16:30",
    day: "Friday",
    description: "Film reviews, industry gossip, student short-films showcase, and previews of what is hot at Royal Concert Hall/Cineworld.",
    category: "entertainment",
  },
  {
    id: "11",
    title: "The Weekend Buzz",
    host: "Callum Fletcher & Mia Rose",
    startTime: "18:00",
    endTime: "20:00",
    day: "Friday",
    description: "Your official launch to the weekend: pop cultural rundowns, local gig guides, and chaotic studio games.",
    category: "entertainment",
  },
];

export const DEFAULT_YOUTUBE_VIDEOS: VideoItem[] = [
  {
    id: "yt-1",
    title: "Nottingham Trent University: Campus Tour & City Life Vlog",
    youtubeId: "R-v_UjMyxU8", // General campus vlog tour placeholder
    description: "Looking for a complete tour of Nottingham Trent University? Our student hosts take you through City Campus, Newton Building, Boots Library, and local student pubs.",
    duration: "12:14",
    views: 4521,
    likes: 312,
    publishedDate: "2026-04-12",
    category: "Documentary",
    featured: true,
  },
  {
    id: "yt-2",
    title: "NTU vs UoN: Ultimate Varsity Hockey Highlights",
    youtubeId: "L9YVv0O7kM4", // Sports clip placeholder
    description: "The legendary Nottingham Varsity series returns! Trent TV sports team covers the dramatic penalty shooutout clash on the ice.",
    duration: "08:45",
    views: 2890,
    likes: 184,
    publishedDate: "2026-03-29",
    category: "Sports",
    featured: false,
  },
  {
    id: "yt-3",
    title: "Trent SU President Interview: Housing Crisis & Tuition",
    youtubeId: "3mG6p_s65_E", // Interview review placeholder
    description: "Trent TV News anchor Emma Watson sits down with the newly elected Student Union president to discuss key issues affecting Clifton and Byron student residences.",
    duration: "15:30",
    views: 1205,
    likes: 92,
    publishedDate: "2026-05-18",
    category: "News",
    featured: true,
  },
  {
    id: "yt-4",
    title: "Acoustic Sessions: 'Neon Roads' Live at City Studio",
    youtubeId: "vBqgWh9Gwt8", // Music show placeholder
    description: "Nottingham's rising indie-rock trio Neon Roads performs their unreleased track 'Neon Roads' live in the Trent TV acoustic lounge.",
    duration: "04:12",
    views: 945,
    likes: 112,
    publishedDate: "2026-05-22",
    category: "Music",
    featured: false,
  },
  {
    id: "yt-5",
    title: "Trent Drama Showcase: 'Subway Thoughts' Short Film",
    youtubeId: "8gYl7D9G-vY", // Drama showcase placeholder
    description: "An award-winning screenplay written and produced completely by NTU Creative Writing and Film Production students.",
    duration: "10:15",
    views: 1622,
    likes: 143,
    publishedDate: "2026-02-15",
    category: "Entertainment",
    featured: false,
  },
  {
    id: "yt-6",
    title: "Freshers Survival Guide: Nottingham Hacks",
    youtubeId: "FayPZsk8qK8", // Student guide
    description: "The ultimate survival handbook for freshers arriving at NTU. From getting free bus passes to the cheapest grocery runs and best study booths.",
    duration: "07:50",
    views: 4508,
    likes: 388,
    publishedDate: "2025-09-10",
    category: "Lifestyle",
    featured: false,
  },
  {
    id: "yt-7",
    title: "A Day in the Life at Brackenhurst Campus (NTU)",
    youtubeId: "U3sObyA8Wtw", // Vet and animal campus
    description: "Taking you to the gorgeous countryside Brackenhurst Campus of NTU. Exploring animal units, horse rings, and environmental labs.",
    duration: "11:20",
    views: 1890,
    likes: 154,
    publishedDate: "2026-01-18",
    category: "Documentary",
    featured: false,
  },
];

export const DEFAULT_ABOUT_DATA: AboutUsData = {
  philosophy: "Trent TV is Nottingham Trent University's award-winning student television station. Founded in 1999, we provide high-quality, entertaining, and informative video content that directly represents the NTU student body. Run entirely by volunteers, we are a training ground for the next generation of broadcast journalists, sound engineers, content producers, and presenters. In partnership with the Student Union (Trent SU) and NTU Media, we strive for creative journalism, sports coverage, and exceptional entertainment.",
  studioLocation: "Student Media Suite, Level 2, Trent Student Union (City Campus), Shakespeare St, Nottingham NG1 4GH, United Kingdom",
  studioEquipment: [
    "Sony FS7 & FX30 Broadcast-Ready Cine Cameras",
    "Ritz-Carlton Acoustics podcast microphones (Shure SM7B)",
    "Blackmagic ATEM Mini Extreme Live Switching Control Panel",
    "Sennheiser G4 Wireless Lavalier Mics",
    "Dimmable Aputure Amaran LED Studio Light Arrays",
    "Professional Vocal Isolation Broadcast Booth",
    "Dual Mac Studio Editing Suites running Premiere Pro & DaVinci Resolve",
  ],
  team: [
    {
      id: "team-1",
      name: "Jack Harrison",
      role: "Station Manager & Executive Producer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      bio: "Jack is a 3rd Year Broadcast Journalism student who oversees daily programming, sets general broadcast vision, and coordinates student union liaison. Over his time at Trent TV, he has spearheaded our award-winning multi-site live broadcast network and leads our strategic partnerships with global broadcasters, providing invaluable professional gateways for our local student volunteers.",
    },
    {
      id: "team-2",
      name: "Eleanor Vance",
      role: "Head of News & Factual",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      bio: "Eleanor manages campus bulletins, political debates, and investigative features. She has completed internships with BBC East Midlands and ITV Central, bringing high-end newsroom workflow standards and journalistic integrity to our student broadcasters. Under her direction, our factual division has won a record three NaSTA awards for Best News and Current Affairs coverage.",
    },
    {
      id: "team-3",
      name: "Marcus Thorne",
      role: "Technical Coordinator & Chief Sound Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      bio: "A final year Sound Engineering student. Marcus designs our live broadcasting setups, ensures state-of-the-art audio quality, and hosts hardware workshops. He maintains our Byron Building broadcast suite, manages our digital mixing consoles, and mentors students in multicamera live switching, preparing them for careers in broadcasting engineering.",
    },
  ],
  faqs: [
    {
      question: "Do I need any prior film or audio experience to join Trent TV?",
      answer: "Absolutely not! We welcome students from all degrees and backgrounds. We run training sessions for camera operation, editing, live sound, writing, and presenting over the first term.",
    },
    {
      question: "Where is Trent TV studio, and how can I visit?",
      answer: "We are located in the Student Media Suite (Level 2 of the Trent Student Union Byron Building, City Campus). Drop us a visit during our open hours on Wednesdays or email weare@trenttv.co.uk.",
    },
    {
      question: "Can I host my own custom show?",
      answer: "Yes! Every semester we open proposals for new series. Whether it's a specialty music showcase, comedy sketch, gaming stream, or political review, we will provide the equipment and help coordinate crews.",
    },
    {
      question: "How do I sign up to join the volunteer roster?",
      answer: "Simply purchase our student society membership through the Trent SU website ($5 for the full academic year) and click the 'Join Roster' in our About Us page to receive Slack invites and shift lists.",
    },
  ],
};

export const PRESET_POSTER_IMAGES = [
  {
    name: "Broadcast Studio",
    url: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "NTU Campus Lawn",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "On Air Lighting",
    url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "Student DJ Console",
    url: "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&q=80&w=1200",
  },
];
