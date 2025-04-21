// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import {
//   Form, FormField, FormItem, FormLabel, FormControl, FormMessage
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useAuth } from '@/contexts/AuthContext';

// const formSchema = z.object({
//   name: z.string().min(2, 'Name is required'),
//   email: z.string().email('Invalid email'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   studentId: z.string().min(2, 'Student ID is required'),
//   program: z.string().min(2, 'Program is required'),
//   level: z.string().min(1, 'Level is required'),
// });

// type SignupFormData = z.infer<typeof formSchema>;

// const SignupForm = () => {
//   const { signup } = useAuth();

//   const form = useForm<SignupFormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       password: '',
//       studentId: '',
//       program: '',
//       level: '',
//     },
//   });

//   const onSubmit = async (data: SignupFormData) => {
//     const { name, email, password, studentId, program, level } = data;
//     await signup(name, email, password, studentId, program, level);
//     form.reset();
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
//       <Card className="w-full max-w-md shadow-xl rounded-xl">
//         <CardHeader>
//           <CardTitle className="text-center text-2xl font-semibold">Student Signup</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Full Name</FormLabel>
//                     <FormControl><Input {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl><Input type="email" {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl><Input type="password" {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="studentId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Student ID</FormLabel>
//                     <FormControl><Input {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="program"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Program</FormLabel>
//                     <FormControl><Input {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="level"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Level</FormLabel>
//                     <FormControl><Input {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full">Sign Up</Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SignupForm;
