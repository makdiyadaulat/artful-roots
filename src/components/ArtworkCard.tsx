import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

export interface ArtworkCardProps {
  id: string;
  title: string;
  artist: string;
  image: string;
  category: string;
  price: number;
  likes: number;
}

const ArtworkCard = ({ id, title, artist, image, category, price, likes }: ArtworkCardProps) => {
  return (
    <Link to={`/artwork/${id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all hover:scale-105">
        <img
          src={image}
          alt={title}
          className="w-full h-72 object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src.includes("placeholder.svg")) return;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="p-4">
          <h3 className="font-medium mb-2">{title}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{category}</p>
            <p className="font-bold">${price}</p>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {likes}
            </span>
            <span className="text-xs">by {artist}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ArtworkCard;


