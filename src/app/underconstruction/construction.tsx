'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Clock, Code, Palette, Rocket } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
    <motion.div
      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  </div>
);

const FloatingIcon = ({ icon: Icon, delay, className }: { icon: any, delay: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: [0.4, 1, 0.4],
      y: [20, -10, 20],
      rotate: [0, 5, -5, 0]
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={`absolute ${className}`}
  >
    <Icon className="w-8 h-8 text-blue-400" />
  </motion.div>
);

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, 100 + delay);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);

  return (
    <span className="inline-block">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  );
};

export default function UnderConstruction() {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) return 85; // Keep it at 85% to show it's still in progress
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Countdown timer (set to 30 days from now)
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <FloatingIcon icon={Code} delay={0} className="top-20 left-20" />
        <FloatingIcon icon={Palette} delay={1} className="top-40 right-32" />
        <FloatingIcon icon={Rocket} delay={2} className="bottom-40 left-40" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex items-center justify-center min-h-screen p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Main heading */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 mx-auto mb-6 relative"
                >
                  <div className="w-full h-full border-4 border-blue-400 border-t-transparent rounded-full"></div>
                  <div className="absolute inset-4 border-4 border-purple-400 border-b-transparent rounded-full"></div>
                  <div className="absolute inset-8 border-4 border-pink-400 border-l-transparent rounded-full"></div>
                </motion.div>
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              <TypewriterText text="Onder Constructie" />
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              <TypewriterText text="Ik werk hard aan iets geweldigs voor je!" delay={2000} />
            </p>
          </motion.div>

          {/* Progress section */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold mb-4">Voortgang</h2>
              <ProgressBar progress={progress} />
              <p className="mt-3 text-gray-300">{progress}% voltooid</p>
            </div>
          </motion.div>

          {/* Countdown timer */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Verwachte lancering</h2>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {[
                { label: 'Dagen', value: timeLeft.days },
                { label: 'Uren', value: timeLeft.hours },
                { label: 'Minuten', value: timeLeft.minutes },
                { label: 'Seconden', value: timeLeft.seconds }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20"
                >
                  <motion.div
                    key={item.value}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-2xl font-bold text-blue-400"
                  >
                    {item.value.toString().padStart(2, '0')}
                  </motion.div>
                  <div className="text-sm text-gray-300 mt-1">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features preview */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Wat kun je verwachten?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Code, title: 'Portfolio Showcase', desc: 'Mijn beste projecten en werk' },
                { icon: Palette, title: 'Modern Design', desc: 'Strak en gebruiksvriendelijk interface' },
                { icon: Rocket, title: 'Snelle Performance', desc: 'Geoptimaliseerd voor snelheid' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + index * 0.2 }}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-6">Blijf op de hoogte</h2>
            <p className="text-gray-300 mb-6">
              Volg me op social media voor updates over de voortgang!
            </p>
            
            <div className="flex justify-center space-x-6">
              {[
                { icon: Mail, href: 'mailto:jeffrey@example.com', label: 'Email' },
                { icon: Github, href: 'https://github.com/yourusername', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com/in/yourprofile', label: 'LinkedIn' }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.5 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="mt-8 text-gray-400 text-sm"
            >
              © 2024 Jeffrey. Alle rechten voorbehouden.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
