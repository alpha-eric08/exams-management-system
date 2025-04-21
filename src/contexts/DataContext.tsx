'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import { Application, Course, Result, TimetableEntry } from "@/types/types";
import { db } from "@/integrations/firebase.config";

const DataContext = createContext({} as any);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [failedCourses, setFailedCourses] = useState<Course[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [coursesSnap, failedCoursesSnap, applicationsSnap, timetableSnap, resultsSnap] = await Promise.all([
        getDocs(collection(db, "courses")),
        getDocs(query(collection(db, "courses"), where("status", "==", "failed"))),
        getDocs(collection(db, "applications")),
        getDocs(collection(db, "timetable_entries")),
        getDocs(collection(db, "results")),
      ]);

      setCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
      setFailedCourses(failedCoursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
      setApplications(applicationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application)));
      setTimetableEntries(timetableSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimetableEntry)));
      setResults(resultsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result)));
    };

    fetchData();
  }, []);

  // CREATE APPLICATION
  const createApplication = async (application: Omit<Application, "id">) => {
    await addDoc(collection(db, "applications"), application);
    toast({ title: "Application created", description: "Submitted successfully." });
  };

  // UPDATE APPLICATION
  const updateApplication = async (id: string, updates: Partial<Application>) => {
    const ref = doc(db, "applications", id);
    await updateDoc(ref, updates);
    toast({ title: "Application updated", description: "Updated successfully." });
  };

  // CREATE TIMETABLE ENTRY
  const createTimetableEntry = async (entry: Omit<TimetableEntry, "id">) => {
    await addDoc(collection(db, "timetable_entries"), entry);
    toast({ title: "Timetable created", description: "Entry added." });
  };

  // UPDATE TIMETABLE ENTRY
  const updateTimetableEntry = async (id: string, updates: Partial<TimetableEntry>) => {
    const ref = doc(db, "timetable_entries", id);
    await updateDoc(ref, updates);
    toast({ title: "Timetable updated", description: "Timetable entry updated." });
  };

  // CREATE RESULT
  const createResult = async (result: Omit<Result, "id">) => {
    await addDoc(collection(db, "results"), result);
    toast({ title: "Result added", description: "Result recorded successfully." });
  };

  // UPDATE RESULT
  const updateResult = async (id: string, updates: Partial<Result>) => {
    const ref = doc(db, "results", id);
    await updateDoc(ref, updates);
    toast({ title: "Result updated", description: "Result updated successfully." });
  };

  return (
    <DataContext.Provider
      value={{
        courses,
        failedCourses,
        applications,
        timetableEntries,
        results,
        createApplication,
        updateApplication,
        createTimetableEntry,
        updateTimetableEntry,
        createResult,
        updateResult,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
