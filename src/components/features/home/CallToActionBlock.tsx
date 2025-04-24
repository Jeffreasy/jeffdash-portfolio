'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   // DialogFooter, // Niet direct nodig, ContactForm heeft eigen submit knop
// } from "@/components/ui/dialog"; // Removed Dialog import
// import ContactForm from '@/components/features/contact/ContactForm'; // Commented out as form is not implemented

const CallToActionBlock: React.FC = () => {
  // Removed state and handler as Dialog is not used

  return (
    <div className="container mx-auto my-12 md:my-16">
      <Card className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">Klaar om samen te werken?</h2>
        <p className="text-lg text-center text-muted-foreground mb-8">Laten we bespreken hoe ik kan helpen met jouw volgende project.</p>
        <div className="flex justify-center items-center gap-6 flex-wrap">
          {/* Placeholder Button for Contact */}
          <Button size="lg" onClick={() => alert('Contact form functionality needs reimplementation without Dialog.')}>Neem Contact Op</Button>

          <Link href="/projects">
            <Button
              variant="outline"
              size="lg"
            >
              Bekijk Mijn Werk
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default CallToActionBlock; 