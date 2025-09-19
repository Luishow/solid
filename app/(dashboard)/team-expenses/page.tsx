"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  TrendingUp,
  TrendingDown,
  Search, 
  Filter,
  Download,
  Plus,
  Calendar,
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

interface Expense {
  id: string;
  teamName: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: "aprovado" | "pendente" | "rejeitado";
  employeeName: string;
  receiptUrl?: string;
}

const mockExpenses: Expense[] = [
  {
    id: "1",
    teamName: "Desenvolvimento Frontend",
    category: "Software",
    description: "Licença Figma Pro anual",
    amount: 1200.00,
    date: "2024-01-20",
    status: "aprovado",
    employeeName: "Ana Silva",
    receiptUrl: "/receipt1.pdf"
  },
  {
    id: "2",
    teamName: "Backend & APIs",
    category: "Infraestrutura",
    description: "AWS - Serviços de cloud",
    amount: 850.50,
    date: "2024-01-19",
    status: "aprovado",
    employeeName: "Carlos Oliveira",
    receiptUrl: "/receipt2.pdf"
  },
  {
    id: "3",
    teamName: "DevOps & Infraestrutura",
    category: "Equipamentos",
    description: "SSD 2TB para servidor",
    amount: 450.00,
    date: "2024-01-18",
    status: "pendente",
    employeeName: "Roberto Souza",
    receiptUrl: "/receipt3.pdf"
  },
  {
    id: "4",
    teamName: "Desenvolvimento Frontend",
    category: "Educação",
    description: "Curso React Advanced",
    amount: 299.90,
    date: "2024-01-17",
    status: "aprovado",
    employeeName: "Ana Silva",
    receiptUrl: "/receipt4.pdf"
  },
  {
    id: "5",
    teamName: "QA & Testes",
    category: "Software",
    description: "Licença Selenium Grid",
    amount: 180.00,
    date: "2024-01-16",
    status: "rejeitado",
    employeeName: "Juliana Alves",
    receiptUrl: "/receipt5.pdf"
  },
  {
    id: "6",
    teamName: "Backend & APIs",
    category: "Hospedagem",
    description: "Hotel para conferência",
    amount: 320.00,
    date: "2024-01-15",
    status: "aprovado",
    employeeName: "Carlos Oliveira",
    receiptUrl: "/receipt6.pdf"
  }
];

const teams = ["Todos", "Desenvolvimento Frontend", "Backend & APIs", "DevOps & Infraestrutura", "QA & Testes"];
const categories = ["Todos", "Software", "Infraestrutura", "Equipamentos", "Educação", "Hospedagem"];

export default function TeamExpensesPage() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState<string>("Todos");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todos");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = !searchQuery || 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTeam = teamFilter === "Todos" || expense.teamName === teamFilter;
    const matchesCategory = categoryFilter === "Todos" || expense.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
    
    return matchesSearch && matchesTeam && matchesCategory && matchesStatus;
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = expenses.filter(e => e.status === "aprovado").reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === "pendente").reduce((sum, e) => sum + e.amount, 0);
  const thisMonthExpenses = expenses.filter(e => 
    new Date(e.date).getMonth() === new Date().getMonth()
  ).reduce((sum, e) => sum + e.amount, 0);

  // Mock data para comparação mensal
  const lastMonthExpenses = thisMonthExpenses * 0.85; // Simula 15% de aumento
  const monthlyGrowth = ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Despesas do Time</h1>
          <p className="text-muted-foreground">
            Monitore e gerencie gastos das equipes
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4 text-yellow-400" />
          Nova Despesa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Todos os tempos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {approvedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter(e => e.status === "aprovado").length} despesas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {pendingExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter(e => e.status === "pendente").length} aguardando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            {monthlyGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-yellow-400" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {thisMonthExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}% vs mês anterior
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
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <Input
                placeholder="Buscar despesas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4 text-yellow-400" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{expense.description}</h3>
                    <Badge variant={
                      expense.status === "aprovado" ? "default" : 
                      expense.status === "rejeitado" ? "destructive" : "secondary"
                    }>
                      {expense.status}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="font-medium">{expense.teamName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Categoria</p>
                      <p className="font-medium">{expense.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Solicitante</p>
                      <p className="font-medium">{expense.employeeName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data</p>
                      <p className="font-medium">
                        {format(new Date(expense.date), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className="text-2xl font-bold">
                    R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 gap-2">
                    <Download className="w-4 h-4 text-yellow-400" />
                    Comprovante
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExpenses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CreditCard className="h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma despesa encontrada</h3>
            <p className="text-muted-foreground text-center mb-6">
              Não há despesas que correspondam aos filtros aplicados.
            </p>
            <Button className="gap-2">
              <Plus className="w-4 h-4 text-yellow-400" />
              Adicionar primeira despesa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
