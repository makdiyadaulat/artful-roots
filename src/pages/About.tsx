import { Card } from '@/components/ui/card';
import { Heart, Users, Palette, TrendingUp } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl mb-6">About ArtVerse</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering emerging artists to showcase their talent and connect with art enthusiasts worldwide
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl mb-8 text-center">Our Mission</h2>
          <Card className="p-8 lg:p-12">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              ArtVerse was born from a simple belief: every artist deserves a platform to share their vision with the world. 
              We're building more than just a gallery – we're creating a vibrant community where emerging artists can thrive, 
              connect, and grow their careers.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our platform removes the traditional barriers to entry in the art world, making it easy for artists to showcase 
              their work professionally, reach a global audience, and engage directly with collectors and enthusiasts who 
              appreciate their unique creative voice.
            </p>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <h2 className="font-heading text-3xl md:text-4xl mb-12 text-center">Our Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-heading text-xl mb-4">Passion</h3>
            <p className="text-muted-foreground">
              We believe in the transformative power of art and the artists who create it
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-heading text-xl mb-4">Community</h3>
            <p className="text-muted-foreground">
              Building connections between artists and art lovers around the world
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Palette className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-heading text-xl mb-4">Creativity</h3>
            <p className="text-muted-foreground">
              Celebrating diverse artistic expressions and unique creative visions
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-heading text-xl mb-4">Growth</h3>
            <p className="text-muted-foreground">
              Supporting artists at every stage of their creative journey
            </p>
          </Card>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl mb-8 text-center">Our Story</h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Founded in 2021, ArtVerse emerged from conversations with hundreds of talented artists who felt overlooked 
              by traditional galleries and institutions. They had the talent, the dedication, and the unique vision – 
              but lacked the platform to reach their audience.
            </p>
            <p>
              We set out to change that. By combining cutting-edge technology with a deep respect for artistic integrity, 
              we've created a space where artists control their own narrative, set their own prices, and build direct 
              relationships with their collectors.
            </p>
            <p>
              Today, ArtVerse is home to thousands of artists from over 50 countries, each bringing their unique 
              perspective and style to our global community. From abstract painters to digital artists, from photographers 
              to sculptors – we celebrate every form of creative expression.
            </p>
            <p>
              But we're just getting started. Every day, we're working to add new features, forge new partnerships, and 
              create more opportunities for our artists to succeed. Because when artists thrive, art thrives – and the 
              world becomes a more beautiful, meaningful place.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <h2 className="font-heading text-3xl md:text-4xl mb-12 text-center">By The Numbers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <p className="text-5xl font-bold mb-2">2,500+</p>
            <p className="text-muted-foreground">Artists</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold mb-2">15,000+</p>
            <p className="text-muted-foreground">Artworks</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold mb-2">50+</p>
            <p className="text-muted-foreground">Countries</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold mb-2">100+</p>
            <p className="text-muted-foreground">Exhibitions</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
