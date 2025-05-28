'use client';

import React from 'react';
import { Title, Text, Card, SimpleGrid, Button, Stack, Box, Group, Badge, ThemeIcon, Container, Progress, Table, Anchor } from '@mantine/core';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  IconClipboardList,
  IconFileText,
  IconMessages,
  IconMail,
  IconArrowRight,
  IconChartBar,
  IconEye,
  IconClick,
  IconTrendingUp,
  IconUserCheck,
  IconCalendarStats,
  IconUsers,
  IconDeviceAnalytics,
  IconClock,
  IconBounceRight
} from '@tabler/icons-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const cardVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.98 },
} as const;

interface AnalyticsData {
  pricingAnalytics: {
    totalViews: number;
    totalClicks: number;
    totalInquiries: number;
    conversionRate: number;
    popularPlan: string | null;
  };
  recentEvents: Array<{
    id: string;
    event_type: string;
    plan_name?: string;
    created_at: string;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    clicks: number;
    inquiries: number;
  }>;
}

interface GoogleAnalyticsData {
  pageViews: {
    pageViews: Array<{
      pageTitle: string;
      pagePath: string;
      screenPageViews: number;
      sessions: number;
      averageSessionDuration: number;
    }>;
    totalPageViews: number;
    totalSessions: number;
    error?: string;
  };
  overview: {
    totalUsers: number;
    totalSessions: number;
    totalPageViews: number;
    bounceRate: number;
    averageSessionDuration: number;
    error?: string;
  };
}

interface DashboardData {
  projectsCount: number;
  postsCount: number;
  contactsCount: number;
  unreadContactsCount: number;
  pricingPlansCount: number;
  errors: string[];
  authInfo: string;
  debugInfo: any;
  analyticsData: AnalyticsData;
  googleAnalyticsData: GoogleAnalyticsData;
}

interface AdminDashboardClientProps {
  data: DashboardData;
}

