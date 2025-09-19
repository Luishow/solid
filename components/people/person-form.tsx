"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Upload, Save } from "lucide-react";
import { departments, roles, Person } from "@/data/people";

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

interface PersonFormProps {
  person: Person;
  onSave: (data: Partial<Person>) => void;
  onCancel: () => void;
}

export function PersonForm({ person, onSave, onCancel }: PersonFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string>(person.avatarUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: person.name,
      email: person.email,
      phone: person.phone || "",
      role: person.role || "",
      department: person.department || "",
      status: person.status,
      notes: person.notes || "",
      tags: person.tags?.join(", ") || "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const updateData = {
        ...data,
        avatarUrl: avatarPreview || undefined,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined,
      };

      onSave(updateData);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>
                Faça upload de uma foto de perfil
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
                  <label htmlFor="avatar-edit" className="sr-only">Avatar</label>
                  <div className="relative">
                    <input
                      id="avatar-edit"
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
                      onClick={() => document.getElementById("avatar-edit")?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Alterar foto
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
                          <Input {...field} />
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
                          <Input type="email" {...field} />
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Nenhum cargo</SelectItem>
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o departamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Nenhum departamento</SelectItem>
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
                          Pessoa ativa pode acessar sistemas
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
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
            <div className="flex gap-3 justify-end">
              <Button 
                type="button"
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="w-4 h-4" />
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}