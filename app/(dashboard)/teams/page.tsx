"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Trophy,
  Target,
  Gamepad2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
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
}

const mockTeams: Team[] = [
  {
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
    members: [
      { id: "1", name: "ThunderStrike", role: "Duelist" },
      { id: "2", name: "ShadowPlay", role: "Controller" },
      { id: "3", name: "IronWall", role: "Sentinel" },
      { id: "4", name: "FlashPoint", role: "Initiator" },
      { id: "5", name: "AceShot", role: "Flex" },
    ]
  },
  {
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
    members: [
      { id: "6", name: "HeadHunter", role: "AWPer" },
      { id: "7", name: "RushMaster", role: "Entry Fragger" },
      { id: "8", name: "ClutchKing", role: "Support" },
      { id: "9", name: "SmokeShow", role: "IGL" },
      { id: "10", name: "FlickGod", role: "Rifler" },
    ]
  },
  {
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
    members: [
      { id: "11", name: "JungleKing", role: "Jungle" },
      { id: "12", name: "MidLaner", role: "Mid Lane" },
      { id: "13", name: "BotCarry", role: "ADC" },
      { id: "14", name: "SupportGod", role: "Support" },
      { id: "15", name: "TopTitan", role: "Top Lane" },
    ]
  },
  {
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
    members: [
      { id: "16", name: "MobileAce", role: "Fragger" },
      { id: "17", name: "QuickShot", role: "Support" },
    ]
  }
];

const games = [
  "Valorant",
  "Counter-Strike 2",
  "League of Legends",
  "Dota 2",
  "Free Fire",
  "Mobile Legends",
  "Rainbow Six Siege",
  "Apex Legends",
  "Fortnite",
  "Rocket League"
];

