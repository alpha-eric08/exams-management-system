
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import MainLayout from '@/components/layout/MainLayout';
import MobileNavbar from '@/components/layout/MobileNavbar';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText, Clock, DollarSign, FileCheck } from 'lucide-react';

const ApplicationStatus = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { applications, courses, updateApplication } = useData();
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

  // Separate applications by type
  const resitApplications = studentApplications.filter(app => app.type === 'RESIT');
  const supplementaryApplications = studentApplications.filter(app => app.type === 'SUPPLEMENTARY');

  // Function to display course names based on course IDs
  const getCourseNames = (courseIds: string[]) => {
    return courseIds.map(id => {
      const course = courses.find(c => c.id === id);
      return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    });
  };

  // Handle payment simulation
  const handlePaymentSimulation = async (applicationId: string, totalFee: number = 0) => {
    try {
      // In a real app, this would redirect to a payment gateway
      await updateApplication(applicationId, {
        paymentStatus: 'PAID',
      });
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  if (!isAuthenticated || isAdmin) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <>
      <MobileNavbar />
      <MainLayout title="Application Status">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-maroon mb-2">Your Applications</h2>
          <p className="text-gray-600">
            Track the status of your resit and supplementary applications.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="resit">Resit</TabsTrigger>
            <TabsTrigger value="supplementary">Supplementary</TabsTrigger>
          </TabsList>
          
          {/* All Applications Tab */}
          <TabsContent value="all">
            {studentApplications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-maroon mb-4">No Applications Found</h3>
                <p className="text-gray-600 mb-4">
                  You haven't submitted any resit or supplementary applications yet.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    className="bg-maroon hover:bg-maroon-dark text-white"
                    onClick={() => navigate('/student/resit-application')}
                  >
                    Apply for Resit
                  </Button>
                  <Button 
                    className="bg-maroon hover:bg-maroon-dark text-white"
                    onClick={() => navigate('/student/supplementary-application')}
                  >
                    Apply for Supplementary
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {studentApplications
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(application => {
                    const courseNames = getCourseNames(application.courses);
                    
                    return (
                      <Card key={application.id} className="border-l-4 border-maroon">
                        <CardHeader>
                          <div className="flex flex-col md:flex-row justify-between md:items-center">
                            <div>
                              <CardTitle className="flex items-center">
                                {application.type === 'RESIT' ? (
                                  <FileText className="h-5 w-5 mr-2 text-maroon" />
                                ) : (
                                  <FileCheck className="h-5 w-5 mr-2 text-maroon" />
                                )}
                                {application.type === 'RESIT' ? 'Resit Application' : 'Supplementary Application'}
                              </CardTitle>
                              <CardDescription>
                                Submitted on: {new Date(application.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <StatusBadge status={application.status} className="md:ml-4 mt-2 md:mt-0" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Selected Courses:</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {courseNames.map((name, index) => (
                                  <li key={index} className="text-sm">{name}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {application.type === 'RESIT' && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Details:</h4>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <p className="text-sm flex justify-between">
                                    <span>Total Fee:</span>
                                    <span className="font-semibold">GHS {application.totalFee}</span>
                                  </p>
                                  <p className="text-sm flex justify-between mt-1">
                                    <span>Payment Status:</span>
                                    <StatusBadge status={application.paymentStatus || 'UNPAID'} />
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {application.type === 'SUPPLEMENTARY' && application.documents && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Supporting Documents:</h4>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  {application.documents.map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <span className="text-sm">{doc.name}</span>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-maroon hover:text-maroon-dark"
                                        onClick={() => window.open(doc.url, '_blank')}
                                      >
                                        View
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {application.adminComments && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Comments:</h4>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <p className="text-sm">{application.adminComments}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          {application.type === 'RESIT' && application.paymentStatus === 'UNPAID' && application.status === 'PENDING' && (
                            <Button 
                              className="bg-gold hover:bg-amber-500 text-maroon"
                              onClick={() => handlePaymentSimulation(application.id, application.totalFee)}
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Pay Now
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
          
          {/* Resit Tab */}
          <TabsContent value="resit">
            {resitApplications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-maroon mb-4">No Resit Applications</h3>
                <p className="text-gray-600 mb-4">
                  You haven't submitted any resit applications yet.
                </p>
                <Button 
                  className="bg-maroon hover:bg-maroon-dark text-white"
                  onClick={() => navigate('/student/resit-application')}
                >
                  Apply for Resit
                </Button>
              </div>
            ) : (
              // Render resit applications (same format as all applications)
              <div className="space-y-6">
                {resitApplications
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(application => {
                    const courseNames = getCourseNames(application.courses);
                    
                    return (
                      <Card key={application.id} className="border-l-4 border-maroon">
                        <CardHeader>
                          <div className="flex flex-col md:flex-row justify-between md:items-center">
                            <div>
                              <CardTitle className="flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-maroon" />
                                Resit Application
                              </CardTitle>
                              <CardDescription>
                                Submitted on: {new Date(application.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <StatusBadge status={application.status} className="md:ml-4 mt-2 md:mt-0" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Selected Courses:</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {courseNames.map((name, index) => (
                                  <li key={index} className="text-sm">{name}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Details:</h4>
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm flex justify-between">
                                  <span>Total Fee:</span>
                                  <span className="font-semibold">GHS {application.totalFee}</span>
                                </p>
                                <p className="text-sm flex justify-between mt-1">
                                  <span>Payment Status:</span>
                                  <StatusBadge status={application.paymentStatus || 'UNPAID'} />
                                </p>
                              </div>
                            </div>
                            
                            {application.adminComments && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Comments:</h4>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <p className="text-sm">{application.adminComments}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          {application.paymentStatus === 'UNPAID' && application.status === 'PENDING' && (
                            <Button 
                              className="bg-gold hover:bg-amber-500 text-maroon"
                              onClick={() => handlePaymentSimulation(application.id, application.totalFee)}
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Pay Now
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
          
          {/* Supplementary Tab */}
          <TabsContent value="supplementary">
            {supplementaryApplications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-maroon mb-4">No Supplementary Applications</h3>
                <p className="text-gray-600 mb-4">
                  You haven't submitted any supplementary applications yet.
                </p>
                <Button 
                  className="bg-maroon hover:bg-maroon-dark text-white"
                  onClick={() => navigate('/student/supplementary-application')}
                >
                  Apply for Supplementary
                </Button>
              </div>
            ) : (
              // Render supplementary applications (same format as all applications)
              <div className="space-y-6">
                {supplementaryApplications
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(application => {
                    const courseNames = getCourseNames(application.courses);
                    
                    return (
                      <Card key={application.id} className="border-l-4 border-maroon">
                        <CardHeader>
                          <div className="flex flex-col md:flex-row justify-between md:items-center">
                            <div>
                              <CardTitle className="flex items-center">
                                <FileCheck className="h-5 w-5 mr-2 text-maroon" />
                                Supplementary Application
                              </CardTitle>
                              <CardDescription>
                                Submitted on: {new Date(application.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <StatusBadge status={application.status} className="md:ml-4 mt-2 md:mt-0" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Selected Courses:</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {courseNames.map((name, index) => (
                                  <li key={index} className="text-sm">{name}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {application.documents && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Supporting Documents:</h4>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  {application.documents.map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <span className="text-sm">{doc.name}</span>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-maroon hover:text-maroon-dark"
                                        onClick={() => window.open(doc.url, '_blank')}
                                      >
                                        View
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {application.adminComments && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Comments:</h4>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <p className="text-sm">{application.adminComments}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </MainLayout>
    </>
  );
};

export default ApplicationStatus;
