export interface Employee {
  id: string;
  employeeId: string; // Número de matrícula
  name: string;
  email: string;
  phone?: string;
  position: string; // Cargo
  department: string;
  manager?: string; // Nome do gestor
  hireDate: string; // Data de contratação
  salary: number;
  status: "ativo" | "inativo" | "licenca" | "ferias";
  workLocation: "presencial" | "remoto" | "hibrido";
  contractType: "clt" | "pj" | "estagiario" | "terceirizado";
  avatarUrl?: string;
  birthDate?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  benefits: string[];
  skills: string[];
  performanceRating?: number; // 1-5
  lastReview?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const departments = [
  "Tecnologia",
  "Recursos Humanos",
  "Financeiro",
  "Marketing",
  "Vendas",
  "Operações",
  "Jurídico",
  "Administrativo",
  "Produto",
  "Design"
];

export const positions = [
  // Tecnologia
  "Desenvolvedor Frontend",
  "Desenvolvedor Backend",
  "Desenvolvedor Full Stack",
  "DevOps Engineer",
  "Arquiteto de Software",
  "Tech Lead",
  "Gerente de Tecnologia",
  "QA Engineer",
  "UX/UI Designer",
  "Product Manager",
  
  // RH
  "Analista de RH",
  "Especialista em Recrutamento",
  "Gerente de RH",
  "Business Partner",
  "Analista de Treinamento",
  
  // Financeiro
  "Analista Financeiro",
  "Controller",
  "Gerente Financeiro",
  "Analista Contábil",
  "Tesoureiro",
  
  // Marketing
  "Analista de Marketing",
  "Especialista em Marketing Digital",
  "Gerente de Marketing",
  "Social Media",
  "Designer Gráfico",
  
  // Vendas
  "Vendedor",
  "Consultor de Vendas",
  "Gerente de Vendas",
  "Account Manager",
  "Pré-vendas",
  
  // Outros
  "Assistente Administrativo",
  "Coordenador",
  "Supervisor",
  "Diretor",
  "Estagiário"
];

export const benefits = [
  "Vale Refeição",
  "Vale Transporte",
  "Plano de Saúde",
  "Plano Odontológico",
  "Vale Alimentação",
  "Seguro de Vida",
  "Participação nos Lucros",
  "Auxílio Creche",
  "Auxílio Educação",
  "Gympass",
  "Home Office",
  "Horário Flexível",
  "Day Off Aniversário"
];

export const skills = [
  // Técnicas
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "AWS",
  "Docker",
  "Git",
  "Agile/Scrum",
  
  // Soft Skills
  "Liderança",
  "Comunicação",
  "Trabalho em Equipe",
  "Resolução de Problemas",
  "Criatividade",
  "Organização",
  "Proatividade",
  "Adaptabilidade",
  "Negociação",
  "Apresentação"
];

// Dados mockados
export const mockEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "Ana Silva Santos",
    email: "ana.silva@company.com",
    phone: "(11) 99999-1234",
    position: "Desenvolvedora Frontend",
    department: "Tecnologia",
    manager: "Carlos Oliveira",
    hireDate: "2022-03-15",
    salary: 8500,
    status: "ativo",
    workLocation: "hibrido",
    contractType: "clt",
    birthDate: "1990-05-20",
    address: {
      street: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    },
    emergencyContact: {
      name: "João Silva",
      phone: "(11) 99999-5678",
      relationship: "Marido"
    },
    benefits: ["Vale Refeição", "Plano de Saúde", "Home Office", "Horário Flexível"],
    skills: ["JavaScript", "React", "TypeScript", "CSS", "Trabalho em Equipe"],
    performanceRating: 4.5,
    lastReview: "2024-01-15",
    notes: "Excelente desenvolvedora, sempre proativa e colaborativa.",
    createdAt: "2022-03-15T09:00:00",
    updatedAt: "2024-01-15T14:30:00"
  },
  {
    id: "2",
    employeeId: "EMP002",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@company.com",
    phone: "(11) 99999-2345",
    position: "Tech Lead",
    department: "Tecnologia",
    hireDate: "2020-08-10",
    salary: 15000,
    status: "ativo",
    workLocation: "presencial",
    contractType: "clt",
    birthDate: "1985-11-12",
    address: {
      street: "Av. Paulista, 456",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100"
    },
    emergencyContact: {
      name: "Maria Oliveira",
      phone: "(11) 99999-6789",
      relationship: "Esposa"
    },
    benefits: ["Vale Refeição", "Plano de Saúde", "Plano Odontológico", "Participação nos Lucros"],
    skills: ["Liderança", "JavaScript", "Node.js", "AWS", "Arquitetura", "Mentoria"],
    performanceRating: 4.8,
    lastReview: "2024-01-10",
    notes: "Líder técnico experiente, excelente mentor para a equipe.",
    createdAt: "2020-08-10T10:00:00",
    updatedAt: "2024-01-10T16:00:00"
  },
  {
    id: "3",
    employeeId: "EMP003",
    name: "Mariana Costa",
    email: "mariana.costa@company.com",
    phone: "(11) 99999-3456",
    position: "Analista de RH",
    department: "Recursos Humanos",
    manager: "Roberto Santos",
    hireDate: "2021-06-01",
    salary: 6500,
    status: "ativo",
    workLocation: "presencial",
    contractType: "clt",
    birthDate: "1992-08-30",
    address: {
      street: "Rua Augusta, 789",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000"
    },
    emergencyContact: {
      name: "Pedro Costa",
      phone: "(11) 99999-7890",
      relationship: "Pai"
    },
    benefits: ["Vale Refeição", "Vale Transporte", "Plano de Saúde", "Auxílio Educação"],
    skills: ["Comunicação", "Recrutamento", "Treinamento", "Organização", "Excel"],
    performanceRating: 4.2,
    lastReview: "2023-12-20",
    notes: "Muito organizada e eficiente nos processos de RH.",
    createdAt: "2021-06-01T08:30:00",
    updatedAt: "2023-12-20T15:45:00"
  },
  {
    id: "4",
    employeeId: "EMP004",
    name: "Roberto Santos",
    email: "roberto.santos@company.com",
    phone: "(11) 99999-4567",
    position: "Gerente de RH",
    department: "Recursos Humanos",
    hireDate: "2019-02-20",
    salary: 12000,
    status: "ativo",
    workLocation: "presencial",
    contractType: "clt",
    birthDate: "1980-03-15",
    address: {
      street: "Rua Oscar Freire, 321",
      city: "São Paulo",
      state: "SP",
      zipCode: "01426-001"
    },
    emergencyContact: {
      name: "Lucia Santos",
      phone: "(11) 99999-8901",
      relationship: "Esposa"
    },
    benefits: ["Vale Refeição", "Plano de Saúde", "Plano Odontológico", "Participação nos Lucros", "Seguro de Vida"],
    skills: ["Liderança", "Gestão de Pessoas", "Negociação", "Estratégia", "Comunicação"],
    performanceRating: 4.6,
    lastReview: "2024-01-05",
    notes: "Gestor experiente, excelente relacionamento interpessoal.",
    createdAt: "2019-02-20T09:15:00",
    updatedAt: "2024-01-05T11:20:00"
  },
  {
    id: "5",
    employeeId: "EMP005",
    name: "Julia Ferreira",
    email: "julia.ferreira@company.com",
    phone: "(11) 99999-5678",
    position: "UX/UI Designer",
    department: "Design",
    manager: "Ana Silva Santos",
    hireDate: "2023-01-10",
    salary: 7000,
    status: "ativo",
    workLocation: "remoto",
    contractType: "clt",
    birthDate: "1995-12-08",
    address: {
      street: "Rua Consolação, 654",
      city: "São Paulo",
      state: "SP",
      zipCode: "01302-000"
    },
    emergencyContact: {
      name: "Carlos Ferreira",
      phone: "(11) 99999-9012",
      relationship: "Irmão"
    },
    benefits: ["Vale Refeição", "Plano de Saúde", "Home Office", "Gympass"],
    skills: ["Figma", "Adobe Creative Suite", "Prototipagem", "Design Thinking", "Criatividade"],
    performanceRating: 4.3,
    lastReview: "2023-12-15",
    notes: "Designer talentosa, sempre entrega trabalhos de alta qualidade.",
    createdAt: "2023-01-10T10:45:00",
    updatedAt: "2023-12-15T14:00:00"
  },
  {
    id: "6",
    employeeId: "EMP006",
    name: "Pedro Almeida",
    email: "pedro.almeida@company.com",
    phone: "(11) 99999-6789",
    position: "Analista Financeiro",
    department: "Financeiro",
    manager: "Lucia Rodrigues",
    hireDate: "2021-09-15",
    salary: 7500,
    status: "ferias",
    workLocation: "presencial",
    contractType: "clt",
    birthDate: "1988-07-22",
    address: {
      street: "Rua Vergueiro, 987",
      city: "São Paulo",
      state: "SP",
      zipCode: "01504-001"
    },
    emergencyContact: {
      name: "Ana Almeida",
      phone: "(11) 99999-0123",
      relationship: "Esposa"
    },
    benefits: ["Vale Refeição", "Vale Transporte", "Plano de Saúde", "Participação nos Lucros"],
    skills: ["Excel Avançado", "Power BI", "Análise Financeira", "Organização", "Atenção aos Detalhes"],
    performanceRating: 4.1,
    lastReview: "2023-11-30",
    notes: "Analista dedicado, muito preciso em suas análises.",
    createdAt: "2021-09-15T08:00:00",
    updatedAt: "2023-11-30T17:30:00"
  },
  {
    id: "7",
    employeeId: "EMP007",
    name: "Lucia Rodrigues",
    email: "lucia.rodrigues@company.com",
    phone: "(11) 99999-7890",
    position: "Gerente Financeiro",
    department: "Financeiro",
    hireDate: "2018-11-05",
    salary: 14000,
    status: "ativo",
    workLocation: "presencial",
    contractType: "clt",
    birthDate: "1982-09-18",
    address: {
      street: "Av. Faria Lima, 1234",
      city: "São Paulo",
      state: "SP",
      zipCode: "04538-132"
    },
    emergencyContact: {
      name: "Marcos Rodrigues",
      phone: "(11) 99999-1234",
      relationship: "Marido"
    },
    benefits: ["Vale Refeição", "Plano de Saúde", "Plano Odontológico", "Participação nos Lucros", "Seguro de Vida"],
    skills: ["Gestão Financeira", "Liderança", "Planejamento Estratégico", "Negociação", "Análise de Riscos"],
    performanceRating: 4.7,
    lastReview: "2023-12-10",
    notes: "Gestora experiente com excelente visão estratégica.",
    createdAt: "2018-11-05T09:30:00",
    updatedAt: "2023-12-10T13:15:00"
  },
  {
    id: "8",
    employeeId: "EMP008",
    name: "Bruno Martins",
    email: "bruno.martins@company.com",
    phone: "(11) 99999-8901",
    position: "Estagiário",
    department: "Marketing",
    manager: "Fernanda Lima",
    hireDate: "2024-02-01",
    salary: 1800,
    status: "ativo",
    workLocation: "hibrido",
    contractType: "estagiario",
    birthDate: "2001-04-10",
    address: {
      street: "Rua da Liberdade, 555",
      city: "São Paulo",
      state: "SP",
      zipCode: "01503-001"
    },
    emergencyContact: {
      name: "Sandra Martins",
      phone: "(11) 99999-2345",
      relationship: "Mãe"
    },
    benefits: ["Vale Refeição", "Vale Transporte"],
    skills: ["Social Media", "Canva", "Excel", "Proatividade", "Aprendizado Rápido"],
    performanceRating: 3.8,
    lastReview: "2024-01-20",
    notes: "Estagiário dedicado e com muita vontade de aprender.",
    createdAt: "2024-02-01T08:00:00",
    updatedAt: "2024-01-20T16:00:00"
  },
  {
    id: "9",
    employeeId: "EMP009",
    name: "Fernanda Lima",
    email: "fernanda.lima@company.com",
    phone: "(11) 99999-9012",
    position: "Gerente de Marketing",
    department: "Marketing",
    hireDate: "2020-04-20",
    salary: 11000,
    status: "ativo",
    workLocation: "hibrido",
    contractType: "clt",
    birthDate: "1987-01-25",
    address: {
      street: "Rua Bela Cintra, 876",
      city: "São Paulo",
      state: "SP",
      zipCode: "01415-000"
    },
    emergencyContact: {
      name: "Ricardo Lima",
      phone: "(11) 99999-3456",
      relationship: "Marido"
    },
    benefits: ["Vale Refeição", "Plano de Saúde", "Home Office", "Participação nos Lucros", "Gympass"],
    skills: ["Marketing Digital", "Liderança", "Google Analytics", "Estratégia", "Criatividade"],
    performanceRating: 4.4,
    lastReview: "2024-01-08",
    notes: "Gerente criativa com excelentes resultados em campanhas.",
    createdAt: "2020-04-20T10:00:00",
    updatedAt: "2024-01-08T15:30:00"
  },
  {
    id: "10",
    employeeId: "EMP010",
    name: "Rafael Santos",
    email: "rafael.santos@company.com",
    phone: "(11) 99999-0123",
    position: "Consultor de Vendas",
    department: "Vendas",
    manager: "Amanda Silva",
    hireDate: "2022-07-01",
    salary: 5500,
    status: "licenca",
    workLocation: "presencial",
    contractType: "clt",
    birthDate: "1991-10-14",
    address: {
      street: "Rua Estados Unidos, 432",
      city: "São Paulo",
      state: "SP",
      zipCode: "01427-001"
    },
    emergencyContact: {
      name: "Carla Santos",
      phone: "(11) 99999-4567",
      relationship: "Esposa"
    },
    benefits: ["Vale Refeição", "Vale Transporte", "Plano de Saúde", "Participação nos Lucros"],
    skills: ["Vendas", "Negociação", "CRM", "Relacionamento", "Persistência"],
    performanceRating: 4.0,
    lastReview: "2023-10-15",
    notes: "Vendedor competente, atualmente em licença médica.",
    createdAt: "2022-07-01T09:00:00",
    updatedAt: "2023-10-15T14:45:00"
  }
];

// Função para obter estatísticas dos funcionários
export function getEmployeeStats(employees: Employee[]) {
  const total = employees.length;
  const active = employees.filter(emp => emp.status === "ativo").length;
  const inactive = employees.filter(emp => emp.status === "inativo").length;
  const onLeave = employees.filter(emp => emp.status === "licenca" || emp.status === "ferias").length;
  
  const thisMonth = employees.filter(emp => {
    const hireDate = new Date(emp.hireDate);
    const now = new Date();
    return hireDate.getMonth() === now.getMonth() && hireDate.getFullYear() === now.getFullYear();
  }).length;

  const avgSalary = employees.length > 0 
    ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length 
    : 0;

  const avgRating = employees.length > 0 
    ? employees.filter(emp => emp.performanceRating).reduce((sum, emp) => sum + (emp.performanceRating || 0), 0) / employees.filter(emp => emp.performanceRating).length
    : 0;

  return {
    total,
    active,
    inactive,
    onLeave,
    thisMonth,
    avgSalary,
    avgRating
  };
}


