"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  Plus,
  Search, 
  Filter,
  Upload,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Receipt,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Paperclip
} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReimbursementItem {
  amount: number;
  category: string;
  description: string;
  receiptUrl?: string;
}

interface ReimbursementRequest {
  id: string;
  amount?: number; // total agregado (compatibilidade com dados antigos)
  category?: string; // compatibilidade
  description?: string; // compatibilidade
  items?: ReimbursementItem[]; // novos itens por solicitação
  status: "pendente" | "aprovado" | "rejeitado";
  submittedAt: string;
  approvedAt?: string;
  receiptUrl?: string;
  justification?: string;
  approvedBy?: string;
}

const mockReimbursements: ReimbursementRequest[] = [
  {
    id: "1",
    amount: 250.00,
    category: "Transporte",
    description: "Uber para reunião com cliente importante",
    status: "aprovado",
    submittedAt: "2024-01-18T10:30:00",
    approvedAt: "2024-01-19T14:20:00",
    approvedBy: "Ana Silva",
    receiptUrl: "/receipt1.pdf"
  },
  {
    id: "2",
    amount: 89.90,
    category: "Alimentação",
    description: "Almoço de negócios com parceiro",
    status: "pendente",
    submittedAt: "2024-01-20T14:15:00",
    receiptUrl: "/receipt2.pdf"
  },
  {
    id: "3",
    amount: 45.50,
    category: "Transporte",
    description: "Estacionamento durante evento",
    status: "rejeitado",
    submittedAt: "2024-01-17T16:45:00",
    receiptUrl: "/receipt3.pdf",
    justification: "Valor acima do limite permitido para estacionamento (R$ 30,00)"
  },
  {
    id: "4",
    amount: 320.00,
    category: "Educação",
    description: "Curso online de certificação React",
    status: "aprovado",
    submittedAt: "2024-01-15T11:00:00",
    approvedAt: "2024-01-16T09:30:00",
    approvedBy: "Carlos Oliveira",
    receiptUrl: "/receipt4.pdf"
  },
  {
    id: "5",
    amount: 150.00,
    category: "Equipamentos",
    description: "Mouse ergonômico para trabalho",
    status: "pendente",
    submittedAt: "2024-01-21T09:20:00",
    receiptUrl: "/receipt5.pdf"
  }
];

const categories = ["Transporte", "Alimentação", "Equipamentos", "Educação", "Hospedagem", "Outros"];