export default function AdminDashboardClient({ data }: AdminDashboardClientProps) {
  const { 
    projectsCount, 
    postsCount, 
    contactsCount, 
    unreadContactsCount, 
    pricingPlansCount, 
    errors, 
    authInfo, 
    debugInfo,
    analyticsData,
    googleAnalyticsData
  } = data;

  const dashboardCards = [
    {
      title: 'Projecten',
      count: projectsCount,
      href: '/admin_area/projects',
      icon: IconClipboardList,
      color: 'blue',
      gradient: { from: 'blue.6', to: 'cyan.5' },
      description: 'Beheer portfolio projecten',
    },
    {
      title: 'Blog Posts',
      count: postsCount,
      href: '/admin_area/posts',
      icon: IconFileText,
      color: 'violet',
      gradient: { from: 'violet.6', to: 'purple.5' },
      description: 'Schrijf en bewerk artikelen',
    },
    {
      title: 'Contact Berichten',
      count: contactsCount,
      href: '/admin_area/contacts',
      icon: IconMessages,
      color: 'green',
      gradient: { from: 'green.6', to: 'teal.5' },
      description: 'Bekijk inzendingen',
      badge: unreadContactsCount > 0 ? unreadContactsCount : undefined,
    },
    {
      title: 'Pricing Plans',
      count: pricingPlansCount,
      href: '/admin_area/pricing',
      icon: IconChartBar,
      color: 'orange',
      gradient: { from: 'orange.6', to: 'red.5' },
      description: 'Beheer pricing & analytics',
    },
  ];

  const analyticsCards = [
    {
      title: 'Totaal Views',
      count: analyticsData.pricingAnalytics.totalViews,
      icon: IconEye,
      color: 'blue',
      description: 'Pricing plan bekeken',
    },
    {
      title: 'Totaal Clicks',
      count: analyticsData.pricingAnalytics.totalClicks,
      icon: IconClick,
      color: 'cyan',
      description: 'Plan buttons geklikt',
    },
    {
      title: 'Inquiries',
      count: analyticsData.pricingAnalytics.totalInquiries,
      icon: IconUserCheck,
      color: 'green',
      description: 'Contact aanvragen',
    },
    {
      title: 'Conversie Rate',
      count: `${analyticsData.pricingAnalytics.conversionRate}%`,
      icon: IconTrendingUp,
      color: 'violet',
      description: 'Views naar inquiries',
    },
  ];

  const gaOverviewCards = [
    {
      title: 'Totaal Gebruikers',
      count: googleAnalyticsData.overview.totalUsers,
      icon: IconUsers,
      color: 'blue',
      description: 'Afgelopen 7 dagen',
    },
    {
      title: 'Totaal Sessies',
      count: googleAnalyticsData.overview.totalSessions,
      icon: IconDeviceAnalytics,
      color: 'green',
      description: 'Website sessies',
    },
    {
      title: 'Pagina Weergaven',
      count: googleAnalyticsData.overview.totalPageViews,
      icon: IconEye,
      color: 'violet',
      description: 'Totaal GA weergaven',
    },
    {
      title: 'Bounce Rate',
      count: `${googleAnalyticsData.overview.bounceRate.toFixed(1)}%`,
      icon: IconBounceRight,
      color: 'orange',
      description: 'Gemiddelde bounce rate',
    },
  ];

  const formatEventType = (eventType: string) => {
    const types: Record<string, string> = {
      'view': 'Bekeken',
      'click': 'Geklikt',
      'inquiry': 'Aanvraag',
      'hover': 'Hover',
      'modal_open': 'Modal'
    };
    return types[eventType] || eventType;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      style={{
        position: 'relative',
        minHeight: '100%',
        width: '100%',
        padding: 'clamp(12px, 3vw, 24px)', // Responsive padding
      }}
    >
      {/* Subtle background elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: 'clamp(150px, 20vw, 200px)', // Responsive background element
        height: 'clamp(150px, 20vw, 200px)',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <Container 
        size="xl" 
        style={{ 
          position: 'relative', 
          zIndex: 1,
          padding: 'clamp(16px, 4vw, 32px)', // Responsive container padding
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Stack gap="xl">
            {/* Header */}
            <motion.div variants={itemVariants}>
              <Group justify="space-between" align="flex-start">
                <Box style={{ width: '100%' }}>
                  <Title 
                    order={1}
                    style={{
                      background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                      fontWeight: 900,
                      marginBottom: 'clamp(8px, 2vw, 16px)',
                      lineHeight: 1.2,
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                    }}
                  >
                    Dashboard
                  </Title>
                  <Text 
                    size="lg" 
                    c="gray.3"
                    style={{
                      fontSize: 'clamp(0.9rem, 3vw, 1.125rem)',
                      lineHeight: 1.5,
                      maxWidth: '100%',
                    }}
                  >
                    Welkom bij het admin dashboard. Beheer je content en bekijk statistieken.
                  </Text>
                </Box>
                
                <ThemeIcon
                  size="xl"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: 'blue.6', to: 'cyan.5' }}
                  visibleFrom="sm"
                >
                  <IconChartBar size={24} />
                </ThemeIcon>
              </Group>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants}>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                {dashboardCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Card
                      component={Link}
                      href={card.href}
                      p="lg"
                      radius="lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        height: '100%',
                        minHeight: 'clamp(140px, 20vw, 180px)',
                        padding: 'clamp(16px, 4vw, 24px)',
                        borderRadius: 'clamp(12px, 3vw, 16px)',
                      }}
                      styles={{
                        root: {
                          '&:hover': {
                            borderColor: `rgba(${card.color === 'blue' ? '59, 130, 246' : card.color === 'violet' ? '139, 92, 246' : card.color === 'green' ? '34, 197, 94' : '249, 115, 22'}, 0.4)`,
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.08) 100%)',
                            boxShadow: `0 12px 32px rgba(${card.color === 'blue' ? '59, 130, 246' : card.color === 'violet' ? '139, 92, 246' : card.color === 'green' ? '34, 197, 94' : '249, 115, 22'}, 0.2)`,
                          },
                        }
                      }}
                    >
                      {/* Decorative element */}
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: 'clamp(60px, 10vw, 80px)',
                        height: 'clamp(60px, 10vw, 80px)',
                        background: `radial-gradient(circle, rgba(${card.color === 'blue' ? '59, 130, 246' : card.color === 'violet' ? '139, 92, 246' : card.color === 'green' ? '34, 197, 94' : '249, 115, 22'}, 0.1) 0%, transparent 70%)`,
                        borderRadius: '50%',
                        filter: 'blur(15px)',
                        pointerEvents: 'none',
                      }} />

                      <Stack 
                        gap="md" 
                        style={{ 
                          position: 'relative', 
                          zIndex: 1,
                          height: '100%',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Group justify="space-between" align="flex-start">
                          <ThemeIcon
                            size="lg"
                            radius="md"
                            variant="gradient"
                            gradient={card.gradient}
                            style={{
                              minWidth: 'clamp(40px, 8vw, 48px)',
                              minHeight: 'clamp(40px, 8vw, 48px)',
                            }}
                          >
                            <card.icon size={20} />
                          </ThemeIcon>
                          
                          {card.badge && (
                            <Badge
                              variant="gradient"
                              gradient={{ from: 'red.6', to: 'orange.5' }}
                              size="sm"
                              style={{
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
                              }}
                            >
                              {card.badge}
                            </Badge>
                          )}
                        </Group>

                        <Box style={{ flex: 1 }}>
                          <Title 
                            order={4} 
                            c="gray.1" 
                            mb={4}
                            style={{
                              fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                              lineHeight: 1.3,
                              WebkitFontSmoothing: 'antialiased',
                              MozOsxFontSmoothing: 'grayscale',
                            }}
                          >
                            {card.title}
                          </Title>
                          <Text 
                            size="sm" 
                            c="gray.4" 
                            mb="xs"
                            style={{
                              fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                              lineHeight: 1.4,
                            }}
                          >
                            {card.description}
                          </Text>
                          {card.count !== null && (
                            <Text 
                              size="xl" 
                              fw={700}
                              style={{
                                background: `linear-gradient(135deg, var(--mantine-color-${card.color}-4), var(--mantine-color-${card.color}-6))`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                lineHeight: 1.2,
                              }}
                            >
                              {card.count}
                            </Text>
                          )}
                        </Box>

                        <Group justify="space-between" align="center">
                          <Button
                            variant="subtle"
                            size="xs"
                            rightSection={<IconArrowRight size={14} />}
                            color={card.color}
                            style={{
                              minHeight: '32px',
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                              padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
                              borderRadius: 'clamp(6px, 1.5vw, 8px)',
                            }}
                          >
                            Beheren
                          </Button>
                        </Group>
                      </Stack>
                    </Card>
                  </motion.div>
                ))}
              </SimpleGrid>
            </motion.div>

            {/* Google Analytics Section */}
            <motion.div variants={itemVariants}>
              <Stack gap="lg">
                <Group justify="space-between" align="center">
                  <Box>
                    <Title 
                      order={2}
                      c="gray.1"
                      style={{
                        fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)',
                        fontWeight: 700,
                        marginBottom: 'clamp(4px, 1vw, 8px)',
                      }}
                    >
                      Google Analytics
                    </Title>
                    <Text 
                      size="sm" 
                      c="gray.4"
                      style={{
                        fontSize: 'clamp(0.75rem, 2.2vw, 0.875rem)',
                        lineHeight: 1.4,
                      }}
                    >
                      Laatste 7 dagen • Website traffic en gebruikersgedrag
                    </Text>
                  </Box>
                  <ThemeIcon
                    size="lg"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: 'green.6', to: 'teal.5' }}
                    visibleFrom="sm"
                  >
                    <IconDeviceAnalytics size={20} />
                  </ThemeIcon>
                </Group>

                {/* GA Overview Cards - More mobile optimized */}
                <SimpleGrid 
                  cols={{ base: 2, xs: 2, sm: 4 }} 
                  spacing={{ base: 'xs', sm: 'md' }}
                >
                  {gaOverviewCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      variants={cardVariants}
                      whileHover="hover"
                    >
                      <Card
                        p="md"
                        radius="lg"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          minHeight: 'clamp(110px, 18vw, 140px)',
                          padding: 'clamp(8px, 2.5vw, 16px)',
                        }}
                      >
                        <Stack gap="xs" align="center" style={{ textAlign: 'center' }}>
                          <ThemeIcon
                            size="md"
                            radius="md"
                            color={card.color}
                            variant="light"
                            style={{
                              width: 'clamp(28px, 8vw, 36px)',
                              height: 'clamp(28px, 8vw, 36px)',
                            }}
                          >
                            <card.icon size="clamp(14, 4vw, 18)" />
                          </ThemeIcon>
                          
                          <Text 
                            fw={700} 
                            size="lg"
                            style={{
                              fontSize: 'clamp(0.9rem, 2.8vw, 1.25rem)',
                              color: `var(--mantine-color-${card.color}-4)`,
                              lineHeight: 1.2,
                            }}
                          >
                            {card.count}
                          </Text>
                          
                          <Text 
                            size="xs" 
                            c="gray.1" 
                            fw={600}
                            style={{
                              fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)',
                              lineHeight: 1.3,
                            }}
                          >
                            {card.title}
                          </Text>
                          
                          <Text 
                            size="xs" 
                            c="gray.5"
                            hiddenFrom="base"
                            visibleFrom="xs"
                            style={{
                              fontSize: 'clamp(0.6rem, 1.6vw, 0.7rem)',
                              lineHeight: 1.2,
                            }}
                          >
                            {card.description}
                          </Text>
                        </Stack>
                      </Card>
                    </motion.div>
                  ))}
                </SimpleGrid>

                {/* Top Pages Table - Mobile Optimized */}
                {googleAnalyticsData.pageViews.pageViews.length > 0 && (
                  <Card
                    p="md"
                    radius="lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: 'clamp(12px, 3vw, 20px)',
                    }}
                  >
                    <Title 
                      order={3} 
                      c="gray.1" 
                      mb="md"
                      style={{
                        fontSize: 'clamp(0.95rem, 2.8vw, 1.125rem)',
                        fontWeight: 600,
                      }}
                    >
                      Top Pagina's (7 dagen)
                    </Title>
                    
                    {/* Mobile-first responsive table */}
                    <Box>
                      {/* Mobile Card View - Hidden on larger screens */}
                      <Box hiddenFrom="sm">
                        {/* Mobile Legend */}
                        <Group justify="center" mb="sm">
                          <Group gap="sm">
                            <Group gap={4}>
                              <Badge variant="light" color="blue" size="xs">Views</Badge>
                              <Badge variant="light" color="green" size="xs">Sessies</Badge>
                            </Group>
                          </Group>
                        </Group>
                        
                        <Stack gap="xs">
                          {googleAnalyticsData.pageViews.pageViews.slice(0, 5).map((page, index) => (
                            <Card
                              key={`mobile-${page.pagePath}-${index}`}
                              p="sm"
                              radius="md"
                              style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                              }}
                            >
                              <Group justify="space-between" align="flex-start">
                                <Box style={{ flex: 1 }}>
                                  <Text 
                                    size="sm" 
                                    fw={600} 
                                    c="gray.1"
                                    style={{
                                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                      lineHeight: 1.3,
                                    }}
                                    lineClamp={2}
                                  >
                                    {page.pageTitle}
                                  </Text>
                                  <Anchor 
                                    href={page.pagePath} 
                                    target="_blank" 
                                    c="blue.4" 
                                    size="xs"
                                    style={{
                                      fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)',
                                    }}
                                  >
                                    {page.pagePath}
                                  </Anchor>
                                </Box>
                                <Stack gap={4} align="flex-end">
                                  <Group gap="xs">
                                    <Badge variant="light" color="blue" size="xs">
                                      {page.screenPageViews}
                                    </Badge>
                                    <Badge variant="light" color="green" size="xs">
                                      {page.sessions}
                                    </Badge>
                                  </Group>
                                  <Text 
                                    size="xs" 
                                    c="gray.4"
                                    style={{
                                      fontSize: 'clamp(0.6rem, 1.6vw, 0.7rem)',
                                    }}
                                  >
                                    {formatDuration(page.averageSessionDuration)}
                                  </Text>
                                </Stack>
                              </Group>
                            </Card>
                          ))}
                        </Stack>
                      </Box>

                      {/* Desktop Table View - Hidden on small screens */}
                      <Box
                        visibleFrom="sm"
                        style={{
                          overflowX: 'auto',
                          // Add subtle scrollbar styling
                          scrollbarWidth: 'thin',
                          scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
                        }}
                      >
                        <Table
                          highlightOnHover
                          style={{
                            '--table-border-color': 'rgba(255, 255, 255, 0.1)',
                            '--table-hover-color': 'rgba(255, 255, 255, 0.02)',
                            minWidth: '600px', // Ensure minimum width for horizontal scroll
                          }}
                        >
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th 
                                style={{ 
                                  color: 'var(--mantine-color-gray-3)', 
                                  fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
                                  padding: 'clamp(6px, 1.5vw, 12px)',
                                  minWidth: '140px',
                                }}
                              >
                                Pagina Titel
                              </Table.Th>
                              <Table.Th 
                                style={{ 
                                  color: 'var(--mantine-color-gray-3)', 
                                  fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
                                  padding: 'clamp(6px, 1.5vw, 12px)',
                                  minWidth: '120px',
                                }}
                              >
                                Pad
                              </Table.Th>
                              <Table.Th 
                                style={{ 
                                  color: 'var(--mantine-color-gray-3)', 
                                  fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)', 
                                  textAlign: 'right',
                                  padding: 'clamp(6px, 1.5vw, 12px)',
                                  minWidth: '80px',
                                }}
                              >
                                Views
                              </Table.Th>
                              <Table.Th 
                                style={{ 
                                  color: 'var(--mantine-color-gray-3)', 
                                  fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)', 
                                  textAlign: 'right',
                                  padding: 'clamp(6px, 1.5vw, 12px)',
                                  minWidth: '80px',
                                }}
                              >
                                Sessies
                              </Table.Th>
                              <Table.Th 
                                style={{ 
                                  color: 'var(--mantine-color-gray-3)', 
                                  fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)', 
                                  textAlign: 'right',
                                  padding: 'clamp(6px, 1.5vw, 12px)',
                                  minWidth: '80px',
                                }}
                              >
                                Duur
                              </Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {googleAnalyticsData.pageViews.pageViews.map((page, index) => (
                              <Table.Tr key={`${page.pagePath}-${index}`}>
                                <Table.Td 
                                  style={{ 
                                    color: 'var(--mantine-color-gray-2)', 
                                    fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
                                    padding: 'clamp(6px, 1.5vw, 12px)',
                                    maxWidth: '140px',
                                  }}
                                >
                                  <Text 
                                    truncate="end" 
                                    style={{ 
                                      fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
                                      lineHeight: 1.3,
                                    }}
                                    title={page.pageTitle} // Tooltip for full title
                                  >
                                    {page.pageTitle}
                                  </Text>
                                </Table.Td>
                                <Table.Td 
                                  style={{ 
                                    fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
                                    padding: 'clamp(6px, 1.5vw, 12px)',
                                    maxWidth: '120px',
                                  }}
                                >
                                  <Anchor 
                                    href={page.pagePath} 
                                    target="_blank" 
                                    c="blue.4" 
                                    size="sm"
                                    style={{
                                      fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
                                    }}
                                  >
                                    <Text 
                                      truncate="end" 
                                      style={{ 
                                        fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
                                        lineHeight: 1.3,
                                      }}
                                      title={page.pagePath} // Tooltip for full path
                                    >
                                      {page.pagePath}
                                    </Text>
                                  </Anchor>
                                </Table.Td>
                                <Table.Td 
                                  style={{ 
                                    textAlign: 'right', 
                                    fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
                                    padding: 'clamp(6px, 1.5vw, 12px)',
                                  }}
                                >
                                  <Badge 
                                    variant="light" 
                                    color="blue" 
                                    size="sm"
                                    style={{
                                      fontSize: 'clamp(0.65rem, 1.6vw, 0.75rem)',
                                    }}
                                  >
                                    {page.screenPageViews.toLocaleString()}
                                  </Badge>
                                </Table.Td>
                                <Table.Td 
                                  style={{ 
                                    textAlign: 'right', 
                                    fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
                                    padding: 'clamp(6px, 1.5vw, 12px)',
                                  }}
                                >
                                  <Badge 
                                    variant="light" 
                                    color="green" 
                                    size="sm"
                                    style={{
                                      fontSize: 'clamp(0.65rem, 1.6vw, 0.75rem)',
                                    }}
                                  >
                                    {page.sessions.toLocaleString()}
                                  </Badge>
                                </Table.Td>
                                <Table.Td 
                                  style={{ 
                                    textAlign: 'right', 
                                    color: 'var(--mantine-color-gray-3)', 
                                    fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
                                    padding: 'clamp(6px, 1.5vw, 12px)',
                                  }}
                                >
                                  {formatDuration(page.averageSessionDuration)}
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </Box>
                    </Box>
                  </Card>
                )}
              </Stack>
            </motion.div>

            {/* Pricing Analytics Section */}
            <motion.div variants={itemVariants}>
              <Stack gap="lg">
                <Group justify="space-between" align="center">
                  <Box>
                    <Title 
                      order={2}
                      c="gray.1"
                      style={{
                        fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)',
                        fontWeight: 700,
                        marginBottom: 'clamp(4px, 1vw, 8px)',
                      }}
                    >
                      Pricing Analytics
                    </Title>
                    <Text 
                      size="sm" 
                      c="gray.4"
                      style={{
                        fontSize: 'clamp(0.75rem, 2.2vw, 0.875rem)',
                        lineHeight: 1.4,
                      }}
                    >
                      Laatste 30 dagen • {analyticsData.pricingAnalytics.popularPlan && 
                        `Populairste plan: ${analyticsData.pricingAnalytics.popularPlan}`
                      }
                    </Text>
                  </Box>
                  <ThemeIcon
                    size="lg"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: 'violet.6', to: 'purple.5' }}
                    visibleFrom="sm"
                  >
                    <IconCalendarStats size={20} />
                  </ThemeIcon>
                </Group>

                {/* Analytics Cards - More mobile optimized */}
                <SimpleGrid 
                  cols={{ base: 2, xs: 2, sm: 4 }} 
                  spacing={{ base: 'xs', sm: 'md' }}
                >
                  {analyticsCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      variants={cardVariants}
                      whileHover="hover"
                    >
                      <Card
                        p="md"
                        radius="lg"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          minHeight: 'clamp(110px, 18vw, 140px)',
                          padding: 'clamp(8px, 2.5vw, 16px)',
                        }}
                      >
                        <Stack gap="xs" align="center" style={{ textAlign: 'center' }}>
                          <ThemeIcon
                            size="md"
                            radius="md"
                            color={card.color}
                            variant="light"
                            style={{
                              width: 'clamp(28px, 8vw, 36px)',
                              height: 'clamp(28px, 8vw, 36px)',
                            }}
                          >
                            <card.icon size="clamp(14, 4vw, 18)" />
                          </ThemeIcon>
                          
                          <Text 
                            fw={700} 
                            size="lg"
                            style={{
                              fontSize: 'clamp(0.9rem, 2.8vw, 1.25rem)',
                              color: `var(--mantine-color-${card.color}-4)`,
                              lineHeight: 1.2,
                            }}
                          >
                            {card.count}
                          </Text>
                          
                          <Text 
                            size="xs" 
                            c="gray.1" 
                            fw={600}
                            style={{
                              fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)',
                              lineHeight: 1.3,
                            }}
                          >
                            {card.title}
                          </Text>
                          
                          <Text 
                            size="xs" 
                            c="gray.5"
                            hiddenFrom="base"
                            visibleFrom="xs"
                            style={{
                              fontSize: 'clamp(0.6rem, 1.6vw, 0.7rem)',
                              lineHeight: 1.2,
                            }}
                          >
                            {card.description}
                          </Text>
                        </Stack>
                      </Card>
                    </motion.div>
                  ))}
                </SimpleGrid>

                {/* Recent Activity - Mobile Optimized */}
                {analyticsData.recentEvents.length > 0 && (
                  <Card
                    p="md"
                    radius="lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: 'clamp(12px, 3vw, 20px)',
                    }}
                  >
                    <Title 
                      order={3} 
                      c="gray.1" 
                      mb="md"
                      style={{
                        fontSize: 'clamp(0.95rem, 2.8vw, 1.125rem)',
                        fontWeight: 600,
                      }}
                    >
                      Recente Activiteit
                    </Title>
                    
                    {/* Mobile-first responsive activity list */}
                    <Box>
                      {/* Mobile Card View - Better for small screens */}
                      <Box hiddenFrom="sm">
                        <Stack gap="xs">
                          {analyticsData.recentEvents.slice(0, 5).map((event, index) => (
                            <Card
                              key={`mobile-activity-${event.id}-${index}`}
                              p="sm"
                              radius="md"
                              style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                              }}
                            >
                              <Group justify="space-between" align="center">
                                <Group gap="xs">
                                  <Badge 
                                    size="xs" 
                                    color={
                                      event.event_type === 'inquiry' ? 'green' :
                                      event.event_type === 'click' ? 'blue' :
                                      event.event_type === 'view' ? 'gray' : 'violet'
                                    }
                                    variant="light"
                                    style={{
                                      fontSize: 'clamp(0.6rem, 1.6vw, 0.65rem)',
                                    }}
                                  >
                                    {formatEventType(event.event_type)}
                                  </Badge>
                                  <Text 
                                    size="sm" 
                                    c="gray.3"
                                    style={{
                                      fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                                    }}
                                    lineClamp={1}
                                  >
                                    {event.plan_name}
                                  </Text>
                                </Group>
                                <Text 
                                  size="xs" 
                                  c="gray.5"
                                  style={{
                                    fontSize: 'clamp(0.6rem, 1.6vw, 0.7rem)',
                                  }}
                                >
                                  {formatDate(event.created_at)}
                                </Text>
                              </Group>
                            </Card>
                          ))}
                        </Stack>
                      </Box>

                      {/* Desktop List View - Hidden on small screens */}
                      <Box visibleFrom="sm">
                        <Stack gap="xs">
                          {analyticsData.recentEvents.slice(0, 5).map((event, index) => (
                            <Group 
                              key={`desktop-activity-${event.id}-${index}`} 
                              justify="space-between" 
                              style={{
                                padding: 'clamp(8px, 2vw, 12px)',
                                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                                background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                              }}
                            >
                              <Group gap="sm">
                                <Badge 
                                  size="sm" 
                                  color={
                                    event.event_type === 'inquiry' ? 'green' :
                                    event.event_type === 'click' ? 'blue' :
                                    event.event_type === 'view' ? 'gray' : 'violet'
                                  }
                                  variant="light"
                                  style={{
                                    fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                                  }}
                                >
                                  {formatEventType(event.event_type)}
                                </Badge>
                                <Text 
                                  size="sm" 
                                  c="gray.3"
                                  style={{
                                    fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                                  }}
                                >
                                  {event.plan_name}
                                </Text>
                              </Group>
                              <Text 
                                size="xs" 
                                c="gray.5"
                                style={{
                                  fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                                }}
                              >
                                {formatDate(event.created_at)}
                              </Text>
                            </Group>
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  </Card>
                )}
              </Stack>
            </motion.div>

            {/* Debug Info - Only show if there are errors or in development */}
            {(errors.length > 0 || process.env.NODE_ENV === 'development') && (
              <motion.div variants={itemVariants}>
                <Card
                  p="lg"
                  radius="lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: 'clamp(16px, 4vw, 24px)',
                    borderRadius: 'clamp(12px, 3vw, 16px)',
                  }}
                >
                  <Stack gap="md">
                    <Group>
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'blue.6', to: 'cyan.5' }}
                      >
                        <IconChartBar size={16} />
                      </ThemeIcon>
                      <Title 
                        order={4} 
                        c="blue.3"
                        style={{
                          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                        }}
                      >
                        Debug Informatie
                      </Title>
                    </Group>
                    
                    <Text 
                      size="sm" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      <strong>Auth Status:</strong> {authInfo}
                    </Text>
                    
                    {debugInfo.projects && (
                      <Text 
                        size="sm" 
                        c="gray.3"
                        style={{
                          fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                        }}
                      >
                        <strong>Direct Projects Query:</strong> {debugInfo.projects.error ? 
                          `Error: ${debugInfo.projects.error.message}` : 
                          `Found ${debugInfo.projects.data?.length || 0} projects`}
                      </Text>
                    )}
                    
                    {debugInfo.posts && (
                      <Text 
                        size="sm" 
                        c="gray.3"
                        style={{
                          fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                        }}
                      >
                        <strong>Direct Posts Query:</strong> {debugInfo.posts.error ? 
                          `Error: ${debugInfo.posts.error.message}` : 
                          `Found ${debugInfo.posts.data?.length || 0} posts`}
                      </Text>
                    )}
                    
                    {debugInfo.contacts && (
                      <Text 
                        size="sm" 
                        c="gray.3"
                        style={{
                          fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                        }}
                      >
                        <strong>Direct Contacts Query:</strong> {debugInfo.contacts.error ? 
                          `Error: ${debugInfo.contacts.error.message}` : 
                          `Found ${debugInfo.contacts.data?.length || 0} contacts`}
                      </Text>
                    )}

                    {/* Google Analytics Status */}
                    <Text 
                      size="sm" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      <strong>Google Analytics:</strong> {
                        typeof window !== 'undefined' && window.gtag ? 
                          'Loaded ✅' : 
                          process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? 
                            'Configured but not loaded' : 
                            'Not configured (missing NEXT_PUBLIC_GA_MEASUREMENT_ID)'
                      }
                    </Text>

                    <Text 
                      size="sm" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      <strong>GA Measurement ID:</strong> {
                        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'Not set'
                      }
                    </Text>

                    <Text 
                      size="sm" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      <strong>GA4 Property ID:</strong> {
                        process.env.GA4_PROPERTY_ID || 'Not set'
                      }
                    </Text>

                    <Text 
                      size="sm" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      <strong>GA Data Status:</strong> {
                        googleAnalyticsData.pageViews.error || googleAnalyticsData.overview.error ? 
                          `Error: ${googleAnalyticsData.pageViews.error || googleAnalyticsData.overview.error}` :
                          `${googleAnalyticsData.pageViews.pageViews.length} pages, ${googleAnalyticsData.overview.totalUsers} users`
                      }
                    </Text>

                    <Text 
                      size="sm" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      <strong>Vercel Analytics:</strong> {
                        typeof window !== 'undefined' && (window as any).va ? 
                          'Active ✅' : 'Loading or not active'
                      }
                    </Text>
                    
                    {errors.length > 0 && (
                      <Box>
                        <Text 
                          size="sm" 
                          fw={600} 
                          c="red.4" 
                          mb="xs"
                          style={{
                            fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                          }}
                        >
                          Errors detected:
                        </Text>
                        {errors.map((error, index) => (
                          <Text 
                            key={index} 
                            c="red.4" 
                            size="sm"
                            style={{
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                              lineHeight: 1.5,
                              wordBreak: 'break-word',
                            }}
                          >
                            • {error}
                          </Text>
                        ))}
                      </Box>
                    )}
                  </Stack>
                </Card>
              </motion.div>
            )}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
} 