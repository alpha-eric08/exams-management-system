
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If already authenticated, redirect to the appropriate dashboard
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin/dashboard' : '/student/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <header className="bg-maroon text-white">
        <div className="container mx-auto py-12 px-4 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gold">University Exam Management System</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            A comprehensive system for students to apply for resit and supplementary exams,
            and for administrators to manage the process efficiently.
          </p>
          <Button 
            className="bg-gold hover:bg-amber-500 text-maroon text-lg px-6 py-4 rounded-md"
            onClick={() => navigate('/login')}
          >
            Login to Portal
          </Button>
        </div>
      </header>
      
      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-maroon text-center mb-12">System Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gold mb-4">Resit Applications</h3>
              <p className="text-gray-700">
                Students who failed a paper can apply for a resit, pay the fee,
                and wait for admin approval.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gold mb-4">Supplementary Applications</h3>
              <p className="text-gray-700">
                Students who missed an exam can apply for supplementary exams
                by uploading valid supporting documents.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gold mb-4">Application Tracking</h3>
              <p className="text-gray-700">
                Track the status of your applications, view timetables,
                and check results once they are released.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gold mb-4">Exam Timetables</h3>
              <p className="text-gray-700">
                Access your personalized exam timetable once your application is approved.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gold mb-4">Result Viewing</h3>
              <p className="text-gray-700">
                Check your results as soon as they are released by the administration.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gold mb-4">Online Payments</h3>
              <p className="text-gray-700">
                Make secure online payments for your resit applications.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="bg-maroon-dark text-white py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gold text-center mb-12">How It Works</h2>
          
          <div className="max-w-4xl mx-auto md:flex justify-between">
            {/* Resit Process */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4">Resit Process</h3>
              <ol className="list-decimal list-inside space-y-3">
                <li className="pl-2">Login to your student dashboard</li>
                <li className="pl-2">View your failed courses</li>
                <li className="pl-2">Select the courses you want to resit</li>
                <li className="pl-2">Pay the fee (GHS 100 per paper)</li>
                <li className="pl-2">Wait for admin approval</li>
                <li className="pl-2">Check your timetable</li>
                <li className="pl-2">Write the exam</li>
                <li className="pl-2">View your results</li>
              </ol>
            </div>
            
            {/* Supplementary Process */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Supplementary Process</h3>
              <ol className="list-decimal list-inside space-y-3">
                <li className="pl-2">Login to your student dashboard</li>
                <li className="pl-2">Select the courses you missed</li>
                <li className="pl-2">Upload supporting documentation</li>
                <li className="pl-2">Wait for admin approval</li>
                <li className="pl-2">Check your timetable</li>
                <li className="pl-2">Write the exam</li>
                <li className="pl-2">View your results</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-maroon text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <h3 className="text-gold text-xl font-bold mb-4">University Exam Management System</h3>
            <p className="mb-4">&copy; {new Date().getFullYear()} All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
