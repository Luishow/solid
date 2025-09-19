"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  XCircle,
  Clock,
  Search, 
  Filter,
  Eye,
  Download,
  DollarSign
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

interface ReimbursementRequest {
  id: string;
  employeeName: string;
  employeeAvatar?: string;
  amount: number;
  category: string;
  description: string;
  status: "pendente" | "aprovado" | "rejeitado";
  submittedAt: string;
  receiptUrl?: string;
  justification?: string;
}

const mockReimbursements: ReimbursementRequest[] = [
  {
    id: "1",
    employeeName: "João Santos",
    amount: 250.00,
    category: "Transporte",
    description: "Uber para reunião com cliente",
    status: "pendente",
    submittedAt: "2024-01-20T10:30:00",
    receiptUrl: "/receipt1.pdf"
  },
  {
    id: "2",
    employeeName: "Maria Costa",
    amount: 89.90,
    category: "Alimentação",
    description: "Almoço de negócios",
    status: "pendente",
    submittedAt: "2024-01-19T14:15:00",
    receiptUrl: "/receipt2.pdf"
  },
  {
    id: "3",
    employeeName: "Pedro Lima",
    amount: 1200.00,
    category: "Equipamentos",
    description: "Monitor 4K para home office",
    status: "aprovado",
    submittedAt: "2024-01-18T09:20:00",
    receiptUrl: "/receipt3.pdf"
  },
  {
    id: "4",
    employeeName: "Lucas Ferreira",
    amount: 45.50,
    category: "Transporte",
    description: "Estacionamento durante evento",
    status: "rejeitado",
    submittedAt: "2024-01-17T16:45:00",
    receiptUrl: "/receipt4.pdf",
    justification: "Valor acima do limite permitido para estacionamento"
  },
  {
    id: "5",
    employeeName: "Amanda Rodrigues",
    amount: 320.00,
    category: "Educação",
    description: "Curso online de certificação",
    status: "pendente",
    submittedAt: "2024-01-16T11:00:00",
    receiptUrl: "/receipt5.pdf"
  }
];

const categories = ["Todos", "Transporte", "Alimentação", "Equipamentos", "Educação", "Hospedagem"];

export default function ReimbursementApprovalPage() {
  const [reimbursements, setReimbursements] = useState(mockReimbursements);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todos");

  const filteredReimbursements = reimbursements.filter(request => {
    const matchesSearch = !searchQuery || 
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesCategory = categoryFilter === "Todos" || request.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleApprove = (id: string) => {
    setReimbursements(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status: "aprovado" as const } : request
      )
    );
  };

  const handleReject = (id: string) => {
    setReimbursements(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status: "rejeitado" as const } : request
      )
    );
  };

  const pendingCount = reimbursements.filter(r => r.status === "pendente").length;
  const pendingAmount = reimbursements
    .filter(r => r.status === "pendente")
    .reduce((sum, r) => sum + r.amount, 0);
  const approvedThisMonth = reimbursements.filter(r => 
    r.status === "aprovado" && 
    new Date(r.submittedAt).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Aprovação de Reembolsos</h1>
        <p className="text-muted-foreground">
          Analise e aprove solicitações de reembolso da equipe
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando aprovação
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Pendente</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados (Mês)</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedThisMonth}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reimbursements.length}</div>
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
                placeholder="Buscar por funcionário..."
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
                <SelectItem value="pendente">Pendente</SelectItem>
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

            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4 text-yellow-400" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reimbursement Requests */}
      <div className="space-y-4">
        {filteredReimbursements.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.employeeAvatar} alt={request.employeeName} />
                    <AvatarFallback>
                      {request.employeeName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{request.employeeName}</h3>
                      <Badge variant={
                        request.status === "aprovado" ? "default" : 
                        request.status === "rejeitado" ? "destructive" : "secondary"
                      }>
                        {request.status}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor</p>
                        <p className="font-semibold text-lg">
                          R$ {request.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Categoria</p>
                        <p className="font-medium">{request.category}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Descrição</p>
                        <p>{request.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Data da Solicitação</p>
                        <p>{format(new Date(request.submittedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                      </div>
                    </div>

                    {request.justification && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Justificativa:</p>
                        <p className="text-sm">{request.justification}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4 text-yellow-400" />
                    Ver Comprovante
                  </Button>
                  
                  {request.status === "pendente" && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(request.id)}
                        className="gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-yellow-400" />
                        Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReject(request.id)}
                        className="gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReimbursements.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle className="h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-muted-foreground text-center">
              Não há solicitações de reembolso que correspondam aos filtros aplicados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
