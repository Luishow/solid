"use client";

import { useMemo, useState } from "react";
import { useUsers } from "@/hooks/use-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus, Search, Trash2, Gamepad2 } from "lucide-react";

export default function ManagerUsersPage() {
  const { users, loading, deleteUser } = useUsers();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const pool = users.filter(u => u.role === "manager" || u.role === "jogador");
    const query = q.toLowerCase();
    return pool.filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.role.toLowerCase().includes(query)
    );
  }, [users, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários do Manager</h1>
          <p className="text-muted-foreground">Gerencie usuários com cargos Manager e Jogador</p>
        </div>
        <Link href="/managers/users/new">
          <Button className="gap-2"><UserPlus className="w-4 h-4 text-yellow-400" /> Novo Usuário</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-4 h-4 text-yellow-400" /> Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
            <Input className="pl-10" placeholder="Buscar por nome, e-mail ou cargo..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div className="text-sm text-muted-foreground">Exibindo {filtered.length} de {users.filter(u => u.role === "manager" || u.role === "jogador").length} usuários</div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhum usuário encontrado
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(u => (
            <Card key={u.id}>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{u.name}</h3>
                  <Badge variant="secondary" className="text-xs capitalize">{u.role}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{u.email}</div>
                {u.role === "jogador" && u.game && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3" /> {u.game}
                  </div>
                )}
                <div className="flex justify-end pt-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => deleteUser(u.id)}>
                    <Trash2 className="w-4 h-4" /> Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


