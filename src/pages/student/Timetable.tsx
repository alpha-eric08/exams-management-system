
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import MainLayout from '@/components/layout/MainLayout';
import MobileNavbar from '@/components/layout/MobileNavbar';

const Timetable = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { applications, timetableEntries, courses } = useData();
  const navigate = useNavigate();

  // Redirect if not authenticated or if admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Get the approved applications for this student
  const approvedApplications = applications.filter(
    app => app.studentId === user?.id && app.status === 'APPROVED'
  );

  // Get the course IDs from the approved applications
  const approvedCourseIds = approvedApplications.flatMap(app => app.courses);

  // Get the timetable entries for the approved courses
  const studentTimetable = timetableEntries.filter(
    entry => approvedCourseIds.includes(entry.courseId)
  );

  if (!isAuthenticated || isAdmin) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <>
      <MobileNavbar />
      <MainLayout title="Exam Timetable">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-maroon mb-2">Your Exam Timetable</h2>
          <p className="text-gray-600">
            View the schedule for your approved resit and supplementary examinations.
          </p>
        </div>

        {approvedApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-maroon mb-4">No Approved Applications</h3>
            <p className="text-gray-600">
              You don't have any approved resit or supplementary applications yet.
              Once your applications are approved, your exam timetable will appear here.
            </p>
          </div>
        ) : studentTimetable.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-maroon mb-4">Timetable Not Released Yet</h3>
            <p className="text-gray-600">
              Your applications have been approved, but the exam timetable has not been released yet.
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-maroon text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Venue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentTimetable.map((entry) => {
                    const course = courses.find(c => c.id === entry.courseId);
                    
                    return (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {course?.code}
                          </div>
                          <div className="text-sm text-gray-500">
                            {course?.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.startTime} - {entry.endTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.venue}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </MainLayout>
    </>
  );
};

export default Timetable;
