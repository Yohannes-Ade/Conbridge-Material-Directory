import React from "react";
import { motion } from "motion/react";

interface AnimatedPremiumEmojiProps {
  name: string;
  className?: string;
  size?: number;
}

export default function AnimatedPremiumEmoji({
  name,
  className = "",
  size = 24,
}: AnimatedPremiumEmojiProps) {
  // Common spring & loop animation models mimicking Telegram Premium Lottie stickers
  const floatTransition = {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  };

  const spinTransition = {
    duration: 6,
    repeat: Infinity,
    ease: "linear",
  };

  const pulseTransition = {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  };

  // Define high-fidelity modern SVGs for each category that render premium 3D/ambient look
  switch (name) {
    case "Cement":
    case "Hollow Blocks":
      // 3D-like multi-tiered structural blocks with golden neon contours
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.15, rotate: 3 }}
        >
          <defs>
            <linearGradient id="blockGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="blockGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          {/* Base shadow */}
          <ellipse cx="32" cy="56" rx="20" ry="4" fill="black" opacity="0.15" />
          {/* Bottom Block */}
          <motion.path
            d="M12 36 L32 46 L52 36 L32 26 Z"
            fill="url(#blockGrad1)"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
            animate={{ y: [0, -2, 0] }}
            transition={floatTransition}
          />
          {/* Top Block */}
          <motion.path
            d="M20 20 L32 26 L44 20 L32 14 Z"
            fill="url(#blockGrad2)"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
            animate={{ y: [0, -4, 0] }}
            transition={{ ...floatTransition, delay: 0.3 }}
          />
          {/* Connecting pillars to represent structural materials */}
          <motion.line
            x1="32"
            y1="26"
            x2="32"
            y2="36"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ scaleY: [1, 1.08, 1] }}
            transition={floatTransition}
          />
        </motion.svg>
      );

    case "Rebar/Steel":
      // Double interlocking high-glistening neon steel girders
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.2, rotate: -5 }}
        >
          <defs>
            <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="rebarGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>
          {/* Dynamic rotating ambient lighting beam behind the rebar */}
          <motion.circle
            cx="32"
            cy="32"
            r="18"
            stroke="url(#rebarGlow)"
            strokeWidth="1"
            strokeDasharray="4,4"
            animate={{ rotate: 360 }}
            transition={spinTransition}
          />
          {/* Bar 1 */}
          <motion.rect
            x="16"
            y="26"
            width="32"
            height="8"
            rx="2"
            transform="rotate(-25 32 30)"
            fill="url(#steelGrad)"
            stroke="#ffffff"
            strokeWidth="1.5"
            animate={{ x: [0, 1, -1, 0], y: [0, -1, 1, 0] }}
            transition={floatTransition}
          />
          {/* Bar 2 */}
          <motion.rect
            x="16"
            y="30"
            width="32"
            height="8"
            rx="2"
            transform="rotate(35 32 34)"
            fill="url(#steelGrad)"
            stroke="#93c5fd"
            strokeWidth="1.2"
            animate={{ x: [0, -1, 1, 0], y: [0, 1, -1, 0] }}
            transition={{ ...floatTransition, delay: 0.5 }}
          />
          {/* Sparkles */}
          <motion.path
            d="M48 16 L50 20 L54 22 L50 24 L48 28 L46 24 L42 22 L46 20 Z"
            fill="#38bdf8"
            animate={{ scale: [0, 1.1, 0], rotate: [0, 90, 180] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      );

    case "Sand/Gravel":
      // Heap of golden particles with dynamic drift elements
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.15, rotate: 6 }}
        >
          <defs>
            <linearGradient id="sandDeep" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="sandLight" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
          </defs>
          {/* Main Heap */}
          <motion.path
            d="M32 16 L48 48 L16 48 Z"
            fill="url(#sandDeep)"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinejoin="round"
            animate={{ scaleY: [1, 1.03, 1] }}
            transition={floatTransition}
          />
          {/* Accent Foreground Heap */}
          <motion.path
            d="M28 28 L44 48 L12 48 Z"
            fill="url(#sandLight)"
            opacity="0.9"
            stroke="#fef08a"
            strokeWidth="1"
            strokeLinejoin="round"
            animate={{ scaleY: [1, 1.05, 1] }}
            transition={{ ...floatTransition, delay: 0.4 }}
          />
          {/* Floating glowing golden wind granules */}
          <motion.circle
            cx="24"
            cy="18"
            r="1.5"
            fill="#eab308"
            animate={{ x: [0, 10, 0], y: [0, -6, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <motion.circle
            cx="40"
            cy="24"
            r="2"
            fill="#fbbf24"
            animate={{ x: [0, -10, 0], y: [0, -8, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
          />
        </motion.svg>
      );

    case "Tiles":
      // Grid tiles glistening with spotlight flare
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.18, rotate: 4 }}
        >
          <defs>
            <linearGradient id="tileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>
          <rect x="12" y="12" width="40" height="40" rx="8" fill="url(#tileGrad)" stroke="#2dd4bf" strokeWidth="2" />
          {/* Grid lines */}
          <line x1="12" y1="32" x2="52" y2="32" stroke="#ccfbf1" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="32" y1="12" x2="32" y2="52" stroke="#ccfbf1" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* Glistening spotlight scanner line */}
          <motion.line
            x1="12"
            y1="14"
            x2="52"
            y2="50"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="4"
            animate={{ x: [-40, 40] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      );

    case "Paint":
      // A wet paintbrush with glistening gradient paint droplets
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.25, rotate: -8 }}
        >
          <defs>
            <linearGradient id="paintColors" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {/* Palette behind */}
          <circle cx="24" cy="40" r="14" fill="#1e1b4b" opacity="0.15" />
          {/* Paint brush handle & tip */}
          <g transform="translate(10, 10)">
            {/* Wooden Tip handle */}
            <motion.path
              d="M32 4 L40 12 L16 36 L8 28 Z"
              fill="#b45309"
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={floatTransition}
            />
            {/* Silver ferrule */}
            <rect x="14" y="22" width="10" height="6" transform="rotate(-45 19 25)" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
            {/* Soft Bristles soaked in dynamic gradient paint */}
            <motion.path
              d="M8 28 L16 36 C10 40 4 34 8 28 Z"
              fill="url(#paintColors)"
              animate={{ scale: [1, 1.06, 1] }}
              transition={pulseTransition}
            />
          </g>
          {/* Floating glowing paint drops */}
          <motion.circle
            cx="14"
            cy="46"
            r="3.5"
            fill="#ec4899"
            animate={{ y: [0, 8, 0], opacity: [0.8, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="48"
            cy="36"
            r="2.5"
            fill="#a855f7"
            animate={{ y: [0, -6, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
          />
        </motion.svg>
      );

    case "Timber":
      // Premium polished logs with swirling woody grain lines and nodes
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.16, rotate: 5 }}
        >
          <defs>
            <linearGradient id="woodDeep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#854d0e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <linearGradient id="woodGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
          </defs>
          {/* Main Log */}
          <motion.rect
            x="12"
            y="22"
            width="40"
            height="20"
            rx="4"
            fill="url(#woodDeep)"
            stroke="#a16207"
            strokeWidth="1.5"
            animate={{ skewX: [0, 2, -2, 0] }}
            transition={floatTransition}
          />
          {/* Inner rings at endpoints */}
          <ellipse cx="16" cy="32" rx="4" ry="10" fill="url(#woodGlow)" stroke="#fef08a" strokeWidth="1" />
          <motion.circle
            cx="16"
            cy="32"
            r="2"
            fill="none"
            stroke="#451a03"
            strokeWidth="0.8"
            animate={{ scale: [1, 1.2, 1] }}
            transition={pulseTransition}
          />
          {/* Decorative grain line inside timber */}
          <path d="M22 28 Q32 26 50 28" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M24 36 Q34 38 48 35" stroke="#ca8a04" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
        </motion.svg>
      );

    case "Sanitary":
      // Smooth dynamic liquid/water plumbing system with glowing droplets
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.22, rotate: -4 }}
        >
          <defs>
            <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          {/* Elegant structural sanitary drop */}
          <motion.path
            d="M32 12 C32 12 16 28 16 40 C16 48.8 23.2 56 32 56 C40.8 56 48 48.8 48 40 C48 28 32 12 32 12 Z"
            fill="url(#liquidGrad)"
            stroke="white"
            strokeWidth="1.5"
            animate={{ scale: [1, 1.05, 0.97, 1], y: [0, -2, 1, 0] }}
            transition={floatTransition}
          />
          {/* Inner highlights mimicking glass reflection */}
          <path d="M24 38 C24 30 30 24 30 24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          {/* Mini water wave ripples inside */}
          <motion.path
            d="M20 44 Q32 40 44 44"
            stroke="white"
            strokeWidth="1"
            opacity="0.3"
            animate={{ d: ["M20 44 Q32 40 44 44", "M20 44 Q32 48 44 44", "M20 44 Q32 40 44 44"] }}
            transition={pulseTransition}
          />
        </motion.svg>
      );

    case "Electrical":
      // Lightning strike emitting plasma ring contours
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.3, rotate: 12 }}
        >
          <defs>
            <linearGradient id="electricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          {/* Ambient lighting ring */}
          <motion.circle
            cx="32"
            cy="32"
            r="16"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.4"
            animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.3, 0.7, 0.3] }}
            transition={pulseTransition}
          />
          {/* Bolt vector */}
          <motion.path
            d="M38 12 L18 36 L30 36 L24 52 L50 28 L34 28 Z"
            fill="url(#electricGrad)"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
            animate={{
              scale: [1, 1.05, 0.95, 1.1, 1],
              x: [0, 1, -1, 1, 0],
            }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </motion.svg>
      );

    case "Glass":
      // Translucent glazed glass pane with glistening specular shine
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.2, rotate: -6 }}
        >
          <defs>
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(147, 197, 253, 0.85)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.4)" />
            </linearGradient>
          </defs>
          {/* Translucent trapezoidal glass facet split in half representing modern glazes */}
          <motion.rect
            x="14"
            y="14"
            width="36"
            height="36"
            rx="6"
            fill="url(#glassGradient)"
            stroke="#93c5fd"
            strokeWidth="2"
            animate={{ skewY: [0, 1, -1, 0] }}
            transition={floatTransition}
          />
          {/* Specular Glare */}
          <motion.path
            d="M18 18 H46 L30 46"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Sparkle star */}
          <motion.polygon
            points="46,18 48,22 52,24 48,26 46,30 44,26 40,24 44,22"
            fill="#ffffff"
            animate={{ scale: [0, 1.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          />
        </motion.svg>
      );

    case "Diamond":
      // Sleek rotating glowing neon crown jewel
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.25 }}
        >
          <defs>
            <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3ca5fc" />
              <stop offset="50%" stopColor="#1e81cc" />
              <stop offset="100%" stopColor="#2262ab" />
            </linearGradient>
            <linearGradient id="facetReflection" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          {/* Main Diamond polygonal frame */}
          <g>
            <motion.path
              d="M32 14 L48 24 L32 50 L16 24 Z"
              fill="url(#diamondGrad)"
              stroke="white"
              strokeWidth="2"
              strokeLinejoin="round"
              animate={{ y: [0, -2, 0] }}
              transition={floatTransition}
            />
            {/* Top crown facets */}
            <path d="M16 24 H48 L38 14 H26 Z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1" />
            <line x1="26" y1="14" x2="32" y2="24" stroke="white" strokeWidth="1" />
            <line x1="38" y1="14" x2="32" y2="24" stroke="white" strokeWidth="1" />
            <line x1="16" y1="24" x2="32" y2="50" stroke="white" strokeWidth="1" />
            <line x1="48" y1="24" x2="32" y2="50" stroke="white" strokeWidth="1" />
            {/* Dynamic reflection scanner ring across facets */}
            <motion.path
              d="M16 24 C24 30 40 30 48 24"
              stroke="url(#facetReflection)"
              strokeWidth="3"
              fill="none"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        </motion.svg>
      );

    case "Search":
      // Glistening magnifying search lens that wobbles/scans
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.2, rotate: 10 }}
        >
          <circle cx="28" cy="28" r="16" stroke="#2563eb" strokeWidth="3" fill="rgba(37,99,235,0.06)" />
          {/* Glancing glare highlight inside glass */}
          <path d="M20 22 C24 18 32 20 32 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          {/* Handle */}
          <motion.line
            x1="40"
            y1="40"
            x2="52"
            y2="52"
            stroke="#2563eb"
            strokeWidth="5.5"
            strokeLinecap="round"
            animate={{ x: [0, 1, 0, -1, 0], y: [0, -1, 0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.svg>
      );

    case "Register":
      // A sleek neon gold block tower constructed by design/architect teams
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.15, rotate: -3 }}
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          <rect x="22" y="24" width="20" height="28" rx="4" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="1.5" />
          <line x1="32" y1="24" x2="32" y2="52" stroke="#b45309" strokeWidth="1" />
          <line x1="22" y1="34" x2="42" y2="34" stroke="#b45309" strokeWidth="1" />
          <line x1="22" y1="44" x2="42" y2="44" stroke="#b45309" strokeWidth="1" />
          {/* Little flag on top pulsing */}
          <motion.polygon
            points="32,10 32,18 42,14"
            fill="#ef4444"
            stroke="white"
            strokeWidth="0.8"
            animate={{ rotateY: [0, 180, 0] }}
            transition={pulseTransition}
          />
          <line x1="32" y1="18" x2="32" y2="24" stroke="white" strokeWidth="1.5" />
        </motion.svg>
      );

    default: // "Other" / "Package"
      // Beautiful sleek glossy 3D delivery cube
      return (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          whileHover={{ scale: 1.18, rotate: -4 }}
        >
          <defs>
            <linearGradient id="otherGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="otherGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          <motion.path
            d="M32 12 L50 21 L32 30 L14 21 Z"
            fill="url(#otherGrad1)"
            stroke="white"
            strokeWidth="1.5"
            animate={{ y: [0, -2, 0] }}
            transition={floatTransition}
          />
          <motion.path
            d="M14 21 L32 30 V50 L14 41 Z"
            fill="url(#otherGrad2)"
            stroke="white"
            strokeWidth="1.5"
            animate={{ y: [0, -1, 0] }}
            transition={floatTransition}
          />
          <motion.path
            d="M32 30 L50 21 V41 L32 50 Z"
            fill="url(#otherGrad1)"
            opacity="0.85"
            stroke="white"
            strokeWidth="1.5"
            animate={{ y: [0, -1, 0] }}
            transition={floatTransition}
          />
        </motion.svg>
      );
  }
}
