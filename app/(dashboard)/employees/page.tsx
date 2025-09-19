"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useEmployees } from "@/hooks/use-employees";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Filter, 
  UserCheck, 
  Download, 
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  UserX,
  Clock,
  Plane,
  Star,
  TrendingUp,
  Users,
  
  Award
} from "lucide-react";
import { Employee, departments, positions } from "@/data/employees";
import { EmployeeDetailModal } from "@/components/employees/employee-detail-modal";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EmployeesPage() {
  const { employees, deleteEmployee, duplicateEmployee, deactivateEmployee, activateEmployee, setEmployeeOnLeave, loading, stats } = useEmployees();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = !searchQuery || 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
      const matchesPosition = positionFilter === "all" || employee.position === positionFilter;
      const matchesContract = contractFilter === "all" || employee.contractType === contractFilter;
      const matchesLocation = locationFilter === "all" || employee.workLocation === locationFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment && matchesPosition && matchesContract && matchesLocation;
    });
  }, [employees, searchQuery, statusFilter, departmentFilter, positionFilter, contractFilter, locationFilter]);

  const handleEdit = (employee: Employee) => {
    router.push(`/employees/${employee.id}`);
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleStatusAction = (employee: Employee, action: string) => {
    switch (action) {
      case "activate":
        activateEmployee(employee.id);
        break;
      case "deactivate":
        deactivateEmployee(employee.id);
        break;
      case "leave":
        setEmployeeOnLeave(employee.id, "licenca");
        break;
      case "vacation":
        setEmployeeOnLeave(employee.id, "ferias");
        break;
    }
  };

  const activeFilters = [
    statusFilter !== "all" && statusFilter,
    departmentFilter !== "all" && departmentFilter,
    positionFilter !== "all" && positionFilter,
    contractFilter !== "all" && contractFilter,
    locationFilter !== "all" && locationFilter,
  ].filter(Boolean);

  const clearFilters = () => {
    setStatusFilter("all");
    setDepartmentFilter("all");
    setPositionFilter("all");
    setContractFilter("all");
    setLocationFilter("all");
    setSearchQuery("");
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
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie todos os funcionários da empresa
          </p>
        </div>
        <Link href="/employees/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4 text-yellow-400" />
            Novo Funcionário
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
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} ativos, {stats.inactive + stats.onLeave} inativos/afastados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Award className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Avaliação média
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
          <CardDescription>
            Use os filtros abaixo para encontrar funcionários específicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
            <Input
              placeholder="Buscar por nome, e-mail, matrícula ou cargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid gap-4 md:grid-cols-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="licenca">Licença</SelectItem>
                <SelectItem value="ferias">Férias</SelectItem>
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

            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cargos</SelectItem>
                {positions.map(pos => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={contractFilter} onValueChange={setContractFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Contrato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os contratos</SelectItem>
                <SelectItem value="clt">CLT</SelectItem>
                <SelectItem value="pj">PJ</SelectItem>
                <SelectItem value="estagiario">Estágio</SelectItem>
                <SelectItem value="terceirizado">Terceirizado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Local" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os locais</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="remoto">Remoto</SelectItem>
                <SelectItem value="hibrido">Híbrido</SelectItem>
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
            Exibindo {filteredEmployees.length} de {employees.length} funcionários
          </div>
        </CardContent>
      </Card>

      {/* Employees Grid */}
      {filteredEmployees.length === 0 && employees.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UserCheck className="h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum funcionário cadastrado</h3>
            <p className="text-muted-foreground text-center mb-6">
              Comece cadastrando o primeiro funcionário da sua empresa.
            </p>
            <Link href="/employees/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4 text-yellow-400" />
                Cadastrar primeiro funcionário
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : filteredEmployees.length === 0 ? (
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <Card 
              key={employee.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleEmployeeClick(employee)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                      <AvatarFallback className="text-sm">
                        {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-sm">{employee.name}</h3>
                      <p className="text-xs text-muted-foreground">{employee.employeeId}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(employee)}>
                        <Edit className="mr-2 h-4 w-4 text-yellow-400" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateEmployee(employee.id)}>
                        <Copy className="mr-2 h-4 w-4 text-yellow-400" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                      {employee.status === "ativo" ? (
                        <>
                          <DropdownMenuItem onClick={() => handleStatusAction(employee, "deactivate")}>
                            <UserX className="mr-2 h-4 w-4" />
                            Desativar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusAction(employee, "leave")}>
                            <Clock className="mr-2 h-4 w-4" />
                            Colocar em Licença
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusAction(employee, "vacation")}>
                            <Plane className="mr-2 h-4 w-4" />
                            Colocar em Férias
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem onClick={() => handleStatusAction(employee, "activate")}>
                          <UserCheck className="mr-2 h-4 w-4 text-yellow-400" />
                          Ativar
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => deleteEmployee(employee.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(employee.status)}>
                      {getStatusLabel(employee.status)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getContractLabel(employee.contractType)}
                    </Badge>
                  </div>

                  <div>
                    <p className="font-medium text-sm">{employee.position}</p>
                    <p className="text-xs text-muted-foreground">{employee.department}</p>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>📧 {employee.email}</p>
                    {employee.phone && <p>📱 {employee.phone}</p>}
                    <p>📍 {getLocationLabel(employee.workLocation)}</p>
                    {/* Removido: informações de salário */}
                  </div>

                  {employee.performanceRating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs font-medium">{employee.performanceRating.toFixed(1)}</span>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Contratado em {format(new Date(employee.hireDate), "dd/MM/yyyy", { locale: ptBR })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalhes do Funcionário */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
