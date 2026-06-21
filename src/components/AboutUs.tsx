import React, { useState } from "react";
import { AboutUsData } from "../types";
import { Info, MapPin, Users, Heart, Award, ArrowUpRight, HelpCircle, ChevronDown, Star, Sliders, ExternalLink, Sparkles } from "lucide-react";

interface AboutUsProps {
  data: AboutUsData;
}

export default function AboutUs({ data }: AboutUsProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* 1. HERO BLOCK */}
      <div className="bg-[#01225A] relative overflow-hidden text-white pt-16 pb-20 px-6 sm:px-8">
        {/* Background ambient accents */}
        <div className="absolute inset-x-0 top-0 h-full w-full pointer-events-none opacity-25">
          <div className="absolute -left-10 -top-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute right-10 bottom-0 w-80 h-80 bg-[#4283ED] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white font-sans animate-fade-in">
            What is Trent TV?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
            We are the official television voice of NTU students. Broadcasting campus life, varsity sports, debates, society and sports club showcases, and local Nottingham music highlights.
          </p>
        </div>
      </div>

      {/* 2. CORE PHILOSOPHY & ABOUT GRID */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Main narrative philosophy */}
          <div className="lg:col-span-7 bg-white border border-slate-105 rounded-3xl p-8 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <span className="text-[11px] font-medium text-slate-400 block">
                Our story
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-955">
                Putting NTU on TV
              </h2>
              <p className="text-slate-550 text-xs sm:text-sm leading-relaxed">
                {data.philosophy}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6 mt-8">
              <div>
                <span className="block text-xl font-bold text-slate-950">2004</span>
                <span className="text-[10px] text-slate-400">Year Founded</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-[#01225A]">50+</span>
                <span className="text-[10px] text-slate-400">Active Crew</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-[#01225A]">7x</span>
                <span className="text-[10px] text-slate-400">NaSTA Awards</span>
              </div>
            </div>
          </div>

          {/* Quick Studio specs Card */}
          <div className="lg:col-span-5 bg-white border border-slate-105 rounded-3xl p-8 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-400">
                  NTSU Media Hub
                </span>
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-800">Studio Address:</strong><br />
                {data.studioLocation}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-900 mb-2">
                  Broadcast Equipment
                </h4>
                <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 leading-normal">
                  {data.studioEquipment.slice(0, 5).map((eq, idx) => (
                    <li key={idx}><strong className="text-slate-705 font-medium">{eq.split('(')[0]}</strong> {eq.includes('(') ? `(${eq.split('(')[1]}` : ''}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* 3. EXECUTIVE COMMITTEE SECTIONS */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10 pb-8 border-b border-slate-100">
            <div className="lg:col-span-6 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#01225A]">
                Introducing our Committee
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Trent TV is self-governed by student leaders elected annually. This three-person executive panel administers all broadcasts, productions, organises member events and coordinates station compliance with Nottingham Trent Students' Union.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.team.slice(0, 3).map((member) => (
              <div 
                key={member.id}
                className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mb-5 bg-slate-100 ring-4 ring-[#0D449F]/5">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-905">{member.name}</h3>
                  <p className="text-[11px] text-[#0D449F] mb-3.5 font-bold uppercase tracking-wider">
                    {member.role}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. VOLUNTEER SIGN-UP SECT & FAQS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-6">
          
          {/* NTSU PORTAL DIRECTION CARD */}
          <div className="lg:col-span-5 bg-linear-to-b from-[#01225A] to-[#011B47] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#0A3375]">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[9px] font-bold text-blue-300 uppercase tracking-widest mb-3">
              <Sparkles className="w-3 h-3 text-blue-300" /> Official Society Registration
            </span>
            <h3 className="text-lg font-black tracking-tight text-white mb-2 leading-tight">
              Join Trent TV via Nottingham Trent Students' Union
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              As an officially affiliated student society of Nottingham Trent University, we do not accept standalone roster registrations or custom applications on this platform.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-3 mb-6">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                💼 How to become a member:
              </h4>
              <ul className="text-[11px] text-slate-300 space-y-2 list-none pl-0 leading-normal">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>Head over to our official Students' Union page at trentstudents.org.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>Add the Trent TV Society membership to your cart.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>Once purchased, your student ID is enrolled automatically and you will be added to the Trent TV WhatsApp community</span>
                </li>
              </ul>
            </div>

            <a
              href="https://join.trenttv.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#4283ED] hover:bg-[#3273DD] text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Go to NTSU Website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* FAQS COLUMN */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-4">
            <div className="flex items-center gap-1.5 mb-2">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold tracking-tight text-slate-950">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-2">
              {data.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-white border border-slate-105 rounded-2xl overflow-hidden shadow-xs transition-all animate-duration-150"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4.5 text-left flex items-center justify-between gap-4 text-xs font-bold hover:bg-slate-50 text-slate-900 cursor-pointer"
                    >
                      <span className="leading-tight">{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${isOpen ? "transform rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="p-4.5 pt-0 text-xs text-slate-550 leading-relaxed border-t border-slate-100 bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
