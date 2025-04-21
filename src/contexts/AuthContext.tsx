import {
  createContext, useContext, useState, useEffect, ReactNode
} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc, getDoc, setDoc
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { auth, db } from '@/integrations/firebase.config';

interface UserProfile {
  id: string;
  name: string;
  email: string | null;
  role: 'student' | 'admin';
  studentId?: string | null;
  program?: string | null;
  level?: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  session: FirebaseUser | null;
  createUser: (
    name: string,
    email: string,
    password: string,
    isAdmin: boolean,
    studentDetails?: {
      studentId?: string;
      program?: string;
      level?: string;
    }
  ) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setSession(firebaseUser);

      if (firebaseUser) {
        const profileRef = doc(db, 'profiles', firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profile = profileSnap.data();
          setUser({
            id: firebaseUser.uid,
            name: profile.name,
            email: firebaseUser.email,
            role: profile.isAdmin ? 'admin' : 'student',
            studentId: profile.studentId || null,
            program: profile.program || null,
            level: profile.level || null,
            isAdmin: profile.isAdmin
          });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Login successful', description: 'Welcome back!' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setSession(null);
      navigate('/login');
      toast({ title: 'Logged out', description: 'You have been successfully logged out' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Logout failed',
        description: 'Failed to log out. Please try again.'
      });
    }
  };

  const createUser = async (
    name: string,
    email: string,
    password: string,
    isAdmin: boolean,
    studentDetails?: {
      studentId?: string;
      program?: string;
      level?: string;
    }
  ): Promise<{ success: boolean; message: string }> => {
    if (!user?.isAdmin) {
      return { success: false, message: 'Only administrators can create accounts' };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await setDoc(doc(db, 'profiles', newUser.uid), {
        name,
        email,
        isAdmin,
        studentId: studentDetails?.studentId || null,
        program: studentDetails?.program || null,
        level: studentDetails?.level || null
      });

      return {
        success: true,
        message: `Successfully created ${isAdmin ? 'admin' : 'student'} account for ${email}`
      };
    } catch (error: any) {
      console.error('Account creation error:', error);
      return {
        success: false,
        message: error.message || 'An unknown error occurred'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        createUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// import {
//   createContext, useContext, useState, useEffect, ReactNode
// } from 'react';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   User as FirebaseUser
// } from 'firebase/auth';
// import {
//   doc, getDoc, setDoc
// } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import { toast } from '@/components/ui/use-toast';
// import { auth, db } from '@/integrations/firebase.config';

// interface UserProfile {
//   id: string;
//   name: string;
//   email: string | null;
//   role: 'student' | 'admin';
//   studentId?: string | null;
//   program?: string | null;
//   level?: string | null;
//   isAdmin: boolean;
// }

// interface AuthContextType {
//   user: UserProfile | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   isAuthenticated: boolean;
//   isAdmin: boolean;
//   session: FirebaseUser | null;
//   createUser: (
//     name: string,
//     email: string,
//     password: string,
//     isAdmin: boolean,
//     studentDetails?: {
//       studentId?: string;
//       program?: string;
//       level?: string;
//     }
//   ) => Promise<{ success: boolean; message: string }>;
//   signup: (
//     name: string,
//     email: string,
//     password: string,
//     studentId: string,
//     program: string,
//     level: string
//   ) => Promise<{ success: boolean; message: string }>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [session, setSession] = useState<FirebaseUser | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       setSession(firebaseUser);

//       if (firebaseUser) {
//         const profileRef = doc(db, 'profiles', firebaseUser.uid);
//         const profileSnap = await getDoc(profileRef);

//         if (profileSnap.exists()) {
//           const profile = profileSnap.data();
//           setUser({
//             id: firebaseUser.uid,
//             name: profile.name,
//             email: firebaseUser.email,
//             role: profile.isAdmin ? 'admin' : 'student',
//             studentId: profile.studentId || null,
//             program: profile.program || null,
//             level: profile.level || null,
//             isAdmin: profile.isAdmin
//           });
//         }
//       } else {
//         setUser(null);
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       toast({ title: 'Login successful', description: 'Welcome back!' });
//     } catch (error: any) {
//       toast({
//         variant: 'destructive',
//         title: 'Login failed',
//         description: error.message
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//       setSession(null);
//       navigate('/login');
//       toast({ title: 'Logged out', description: 'You have been successfully logged out' });
//     } catch (error) {
//       toast({
//         variant: 'destructive',
//         title: 'Logout failed',
//         description: 'Failed to log out. Please try again.'
//       });
//     }
//   };

//   const createUser = async (
//     name: string,
//     email: string,
//     password: string,
//     isAdmin: boolean,
//     studentDetails?: {
//       studentId?: string;
//       program?: string;
//       level?: string;
//     }
//   ): Promise<{ success: boolean; message: string }> => {
//     if (!user?.isAdmin) {
//       return { success: false, message: 'Only administrators can create accounts' };
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const newUser = userCredential.user;

//       await setDoc(doc(db, 'profiles', newUser.uid), {
//         name,
//         email,
//         isAdmin,
//         studentId: studentDetails?.studentId || null,
//         program: studentDetails?.program || null,
//         level: studentDetails?.level || null
//       });

//       return {
//         success: true,
//         message: `Successfully created ${isAdmin ? 'admin' : 'student'} account for ${email}`
//       };
//     } catch (error: any) {
//       console.error('Account creation error:', error);
//       return {
//         success: false,
//         message: error.message || 'An unknown error occurred'
//       };
//     }
//   };

//   const signup = async (
//     name: string,
//     email: string,
//     password: string,
//     studentId: string,
//     program: string,
//     level: string
//   ): Promise<{ success: boolean; message: string }> => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const newUser = userCredential.user;

//       await setDoc(doc(db, 'profiles', newUser.uid), {
//         name,
//         email,
//         isAdmin: false,
//         studentId,
//         program,
//         level
//       });

//       toast({
//         title: 'Account created',
//         description: 'Your student account was created successfully!',
//       });

//       return {
//         success: true,
//         message: 'Student account created successfully'
//       };
//     } catch (error: any) {
//       console.error('Signup error:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Signup failed',
//         description: error.message || 'An unknown error occurred'
//       });
//       return {
//         success: false,
//         message: error.message || 'Signup failed'
//       };
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         session,
//         loading,
//         login,
//         logout,
//         isAuthenticated: !!user,
//         isAdmin: user?.isAdmin || false,
//         createUser,
//         signup
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
