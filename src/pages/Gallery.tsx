import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Heart } from "lucide-react";

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const artworks = [
    { id: 1, title: "Abstract Dreams", artist: "Sarah Mitchell", price: "$450", category: "Abstract", likes: 234 },
    { id: 2, title: "Urban Reflections", artist: "Marcus Chen", price: "$680", category: "Digital", likes: 189 },
    { id: 3, title: "Nature's Whisper", artist: "Elena Rodriguez", price: "$520", category: "Oil Painting", likes: 312 },
    { id: 4, title: "Cosmic Journey", artist: "David Kim", price: "$890", category: "Mixed Media", likes: 156 },
    { id: 5, title: "Sunset Serenade", artist: "Lisa Park", price: "$720", category: "Watercolor", likes: 278 },
    { id: 6, title: "Modern Minimalism", artist: "James Wilson", price: "$550", category: "Abstract", likes: 201 },
    { id: 7, title: "Portrait of Time", artist: "Anna Schmidt", price: "$960", category: "Portrait", likes: 445 },
    { id: 8, title: "City Lights", artist: "Tom Anderson", price: "$420", category: "Photography", likes: 167 },
  ];

  const categories = ["All", "Abstract", "Digital", "Oil Painting", "Watercolor", "Mixed Media", "Portrait"];

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">Explore Gallery</h1>
          <p className="text-lg text-muted-foreground">
            Discover unique artworks from talented artists around the world
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search artworks, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button variant="outline" className="gap-2 h-12">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork, index) => (
            <Card
              key={artwork.id}
              className="overflow-hidden hover-lift cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="aspect-square bg-gradient-to-br from-primary/20 via-accent/20 to-secondary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="lg">
                    View Details
                  </Button>
                </div>

                {/* Like Button */}
                <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-muted-foreground hover:text-red-500 hover:fill-red-500 transition-colors" />
                </button>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground">{artwork.artist}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {artwork.category}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-primary font-bold text-lg">{artwork.price}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    <span>{artwork.likes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Load More Artworks
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
