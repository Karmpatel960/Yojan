import Navbar from "@/components/Navbar";
export default function Layout() {

    const ClientOnlyNavbar = () => {
        if (typeof window !== "undefined" && window.location.pathname === '/events') {
          return <Navbar />;
        }
        return null;
      };
    
    return (
        <div>
            <ClientOnlyNavbar />
        </div>
    );
}