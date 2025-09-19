export interface Reimbursement {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  category: string;
  description: string;
  status: "pendente" | "aprovado" | "rejeitado";
  submittedAt: string;
  approvedAt?: string;
  receiptUrl?: string;
  justification?: string;
  approvedBy?: string;
}

export const mockReimbursements: Reimbursement[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Ana Silva Santos",
    amount: 250.00,
    category: "Transporte",
    description: "Uber para reunião com cliente importante",
    status: "aprovado",
    submittedAt: "2024-01-18T10:30:00",
    approvedAt: "2024-01-19T14:20:00",
    approvedBy: "Carlos Oliveira",
    receiptUrl: "/receipt1.pdf"
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Carlos Oliveira",
    amount: 89.90,
    category: "Alimentação",
    description: "Almoço de negócios com parceiro",
    status: "pendente",
    submittedAt: "2024-01-20T14:15:00",
    receiptUrl: "/receipt2.pdf"
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Mariana Costa",
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
    employeeId: "EMP001",
    employeeName: "Ana Silva Santos",
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
    employeeId: "EMP005",
    employeeName: "Julia Ferreira",
    amount: 150.00,
    category: "Equipamentos",
    description: "Mouse ergonômico para trabalho",
    status: "pendente",
    submittedAt: "2024-01-21T09:20:00",
    receiptUrl: "/receipt5.pdf"
  },
  {
    id: "6",
    employeeId: "EMP006",
    employeeName: "Pedro Almeida",
    amount: 1200.00,
    category: "Educação",
    description: "Curso de especialização em Excel Avançado",
    status: "aprovado",
    submittedAt: "2024-01-12T08:30:00",
    approvedAt: "2024-01-13T10:15:00",
    approvedBy: "Lucia Rodrigues",
    receiptUrl: "/receipt6.pdf"
  },
  {
    id: "7",
    employeeId: "EMP008",
    employeeName: "Bruno Martins",
    amount: 35.00,
    category: "Transporte",
    description: "Passagem de ônibus para evento da empresa",
    status: "aprovado",
    submittedAt: "2024-01-10T15:45:00",
    approvedAt: "2024-01-11T09:00:00",
    approvedBy: "Fernanda Lima",
    receiptUrl: "/receipt7.pdf"
  },
  {
    id: "8",
    employeeId: "EMP009",
    employeeName: "Fernanda Lima",
    amount: 450.00,
    category: "Marketing",
    description: "Licença de software de design para campanha",
    status: "pendente",
    submittedAt: "2024-01-22T11:30:00",
    receiptUrl: "/receipt8.pdf"
  },
  {
    id: "9",
    employeeId: "EMP004",
    employeeName: "Roberto Santos",
    amount: 180.00,
    category: "Alimentação",
    description: "Jantar com candidatos durante processo seletivo",
    status: "aprovado",
    submittedAt: "2024-01-08T19:20:00",
    approvedAt: "2024-01-09T08:45:00",
    approvedBy: "Diretor Geral",
    receiptUrl: "/receipt9.pdf"
  },
  {
    id: "10",
    employeeId: "EMP007",
    employeeName: "Lucia Rodrigues",
    amount: 75.00,
    category: "Transporte",
    description: "Taxi para reunião urgente com banco",
    status: "aprovado",
    submittedAt: "2024-01-05T16:30:00",
    approvedAt: "2024-01-06T08:00:00",
    approvedBy: "Diretor Geral",
    receiptUrl: "/receipt10.pdf"
  }
];

export function getReimbursementStats(reimbursements: Reimbursement[]) {
  const total = reimbursements.length;
  const pending = reimbursements.filter(r => r.status === "pendente").length;
  const approved = reimbursements.filter(r => r.status === "aprovado").length;
  const rejected = reimbursements.filter(r => r.status === "rejeitado").length;
  
  const totalAmount = reimbursements.reduce((sum, r) => sum + r.amount, 0);
  const approvedAmount = reimbursements.filter(r => r.status === "aprovado").reduce((sum, r) => sum + r.amount, 0);
  const pendingAmount = reimbursements.filter(r => r.status === "pendente").reduce((sum, r) => sum + r.amount, 0);
  
  const thisMonth = reimbursements.filter(r => {
    const submittedDate = new Date(r.submittedAt);
    const now = new Date();
    return submittedDate.getMonth() === now.getMonth() && submittedDate.getFullYear() === now.getFullYear();
  }).length;

  const avgAmount = total > 0 ? totalAmount / total : 0;

  return {
    total,
    pending,
    approved,
    rejected,
    totalAmount,
    approvedAmount,
    pendingAmount,
    thisMonth,
    avgAmount
  };
}


