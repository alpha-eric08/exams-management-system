
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, InfoIcon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Login form submitted with:', email, 'and password length:', password.length);
      await login(email, password);
      if (isAdmin){
        navigate("/admin/dashboard")
      }else{
        navigate("/student/dashboard")
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setTestCredentials = (type: 'admin' | 'student') => {
    if (type === 'admin') {
      setEmail('admin@example.com');
      setPassword('password');
    } else {
      setEmail('student@aamusted.com');
      setPassword('password');
    }
    // Clear any previous errors when setting test credentials
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-maroon">Exam Portal</h1>
          <p className="text-gray-600 mt-2">Login to access your account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-maroon">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="example@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a 
                      href="#" 
                      className="text-sm text-maroon hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Please contact the administrator to reset your password.');
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full mt-6 bg-maroon hover:bg-maroon-dark text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full text-sm text-gray-500">
              <div className="mb-2">
                Test accounts:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button 
                  variant="outline"
                  onClick={() => setTestCredentials('admin')}
                  className="bg-gray-100 h-auto py-2 flex flex-col"
                >
                  <p><strong>Admin:</strong></p>
                  <p>admin@example.com</p>
                  <p>password</p>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTestCredentials('student')}
                  className="bg-gray-100 h-auto py-2 flex flex-col"
                >
                  <p><strong>Student:</strong></p>
                  <p>student@aamusted.com</p>
                  <p>password</p>
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center">
          <Button
            variant="link"
            className="text-maroon hover:text-maroon-dark"
            onClick={() => navigate('/')}
          >
            Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;

// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { getDoc, doc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { auth } from "@/integrations/firebase.config";
// import { FileLock, FileUser, IdCard, RectangleEllipsis } from "lucide-react";

// const schema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// export default function Login(probs: any) {
//   const navigate = useNavigate();
//   const [error, setError] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(schema),
//   });

//   const onSubmit = async (data: { email: string; password: string }) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );
//       const user = userCredential.user;

//       // Get user role from Firestore
//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       if (userDoc.exists()) {
//         const role = userDoc.data().role;
//         if (role === "student") navigate("/student");
//         else if (role === "admin") navigate("/admin");
//         else if (role === "finance") navigate("/finance");
//         else if (role === "examiner") navigate("/examiner");
//       } else {
//         setError("No role assigned. Contact admin.");
//       }
//     } catch (err) {
//       setError("Invalid email or password");
//     }
//   };

//   return (
//     <div className="flex h-screen w-full bg-cream items-center justify-center">
//       <div className="md:flex md:w-4/5 md:h-3/4 bg-white rounded-xl shadow-lg overflow-hidden">
//         {/* Left Side - Form */}
//         <motion.div
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center"
//         >
//           <h2 className="text-2xl font-bold text-center">LOGIN</h2>
//           <p className="text-center text-gray-500 mb-5">
//             How to get started lorem ipsum dolor at?
//           </p>
//           {error && <p className="text-red-500  text-center">{error}</p>}
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="flex flex-col mb-3">
//               <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-100">
//                 <FileUser className="text-gray-500" />
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   className="ml-2 bg-transparent outline-none w-full"
//                   {...register("email")}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {/* {errors.email.message} */}
//                 </p>
//               )}
//             </div>
//             <div className="flex flex-col mb-5">
//               <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-100">
//                 <FileLock className="text-gray-500" />
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   className="ml-2 bg-transparent outline-none w-full"
//                   {...register("password")}
//                 />
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {/* {errors.password.message} */}
//                 </p>
//               )}
//             </div>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               className="w-full py-2 duration-300 text-white hover:bg-maroon-dark bg-maroon font-semibold rounded-lg shadow-md"
//               type="submit"
//             >
//               Login Now
//             </motion.button>
//           </form>
//           <p className="text-center font-semibold my-3">Login with Others</p>
//           <button onClick={() => probs.setIsSignIn(false)} className="flex items-center w-full border rounded-lg px-4 py-2 mb-3 hover:bg-gray-200">
//             <RectangleEllipsis className="text-red-500 mr-2" /> Only Student{" "}
//             <span className="font-bold ml-1">Click to Register</span>
//           </button>
//           <button className="flex items-center w-full border rounded-lg px-4 py-2 hover:bg-gray-200">
//             <IdCard className="text-blue-600 mr-2" /> If Staff{" "}
//             <span className="font-bold ml-1">Reach Out to Admin</span>
//           </button>
//         </motion.div>

//         {/* Right Side - Illustration */}
//         <motion.div
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           className="hidden w-1/2 bg-maroon-dark md:flex items-center justify-center relative"
//         >
//           <div className="absolute inset-0 opacity-30">
//             {/* <img src={authbg} alt="" /> */}
//           </div>
//           <div className="relative p-8 text-center text-white bg-white/20 backdrop-blur-md rounded-xl">
//             <p className="text-lg font-bold">
//               Very good works are waiting for you. Login Now!!!
//             </p>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
