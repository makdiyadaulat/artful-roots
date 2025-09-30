import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Users, TrendingUp, Heart } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import ArtworkCard from "@/components/ArtworkCard";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Home = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  useEffect(() => {
    api.artworks.list()
      .then((list) => {
        if (!Array.isArray(list)) return setFeaturedArtworks([]);
        const normalized = (list as any[]).map((a) => ({ ...a, id: a.id ?? a._id }));
        setFeaturedArtworks(normalized.slice(0, 4));
      })
      .catch(() => setFeaturedArtworks([]));
  }, []);

  useEffect(() => {
    api.artists.list()
      .then((list) => setArtists(Array.isArray(list) ? list : []))
      .catch(() => setArtists([]));
    api.exhibitions.list()
      .then((list) => setExhibitions(Array.isArray(list) ? list : []))
      .catch(() => setExhibitions([]));
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "Discover Emerging Talent",
      description: "Find unique artworks from talented artists around the world.",
    },
    {
      icon: Users,
      title: "Support Artists Directly",
      description: "Connect with artists and support their creative journey.",
    },
    {
      icon: TrendingUp,
      title: "Grow Your Collection",
      description: "Build a curated collection of original art pieces.",
    },
    {
      icon: Heart,
      title: "Join Our Community",
      description: "Be part of a vibrant community of art lovers and creators.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        
        <div className="container relative z-10 px-4 text-center animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            A Canvas for Emerging Artists
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover unique artworks, connect with talented creators, and build your personal art collection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/gallery">
              <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90 gap-2">
                Explore Gallery
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                Start Selling Your Art
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="pt-20 pb-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Featured Artworks</h2>
            <p className="text-muted-foreground text-lg">
              Handpicked pieces from our talented community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtworks.map((artwork, index) => (
              <div key={artwork.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ArtworkCard
                  id={artwork.id}
                  title={artwork.title}
                  artist={artwork.artist}
                  image={artwork.image}
                  category={artwork.category}
                  price={artwork.price}
                  likes={artwork.likes}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/gallery">
              <Button variant="outline" size="lg" className="gap-2">
                View All Artworks
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artist - Carousel */}
      <section className="pt-8 pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Featured Artist</h2>
            <p className="text-muted-foreground text-lg">Spotlight on an outstanding creator from our community</p>
          </div>

          <Carousel className="w-full">
            <CarouselContent>
              {/* Fetch artists from API */}
              {(artists || []).slice(0, 6).map((artist) => (
                <CarouselItem key={artist.id || artist._id} className="p-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <img
                        src={artist.banner || "/placeholder.svg"}
                        alt={artist.name}
                        className="w-full h-80 object-cover rounded-2xl shadow-card"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src.includes("placeholder.svg")) return;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={artist.avatar}
                          alt={artist.name}
                          className="w-16 h-16 rounded-full border"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (target.src.includes("placeholder.svg")) return;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <div>
                          <h3 className="text-2xl font-semibold leading-tight">{artist.name}</h3>
                          {artist.location && <p className="text-muted-foreground">{artist.location}</p>}
                        </div>
                      </div>
                      {artist.specialty && <Badge variant="secondary" className="mb-4">{artist.specialty}</Badge>}
                      {artist.bio && <p className="text-muted-foreground leading-relaxed mb-6">{artist.bio}</p>}
                      <div className="flex items-center gap-6 text-muted-foreground mb-6">
                        {typeof artist.followers === 'number' && (
                          <span className="flex items-center gap-2"><Users className="h-4 w-4" />{artist.followers.toLocaleString()} followers</span>
                        )}
                        {typeof artist.totalLikes === 'number' && (
                          <span className="flex items-center gap-2"><Heart className="h-4 w-4" />{artist.totalLikes.toLocaleString()} likes</span>
                        )}
                      </div>
                      <Link to={`/artist/${artist.id || artist._id}`}>
                        <Button className="gap-2">
                          View Profile
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Upcoming Exhibitions */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Upcoming Exhibitions</h2>
            <p className="text-muted-foreground text-lg">See what's happening next in the art world</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(exhibitions || []).slice(0, 3).map((exhibition, index) => (
              <Card key={exhibition.id || exhibition._id} className="overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <img src={exhibition.image} alt={exhibition.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  {exhibition.type && <Badge className="mb-2">{exhibition.type}</Badge>}
                  <h3 className="font-heading text-xl mb-2">{exhibition.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{exhibition.location}</p>
                  <p className="text-sm mb-4">
                    {exhibition.date && new Date(exhibition.date).toLocaleDateString()} - {exhibition.endDate && new Date(exhibition.endDate).toLocaleDateString()}
                  </p>
                  <Link to="/exhibitions">
                    <Button variant="outline" size="sm" className="gap-2">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
            {exhibitions.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground">No exhibitions yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">Empowering Artists, Inspiring Collectors</h2>
            <p className="text-lg text-muted-foreground mb-8">
              ArtVerse is more than just a marketplace. We're a thriving community dedicated to supporting 
              emerging artists and connecting them with art enthusiasts who appreciate unique, original works. 
              Every purchase directly supports an artist's creative journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-background rounded-xl p-6 shadow-card hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center bg-white/70 backdrop-blur-xl border border-border shadow-xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10" aria-hidden="true" />
            <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/25 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />

            <h2 className="relative text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight text-foreground">Ready to Start Your Journey?</h2>
            <p className="relative text-lg md:text-xl mb-10 text-muted-foreground max-w-2xl mx-auto">
              Join thousands of artists and collectors shaping the future of art
            </p>
            <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Join as Artist
                </Button>
              </Link>
              <Link to="/gallery">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-2xl border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-200"
                >
                  Browse Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
