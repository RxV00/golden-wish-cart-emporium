
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Save, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string;
}

interface UserPreferences {
  favorite_categories: string[];
  preferred_materials: string[];
  newsletter_subscribed: boolean;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    favorite_categories: [],
    preferred_materials: [],
    newsletter_subscribed: false,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPreferences();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setPreferences({
          favorite_categories: data.favorite_categories || [],
          preferred_materials: data.preferred_materials || [],
          newsletter_subscribed: data.newsletter_subscribed || false,
        });
      }
    } catch (error: any) {
      // Preferences might not exist yet, that's okay
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Update or insert preferences
      const { error: prefError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          favorite_categories: preferences.favorite_categories,
          preferred_materials: preferences.preferred_materials,
          newsletter_subscribed: preferences.newsletter_subscribed,
          updated_at: new Date().toISOString(),
        });

      if (prefError) throw prefError;

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green mx-auto"></div>
          <p className="mt-4 text-forest-green">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-forest-green hover:text-gold transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Store
          </Link>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="border-forest-green/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-forest-green">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-forest-green mb-1">
                      First Name
                    </label>
                    <Input
                      type="text"
                      value={profile?.first_name || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, first_name: e.target.value} : null)}
                      className="border-forest-green/20 focus:border-forest-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest-green mb-1">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      value={profile?.last_name || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, last_name: e.target.value} : null)}
                      className="border-forest-green/20 focus:border-forest-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-green mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-forest-green/50" />
                    <Input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="pl-10 border-forest-green/20 bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-green mb-1">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-forest-green/50" />
                    <Input
                      type="tel"
                      value={profile?.phone || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                      className="pl-10 border-forest-green/20 focus:border-forest-green"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-forest-green/20">
                  <h3 className="text-lg font-medium text-forest-green flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Preferences
                  </h3>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newsletter"
                      checked={preferences.newsletter_subscribed}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        newsletter_subscribed: e.target.checked
                      }))}
                      className="mr-2"
                    />
                    <label htmlFor="newsletter" className="text-forest-green">
                      Subscribe to newsletter for exclusive offers and new arrivals
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-forest-green text-cream hover:bg-forest-green/90"
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cream mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-forest-green/20 shadow-lg">
            <CardContent className="pt-6">
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
