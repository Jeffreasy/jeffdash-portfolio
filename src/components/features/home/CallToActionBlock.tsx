'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Paper, Title, Text, Group, Button } from '@mantine/core';
import { IconMail, IconEye } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import PageErrorBoundary from '../shared/PageErrorBoundary';

const CallToActionBlock: React.FC = () => {
  return (
    <PageErrorBoundary>
      <Container size="lg" py={{ base: "xl", md: "3xl" }}>
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
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              position: 'relative',
              overflow: 'hidden',
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
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <Title 
                order={2} 
                size="h1" 
                mb="md"
                style={{
                  background: 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-cyan-5))',
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
                c="dimmed" 
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
                    component={Link}
                    href="/contact"
                    size="lg"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                    leftSection={<IconMail size={20} />}
                    style={{
                      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                      fontWeight: 600,
                      minWidth: '180px',
                    }}
                    styles={{
                      root: {
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                        }
                      }
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
                    component={Link}
                    href="/projects"
                    size="lg"
                    variant="outline"
                    color="blue"
                    leftSection={<IconEye size={20} />}
                    style={{
                      borderColor: 'var(--mantine-color-blue-4)',
                      color: 'var(--mantine-color-blue-6)',
                      fontWeight: 600,
                      minWidth: '180px',
                    }}
                    styles={{
                      root: {
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'var(--mantine-color-blue-0)',
                          borderColor: 'var(--mantine-color-blue-5)',
                        }
                      }
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
    </PageErrorBoundary>
  );
};

export default CallToActionBlock; 