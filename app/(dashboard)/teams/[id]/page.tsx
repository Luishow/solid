"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Users, 
  Trophy,
  Target,
  Gamepad2,
  Calendar,
  Edit,
  UserPlus,
  Settings,
  BarChart3,
  Award,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  joinedAt?: string;
  stats?: {
    matches: number;
    wins: number;
    kdr?: number;
    rank?: string;
  };
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  manager: string;
  status: "ativo" | "inativo";
  createdAt: string;
  game: string;
  rank?: string;
  wins?: number;
  losses?: number;
  achievements?: string[];
  recentMatches?: {
    id: string;
    opponent: string;
    result: "win" | "loss";
    score: string;
    date: string;
    tournament?: string;
  }[];
}

// Mock data expandido para detalhes
const mockTeamDetails: { [key: string]: Team } = {
  "1": {
    id: "1",
    name: "Solid Valorant",
    description: "Time principal de Valorant competindo em torneios nacionais e internacionais",
    manager: "Ana Silva",
    status: "ativo",
    createdAt: "2024-01-15",
    game: "Valorant",
    rank: "Immortal 3",
    wins: 28,
    losses: 12,
    achievements: ["1º Lugar - Torneio Regional BR", "Top 8 - VCT Challengers", "3º Lugar - Liga Brasileira"],
    members: [
      { 
        id: "1", 
        name: "ThunderStrike", 
        role: "Duelist",
        joinedAt: "2024-01-15",
        stats: { matches: 35, wins: 26, kdr: 1.4, rank: "Immortal 3" }
      },
      { 
        id: "2", 
        name: "ShadowPlay", 
        role: "Controller",
        joinedAt: "2024-01-15",
        stats: { matches: 35, wins: 26, kdr: 1.1, rank: "Immortal 2" }
      },
      { 
        id: "3", 
        name: "IronWall", 
        role: "Sentinel",
        joinedAt: "2024-01-18",
        stats: { matches: 32, wins: 24, kdr: 1.0, rank: "Immortal 3" }
      },
      { 
        id: "4", 
        name: "FlashPoint", 
        role: "Initiator",
        joinedAt: "2024-01-20",
        stats: { matches: 30, wins: 22, kdr: 1.2, rank: "Immortal 2" }
      },
      { 
        id: "5", 
        name: "AceShot", 
        role: "Flex",
        joinedAt: "2024-01-25",
        stats: { matches: 25, wins: 18, kdr: 1.3, rank: "Immortal 1" }
      },
    ],
    recentMatches: [
      {
        id: "1",
        opponent: "Team Alpha",
        result: "win",
        score: "2-0",
        date: "2024-01-21",
        tournament: "Liga Brasileira"
      },
      {
        id: "2",
        opponent: "Cyber Warriors",
        result: "win",
        score: "2-1",
        date: "2024-01-19",
        tournament: "Torneio Regional"
      },
      {
        id: "3",
        opponent: "Phoenix Gaming",
        result: "loss",
        score: "1-2",
        date: "2024-01-17",
        tournament: "VCT Challengers"
      },
      {
        id: "4",
        opponent: "Storm Esports",
        result: "win",
        score: "2-0",
        date: "2024-01-15",
        tournament: "Liga Brasileira"
      },
      {
        id: "5",
        opponent: "Lightning Squad",
        result: "win",
        score: "2-1",
        date: "2024-01-13",
        tournament: "Torneio Regional"
      }
    ]
  },
  "2": {
    id: "2",
    name: "Solid CS2",
    description: "Equipe de Counter-Strike 2 focada em campeonatos regionais",
    manager: "Carlos Oliveira",
    status: "ativo",
    createdAt: "2024-01-10",
    game: "Counter-Strike 2",
    rank: "Global Elite",
    wins: 35,
    losses: 8,
    achievements: ["1º Lugar - Regional CS2 Championship", "2º Lugar - Liga Nacional", "Top 4 - Major Qualifier"],
    members: [
      { 
        id: "6", 
        name: "HeadHunter", 
        role: "AWPer",
        joinedAt: "2024-01-10",
        stats: { matches: 40, wins: 32, kdr: 1.8, rank: "Global Elite" }
      },
      { 
        id: "7", 
        name: "RushMaster", 
        role: "Entry Fragger",
        joinedAt: "2024-01-10",
        stats: { matches: 40, wins: 32, kdr: 1.5, rank: "Global Elite" }
      },
      { 
        id: "8", 
        name: "ClutchKing", 
        role: "Support",
        joinedAt: "2024-01-12",
        stats: { matches: 38, wins: 30, kdr: 1.2, rank: "Supreme" }
      },
      { 
        id: "9", 
        name: "SmokeShow", 
        role: "IGL",
        joinedAt: "2024-01-15",
        stats: { matches: 35, wins: 28, kdr: 1.1, rank: "Global Elite" }
      },
      { 
        id: "10", 
        name: "FlickGod", 
        role: "Rifler",
        joinedAt: "2024-01-18",
        stats: { matches: 32, wins: 26, kdr: 1.4, rank: "Supreme" }
      },
    ],
    recentMatches: [
      {
        id: "1",
        opponent: "Inferno Squad",
        result: "win",
        score: "16-12",
        date: "2024-01-21",
        tournament: "Liga Nacional"
      },
      {
        id: "2",
        opponent: "Dust2 Kings",
        result: "win",
        score: "16-8",
        date: "2024-01-19",
        tournament: "Regional Championship"
      },
      {
        id: "3",
        opponent: "Mirage Masters",
        result: "loss",
        score: "14-16",
        date: "2024-01-17",
        tournament: "Major Qualifier"
      },
      {
        id: "4",
        opponent: "Cache Legends",
        result: "win",
        score: "16-10",
        date: "2024-01-15",
        tournament: "Liga Nacional"
      },
      {
        id: "5",
        opponent: "Overpass Elite",
        result: "win",
        score: "16-6",
        date: "2024-01-13",
        tournament: "Regional Championship"
      }
    ]
  },
  "3": {
    id: "3",
    name: "Solid LoL",
    description: "Time de League of Legends competindo na Liga Brasileira",
    manager: "Roberto Souza",
    status: "ativo",
    createdAt: "2024-01-08",
    game: "League of Legends",
    rank: "Challenger",
    wins: 22,
    losses: 6,
    achievements: ["3º Lugar - CBLOL Split", "1º Lugar - Torneio Acadêmico", "MVP Individual - JungleKing"],
    members: [
      { 
        id: "11", 
        name: "JungleKing", 
        role: "Jungle",
        joinedAt: "2024-01-08",
        stats: { matches: 28, wins: 22, kdr: 3.2, rank: "Challenger 800LP" }
      },
      { 
        id: "12", 
        name: "MidLaner", 
        role: "Mid Lane",
        joinedAt: "2024-01-08",
        stats: { matches: 28, wins: 22, kdr: 2.8, rank: "Challenger 650LP" }
      },
      { 
        id: "13", 
        name: "BotCarry", 
        role: "ADC",
        joinedAt: "2024-01-10",
        stats: { matches: 26, wins: 20, kdr: 4.1, rank: "Grandmaster" }
      },
      { 
        id: "14", 
        name: "SupportGod", 
        role: "Support",
        joinedAt: "2024-01-12",
        stats: { matches: 24, wins: 18, kdr: 1.9, rank: "Challenger 500LP" }
      },
      { 
        id: "15", 
        name: "TopTitan", 
        role: "Top Lane",
        joinedAt: "2024-01-15",
        stats: { matches: 22, wins: 16, kdr: 2.5, rank: "Grandmaster" }
      },
    ],
    recentMatches: [
      {
        id: "1",
        opponent: "Rift Guardians",
        result: "win",
        score: "2-0",
        date: "2024-01-21",
        tournament: "CBLOL Split"
      },
      {
        id: "2",
        opponent: "Baron Stealers",
        result: "win",
        score: "2-1",
        date: "2024-01-19",
        tournament: "Liga Brasileira"
      },
      {
        id: "3",
        opponent: "Dragon Slayers",
        result: "loss",
        score: "1-2",
        date: "2024-01-17",
        tournament: "CBLOL Split"
      },
      {
        id: "4",
        opponent: "Nexus Destroyers",
        result: "win",
        score: "2-0",
        date: "2024-01-15",
        tournament: "Liga Brasileira"
      },
      {
        id: "5",
        opponent: "Jungle Invaders",
        result: "win",
        score: "2-1",
        date: "2024-01-13",
        tournament: "Torneio Acadêmico"
      }
    ]
  },
  "4": {
    id: "4",
    name: "Solid Mobile",
    description: "Equipe focada em jogos mobile competitivos",
    manager: "Juliana Alves",
    status: "inativo",
    createdAt: "2024-01-05",
    game: "Free Fire / Mobile Legends",
    rank: "Heroico",
    wins: 15,
    losses: 20,
    achievements: ["Top 8 - Copa Mobile Brasil", "5º Lugar - Liga Free Fire"],
    members: [
      { 
        id: "16", 
        name: "MobileAce", 
        role: "Fragger",
        joinedAt: "2024-01-05",
        stats: { matches: 35, wins: 15, kdr: 1.1, rank: "Heroico" }
      },
      { 
        id: "17", 
        name: "QuickShot", 
        role: "Support",
        joinedAt: "2024-01-08",
        stats: { matches: 32, wins: 13, kdr: 0.9, rank: "Elite" }
      },
    ],
    recentMatches: [
      {
        id: "1",
        opponent: "Mobile Warriors",
        result: "loss",
        score: "0-2",
        date: "2024-01-18",
        tournament: "Liga Free Fire"
      },
      {
        id: "2",
        opponent: "Touch Masters",
        result: "win",
        score: "2-1",
        date: "2024-01-15",
        tournament: "Copa Mobile Brasil"
      },
      {
        id: "3",
        opponent: "Finger Gods",
        result: "loss",
        score: "1-2",
        date: "2024-01-12",
        tournament: "Liga Free Fire"
      }
    ]
  }
};

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teamId = params.id as string;
    const teamData = mockTeamDetails[teamId];
    
    if (teamData) {
      setTeam(teamData);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4 text-yellow-400" />
          Voltar
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Time não encontrado</h3>
            <p className="text-muted-foreground text-center">
              O time solicitado não existe ou foi removido.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const winRate = team.wins && team.losses ? Math.round((team.wins / (team.wins + team.losses)) * 100) : 0;
  const recentWins = team.recentMatches?.filter(m => m.result === "win").length || 0;
  const recentMatches = team.recentMatches?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4 text-yellow-400" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
          <p className="text-muted-foreground">Detalhes completos do time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4 text-yellow-400" />
            Editar Time
          </Button>
          <Button className="gap-2">
            <UserPlus className="w-4 h-4 text-yellow-400" />
            Adicionar Jogador
          </Button>
        </div>
      </div>

      {/* Team Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{team.name}</CardTitle>
                <Badge variant={team.status === "ativo" ? "default" : "secondary"}>
                  {team.status}
                </Badge>
              </div>
              <CardDescription className="text-base">
                {team.description}
              </CardDescription>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 justify-end">
                <Gamepad2 className="w-4 h-4 text-yellow-400" />
                <span className="font-semibold">{team.game}</span>
              </div>
              {team.rank && (
                <Badge variant="outline" className="ml-auto">
                  {team.rank}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Técnico/Coach</p>
              <p className="font-semibold">{team.manager}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Criado em</p>
              <p className="font-semibold">
                {format(new Date(team.createdAt), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total de Jogadores</p>
              <p className="font-semibold">{team.members.length}</p>
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600">{team.wins || 0}</p>
                <p className="text-sm text-muted-foreground">Vitórias</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Target className="w-8 h-8 text-red-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-red-600">{team.losses || 0}</p>
                <p className="text-sm text-muted-foreground">Derrotas</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{winRate}%</p>
                <p className="text-sm text-muted-foreground">Taxa de Vitória</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{recentWins}/{recentMatches}</p>
                <p className="text-sm text-muted-foreground">Últimas Partidas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-yellow-400" />
              Jogadores ({team.members.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {team.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    {member.joinedAt && (
                      <p className="text-xs text-muted-foreground">
                        Entrou em {format(new Date(member.joinedAt), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    )}
                  </div>
                </div>
                {member.stats && (
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      {member.stats.rank && (
                        <Badge variant="outline" className="text-xs">
                          {member.stats.rank}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.stats.wins}V / {member.stats.matches - member.stats.wins}D
                      {member.stats.kdr && ` • ${member.stats.kdr} K/D`}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              Partidas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {team.recentMatches?.slice(0, 5).map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    match.result === "win" ? "bg-green-500" : "bg-red-500"
                  }`} />
                  <div>
                    <p className="font-medium">vs {match.opponent}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{format(new Date(match.date), "dd/MM", { locale: ptBR })}</span>
                      {match.tournament && (
                        <>
                          <span>•</span>
                          <span>{match.tournament}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    match.result === "win" ? "text-green-600" : "text-red-600"
                  }`}>
                    {match.result === "win" ? "VITÓRIA" : "DERROTA"}
                  </p>
                  <p className="text-sm text-muted-foreground">{match.score}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {team.achievements && team.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Conquistas e Títulos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {team.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">{achievement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
