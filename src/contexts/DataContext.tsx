
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

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
  // Mock initial data
  const initialCourses: Course[] = [
    { id: '1', code: 'MATH201', title: 'Calculus II', creditHours: 3 },
    { id: '2', code: 'COMP205', title: 'Data Structures', creditHours: 4 },
    { id: '3', code: 'PHYS210', title: 'Electromagnetism', creditHours: 3 },
    { id: '4', code: 'ENGL104', title: 'Technical Writing', creditHours: 2 },
    { id: '5', code: 'CHEM201', title: 'Organic Chemistry', creditHours: 3 },
  ];

  const initialFailedCourses: FailedCourse[] = [
    {
      id: '1',
      code: 'MATH201',
      title: 'Calculus II',
      creditHours: 3,
      grade: 'F',
      semester: 'First',
      academicYear: '2023/2024',
    },
    {
      id: '3',
      code: 'PHYS210',
      title: 'Electromagnetism',
      creditHours: 3,
      grade: 'E',
      semester: 'First',
      academicYear: '2023/2024',
    },
  ];

  const initialApplications: Application[] = [];
  const initialTimetableEntries: TimetableEntry[] = [];
  const initialResults: Result[] = [];

  // State
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [failedCourses, setFailedCourses] = useState<FailedCourse[]>(initialFailedCourses);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>(initialTimetableEntries);
  const [results, setResults] = useState<Result[]>(initialResults);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) setCourses(JSON.parse(storedCourses));
    
    const storedFailedCourses = localStorage.getItem('failedCourses');
    if (storedFailedCourses) setFailedCourses(JSON.parse(storedFailedCourses));
    
    const storedApplications = localStorage.getItem('applications');
    if (storedApplications) setApplications(JSON.parse(storedApplications));
    
    const storedTimetableEntries = localStorage.getItem('timetableEntries');
    if (storedTimetableEntries) setTimetableEntries(JSON.parse(storedTimetableEntries));
    
    const storedResults = localStorage.getItem('results');
    if (storedResults) setResults(JSON.parse(storedResults));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('failedCourses', JSON.stringify(failedCourses));
  }, [failedCourses]);

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('timetableEntries', JSON.stringify(timetableEntries));
  }, [timetableEntries]);

  useEffect(() => {
    localStorage.setItem('results', JSON.stringify(results));
  }, [results]);

  // CRUD Operations
  const createApplication = async (application: Omit<Application, 'id' | 'createdAt'>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newApplication: Application = {
        ...application,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      setApplications(prev => [...prev, newApplication]);
      
      toast({
        title: 'Application submitted',
        description: 'Your application has been successfully submitted.',
      });
      
      return Promise.resolve();
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApplications(prev => 
        prev.map(app => (app.id === id ? { ...app, ...updates } : app))
      );
      
      toast({
        title: 'Application updated',
        description: 'The application has been successfully updated.',
      });
      
      return Promise.resolve();
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newEntry: TimetableEntry = {
        ...entry,
        id: Date.now().toString(),
      };
      
      setTimetableEntries(prev => [...prev, newEntry]);
      
      toast({
        title: 'Timetable updated',
        description: 'The timetable entry has been successfully added.',
      });
      
      return Promise.resolve();
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTimetableEntries(prev => 
        prev.map(entry => (entry.id === id ? { ...entry, ...updates } : entry))
      );
      
      toast({
        title: 'Timetable updated',
        description: 'The timetable entry has been successfully updated.',
      });
      
      return Promise.resolve();
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newResult: Result = {
        ...result,
        id: Date.now().toString(),
      };
      
      setResults(prev => [...prev, newResult]);
      
      toast({
        title: 'Result added',
        description: 'The result has been successfully added.',
      });
      
      return Promise.resolve();
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setResults(prev => 
        prev.map(result => (result.id === id ? { ...result, ...updates } : result))
      );
      
      toast({
        title: 'Result updated',
        description: 'The result has been successfully updated.',
      });
      
      return Promise.resolve();
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