export default function ReimbursementsPage() {
  const [reimbursements, setReimbursements] = useState(mockReimbursements);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Form state: múltiplos itens
  const [newItems, setNewItems] = useState<Array<{ amount: string; category: string; description: string; receipt: File | null }>>([
    { amount: "", category: "", description: "", receipt: null }
  ]);

  const addNewItem = () => {
    setNewItems(prev => [...prev, { amount: "", category: "", description: "", receipt: null }]);
  };

  const removeNewItem = (index: number) => {
    setNewItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateNewItem = (index: number, field: "amount" | "category" | "description" | "receipt", value: string | File | null) => {
    setNewItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const modalTotal = newItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const computeRequestTotal = (r: ReimbursementRequest) =>
    (typeof r.amount === "number" ? r.amount : (r.items?.reduce((s, it) => s + it.amount, 0) || 0));

  const computeCategoryLabel = (r: ReimbursementRequest) => {
    if (r.items && r.items.length > 0) {
      const unique = Array.from(new Set(r.items.map(i => i.category).filter(Boolean)));
      if (unique.length === 0) return r.category || "—";
      if (unique.length === 1) return unique[0];
      return "Múltiplas categorias";
    }
    return r.category || "—";
  };

  const computeItems = (r: ReimbursementRequest): ReimbursementItem[] => {
    if (r.items && r.items.length > 0) return r.items;
    return [{
      amount: typeof r.amount === "number" ? r.amount : 0,
      category: r.category || "—",
      description: r.description || "—",
      receiptUrl: r.receiptUrl
    }];
  };

  const filteredReimbursements = reimbursements.filter(request => {
    const matchesSearch = !searchQuery ||
      (request.description && request.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (request.items && request.items.some(i => i.description.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesCategory = categoryFilter === "all" ||
      request.category === categoryFilter ||
      (request.items && request.items.some(i => i.category === categoryFilter));

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSubmitRequest = () => {
    const validItems = newItems.filter(it => it.amount && it.category && it.description);
    if (validItems.length === 0) return;

    const items: ReimbursementItem[] = validItems.map(it => ({
      amount: parseFloat(it.amount) || 0,
      category: it.category,
      description: it.description,
      receiptUrl: it.receipt ? "/receipt-new.pdf" : undefined,
    }));

    const total = items.reduce((s, it) => s + it.amount, 0);

    const request: ReimbursementRequest = {
      id: Date.now().toString(),
      amount: total,
      description: `Solicitação com ${items.length} item(ns)`,
      items,
      status: "pendente",
      submittedAt: new Date().toISOString(),
    };

    setReimbursements(prev => [request, ...prev]);
    setNewItems([{ amount: "", category: "", description: "", receipt: null }]);
    setIsNewRequestOpen(false);
  };

  const handleDelete = (id: string) => {
    setReimbursements(prev => prev.filter(r => r.id !== id));
  };

  const totalAmount = reimbursements.reduce((sum, r) => sum + computeRequestTotal(r), 0);
  const approvedAmount = reimbursements.filter(r => r.status === "aprovado").reduce((sum, r) => sum + computeRequestTotal(r), 0);
  const pendingCount = reimbursements.filter(r => r.status === "pendente").length;
  const thisMonthRequests = reimbursements.filter(r => 
    new Date(r.submittedAt).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reembolsos</h1>
          <p className="text-muted-foreground">
            Solicite e acompanhe seus reembolsos
          </p>
        </div>
        <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4 text-yellow-400" />
              Nova Solicitação
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[1100px] max-h-[90vh] overflow-hidden p-0 flex flex-col">
            <DialogHeader className="px-6 py-5 border-b bg-muted/50 flex-shrink-0">
              <DialogTitle className="text-xl">Nova Solicitação de Reembolso</DialogTitle>
              <DialogDescription>
                Adicione um ou mais itens e confira o total antes de enviar.
              </DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-3 gap-0 flex-1 overflow-y-auto md:overflow-hidden min-h-0">
              {/* Coluna de Itens */}
              <div className="md:col-span-2 p-6 space-y-4 md:h-full md:overflow-y-auto">
                {newItems.map((item, index) => (
                  <div key={index} className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase text-muted-foreground">Item</span>
                        <Badge variant="secondary" className="text-xs">{index + 1}</Badge>
                      </div>
                      {newItems.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeNewItem(index)}>
                          Remover
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor={`amount-${index}`}>Valor (R$)</Label>
                        <Input
                          id={`amount-${index}`}
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          value={item.amount}
                          onChange={(e) => updateNewItem(index, "amount", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`category-${index}`}>Categoria</Label>
                        <Select value={item.category} onValueChange={(value) => updateNewItem(index, "category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`description-${index}`}>Descrição</Label>
                        <Textarea
                          id={`description-${index}`}
                          placeholder="Descreva o item..."
                          value={item.description}
                          onChange={(e) => updateNewItem(index, "description", e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor={`receipt-${index}`}>Comprovante</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`receipt-${index}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => updateNewItem(index, "receipt", e.target.files?.[0] || null)}
                        />
                        <Upload className="w-4 h-4 text-yellow-400" />
                      </div>
                      <p className="text-xs text-muted-foreground">Formatos aceitos: PDF, JPG, PNG</p>
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addNewItem} className="w-full border-dashed">
                  <Plus className="w-4 h-4 mr-2 text-yellow-400" /> Adicionar item
                </Button>
              </div>

              {/* Coluna de Resumo */}
              <div className="border-l p-6 space-y-4 bg-background md:h-full md:overflow-y-auto">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Resumo da Solicitação</CardTitle>
                    <CardDescription>Revise antes de enviar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Itens</span>
                      <span className="text-sm font-medium">{newItems.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Categorias</span>
                      <span className="text-sm font-medium">
                        {Array.from(new Set(newItems.map(i => i.category).filter(Boolean))).length || 0}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="text-xl font-semibold">R$ {modalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="text-xs text-muted-foreground">
                  Dica: valores devem respeitar as políticas da empresa.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t bg-background flex-shrink-0">
              <div className="text-sm text-muted-foreground">
                Total desta solicitação: <span className="font-semibold text-foreground">R$ {modalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsNewRequestOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmitRequest}>
                  Adicionar ao Sistema
                </Button>
                <Button onClick={handleSubmitRequest}>
                  Solicitar Reembolso
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solicitado</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Todas as solicitações
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovado</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {approvedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor aprovado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando aprovação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <Receipt className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthRequests}</div>
            <p className="text-xs text-muted-foreground">
              Solicitações
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
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <Input
                placeholder="Buscar por descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reimbursements List */}
      <div className="space-y-4">
        {filteredReimbursements.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{request.description || "Solicitação de reembolso"}</h3>
                    <Badge variant={
                      request.status === "aprovado" ? "default" : 
                      request.status === "rejeitado" ? "destructive" : "secondary"
                    }>
                      {request.status}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-3 md:grid-cols-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Valor</p>
                      <p className="font-semibold text-lg">
                        R$ {computeRequestTotal(request).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Categoria</p>
                      <p className="font-medium">{computeCategoryLabel(request)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data da Solicitação</p>
                      <p className="font-medium">
                        {format(new Date(request.submittedAt), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Itens: {request.items?.length || 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedIds(prev => {
                        const next = new Set(prev);
                        if (next.has(request.id)) next.delete(request.id); else next.add(request.id);
                        return next;
                      })}
                      className="h-8 px-2"
                    >
                      {expandedIds.has(request.id) ? (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" /> Ocultar itens
                        </>
                      ) : (
                        <>
                          <ChevronRight className="w-4 h-4 mr-1" /> Ver itens
                        </>
                      )}
                    </Button>
                  </div>

                  {expandedIds.has(request.id) && (
                    <div className="mt-2 rounded-md border overflow-hidden">
                      <div className="grid grid-cols-12 px-3 py-2 text-xs text-muted-foreground bg-muted/50">
                        <div className="col-span-6">Descrição</div>
                        <div className="col-span-3">Categoria</div>
                        <div className="col-span-3 text-right">Valor</div>
                      </div>
                      {computeItems(request).map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 px-3 py-2 border-t items-center text-sm">
                          <div className="col-span-6 flex items-center gap-2">
                            <span className="truncate">{item.description}</span>
                            {item.receiptUrl && (
                              <Badge variant="outline" className="text-[10px] gap-1">
                                <Paperclip className="w-3 h-3" /> Comprovante
                              </Badge>
                            )}
                          </div>
                          <div className="col-span-3">
                            <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                          </div>
                          <div className="col-span-3 text-right font-medium">
                            R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      ))}
                      <div className="px-3 py-2 border-t text-right text-sm bg-background/50">
                        <span className="text-muted-foreground mr-2">Total</span>
                        <span className="font-semibold">R$ {computeRequestTotal(request).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  )}

                  {request.status === "aprovado" && request.approvedAt && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Aprovado em {format(new Date(request.approvedAt), "dd/MM/yyyy", { locale: ptBR })} 
                        {request.approvedBy && ` por ${request.approvedBy}`}
                      </p>
                    </div>
                  )}

                  {request.status === "rejeitado" && request.justification && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        <XCircle className="w-4 h-4 inline mr-2" />
                        <strong>Motivo da rejeição:</strong> {request.justification}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  {(request.receiptUrl || (request.items && request.items.some(i => i.receiptUrl))) && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4 text-yellow-400" />
                      {request.items && request.items.some(i => i.receiptUrl) ? "Ver Comprovantes" : "Ver Comprovante"}
                    </Button>
                  )}
                  
                  {request.status === "pendente" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Ações
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4 text-yellow-400" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(request.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancelar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReimbursements.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Receipt className="h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum reembolso encontrado</h3>
            <p className="text-muted-foreground text-center mb-6">
              Você ainda não possui solicitações de reembolso ou nenhuma corresponde aos filtros aplicados.
            </p>
            <Button className="gap-2" onClick={() => setIsNewRequestOpen(true)}>
              <Plus className="w-4 h-4 text-yellow-400" />
              Fazer primeira solicitação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
