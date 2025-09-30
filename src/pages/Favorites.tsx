import { Link, Navigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { mockArtworks } from '@/data/mockData';

const Favorites = () => {
  const { user, favorites, toggleFavorite } = useApp();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const favoriteArtworks = mockArtworks.filter(artwork => favorites.includes(artwork.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl mb-6">
            <Heart className="inline-block mr-4 h-12 w-12" />
            My Favorites
          </h1>
          <p className="text-xl text-muted-foreground">
            Your curated collection of inspiring artworks
          </p>
        </div>
      </section>

      {/* Favorites Grid */}
      <section className="container mx-auto px-4 py-16">
        {favoriteArtworks.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="font-heading text-3xl mb-4">No favorites yet</h2>
            <p className="text-muted-foreground mb-8">
              Start exploring and save artworks you love
            </p>
            <Button asChild size="lg">
              <Link to="/gallery">Explore Gallery</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                {favoriteArtworks.length} {favoriteArtworks.length === 1 ? 'artwork' : 'artworks'} saved
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteArtworks.map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden group">
                  <div className="relative">
                    <Link to={`/artwork/${artwork.id}`}>
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <button
                      onClick={() => toggleFavorite(artwork.id)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <Heart className="h-5 w-5 fill-current text-red-500" />
                    </button>
                  </div>

                  <div className="p-4">
                    <Link to={`/artwork/${artwork.id}`}>
                      <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                        {artwork.title}
                      </h3>
                    </Link>
                    <Link to={`/artist/${artwork.artistId}`}>
                      <p className="text-sm text-muted-foreground mb-2 hover:text-foreground transition-colors">
                        {artwork.artist}
                      </p>
                    </Link>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{artwork.category}</p>
                      <p className="font-bold">${artwork.price}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Favorites;
