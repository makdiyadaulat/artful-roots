import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<"artist" | "visitor">("visitor");
  const navigate = useNavigate();
  const { login, register } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(loginEmail, loginPassword)
        .then(() => {
          toast.success("Logged in successfully");
          // role will be decided by server; navigate by returned user in navbar or back
          navigate("/");
        })
        .catch((e) => toast.error(e.message))
        .finally(() => setIsLoading(false));
    }, 600);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const role = signupRole;
      register(signupName, signupEmail, signupPassword, role)
        .then(() => {
          toast.success("Account created successfully");
          navigate("/");
        })
        .catch((e) => toast.error(e.message))
        .finally(() => setIsLoading(false));
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-hero">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-serif font-bold text-primary mb-2">
            <Palette className="w-10 h-10" />
            <span className="inline-flex items-baseline gap-1">
              <span>Rang</span>
              <span className="text-accent">Manch</span>
              <span>Gallery</span>
            </span>
          </Link>
          <p className="text-muted-foreground">Join our creative community</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="artist@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <a href="#" className="text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                {/* Role Selector (no tabs inside) */}
                <div className="grid w-full grid-cols-2 gap-2 mb-4">
                  <Button
                    type="button"
                    variant={signupRole === "artist" ? "default" : "outline"}
                    onClick={() => setSignupRole("artist")}
                    aria-pressed={signupRole === "artist"}
                    className="w-full"
                  >
                    Artist
                  </Button>
                  <Button
                    type="button"
                    variant={signupRole === "visitor" ? "default" : "outline"}
                    onClick={() => setSignupRole("visitor")}
                    aria-pressed={signupRole === "visitor"}
                    className="w-full"
                  >
                    Visitor
                  </Button>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{signupRole === "artist" ? "Artist Name" : "Full Name"}</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your creative name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="artist@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" required className="mt-1" />
                    <span className="text-sm text-muted-foreground">
                      I agree to the Terms of Service and Privacy Policy
                    </span>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
