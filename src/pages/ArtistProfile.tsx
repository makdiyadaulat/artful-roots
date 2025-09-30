import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapPin, Users, Heart, Image, MessageCircle, Instagram, Globe, Twitter, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ArtworkCard from '@/components/ArtworkCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { api } from '@/lib/api';
import ConnectArtistModal from '@/components/ConnectArtistModal';
import { toast } from 'sonner';

const ArtistProfile = () => {
  const { id } = useParams();
  const { follows, toggleFollow } = useApp();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [artist, setArtist] = useState<any | null>(null);
  const [artistArtworks, setArtistArtworks] = useState<any[]>([]);
  const [artistExhibitions, setArtistExhibitions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setNotFound(false);
    Promise.all([
      api.artists.get(id).catch(() => null),
      api.artworks.list().catch(() => []),
      api.exhibitions.list().catch(() => []),
    ])
      .then(([artistRes, artworks, exhibitions]) => {
        if (!artistRes) {
          setNotFound(true);
          return;
        }
        setArtist(artistRes);
        const normalizedArtworks = (artworks as any[]).map(a => ({ ...a, id: a.id ?? a._id }));
        setArtistArtworks(normalizedArtworks.filter(a => String(a.artistId) === String(id)));
        const normalizedEx = (exhibitions as any[]).map(e => ({ ...e, id: e.id ?? e._id }));
        setArtistExhibitions(normalizedEx.filter(e => String(e.artistId) === String(id)));
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted-foreground">Loading artist…</div>
      </div>
    );
  }

  if (notFound || !artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Artist not found</h2>
          <Link to="/artists">
            <Button>Browse Artists</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isFollowing = follows.includes(artist.id);

  const handleFollow = () => {
    toggleFollow(artist.id);
    toast.success(isFollowing ? `Unfollowed ${artist.name}` : `Following ${artist.name}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div 
        className="h-80 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${artist.banner || '/placeholder.svg'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="relative -mt-24 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="w-48 h-48 rounded-full border-8 border-background shadow-2xl object-cover"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                if (!t.src.includes('/placeholder.svg')) t.src = '/placeholder.svg';
              }}
            />
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="font-heading text-4xl lg:text-5xl">{artist.name}</h1>
                <Badge variant="secondary" className="text-base px-4 py-1">
                  {artist.specialty}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-6 text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{artist.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{artist.followers} followers</span>
                </div>
                {typeof artist.artworksCount === 'number' && (
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    <span>{artist.artworksCount} artworks</span>
                  </div>
                )}
                {typeof artist.totalLikes === 'number' && (
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>{artist.totalLikes} total likes</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleFollow} variant={isFollowing ? "outline" : "default"}>
                  <Users className="mr-2 h-4 w-4" />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button onClick={() => setShowConnectModal(true)} variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Message
                </Button>

                {/* Social Links */}
                {artist.social && artist.social.instagram && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`https://instagram.com/${artist.social.instagram}`} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {artist.social && artist.social.website && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`https://${artist.social.website}`} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {artist.social && artist.social.twitter && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`https://twitter.com/${artist.social.twitter}`} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-5 w-5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="portfolio" className="pb-20">
          <TabsList className="mb-8">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="exhibitions">Exhibitions</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artistArtworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  id={artwork.id}
                  title={artwork.title}
                  artist={artwork.artist}
                  image={artwork.image}
                  category={artwork.category}
                  price={artwork.price}
                  likes={artwork.likes}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="max-w-3xl">
              <Card className="p-8">
                <h2 className="font-heading text-2xl mb-4">Biography</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">{artist.bio}</p>

                <h3 className="font-heading text-xl mb-4">Skills & Specialties</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {(artist.skills || []).map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="px-4 py-2">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                    <p className="font-medium">{artist.joined ? new Date(artist.joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Followers</p>
                    <p className="font-medium">{typeof artist.followers === 'number' ? artist.followers.toLocaleString() : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Artworks Published</p>
                    <p className="font-medium">{typeof artist.artworksCount === 'number' ? artist.artworksCount : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Appreciation</p>
                    <p className="font-medium">{typeof artist.totalLikes === 'number' ? `${artist.totalLikes.toLocaleString()} likes` : '-'}</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exhibitions">
            <div className="grid md:grid-cols-2 gap-6">
              {artistExhibitions.map((exhibition) => (
                <Card key={exhibition.id} className="overflow-hidden">
                  <img 
                    src={exhibition.image} 
                    alt={exhibition.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    {exhibition.type && <Badge className="mb-2">{exhibition.type}</Badge>}
                    <h3 className="font-heading text-xl mb-2">{exhibition.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{exhibition.location}</p>
                    <p className="text-sm mb-4">
                      {exhibition.date && new Date(exhibition.date).toLocaleDateString()} - {exhibition.endDate && new Date(exhibition.endDate).toLocaleDateString()}
                    </p>
                    <Link to={`/exhibitions`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Connect Modal */}
      <ConnectArtistModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        artistName={artist.name}
        artworkTitle="General Inquiry"
        artistId={artist.id || artist._id}
      />
    </div>
  );
};

export default ArtistProfile;
