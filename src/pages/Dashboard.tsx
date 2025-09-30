import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, BarChart3, MessageSquare, Settings, Menu, X, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { api } from '@/lib/api';
import { mockArtworks, mockExhibitions } from '@/data/mockData';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

const Dashboard = () => {
  const { user, inquiries } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: '',
    medium: '',
    size: '',
    price: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  const [exhibitionImagePreview, setExhibitionImagePreview] = useState<string>('');
  const [exhibitionData, setExhibitionData] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    type: 'upcoming' as 'upcoming' | 'past',
    registrationOpen: true,
    featured: false,
    artworks: [] as string[],
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const userArtworks = mockArtworks.filter(a => a.artistId === 'artist1').slice(0, 6);
  const userInquiries = inquiries.filter(i => i.artistId === user.id);

  const stats = {
    totalArtworks: 47,
    totalLikes: 5430,
    totalViews: 23450,
    totalInquiries: userInquiries.length,
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExhibitionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExhibitionImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.title || !uploadData.category || !imagePreview || !uploadData.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await api.artworks.create({
        title: uploadData.title,
        category: uploadData.category,
        medium: uploadData.medium,
        size: uploadData.size,
        price: Number(uploadData.price),
        image: imagePreview,
        description: uploadData.description,
      });
      toast.success('Artwork uploaded successfully!');
      setUploadData({ title: '', description: '', category: '', medium: '', size: '', price: '' });
      setImagePreview('');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex pt-20">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-card border-r transition-all duration-300 overflow-hidden fixed lg:relative h-screen z-40`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#upload">
                <Upload className="mr-3 h-4 w-4" />
                Upload Artwork
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#gallery">
                <ImageIcon className="mr-3 h-4 w-4" />
                My Gallery
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#stats">
                <BarChart3 className="mr-3 h-4 w-4" />
                Statistics
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#host-exhibition">
                <ImageIcon className="mr-3 h-4 w-4" />
                Host Exhibition
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#messages">
                <MessageSquare className="mr-3 h-4 w-4" />
                Messages ({userInquiries.length})
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/profile">
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card border-b p-4 flex items-center gap-4 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
          <h1 className="font-heading text-2xl">Artist Dashboard</h1>
        </header>

        <div className="p-6 space-y-8">
          {/* Stats */}
          <section id="stats">
            <h2 className="font-heading text-3xl mb-6">Statistics</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <ImageIcon className="h-8 w-8 text-primary" />
                  <span className="text-3xl font-bold">{stats.totalArtworks}</span>
                </div>
                <p className="text-muted-foreground">Total Artworks</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Heart className="h-8 w-8 text-red-500" />
                  <span className="text-3xl font-bold">{stats.totalLikes}</span>
                </div>
                <p className="text-muted-foreground">Total Likes</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Eye className="h-8 w-8 text-blue-500" />
                  <span className="text-3xl font-bold">{stats.totalViews}</span>
                </div>
                <p className="text-muted-foreground">Total Views</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <MessageSquare className="h-8 w-8 text-green-500" />
                  <span className="text-3xl font-bold">{stats.totalInquiries}</span>
                </div>
                <p className="text-muted-foreground">Inquiries</p>
              </Card>
            </div>
          </section>

          {/* Upload Artwork */}
          <section id="upload">
            <h2 className="font-heading text-3xl mb-6">Upload New Artwork</h2>
            <Card className="p-8">
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="image">Artwork Image *</Label>
                    <div className="mt-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                      {imagePreview && (
                        <div className="mt-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full max-w-md h-64 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      placeholder="Give your artwork a title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={uploadData.category}
                      onValueChange={(value) => setUploadData({ ...uploadData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Abstract">Abstract</SelectItem>
                        <SelectItem value="Portrait">Portrait</SelectItem>
                        <SelectItem value="Landscape">Landscape</SelectItem>
                        <SelectItem value="Digital Art">Digital Art</SelectItem>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Botanical">Botanical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="medium">Medium</Label>
                    <Input
                      id="medium"
                      value={uploadData.medium}
                      onChange={(e) => setUploadData({ ...uploadData, medium: e.target.value })}
                      placeholder="e.g., Acrylic on Canvas"
                    />
                  </div>

                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={uploadData.size}
                      onChange={(e) => setUploadData({ ...uploadData, size: e.target.value })}
                      placeholder="e.g., 24x36 inches"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={uploadData.price}
                      onChange={(e) => setUploadData({ ...uploadData, price: e.target.value })}
                      placeholder="1000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                      placeholder="Describe your artwork..."
                      rows={4}
                    />
                  </div>
                </div>

                <Button type="submit" size="lg">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Artwork
                </Button>
              </form>
            </Card>
          </section>

          {/* Host Exhibition */}
          <section id="host-exhibition">
            <h2 className="font-heading text-3xl mb-6">Host Exhibition</h2>
            <Card className="p-8">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!exhibitionData.title || !exhibitionData.location || !exhibitionData.startDate || !exhibitionData.endDate || !exhibitionImagePreview) {
                    toast.error('Please fill in all required fields');
                    return;
                  }
                  try {
                    await api.exhibitions.create({
                      title: exhibitionData.title,
                      location: exhibitionData.location,
                      date: exhibitionData.startDate,
                      endDate: exhibitionData.endDate,
                      description: exhibitionData.description,
                      type: exhibitionData.type,
                      registrationOpen: exhibitionData.registrationOpen,
                      featured: exhibitionData.featured,
                      image: exhibitionImagePreview,
                      artworks: exhibitionData.artworks,
                    });
                    toast.success('Exhibition hosted successfully!');
                    setExhibitionData({ title: '', location: '', startDate: '', endDate: '', description: '', type: 'upcoming', registrationOpen: true, featured: false, artworks: [] });
                    setExhibitionImagePreview('');
                  } catch (err: any) {
                    toast.error(err.message || 'Host failed');
                  }
                }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="ex-image">Exhibition Image *</Label>
                    <div className="mt-2">
                      <Input id="ex-image" type="file" accept="image/*" onChange={handleExhibitionImageUpload} className="cursor-pointer" />
                      {exhibitionImagePreview && (
                        <div className="mt-4">
                          <img src={exhibitionImagePreview} alt="Exhibition Preview" className="w-full max-w-md h-48 object-cover rounded-lg" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="ex-title">Title *</Label>
                    <Input id="ex-title" placeholder="Exhibition title" value={exhibitionData.title} onChange={(e) => setExhibitionData({ ...exhibitionData, title: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="ex-location">Location *</Label>
                    <Input id="ex-location" placeholder="Gallery / City" value={exhibitionData.location} onChange={(e) => setExhibitionData({ ...exhibitionData, location: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="ex-start">Start Date *</Label>
                    <Input id="ex-start" type="date" value={exhibitionData.startDate} onChange={(e) => setExhibitionData({ ...exhibitionData, startDate: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="ex-end">End Date *</Label>
                    <Input id="ex-end" type="date" value={exhibitionData.endDate} onChange={(e) => setExhibitionData({ ...exhibitionData, endDate: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="ex-type">Type</Label>
                    <Select value={exhibitionData.type} onValueChange={(value: 'upcoming' | 'past') => setExhibitionData({ ...exhibitionData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="ex-reg" checked={exhibitionData.registrationOpen} onCheckedChange={(v) => setExhibitionData({ ...exhibitionData, registrationOpen: v })} />
                      <Label htmlFor="ex-reg">Registration Open</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="ex-featured" checked={exhibitionData.featured} onCheckedChange={(v) => setExhibitionData({ ...exhibitionData, featured: v })} />
                      <Label htmlFor="ex-featured">Featured</Label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="ex-description">Description</Label>
                    <Textarea id="ex-description" rows={4} placeholder="Describe your exhibition..." value={exhibitionData.description} onChange={(e) => setExhibitionData({ ...exhibitionData, description: e.target.value })} />
                  </div>
                </div>

                <div>
                  <Label>Include Artworks</Label>
                  <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {userArtworks.map((art) => (
                      <label key={art.id} className="flex items-center gap-2 p-3 border rounded-md">
                        <Checkbox
                          checked={exhibitionData.artworks.includes(art.id)}
                          onCheckedChange={(v) => {
                            setExhibitionData((prev) => {
                              const set = new Set(prev.artworks);
                              if (v) set.add(art.id); else set.delete(art.id);
                              return { ...prev, artworks: Array.from(set) };
                            });
                          }}
                        />
                        <span className="text-sm">{art.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button type="submit">
                  Host Exhibition
                </Button>
              </form>
            </Card>
          </section>

          {/* My Gallery */}
          <section id="gallery">
            <h2 className="font-heading text-3xl mb-6">My Gallery</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userArtworks.map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden group">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{artwork.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{artwork.category}</span>
                      <span className="font-bold">${artwork.price}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                      <Button size="sm" variant="outline" className="flex-1">Delete</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Messages */}
          <section id="messages">
            <h2 className="font-heading text-3xl mb-6">Messages & Inquiries</h2>
            {userInquiries.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No inquiries yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {userInquiries.map((inquiry) => (
                  <Card key={inquiry.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-medium">{inquiry.name}</p>
                        <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(inquiry.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Artwork:</span> {inquiry.artworkTitle}
                    </p>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Phone:</span> {inquiry.phone}
                    </p>
                    <p className="text-muted-foreground">{inquiry.message}</p>
                    <Button size="sm" className="mt-4">Reply</Button>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
