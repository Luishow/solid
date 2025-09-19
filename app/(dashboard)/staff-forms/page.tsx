"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Filter,
  Eye,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FormSubmission {
  id: string;
  formTitle: string;
  formCategory: string;
  status: "rascunho" | "enviado" | "aprovado" | "rejeitado" | "em_revisao";
  submittedAt?: string;
  lastModified: string;
  dueDate?: string;
  priority: "baixa" | "media" | "alta";
  completionRate: number;
  feedback?: string;
}

interface AvailableForm {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: number; // em minutos
  required: boolean;
  dueDate?: string;
}

const mockSubmissions: FormSubmission[] = [
  {
    id: "1",
    formTitle: "Avaliação de Performance Q1",
    formCategory: "RH",
    status: "enviado",
    submittedAt: "2024-01-20T10:30:00",
    lastModified: "2024-01-20T10:30:00",
    dueDate: "2024-01-25T23:59:59",
    priority: "alta",
    completionRate: 100
  },
  {
    id: "2",
    formTitle: "Solicitação de Férias",
    formCategory: "RH",
    status: "aprovado",
    submittedAt: "2024-01-18T14:15:00",
    lastModified: "2024-01-18T14:15:00",
    priority: "media",
    completionRate: 100,
    feedback: "Aprovado para o período solicitado. Boas férias!"
  },
  {
    id: "3",
    formTitle: "Relatório Mensal de Atividades",
    formCategory: "Administrativo",
    status: "rascunho",
    lastModified: "2024-01-21T09:20:00",
    dueDate: "2024-01-30T23:59:59",
    priority: "media",
    completionRate: 65
  },
  {
    id: "4",
    formTitle: "Feedback sobre Treinamento",
    formCategory: "Educação",
    status: "rejeitado",
    submittedAt: "2024-01-15T16:45:00",
    lastModified: "2024-01-15T16:45:00",
    priority: "baixa",
    completionRate: 100,
    feedback: "Por favor, forneça mais detalhes sobre os pontos de melhoria mencionados."
  },
  {
    id: "5",
    formTitle: "Pesquisa de Satisfação Interna",
    formCategory: "RH",
    status: "em_revisao",
    submittedAt: "2024-01-19T11:00:00",
    lastModified: "2024-01-19T11:00:00",
    priority: "baixa",
    completionRate: 100
  }
];

const availableForms: AvailableForm[] = [
  {
    id: "6",
    title: "Solicitação de Equipamentos",
    description: "Formulário para solicitação de novos equipamentos de trabalho",
    category: "Administrativo",
    estimatedTime: 10,
    required: false
  },
  {
    id: "7",
    title: "Avaliação 360º",
    description: "Avaliação completa incluindo autoavaliação e feedback de colegas",
    category: "RH",
    estimatedTime: 30,
    required: true,
    dueDate: "2024-02-15T23:59:59"
  },
  {
    id: "8",
    title: "Sugestões de Melhoria",
    description: "Compartilhe suas ideias para melhorar nossos processos",
    category: "Inovação",
    estimatedTime: 15,
    required: false
  }
];

const categories = ["Todos", "RH", "Administrativo", "Educação", "Inovação"];

export default function StaffFormsPage() {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todos");
  const [activeTab, setActiveTab] = useState<"my-forms" | "available">("my-forms");

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = !searchQuery || 
      submission.formTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    const matchesCategory = categoryFilter === "Todos" || submission.formCategory === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredAvailableForms = availableForms.filter(form => {
    const matchesSearch = !searchQuery || 
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "Todos" || form.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const totalForms = submissions.length;
  const completedForms = submissions.filter(s => s.status === "aprovado").length;
  const pendingForms = submissions.filter(s => s.status === "enviado" || s.status === "em_revisao").length;
  const draftForms = submissions.filter(s => s.status === "rascunho").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aprovado":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejeitado":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "em_revisao":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case "enviado":
        return <Send className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case "media":
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/20";
      default:
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Formulários</h1>
        <p className="text-muted-foreground">
          Preencha e acompanhe seus formulários
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "my-forms" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("my-forms")}
          className="gap-2"
        >
          <FileText className="w-4 h-4 text-yellow-400" />
          Meus Formulários
        </Button>
        <Button
          variant={activeTab === "available" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("available")}
          className="gap-2"
        >
          <Search className="w-4 h-4 text-yellow-400" />
          Formulários Disponíveis
        </Button>
      </div>

      {activeTab === "my-forms" && (
        <>
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <FileText className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalForms}</div>
                <p className="text-xs text-muted-foreground">
                  Formulários
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                <CheckCircle className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedForms}</div>
                <p className="text-xs text-muted-foreground">
                  Aprovados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingForms}</div>
                <p className="text-xs text-muted-foreground">
                  Em análise
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{draftForms}</div>
                <p className="text-xs text-muted-foreground">
                  Não enviados
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
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="enviado">Enviado</SelectItem>
                    <SelectItem value="em_revisao">Em Revisão</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>

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
              </div>
            </CardContent>
          </Card>

          {/* Submissions List */}
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <Card key={submission.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{submission.formTitle}</h3>
                        <Badge variant="outline" className="gap-1">
                          {getStatusIcon(submission.status)}
                          {submission.status.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(submission.priority)}`}>
                          {submission.priority}
                        </Badge>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Categoria</p>
                          <p className="font-medium">{submission.formCategory}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Progresso</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${submission.completionRate}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{submission.completionRate}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            {submission.submittedAt ? "Enviado em" : "Modificado em"}
                          </p>
                          <p className="font-medium">
                            {format(
                              new Date(submission.submittedAt || submission.lastModified), 
                              "dd/MM/yyyy", 
                              { locale: ptBR }
                            )}
                          </p>
                        </div>
                      </div>

                      {submission.dueDate && (
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Prazo: {format(new Date(submission.dueDate), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      )}

                      {submission.feedback && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium text-muted-foreground">Feedback:</p>
                          <p className="text-sm">{submission.feedback}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4 text-yellow-400" />
                        {submission.status === "rascunho" ? "Continuar" : "Visualizar"}
                      </Button>
                      
                      {submission.status === "rascunho" && (
                        <Button size="sm" className="gap-2">
                          <Send className="w-4 h-4 text-yellow-400" />
                          Enviar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === "available" && (
        <>
          {/* Available Forms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-yellow-400" />
                Formulários Disponíveis
              </CardTitle>
              <CardDescription>
                Formulários que você pode preencher
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
                  <Input
                    placeholder="Buscar formulários disponíveis..."
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
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAvailableForms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{form.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{form.category}</Badge>
                        {form.required && (
                          <Badge variant="destructive" className="text-xs">
                            Obrigatório
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {form.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span>~{form.estimatedTime} min</span>
                    </div>
                    
                    {form.dueDate && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">
                          {format(new Date(form.dueDate), "dd/MM", { locale: ptBR })}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full gap-2">
                    <FileText className="w-4 h-4 text-yellow-400" />
                    Iniciar Preenchimento
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Empty States */}
      {activeTab === "my-forms" && filteredSubmissions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum formulário encontrado</h3>
            <p className="text-muted-foreground text-center mb-6">
              Você ainda não possui formulários ou nenhum corresponde aos filtros aplicados.
            </p>
            <Button onClick={() => setActiveTab("available")} className="gap-2">
              <Search className="w-4 h-4 text-yellow-400" />
              Ver formulários disponíveis
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "available" && filteredAvailableForms.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum formulário disponível</h3>
            <p className="text-muted-foreground text-center">
              Não há formulários disponíveis que correspondam aos filtros aplicados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
