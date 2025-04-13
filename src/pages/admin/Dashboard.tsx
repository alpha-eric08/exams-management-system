
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import MainLayout from '@/components/layout/MainLayout';
import MobileNavbar from '@/components/layout/MobileNavbar';
import StatusBadge from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  BookOpen,
  XCircle,
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { applications, courses } = useData();
  const navigate = useNavigate();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/student/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Calculate statistics
  const stats = {
    totalApplications: applications.length,
    resitApplications: applications.filter(app => app.type === 'RESIT').length,
    supplementaryApplications: applications.filter(app => app.type === 'SUPPLEMENTARY').length,
    pendingApplications: applications.filter(app => app.status === 'PENDING').length,
    approvedApplications: applications.filter(app => app.status === 'APPROVED').length,
    rejectedApplications: applications.filter(app => app.status === 'REJECTED').length,
    totalCourses: courses.length,
    totalPayments: applications
      .filter(app => app.type === 'RESIT' && app.paymentStatus === 'PAID')
      .reduce((sum, app) => sum + (app.totalFee || 0), 0),
  };

  // Get recent applications
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (!isAuthenticated || !isAdmin) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <>
      <MobileNavbar />
      <MainLayout title="Admin Dashboard">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-maroon mb-4">Dashboard Overview</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Applications */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{stats.totalApplications}</span>
                  <FileText className="h-5 w-5 text-maroon" />
                </div>
                <div className="mt-2 flex text-xs space-x-2">
                  <span className="text-gray-500">Resit: {stats.resitApplications}</span>
                  <span className="text-gray-500">Supp: {stats.supplementaryApplications}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Application Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{stats.pendingApplications}</span>
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="mt-2 flex text-xs space-x-2">
                  <span className="text-green-600">Approved: {stats.approvedApplications}</span>
                  <span className="text-red-600">Rejected: {stats.rejectedApplications}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Total Payments */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Total Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">GHS {stats.totalPayments}</span>
                  <DollarSign className="h-5 w-5 text-maroon" />
                </div>
              </CardContent>
            </Card>
            
            {/* Total Courses */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{stats.totalCourses}</span>
                  <BookOpen className="h-5 w-5 text-maroon" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-maroon mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button 
              className="bg-maroon hover:bg-maroon-dark text-white h-auto py-3"
              onClick={() => navigate('/admin/approve-applications')}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Review Applications
            </Button>
            <Button 
              className="bg-maroon hover:bg-maroon-dark text-white h-auto py-3"
              onClick={() => navigate('/admin/manage-courses')}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Manage Courses
            </Button>
            <Button 
              className="bg-maroon hover:bg-maroon-dark text-white h-auto py-3"
              onClick={() => navigate('/admin/payments')}
            >
              <DollarSign className="h-5 w-5 mr-2" />
              View Payments
            </Button>
            <Button 
              className="bg-maroon hover:bg-maroon-dark text-white h-auto py-3"
              onClick={() => navigate('/admin/manage-timetable')}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Manage Timetable
            </Button>
            <Button 
              className="bg-maroon hover:bg-maroon-dark text-white h-auto py-3"
              onClick={() => navigate('/admin/manage-results')}
            >
              <FileText className="h-5 w-5 mr-2" />
              Manage Results
            </Button>
          </div>
        </section>
        
        {/* Recent Applications */}
        <section>
          <h2 className="text-xl font-semibold text-maroon mb-4">Recent Applications</h2>
          {recentApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-gray-600">No applications have been submitted yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-maroon text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Courses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {application.type === 'RESIT' ? 'Resit' : 'Supplementary'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.courses.length} courses
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={application.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button
                            variant="link"
                            className="text-maroon hover:text-maroon-dark p-0"
                            onClick={() => navigate('/admin/approve-applications')}
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {recentApplications.length > 0 && (
            <div className="mt-4 text-right">
              <Button
                variant="outline"
                className="text-maroon border-maroon hover:bg-maroon hover:text-white"
                onClick={() => navigate('/admin/approve-applications')}
              >
                View All Applications
              </Button>
            </div>
          )}
        </section>
      </MainLayout>
    </>
  );
};

export default AdminDashboard;
