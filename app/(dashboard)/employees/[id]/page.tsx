"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEmployees } from "@/hooks/use-employees";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Briefcase, 
  MapPin, 
  DollarSign,
  Phone,
  Mail,
  Calendar,
  Star,
  Award,
  Clock,
  Building,
  Users,
  FileText,
  MoreHorizontal,
  UserX,
  UserCheck,
  Plane
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Employee } from "@/data/employees";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface EmployeeDetailPageProps {
  params: {
    id: string;
  };
}

export default function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const { employees, deleteEmployee, deactivateEmployee, activateEmployee, setEmployeeOnLeave, updatePerformanceRating, loading } = useEmployees();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (employees.length > 0) {
      const foundEmployee = employees.find(emp => emp.id === params.id);
      setEmployee(foundEmployee || null);
    }
  }, [employees, params.id]);

  const handleStatusAction = (action: string) => {
    if (!employee) return;
    
    switch (action) {
      case "activate":
        activateEmployee(employee.id);
        toast.success("Funcionário ativado com sucesso!");
        break;
      case "deactivate":
        deactivateEmployee(employee.id);
        toast.success("Funcionário desativado com sucesso!");
        break;
      case "leave":
        setEmployeeOnLeave(employee.id, "licenca");
        toast.success("Funcionário colocado em licença!");
        break;
      case "vacation":
        setEmployeeOnLeave(employee.id, "ferias");
        toast.success("Funcionário colocado em férias!");
        break;
    }
  };

  const handleDelete = () => {
    if (!employee) return;
    
    if (confirm("Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.")) {
      deleteEmployee(employee.id);
      toast.success("Funcionário excluído com sucesso!");
      router.push("/employees");
    }
  };

  const getStatusColor = (status: Employee["status"]) => {
    switch (status) {
      case "ativo": return "default";
      case "inativo": return "secondary";
      case "licenca": return "destructive";
      case "ferias": return "outline";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: Employee["status"]) => {
    switch (status) {
      case "ativo": return "Ativo";
      case "inativo": return "Inativo";
      case "licenca": return "Licença";
      case "ferias": return "Férias";
      default: return status;
    }
  };

  const getContractLabel = (contract: Employee["contractType"]) => {
    switch (contract) {
      case "clt": return "CLT";
      case "pj": return "PJ";
      case "estagiario": return "Estágio";
      case "terceirizado": return "Terceirizado";
      default: return contract;
    }
  };

  const getLocationLabel = (location: Employee["workLocation"]) => {
    switch (location) {
      case "presencial": return "Presencial";
      case "remoto": return "Remoto";
      case "hibrido": return "Híbrido";
      default: return location;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded animate-pulse" />
            ))}
          </div>
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <User className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Funcionário não encontrado</h3>
        <p className="text-muted-foreground mb-6">
          O funcionário que você está procurando não existe ou foi removido.
        </p>
        <Link href="/employees">
          <Button>Voltar para Funcionários</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/employees">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{employee.name}</h1>
            <p className="text-muted-foreground">
              {employee.position} • {employee.department}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href={`/employees/${employee.id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4 text-yellow-400" />
              Editar
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              
              {employee.status === "ativo" ? (
                <>
                  <DropdownMenuItem onClick={() => handleStatusAction("deactivate")}>
                    <UserX className="mr-2 h-4 w-4" />
                    Desativar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusAction("leave")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Colocar em Licença
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusAction("vacation")}>
                    <Plane className="mr-2 h-4 w-4" />
                    Colocar em Férias
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => handleStatusAction("activate")}>
                  <UserCheck className="mr-2 h-4 w-4 text-yellow-400" />
                  Ativar
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive"
              >
                <UserX className="mr-2 h-4 w-4" />
                Excluir Funcionário
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-yellow-400" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                  <AvatarFallback className="text-lg">
                    {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{employee.name}</h3>
                  <p className="text-muted-foreground">Matrícula: {employee.employeeId}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(employee.status)}>
                      {getStatusLabel(employee.status)}
                    </Badge>
                    <Badge variant="outline">
                      {getContractLabel(employee.contractType)}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-yellow-400" />
                    E-mail
                  </div>
                  <p className="font-medium">{employee.email}</p>
                </div>
                
                {employee.phone && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 text-yellow-400" />
                      Telefone
                    </div>
                    <p className="font-medium">{employee.phone}</p>
                  </div>
                )}
                
                {employee.birthDate && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      Data de Nascimento
                    </div>
                    <p className="font-medium">
                      {format(new Date(employee.birthDate), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações Profissionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-yellow-400" />
                Informações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4 text-yellow-400" />
                    Cargo
                  </div>
                  <p className="font-medium">{employee.position}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="w-4 h-4 text-yellow-400" />
                    Departamento
                  </div>
                  <p className="font-medium">{employee.department}</p>
                </div>
                
                {employee.manager && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-yellow-400" />
                      Gestor Direto
                    </div>
                    <p className="font-medium">{employee.manager}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    Data de Contratação
                  </div>
                  <p className="font-medium">
                    {format(new Date(employee.hireDate), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    Salário
                  </div>
                  <p className="font-medium">R$ {employee.salary.toLocaleString('pt-BR')}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    Local de Trabalho
                  </div>
                  <p className="font-medium">{getLocationLabel(employee.workLocation)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          {employee.address && (employee.address.street || employee.address.city) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-yellow-400" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {employee.address.street && (
                    <p className="font-medium">{employee.address.street}</p>
                  )}
                  <div className="flex gap-2 text-muted-foreground">
                    {employee.address.city && <span>{employee.address.city}</span>}
                    {employee.address.state && <span>- {employee.address.state}</span>}
                    {employee.address.zipCode && <span>• {employee.address.zipCode}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contato de Emergência */}
          {employee.emergencyContact && employee.emergencyContact.name && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-yellow-400" />
                  Contato de Emergência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{employee.emergencyContact.name}</p>
                  <div className="text-muted-foreground space-y-1">
                    {employee.emergencyContact.phone && (
                      <p>📱 {employee.emergencyContact.phone}</p>
                    )}
                    {employee.emergencyContact.relationship && (
                      <p>👥 {employee.emergencyContact.relationship}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          {employee.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-400" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{employee.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance */}
          {employee.performanceRating && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(employee.performanceRating!)
                              ? "text-yellow-400 fill-current"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{employee.performanceRating.toFixed(1)}</span>
                  </div>
                  {employee.lastReview && (
                    <p className="text-xs text-muted-foreground">
                      Última avaliação: {format(new Date(employee.lastReview), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefícios */}
          {employee.benefits && employee.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Benefícios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {employee.benefits.map(benefit => (
                    <Badge key={benefit} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Habilidades */}
          {employee.skills && employee.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Habilidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cadastrado em</span>
                  <span className="font-medium">
                    {format(new Date(employee.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contratado em</span>
                  <span className="font-medium">
                    {format(new Date(employee.hireDate), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última atualização</span>
                  <span className="font-medium">
                    {format(new Date(employee.updatedAt), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


