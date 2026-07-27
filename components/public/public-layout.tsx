"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio/wedding", label: "Portfolio" },
  { href: "/films", label: "Films" },
  { href: "/about", label: "About" },
  { href: "/editorial", label: "Editorial" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://www.instagram.com/arniphotographyy/", icon: "IG", label: "Instagram" },
  { href: "https://www.facebook.com/Arunikitha/", icon: "FB", label: "Facebook" },
  { href: "https://www.youtube.com/channel/UC4HWnC-vrF6Hq9urwDnnARA", icon: "YT", label: "YouTube" },
];

export default function PublicLayoutClient({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "glass-strong py-3 shadow-2xl shadow-black/20"
            : "bg-transparent py-6"
        }`}
      >
        {/* Top accent line */}
        <div
          className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent transition-opacity duration-700 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative group">
            <Image
              src="/images/logos/logo-header.png"
              alt="Arni Photography"
              width={160}
              height={40}
              className={`h-7 sm:h-8 w-auto transition-all duration-500 ${
                scrolled ? "h-6 sm:h-7" : ""
              }`}
              priority
            />
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-500 group-hover:w-full" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-[11px] tracking-[0.2em] text-cream/70 hover:text-cream transition-colors duration-300 uppercase group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-3/4" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-muted hover:text-gold transition-all duration-300 font-semibold tracking-wider"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            <div className="w-[1px] h-4 bg-border" />

            <Link
              href="/contact"
              className="btn-cinema px-6 py-2.5 border border-gold/30 text-gold text-[11px] rounded-full hover:bg-gold/10 hover:border-gold/50 transition-all duration-300 tracking-[0.15em] uppercase"
            >
              Get In Touch
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col gap-[5px] p-2 group"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-[1.5px] bg-cream transition-all duration-300 origin-center ${
                mobileMenuOpen ? "rotate-45 translate-y-[6.5px]" : ""
              }`}
            />
            <span
              className={`w-4 h-[1.5px] bg-gold transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0 scale-0" : "group-hover:w-6"
              }`}
            />
            <span
              className={`w-6 h-[1.5px] bg-cream transition-all duration-300 origin-center ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:hidden overflow-hidden"
            >
              <div className="glass-strong border-t border-border/30 mx-4 mt-3 rounded-2xl">
                <nav className="flex flex-col p-6 gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-sm text-cream/70 hover:text-gold transition-all duration-300 uppercase tracking-[0.15em] py-3 border-b border-border/20 last:border-0 group"
                      >
                        <span className="w-1.5 h-[1.5px] bg-gold/40 transition-all duration-300 group-hover:w-4 group-hover:bg-gold" />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
                    className="mt-4"
                  >
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center px-6 py-3.5 border border-gold/30 text-gold rounded-full hover:bg-gold/10 transition-all duration-300 text-sm tracking-[0.15em] uppercase"
                    >
                      Get In Touch
                    </Link>
                  </motion.div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/about/02.webp"
            alt=""
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/95 to-bg" />
        </div>

        {/* Top separator */}
        <div className="relative line-separator" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-10">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Image
                src="/images/logos/logo-footer.png"
                alt="Arni Photography"
                width={180}
                height={45}
                className="h-9 w-auto mb-6"
              />
              <p className="text-muted text-sm leading-relaxed max-w-sm mb-8">
                Capturing timeless moments through the art of photography and cinematic
                videography. Every frame tells your unique story.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 glass rounded-full flex items-center justify-center text-[10px] text-muted hover:text-gold hover:border-gold/30 transition-all duration-300 font-bold tracking-wider"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-gold text-[11px] font-bold tracking-[0.2em] uppercase mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-cream transition-colors duration-300 gold-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-gold text-[11px] font-bold tracking-[0.2em] uppercase mb-6">
                Contact
              </h4>
              <div className="space-y-4 text-sm text-muted">
                <a
                  href="tel:+918008948977"
                  className="flex items-start gap-3 hover:text-cream transition-colors duration-300 group"
                >
                  <span className="text-gold mt-0.5 text-xs">&#9742;</span>
                  <span>+91 8008948977</span>
                </a>
                <a
                  href="mailto:Arniconglomerate@gmail.com"
                  className="flex items-start gap-3 hover:text-cream transition-colors duration-300 group"
                >
                  <span className="text-gold mt-0.5 text-xs">&#9993;</span>
                  <span>Arniconglomerate@gmail.com</span>
                </a>
                <div className="flex items-start gap-3">
                  <span className="text-gold mt-0.5 text-xs">&#9873;</span>
                  <span className="leading-relaxed">
                    1st floor 106, 107, 107A right commercial space,
                    <br />
                    Dutt Island, above Apollo Pharmacy,
                    <br />
                    Siripuram, Visakhapatnam-530003
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="line-separator mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted/60 tracking-wider">
              &copy; {new Date().getFullYear()} Arni Photography. All rights reserved.
            </p>
            <p className="text-xs text-muted/40 tracking-wider font-heading italic">
              &ldquo;Every frame tells a story&rdquo;
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
