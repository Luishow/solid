"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Monitor, 
  Sun, 
  Moon, 
  Globe, 
  Table, 
  Eye,
  Settings as SettingsIcon,
  Save,
  RotateCcw
} from "lucide-react";
import { clearStorage } from "@/lib/storage";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [tableDensity, setTableDensity] = useState("comfortable");
  const [language, setLanguage] = useState("pt-BR");
  const [showInactiveUsers, setShowInactiveUsers] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleClearData = () => {
    clearStorage();
    toast.success("Dados limpos com sucesso! Recarregue a página para ver os dados padrão.");
  };

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize a experiência do sistema conforme suas preferências
        </p>
      </div>

      <div className="grid gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-yellow-400" />
              Aparência
            </CardTitle>
            <CardDescription>
              Configure o tema e a aparência da interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Tema</h4>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="justify-start gap-2"
                  >
                    <Sun className="w-4 h-4 text-yellow-400" />
                    Claro
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="justify-start gap-2"
                  >
                    <Moon className="w-4 h-4 text-yellow-400" />
                    Escuro
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                    className="justify-start gap-2"
                  >
                    <Monitor className="w-4 h-4 text-yellow-400" />
                    Sistema
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-yellow-400" />
              Idioma e Região
            </CardTitle>
            <CardDescription>
              Configurações de idioma e formatação regional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Idioma da interface</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US" disabled>English (US) - Em breve</SelectItem>
                    <SelectItem value="es-ES" disabled>Español - Em breve</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Outros idiomas serão adicionados em futuras versões
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Formato de data</label>
                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                  dd/MM/yyyy (Brasileiro)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="w-5 h-5 text-yellow-400" />
              Preferências de Tabela
            </CardTitle>
            <CardDescription>
              Configure como as tabelas são exibidas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Densidade da tabela</label>
                <Select value={tableDensity} onValueChange={setTableDensity}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compacta</SelectItem>
                    <SelectItem value="comfortable">Confortável</SelectItem>
                    <SelectItem value="spacious">Espaçosa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Mostrar usuários inativos</div>
                  <div className="text-xs text-muted-foreground">
                    Exibir pessoas inativas nas listagens por padrão
                  </div>
                </div>
                <Switch
                  checked={showInactiveUsers}
                  onCheckedChange={setShowInactiveUsers}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-yellow-400" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure quando e como receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Notificações por e-mail</div>
                <div className="text-xs text-muted-foreground">
                  Receber notificações sobre alterações importantes
                </div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-yellow-400" />
              Gerenciamento de Dados
            </CardTitle>
            <CardDescription>
              Configurações avançadas e gerenciamento de dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-medium text-sm">Limpar dados locais</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Remove todos os dados salvos localmente e restaura os dados padrão. 
                    Esta ação não pode ser desfeita.
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Apenas dados locais
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearData}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <RotateCcw className="w-4 h-4 text-yellow-400" />
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4 text-yellow-400" />
                Salvar configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}