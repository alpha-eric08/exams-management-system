
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  CheckSquare, 
  FilePlus, 
  Clock, 
  BookOpen,
  Users,
  DollarSign
} from 'lucide-react';

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useAuth();
  const location = useLocation();

  const studentLinks = [
    { to: '/student/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/student/resit-application', icon: <FileText className="w-5 h-5" />, label: 'Resit Application' },
    { to: '/student/supplementary-application', icon: <FilePlus className="w-5 h-5" />, label: 'Supplementary Application' },
    { to: '/student/application-status', icon: <Clock className="w-5 h-5" />, label: 'Application Status' },
    { to: '/student/timetable', icon: <Calendar className="w-5 h-5" />, label: 'Timetable' },
    { to: '/student/results', icon: <CheckSquare className="w-5 h-5" />, label: 'Results' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/admin/manage-courses', icon: <BookOpen className="w-5 h-5" />, label: 'Manage Courses' },
    { to: '/admin/approve-applications', icon: <CheckSquare className="w-5 h-5" />, label: 'Approve Applications' },
    { to: '/admin/payments', icon: <DollarSign className="w-5 h-5" />, label: 'Payments' },
    { to: '/admin/manage-timetable', icon: <Calendar className="w-5 h-5" />, label: 'Manage Timetable' },
    { to: '/admin/manage-results', icon: <FileText className="w-5 h-5" />, label: 'Manage Results' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <div className="md:hidden">
      <div className="flex justify-between items-center p-4 bg-maroon text-white">
        <h2 className="text-gold text-xl font-bold">Exam Portal</h2>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-maroon-dark"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-maroon z-50 pt-16">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-white"
          >
            <X size={24} />
          </button>

          <nav className="px-4 py-6">
            <ul className="space-y-4">
              {links.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-gold text-maroon font-medium' 
                          : 'text-white hover:bg-maroon-dark hover:text-gold'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mr-3">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
