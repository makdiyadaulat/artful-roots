import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Heart, Share2, MessageCircle, ZoomIn, ChevronLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { api } from '@/lib/api';
import ConnectArtistModal from '@/components/ConnectArtistModal';
import { toast } from 'sonner';

const ArtworkDetail = () => {
  const { id } = useParams();
  const { likes, toggleLike, favorites, toggleFavorite, user } = useApp();
  const [showZoom, setShowZoom] = useState(false);
  const [comment, setComment] = useState('');
  const [localComments, setLocalComments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const [artwork, setArtwork] = useState<any | null>(null);
  const [artist, setArtist] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const relatedArtworks: any[] = [];

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setNotFound(false);
    api.artworks.get(id)
      .then((a) => {
        setArtwork(a);
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted-foreground">Loading artwork…</div>
      </div>
    );
  }

  if (notFound || !artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Artwork not found</h2>
          <Link to="/gallery">
            <Button>Back to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLiked = likes.includes(artwork.id);
  const isFavorited = favorites.includes(artwork.id);
  const allComments = [...(artwork.comments || []), ...localComments];

  const handleLike = () => {
    toggleLike(artwork.id);
    toast.success(isLiked ? 'Removed from likes' : 'Added to likes');
  };

  const handleFavorite = () => {
    toggleFavorite(artwork.id);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!id || !comment.trim()) return;
    try {
      setIsSubmitting(true);
      const created = await api.artworks.addComment(id, comment.trim());
      setLocalComments([...localComments, created]);
      setComment('');
      toast.success('Comment added!');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/gallery" className="hover:text-foreground">Gallery</Link>
          <span>/</span>
          <span className="text-foreground">{artwork.title}</span>
        </div>

        <Button variant="ghost" asChild className="mb-6">
          <Link to="/gallery">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Artwork Image */}
          <div>
            <div className="relative group">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full rounded-lg shadow-2xl cursor-zoom-in"
                onClick={() => setShowZoom(true)}
              />
              <button
                onClick={() => setShowZoom(true)}
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Artwork Details */}
          <div>
            <h1 className="font-heading text-4xl lg:text-5xl mb-4">{artwork.title}</h1>
            
            {/* Artist Info (pending backend endpoint) */}

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Medium</p>
                  <p className="font-medium">{artwork.medium}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-medium">{artwork.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{artwork.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium text-2xl">${artwork.price}</p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-8">{artwork.description}</p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button onClick={handleLike} variant={isLiked ? "default" : "outline"}>
                <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button onClick={handleFavorite} variant={isFavorited ? "default" : "outline"}>
                <Heart className={`mr-2 h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Connect with Artist Button */}
            <Button
              onClick={() => setShowConnectModal(true)}
              size="lg"
              className="w-full mb-4"
            >
              <User className="mr-2 h-5 w-5" />
              Connect with Artist
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Interested in this artwork? Get in touch with the artist directly
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16">
          <h2 className="font-heading text-3xl mb-8">Comments ({allComments.length})</h2>
          
          {/* Add Comment */}
          {user ? (
            <Card className="p-6 mb-8">
              <Textarea
                placeholder="Share your thoughts about this artwork..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-4"
                rows={3}
              />
              <Button onClick={handleAddComment} disabled={isSubmitting || !comment.trim()}>
                <MessageCircle className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Adding…' : 'Add Comment'}
              </Button>
            </Card>
          ) : (
            <Card className="p-6 mb-8 text-center">
              <p className="text-muted-foreground mb-4">Please login to comment</p>
              <Button asChild>
                <Link to="/auth">Login</Link>
              </Button>
            </Card>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {allComments.map((comment) => (
              <Card key={comment.id} className="p-6">
                <div className="flex gap-4">
                  <img
                    src={comment.avatar}
                    alt={comment.user}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">{comment.user}</p>
                      <span className="text-sm text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-muted-foreground">{comment.text}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Artworks */}
        {relatedArtworks.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-3xl mb-8">Similar Artworks</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArtworks.map((art) => (
                <Link key={art.id} to={`/artwork/${art.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                    <img src={art.image} alt={art.title} className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <h3 className="font-medium mb-1">{art.title}</h3>
                      <p className="text-sm text-muted-foreground">{art.artist}</p>
                      <p className="font-bold mt-2">${art.price}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {showZoom && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowZoom(false)}
        >
          <img
            src={artwork.image}
            alt={artwork.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Connect Artist Modal */}
      <ConnectArtistModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        artistName={artwork.artist}
        artworkTitle={artwork.title}
        artistId={artwork.artistId}
      />
    </div>
  );
};

export default ArtworkDetail;
