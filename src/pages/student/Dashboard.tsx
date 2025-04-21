
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import { Calendar, FileText, Clock, FileCheck } from 'lucide-react';

const StudentDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { applications, failedCourses } = useData();
  const navigate = useNavigate();

  // Redirect if not authenticated or if admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Get the student's applications
  const studentApplications = applications.filter(
    application => application.studentId === user?.id
  );

  // Count applications by type and status
  const stats = {
    totalResit: studentApplications.filter(app => app.type === 'RESIT').length,
    totalSupplementary: studentApplications.filter(app => app.type === 'SUPPLEMENTARY').length,
    pendingApplications: studentApplications.filter(app => app.status === 'PENDING').length,
    approvedApplications: studentApplications.filter(app => app.status === 'APPROVED').length,
    failedCourses: failedCourses.length,
  };

  // Get the latest application (if any)
  const latestApplication = studentApplications.length > 0
    ? studentApplications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
    : null;

  if (!isAuthenticated || isAdmin) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <>
      <MainLayout title="Student Dashboard">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-maroon mb-2">Welcome, {user?.name}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <p><span className="font-medium">Student ID:</span> {user?.studentId}</p>
              <p><span className="font-medium">Program:</span> {user?.program}</p>
              <p><span className="font-medium">Level:</span> {user?.level}</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-maroon mb-4">Application Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Failed Courses */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Failed Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{stats.failedCourses}</span>
                  <FileText className="h-5 w-5 text-maroon" />
                </div>
              </CardContent>
            </Card>
            
            {/* Resit Applications */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Resit Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{stats.totalResit}</span>
                  <Calendar className="h-5 w-5 text-maroon" />
                </div>
              </CardContent>
            </Card>
            
            {/* Supplementary Applications */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Supplementary Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{stats.totalSupplementary}</span>
                  <Clock className="h-5 w-5 text-maroon" />
                </div>
              </CardContent>
            </Card>
            
            {/* Approved Applications */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Approved Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{stats.approvedApplications}</span>
                  <FileCheck className="h-5 w-5 text-maroon" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-maroon mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button 
              className="bg-maroon hover:bg-maroon-dark text-white h-auto py-3"
              onClick={() => navigate('/student/resit-application')}
            >
              Apply for Resit Exam
            </Button>
            <Button 
              className="bg-maroon hover:bg-maroon-dark text-white h-auto py-3"
              onClick={() => navigate('/student/supplementary-application')}
            >
              Apply for Supplementary Exam
            </Button>
            <Button 
              className="bg-maroon hover:bg-maroon-dark text-white h-auto py-3"
              onClick={() => navigate('/student/application-status')}
            >
              Check Application Status
            </Button>
            <Button 
              className="bg-maroon hover:bg-maroon-dark text-white h-auto py-3"
              onClick={() => navigate('/student/timetable')}
            >
              View Exam Timetable
            </Button>
            <Button 
              className="bg-maroon hover:bg-maroon-dark text-white h-auto py-3"
              onClick={() => navigate('/student/results')}
            >
              Check Results
            </Button>
          </div>
        </section>

        {/* Latest Application */}
        {latestApplication && (
          <section>
            <h2 className="text-xl font-semibold text-maroon mb-4">Latest Application</h2>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {latestApplication.type === 'RESIT' ? 'Resit' : 'Supplementary'} Application
                  </CardTitle>
                  <StatusBadge status={latestApplication.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Submitted on:</span>{' '}
                    {new Date(latestApplication.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Courses:</span>{' '}
                    {latestApplication.courses.length}
                  </p>
                  {latestApplication.type === 'RESIT' && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Total Fee:</span>{' '}
                      GHS {latestApplication.totalFee}
                    </p>
                  )}
                  {latestApplication.type === 'RESIT' && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Payment Status:</span>{' '}
                      <StatusBadge status={latestApplication.paymentStatus || 'UNPAID'} />
                    </p>
                  )}
                </div>
                
                <Button 
                  className="mt-4 bg-maroon hover:bg-maroon-dark text-white"
                  onClick={() => navigate('/student/application-status')}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </MainLayout>
    </>
  );
};

export default StudentDashboard;
