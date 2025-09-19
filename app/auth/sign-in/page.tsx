"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - sempre aceita qualquer credencial
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto">
            <Image 
              src="/logo.png" 
              alt="Administrativo Solid" 
              width={64} 
              height={64} 
              className="w-16 h-16 rounded-2xl"
            />
          </div>
          <h1 className="text-2xl font-bold">Administrativo Solid</h1>
          <p className="text-muted-foreground">
            Entre em sua conta para continuar
          </p>
        </div>

        {/* Sign In Form */}
        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Use suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-yellow-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-yellow-400" />
                    Entrar
                    <ArrowRight className="w-4 h-4 text-yellow-400" />
                  </>
                )}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* Demo Info */}
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Demo:</strong> Use qualquer e-mail e senha para entrar
                </p>
              </div>
              
              <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                <h4 className="text-sm font-medium">Credenciais sugeridas:</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>E-mail:</strong> admin@company.com</p>
                  <p><strong>Senha:</strong> admin123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Sistema de demonstração - Frontend apenas</p>
        </div>
      </div>
    </div>
  );
}