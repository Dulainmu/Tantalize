'use client';

import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ArrowDown, Volume2, VolumeX, Play } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const LegacyTimeline = dynamic(() => import('./components/history/LegacyTimeline'), {
  loading: () => <div className="text-center text-gold-400">Loading...</div>
});
const ScrollMarkers = dynamic(() => import('./components/common/ScrollMarkers'));
const HeroParticles = dynamic(() => import('./components/common/HeroParticles'));
const ThreeDAbout = dynamic(() => import('./components/about/ThreeDAbout'), {
  loading: () => <div className="h-screen w-full bg-primary-950" />
});
const SocialsSection = dynamic(() => import('./components/socials/SocialsSection'));
const ScheduleTimeline = dynamic(() => import('./components/schedule/ScheduleTimeline'));
const Footer = dynamic(() => import('./components/layout/Footer'));

const getAvatarUrl = (name: string) =>
  `https://api.dicebear.com/7.x/adventurer-neutral/svg?radius=50&backgroundColor=0a0e27,1a1f3a&seed=${encodeURIComponent(
    name,
  )}`;

type CommitteePortraitProps = {
  name: string;
  role: string;
  image?: string;
  imageSizes?: string;
  wrapperClassName?: string;
  isLarge?: boolean;
  cardSize?: 'xlarge' | 'large' | 'medium' | 'small';
};

