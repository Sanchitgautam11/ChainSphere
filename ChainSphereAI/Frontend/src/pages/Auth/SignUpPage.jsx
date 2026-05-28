import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, ArrowLeft, AlertCircle, Loader2, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    clearError();
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const apiData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        company: formData.company,
      };
      await register(apiData);
      navigate("/dashboard");
    } catch {
      // Error is already set in AuthContext
    }
  };

  return (
    <div className="w-full">
      <a
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
      </a>

      <Card className="w-full bg-background/80 backdrop-blur-2xl border-white/10 shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shadow-teal-500/20">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>Enter your details to get started with ChainSphere</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">First name</label>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Last name</label>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <Input
                type="text"
                name="company"
                placeholder="Enter company name"
                value={formData.company}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" variant="gradient" className="w-full mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
