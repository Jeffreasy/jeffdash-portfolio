'use client';

import React from 'react';
import { Container, Paper, Title, Text, Group, Button } from '@mantine/core';
import { IconMail, IconEye } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import PageErrorBoundary from '../shared/PageErrorBoundary';

const CallToActionBlock: React.FC = () => {
  return (
    <PageErrorBoundary>
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      }}>
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '30%',
            left: '15%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
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
            right: '20%',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />

        <Container size="lg" py={{ base: "xl", md: "3xl" }} style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Paper
              shadow="lg"
              radius="xl"
              p={{ base: "xl", md: "3xl" }}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Background decoration */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <Title 
                  order={2} 
                  size="h1" 
                  mb="md"
                  style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  }}
                >
                  Klaar om samen te werken?
                </Title>
                
                <Text 
                  size="lg" 
                  c="gray.4" 
                  mb="2xl" 
                  maw={600} 
                  mx="auto"
                  style={{
                    lineHeight: 1.6,
                  }}
                >
                  Laten we bespreken hoe ik kan helpen met jouw volgende project. 
                  Van concept tot realisatie, ik help je graag verder.
                </Text>
                
                <Group justify="center" gap="lg" wrap="wrap">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      component="a"
                      href="mailto:jeffrey@jeffdash.nl?subject=Samenwerking Aanvraag&body=Hallo Jeffrey,%0D%0A%0D%0AIk ben geïnteresseerd in samenwerking en zou graag willen bespreken hoe je kunt helpen met mijn project.%0D%0A%0D%0AMet vriendelijke groet"
                      size="lg"
                      variant="gradient"
                      gradient={{ from: 'blue.6', to: 'cyan.5' }}
                      leftSection={<IconMail size={20} />}
                      style={{
                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        fontWeight: 600,
                        minWidth: '180px',
                      }}
                    >
                      Neem Contact Op
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      component="a"
                      href="https://github.com/Jeffreasy"
                      target="_blank"
                      rel="noopener noreferrer"
                      size="lg"
                      variant="outline"
                      color="gray"
                      leftSection={<IconEye size={20} />}
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'var(--mantine-color-gray-2)',
                        fontWeight: 600,
                        minWidth: '180px',
                      }}
                    >
                      Bekijk Mijn Werk
                    </Button>
                  </motion.div>
                </Group>
              </div>
            </Paper>
          </motion.div>
        </Container>
      </section>
    </PageErrorBoundary>
  );
};

export default CallToActionBlock; 