
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import MainLayout from '@/components/layout/MainLayout';
import MobileNavbar from '@/components/layout/MobileNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ManageResults = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { results, applications, courses, createResult } = useData();
  const navigate = useNavigate();
  
  // State for dialog and form
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [resultForm, setResultForm] = useState({
    studentId: '',
    courseId: '',
    applicationId: '',
    score: 0,
    grade: '',
    passed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<Application[]>([]);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/student/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Filter applications when student ID changes
  useEffect(() => {
    if (resultForm.studentId) {
      const filtered = applications.filter(app => app.studentId === resultForm.studentId);
      setSelectedApplications(filtered);
      
      // Reset application and course if they don't match the new student
      if (!filtered.some(app => app.id === resultForm.applicationId)) {
        setResultForm(prev => ({
          ...prev,
          applicationId: '',
          courseId: ''
        }));
      }
    } else {
      setSelectedApplications([]);
    }
  }, [resultForm.studentId, applications]);

  // Calculate grade based on score
  useEffect(() => {
    const score = resultForm.score;
    let grade = '';
    let passed = false;
    
    if (score >= 80) {
      grade = 'A';
      passed = true;
    } else if (score >= 75) {
      grade = 'B+';
      passed = true;
    } else if (score >= 70) {
      grade = 'B';
      passed = true;
    } else if (score >= 65) {
      grade = 'C+';
      passed = true;
    } else if (score >= 60) {
      grade = 'C';
      passed = true;
    } else if (score >= 55) {
      grade = 'D+';
      passed = true;
    } else if (score >= 50) {
      grade = 'D';
      passed = true;
    } else {
      grade = 'F';
      passed = false;
    }
    
    setResultForm(prev => ({...prev, grade, passed}));
  }, [resultForm.score]);

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createResult({
        studentId: resultForm.studentId,
        courseId: resultForm.courseId,
        applicationId: resultForm.applicationId,
        score: resultForm.score,
        grade: resultForm.grade,
        passed: resultForm.passed
      });
      
      toast({
        title: 'Result added',
        description: 'The examination result has been successfully added.',
      });
      
      setAddDialogOpen(false);
      setResultForm({
        studentId: '',
        courseId: '',
        applicationId: '',
        score: 0,
        grade: '',
        passed: false
      });
      
    } catch (error) {
      console.error('Error adding result:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to add result',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get available courses for the selected application
  const getAvailableCourses = () => {
    if (!resultForm.applicationId) return [];
    
    const application = applications.find(app => app.id === resultForm.applicationId);
    if (!application) return [];
    
    return courses.filter(course => application.courses.includes(course.id));
  };

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

        <div className="mb-6">
          <Button 
            className="bg-maroon hover:bg-maroon-dark text-white"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Result
          </Button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Result Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Examination Result</DialogTitle>
              <DialogDescription>
                Enter the student result details
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddResult} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={resultForm.studentId}
                  onChange={(e) => setResultForm({...resultForm, studentId: e.target.value})}
                  placeholder="Enter student ID"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="applicationSelect">Application</Label>
                <Select
                  value={resultForm.applicationId}
                  onValueChange={(value) => setResultForm({...resultForm, applicationId: value, courseId: ''})}
                  disabled={selectedApplications.length === 0}
                  required
                >
                  <SelectTrigger id="applicationSelect" className="w-full">
                    <SelectValue placeholder="Select application" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedApplications.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.type} Application ({new Date(app.createdAt).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="courseSelect">Course</Label>
                <Select
                  value={resultForm.courseId}
                  onValueChange={(value) => setResultForm({...resultForm, courseId: value})}
                  disabled={!resultForm.applicationId}
                  required
                >
                  <SelectTrigger id="courseSelect" className="w-full">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableCourses().map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code} - {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="score">Score (0-100)</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="100"
                  value={resultForm.score}
                  onChange={(e) => setResultForm({...resultForm, score: parseInt(e.target.value, 10)})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade (Calculated)</Label>
                  <Input
                    id="grade"
                    value={resultForm.grade}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={resultForm.passed ? "Passed" : "Failed"}
                    readOnly
                    className={`${
                      resultForm.passed ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                    }`}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-maroon hover:bg-maroon-dark"
                  disabled={isSubmitting || !resultForm.studentId || !resultForm.applicationId || !resultForm.courseId}
                >
                  {isSubmitting ? 'Adding...' : 'Add Result'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </>
  );
};

export default ManageResults;
