import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isConfirmed = searchParams.get('confirmed') === 'true';

  useEffect(() => {
    if (isConfirmed) {
      toast.success('🎉 Email confirmed! You can now sign in to your account.');
    }
  }, [isConfirmed]);

  // Redirect if already logged in
  if (user) {
    console.log('Auth: User already logged in, redirecting to home');
    return <Navigate to="/" replace />;
  }

  const validateForm = () => {
    if (!formData.email) {
      toast.error('Email is required');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!isResetPassword && !formData.password) {
      toast.error('Password is required');
      return false;
    }

    if (!isResetPassword && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (!isLogin && !isResetPassword) {
      if (!formData.firstName.trim()) {
        toast.error('First name is required');
        return false;
      }
      if (!formData.lastName.trim()) {
        toast.error('Last name is required');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log('Auth: Submitting form for:', formData.email, 'Mode:', isResetPassword ? 'reset' : isLogin ? 'login' : 'signup');

    try {
      if (isResetPassword) {
        const { error } = await resetPassword(formData.email);
        if (error) {
          console.error('Auth: Password reset error:', error);
          toast.error(`Password reset failed: ${error.message}`);
        } else {
          toast.success('Password reset email sent! Check your inbox.');
          setIsResetPassword(false);
          setIsLogin(true);
        }
      } else if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          console.error('Auth: Sign in error:', error);
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please check your credentials and try again.');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Please check your email and confirm your account first.');
          } else {
            toast.error(`Sign in failed: ${error.message}`);
          }
        } else {
          console.log('Auth: Sign in successful, redirecting...');
          toast.success('Welcome back!');
          navigate('/');
        }
      } else {
        const { data, error } = await signUp(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
        
        console.log('Auth: Sign up response data:', data);
        console.log('Auth: Sign up response error:', error);
        
        // Check if this is a repeated signup attempt (user already exists)
        if (data?.user && !data?.session && !error) {
          // This indicates the user already exists but email wasn't confirmed yet
          console.log('Auth: Detected repeated signup for existing user');
          toast.error('This email address is already registered. Please check your email for the confirmation link or sign in instead.');
          setIsLogin(true);
        } else if (error) {
          console.error('Auth: Sign up error:', error);
          if (error.message.includes('User already registered') || 
              error.message.includes('already registered') ||
              error.message.includes('email address is already registered')) {
            toast.error('This email address is already registered. Please sign in instead or use a different email.');
            setIsLogin(true);
          } else if (error.message.includes('duplicate key') || 
                     error.message.includes('unique constraint')) {
            toast.error('This email address is already in use. Please use a different email or sign in.');
            setIsLogin(true);
          } else {
            toast.error(`Sign up failed: ${error.message}`);
          }
        } else if (data?.user && data?.user.email_confirmed_at === null) {
          // Successfully created new user - needs email confirmation
          console.log('Auth: Sign up successful - new user created:', data);
          toast.success('Account created successfully! Please check your email to verify your account before signing in.', {
            duration: 6000,
          });
          setIsLogin(true);
          setFormData(prev => ({ ...prev, password: '' }));
        } else {
          // User was created and already confirmed (shouldn't happen with email confirmation enabled)
          console.log('Auth: Sign up successful - user already confirmed:', data);
          toast.success('Account created successfully!');
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('Auth: Unexpected error:', error);
      if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
        toast.error('This email address is already registered. Please sign in instead.');
        setIsLogin(true);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
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

  const switchMode = () => {
    setIsLogin(!isLogin);
    setIsResetPassword(false);
    setFormData(prev => ({ ...prev, password: '', firstName: '', lastName: '' }));
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="border-forest-green/20 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              </div>
              <CardTitle className="text-2xl font-bold text-forest-green">
                Email Confirmed! ✨
              </CardTitle>
              <p className="text-forest-green/70">
                Your account has been successfully verified. You can now sign in to access your Lumière Jewelry account.
              </p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  navigate('/auth');
                  window.location.reload();
                }}
                className="w-full bg-forest-green text-cream hover:bg-forest-green/90"
              >
                Continue to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                    placeholder="Password (min 6 characters)"
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
                    {isResetPassword ? 'Sending...' : isLogin ? 'Signing in...' : 'Creating account...'}
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
                    onClick={switchMode}
                    className="text-forest-green hover:text-gold transition-colors text-sm"
                    disabled={loading}
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                  
                  {isLogin && (
                    <div>
                      <button
                        onClick={() => setIsResetPassword(true)}
                        className="text-forest-green/70 hover:text-forest-green transition-colors text-sm"
                        disabled={loading}
                      >
                        Forgot your password?
                      </button>
                    </div>
                  )}
                </>
              )}

              {isResetPassword && (
                <button
                  onClick={() => {
                    setIsResetPassword(false);
                    setIsLogin(true);
                  }}
                  className="text-forest-green hover:text-gold transition-colors text-sm"
                  disabled={loading}
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
