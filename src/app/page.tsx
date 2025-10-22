'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { QrCode, ArrowDown, Volume2, VolumeX } from 'lucide-react';
import MissionVisionSection from './components/vision/MissionVisionSection';
import LegacyTimeline from './components/history/LegacyTimeline';
import ScrollMarkers from './components/common/ScrollMarkers';
import ParallaxSection from './components/common/ParallaxSection';
import HeroParticles from './components/common/HeroParticles';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeTeam, setActiveTeam] = useState<'entertainment' | 'logistics' | 'media' | 'marketing'>('entertainment');
  const videoRef = useRef<HTMLVideoElement>(null);

  const leadershipMembers = [
    {
      name: "Lenucy Ranasinghe",
      role: "Chairperson",
      initials: "LR",
      quote: "",
      accent: "from-yellow-300 via-amber-400 to-orange-500",
      highlight: "Executive Lead",
    },
    {
      name: "Thisal Piumka",
      role: "Co-Chairperson",
      initials: "TP",
      quote: "",
      accent: "from-gold-400 via-yellow-300 to-amber-500",
      highlight: "Executive Co-Lead",
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
      emoji: '📢',
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
  ];

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

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 px-6 py-3"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="/Tanata Logo.png"
              alt="Tantalize logo"
              className="w-20 h-20 object-contain"
            />
            <span className="text-gold-500 text-xl font-light">/</span>
            <img
              src="/APIIT-Logo-White.png"
              alt="APIIT logo"
              className="object-contain"
              style={{ height: '154px' }}
            />
          </motion.div>

          {/* Hamburger Menu Button */}
          <motion.button
            className="relative w-10 h-10 flex items-center justify-center group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative w-6 h-5 flex flex-col justify-between">
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
          <div className="flex items-center justify-center min-h-screen px-6">
            <motion.div
              className="w-full max-w-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Menu Items */}
              <nav className="space-y-6">
                {['About', 'Lineup', 'Schedule', 'Committee', 'Sponsors', 'Contact'].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-4xl md:text-6xl font-bold text-white hover:text-gold-500 transition-all duration-300 text-center group"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                    onClick={() => setIsMenuOpen(false)}
                    whileHover={{ scale: 1.05, x: 10 }}
                  >
                    <span className="inline-block group-hover:text-glow">
                      {item}
                    </span>
                  </motion.a>
                ))}
              </nav>

              {/* Register CTA in Menu */}
              <motion.div
                className="mt-12 text-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <motion.a
                  href="https://bio.site/tantalizeofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium text-lg px-10 py-4 inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register Now
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
          className="fixed bottom-8 right-8 z-30 glass p-4 rounded-full border border-gold-500/30 hover:border-gold-500 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-gold-500" />
          ) : (
            <Volume2 className="w-6 h-6 text-gold-500" />
          )}
        </motion.button>
        
        {/* Reactive hero particles */}
        {mounted && (<HeroParticles offset={mousePosition} />)}

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.35 }}
          >
            {/* Main Title with 3D Tilt */}
            <motion.div
              className="mb-6 flex justify-center items-center perspective-1000"
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
              <img
                src="/TantaText.png"
                alt="TANTALIZE 15"
                className="w-full max-w-4xl h-auto object-contain mx-auto"
                style={{
                  filter: 'drop-shadow(0 10px 30px rgba(255, 215, 0, 0.3))',
                  transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
                }}
              />
            </motion.div>

            {/* CTA Button (3D glow + ripple) */}
            <motion.div
              className="flex justify-center items-center mt-8 sm:mt-12"
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            >
              <motion.a
                href="https://bio.site/tantalizeofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d text-base sm:text-lg md:text-xl"
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
                Register Now
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 text-gold-500" />
        </motion.div>
      </section>

      {/* Legacy hero merged into LegacyTimeline */}

      <section id="purpose-legacy" className="relative isolate">
        <div className="section-bg-cinematic" />
        <div className="section-blend-gold" aria-hidden />
        <ParallaxSection strength={12} className="relative z-10">
          <MissionVisionSection />
        </ParallaxSection>
        <ParallaxSection strength={8} className="relative z-10">
          <LegacyTimeline />
        </ParallaxSection>
      </section>

      {/* Committee Section */}
      <motion.section
        id="committee"
        className="relative overflow-hidden py-24 px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="relative max-w-7xl mx-auto space-y-20">
          <motion.div
            className="text-center space-y-5"
            
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.35 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.6em] text-gray-500"
            >
              Committee 2025
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 50, skewY: 6 }} whileInView={{ opacity: 1, y: 0, skewY: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
              className="font-display text-4xl md:text-6xl font-semibold text-white/95 tracking-[0.08em] md:tracking-[0.12em] leading-tight drop-shadow-[0_12px_28px_rgba(10,14,39,0.45)]"
            >
              Meet the Team Behind the Stage
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="text-lg text-gray-300 max-w-3xl mx-auto"
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
              viewport={{ once: false, amount: 0.3 }}
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
                  className="font-display text-3xl md:text-4xl font-semibold text-white/95 tracking-[0.08em] mt-3 drop-shadow-[0_8px_20px_rgba(10,14,39,0.45)]"
                >
                  Guiding the Experience
                </motion.h3>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                className="text-gray-400 max-w-xl"
              >
                The command centre steering Tantalize with strategy, precision, and a flair for unforgettable moments.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              {leadershipMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="group relative overflow-hidden rounded-3xl border border-white/8 bg-primary-950/65 p-10 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/30"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <div className="relative flex h-full flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-lg font-semibold text-white">
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-gray-400">{member.role}</p>
                        <h4 className="mt-2 text-2xl font-semibold text-white">{member.name}</h4>
                      </div>
                    </div>

                    <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-gray-500">
                      <span className="block h-[2px] w-8 rounded-full bg-gold-500/70" />
                      {member.highlight}
                    </p>

                    <p className="mt-auto text-sm leading-relaxed text-gray-300">
                      {member.quote}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Executive Committee */}
          <div className="space-y-12">
            <motion.div
              className="text-center space-y-3"
              
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                className="text-xs uppercase tracking-[0.5em] text-gold-500"
              >
                Executive Committee
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: 50, skewY: 6 }} whileInView={{ opacity: 1, y: 0, skewY: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
                className="font-display text-3xl md:text-4xl font-semibold text-white/95 tracking-[0.08em] drop-shadow-[0_8px_20px_rgba(10,14,39,0.45)]"
              >
                The Operational Powerhouse
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                className="text-gray-400 max-w-2xl mx-auto"
              >
                Strategic leads keeping every pillar synchronized, funded, and ready for showtime.
              </motion.p>
            </motion.div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {executiveMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="group relative h-full overflow-hidden rounded-3xl border border-white/8 bg-primary-950/60 p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/30"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.1 }}
                  viewport={{ once: false, amount: 0.25 }}
                >
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <div className="relative flex h-full flex-col gap-6">
                    <div className="flex items-start gap-4">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/5 text-3xl">
                        <span>{member.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-semibold text-white">{member.name}</h4>
                        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.35em] text-gray-400">{member.role}</p>
                      </div>
                    </div>

                    <p className="flex-1 text-sm leading-relaxed text-gray-300">{member.description}</p>

                    <div className="flex items-center justify-between gap-3 text-[0.62rem] uppercase tracking-[0.35em] text-gray-500">
                      <span>{member.focus}</span>
                      <span className="h-px flex-1 bg-gradient-to-r from-gold-500/40 via-transparent to-transparent" />
                      <span className="inline-flex h-2 w-2 rounded-full bg-gold-500/80" />
                    </div>
                  </div>
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
              viewport={{ once: false, amount: 0.3 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                className="text-xs uppercase tracking-[0.5em] text-gold-500"
              >
                Teams
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: 50, skewY: 6 }} whileInView={{ opacity: 1, y: 0, skewY: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
                className="font-display text-3xl md:text-4xl font-semibold text-white/95 tracking-[0.08em] drop-shadow-[0_8px_20px_rgba(10,14,39,0.45)]"
              >
                Where the Magic Gets Crafted
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                className="text-gray-400 max-w-3xl mx-auto"
              >
                Explore each crew and the talent driving Sri Lanka&apos;s most anticipated student night.
              </motion.p>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 relative">
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
                viewport={{ once: false, amount: 0.3 }}
              >
                <motion.div
                  className="relative rounded-3xl border border-white/8 bg-primary-950/60 p-8 md:p-12"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  viewport={{ once: false, amount: 0.35 }}
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

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {activeTeamData.members.map((member, index) => (
                        <motion.div
                          key={member.name}
                          className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:border-gold-500/30 hover:bg-white/8"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, delay: index * 0.08 }}
                          viewport={{ once: false, amount: 0.3 }}
                        >
                          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">{member.role}</p>
                          <p className="mt-3 text-lg font-semibold text-white">{member.name}</p>
                          <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-500">
                            <span className="block h-[2px] w-5 rounded-full bg-gold-500/60" />
                            {member.initials}
                          </div>
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

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gold-500 mb-6">
              About Tantalize
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Tantalize has established itself as one of Sri Lanka&apos;s premier cultural and music events, 
              attracting thousands of attendees and prominent sponsors. Experience the pinnacle of 
              entertainment in 2025.
            </p>
          </motion.div>

          {/* QR Code Section */}
          <motion.div
            className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 rounded-3xl p-12 text-center border border-gold-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <QrCode className="w-24 h-24 text-gold-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Get Your Tickets</h3>
            <p className="text-lg text-gray-300 mb-8">
              Scan the QR code with your Pickme app to purchase tickets and secure your spot 
              at Sri Lanka&apos;s most anticipated cultural event.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gold-500">General Admission</p>
                <p className="text-white">Rs. 2,500</p>
                <p className="text-sm text-gray-400">3,000 tickets available</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gold-500">VIP Experience</p>
                <p className="text-white">Rs. 5,000</p>
                <p className="text-sm text-gray-400">300 tickets available</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lineup Section */}
      <section id="lineup" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-sm uppercase tracking-[0.45em] text-gold-500/80 mb-4">🎤 The Stage is Set</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              TANTALIZE 2025 <span className="text-gold-500">Artist Lineup</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The island&apos;s finest artists bringing the heat to stage
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Bathiya & Santhush", genre: "Legends", icon: "🎸" },
              { name: "Wasthi", genre: "Vocals", icon: "🎤" },
              { name: "Hana", genre: "Rhythms", icon: "🎵" },
              { name: "Iraj", genre: "Hip-Hop", icon: "🎧" },
              { name: "Dhanith Sri", genre: "Melodies", icon: "🎹" },
              { name: "Raveen", genre: "Beats", icon: "🥁" },
              { name: "Dinesh & Kaizer", genre: "Duo Power", icon: "⚡" },
              { name: "KK", genre: "Energy", icon: "🔥" },
              { name: "Daddy", genre: "Vibes", icon: "🎺" },
              { name: "Infinity", genre: "Limitless", icon: "♾️" }
            ].map((artist, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-primary-950/60 p-8 text-center backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-[0_20px_60px_-15px_rgba(255,215,0,0.4)]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold-500/30 bg-gradient-to-br from-gold-500/20 to-gold-600/10 text-5xl shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(255,215,0,0.4)]">
                    {artist.icon}
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white">{artist.name}</h3>
                  <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2">
                    <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse"></span>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">{artist.genre}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.5em] text-gold-500/90">
              TANTALIZE 2025 – Official Event Schedule
            </p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white">
              A Journey From First Note To Finale
            </h2>
            <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </motion.div>

          {/* Premium vertical stepper timeline */}
          <div className="relative">
            {/* Spine */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold-500/40 via-gold-500/20 to-transparent" />

            {(
              [
                {
                  icon: '🎶',
                  title: 'Acoustic Night',
                  lines: [
                    'Purpose: Opening event of the Tantalize 2025 series.',
                    'Focus: Calm, soulful performances highlighting vocal and acoustic talent.',
                    'Participants: Musicians from APIIT and guest artists.',
                    'Vibe: Intimate, low-key setting to introduce the season.',
                  ],
                },
                {
                  icon: '💫',
                  title: 'Auditions',
                  lines: [
                    'Description: The beginning of the competition.',
                    'Participants: University students from across Sri Lanka.',
                    'Categories: Singing, Dancing, Band Performances, and more.',
                    'Outcome: Selection of finalists for the main event.',
                  ],
                },
                {
                  icon: '🎭',
                  title: 'Workshops',
                  lines: [
                    'Purpose: Skill-building sessions for selected finalists.',
                    'Trainers: Industry professionals (vocal coaches, choreographers, etc.).',
                    'Focus Areas: Stage presence, confidence, performance refinement.',
                  ],
                },
                {
                  icon: '📰',
                  title: 'Press Conference',
                  lines: [
                    'Timing: Held before the Grand Finale.',
                    'Purpose: Media engagement and event publicity.',
                    'Participants: Organizers, sponsors, judges, and finalists.',
                    'Outcome: Builds hype and sponsor visibility before the main night.',
                  ],
                },
                {
                  icon: '🌟',
                  title: 'Grand Finale',
                  lines: [
                    'Venue: Nelum Pokuna Outdoor Arena',
                    'Audience: Over 2,000 attendees expected.',
                    'Highlights: Top finalists, guest performances, celebrity judges.',
                    'Experience: The biggest and most anticipated youth cultural event of 2025.',
                  ],
                  cta: 'Get Tickets',
                },
              ] as Array<{ icon: string; title: string; lines: string[]; cta?: string }>
            ).map((step, index) => (
              <motion.div
                key={step.title}
                className={`relative mb-10 flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                viewport={{ once: true }}
              >
                {/* Card */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'pr-6 md:pr-10' : 'pl-6 md:pl-10'}`}>
                  <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/40">
                    {/* Accent line */}
                    <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-xl">
                        <span>{step.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold text-white">{step.title}</h3>
                        <ul className="mt-3 space-y-1.5 text-gray-300 text-sm leading-relaxed">
                          {step.lines.map((l) => (
                            <li key={l}>{l}</li>
                          ))}
                        </ul>
                        {step.cta && (
                          <div className="mt-5">
                            <a
                              href="#tickets"
                              className="inline-flex items-center justify-center rounded-full border border-gold-500/50 bg-gold-500/10 px-5 py-2 text-sm font-semibold text-gold-400 transition-colors hover:bg-gold-500/20"
                            >
                              {step.cta}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node */}
                <div className="absolute left-1/2 -translate-x-1/2 grid place-items-center">
                  <div className="h-4 w-4 rounded-full bg-gold-500 ring-4 ring-[#0A0E27]" />
                </div>

                {/* Spacer */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gold-500 mb-6">
              Our Sponsors
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Proudly supported by leading brands and organizations
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              "APIIT Colombo",
              "Pickme Events",
              "Premium Partner",
              "Gold Sponsor",
              "Silver Sponsor",
              "Media Partner",
              "Food Partner",
              "Tech Partner"
            ].map((sponsor, index) => (
              <motion.div
                key={index}
                className="glass rounded-xl p-8 text-center group hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-gold-500/20 to-gold-600/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gold-500 font-bold text-lg">
                    {sponsor.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">{sponsor}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll Markers (progress dots) */}
      <ScrollMarkers />

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gold-500 mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Have questions about Tantalize 2025? We&apos;d love to hear from you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary-950 font-bold text-xl">E</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                <p className="text-gray-300">info@tantalize2025.com</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary-950 font-bold text-xl">P</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
                <p className="text-gray-300">+94 11 234 5678</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary-950 font-bold text-xl">L</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
                <p className="text-gray-300">APIIT Colombo</p>
              </div>
            </div>

            <motion.div
              className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 rounded-3xl p-8 border border-gold-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience Tantalize 2025?</h3>
              <p className="text-gray-300 mb-6">
                Don&apos;t miss out on Sri Lanka&apos;s most anticipated cultural and music event.
              </p>
              <motion.button
                className="btn-premium text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Your Tickets Now
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gold-500/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img
              src="/Tanata Logo.png"
              alt="Tantalize logo"
              className="w-24 h-24 object-contain"
            />
            <span className="text-gold-500 text-2xl font-light">/</span>
            <img
              src="/APIIT-Logo-White.png"
              alt="APIIT logo"
              className="object-contain"
              style={{ height: '205px' }}
            />
          </div>
          <h3 className="text-2xl font-bold text-gold-500 mb-2">TANTALIZE 2025</h3>
          <p className="text-gray-400 mb-6">
            Sri Lanka&apos;s Premier Cultural & Music Event
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">YouTube</a>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 Tantalize. All rights reserved. | Powered by APIIT Colombo
          </p>
        </div>
      </footer>
    </div>
  );
}
