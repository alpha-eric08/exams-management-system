
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import MainLayout from '@/components/layout/MainLayout';
import MobileNavbar from '@/components/layout/MobileNavbar';
import StatusBadge from '@/components/ui/StatusBadge';

const PaymentsTracker = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { applications } = useData();
  const navigate = useNavigate();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/student/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Filter resit applications (only these have payments)
  const resitApplications = applications.filter(app => app.type === 'RESIT');

  // Calculate total payments
  const totalPaid = resitApplications
    .filter(app => app.paymentStatus === 'PAID')
    .reduce((sum, app) => sum + (app.totalFee || 0), 0);

  const totalUnpaid = resitApplications
    .filter(app => app.paymentStatus !== 'PAID')
    .reduce((sum, app) => sum + (app.totalFee || 0), 0);

  if (!isAuthenticated || !isAdmin) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <>
      <MobileNavbar />
      <MainLayout title="Payments Tracker">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-maroon mb-2">Payment Management</h2>
          <p className="text-gray-600">
            Track payments for resit applications.
          </p>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Payments</h3>
            <p className="text-3xl font-bold text-maroon">GHS {totalPaid}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Outstanding Payments</h3>
            <p className="text-3xl font-bold text-red-600">GHS {totalUnpaid}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Applications</h3>
            <p className="text-3xl font-bold text-blue-600">{resitApplications.length}</p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-maroon text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Application Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Number of Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resitApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.courses.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      GHS {application.totalFee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={application.paymentStatus || 'UNPAID'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default PaymentsTracker;
