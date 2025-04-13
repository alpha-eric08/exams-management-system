
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface Course {
  id: string;
  code: string;
  title: string;
  creditHours: number;
}

export interface FailedCourse extends Course {
  grade: string;
  semester: string;
  academicYear: string;
}

export interface ApplicationType {
  RESIT: 'RESIT';
  SUPPLEMENTARY: 'SUPPLEMENTARY';
}

export interface Application {
  id: string;
  type: 'RESIT' | 'SUPPLEMENTARY';
  studentId: string;
  courses: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  totalFee?: number;
  paymentStatus?: 'PAID' | 'UNPAID';
  documents?: {
    id: string;
    name: string;
    url: string;
  }[];
  adminComments?: string;
}

export interface TimetableEntry {
  id: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
}

export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  applicationId: string;
  score: number;
  grade: string;
  passed: boolean;
}

interface DataContextType {
  // Courses
  courses: Course[];
  failedCourses: FailedCourse[];
  
  // Applications
  applications: Application[];
  createApplication: (application: Omit<Application, 'id' | 'createdAt'>) => Promise<void>;
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>;
  
  // Timetable
  timetableEntries: TimetableEntry[];
  createTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => Promise<void>;
  updateTimetableEntry: (id: string, updates: Partial<TimetableEntry>) => Promise<void>;
  
