/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Download, FileText, BookOpen, Layers, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface EbookData {
  theme: string;
  title: string;
  description: string;
  coverSeed: string;
  fileSize: string;
  format: string;
  pages: number;
}

// --- Constants ---
const THEMES = [
  {
    name: 'Business',
    titles: ['The Modern Entrepreneur', 'Scaling Beyond Limits', 'Capital Mastery', 'The Art of the Deal 2.0'],
    descriptions: ['Learn the essential strategies for building a sustainable business in the digital age.', 'A comprehensive guide to modern management and venture capital.', 'Master the psychological aspects of negotiation and market dominance.']
  },
  {
    name: 'Crypto',
    titles: ['Blockchain Revolution', 'The Bitcoin Standard', 'DeFi Deep Dive', 'NFTs and the Future of Art'],
    descriptions: ['Understand the underlying technology that is reshaping the global financial system.', 'A deep dive into decentralized finance and the future of digital assets.', 'Everything you need to know about the crypto market and smart contracts.']
  },
  {
    name: 'Artificial Intelligence',
    titles: ['Neural Networks Simplified', 'The AI Advantage', 'Prompt Engineering Mastery', 'Generative Future'],
    descriptions: ['Demystifying complex AI concepts for the modern professional.', 'How to leverage machine learning to gain a competitive edge in any industry.', 'A practical guide to the tools and techniques of the AI revolution.']
  },
  {
    name: 'Marketing',
    titles: ['Growth Hacking Secrets', 'Digital Marketing 101', 'The Viral Formula', 'Brand Identity Design'],
    descriptions: ['Unconventional marketing strategies used by the world\'s fastest-growing startups.', 'Master the art of digital storytelling and customer acquisition.', 'Build a brand that resonates and stands the test of time.']
  },
  {
    name: 'Self Improvement',
    titles: ['The Power of Habit', 'Mindset Shift', 'Atomic Productivity', 'The Stoic Path'],
    descriptions: ['Transform your life by mastering the small actions that lead to big results.', 'Overcome mental blocks and unlock your full potential.', 'Practical wisdom for finding peace and purpose in a chaotic world.']
  }
];

const FORMATS = ['PDF', 'EPUB', 'ZIP'];

// --- Helper Functions ---
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function App() {
  const [ebook, setEbook] = useState<EbookData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    // Generate random ebook data on mount
    const themeObj = getRandomItem(THEMES);
    const ebookData: EbookData = {
      theme: themeObj.name,
      title: getRandomItem(themeObj.titles),
      description: getRandomItem(themeObj.descriptions),
      coverSeed: Math.random().toString(36).substring(7),
      fileSize: `${(Math.random() * (15 - 2) + 2).toFixed(1)} MB`,
      format: getRandomItem(FORMATS),
      pages: getRandomInRange(120, 450)
    };
    setEbook(ebookData);
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDownloadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Redirect to smartlink (placeholder)
          window.location.href = 'https://example.com/smartlink'; 
        }, 500);
      }
    }, 200); // Total ~2 seconds delay
  };

  if (!ebook) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <span>EbookVault</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-blue-600 transition-colors">Browse</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Categories</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          
          {/* Left Column: Cover */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-blue-100 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              <img 
                src={`https://picsum.photos/seed/${ebook.coverSeed}/800/1200`} 
                alt={ebook.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs font-bold uppercase tracking-widest mb-2 text-blue-400">{ebook.theme}</span>
                <h2 className="text-2xl font-bold leading-tight">{ebook.title}</h2>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                New Release
              </span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                {ebook.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                {ebook.description}
              </p>
            </div>

            {/* File Info Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Layers className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Format</span>
                </div>
                <p className="font-bold">{ebook.format}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Pages</span>
                </div>
                <p className="font-bold">{ebook.pages}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Download className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Size</span>
                </div>
                <p className="font-bold">{ebook.fileSize}</p>
              </div>
            </div>

            {/* Features List */}
            <ul className="space-y-3">
              {['Full access included', 'High-quality illustrations', 'Compatible with all devices'].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Download Button */}
            <div className="pt-4">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`
                  relative w-full md:w-auto px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300
                  ${isDownloading 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 shadow-lg shadow-blue-200'}
                `}
              >
                <AnimatePresence mode="wait">
                  {isDownloading ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Preparing Download... {downloadProgress}%
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-3"
                    >
                      Download Now
                      <Download className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <p className="mt-4 text-xs text-gray-400 text-center md:text-left">
                No registration required. Secure direct download.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-sm text-gray-400">© 2026 EbookVault. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-medium text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-600 transition-colors">DMCA</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
