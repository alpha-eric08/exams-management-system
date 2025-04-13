
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, User, Mail, Key, ShieldCheck, BadgeCheck } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Validation schema for admin form
const adminSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Extended schema for student form
const studentSchema = adminSchema.extend({
  studentId: z.string().optional(),
  program: z.string().optional(),
  level: z.string().optional(),
});

const ManageAccounts = () => {
  const navigate = useNavigate();
  const { isAdmin, createUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('student');

  // Admin form
  const adminForm = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Student form
  const studentForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      studentId: "",
      program: "",
      level: "",
    },
  });

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
  }, [isAdmin, navigate]);

  const handleAdminSubmit = async (values: z.infer<typeof adminSchema>) => {
    setLoading(true);
    try {
      const result = await createUser(
        values.name,
        values.email,
        values.password,
        true // isAdmin = true
      );

      if (result.success) {
        toast({
          title: "Admin Account Created",
          description: result.message
        });
        adminForm.reset();
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

  const handleStudentSubmit = async (values: z.infer<typeof studentSchema>) => {
    setLoading(true);
    try {
      const result = await createUser(
        values.name,
        values.email,
        values.password,
        false, // isAdmin = false
        {
          studentId: values.studentId,
          program: values.program,
          level: values.level
        }
      );

      if (result.success) {
        toast({
          title: "Student Account Created",
          description: result.message
        });
        studentForm.reset();
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
    <MainLayout title="Account Management">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Account Management</h1>
        
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" /> Create New Account
            </CardTitle>
            <CardDescription>
              Create accounts for students and administrators
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="student" onValueChange={setUserType}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4" /> Student Account
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Admin Account
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="admin">
                <Form {...adminForm}>
                  <form onSubmit={adminForm.handleSubmit(handleAdminSubmit)} className="space-y-4">
                    <FormField
                      control={adminForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Enter full name" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={adminForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Enter email address" type="email" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={adminForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Enter password" type="password" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      className="w-full flex items-center justify-center gap-2" 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating Admin...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          Create Admin Account
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="student">
                <Form {...studentForm}>
                  <form onSubmit={studentForm.handleSubmit(handleStudentSubmit)} className="space-y-4">
                    <FormField
                      control={studentForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Enter full name" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Enter email address" type="email" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Enter password" type="password" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter student ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="program"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Program</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter program/course" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select student's level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="100">100</SelectItem>
                              <SelectItem value="200">200</SelectItem>
                              <SelectItem value="300">300</SelectItem>
                              <SelectItem value="400">400</SelectItem>
                              <SelectItem value="500">500</SelectItem>
                              <SelectItem value="600">600</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      className="w-full flex items-center justify-center gap-2" 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating Student Account...
                        </>
                      ) : (
                        <>
                          <BadgeCheck className="h-4 w-4" />
                          Create Student Account
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
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
