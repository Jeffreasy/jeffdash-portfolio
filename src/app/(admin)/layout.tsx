import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Deze layout kan een aparte sidebar/navigatie voor admin bevatten
  // Voeg hier authenticatie check toe!
  return (
    <div className="admin-layout">
      <p className="text-red-500 p-4">Admin Sectie</p>
      {/* <AdminSidebar /> */}
      <main>{children}</main>
    </div>
  );
} 