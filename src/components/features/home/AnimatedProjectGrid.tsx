'use client';

import React from 'react';
import { SimpleGrid } from '@mantine/core';
import { motion } from 'framer-motion';
import ProjectCard from '../projects/ProjectCard'; // Importeren van de kaart
import type { FeaturedProjectType } from '@/lib/actions/projects'; // Importeren van het type

// Definieer de animatie varianten hier (zelfde als voorheen)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

interface AnimatedProjectGridProps {
  projects: FeaturedProjectType[];
}

export default function AnimatedProjectGrid({ projects }: AnimatedProjectGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing="xl"
      >
        {projects.map((project) => (
          <motion.div key={project.id} variants={itemVariants}>
            {/* ProjectCard bevat nu zelf de hover/interactie animaties */}
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </SimpleGrid>
    </motion.div>
  );
} 