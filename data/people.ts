export type Person = {
  id: string;
  avatarUrl?: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  department?: string;
  status: "ativo" | "inativo";
  createdAt: string;
  notes?: string;
  tags?: string[];
  documents?: { id: string; name: string; url?: string; uploadedAt: string }[];
  history?: { id: string; date: string; action: string; user: string }[];
};

export const mockPeople: Person[] = [
  {
    id: "1",
    avatarUrl: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Ana Silva",
    email: "ana.silva@company.com",
    phone: "(11) 99999-9999",
    role: "Desenvolvedora Senior",
    department: "Tecnologia",
    status: "ativo",
    createdAt: "2024-01-15T10:00:00Z",
    notes: "Especialista em React e TypeScript",
    tags: ["frontend", "typescript", "react"],
    documents: [
      { id: "d1", name: "CV_Ana_Silva.pdf", uploadedAt: "2024-01-15T10:00:00Z" },
      { id: "d2", name: "Certificacao_React.pdf", uploadedAt: "2024-01-20T14:30:00Z" }
    ],
    history: [
      { id: "h1", date: "2024-01-15T10:00:00Z", action: "Cadastro criado", user: "Admin" },
      { id: "h2", date: "2024-01-20T14:30:00Z", action: "Documento adicionado", user: "Ana Silva" }
    ]
  },
  {
    id: "2",
    avatarUrl: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Carlos Santos",
    email: "carlos.santos@company.com",
    phone: "(11) 88888-8888",
    role: "Designer UX",
    department: "Design",
    status: "ativo",
    createdAt: "2024-01-10T14:30:00Z",
    notes: "Foco em experiência do usuário e prototipagem",
    tags: ["ux", "figma", "design-thinking"],
    documents: [
      { id: "d3", name: "Portfolio_Carlos.pdf", uploadedAt: "2024-01-10T14:30:00Z" }
    ],
    history: [
      { id: "h3", date: "2024-01-10T14:30:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "3",
    name: "Maria Oliveira",
    email: "maria.oliveira@company.com",
    phone: "(11) 77777-7777",
    role: "Gerente de Projetos",
    department: "Gestão",
    status: "ativo",
    createdAt: "2024-02-01T09:15:00Z",
    notes: "Especialista em metodologias ágeis",
    tags: ["scrum", "agile", "lideranca"],
    documents: [
      { id: "d4", name: "Certificacao_Scrum.pdf", uploadedAt: "2024-02-01T09:15:00Z" }
    ],
    history: [
      { id: "h4", date: "2024-02-01T09:15:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "4",
    avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "João Pereira",
    email: "joao.pereira@company.com",
    phone: "(11) 66666-6666",
    role: "Analista de Marketing",
    department: "Marketing",
    status: "inativo",
    createdAt: "2024-01-25T16:45:00Z",
    notes: "Especialista em marketing digital",
    tags: ["marketing", "digital", "analytics"],
    documents: [],
    history: [
      { id: "h5", date: "2024-01-25T16:45:00Z", action: "Cadastro criado", user: "Admin" },
      { id: "h6", date: "2024-03-01T10:00:00Z", action: "Status alterado para inativo", user: "Admin" }
    ]
  },
  {
    id: "5",
    avatarUrl: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Fernanda Costa",
    email: "fernanda.costa@company.com",
    phone: "(11) 55555-5555",
    role: "Desenvolvedora Frontend",
    department: "Tecnologia",
    status: "ativo",
    createdAt: "2024-02-15T11:20:00Z",
    notes: "Especialista em Vue.js e design systems",
    tags: ["frontend", "vue", "design-system"],
    documents: [
      { id: "d5", name: "Certificacao_Vue.pdf", uploadedAt: "2024-02-15T11:20:00Z" }
    ],
    history: [
      { id: "h7", date: "2024-02-15T11:20:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  // Adicionar mais registros...
  {
    id: "6",
    name: "Roberto Silva",
    email: "roberto.silva@company.com",
    phone: "(11) 44444-4444",
    role: "DevOps Engineer",
    department: "Tecnologia",
    status: "ativo",
    createdAt: "2024-01-30T08:00:00Z",
    notes: "Especialista em AWS e containerização",
    tags: ["devops", "aws", "docker"],
    documents: [],
    history: [
      { id: "h8", date: "2024-01-30T08:00:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "7",
    avatarUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Isabela Rodrigues",
    email: "isabela.rodrigues@company.com",
    phone: "(11) 33333-3333",
    role: "QA Analyst",
    department: "Qualidade",
    status: "ativo",
    createdAt: "2024-02-20T13:15:00Z",
    notes: "Especialista em testes automatizados",
    tags: ["qa", "automation", "testing"],
    documents: [
      { id: "d6", name: "Certificacao_ISTQB.pdf", uploadedAt: "2024-02-20T13:15:00Z" }
    ],
    history: [
      { id: "h9", date: "2024-02-20T13:15:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "8",
    name: "Lucas Almeida",
    email: "lucas.almeida@company.com",
    phone: "(11) 22222-2222",
    role: "Product Manager",
    department: "Produto",
    status: "ativo",
    createdAt: "2024-01-05T15:30:00Z",
    notes: "Foco em product discovery e user research",
    tags: ["product", "discovery", "research"],
    documents: [],
    history: [
      { id: "h10", date: "2024-01-05T15:30:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "9",
    avatarUrl: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Patrícia Martins",
    email: "patricia.martins@company.com",
    phone: "(11) 11111-1111",
    role: "HR Specialist",
    department: "RH",
    status: "ativo",
    createdAt: "2024-02-10T12:00:00Z",
    notes: "Especialista em recrutamento e seleção",
    tags: ["hr", "recruitment", "people"],
    documents: [
      { id: "d7", name: "Certificacao_HR.pdf", uploadedAt: "2024-02-10T12:00:00Z" }
    ],
    history: [
      { id: "h11", date: "2024-02-10T12:00:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "10",
    name: "Alexandre Ferreira",
    email: "alexandre.ferreira@company.com",
    phone: "(11) 99999-0000",
    role: "Data Analyst",
    department: "Dados",
    status: "inativo",
    createdAt: "2024-01-20T10:45:00Z",
    notes: "Especialista em análise de dados e BI",
    tags: ["data", "analytics", "bi"],
    documents: [],
    history: [
      { id: "h12", date: "2024-01-20T10:45:00Z", action: "Cadastro criado", user: "Admin" },
      { id: "h13", date: "2024-02-28T16:00:00Z", action: "Status alterado para inativo", user: "Admin" }
    ]
  },
  // Continuar com mais 15 registros para totalizar 25...
  {
    id: "11",
    avatarUrl: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Camila Souza",
    email: "camila.souza@company.com",
    phone: "(11) 88888-0000",
    role: "Content Creator",
    department: "Marketing",
    status: "ativo",
    createdAt: "2024-02-25T14:20:00Z",
    notes: "Especialista em conteúdo digital e redes sociais",
    tags: ["content", "social-media", "digital"],
    documents: [
      { id: "d8", name: "Portfolio_Content.pdf", uploadedAt: "2024-02-25T14:20:00Z" }
    ],
    history: [
      { id: "h14", date: "2024-02-25T14:20:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "12",
    name: "Eduardo Lima",
    email: "eduardo.lima@company.com",
    phone: "(11) 77777-0000",
    role: "Sales Manager",
    department: "Vendas",
    status: "ativo",
    createdAt: "2024-01-08T09:30:00Z",
    notes: "Especialista em vendas B2B",
    tags: ["sales", "b2b", "management"],
    documents: [],
    history: [
      { id: "h15", date: "2024-01-08T09:30:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "13",
    avatarUrl: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Gabriela Nascimento",
    email: "gabriela.nascimento@company.com",
    phone: "(11) 66666-0000",
    role: "UX Researcher",
    department: "Design",
    status: "ativo",
    createdAt: "2024-02-05T16:15:00Z",
    notes: "Especialista em pesquisa de usuário",
    tags: ["ux", "research", "user-testing"],
    documents: [
      { id: "d9", name: "Research_Methods.pdf", uploadedAt: "2024-02-05T16:15:00Z" }
    ],
    history: [
      { id: "h16", date: "2024-02-05T16:15:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "14",
    name: "Henrique Barbosa",
    email: "henrique.barbosa@company.com",
    phone: "(11) 55555-0000",
    role: "Backend Developer",
    department: "Tecnologia",
    status: "ativo",
    createdAt: "2024-01-12T11:45:00Z",
    notes: "Especialista em Node.js e bancos de dados",
    tags: ["backend", "nodejs", "database"],
    documents: [],
    history: [
      { id: "h17", date: "2024-01-12T11:45:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "15",
    avatarUrl: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Juliana Carvalho",
    email: "juliana.carvalho@company.com",
    phone: "(11) 44444-0000",
    role: "Finance Analyst",
    department: "Financeiro",
    status: "ativo",
    createdAt: "2024-02-12T08:30:00Z",
    notes: "Especialista em análise financeira",
    tags: ["finance", "analysis", "budget"],
    documents: [
      { id: "d10", name: "Certificacao_CFA.pdf", uploadedAt: "2024-02-12T08:30:00Z" }
    ],
    history: [
      { id: "h18", date: "2024-02-12T08:30:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "16",
    name: "Marcos Oliveira",
    email: "marcos.oliveira@company.com",
    phone: "(11) 33333-0000",
    role: "Operations Manager",
    department: "Operações",
    status: "inativo",
    createdAt: "2024-01-18T13:20:00Z",
    notes: "Especialista em otimização de processos",
    tags: ["operations", "process", "optimization"],
    documents: [],
    history: [
      { id: "h19", date: "2024-01-18T13:20:00Z", action: "Cadastro criado", user: "Admin" },
      { id: "h20", date: "2024-03-05T14:00:00Z", action: "Status alterado para inativo", user: "Admin" }
    ]
  },
  {
    id: "17",
    avatarUrl: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Natália Santos",
    email: "natalia.santos@company.com",
    phone: "(11) 22222-0000",
    role: "Legal Counsel",
    department: "Jurídico",
    status: "ativo",
    createdAt: "2024-02-18T10:10:00Z",
    notes: "Especialista em direito corporativo",
    tags: ["legal", "corporate", "compliance"],
    documents: [
      { id: "d11", name: "OAB_Certificate.pdf", uploadedAt: "2024-02-18T10:10:00Z" }
    ],
    history: [
      { id: "h21", date: "2024-02-18T10:10:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "18",
    name: "Otávio Mendes",
    email: "otavio.mendes@company.com",
    phone: "(11) 11111-0000",
    role: "Security Specialist",
    department: "Segurança",
    status: "ativo",
    createdAt: "2024-01-22T15:40:00Z",
    notes: "Especialista em segurança da informação",
    tags: ["security", "infosec", "compliance"],
    documents: [],
    history: [
      { id: "h22", date: "2024-01-22T15:40:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "19",
    avatarUrl: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Paula Ribeiro",
    email: "paula.ribeiro@company.com",
    phone: "(11) 99999-1111",
    role: "Training Coordinator",
    department: "RH",
    status: "ativo",
    createdAt: "2024-02-08T12:25:00Z",
    notes: "Especialista em desenvolvimento de pessoas",
    tags: ["training", "development", "learning"],
    documents: [
      { id: "d12", name: "Training_Certification.pdf", uploadedAt: "2024-02-08T12:25:00Z" }
    ],
    history: [
      { id: "h23", date: "2024-02-08T12:25:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "20",
    name: "Ricardo Fernandes",
    email: "ricardo.fernandes@company.com",
    phone: "(11) 88888-1111",
    role: "Business Analyst",
    department: "Negócios",
    status: "ativo",
    createdAt: "2024-01-28T09:50:00Z",
    notes: "Especialista em análise de negócios",
    tags: ["business", "analysis", "requirements"],
    documents: [],
    history: [
      { id: "h24", date: "2024-01-28T09:50:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "21",
    avatarUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Sabrina Costa",
    email: "sabrina.costa@company.com",
    phone: "(11) 77777-1111",
    role: "Mobile Developer",
    department: "Tecnologia",
    status: "ativo",
    createdAt: "2024-02-22T14:35:00Z",
    notes: "Especialista em desenvolvimento mobile",
    tags: ["mobile", "ios", "android"],
    documents: [
      { id: "d13", name: "Mobile_Portfolio.pdf", uploadedAt: "2024-02-22T14:35:00Z" }
    ],
    history: [
      { id: "h25", date: "2024-02-22T14:35:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "22",
    name: "Thiago Araújo",
    email: "thiago.araujo@company.com",
    phone: "(11) 66666-1111",
    role: "Infrastructure Engineer",
    department: "Tecnologia",
    status: "ativo",
    createdAt: "2024-01-15T11:15:00Z",
    notes: "Especialista em infraestrutura e cloud",
    tags: ["infrastructure", "cloud", "monitoring"],
    documents: [],
    history: [
      { id: "h26", date: "2024-01-15T11:15:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "23",
    avatarUrl: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Vanessa Silva",
    email: "vanessa.silva@company.com",
    phone: "(11) 55555-1111",
    role: "Customer Success",
    department: "Atendimento",
    status: "ativo",
    createdAt: "2024-02-28T16:20:00Z",
    notes: "Especialista em sucesso do cliente",
    tags: ["customer", "success", "support"],
    documents: [
      { id: "d14", name: "CS_Certification.pdf", uploadedAt: "2024-02-28T16:20:00Z" }
    ],
    history: [
      { id: "h27", date: "2024-02-28T16:20:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "24",
    name: "Wagner Lopes",
    email: "wagner.lopes@company.com",
    phone: "(11) 44444-1111",
    role: "Architect",
    department: "Tecnologia",
    status: "ativo",
    createdAt: "2024-01-03T08:45:00Z",
    notes: "Especialista em arquitetura de software",
    tags: ["architecture", "software", "design"],
    documents: [],
    history: [
      { id: "h28", date: "2024-01-03T08:45:00Z", action: "Cadastro criado", user: "Admin" }
    ]
  },
  {
    id: "25",
    avatarUrl: "https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?w=100&h=100&fit=crop&crop=face",
    name: "Yasmin Pereira",
    email: "yasmin.pereira@company.com",
    phone: "(11) 33333-1111",
    role: "Brand Manager",
    department: "Marketing",
    status: "inativo",
    createdAt: "2024-02-14T13:10:00Z",
    notes: "Especialista em gestão de marca",
    tags: ["brand", "marketing", "strategy"],
    documents: [
      { id: "d15", name: "Brand_Strategy.pdf", uploadedAt: "2024-02-14T13:10:00Z" }
    ],
    history: [
      { id: "h29", date: "2024-02-14T13:10:00Z", action: "Cadastro criado", user: "Admin" },
      { id: "h30", date: "2024-03-10T12:00:00Z", action: "Status alterado para inativo", user: "Admin" }
    ]
  }
];

export const departments = [
  "Tecnologia",
  "Design",
  "Gestão",
  "Marketing",
  "Qualidade",
  "Produto",
  "RH",
  "Dados",
  "Vendas",
  "Financeiro",
  "Operações",
  "Jurídico",
  "Segurança",
  "Negócios",
  "Atendimento"
];

export const roles = [
  "Desenvolvedora Senior",
  "Designer UX",
  "Gerente de Projetos",
  "Analista de Marketing",
  "Desenvolvedora Frontend",
  "DevOps Engineer",
  "QA Analyst",
  "Product Manager",
  "HR Specialist",
  "Data Analyst",
  "Content Creator",
  "Sales Manager",
  "UX Researcher",
  "Backend Developer",
  "Finance Analyst",
  "Operations Manager",
  "Legal Counsel",
  "Security Specialist",
  "Training Coordinator",
  "Business Analyst",
  "Mobile Developer",
  "Infrastructure Engineer",
  "Customer Success",
  "Architect",
  "Brand Manager"
];