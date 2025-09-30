import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Mail, MapPin, Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const Profile = () => {
  const { user, logout, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: (user as any)?.bio || '',
    location: (user as any)?.location || '',
    specialty: (user as any)?.specialty || '',
    website: (user as any)?.social?.website || '',
    instagram: (user as any)?.social?.instagram || '',
    twitter: (user as any)?.social?.twitter || '',
    joined: (user as any)?.joined || '',
    skills: Array.isArray((user as any)?.skills) ? (user as any)?.skills : [],
  });

  useEffect(() => {
    api.profile.get()
      .then((d) => {
        setProfileData({
          name: d.name || '',
          email: d.email || '',
          bio: d.bio || '',
          location: d.location || '',
          specialty: d.specialty || '',
          website: d.social?.website || '',
          instagram: d.social?.instagram || '',
          twitter: d.social?.twitter || '',
          joined: d.joined || '',
          skills: Array.isArray(d.skills) ? d.skills : [],
        });
        if (typeof d.banner === 'string' && d.banner.length > 0) {
          setBannerPreview(d.banner);
        }
        updateUser({ name: d.name, email: d.email, avatar: d.avatar } as any);
      })
      .catch(() => {});
  }, []);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSave = async () => {
    try {
      const payload: any = {
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
        location: profileData.location,
        specialty: profileData.specialty,
        skills: profileData.skills,
        joined: profileData.joined,
        social: {
          website: profileData.website,
          instagram: profileData.instagram,
          twitter: profileData.twitter,
        },
      };
      if (avatarPreview) payload.avatar = avatarPreview;
      if (bannerPreview) payload.banner = bannerPreview;
      const updated = await api.profile.update(payload);
      updateUser({ name: updated.name, email: updated.email, avatar: updated.avatar } as any);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          {/* Banner */}
          <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-8">
            <img
              src={bannerPreview || (user as any).banner || "/placeholder.svg"}
              alt="Profile banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                if (!t.src.includes('/placeholder.svg')) t.src = '/placeholder.svg';
              }}
            />
            {isEditing && (
              <label htmlFor="banner-upload" className="absolute bottom-2 right-2 bg-background/90 border rounded-full px-3 py-1 text-xs cursor-pointer hover:bg-background">
                Change Cover
              </label>
            )}
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => setBannerPreview(reader.result as string);
                reader.readAsDataURL(file);
              }}
              disabled={!isEditing}
            />
          </div>

          <div className="relative w-32 h-32 mx-auto mb-6">
            <img
              src={avatarPreview || user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-background shadow-2xl object-cover"
            />
            {isEditing && (
              <label htmlFor="avatar-upload" className="absolute bottom-1 right-1 bg-background/90 border rounded-full px-3 py-1 text-xs cursor-pointer hover:bg-background">
                Change
              </label>
            )}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => setAvatarPreview(reader.result as string);
                reader.readAsDataURL(file);
              }}
              disabled={!isEditing}
            />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl mb-4">{user.name}</h1>
          <p className="text-xl text-muted-foreground capitalize">{user.role}</p>
        </div>
      </section>

      {/* Profile Settings */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl">Profile Settings</h2>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </div>

          <Card className="p-8 mb-8">
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {user.role === 'artist' && (
                <>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        value={profileData.specialty}
                        onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={profileData.instagram}
                        onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={profileData.twitter}
                        onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="joined">Joined (YYYY-MM-DD)</Label>
                      <Input
                        id="joined"
                        value={profileData.joined}
                        onChange={(e) => setProfileData({ ...profileData, joined: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="p-8">
            <h3 className="font-heading text-xl mb-6">Account Actions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-muted-foreground">Update your password</p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Logout</p>
                  <p className="text-sm text-muted-foreground">Sign out of your account</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                </div>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Profile;
