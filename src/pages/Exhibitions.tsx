import { useState } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockExhibitions, mockArtworks } from '@/data/mockData';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const Exhibitions = () => {
  const [selectedExhibition, setSelectedExhibition] = useState<string | null>(null);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: '', email: '', type: 'visitor' });

  const upcomingExhibitions = mockExhibitions.filter(ex => ex.type === 'upcoming');
  const pastExhibitions = mockExhibitions.filter(ex => ex.type === 'past');

  const getCountdown = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Started';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  const handleRSVP = (exhibitionId: string) => {
    setSelectedExhibition(exhibitionId);
    setShowRSVPModal(true);
  };

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('RSVP confirmed! Check your email for details.');
    setShowRSVPModal(false);
    setRsvpData({ name: '', email: '', type: 'visitor' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl mb-6">Art Exhibitions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover upcoming exhibitions and celebrate artistic excellence with our community
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="container mx-auto px-4 py-16">
        <Tabs defaultValue="upcoming" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Exhibitions</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-8">
            {upcomingExhibitions.map((exhibition) => {
              const featuredArtworks = mockArtworks.filter(art => 
                exhibition.artworks.includes(art.id)
              );

              return (
                <Card key={exhibition.id} className="overflow-hidden">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative h-80 lg:h-auto">
                      <img
                        src={exhibition.image}
                        alt={exhibition.title}
                        className="w-full h-full object-cover"
                      />
                      {exhibition.featured && (
                        <Badge className="absolute top-4 left-4">Featured</Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className="text-base">
                          <Clock className="mr-2 h-4 w-4" />
                          {getCountdown(exhibition.date)}
                        </Badge>
                      </div>

                      <h2 className="font-heading text-3xl lg:text-4xl mb-4">
                        {exhibition.title}
                      </h2>

                      <div className="space-y-3 mb-6 text-muted-foreground">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">Event Dates</p>
                            <p>{new Date(exhibition.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })} - {new Date(exhibition.endDate).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">Location</p>
                            <p>{exhibition.location}</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {exhibition.description}
                      </p>

                      {/* Featured Artworks Preview */}
                      {featuredArtworks.length > 0 && (
                        <div className="mb-6">
                          <p className="text-sm font-medium mb-3">Featured Artworks</p>
                          <div className="flex gap-2">
                            {featuredArtworks.slice(0, 4).map((artwork) => (
                              <Link key={artwork.id} to={`/artwork/${artwork.id}`}>
                                <img
                                  src={artwork.image}
                                  alt={artwork.title}
                                  className="w-16 h-16 object-cover rounded hover:scale-110 transition-transform"
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {exhibition.registrationOpen && (
                        <Button
                          size="lg"
                          onClick={() => handleRSVP(exhibition.id)}
                          className="w-full sm:w-auto"
                        >
                          <Users className="mr-2 h-5 w-5" />
                          RSVP Now
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="past" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {pastExhibitions.map((exhibition) => (
                <Card key={exhibition.id} className="overflow-hidden">
                  <img
                    src={exhibition.image}
                    alt={exhibition.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <Badge variant="outline" className="mb-3">Past Event</Badge>
                    <h3 className="font-heading text-2xl mb-3">{exhibition.title}</h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(exhibition.date).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{exhibition.location}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground line-clamp-3">
                      {exhibition.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* RSVP Modal */}
      <Dialog open={showRSVPModal} onOpenChange={setShowRSVPModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>RSVP for Exhibition</DialogTitle>
            <DialogDescription>
              Register your interest and we'll send you event details
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRSVPSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={rsvpData.name}
                onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={rsvpData.email}
                onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">I am registering as *</Label>
              <select
                id="type"
                value={rsvpData.type}
                onChange={(e) => setRsvpData({ ...rsvpData, type: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="visitor">Visitor</option>
                <option value="artist">Artist</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowRSVPModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Confirm RSVP
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exhibitions;
