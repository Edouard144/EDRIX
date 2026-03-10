import { useState } from "react";
import { Link } from "react-router-dom";
import { EdrixLogo } from "@/components/EdrixLogo";
import { EdrixInput } from "@/components/edrix/EdrixInput";
import { EdrixButton } from "@/components/edrix/EdrixButton";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("All fields are required."); return; }
    
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 animate-fade-slide-up">
        <div className="mb-8">
          <EdrixLogo />
        </div>
        <h1 className="font-syne font-bold text-2xl text-foreground mb-6">Welcome back</h1>
        {error && (
          <div className="border-l-2 border-destructive bg-destructive/5 text-destructive text-sm font-mono px-4 py-2 mb-4 rounded-r">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <EdrixInput label="Email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <EdrixInput label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          <EdrixButton type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </EdrixButton>
        </form>
        <p className="text-xs font-mono text-muted-foreground mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
