'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Box, Title, Text, Group, Stack, Progress, Card, ThemeIcon } from '@mantine/core';
import { IconMail, IconBrandGithub, IconBrandLinkedin, IconCode, IconPalette, IconRocket } from '@tabler/icons-react';

const FloatingIcon = ({ icon: Icon, delay, position }: { icon: any, delay: number, position: { top?: string, bottom?: string, left?: string, right?: string } }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ 
      opacity: [0.6, 1, 0.6],
      scale: [1, 1.1, 1],
      y: [0, -15, 0],
    }}
    transition={{
      duration: 6,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      position: 'absolute',
      zIndex: 2,
      ...position
    }}
  >
    <Box
      style={{
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
      }}
    >
      <ThemeIcon size="xl" variant="light" color="blue" style={{ backgroundColor: 'transparent' }}>
        <Icon size={28} style={{ color: 'var(--mantine-color-blue-3)' }} />
      </ThemeIcon>
    </Box>
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
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ color: 'var(--mantine-color-blue-4)' }}
      >
        |
      </motion.span>
    </span>
  );
};

export default function UnderConstruction() {
  const [progress, setProgress] = useState(0);

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) return 85;
        return prev + 1;
      });
    }, 100);

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
    <Box
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      }}
    >
      {/* Subtle animated background elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Professional floating icons */}
      <FloatingIcon 
        icon={IconCode} 
        delay={0} 
        position={{ top: '15%', left: '8%' }}
      />
      <FloatingIcon 
        icon={IconPalette} 
        delay={1.5} 
        position={{ top: '25%', right: '10%' }}
      />
      <FloatingIcon 
        icon={IconRocket} 
        delay={3} 
        position={{ bottom: '20%', left: '12%' }}
      />

      <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Stack align="center" gap="xl">
            {/* Main heading */}
            <motion.div variants={itemVariants}>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ marginBottom: 'var(--mantine-spacing-md)' }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '128px',
                    height: '128px',
                    margin: '0 auto 24px',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    border: '4px solid var(--mantine-color-blue-4)',
                    borderTop: '4px solid transparent',
                    borderRadius: '50%'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    inset: '16px',
                    border: '4px solid var(--mantine-color-cyan-4)',
                    borderBottom: '4px solid transparent',
                    borderRadius: '50%'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    inset: '32px',
                    border: '4px solid var(--mantine-color-blue-6)',
                    borderLeft: '4px solid transparent',
                    borderRadius: '50%'
                  }}></div>
                </motion.div>
              </motion.div>
              
              <Title
                order={1}
                ta="center"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 6rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginBottom: 'var(--mantine-spacing-md)',
                }}
              >
                <Text
                  component="span"
                  style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  <TypewriterText text="Onder Constructie" />
                </Text>
              </Title>
              
              <Text size="xl" ta="center" c="dimmed" maw={600} mx="auto">
                <TypewriterText text="Ik werk hard aan iets geweldigs voor je!" delay={2000} />
              </Text>
            </motion.div>

            {/* Progress section */}
            <motion.div variants={itemVariants} style={{ width: '100%', maxWidth: '500px' }}>
              <Card withBorder radius="lg" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <Stack align="center" gap="md">
                  <Title order={3} ta="center">Voortgang</Title>
                  <Progress value={progress} size="lg" radius="xl" style={{ width: '100%' }} />
                  <Text ta="center" c="dimmed">{progress}% voltooid</Text>
                </Stack>
              </Card>
            </motion.div>

            {/* Features preview */}
            <motion.div variants={itemVariants} style={{ width: '100%' }}>
              <Title order={3} ta="center" mb="xl">Wat kun je verwachten?</Title>
              <Group justify="center" gap="md">
                {[
                  { icon: IconCode, title: 'Portfolio Showcase', desc: 'Mijn beste projecten en werk' },
                  { icon: IconPalette, title: 'Modern Design', desc: 'Strak en gebruiksvriendelijk interface' },
                  { icon: IconRocket, title: 'Snelle Performance', desc: 'Geoptimaliseerd voor snelheid' }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 + index * 0.2 }}
                    style={{ flex: '1', minWidth: '250px', maxWidth: '300px' }}
                  >
                    <Card withBorder radius="lg" style={{ height: '100%', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                      <Stack align="center" gap="md">
                        <ThemeIcon size="xl" variant="light" color="blue">
                          <feature.icon size={24} />
                        </ThemeIcon>
                        <Title order={4} ta="center">{feature.title}</Title>
                        <Text ta="center" c="dimmed" size="sm">{feature.desc}</Text>
                      </Stack>
                    </Card>
                  </motion.div>
                ))}
              </Group>
            </motion.div>

            {/* Contact section */}
            <motion.div variants={itemVariants}>
              <Stack align="center" gap="md">
                <Title order={3} ta="center">Blijf op de hoogte</Title>
                <Text ta="center" c="dimmed" maw={400}>
                  Volg me op social media voor updates over de voortgang!
                </Text>
                
                <Group gap="md">
                  {[
                    { icon: IconMail, href: 'mailto:jeffrey@jeffdash.com', label: 'Email', color: 'blue' },
                    { icon: IconBrandGithub, href: 'https://github.com/Jeffreasy', label: 'GitHub', color: 'gray' },
                    { icon: IconBrandLinkedin, href: 'https://linkedin.com/in/jeffrey-lavente', label: 'LinkedIn', color: 'blue' }
                  ].map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2.5 + index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ThemeIcon size="xl" variant="light" color={social.color}>
                        <social.icon size={20} />
                      </ThemeIcon>
                    </motion.a>
                  ))}
                </Group>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3 }}
                >
                  <Text ta="center" c="dimmed" size="sm" mt="xl">
                    © 2024 Jeffrey. Alle rechten voorbehouden.
                  </Text>
                </motion.div>
              </Stack>
            </motion.div>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
