'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import NavbarAdmin from '@/components/Admin/NavbarAdmin';
import NavUser from '@/components/LandingPage/User/NavUser';

const ClientSideNavbar = () => {
  const pathname = usePathname();


  if (pathname === '/' || pathname.startsWith('/events') || pathname.startsWith('/listevent')) {
    return <Navbar />;
  }
  if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
    return null;
  }

  if(pathname.startsWith('/console')) {
    return <NavUser />;
  }


  if (pathname.startsWith('/dashboard')) {
    return <NavbarAdmin />;
  }
  
  return null;
};

export default ClientSideNavbar;