'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import NavbarAdmin from '@/components/Admin/NavbarAdmin';

const ClientSideNavbar = () => {
  const pathname = usePathname();
  if (pathname === '/' || pathname.startsWith('/events')) {
    return <Navbar />;
  }
  if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
    return null;
  }

  if (pathname.startsWith('/dashboard')) {
    return <NavbarAdmin />;
  }
  
  return null;
};

export default ClientSideNavbar;