"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEmployees } from "@/hooks/use-employees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Briefcase, 
  MapPin, 
  DollarSign,
  Phone,
  Mail,
  Calendar,
  FileText,
  Award,
  X
} from "lucide-react";
import { departments, positions, benefits, skills, Employee } from "@/data/employees";
import Link from "next/link";
import { toast } from "sonner";

export default function NewEmployeePage() {
  const { addEmployee } = useEmployees();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    manager: "",
    hireDate: "",
    salary: "",
    status: "ativo" as Employee["status"],
    workLocation: "presencial" as Employee["workLocation"],
    contractType: "clt" as Employee["contractType"],
    birthDate: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    },
    benefits: [] as string[],
    skills: [] as string[],
    notes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleBenefitToggle = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação básica
      if (!formData.name || !formData.email || !formData.employeeId || !formData.position || !formData.department) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      const employeeData = {
        ...formData,
        salary: parseFloat(formData.salary) || 0,
      };

      addEmployee(employeeData);
      toast.success("Funcionário cadastrado com sucesso!");
      router.push("/employees");
    } catch (error) {
      toast.error("Erro ao cadastrar funcionário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/employees">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Funcionário</h1>
          <p className="text-muted-foreground">
            Cadastre um novo funcionário na empresa
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-yellow-400" />
              Informações Básicas
            </CardTitle>
            <CardDescription>
              Dados pessoais e de identificação do funcionário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Matrícula *</Label>
                <Input
                  id="employeeId"
                  placeholder="EMP001"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange("employeeId", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  placeholder="João Silva Santos"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@company.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
                <Input
                  id="birthDate"
                  type="date"
                  className="pl-10"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                />
              </div>
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
            <CardDescription>
              Cargo, departamento e detalhes do trabalho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="position">Cargo *</Label>
                <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(position => (
                      <SelectItem key={position} value={position}>{position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento *</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="manager">Gestor Direto</Label>
                <Input
                  id="manager"
                  placeholder="Nome do gestor"
                  value={formData.manager}
                  onChange={(e) => handleInputChange("manager", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hireDate">Data de Contratação</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => handleInputChange("hireDate", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="salary">Salário</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
                  <Input
                    id="salary"
                    type="number"
                    placeholder="5000"
                    className="pl-10"
                    value={formData.salary}
                    onChange={(e) => handleInputChange("salary", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workLocation">Local de Trabalho</Label>
                <Select value={formData.workLocation} onValueChange={(value: Employee["workLocation"]) => handleInputChange("workLocation", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="remoto">Remoto</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractType">Tipo de Contrato</Label>
                <Select value={formData.contractType} onValueChange={(value: Employee["contractType"]) => handleInputChange("contractType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clt">CLT</SelectItem>
                    <SelectItem value="pj">PJ</SelectItem>
                    <SelectItem value="estagiario">Estágio</SelectItem>
                    <SelectItem value="terceirizado">Terceirizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-yellow-400" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Logradouro</Label>
              <Input
                id="street"
                placeholder="Rua das Flores, 123"
                value={formData.address.street}
                onChange={(e) => handleInputChange("address.street", e.target.value)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="São Paulo"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange("address.city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  placeholder="SP"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange("address.state", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  placeholder="01234-567"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato de Emergência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-yellow-400" />
              Contato de Emergência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Nome</Label>
                <Input
                  id="emergencyName"
                  placeholder="Maria Silva"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleInputChange("emergencyContact.name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Telefone</Label>
                <Input
                  id="emergencyPhone"
                  placeholder="(11) 99999-9999"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleInputChange("emergencyContact.phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyRelationship">Parentesco</Label>
                <Input
                  id="emergencyRelationship"
                  placeholder="Mãe"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => handleInputChange("emergencyContact.relationship", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefícios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Benefícios
            </CardTitle>
            <CardDescription>
              Selecione os benefícios oferecidos ao funcionário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {benefits.map(benefit => (
                <div key={benefit} className="flex items-center space-x-2">
                  <Checkbox
                    id={benefit}
                    checked={formData.benefits.includes(benefit)}
                    onCheckedChange={() => handleBenefitToggle(benefit)}
                  />
                  <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
                </div>
              ))}
            </div>
            {formData.benefits.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Benefícios selecionados:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map(benefit => (
                    <Badge key={benefit} variant="secondary" className="text-xs">
                      {benefit}
                      <button
                        type="button"
                        onClick={() => handleBenefitToggle(benefit)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Habilidades
            </CardTitle>
            <CardDescription>
              Selecione as principais habilidades do funcionário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              {skills.map(skill => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={formData.skills.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                  />
                  <Label htmlFor={skill} className="text-sm">{skill}</Label>
                </div>
              ))}
            </div>
            {formData.skills.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Habilidades selecionadas:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-400" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas adicionais</Label>
              <Textarea
                id="notes"
                placeholder="Informações adicionais sobre o funcionário..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-3">
              <Link href="/employees">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" disabled={loading} className="gap-2">
                <Save className="w-4 h-4 text-yellow-400" />
                {loading ? "Salvando..." : "Cadastrar Funcionário"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}


