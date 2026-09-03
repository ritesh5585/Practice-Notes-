// components/LoginForm.jsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({})
  console.log(formData)

  let router = useRouter

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Form submitted with data:", formData)
    try {
      console.log("Making API call to:", "/api/auth/login") // Add this
      let res = await api.post("/api/auth/login", formData)
      console.log(res)
      router.push("/home")  

    } catch (error) {
      console.error("error while login", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          {/* Icon */}
          <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <Lock className="h-7 w-7 text-primary" />
          </div>

          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1.5">
              Sign in to continue to your account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  onChange={handleChange}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent h-11"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  onChange={handleChange}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center pt-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Create one now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;

