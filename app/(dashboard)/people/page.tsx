"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { usePeople } from "@/hooks/use-people";
import { DataTable } from "@/components/people/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Users, Download } from "lucide-react";
import { Person, departments, roles } from "@/data/people";
import Link from "next/link";

export default function PeoplePage() {
  const { people, deletePerson, duplicatePerson, loading } = usePeople();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      const matchesSearch = !searchQuery || 
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || person.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || person.department === departmentFilter;
      const matchesRole = roleFilter === "all" || person.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment && matchesRole;
    });
  }, [people, searchQuery, statusFilter, departmentFilter, roleFilter]);

  const handleEdit = (person: Person) => {
    router.push(`/people/${person.id}`);
  };

  const activeFilters = [
    statusFilter !== "all" && statusFilter,
    departmentFilter !== "all" && departmentFilter,
    roleFilter !== "all" && roleFilter
  ].filter(Boolean);

  const clearFilters = () => {
    setStatusFilter("all");
    setDepartmentFilter("all");
    setRoleFilter("all");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pessoas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as pessoas da organização
          </p>
        </div>
        <Link href="/people/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4 text-yellow-400" />
            Nova Pessoa
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{people.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {people.filter(p => p.status === "ativo").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativas</CardTitle>
            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {people.filter(p => p.status === "inativo").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(people.map(p => p.department).filter(Boolean)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-yellow-400" />
            Filtros
          </CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar pessoas específicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
            <Input
              placeholder="Buscar por nome, e-mail ou cargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid gap-4 md:grid-cols-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os departamentos</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cargos</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              {activeFilters.length > 0 && (
                <Button variant="outline" onClick={clearFilters} size="sm">
                  Limpar filtros
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4 text-yellow-400" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Filtros ativos:</span>
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {filter}
                </Badge>
              ))}
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Exibindo {filteredPeople.length} de {people.length} pessoas
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      {filteredPeople.length === 0 && people.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma pessoa cadastrada</h3>
            <p className="text-muted-foreground text-center mb-6">
              Comece cadastrando a primeira pessoa da sua organização.
            </p>
            <Link href="/people/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4 text-yellow-400" />
                Cadastrar primeira pessoa
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : filteredPeople.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
            <p className="text-muted-foreground text-center mb-6">
              Tente ajustar os filtros ou termos de busca.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          data={filteredPeople}
          onEdit={handleEdit}
          onDelete={deletePerson}
          onDuplicate={duplicatePerson}
        />
      )}
    </div>
  );
}