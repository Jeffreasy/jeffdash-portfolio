import React from 'react';
import { Title, Text } from '@mantine/core';

export default function AdminDashboardPage() {
  // Voeg hier authenticatie check toe!
  return (
    <div>
      <Title order={2}>Admin Dashboard</Title>
      <Text mt="md">Welkom bij het admin dashboard.</Text>
      {/* Toon hier overzicht/statistieken/links naar beheermodules */}
    </div>
  );
} 