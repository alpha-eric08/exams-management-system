
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import MainLayout from '@/components/layout/MainLayout';
import MobileNavbar from '@/components/layout/MobileNavbar';

const ManageResults = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { results, applications, courses } = useData();
  const navigate = useNavigate();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/student/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <>
      <MobileNavbar />
      <MainLayout title="Manage Results">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-maroon mb-2">Results Management</h2>
          <p className="text-gray-600">
            Upload and manage results for resit and supplementary examinations.
          </p>
        </div>

        {/* Display results in a table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-maroon text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Exam Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => {
                  const course = courses.find(c => c.id === result.courseId);
                  const application = applications.find(a => a.id === result.applicationId);
                  
                  return (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {course?.code}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course?.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application?.type === 'RESIT' ? 'Resit' : 'Supplementary'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.score}/100
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {result.grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.passed ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Passed
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default ManageResults;
