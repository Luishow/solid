"use client";

export const dynamic = "force-dynamic";

import { usePeople } from "@/hooks/use-people";
import { useEmployees } from "@/hooks/use-employees";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Building,
  Star,
  Calendar,
  Activity,
  Award,
  Briefcase,
  Target,
  BarChart3,
  Receipt,
  AlertTriangle,
  MapPin,
  Zap
} from "lucide-react";
import { format, subDays, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { useMemo, useState } from "react";
import { mockReimbursements, getReimbursementStats } from "@/data/reimbursements";
// ChartCard temporariamente removido para debug
const ChartCard = ({ title, description, ...props }: { title: string; description?: string; [key: string]: any }) => (
  <Card>
    <CardHeader>
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </CardHeader>
    <CardContent>
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        Gráfico temporariamente desabilitado
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { people, stats, loading } = usePeople();
  const { employees, stats: employeeStats, loading: employeesLoading } = useEmployees();
  const [selectedPeriod, setSelectedPeriod] = useState("30"); // dias
  
  // Stats de reembolsos
  const reimbursementStats = useMemo(() => getReimbursementStats(mockReimbursements), []);
  
  // Atividades recentes combinadas
  const recentActivities = useMemo(() => {
    const activities = [];
    
    // Funcionários recentes
    const recentEmployees = employees
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map(emp => ({
        id: emp.id,
        type: "employee" as const,
        title: `${emp.name} foi contratado`,
        description: `${emp.position} - ${emp.department}`,
        date: emp.createdAt,
        icon: UserCheck,
        color: "text-green-600"
      }));
    
    // Reembolsos recentes
    const recentReimbursements = mockReimbursements
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 3)
      .map(reimb => ({
        id: reimb.id,
        type: "reimbursement" as const,
        title: `Reembolso ${reimb.status === "aprovado" ? "aprovado" : reimb.status === "rejeitado" ? "rejeitado" : "solicitado"}`,
        description: `${reimb.employeeName} - R$ ${reimb.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        date: reimb.submittedAt,
        icon: reimb.status === "aprovado" ? CheckCircle : reimb.status === "rejeitado" ? XCircle : Clock,
        color: reimb.status === "aprovado" ? "text-green-600" : reimb.status === "rejeitado" ? "text-red-600" : "text-yellow-600"
      }));
    
    activities.push(...recentEmployees, ...recentReimbursements);
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
  }, [employees]);

  const chartData = useMemo(() => {
    const now = new Date();
    
    // Dados de cadastros por mês (últimos 6 meses) - Pessoas
    const monthlyPeopleData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthPeople = people.filter(person => {
        const createdDate = new Date(person.createdAt);
        return createdDate.getMonth() === date.getMonth() && 
               createdDate.getFullYear() === date.getFullYear();
      });
      
      monthlyPeopleData.push({
        name: format(date, "MMM", { locale: ptBR }),
        pessoas: monthPeople.length,
        funcionarios: employees.filter(emp => {
          const hireDate = new Date(emp.hireDate);
          return hireDate.getMonth() === date.getMonth() && 
                 hireDate.getFullYear() === date.getFullYear();
        }).length
      });
    }

    // Dados de reembolsos por mês
    const monthlyReimbursementData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthReimbursements = mockReimbursements.filter(reimb => {
        const submittedDate = new Date(reimb.submittedAt);
        return submittedDate.getMonth() === date.getMonth() && 
               submittedDate.getFullYear() === date.getFullYear();
      });
      
      const approved = monthReimbursements.filter(r => r.status === "aprovado");
      const pending = monthReimbursements.filter(r => r.status === "pendente");
      const rejected = monthReimbursements.filter(r => r.status === "rejeitado");
      
      monthlyReimbursementData.push({
        name: format(date, "MMM", { locale: ptBR }),
        aprovados: approved.length,
        pendentes: pending.length,
        rejeitados: rejected.length,
        valor: approved.reduce((sum, r) => sum + r.amount, 0)
      });
    }

    // Status das pessoas
    const statusData = [
      { name: "Ativos", value: stats.active, color: "#10b981" },
      { name: "Inativos", value: stats.inactive, color: "#6b7280" }
    ];

    // Status dos funcionários
    const employeeStatusData = [
      { name: "Ativos", value: employeeStats.active, color: "#10b981" },
      { name: "Inativos", value: employeeStats.inactive, color: "#6b7280" },
      { name: "Licença", value: employeeStats.onLeave, color: "#f59e0b" }
    ];

    // Departamentos
    const departmentData = employees.reduce((acc, emp) => {
      const dept = emp.department || "Sem departamento";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const deptChart = Object.entries(departmentData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Reembolsos por categoria
    const reimbursementByCategory = mockReimbursements.reduce((acc, reimb) => {
      acc[reimb.category] = (acc[reimb.category] || 0) + reimb.amount;
      return acc;
    }, {} as Record<string, number>);

    const reimbursementCategoryChart = Object.entries(reimbursementByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Performance dos funcionários
    const performanceData = employees.filter(emp => emp.performanceRating).map(emp => ({
      name: emp.name.split(' ')[0],
      rating: emp.performanceRating!,
      department: emp.department
    })).sort((a, b) => b.rating - a.rating).slice(0, 10);

    return { 
      monthlyPeopleData, 
      monthlyReimbursementData,
      statusData, 
      employeeStatusData,
      departmentData: deptChart,
      reimbursementCategoryChart,
      performanceData
    };
  }, [people, stats, employees, employeeStats]);

  const recentPeople = useMemo(() => {
    return people
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [people]);

  if (loading || employeesLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral completa do sistema administrativo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Activity className="w-3 h-3 text-yellow-400" />
            Atualizado em tempo real
          </Badge>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <KpiCard
          title="Total de Pessoas"
          value={stats.total}
          description={`${stats.active} ativas, ${stats.inactive} inativas`}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <KpiCard
          title="Funcionários"
          value={employeeStats.total}
          description={`${employeeStats.active} ativos`}
          icon={UserCheck}
          trend={{ value: 8, isPositive: true }}
        />
        {/* Espaço removido do KPI de salário */}
        <KpiCard
          title="Reembolsos"
          value={reimbursementStats.total}
          description={`${reimbursementStats.pending} pendentes`}
          icon={Receipt}
          trend={{ value: reimbursementStats.thisMonth, isPositive: true }}
        />
        <KpiCard
          title="Valor Aprovado"
          value={`R$ ${Math.round(reimbursementStats.approvedAmount / 1000)}k`}
          description="Este mês"
          icon={CheckCircle}
          trend={{ value: 15, isPositive: true }}
        />
        <KpiCard
          title="Performance"
          value={employeeStats.avgRating.toFixed(1)}
          description="Avaliação média"
          icon={Star}
          trend={{ value: 0.2, isPositive: true }}
        />
      </div>

      {/* Alertas e Notificações */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-orange-900 dark:text-orange-100">
                  {reimbursementStats.pending} reembolsos pendentes
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  R$ {reimbursementStats.pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} aguardando aprovação
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {employeeStats.onLeave} funcionários afastados
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Em licença ou férias
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:bg-green-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  {stats.thisMonth + employeeStats.thisMonth} novos cadastros
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Este mês
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Principais */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Evolução de Cadastros"
          description="Pessoas e funcionários nos últimos 6 meses"
          data={chartData.monthlyPeopleData}
          type="line"
        />
        <ChartCard
          title="Reembolsos por Mês"
          description="Status dos reembolsos por mês"
          data={chartData.monthlyReimbursementData}
          type="bar"
        />
      </div>

      {/* Status e Distribuições */}
      <div className="grid gap-6 lg:grid-cols-4">
        <ChartCard
          title="Status - Pessoas"
          description="Distribuição atual"
          data={chartData.statusData}
          type="pie"
        />
        <ChartCard
          title="Status - Funcionários"
          description="Incluindo licenças"
          data={chartData.employeeStatusData}
          type="pie"
        />
        <ChartCard
          title="Reembolsos por Categoria"
          description="Gastos por tipo"
          data={chartData.reimbursementCategoryChart}
          type="pie"
          className="lg:col-span-2"
        />
      </div>

      {/* Análises Avançadas */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Departamentos"
          description="Funcionários por área"
          data={chartData.departmentData}
          type="bar"
        />
        {/* Espaço removido do gráfico de salário por depto */}
        <ChartCard
          title="Top Performance"
          description="Melhores avaliações"
          data={chartData.performanceData}
          type="bar"
        />
      </div>

      {/* Seções Informativas */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Atividades Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-yellow-400" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Últimas movimentações do sistema
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
            
            {recentActivities.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50 text-yellow-400" />
                <p>Nenhuma atividade recente</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo Rápido */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-yellow-400" />
              Resumo Executivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de Atividade</span>
                  <span className="font-medium">
                    {Math.round((employeeStats.active / employeeStats.total) * 100)}%
                  </span>
                </div>
                <Progress value={(employeeStats.active / employeeStats.total) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reembolsos Aprovados</span>
                  <span className="font-medium">
                    {Math.round((reimbursementStats.approved / reimbursementStats.total) * 100)}%
                  </span>
                </div>
                <Progress value={(reimbursementStats.approved / reimbursementStats.total) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Performance Média</span>
                  <span className="font-medium">
                    {((employeeStats.avgRating / 5) * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={(employeeStats.avgRating / 5) * 100} className="h-2" />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Maior Departamento</span>
                <span className="font-medium">
                  {chartData.departmentData[0]?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ticket Médio Reembolso</span>
                <span className="font-medium">
                  R$ {reimbursementStats.avgAmount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Crescimento Mensal</span>
                <span className="font-medium text-green-600">+{stats.thisMonth + employeeStats.thisMonth}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center pt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{employeeStats.active}</p>
                <p className="text-xs text-muted-foreground">Ativos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{reimbursementStats.pending}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{employeeStats.onLeave}</p>
                <p className="text-xs text-muted-foreground">Afastados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acesso Rápido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Acesso Rápido
          </CardTitle>
          <CardDescription>
            Links rápidos para as principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/people/new">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto p-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Nova Pessoa</p>
                  <p className="text-xs text-muted-foreground">Cadastrar pessoa</p>
                </div>
              </Button>
            </Link>

            <Link href="/employees/new">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto p-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <UserCheck className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Novo Funcionário</p>
                  <p className="text-xs text-muted-foreground">Cadastrar funcionário</p>
                </div>
              </Button>
            </Link>

            <Link href="/reimbursements">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto p-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Receipt className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Reembolsos</p>
                  <p className="text-xs text-muted-foreground">Gerenciar reembolsos</p>
                </div>
              </Button>
            </Link>

            <Link href="/settings">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto p-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Configurações</p>
                  <p className="text-xs text-muted-foreground">Ajustar sistema</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}