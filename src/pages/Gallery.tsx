import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Heart } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { api } from "@/lib/api";
import ArtworkCard from "@/components/ArtworkCard";

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { likes, toggleLike, favorites, toggleFavorite } = useApp();

  const [artworksData, setArtworksData] = useState<any[]>([]);

  useEffect(() => {
    api.artworks.list()
      .then((list) => {
        if (!Array.isArray(list)) return setArtworksData([]);
        const normalized = (list as any[]).map((a) => ({ ...a, id: a.id ?? a._id }));
        setArtworksData(normalized);
      })
      .catch(() => setArtworksData([]));
  }, []);

  const filteredArtworks = artworksData.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || artwork.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtworks.map((artwork, index) => (
            <div key={artwork.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
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
