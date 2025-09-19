"use client";

import { Employee } from "@/data/employees";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Briefcase, 
  MapPin, 
  DollarSign,
  Phone,
  Mail,
  Calendar,
  Star,
  Award,
  Building,
  Users,
  FileText,
  Edit,
  Clock,
  Target
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeDetailModal({ employee, isOpen, onClose }: EmployeeDetailModalProps) {
  if (!employee) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Detalhes do Funcionário
            </DialogTitle>
            <Link href={`/employees/${employee.id}`} onClick={onClose}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4 text-yellow-400" />
                Editar
              </Button>
            </Link>
          </div>
          
          {/* Header do Funcionário */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarImage src={employee.avatarUrl} alt={employee.name} />
              <AvatarFallback className="text-lg">
                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{employee.name}</h3>
              <p className="text-muted-foreground">
                {employee.position} • {employee.department}
              </p>
              <p className="text-sm text-muted-foreground">
                Matrícula: {employee.employeeId}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getStatusColor(employee.status)}>
                  {getStatusLabel(employee.status)}
                </Badge>
                <Badge variant="outline">
                  {getContractLabel(employee.contractType)}
                </Badge>
                <Badge variant="outline">
                  {getLocationLabel(employee.workLocation)}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-4 h-4 text-yellow-400" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{employee.email}</span>
              </div>
              
              {employee.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{employee.phone}</span>
                </div>
              )}
              
              {employee.birthDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(employee.birthDate), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
              )}

              {employee.address && (employee.address.street || employee.address.city) && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Endereço</span>
                  </div>
                  <div className="ml-6 text-sm text-muted-foreground">
                    {employee.address.street && <p>{employee.address.street}</p>}
                    <p>
                      {employee.address.city && employee.address.city}
                      {employee.address.state && ` - ${employee.address.state}`}
                      {employee.address.zipCode && ` • ${employee.address.zipCode}`}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Profissionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="w-4 h-4 text-yellow-400" />
                Informações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{employee.position}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{employee.department}</span>
              </div>
              
              {employee.manager && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Gestor: {employee.manager}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Contratado em {format(new Date(employee.hireDate), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  R$ {employee.salary.toLocaleString('pt-BR')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Performance e Avaliação */}
          {employee.performanceRating && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Última avaliação: {format(new Date(employee.lastReview), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Contato de Emergência */}
          {employee.emergencyContact && employee.emergencyContact.name && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="w-4 h-4 text-yellow-400" />
                  Contato de Emergência
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{employee.emergencyContact.name}</p>
                {employee.emergencyContact.phone && (
                  <p className="text-sm text-muted-foreground">
                    📱 {employee.emergencyContact.phone}
                  </p>
                )}
                {employee.emergencyContact.relationship && (
                  <p className="text-sm text-muted-foreground">
                    👥 {employee.emergencyContact.relationship}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Seção de Benefícios e Habilidades */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Benefícios */}
          {employee.benefits && employee.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="w-4 h-4 text-yellow-400" />
                  Benefícios ({employee.benefits.length})
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
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="w-4 h-4 text-yellow-400" />
                  Habilidades ({employee.skills.length})
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
        </div>

        {/* Observações */}
        {employee.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4 text-yellow-400" />
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{employee.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4 text-yellow-400" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cadastrado em</span>
                <span className="font-medium">
                  {format(new Date(employee.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
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
                  {format(new Date(employee.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}


