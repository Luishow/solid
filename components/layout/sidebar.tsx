"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  LayoutDashboard, 
  Settings, 
  User,
  LogOut,
  Clock,
  CheckCircle,
  CreditCard,
  FileText,
  UserCheck,
  Receipt,
  UserPlus,
  ClipboardList,
  FileSignature,
  Banknote,
  Plane,
  ShoppingCart,
  BookOpen
} from "lucide-react";

const policiesNavigation = [
  {
    name: "Solicitação de Reembolso",
    href: "/politicas/solicitacao-de-reembolso",
    icon: ClipboardList,
  },
  {
    name: "Solicitação de pagamentos",
    href: "/politicas/solicitacao-de-pagamentos",
    icon: ClipboardList,
  },
  {
    name: "Recrutamento e Seleção de Prestadores de Serviços",
    href: "/politicas/recrutamento-e-selecao-de-prestadores-de-servicos",
    icon: ClipboardList,
  },
  {
    name: "RDV",
    href: "/politicas/rdv",
    icon: ClipboardList,
  },
  {
    name: "Prestação de Contas, Cartão de Crédito",
    href: "/politicas/prestacao-de-contas-cartao-de-credito",
    icon: ClipboardList,
  },
  {
    name: "Gestão de Contratos",
    href: "/politicas/gestao-de-contratos",
    icon: ClipboardList,
  },
  {
    name: "Fluxo de Pagamento",
    href: "/politicas/fluxo-de-pagamento",
    icon: ClipboardList,
  },
  {
    name: "Compras de Passagens",
    href: "/politicas/compras-de-passagens",
    icon: ClipboardList,
  },
  {
    name: "Compras de  Insumos",
    href: "/politicas/compras-de-insumos",
    icon: ClipboardList,
  },
  {
    name: "Boas praticas",
    href: "/politicas/boas-praticas",
    icon: ClipboardList,
  },
];

const managersNavigation = [
  {
    name: "Times",
    href: "/teams",
    icon: Users,
  },
  {
    name: "Reembolso Aprovação",
    href: "/reimbursement-approval",
    icon: CheckCircle,
  },
  {
    name: "Despesas do Time",
    href: "/team-expenses",
    icon: CreditCard,
  },
  {
    name: "Formulários",
    href: "/forms",
    icon: FileText,
  },
  {
    name: "Usuários",
    href: "/managers/users",
    icon: Users,
  },
  {
    name: "Criar Usuário",
    href: "/managers/users/new",
    icon: UserPlus,
  },
];

const staffNavigation = [
  {
    name: "Reembolsos",
    href: "/reimbursements",
    icon: Clock,
  },
  {
    name: "Formulários",
    href: "/staff-forms",
    icon: FileText,
  },
];

const mainNavigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Validação de Políticas",
    href: "/validacao-politicas",
    icon: CheckCircle,
  },
  {
    name: "Funcionários",
    href: "/employees",
    icon: UserCheck,
  },
  {
    name: "Usuários",
    href: "/users",
    icon: Users,
  },
  {
    name: "Criar Usuários",
    href: "/users/new",
    icon: UserPlus,
  },
  {
    name: "Reembolsos",
    href: "/reimbursements",
    icon: Clock,
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-card border-r border-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border flex-shrink-0">
        <Link href="/" className="flex items-center space-x-3">
          <Image 
            src="/logo.png" 
            alt="Administrativo Solid" 
            width={32} 
            height={32} 
            className="w-8 h-8 rounded-lg"
          />
          <span className="font-bold text-lg text-foreground">Administrativo Solid</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            ADMINISTRAÇÃO
          </h3>
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === "/employees" && pathname.startsWith("/employees")) ||
              (item.href === "/reimbursements" && pathname.startsWith("/reimbursements"));
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10 overflow-hidden",
                    isActive && "bg-secondary text-secondary-foreground font-medium"
                  )}
                >
                  <item.icon className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Managers Section */}
        <div className="space-y-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            MANAGERS
          </h3>
          {managersNavigation.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10 overflow-hidden",
                    isActive && "bg-secondary text-secondary-foreground font-medium"
                  )}
                >
                  <item.icon className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Staff Section */}
        <div className="space-y-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            STAFF
          </h3>
          {staffNavigation.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10 overflow-hidden",
                    isActive && "bg-secondary text-secondary-foreground font-medium"
                  )}
                >
                  <item.icon className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Policies Section */}
        <div className="space-y-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            POLÍTICAS
          </h3>
          {policiesNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith("/politicas/");
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive && pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10 overflow-hidden",
                    isActive && pathname === item.href && "bg-secondary text-secondary-foreground font-medium"
                  )}
                >
                  <item.icon className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Admin</p>
            <p className="text-xs text-muted-foreground truncate">admin@company.com</p>
          </div>
          <Button size="sm" variant="ghost" className="p-1">
            <LogOut className="w-4 h-4 text-yellow-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}