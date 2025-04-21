
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import MobileNavbar from './MobileNavbar';
import { LogOut, User } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  const { user, logout, isAdmin } = useAuth();
  
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      
      <div className="flex flex-col flex-grow">
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNavbar />
        </div>
        
        {/* Header */}
        <header className="bg-maroon text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">{title}</h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{user?.name}</span>
                {isAdmin && <span className="ml-2 bg-gold text-maroon text-xs px-2 py-0.5 rounded-full">Admin</span>}
              </div>
              
              <button 
                onClick={logout}
                className="flex items-center text-white hover:text-gold transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-grow py-8">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-maroon-dark text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} University Exam Management System</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
