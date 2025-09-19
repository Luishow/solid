"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus,
  Search, 
  Filter,
  Eye,
  Edit,
  Copy,
  Trash2,
  BarChart3,
  Users,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FormTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "ativo" | "rascunho" | "arquivado";
  createdAt: string;
  lastModified: string;
  submissions: number;
  fields: number;
  createdBy: string;
}

const mockForms: FormTemplate[] = [
  {
    id: "1",
    title: "Solicitação de Reembolso",
    description: "Formulário para solicitação de reembolsos de despesas corporativas",
    category: "Financeiro",
    status: "ativo",
    createdAt: "2024-01-15T10:00:00",
    lastModified: "2024-01-18T14:30:00",
    submissions: 45,
    fields: 8,
    createdBy: "Ana Silva"
  },
  {
    id: "2",
    title: "Avaliação de Performance",
    description: "Formulário trimestral de avaliação de desempenho dos funcionários",
    category: "RH",
    status: "ativo",
    createdAt: "2024-01-10T09:15:00",
    lastModified: "2024-01-20T11:45:00",
    submissions: 23,
    fields: 15,
    createdBy: "Carlos Oliveira"
  },
  {
    id: "3",
    title: "Solicitação de Férias",
    description: "Formulário para solicitação e aprovação de períodos de férias",
    category: "RH",
    status: "ativo",
    createdAt: "2024-01-08T16:20:00",
    lastModified: "2024-01-12T10:10:00",
    submissions: 67,
    fields: 6,
    createdBy: "Maria Costa"
  },
  {
    id: "4",
    title: "Relatório de Bugs",
    description: "Formulário para reportar bugs e problemas técnicos",
    category: "Técnico",
    status: "rascunho",
    createdAt: "2024-01-20T13:30:00",
    lastModified: "2024-01-20T15:45:00",
    submissions: 0,
    fields: 12,
    createdBy: "Pedro Lima"
  },
  {
    id: "5",
    title: "Feedback do Cliente",
    description: "Coleta de feedback e sugestões dos clientes",
    category: "Marketing",
    status: "ativo",
    createdAt: "2024-01-05T11:00:00",
    lastModified: "2024-01-15T09:20:00",
    submissions: 156,
    fields: 10,
    createdBy: "Lucas Ferreira"
  },
  {
    id: "6",
    title: "Solicitação de Equipamentos",
    description: "Formulário para solicitação de equipamentos e materiais de trabalho",
    category: "Administrativo",
    status: "arquivado",
    createdAt: "2023-12-20T14:15:00",
    lastModified: "2024-01-10T16:30:00",
    submissions: 34,
    fields: 9,
    createdBy: "Roberto Souza"
  }
];

const categories = ["Todos", "Financeiro", "RH", "Técnico", "Marketing", "Administrativo"];

export default function FormsPage() {
  const [forms, setForms] = useState(mockForms);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todos");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredForms = forms.filter(form => {
    const matchesSearch = !searchQuery || 
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "Todos" || form.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalForms = forms.length;
  const activeForms = forms.filter(f => f.status === "ativo").length;
  const totalSubmissions = forms.reduce((sum, form) => sum + form.submissions, 0);
  const draftForms = forms.filter(f => f.status === "rascunho").length;

  const handleDuplicate = (id: string) => {
    const formToDuplicate = forms.find(f => f.id === id);
    if (formToDuplicate) {
      const newForm = {
        ...formToDuplicate,
        id: Date.now().toString(),
        title: `${formToDuplicate.title} (Cópia)`,
        status: "rascunho" as const,
        submissions: 0,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      setForms(prev => [newForm, ...prev]);
    }
  };

  const handleDelete = (id: string) => {
    setForms(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Formulários</h1>
          <p className="text-muted-foreground">
            Crie e gerencie formulários para sua equipe
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4 text-yellow-400" />
          Novo Formulário
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Formulários</CardTitle>
            <FileText className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalForms}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeForms}</div>
            <p className="text-xs text-muted-foreground">
              Em uso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
            <BarChart3 className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Todas as submissões
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftForms}</div>
            <p className="text-xs text-muted-foreground">
              Em desenvolvimento
            </p>
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
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <Input
                placeholder="Buscar formulários..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="gap-2">
              <BarChart3 className="w-4 h-4 text-yellow-400" />
              Relatórios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forms Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredForms.map((form) => (
          <Card key={form.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-lg line-clamp-2">{form.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    form.status === "ativo" ? "default" : 
                    form.status === "rascunho" ? "secondary" : "outline"
                  }>
                    {form.status}
                  </Badge>
                  <Badge variant="outline">{form.category}</Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <FileText className="h-4 w-4 text-yellow-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4 text-yellow-400" />
                    Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4 text-yellow-400" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(form.id)}>
                    <Copy className="mr-2 h-4 w-4 text-yellow-400" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4 text-yellow-400" />
                    Relatórios
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDelete(form.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {form.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Respostas</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Users className="w-4 h-4 text-yellow-400" />
                    {form.submissions}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Campos</p>
                  <p className="font-semibold">{form.fields}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <div>
                  <span>Criado por: </span>
                  <span className="font-medium">{form.createdBy}</span>
                </div>
                <div>
                  <span>Última modificação: </span>
                  <span>{format(new Date(form.lastModified), "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 gap-2">
                  <Eye className="w-4 h-4 text-yellow-400" />
                  Ver
                </Button>
                <Button size="sm" className="flex-1 gap-2">
                  <Edit className="w-4 h-4 text-yellow-400" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum formulário encontrado</h3>
            <p className="text-muted-foreground text-center mb-6">
              Não há formulários que correspondam aos filtros aplicados.
            </p>
            <Button className="gap-2">
              <Plus className="w-4 h-4 text-yellow-400" />
              Criar primeiro formulário
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
