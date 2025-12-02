'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, Twitter, Mail, MapPin } from 'lucide-react';

const footerLinks = [
    { name: 'About', href: '#about' },
    { name: 'Legacy', href: '#purpose-legacy' },
    { name: 'Lineup', href: '#lineup' },
    { name: 'Tickets', href: '#tickets' },
    { name: 'Committee', href: '#committee' },
    { name: 'Contact', href: '#contact' }
];

const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/tantalizeofficial/' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' }
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-black pt-20 pb-10 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                                <Image
                                    src="/Tanata Logo.webp"
                                    alt="Tantalize Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="h-12 w-px bg-white/10" />
                            <div className="relative w-24 h-12 sm:w-32 sm:h-16">
                                <Image
                                    src="/APIIT logo white.webp"
                                    alt="APIIT Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                                TANTALIZE <span className="text-gold-500">2025</span>
                            </h2>
                            <p className="text-gray-400 max-w-md leading-relaxed">
                                Sri Lanka&apos;s Premier Cultural & Music Event. Experience the pinnacle of artistic expression and musical excellence.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:border-gold-500/50 hover:bg-gold-500/10 transition-all duration-300"
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Column */}
                    <div className="lg:col-span-3 lg:col-start-7">
                        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Navigation</h3>
                        <ul className="space-y-4">
                            {footerLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-gold-500 transition-colors inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500/50 scale-0 group-hover:scale-100 transition-transform duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="lg:col-span-3">
                        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Contact Us</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-gold-500" />
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-1">Location</p>
                                    <p className="text-gray-400 text-sm">APIIT City Campus,<br />Union Place, Colombo 02</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-gold-500" />
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-1">Email</p>
                                    <a href="mailto:info@tantalize.lk" className="text-gray-400 text-sm hover:text-gold-500 transition-colors">
                                        info@tantalize.lk
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-500">
                        <p>&copy; {currentYear} Tantalize. All rights reserved.</p>
                        <span className="hidden md:block text-gray-800">|</span>
                        <p className="flex items-center gap-1">
                            Developed by <a href="https://www.linkedin.com/in/dulain-munasinghe-533813320/" target="_blank" rel="noopener noreferrer" className="text-gold-500/80 hover:text-gold-500 transition-colors cursor-pointer">Dulain Munasinghe</a>
                        </p>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
