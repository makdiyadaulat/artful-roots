import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Users, TrendingUp, Heart } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Home = () => {
  const featuredArtworks = [
    {
      id: 1,
      title: "Abstract Dreams",
      artist: "Sarah Mitchell",
      price: "$450",
      category: "Abstract",
    },
    {
      id: 2,
      title: "Urban Reflections",
      artist: "Marcus Chen",
      price: "$680",
      category: "Digital",
    },
    {
      id: 3,
      title: "Nature's Whisper",
      artist: "Elena Rodriguez",
      price: "$520",
      category: "Oil Painting",
    },
    {
      id: 4,
      title: "Cosmic Journey",
      artist: "David Kim",
      price: "$890",
      category: "Mixed Media",
    },
  ];

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
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Featured Artworks</h2>
            <p className="text-muted-foreground text-lg">
              Handpicked pieces from our talented community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtworks.map((artwork, index) => (
              <Card
                key={artwork.id}
                className="overflow-hidden hover-lift cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 via-accent/20 to-secondary relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium">{artwork.category}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{artwork.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{artwork.artist}</p>
                  <p className="text-primary font-bold">{artwork.price}</p>
                </CardContent>
              </Card>
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
          <div className="bg-gradient-primary rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-serif font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of artists and collectors in our creative community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Join as Artist
                </Button>
              </Link>
              <Link to="/gallery">
                <Button size="lg" variant="outline" className="text-lg px-8 border-2 border-white text-white hover:bg-white hover:text-primary">
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
