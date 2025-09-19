"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePeople } from "@/hooks/use-people";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, Save, Plus } from "lucide-react";
import { departments, roles } from "@/data/people";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  role: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(["ativo", "inativo"]),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function NewPersonPage() {
  const router = useRouter();
  const { addPerson } = usePeople();
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      status: "ativo",
      notes: "",
      tags: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const personData = {
        ...data,
        avatarUrl: avatarPreview || undefined,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined,
        documents: [],
      };

      const personId = addPerson(personData);
      router.push(`/people/${personId}`);
    } catch (error) {
      console.error("Erro ao criar pessoa:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSaveAndContinue = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const personData = {
        ...data,
        avatarUrl: avatarPreview || undefined,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined,
        documents: [],
      };

      addPerson(personData);
      
      // Reset form for new person
      form.reset();
      setAvatarPreview("");
    } catch (error) {
      console.error("Erro ao criar pessoa:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular upload - na aplicação real, faria upload para servidor
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/people">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Pessoa</h1>
          <p className="text-muted-foreground">
            Preencha os dados para cadastrar uma nova pessoa
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Avatar Section */}
            <Card>
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>
                  Faça upload de uma foto de perfil (opcional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback className="text-lg">
                      {form.watch("name")?.split(' ').map(n => n[0]).join('').toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <label htmlFor="avatar" className="sr-only">Avatar</label>
                    <div className="relative">
                      <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="sr-only"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => document.getElementById("avatar")?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Escolher foto
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      PNG, JPG até 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>
                    Dados pessoais e de contato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: João Silva" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Ex: joao@company.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(11) 99999-9999"
                            {...field}
                            onChange={(e) => {
                              const formatted = formatPhone(e.target.value);
                              field.onChange(formatted);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Professional Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Profissionais</CardTitle>
                  <CardDescription>
                    Cargo, departamento e status na organização
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o cargo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map(role => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departamento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o departamento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Status</FormLabel>
                          <FormDescription>
                            Pessoa ativa pode acessar sistemas e receber comunicações
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === "ativo"}
                            onCheckedChange={(checked) => 
                              field.onChange(checked ? "ativo" : "inativo")
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Adicionais</CardTitle>
                  <CardDescription>
                    Tags e observações sobre a pessoa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: frontend, typescript, react (separadas por vírgula)"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Use vírgulas para separar múltiplas tags
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Informações adicionais, especialidades, observações importantes..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Link href="/people">
                  <Button variant="outline" disabled={isSubmitting}>
                    Cancelar
                  </Button>
                </Link>
                
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={form.handleSubmit(onSaveAndContinue)}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Salvar e continuar
                </Button>

                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}