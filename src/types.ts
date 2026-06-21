/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LiveStreamConfig {
  isEnabled: boolean;
  streamUrl: string; // YouTube/Twitch/Vimeo embed URL or custom HLS URL
  title: string;
  description: string;
  posterUrl: string; // When not streaming, show this poster image
  viewerCount?: number;
}

export interface ScheduleItem {
  id: string;
  title: string;
  host: string;
  startTime: string; // e.g. "12:00"
  endTime: string;   // e.g. "13:00"
  day: string;       // e.g. "Monday"
  description: string;
  category: "news" | "sports" | "entertainment" | "music" | "other";
  isRecurring?: boolean;
  date?: string; // YYYY-MM-DD
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeId: string; // Extract to load iframe
  description: string;
  duration: string;
  views: number;
  likes: number;
  publishedDate: string;
  category: string; // e.g. "News", "Factual Tour", "Sports Clash", "Music Showcase"
  featured?: boolean;
}

export interface CreatorMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AboutUsData {
  philosophy: string;
  studioLocation: string;
  studioEquipment: string[];
  team: CreatorMember[];
  faqs: FAQItem[];
}
