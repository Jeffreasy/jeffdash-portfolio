import React from 'react';
import { Container, Title, Text, Loader, Stack, Paper } from '@mantine/core';
import { IconHammer } from '@tabler/icons-react'; // Of een ander passend icoon

const UnderConstruction: React.FC = () => {
  return (
    <Container size="sm" style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> {/* Centreren */}
      <Paper shadow="md" p="xl" withBorder radius="md" style={{ textAlign: 'center' }}>
        <Stack align="center" gap="lg">
          <IconHammer size={48} stroke={1.5} /> {/* Icoon */}
          <Title order={2}>Website Under Construction</Title>
          <Text c="dimmed" size="lg">
            Er wordt hard gewerkt aan deze website!
          </Text>
          <Text>
            Kom snel terug om het eindresultaat te zien.
          </Text>
          <Loader color="blue" /> {/* Visuele indicator */}
          {/* Optioneel: Voeg contact info of links toe */}
          {/* <Text mt="lg" size="sm">Neem contact op via: <Anchor href="mailto:jouwemail@example.com">jouwemail@example.com</Anchor></Text> */}
        </Stack>
      </Paper>
    </Container>
  );
};

export default UnderConstruction; 