
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const { user, signIn, signUp, resetPassword } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isResetPassword) {
        console.log('Submitting password reset for:', formData.email);
        const { error } = await resetPassword(formData.email);
        if (error) {
          console.error('Password reset error:', error);
          toast.error(`Password reset failed: ${error.message}`);
        } else {
          toast.success('Password reset email sent! Check your inbox.');
          setIsResetPassword(false);
        }
      } else if (isLogin) {
        console.log('Submitting login for:', formData.email);
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          console.error('Sign in error:', error);
          if (error.message.includes('Email not confirmed')) {
            toast.error('Please check your email and click the confirmation link before signing in.');
          } else if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please check your credentials.');
          } else {
            toast.error(`Sign in failed: ${error.message}`);
          }
        } else {
          toast.success('Welcome back!');
        }
      } else {
        console.log('Submitting signup for:', formData.email);
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
        if (error) {
          console.error('Sign up error:', error);
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
            setIsLogin(true);
          } else {
            toast.error(`Sign up failed: ${error.message}`);
          }
        } else {
          toast.success('Account created successfully! Please check your email to verify your account.');
        }
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-forest-green hover:text-gold transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Store
          </Link>
        </div>

        <Card className="border-forest-green/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-forest-green">
              {isResetPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <p className="text-forest-green/70">
              {isResetPassword 
                ? 'Enter your email to receive a reset link'
                : isLogin 
                ? 'Sign in to your Lumière Jewelry account' 
                : 'Join the Lumière Jewelry family'
              }
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isResetPassword && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-forest-green/50" />
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-10 border-forest-green/20 focus:border-forest-green"
                      required
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-forest-green/50" />
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="pl-10 border-forest-green/20 focus:border-forest-green"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-forest-green/50" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 border-forest-green/20 focus:border-forest-green"
                  required
                />
              </div>

              {!isResetPassword && (
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-forest-green/50" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 border-forest-green/20 focus:border-forest-green"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-forest-green/50 hover:text-forest-green"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-forest-green text-cream hover:bg-forest-green/90"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cream mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  isResetPassword ? 'Send Reset Email' : isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {!isResetPassword && (
                <>
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-forest-green hover:text-gold transition-colors text-sm"
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                  
                  {isLogin && (
                    <div>
                      <button
                        onClick={() => setIsResetPassword(true)}
                        className="text-forest-green/70 hover:text-forest-green transition-colors text-sm"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  )}
                </>
              )}

              {isResetPassword && (
                <button
                  onClick={() => setIsResetPassword(false)}
                  className="text-forest-green hover:text-gold transition-colors text-sm"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
