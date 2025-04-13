
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Application } from '@/contexts/DataContext';
import MainLayout from '@/components/layout/MainLayout';
import MobileNavbar from '@/components/layout/MobileNavbar';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { 
  Search, 
  Check, 
  X, 
  FileText, 
  FileCheck,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ApproveApplications = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { applications, courses, updateApplication } = useData();
  const navigate = useNavigate();

  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/student/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Initialize filtered applications
  useEffect(() => {
    setFilteredApplications(applications);
  }, [applications]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredApplications(applications);
      return;
    }
    
    const filtered = applications.filter(app => {
      // Search by application type
      if (app.type.toLowerCase().includes(term)) return true;
      
      // Search by status
      if (app.status.toLowerCase().includes(term)) return true;
      
      // Search by course code (if we had student data we could search by name too)
      return app.courses.some(courseId => {
        const course = courses.find(c => c.id === courseId);
        return course?.code.toLowerCase().includes(term) || course?.title.toLowerCase().includes(term);
      });
    });
    
    setFilteredApplications(filtered);
  };

  // Filter applications by type
  const resitApplications = filteredApplications.filter(app => app.type === 'RESIT');
  const supplementaryApplications = filteredApplications.filter(app => app.type === 'SUPPLEMENTARY');
  
  // Handle approval
  const handleApprove = async () => {
    if (!selectedApplication) return;
    
    setIsProcessing(true);
    
    try {
      await updateApplication(selectedApplication.id, {
        status: 'APPROVED',
        adminComments: adminComment || 'Application approved',
      });
      
      toast({
        title: 'Application approved',
        description: 'The application has been successfully approved.',
      });
      
      setShowApproveDialog(false);
      setSelectedApplication(null);
      setAdminComment('');
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve application. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle rejection
  const handleReject = async () => {
    if (!selectedApplication) return;
    if (!adminComment) {
      toast({
        variant: 'destructive',
        title: 'Comment required',
        description: 'Please provide a reason for rejecting this application.',
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await updateApplication(selectedApplication.id, {
        status: 'REJECTED',
        adminComments: adminComment,
      });
      
      toast({
        title: 'Application rejected',
        description: 'The application has been rejected.',
      });
      
      setShowRejectDialog(false);
      setSelectedApplication(null);
      setAdminComment('');
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reject application. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null; // Redirect will happen in useEffect
  }

  // Function to display course names based on course IDs
  const getCourseNames = (courseIds: string[]) => {
    return courseIds.map(id => {
      const course = courses.find(c => c.id === id);
      return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    });
  };

  // Render application table
  const renderApplicationTable = (apps: Application[]) => {
    if (apps.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No applications found.</p>
        </div>
      );
    }

    return (
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
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apps.map((application) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.type === 'RESIT' ? (
                      <StatusBadge status={application.paymentStatus || 'UNPAID'} />
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setSelectedApplication(application);
                          // Here we would show a details dialog, but for simplicity we just show approve/reject
                          // For a real app, we'd show all application details in a modal
                          toast({
                            title: 'Application Details',
                            description: `Selected ${application.courses.length} courses. ${
                              application.type === 'RESIT'
                                ? `Fee: GHS ${application.totalFee}`
                                : 'Supporting documents available'
                            }`,
                          });
                        }}
                      >
                        Details
                      </Button>
                      
                      {application.status === 'PENDING' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-800"
                            onClick={() => {
                              // For RESIT applications, only allow approval if paid
                              if (application.type === 'RESIT' && application.paymentStatus !== 'PAID') {
                                toast({
                                  variant: 'destructive',
                                  title: 'Cannot approve',
                                  description: 'This resit application has not been paid for yet.',
                                });
                                return;
                              }
                              
                              setSelectedApplication(application);
                              setShowApproveDialog(true);
                            }}
                          >
                            Approve
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowRejectDialog(true);
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <MobileNavbar />
      <MainLayout title="Approve Applications">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-maroon mb-2">Application Management</h2>
          <p className="text-gray-600">
            Review and approve/reject student applications for resit and supplementary examinations.
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Applications Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="resit">Resit</TabsTrigger>
            <TabsTrigger value="supplementary">Supplementary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {renderApplicationTable(filteredApplications)}
          </TabsContent>
          
          <TabsContent value="resit">
            {renderApplicationTable(resitApplications)}
          </TabsContent>
          
          <TabsContent value="supplementary">
            {renderApplicationTable(supplementaryApplications)}
          </TabsContent>
        </Tabs>

        {/* Approve Dialog */}
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Application</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this {selectedApplication?.type.toLowerCase()} application?
                This will allow the student to attend the examination.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-2">
              <label htmlFor="admin-comment" className="block text-sm font-medium text-gray-700 mb-1">
                Comments (optional)
              </label>
              <Textarea
                id="admin-comment"
                placeholder="Add any comments or notes..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
              />
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowApproveDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleApprove}
                disabled={isProcessing}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Confirm Approval'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Application</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject this {selectedApplication?.type.toLowerCase()} application?
                The student will not be allowed to attend the examination.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-2">
              <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for rejection <span className="text-red-600">*</span>
              </label>
              <Textarea
                id="reject-reason"
                placeholder="Provide a reason for rejecting this application..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="border-red-200 focus:border-red-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                This reason will be visible to the student.
              </p>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleReject}
                disabled={isProcessing || !adminComment}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Confirm Rejection'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </>
  );
};

export default ApproveApplications;