const CommitteePortrait = ({
  name,
  role,
  image,
  imageSizes = '400px',
  wrapperClassName = '',
  isLarge = false,
  cardSize = 'medium',
}: CommitteePortraitProps) => {

  // Size scales for mobile - all cards in 2-column grid, differentiated by scale
  const mobileScales = {
    xlarge: 'scale-95', // Chair/Co-Chair - slightly smaller
    large: 'scale-90', // Project Coordinators - smaller
    medium: 'scale-[0.85]', // Executive Committee - even smaller
    small: 'scale-100', // Team members - full size
  };
  const [showInfo, setShowInfo] = useState(false);

  return (
    <motion.div
      className={`relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-gray-900 w-full sm:scale-100 ${mobileScales[cardSize]} ${wrapperClassName}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      onViewportEnter={() => setShowInfo(true)}
      onViewportLeave={() => setShowInfo(false)}
      viewport={{ once: false, amount: 0.5, margin: "-10%" }}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Member Image */}
      <div className="absolute inset-0">
        <Image
          src={image || getAvatarUrl(name)}
          alt={name}
          fill
          sizes={imageSizes}
          className="object-cover transition-all duration-500 ease-out"
          loading="lazy"
          quality={90}
        />
      </div>

      {/* Dark Overlay when info is shown */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity duration-500"
        style={{ opacity: showInfo ? 1 : 0 }}
      />

      {/* Name & Role Overlay - Shows when card is in viewport */}
      <motion.div
        className={`absolute inset-0 flex flex-col items-center justify-center ${isLarge ? 'p-4 sm:p-6 md:p-8' : 'p-3 sm:p-4 md:p-6'} text-center pointer-events-none`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: showInfo ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Member Name */}
        <motion.h4
          className={`font-bold text-white mb-2 sm:mb-3 ${isLarge ? 'text-xl sm:text-2xl md:text-3xl' : 'text-base sm:text-lg md:text-xl lg:text-2xl'}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: showInfo ? 0 : 20,
            opacity: showInfo ? 1 : 0
          }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {name}
        </motion.h4>

        {/* Role/Position */}
        <motion.p
          className={`uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-300 font-medium ${isLarge ? 'text-xs sm:text-sm' : 'text-[0.65rem] sm:text-xs'}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: showInfo ? 0 : 20,
            opacity: showInfo ? 1 : 0
          }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {role}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeTeam, setActiveTeam] = useState<'entertainment' | 'logistics' | 'media' | 'marketing'>('logistics');
  const [hoveredArtist, setHoveredArtist] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});

  // Navbar Scroll Logic
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const leadershipMembers = [
    {
      name: "Lenucy Ranasinghe",
      role: "Chairperson",
      initials: "LR",
      quote: "",
      accent: "from-yellow-300 via-amber-400 to-orange-500",
      highlight: "Executive Lead",
      image: "/Committee/Lenucy.webp",
    },
    {
      name: "Thisal Piumka",
      role: "Co-Chairperson",
      initials: "TP",
      quote: "",
      accent: "from-gold-400 via-yellow-300 to-amber-500",
      highlight: "Executive Co-Lead",
      image: "/Committee/Thisal.webp",
    },
    {
      name: "Methuli Perera",
      role: "Project Coordinator",
      initials: "MP",
      quote: "",
      accent: "from-sky-400 via-blue-500 to-indigo-500",
      highlight: "Coordination",
    },
    {
      name: "Azeem Fazeel",
      role: "Project Coordinator",
      initials: "AF",
      quote: "",
      accent: "from-teal-400 via-emerald-400 to-cyan-500",
      highlight: "Coordination",
    },
  ];

  const executiveMembers = [
    {
      name: "Senilka Wickramathilake",
      role: "Secretary",
      icon: "📜",
      description: "Keeps every decision documented, every deadline visible, and every meeting purposeful.",
      focus: "Process Excellence",
    },
    {
      name: "Thirosh Varatharajan",
      role: "Assistant Secretary",
      icon: "🗂️",
      description: "Co-pilots committee communication and ensures information flows to the right teams.",
      focus: "Communication Flow",
    },
    {
      name: "Muaadh Mazloom",
      role: "Treasurer",
      icon: "💰",
      description: "Manages sponsorships, budgets, and the golden numbers that keep Tantalize premium.",
      focus: "Financial Strategy",
    },
    {
      name: "Rifkhan Faris",
      role: "Assistant Treasurer",
      icon: "📊",
      description: "Tracks spend, reconciles vendors, and keeps the finance desk audit-ready.",
      focus: "Budget Control",
    },
  ];

  const teamTabs = [
    {
      id: 'logistics' as const,
      emoji: '📦',
      name: 'Logistics',
      gradient: 'from-blue-500 via-indigo-500 to-sky-500',
      ring: 'border-blue-400/40',
      headline: 'Masterminding the behind-the-scenes flow from setup to pack-down.',
      description: 'They coordinate venue layouts, vendor timelines, and the heartbeat of every moving part.',
      members: [
        { name: 'Nishen Anthony', role: 'Head of Logistics', initials: 'NA' },
        { name: 'Hifaz Hizni', role: 'Deputy Head of Logistics', initials: 'HH' },
        { name: 'Himansa Indusara', role: 'Committee Member', initials: 'HI' },
        { name: 'Aadhil Shiraz', role: 'Committee Member', initials: 'AS' },
        { name: 'Dulain Munasinghe', role: 'Committee Member', initials: 'DM' },
        { name: 'Haroon Shamil', role: 'Committee Member', initials: 'HS' },
        { name: 'Rizwan Aaquib', role: 'Committee Member', initials: 'RA' },
        { name: 'Steve Austin', role: 'Committee Member', initials: 'SA' },
        { name: 'Mandil Nanayakkara', role: 'Committee Member', initials: 'MN' },
      ],
    },
    {
      id: 'media' as const,
      emoji: '📸',
      name: 'Media',
      gradient: 'from-purple-500 via-fuchsia-500 to-violet-500',
      ring: 'border-purple-400/40',
      headline: 'Capturing and amplifying the Tantalize story across every channel.',
      description: 'Content planners, shooters, and editors who keep the buzz alive before, during, and after the show.',
      members: [
        { name: 'Gajaanie Nandakumar', role: 'Head of Media', initials: 'GN' },
        { name: 'Azeezah Sheriff', role: 'Deputy Head of Media', initials: 'AS' },
        { name: 'Sanaya Gamage', role: 'Committee Member', initials: 'SG' },
        { name: 'Apsari Udawatte', role: 'Committee Member', initials: 'AU' },
        { name: 'Diandra Perera', role: 'Committee Member', initials: 'DP' },
        { name: 'Hesalni Danthanarayana', role: 'Committee Member', initials: 'HD' },
        { name: 'Savishkar Thiruchelvam', role: 'Committee Member', initials: 'ST' },
      ],
    },
    {
      id: 'marketing' as const,
      emoji: '',
      name: 'Marketing',
      gradient: 'from-orange-500 via-amber-400 to-yellow-400',
      ring: 'border-amber-400/40',
      headline: 'Building partnerships, hype, and the premium aura of Tantalize.',
      description: 'They nurture sponsors, craft campaigns, and turn audiences into fans who keep coming back.',
      members: [
        { name: 'Ayodya Perera', role: 'Head of Marketing', initials: 'AP' },
        { name: 'Ishra Ammon', role: 'Deputy Head of Marketing', initials: 'IA' },
        { name: 'Suhanya Peiris', role: 'Committee Member', initials: 'SP' },
        { name: 'Thanumi Bandara', role: 'Committee Member', initials: 'TB' },
        { name: 'Snegha Chandraseghar', role: 'Committee Member', initials: 'SC' },
        { name: 'Yazid Niyas', role: 'Committee Member', initials: 'YN' },
        { name: 'Thevnaka De Silva', role: 'Committee Member', initials: 'TDS' },
        { name: 'Tharushika Gamage', role: 'Committee Member', initials: 'TG' },
        { name: 'Diseni Dharmadasa', role: 'Committee Member', initials: 'DD' },
        { name: 'Kithmi Mallikarachchi', role: 'Committee Member', initials: 'KM' },
        { name: 'Denam Pathmanathan', role: 'Committee Member', initials: 'DP' },
        { name: 'Sachini Samarawickrama', role: 'Committee Member', initials: 'SS' },
      ],
    },
    {
      id: 'entertainment' as const,
      emoji: '🎭',
      name: 'Entertainment',
      gradient: 'from-pink-500 via-rose-400 to-red-400',
      ring: 'border-rose-400/40',
      headline: 'Crafting unforgettable performances and immersive audience moments.',
      description: 'From auditions to encore planning, this crew curates the show flow and keeps the stage electrifying.',
      members: [
        { name: 'Raqiub Isfan', role: 'Head of Entertainment', initials: 'RI' },
        { name: 'Imad Nazar', role: 'Deputy Head of Entertainment', initials: 'IN' },
        { name: 'Ashok Ainkaran', role: 'Committee Member', initials: 'AA' },
        { name: 'Malisha Jayasuriya', role: 'Committee Member', initials: 'MJ' },
        { name: 'Uthkarsha Premaratne', role: 'Committee Member', initials: 'UP' },
        { name: 'Avithran Sridharan', role: 'Committee Member', initials: 'AS' },
        { name: 'Ranidi Dahamya', role: 'Committee Member', initials: 'RD' },
        { name: 'Thimansa Tennakoon', role: 'Committee Member', initials: 'TT' },
      ],
    },
  ];

  const leadershipPrimary = leadershipMembers.slice(0, 2);
  const leadershipCoordinators = leadershipMembers.slice(2);
  const activeTeamData = teamTabs.find((team) => team.id === activeTeam) ?? teamTabs[0];

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Toggle video sound
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle artist hover - play audio
  const handleArtistHover = (index: number) => {
    setHoveredArtist(index);
    const audio = audioRefs.current[index];
    if (audio) {
      audio.volume = 0.7; // Set volume to 70%
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Audio autoplay prevented. User interaction may be required:', err);
        });
      }
    }
  };

  // Handle artist leave - stop audio
  const handleArtistLeave = (index: number) => {
    setHoveredArtist(null);
    const audio = audioRefs.current[index];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-2 sm:py-3"
        initial={{ y: -100 }}
        animate={{ y: hidden ? "-100%" : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-2 sm:space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/Tanata Logo.webp"
              alt="Tantalize logo"
              width={80}
              height={80}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
            />
            <span className="text-gold-500 text-base sm:text-xl font-light">/</span>
            <Image
              src="/APIIT logo white.webp"
              alt="APIIT logo"
              width={64}
              height={64}
              className="object-contain h-8 sm:h-12 md:h-16 w-auto"
            />
          </motion.div>

          {/* Hamburger Menu Button */}
          <motion.button
            className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative w-6 h-5 sm:w-7 sm:h-6 flex flex-col justify-between">
              <motion.span
                className="w-full h-0.5 bg-gold-500 rounded-full origin-center"
                animate={isMenuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-full h-0.5 bg-gold-500 rounded-full"
                animate={isMenuOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-full h-0.5 bg-gold-500 rounded-full origin-center"
                animate={isMenuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Full-Screen Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-primary-950/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-center min-h-screen px-4 sm:px-6">
            <motion.div
              className="w-full max-w-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Menu Items */}
              <nav className="space-y-4 sm:space-y-6">
                {[
                  { label: 'About', href: 'about' },
                  { label: 'Purpose & Legacy', href: 'purpose-legacy' },
                  { label: 'Artist Lineup', href: 'lineup' },
                  { label: 'Tickets', href: 'tickets' },
                  { label: 'Committee', href: 'committee' },
                  { label: 'Schedule', href: 'schedule' },
                  { label: 'Sponsors', href: 'sponsors' },
                  { label: 'Contact', href: 'contact' }
                ].map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={`#${item.href}`}
                    className="block text-3xl sm:text-4xl md:text-6xl font-bold text-white hover:text-gold-500 transition-all duration-300 text-center group"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                    onClick={() => setIsMenuOpen(false)}
                    whileHover={{ scale: 1.05, x: 10 }}
                  >
                    <span className="inline-block group-hover:text-glow">
                      {item.label}
                    </span>
                  </motion.a>
                ))}
              </nav>

              {/* Register CTA in Menu */}
              <motion.div
                className="mt-8 sm:mt-12 text-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <motion.a
                  href="https://tickets.tantalize.lk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Your Tickets Now
                </motion.a>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="mt-12 flex justify-center space-x-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-400 hover:text-gold-500 transition-colors text-sm"
                  >
                    {social}
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}


      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="hero-video-container">
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster="/hero-poster.webp"
            preload="none"
            onError={(e) => {
              // Fallback to gradient background if video fails to load
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="/background-video.mp4" type="video/mp4" />
          </video>
          {/* Uniform overlay to remove any radial fade */}
          <div className="hero-overlay" />
        </div>

        {/* Video Sound Toggle */}
        <motion.button
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-30 glass p-3 sm:p-4 rounded-full border border-gold-500/30 hover:border-gold-500 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-gold-500" />
          ) : (
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-gold-500" />
          )}
        </motion.button>

        {/* Reactive hero particles */}
        {mounted && (<HeroParticles offset={mousePosition} />)}

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 max-w-6xl mx-auto">
          <motion.div

            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.35 }}
          >
            {/* Main Title with 3D Tilt */}
            <motion.div
              className="mb-4 sm:mb-6 flex justify-center items-center perspective-1000"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                rotateY: 5,
                rotateX: -5,
                scale: 1.02
              }}
              transition={{ duration: 0.3 }}
              style={{
                perspective: "1000px",
                transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
              }}
            >
              <Image
                src="/TantaText.webp"
                alt="TANTALIZE 15"
                width={800}
                height={300}
                className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl h-auto object-contain mx-auto"
                style={{
                  filter: 'drop-shadow(0 10px 30px rgba(255, 215, 0, 0.3))',
                  transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
                }}
              />
            </motion.div>

            {/* CTA Button (3D glow + ripple) */}
            <motion.div
              className="flex justify-center items-center mt-6 sm:mt-8 md:mt-12 mb-24 sm:mb-12 md:mb-0"
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            >
              <motion.a
                href="https://tickets.tantalize.lk"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-8 md:px-10"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                onMouseMove={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  const rect = el.getBoundingClientRect();
                  const mx = e.clientX - rect.left;
                  const my = e.clientY - rect.top;
                  el.style.setProperty('--mx', `${mx}px`);
                  el.style.setProperty('--my', `${my}px`);
                }}
              >
                <span className="btn-glow" aria-hidden />
                <span className="btn-shine" aria-hidden />
                <span className="btn-ripple" aria-hidden />
                Get Your Tickets Now
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <a href="#about" className="block">
            <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-gold-500 hover:text-gold-400 transition-colors cursor-pointer" />
          </a>
        </motion.div>
      </section>

      {/* Legacy hero merged into LegacyTimeline */}

      {/* 3D About Section */}
      <ThreeDAbout />

      {/* Legacy hero merged into LegacyTimeline */}

      <LegacyTimeline />



      {/* Lineup Section - Premium 3D */}
      <section id="lineup" className="relative py-32 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-[#1a1232] to-[#0a0e27]" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] delay-1000" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Header with Spotlight Effect */}
          <motion.div
            className="text-center mb-20 relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-gold-500 to-transparent" />
            </motion.div>

            <motion.p
              className="text-sm uppercase tracking-[0.5em] text-gold-500/90 mb-4 flex items-center justify-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block w-12 h-px bg-gradient-to-r from-transparent to-gold-500" />
              🎤 The Stage is Set
              <span className="inline-block w-12 h-px bg-gradient-to-l from-transparent to-gold-500" />
            </motion.p>

            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="relative inline-block">
                TANTALIZE 2025
                <motion.span
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600">
                Artist Lineup
              </span>
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The island&apos;s finest artists bringing the heat to stage
            </motion.p>
          </motion.div>

          {/* Premium 3D Artist Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {[
              { name: "Bathiya & Santhush", genre: "Legends", icon: "🎸", color: "from-amber-500 to-orange-600", image: "/BnS.webp", audio: "/BnS.mp3" },
              { name: "Wasthi", genre: "Vocals", icon: "🎤", color: "from-pink-500 to-rose-600", image: "/wasthi.webp", audio: "/wasthi.mp3" },
              { name: "Hana", genre: "Rhythms", icon: "🎵", color: "from-blue-500 to-cyan-600", image: "/Hana.webp", audio: "/Hana.mp3" },
              { name: "Iraj", genre: "Hip-Hop", icon: "🎧", color: "from-purple-500 to-indigo-600", image: "/Iraj.webp", audio: "/Iraj.mp3" },
              { name: "Dhanith Sri", genre: "Melodies", icon: "🎹", color: "from-green-500 to-emerald-600", image: "/Dhanith Sri.webp", audio: "/Dhanith Sri.mp3" },
              { name: "Raveen", genre: "Beats", icon: "🥁", color: "from-red-500 to-pink-600", image: "/Raveen.webp", audio: "/Raveen.mp3" },
              { name: "Yaka Crew", genre: "Collective", icon: "👥", color: "from-slate-500 to-zinc-600", image: "/Yaka Crew.webp", audio: "/Yaka Crew.mp3" },
              { name: "KK", genre: "Energy", icon: "🔥", color: "from-orange-500 to-red-600", image: "/KK.webp", audio: "/KK.mp3" },
              { name: "Dilo", genre: "Vibes", icon: "🎺", color: "from-teal-500 to-cyan-600", image: "/Dilo.webp", audio: "/Dilo.mp3" },
              { name: "Chanuka Mora", genre: "Soul", icon: "✨", color: "from-indigo-500 to-violet-600", image: "/Chanuka Mora.webp", audio: "/Chanuka Mora.mp3" },
              { name: "Infinity", genre: "Limitless", icon: "♾️", color: "from-violet-500 to-purple-600", image: "/Infinity.webp", audio: "/Infinity.mp3" }
            ].map((artist, index) => (
              <motion.div
                key={index}
                className="artist-card-wrapper h-full"
                initial={{ opacity: 0, y: 100, rotateX: 45 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                style={{ perspective: "1000px" }}
                onMouseEnter={() => artist.audio && handleArtistHover(index)}
                onMouseLeave={() => artist.audio && handleArtistLeave(index)}
              >
                {/* Hidden audio element */}
                {artist.audio && (
                  <audio
                    ref={(el) => {
                      if (el) {
                        audioRefs.current[index] = el;
                      }
                    }}
                    src={artist.audio}
                    preload="none"
                    playsInline
                  />
                )}

                <motion.div
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1f3a]/80 via-[#0f1229]/90 to-[#1a1232]/80 p-6 sm:p-8 text-center backdrop-blur-xl h-full flex flex-col justify-between"
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: 5,
                    z: 50
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                  }}
                >
                  {/* Artist Image Overlay - Appears on Hover */}
                  {artist.image && (
                    <motion.div
                      className="absolute inset-0 z-20 rounded-3xl overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredArtist === index ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover"
                        quality={75}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                      {/* Audio indicator */}
                      <motion.div
                        className="absolute top-6 right-6 flex items-center gap-2 bg-gold-500/20 backdrop-blur-md rounded-full px-4 py-2 border border-gold-500/40"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Play className="w-4 h-4 text-gold-400" fill="currentColor" />
                        </motion.div>
                        <span className="text-xs font-bold text-gold-300 uppercase tracking-wider">Now Playing</span>
                      </motion.div>

                      {/* Sound Wave Visualization on Image Overlay */}
                      <motion.div
                        className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-1.5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`w-1.5 rounded-full bg-gradient-to-t ${artist.color} shadow-lg`}
                            animate={{
                              height: [12, 28, 12],
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.1,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Holographic Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 via-transparent to-purple-500/20" />
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.1) 50%, transparent 70%)",
                        backgroundSize: "200% 200%"
                      }}
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </div>

                  {/* Particle Effect Container */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${artist.color} opacity-0 group-hover:opacity-100`}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [-20, -60],
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </div>

                  {/* Glow Border on Hover */}
                  <motion.div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${artist.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                  />

                  {/* Content */}
                  <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                    {/* 3D Icon/Image Container */}
                    <motion.div
                      className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full"
                      style={{ transformStyle: "preserve-3d" }}
                      whileHover={{
                        rotateY: 180,
                        rotateZ: 360
                      }}
                      transition={{
                        duration: 0.8,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      {/* 3D Layered Circles */}
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${artist.color} opacity-20 blur-2xl group-hover:opacity-40 transition-all duration-500 group-hover:scale-150`}
                        style={{ transform: "translateZ(-20px)" }}
                      />
                      <div
                        className="absolute inset-2 rounded-full border-2 border-gold-500/30 bg-gradient-to-br from-gold-500/10 to-transparent"
                        style={{ transform: "translateZ(-10px)" }}
                      />
                      <motion.div
                        className={`relative flex h-full w-full items-center justify-center rounded-full border-2 border-gold-500/50 ${artist.image ? 'bg-black/40' : `bg-gradient-to-br ${artist.color}`} text-6xl shadow-[0_0_40px_rgba(255,215,0,0.3)] overflow-hidden`}
                        style={{ transform: "translateZ(20px)" }}
                        animate={{
                          boxShadow: [
                            "0 0 40px rgba(255,215,0,0.3)",
                            "0 0 60px rgba(255,215,0,0.5)",
                            "0 0 40px rgba(255,215,0,0.3)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {artist.image ? (
                          <Image
                            src={artist.image}
                            alt={artist.name}
                            fill
                            className="object-cover"
                            quality={75}
                            sizes="(max-width: 768px) 128px, 128px"
                            loading="lazy"
                          />
                        ) : (
                          artist.icon
                        )}
                      </motion.div>
                    </motion.div>

                    {/* Artist Name with 3D Effect */}
                    <motion.h3
                      className="mb-4 text-3xl font-bold text-white relative"
                      style={{
                        transformStyle: "preserve-3d",
                        textShadow: "0 0 20px rgba(255,215,0,0.3)"
                      }}
                      whileHover={{
                        scale: 1.05,
                        textShadow: "0 0 30px rgba(255,215,0,0.6)"
                      }}
                    >
                      {artist.name}
                    </motion.h3>

                    {/* Genre Tag with Magnetic Effect */}
                    <motion.div
                      className={`inline-flex items-center gap-3 rounded-full border border-gold-500/40 bg-gradient-to-r ${artist.color} bg-opacity-20 px-6 py-3 backdrop-blur-sm`}
                      whileHover={{
                        scale: 1.1,
                        borderColor: "rgba(255,215,0,0.8)"
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Animated Pulse Dot */}
                      <span className="relative flex h-3 w-3">
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full bg-gradient-to-r ${artist.color} opacity-75`}></span>
                        <span className={`relative inline-flex h-3 w-3 rounded-full bg-gradient-to-r ${artist.color}`}></span>
                      </span>
                      <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold-300">
                        {artist.genre}
                      </p>
                    </motion.div>

                    {/* Sound Wave Visualization */}
                    <motion.div
                      className="mt-6 flex justify-center gap-1 h-6 items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`w-1 rounded-full bg-gradient-to-t ${artist.color}`}
                          animate={{
                            height: [12, 24, 12],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="group relative overflow-hidden rounded-full border-2 border-gold-500/50 bg-gradient-to-r from-gold-500/10 to-gold-600/10 px-12 py-4 text-lg font-bold uppercase tracking-[0.2em] text-white backdrop-blur-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-600 opacity-0 group-hover:opacity-20"
                initial={false}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="relative z-10">More Artists Coming Soon</span>
            </motion.button>
          </motion.div>
        </div>
      </section>
      {/* Ticket Section */}
      <section id="tickets" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 rounded-3xl p-12 text-center border border-gold-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 flex justify-center">
              <span className="text-6xl">🎟️</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Get Your Tickets</h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Secure your spot at Sri Lanka&apos;s most anticipated cultural event.
              Don&apos;t miss out on an unforgettable night!
            </p>

            <div className="mb-8">
              <a
                href="https://tickets.tantalize.lk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3 text-sm font-bold uppercase tracking-widest text-black transition-transform duration-300 hover:scale-105 hover:bg-gold-400"
              >
                Buy Tickets Online
              </a>
            </div>
            <div className="flex flex-wrap gap-6 sm:gap-10 justify-center items-center">
              <div className="text-center scale-110 transform relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-black uppercase tracking-wider">
                  Selling Fast
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gold-500">Early Bird</p>
                <p className="text-white text-xl sm:text-2xl font-bold">Rs. 2,000</p>
              </div>
              <div className="text-center opacity-60">
                <p className="text-xl sm:text-2xl font-bold text-gold-500/80">Standard</p>
                <p className="text-white text-lg sm:text-xl">Rs. 2,500</p>
              </div>
              <div className="text-center opacity-60">
                <p className="text-xl sm:text-2xl font-bold text-gold-500/80">At The Gate</p>
                <p className="text-white text-lg sm:text-xl">Rs. 3,500</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Committee Section */}
      <motion.section
        id="committee"
        className="relative overflow-visible py-12 sm:py-16 md:py-20 px-4 sm:px-6 min-h-screen"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.05, margin: "0px 0px -100px 0px" }}
      >
        <div className="relative max-w-7xl mx-auto space-y-12 sm:space-y-16 md:space-y-20">
          <motion.div
            className="text-center space-y-5"

            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.6em] text-gray-500"
            >
              Committee 2025
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 50, skewY: 6 }} whileInView={{ opacity: 1, y: 0, skewY: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white/95 tracking-[0.08em] md:tracking-[0.12em] leading-tight drop-shadow-[0_12px_28px_rgba(10,14,39,0.45)] px-4"
            >
              Meet the Team Behind the Stage
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto px-4"
            >
              A collective of visionaries, planners, and creators orchestrating Sri Lanka&apos;s premier student show night.
            </motion.p>
          </motion.div>

          {/* Leadership Spotlight */}
          <div className="space-y-10">
            <motion.div
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"

              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
            >
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                  className="text-xs uppercase tracking-[0.5em] text-gold-500"
                >
                  Leadership
                </motion.p>
                <motion.h3
                  initial={{ opacity: 0, y: 50, skewY: 6 }} whileInView={{ opacity: 1, y: 0, skewY: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
                  className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-white/95 tracking-[0.08em] mt-3 drop-shadow-[0_8px_20px_rgba(10,14,39,0.45)]"
                >
                  Guiding the Experience
                </motion.h3>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                className="text-sm sm:text-base text-gray-400 max-w-xl"
              >
                The command centre steering Tantalize with strategy, precision, and a flair for unforgettable moments.
              </motion.p>
            </motion.div>

            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.1 }}
            >
              {/* Primary Leadership - Larger cards */}
              <div className="grid grid-cols-2 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto px-4">
                {leadershipPrimary.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: false, amount: 0.1 }}
                  >
                    <CommitteePortrait
                      name={member.name}
                      role={member.role}
                      image={member.image}
                      imageSizes="(max-width: 640px) 100vw, 600px"
                      isLarge={true}
                      cardSize="xlarge"
                    />
                  </motion.div>
                ))}
              </div>
              {/* Coordinators - Regular size */}
              <div className="flex justify-center px-4">
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 max-w-2xl w-full">
                  {leadershipCoordinators.map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: false, amount: 0.1 }}
                    >
                      <CommitteePortrait
                        name={member.name}
                        role={member.role}
                        imageSizes="(max-width: 640px) 100vw, 400px"
                        isLarge={false}
                        cardSize="large"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Executive Committee */}
          <div className="space-y-12">
            <motion.div
              className="text-center space-y-3"

              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                className="text-xs uppercase tracking-[0.5em] text-gold-500"
              >
                Executive Committee
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: 50, skewY: 6 }} whileInView={{ opacity: 1, y: 0, skewY: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
                className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-white/95 tracking-[0.08em] drop-shadow-[0_8px_20px_rgba(10,14,39,0.45)] px-4"
              >
                The Operational Powerhouse
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4"
              >
                Strategic leads keeping every pillar synchronized, funded, and ready for showtime.
              </motion.p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
              {executiveMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: false, amount: 0.1 }}
                >
                  <CommitteePortrait
                    name={member.name}
                    role={member.role}
                    imageSizes="400px"
                    isLarge={false}
                    cardSize="medium"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Teams */}
          <div className="space-y-12">
            <motion.div
              className="text-center space-y-3"

              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                className="text-xs uppercase tracking-[0.5em] text-gold-500"
              >
                Teams
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: 50, skewY: 6 }} whileInView={{ opacity: 1, y: 0, skewY: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
                className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-white/95 tracking-[0.08em] drop-shadow-[0_8px_20px_rgba(10,14,39,0.45)] px-4"
              >
                Where the Magic Gets Crafted
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                className="text-sm sm:text-base text-gray-400 max-w-3xl mx-auto px-4"
              >
                Explore each crew and the talent driving Sri Lanka&apos;s most anticipated student night.
              </motion.p>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 relative px-4">
              {teamTabs.map((team) => {
                const isActive = team.id === activeTeam;
                return (
                  <motion.button
                    key={team.id}
                    type="button"
                    onClick={() => setActiveTeam(team.id)}
                    className={`relative group px-6 py-3 md:px-8 md:py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-3 text-sm md:text-base font-semibold uppercase tracking-[0.25em] transition-all duration-300 ${isActive ? 'tab-active bg-white/10 shadow-[0_18px_40px_rgba(255,215,0,0.15)]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-xl md:text-2xl">{team.emoji}</span>
                    <span>{team.name}</span>
                    <span className="tab-indicator" />
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTeamData.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.05 }}
              >
                <motion.div
                  className="relative rounded-3xl border border-white/8 bg-primary-950/60 p-6 sm:p-8 md:p-12"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  viewport={{ once: false, amount: 0.05 }}
                >
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-gray-500">
                        <span className="block h-[2px] w-8 rounded-full bg-gold-500/70" />
                        {activeTeamData.name} Team
                      </div>
                      <div>
                        <div className="flex items-center gap-3 text-3xl md:text-4xl font-semibold text-white">
                          <span className="text-4xl">{activeTeamData.emoji}</span>
                          <h4>{activeTeamData.name}</h4>
                        </div>
                        <p className="mt-4 text-base text-gray-300 md:text-lg">{activeTeamData.headline}</p>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-400">{activeTeamData.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-[0.65rem] uppercase tracking-[0.3em] text-gray-500">
                        <span className="inline-flex items-center gap-2">
                          <span className="block h-[2px] w-6 rounded-full bg-gold-500/70" />
                          {activeTeamData.members.length} Members
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <span className="block h-[2px] w-6 rounded-full bg-blue-400/60" />
                          {activeTeamData.emoji} Focus
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
                      {activeTeamData.members.map((member, index) => (
                        <motion.div
                          key={member.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          viewport={{ once: false, amount: 0.05 }}
                        >
                          <CommitteePortrait
                            name={member.name}
                            role={member.role}
                            imageSizes="(max-width: 640px) 50vw, 400px"
                            cardSize="small"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Schedule Section */}
      <ScheduleTimeline />

      <SocialsSection />

      {/* Sponsors Section */}
      <section id="sponsors" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gold-500 mb-4 sm:mb-6">
              Our Sponsors
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Proudly supported by leading brands and organizations
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative px-8 py-4 bg-black rounded-lg leading-none flex items-center">
                <span className="text-gold-500 text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase">
                  Coming Soon
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scroll Markers (progress dots) */}
      <ScrollMarkers />



      {/* Footer */}
      <Footer />

    </div >
  );
}
