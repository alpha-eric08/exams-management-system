
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  email: string | null;
  role: 'student' | 'admin';
  studentId?: string | null;
  program?: string | null;
  level?: string | null;
  isAdmin: boolean; // Add explicit isAdmin property
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  session: Session | null;
  createUser: (name: string, email: string, password: string, isAdmin: boolean, studentDetails?: {
    studentId?: string;
    program?: string;
    level?: string;
  }) => Promise<{ success: boolean; message: string }>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch additional user profile data
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (error) {
                console.error('Error fetching profile:', error);
                return;
              }

              if (profile) {
                setUser({
                  id: session.user.id,
                  name: profile.name,
                  email: session.user.email,
                  role: profile.is_admin ? 'admin' : 'student',
                  studentId: profile.student_id,
                  program: profile.program,
                  level: profile.level,
                  isAdmin: profile.is_admin // Set isAdmin directly
                });
              }

              // Handle navigation based on user role
              if (profile?.is_admin) {
                navigate('/admin/dashboard');
              } else {
                navigate('/student/dashboard');
              }
            } catch (error) {
              console.error('Error processing user profile:', error);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error('Error fetching profile:', error);
              setLoading(false);
              return;
            }

            if (profile) {
              setUser({
                id: session.user.id,
                name: profile.name,
                email: session.user.email,
                role: profile.is_admin ? 'admin' : 'student',
                studentId: profile.student_id,
                program: profile.program,
                level: profile.level,
                isAdmin: profile.is_admin // Set isAdmin directly
              });
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error in profile fetch:', error);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }).catch(error => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      // User profile fetching is handled by the auth state change listener
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });

      // Navigation happens in the auth state listener
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error; // Re-throw the error so it can be caught by the calling function
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate('/login');
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: 'Logout failed',
        description: 'Failed to log out. Please try again.',
      });
    }
  };

  // Function for admins to create new accounts
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
      // Create user account in authentication
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email 
        user_metadata: {
          name,
          is_admin: isAdmin,
          student_id: studentDetails?.studentId || null,
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: name,
          email: email,
          is_admin: isAdmin,
          student_id: studentDetails?.studentId || null,
          program: studentDetails?.program || null,
          level: studentDetails?.level || null,
        });

      if (profileError) {
        // If profile creation fails, try to clean up the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Failed to create user profile: ${profileError.message}`);
      }

      const userType = isAdmin ? 'admin' : 'student';
      return { 
        success: true, 
        message: `Successfully created ${userType} account for ${email}`
      };

    } catch (error) {
      console.error('Account creation error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred'
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
        createUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
