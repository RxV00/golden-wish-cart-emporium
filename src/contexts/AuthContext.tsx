
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener...');
    
    // Get initial session first
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthProvider: Initial session check:', { session: session?.user?.email, error });
        
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (err) {
        console.error('AuthProvider: Error in getInitialSession:', err);
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed:', { event, email: session?.user?.email });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    console.log('AuthProvider: Attempting to sign up:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      
      console.log('AuthProvider: Sign up response:', { data: data?.user?.email, error });
      setLoading(false);
      return { data, error };
    } catch (err) {
      console.error('AuthProvider: Sign up error:', err);
      setLoading(false);
      return { data: null, error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting to sign in:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('AuthProvider: Sign in response:', { data: data?.user?.email, error });
      setLoading(false);
      return { data, error };
    } catch (err) {
      console.error('AuthProvider: Sign in error:', err);
      setLoading(false);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    console.log('AuthProvider: Attempting to sign out');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
      } else {
        console.log('AuthProvider: Sign out successful');
      }
      setLoading(false);
    } catch (err) {
      console.error('AuthProvider: Sign out error:', err);
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    console.log('AuthProvider: Attempting password reset for:', email);
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth',
      });
      console.log('AuthProvider: Password reset response:', { data, error });
      return { data, error };
    } catch (err) {
      console.error('AuthProvider: Password reset error:', err);
      return { data: null, error: err };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  console.log('AuthProvider: Rendering with state:', { 
    userEmail: user?.email, 
    hasSession: !!session, 
    loading 
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