export default function TeamsPage() {
  const [teams, setTeams] = useState(mockTeams);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewTeamOpen, setIsNewTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Form states
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    manager: "",
    game: "",
    rank: ""
  });

  const [editTeam, setEditTeam] = useState({
    name: "",
    description: "",
    manager: "",
    game: "",
    rank: ""
  });

  const [newPlayer, setNewPlayer] = useState({
    name: "",
    role: ""
  });

  const filteredTeams = teams.filter(team => {
    const matchesSearch = !searchQuery || 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.manager.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || team.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateTeam = () => {
    if (newTeam.name && newTeam.game && newTeam.manager) {
      const team: Team = {
        id: Date.now().toString(),
        name: newTeam.name,
        description: newTeam.description,
        manager: newTeam.manager,
        game: newTeam.game,
        rank: newTeam.rank || undefined,
        status: "ativo",
        createdAt: new Date().toISOString().split('T')[0],
        wins: 0,
        losses: 0,
        members: []
      };
      
      setTeams(prev => [team, ...prev]);
      setNewTeam({ name: "", description: "", manager: "", game: "", rank: "" });
      setIsNewTeamOpen(false);
    }
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setEditTeam({
      name: team.name,
      description: team.description,
      manager: team.manager,
      game: team.game,
      rank: team.rank || ""
    });
    setIsEditTeamOpen(true);
  };

  const handleSaveEditTeam = () => {
    if (selectedTeam && editTeam.name && editTeam.game && editTeam.manager) {
      setTeams(prev => prev.map(team => 
        team.id === selectedTeam.id 
          ? {
              ...team,
              name: editTeam.name,
              description: editTeam.description,
              manager: editTeam.manager,
              game: editTeam.game,
              rank: editTeam.rank || undefined
            }
          : team
      ));
      setIsEditTeamOpen(false);
      setSelectedTeam(null);
      setEditTeam({ name: "", description: "", manager: "", game: "", rank: "" });
    }
  };

  const handleAddPlayer = (team: Team) => {
    setSelectedTeam(team);
    setNewPlayer({ name: "", role: "" });
    setIsAddPlayerOpen(true);
  };

  const handleSaveNewPlayer = () => {
    if (selectedTeam && newPlayer.name && newPlayer.role) {
      const player: TeamMember = {
        id: Date.now().toString(),
        name: newPlayer.name,
        role: newPlayer.role
      };

      setTeams(prev => prev.map(team => 
        team.id === selectedTeam.id 
          ? { ...team, members: [...team.members, player] }
          : team
      ));
      setIsAddPlayerOpen(false);
      setSelectedTeam(null);
      setNewPlayer({ name: "", role: "" });
    }
  };

  const activeTeams = teams.filter(t => t.status === "ativo").length;
  const totalMembers = teams.reduce((acc, team) => acc + team.members.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Times de Esports</h1>
          <p className="text-muted-foreground">
            Gerencie suas equipes competitivas e jogadores
          </p>
        </div>
        <Dialog open={isNewTeamOpen} onOpenChange={setIsNewTeamOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4 text-yellow-400" />
              Novo Time
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Time</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo time de esports.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Time</Label>
                <Input
                  id="name"
                  placeholder="Ex: Solid Valorant"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="game">Jogo</Label>
                <Select value={newTeam.game} onValueChange={(value) => setNewTeam(prev => ({ ...prev, game: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um jogo" />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map(game => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Técnico/Coach</Label>
                <Input
                  id="manager"
                  placeholder="Nome do técnico"
                  value={newTeam.manager}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, manager: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rank">Rank Atual (Opcional)</Label>
                <Input
                  id="rank"
                  placeholder="Ex: Immortal 3, Global Elite, Challenger"
                  value={newTeam.rank}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, rank: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o time e seus objetivos..."
                  value={newTeam.description}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTeamOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTeam}>
                Criar Time
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Team Modal */}
        <Dialog open={isEditTeamOpen} onOpenChange={setIsEditTeamOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Time</DialogTitle>
              <DialogDescription>
                Altere as informações do time selecionado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome do Time</Label>
                <Input
                  id="edit-name"
                  placeholder="Ex: Solid Valorant"
                  value={editTeam.name}
                  onChange={(e) => setEditTeam(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-game">Jogo</Label>
                <Select value={editTeam.game} onValueChange={(value) => setEditTeam(prev => ({ ...prev, game: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um jogo" />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map(game => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manager">Técnico/Coach</Label>
                <Input
                  id="edit-manager"
                  placeholder="Nome do técnico"
                  value={editTeam.manager}
                  onChange={(e) => setEditTeam(prev => ({ ...prev, manager: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rank">Rank Atual</Label>
                <Input
                  id="edit-rank"
                  placeholder="Ex: Immortal 3, Global Elite, Challenger"
                  value={editTeam.rank}
                  onChange={(e) => setEditTeam(prev => ({ ...prev, rank: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Descreva o time e seus objetivos..."
                  value={editTeam.description}
                  onChange={(e) => setEditTeam(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditTeamOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEditTeam}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Player Modal */}
        <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Jogador</DialogTitle>
              <DialogDescription>
                Adicione um novo jogador ao time {selectedTeam?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="player-name">Nome do Jogador/Nick</Label>
                <Input
                  id="player-name"
                  placeholder="Ex: ThunderStrike, HeadHunter"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="player-role">Função/Role</Label>
                <Input
                  id="player-role"
                  placeholder="Ex: Duelist, AWPer, Mid Lane, Support"
                  value={newPlayer.role}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, role: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Exemplos: Duelist, Controller, Sentinel, Initiator (Valorant) | AWPer, Entry Fragger, IGL, Support (CS2) | Top, Jungle, Mid, ADC, Support (LoL)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPlayerOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveNewPlayer}>
                Adicionar Jogador
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Times</CardTitle>
            <Users className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Times Ativos</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTeams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Jogadores</CardTitle>
            <Gamepad2 className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Vitória</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const totalWins = teams.reduce((sum, team) => sum + (team.wins || 0), 0);
                const totalGames = teams.reduce((sum, team) => sum + (team.wins || 0) + (team.losses || 0), 0);
                return totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
              })()}%
            </div>
            <p className="text-xs text-muted-foreground">
              Geral
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
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <Input
                placeholder="Buscar por nome do time ou técnico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              Todos os status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <Link href={`/teams/${team.id}`}>
                  <CardTitle className="text-lg hover:text-primary cursor-pointer transition-colors">
                    {team.name}
                  </CardTitle>
                </Link>
                <CardDescription className="text-sm">
                  Técnico: {team.manager}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={team.status === "ativo" ? "default" : "secondary"}>
                  {team.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4 text-yellow-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditTeam(team)}>
                      <Edit className="mr-2 h-4 w-4 text-yellow-400" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddPlayer(team)}>
                      <UserPlus className="mr-2 h-4 w-4 text-yellow-400" />
                      Adicionar Jogador
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {team.description}
              </p>
              
              {/* Game Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium">{team.game}</span>
                </div>
                {team.rank && (
                  <Badge variant="outline" className="text-xs">
                    {team.rank}
                  </Badge>
                )}
              </div>

              {/* Win/Loss Record */}
              {team.wins !== undefined && team.losses !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-600">{team.wins}V</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-600">{team.losses}D</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((team.wins / (team.wins + team.losses)) * 100)}% WR
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Jogadores ({team.members.length})</span>
                </div>
                
                <div className="space-y-2">
                  {team.members.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {team.members.length > 3 && (
                    <div className="text-xs text-muted-foreground pl-11">
                      +{team.members.length - 3} outros jogadores
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum time encontrado</h3>
            <p className="text-muted-foreground text-center mb-6">
              Não há times que correspondam aos filtros aplicados.
            </p>
            <Button className="gap-2">
              <Plus className="w-4 h-4 text-yellow-400" />
              Criar primeiro time
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
