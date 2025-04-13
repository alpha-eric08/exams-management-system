
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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

const Sidebar = () => {
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
    <aside className="bg-maroon text-white w-64 min-h-screen p-4 hidden md:block">
      <div className="flex items-center justify-center mb-8 mt-2">
        <h2 className="text-gold text-2xl font-bold">Exam Portal</h2>
      </div>

      <nav>
        <ul className="space-y-2">
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
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
