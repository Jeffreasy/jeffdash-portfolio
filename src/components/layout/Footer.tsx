import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="p-4 text-center text-sm text-gray-500 mt-8">
      <p>&copy; {currentYear} Jeffdash Portfolio. All rights reserved.</p>
      {/* Voeg hier evt. social media links etc. toe */}
    </footer>
  );
} 