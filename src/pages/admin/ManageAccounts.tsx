
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from "lucide-react";

const ManageAccounts = () => {
  const navigate = useNavigate();
  const { isAdmin, createUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [program, setProgram] = useState('');
  const [level, setLevel] = useState('');

  React.useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this page."
      });
      navigate('/');
    }
  }, [isAdmin, navigate, toast]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isAdminAccount = userType === 'admin';
      
      // Student details only needed for student accounts
      const studentDetails = !isAdminAccount ? {
        studentId,
        program,
        level
      } : undefined;

      const result = await createUser(
        name, 
        email, 
        password, 
        isAdminAccount, 
        studentDetails
      );

      if (result.success) {
        toast({
          title: "Account Created",
          description: result.message
        });
        
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setStudentId('');
        setProgram('');
        setLevel('');
      } else {
        toast({
          variant: "destructive",
          title: "Failed to Create Account",
          description: result.message
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Account Management</h1>
        
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Account</CardTitle>
            <CardDescription>
              Create accounts for students and administrators
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="student" onValueChange={setUserType}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student">Student Account</TabsTrigger>
                <TabsTrigger value="admin">Admin Account</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleCreateAccount}>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  
                  {userType === 'student' && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input 
                          id="studentId"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="Enter student ID"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="program">Program</Label>
                        <Input 
                          id="program"
                          value={program}
                          onChange={(e) => setProgram(e.target.value)}
                          placeholder="Enter program/course"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="level">Level</Label>
                        <Select value={level} onValueChange={setLevel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select student's level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="200">200</SelectItem>
                            <SelectItem value="300">300</SelectItem>
                            <SelectItem value="400">400</SelectItem>
                            <SelectItem value="500">500</SelectItem>
                            <SelectItem value="600">600</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      `Create ${userType === 'admin' ? 'Admin' : 'Student'} Account`
                    )}
                  </Button>
                </div>
              </form>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Accounts created here are automatically verified.
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ManageAccounts;
