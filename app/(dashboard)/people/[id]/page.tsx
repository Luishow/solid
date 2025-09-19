"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePeople } from "@/hooks/use-people";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Copy, 
  User, 
  FileText, 
  History,
  Phone,
  Mail,
  Building,
  Briefcase,
  Calendar,
  Tag,
  FileUp,
  Download
} from "lucide-react";
import { Person } from "@/data/people";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PersonForm } from "@/components/people/person-form";

interface PersonDetailPageProps {
  params: {
    id: string;
  };
}

export default function PersonDetailPage({ params }: PersonDetailPageProps) {
  const router = useRouter();
  const { people, updatePerson, deletePerson, duplicatePerson } = usePeople();
  const [person, setPerson] = useState<Person | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const foundPerson = people.find(p => p.id === params.id);
    setPerson(foundPerson || null);
  }, [people, params.id]);

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Pessoa não encontrada</h2>
          <p className="text-muted-foreground">
            A pessoa que você está procurando não existe ou foi removida.
          </p>
        </div>
        <Link href="/people">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para lista
          </Button>
        </Link>
      </div>
    );
  }

  const handleSave = (data: Partial<Person>) => {
    updatePerson(person.id, data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deletePerson(person.id);
    router.push("/people");
  };

  const handleDuplicate = () => {
    const newId = duplicatePerson(person.id);
    if (newId) {
      router.push(`/people/${newId}`);
    }
  };

  const mockUpload = () => {
    // Simular upload de documento
    const newDoc = {
      id: crypto.randomUUID(),
      name: `Documento_${Date.now()}.pdf`,
      uploadedAt: new Date().toISOString()
    };
    
    const updatedPerson = {
      ...person,
      documents: [...(person.documents || []), newDoc],
      history: [
        ...(person.history || []),
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          action: "Documento adicionado",
          user: "Admin"
        }
      ]
    };
    
    updatePerson(person.id, updatedPerson);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/people">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={person.avatarUrl} alt={person.name} />
              <AvatarFallback>
                {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{person.name}</h1>
              <p className="text-muted-foreground">{person.role || "Sem cargo definido"}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
          >
            <Copy className="w-4 h-4 mr-2" />
            Duplicar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div>
        <Badge variant={person.status === "ativo" ? "default" : "secondary"} className="text-sm">
          {person.status.toUpperCase()}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full md:w-fit grid-cols-3 md:grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {isEditing ? (
            <PersonForm
              person={person}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{person.email}</span>
                  </div>
                  
                  {person.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{person.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Professional Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Profissionais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {person.role && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{person.role}</span>
                    </div>
                  )}
                  
                  {person.department && (
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span>{person.department}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Cadastrado em {format(new Date(person.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {person.tags && person.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {person.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              {person.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {person.notes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Documentos</CardTitle>
                <CardDescription>
                  Documentos e arquivos relacionados à pessoa
                </CardDescription>
              </div>
              <Button onClick={mockUpload} size="sm" className="gap-2">
                <FileUp className="w-4 h-4" />
                Enviar documento
              </Button>
            </CardHeader>
            <CardContent>
              {person.documents && person.documents.length > 0 ? (
                <div className="space-y-3">
                  {person.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Enviado em {format(new Date(doc.uploadedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum documento enviado ainda</p>
                  <Button onClick={mockUpload} size="sm" className="mt-3 gap-2">
                    <FileUp className="w-4 h-4" />
                    Enviar primeiro documento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Atividades</CardTitle>
              <CardDescription>
                Registro de todas as alterações e ações realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {person.history && person.history.length > 0 ? (
                <div className="space-y-4">
                  {person.history
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((item, index) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {index < person.history!.length - 1 && (
                          <div className="w-px h-12 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{item.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(item.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Por: {item.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma atividade registrada ainda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Confirmar exclusão"
        description={`Tem certeza de que deseja remover ${person.name}? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.`}
        onConfirm={handleDelete}
        confirmText="Remover"
        cancelText="Cancelar"
      />
    </div>
  );
}