  // Results
  results: Result[];
  createResult: (result: Omit<Result, 'id'>) => Promise<void>;
  updateResult: (id: string, updates: Partial<Result>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  
  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [failedCourses, setFailedCourses] = useState<FailedCourse[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [results, setResults] = useState<Result[]>([]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const mappedCourses: Course[] = data.map(course => ({
            id: course.id,
            code: course.code,
            title: course.title,
            creditHours: course.credit_hours
          }));
          
          setCourses(mappedCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    
    fetchCourses();
  }, []);

  // Fetch failed courses for the current user
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const fetchFailedCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('failed_courses')
          .select('*, course:courses(*)')
          .eq('user_id', user.id);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const mappedFailedCourses: FailedCourse[] = data.map(failedCourse => ({
            id: failedCourse.course.id,
            code: failedCourse.course.code,
            title: failedCourse.course.title,
            creditHours: failedCourse.course.credit_hours,
            grade: failedCourse.grade,
            semester: failedCourse.semester,
            academicYear: failedCourse.academic_year
          }));
          
          setFailedCourses(mappedFailedCourses);
        }
      } catch (error) {
        console.error('Error fetching failed courses:', error);
      }
    };
    
    fetchFailedCourses();
  }, [user, isAuthenticated]);

  // Fetch applications
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const fetchApplications = async () => {
      try {
        let query = supabase
          .from('applications')
          .select('*, application_courses(course_id), application_documents(*)');
        
        if (!user.isAdmin) {
          query = query.eq('user_id', user.id);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const mappedApplications: Application[] = data.map(app => ({
            id: app.id,
            type: app.type as 'RESIT' | 'SUPPLEMENTARY',
            studentId: app.user_id,
            courses: app.application_courses.map((ac: any) => ac.course_id),
            status: app.status as 'PENDING' | 'APPROVED' | 'REJECTED',
            createdAt: app.created_at,
            totalFee: app.total_fee,
            paymentStatus: app.payment_status as 'PAID' | 'UNPAID' | undefined,
            documents: app.application_documents.map((doc: any) => ({
              id: doc.id,
              name: doc.name,
              url: doc.url
            })),
            adminComments: app.admin_comments
          }));
          
          setApplications(mappedApplications);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    
    fetchApplications();
  }, [user, isAuthenticated]);

  // Fetch timetable entries
  useEffect(() => {
    const fetchTimetableEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('timetable_entries')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const mappedEntries: TimetableEntry[] = data.map(entry => ({
            id: entry.id,
            courseId: entry.course_id,
            date: entry.date,
            startTime: entry.start_time,
            endTime: entry.end_time,
            venue: entry.venue
          }));
          
          setTimetableEntries(mappedEntries);
        }
      } catch (error) {
        console.error('Error fetching timetable entries:', error);
      }
    };
    
    fetchTimetableEntries();
  }, []);

  // Fetch results
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const fetchResults = async () => {
      try {
        let query = supabase
          .from('results')
          .select('*');
        
        if (!user.isAdmin) {
          query = query.eq('user_id', user.id);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const mappedResults: Result[] = data.map(result => ({
            id: result.id,
            studentId: result.user_id,
            courseId: result.course_id,
            applicationId: result.application_id,
            score: result.score,
            grade: result.grade,
            passed: result.passed
          }));
          
          setResults(mappedResults);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
    
    fetchResults();
  }, [user, isAuthenticated]);

  // CRUD Operations
  const createApplication = async (application: Omit<Application, 'id' | 'createdAt'>) => {
    try {
      if (!user) throw new Error('You must be logged in');
      
      // Insert the application
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .insert([{
          type: application.type,
          user_id: user.id,
          status: application.status,
          total_fee: application.totalFee,
          payment_status: application.paymentStatus,
          admin_comments: application.adminComments
        }])
        .select();
      
      if (appError) throw appError;
      if (!appData || appData.length === 0) throw new Error('Failed to create application');
      
      const newAppId = appData[0].id;
      
      // Insert application courses
      const coursesToInsert = application.courses.map(courseId => ({
        application_id: newAppId,
        course_id: courseId
      }));
      
      const { error: coursesError } = await supabase
        .from('application_courses')
        .insert(coursesToInsert);
      
      if (coursesError) throw coursesError;
      
      // Insert documents if any
      if (application.documents && application.documents.length > 0) {
        const documentsToInsert = application.documents.map(doc => ({
          application_id: newAppId,
          name: doc.name,
          url: doc.url
        }));
        
        const { error: docsError } = await supabase
          .from('application_documents')
          .insert(documentsToInsert);
        
        if (docsError) throw docsError;
      }
      
      // Refetch applications to update state
      const { data: updatedApplications, error: fetchError } = await supabase
        .from('applications')
        .select('*, application_courses(course_id), application_documents(*)')
        .eq('id', newAppId);
      
      if (fetchError) throw fetchError;
      
      if (updatedApplications && updatedApplications.length > 0) {
        const newApp = updatedApplications[0];
        const mappedApp: Application = {
          id: newApp.id,
          type: newApp.type as 'RESIT' | 'SUPPLEMENTARY',
          studentId: newApp.user_id,
          courses: newApp.application_courses.map((ac: any) => ac.course_id),
          status: newApp.status as 'PENDING' | 'APPROVED' | 'REJECTED',
          createdAt: newApp.created_at,
          totalFee: newApp.total_fee,
          paymentStatus: newApp.payment_status as 'PAID' | 'UNPAID' | undefined,
          documents: newApp.application_documents.map((doc: any) => ({
            id: doc.id,
            name: doc.name,
            url: doc.url
          })),
          adminComments: newApp.admin_comments
        };
        
        setApplications(prev => [...prev, mappedApp]);
      }
      
      toast({
        title: 'Application submitted',
        description: 'Your application has been successfully submitted.',
      });
      
    } catch (error) {
      console.error('Error creating application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
      });
      return Promise.reject(error);
    }
  };

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    try {
      const updateData: any = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.paymentStatus) updateData.payment_status = updates.paymentStatus;
      if (updates.adminComments) updateData.admin_comments = updates.adminComments;
      if (updates.totalFee) updateData.total_fee = updates.totalFee;
      
      const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      setApplications(prev => 
        prev.map(app => (app.id === id ? { ...app, ...updates } : app))
      );
      
      toast({
        title: 'Application updated',
        description: 'The application has been successfully updated.',
      });
      
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update application. Please try again.',
      });
      return Promise.reject(error);
    }
  };

  const createTimetableEntry = async (entry: Omit<TimetableEntry, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('timetable_entries')
        .insert([{
          course_id: entry.courseId,
          date: entry.date,
          start_time: entry.startTime,
          end_time: entry.endTime,
          venue: entry.venue
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newEntry: TimetableEntry = {
          id: data[0].id,
          courseId: data[0].course_id,
          date: data[0].date,
          startTime: data[0].start_time,
          endTime: data[0].end_time,
          venue: data[0].venue
        };
        
        setTimetableEntries(prev => [...prev, newEntry]);
        
        toast({
          title: 'Timetable updated',
          description: 'The timetable entry has been successfully added.',
        });
      }
      
    } catch (error) {
      console.error('Error creating timetable entry:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add timetable entry. Please try again.',
      });
      return Promise.reject(error);
    }
  };

  const updateTimetableEntry = async (id: string, updates: Partial<TimetableEntry>) => {
    try {
      const updateData: any = {};
      
      if (updates.courseId) updateData.course_id = updates.courseId;
      if (updates.date) updateData.date = updates.date;
      if (updates.startTime) updateData.start_time = updates.startTime;
      if (updates.endTime) updateData.end_time = updates.endTime;
      if (updates.venue) updateData.venue = updates.venue;
      
      const { error } = await supabase
        .from('timetable_entries')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      setTimetableEntries(prev => 
        prev.map(entry => (entry.id === id ? { ...entry, ...updates } : entry))
      );
      
      toast({
        title: 'Timetable updated',
        description: 'The timetable entry has been successfully updated.',
      });
      
    } catch (error) {
      console.error('Error updating timetable entry:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update timetable entry. Please try again.',
      });
      return Promise.reject(error);
    }
  };

  const createResult = async (result: Omit<Result, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('results')
        .insert([{
          user_id: result.studentId,
          course_id: result.courseId,
          application_id: result.applicationId,
          score: result.score,
          grade: result.grade,
          passed: result.passed
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newResult: Result = {
          id: data[0].id,
          studentId: data[0].user_id,
          courseId: data[0].course_id,
          applicationId: data[0].application_id,
          score: data[0].score,
          grade: data[0].grade,
          passed: data[0].passed
        };
        
        setResults(prev => [...prev, newResult]);
        
        toast({
          title: 'Result added',
          description: 'The result has been successfully added.',
        });
      }
      
    } catch (error) {
      console.error('Error creating result:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add result. Please try again.',
      });
      return Promise.reject(error);
    }
  };

  const updateResult = async (id: string, updates: Partial<Result>) => {
    try {
      const updateData: any = {};
      
      if (updates.score !== undefined) updateData.score = updates.score;
      if (updates.grade) updateData.grade = updates.grade;
      if (updates.passed !== undefined) updateData.passed = updates.passed;
      
      const { error } = await supabase
        .from('results')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      setResults(prev => 
        prev.map(result => (result.id === id ? { ...result, ...updates } : result))
      );
      
      toast({
        title: 'Result updated',
        description: 'The result has been successfully updated.',
      });
      
    } catch (error) {
      console.error('Error updating result:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update result. Please try again.',
      });
      return Promise.reject(error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        // Courses
        courses,
        failedCourses,
        
        // Applications
        applications,
        createApplication,
        updateApplication,
        
        // Timetable
        timetableEntries,
        createTimetableEntry,
        updateTimetableEntry,
        
        // Results
        results,
        createResult,
        updateResult,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
