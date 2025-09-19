"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Mail, Shield, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useUsers } from "@/hooks/use-users";
import { AppUser, games } from "@/data/users";

export default function CreateUserPage() {
  const router = useRouter();
  const { addUser } = useUsers();
  const [loading, setLoading] = useState(false);
  type FormState = {
    name: string;
    email: string;
    role: AppUser["role"];
    password: string;
    game: string;
  };
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    role: "administrativo",
    password: "",
    game: "",
  });

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.name || !form.email || !form.password) {
        toast.error("Preencha nome, e-mail e senha");
        return;
      }
      await new Promise(r => setTimeout(r, 300));
      addUser({ name: form.name, email: form.email, role: form.role, game: form.role === "jogador" && form.game ? form.game : undefined });
      toast.success("Usuário criado com sucesso!");
      router.push("/users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <UserPlus className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Criar Usuário</h1>
            <p className="text-muted-foreground">Cadastre um novo usuário do sistema</p>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Dados básicos do usuário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
                  <Input id="name" className="pl-10" value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="João da Silva" />
                </div>
                <p className="text-xs text-muted-foreground">Nome completo como aparecerá no sistema</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
                  <Input id="email" className="pl-10" type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="joao@empresa.com" />
                </div>
                <p className="text-xs text-muted-foreground">Usado para login e notificações</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissões e Segurança</CardTitle>
            <CardDescription>Defina o cargo e a senha de acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
                  <Select value={form.role} onValueChange={v => handleChange("role", v as FormState["role"]) }>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrativo">Administrativo</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="jogador">Jogador</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">Controla permissões e acessos</p>
              </div>
              {form.role === "jogador" && (
                <div className="space-y-2">
                  <Label htmlFor="game">Jogo</Label>
                  <Select value={form.game} onValueChange={v => handleChange("game", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o jogo" />
                    </SelectTrigger>
                    <SelectContent>
                      {games.map(g => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
                  <Input id="password" className="pl-10" type="password" value={form.password} onChange={e => handleChange("password", e.target.value)} placeholder="••••••••" />
                </div>
                <p className="text-xs text-muted-foreground">Use pelo menos 8 caracteres</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Link href="/">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Criar Usuário"}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}


