import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

const Artists = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState<any[]>([]);
  useEffect(() => {
    api.artists.list()
      .then((list) => setArtists(Array.isArray(list) ? list : []))
      .catch(() => setArtists([]));
  }, []);

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (artist.specialty || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (artist.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl mb-6">Discover Artists</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with talented artists from around the world. Explore their unique styles and creative journeys.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, specialty, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground">
            Showing {filteredArtists.length} {filteredArtists.length === 1 ? 'artist' : 'artists'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredArtists.map((artist) => (
            <Link key={artist.id} to={`/artist/${artist.id}`}>
              <Card className="overflow-hidden hover:shadow-2xl transition-all hover:scale-105 group">
                {/* Banner */}
                <div 
                  className="h-32 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${artist.banner})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                </div>

                {/* Profile */}
                <div className="relative px-6 pb-6">
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-24 h-24 rounded-full border-4 border-background -mt-12 mb-4 relative z-10"
                  />

                  <h3 className="font-heading text-xl mb-2 group-hover:text-primary transition-colors">
                    {artist.name}
                  </h3>
                  
                  <Badge variant="secondary" className="mb-4">
                    {artist.specialty}
                  </Badge>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{artist.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{artist.followers} followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span>{artist.artworksCount} artworks</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    View Profile
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredArtists.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No artists found matching your search.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Artists;
