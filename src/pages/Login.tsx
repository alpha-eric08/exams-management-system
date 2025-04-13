
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      // Navigation is handled in AuthContext
    } catch (error) {
      console.error('Login error:', error);
      // Toast notification is handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
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
                <div className="bg-gray-100 p-2 rounded">
                  <p><strong>Student:</strong></p>
                  <p>student@example.com</p>
                  <p>password</p>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <p><strong>Admin:</strong></p>
                  <p>admin@example.com</p>
                  <p>password</p>
                </div>
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
