import { useState, useEffect, useRef } from "react";

const estadosCidades = {
  "AC": { nome: "Acre", cidades: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira"] },
  "AL": { nome: "Alagoas", cidades: ["Maceió", "Arapiraca", "Palmeira dos Índios"] },
  "AM": { nome: "Amazonas", cidades: ["Manaus", "Parintins", "Itacoatiara"] },
  "BA": { nome: "Bahia", cidades: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna"] },
  "CE": { nome: "Ceará", cidades: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral"] },
  "DF": { nome: "Distrito Federal", cidades: ["Brasília", "Ceilândia", "Taguatinga", "Samambaia"] },
  "ES": { nome: "Espírito Santo", cidades: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Cachoeiro de Itapemirim"] },
  "GO": { nome: "Goiás", cidades: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde"] },
  "MA": { nome: "Maranhão", cidades: ["São Luís", "Imperatriz", "Timon", "Caxias"] },
  "MG": { nome: "Minas Gerais", cidades: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros"] },
  "MS": { nome: "Mato Grosso do Sul", cidades: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá"] },
  "MT": { nome: "Mato Grosso", cidades: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop"] },
  "PA": { nome: "Pará", cidades: ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal"] },
  "PB": { nome: "Paraíba", cidades: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos"] },
  "PE": { nome: "Pernambuco", cidades: ["Recife", "Caruaru", "Olinda", "Petrolina", "Paulista"] },
  "PI": { nome: "Piauí", cidades: ["Teresina", "Parnaíba", "Picos", "Floriano"] },
  "PR": { nome: "Paraná", cidades: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "Foz do Iguaçu"] },
  "RJ": { nome: "Rio de Janeiro", cidades: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói"] },
  "RN": { nome: "Rio Grande do Norte", cidades: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante"] },
  "RO": { nome: "Rondônia", cidades: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Cacoal"] },
  "RR": { nome: "Roraima", cidades: ["Boa Vista", "Rorainópolis", "Caracaraí"] },
  "RS": { nome: "Rio Grande do Sul", cidades: ["Porto Alegre", "Caxias do Sul", "Canoas", "Pelotas", "Santa Maria"] },
  "SC": { nome: "Santa Catarina", cidades: ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó"] },
  "SE": { nome: "Sergipe", cidades: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana"] },
  "SP": { nome: "São Paulo", cidades: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "Ribeirão Preto", "Sorocaba", "Santos"] },
  "TO": { nome: "Tocantins", cidades: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional"] },
};

const mockLeads = [
  { id: 1, nome: "Restaurante Sabor da Terra", instagram: "@sabordaterra_bh", estado: "MG", cidade: "Belo Horizonte", bairro: "Savassi", categoria: "Restaurante", seguidores: 1240, engajamento: 0.6, posts: 87, ultimoPost: 45, leadScore: 91, status: "novo", telefone: "(31) 99234-5678", bio: "incompleta", cta: false, reels: false },
  { id: 2, nome: "Ótica Visão Clara", instagram: "@visaoclara_oficial", estado: "SP", cidade: "São Paulo", bairro: "Vila Mariana", categoria: "Ótica", seguidores: 3420, engajamento: 0.9, posts: 54, ultimoPost: 12, leadScore: 87, status: "contatado", telefone: "(11) 98876-1234", bio: "completa", cta: false, reels: false },
  { id: 3, nome: "Auto Peças Silva", instagram: "@autopecassilva", estado: "PR", cidade: "Curitiba", bairro: "Portão", categoria: "Autopeças", seguidores: 720, engajamento: 0.4, posts: 23, ultimoPost: 78, leadScore: 95, status: "novo", telefone: "(41) 97654-3210", bio: "incompleta", cta: false, reels: false },
  { id: 4, nome: "Clínica Dra. Renata", instagram: "@drarenataodonto", estado: "RJ", cidade: "Rio de Janeiro", bairro: "Botafogo", categoria: "Saúde", seguidores: 5600, engajamento: 1.1, posts: 134, ultimoPost: 8, leadScore: 72, status: "negociação", telefone: "(21) 99123-4567", bio: "completa", cta: true, reels: false },
  { id: 5, nome: "Loja Moda Feminina Chic", instagram: "@modafemininachic", estado: "CE", cidade: "Fortaleza", bairro: "Meireles", categoria: "Moda", seguidores: 2180, engajamento: 0.7, posts: 201, ultimoPost: 3, leadScore: 83, status: "novo", telefone: "(85) 98765-4321", bio: "incompleta", cta: false, reels: true },
  { id: 6, nome: "Padaria Trigo Dourado", instagram: "@trigodourado_ce", estado: "CE", cidade: "Fortaleza", bairro: "Aldeota", categoria: "Alimentação", seguidores: 890, engajamento: 0.3, posts: 45, ultimoPost: 91, leadScore: 97, status: "novo", telefone: "(85) 96543-2109", bio: "incompleta", cta: false, reels: false },
  { id: 7, nome: "Pet Shop Amigo Fiel", instagram: "@amigofiel_pets", estado: "PE", cidade: "Recife", bairro: "Boa Viagem", categoria: "Pet Shop", seguidores: 4320, engajamento: 2.1, posts: 312, ultimoPost: 2, leadScore: 58, status: "cliente", telefone: "(81) 99876-5432", bio: "completa", cta: true, reels: true },
  { id: 8, nome: "Academia FitLife", instagram: "@fitlife_academia", estado: "MG", cidade: "Belo Horizonte", bairro: "Lourdes", categoria: "Academia", seguidores: 6700, engajamento: 0.8, posts: 178, ultimoPost: 5, leadScore: 79, status: "novo", telefone: "(31) 98765-1234", bio: "completa", cta: false, reels: false },
  { id: 9, nome: "Salão Beleza Total", instagram: "@belezatotal_sp", estado: "SP", cidade: "São Paulo", bairro: "Pinheiros", categoria: "Beleza", seguidores: 1560, engajamento: 0.5, posts: 67, ultimoPost: 34, leadScore: 89, status: "descartado", telefone: "(11) 97890-4567", bio: "incompleta", cta: false, reels: false },
  { id: 10, nome: "Escola de Inglês Prime", instagram: "@primeenglish_rj", estado: "RJ", cidade: "Rio de Janeiro", bairro: "Tijuca", categoria: "Educação", seguidores: 2890, engajamento: 1.4, posts: 89, ultimoPost: 15, leadScore: 68, status: "novo", telefone: "(21) 98234-6789", bio: "completa", cta: false, reels: false },
  { id: 11, nome: "Mecânica Central Motors", instagram: "@centralmotors_cwb", estado: "PR", cidade: "Curitiba", bairro: "Água Verde", categoria: "Autopeças", seguidores: 540, engajamento: 0.2, posts: 12, ultimoPost: 120, leadScore: 98, status: "novo", telefone: "(41) 96789-1234", bio: "incompleta", cta: false, reels: false },
  { id: 12, nome: "Confeitaria Doce Mel", instagram: "@docemel_confeitaria", estado: "MG", cidade: "Belo Horizonte", bairro: "Santa Efigênia", categoria: "Alimentação", seguidores: 3100, engajamento: 0.9, posts: 156, ultimoPost: 7, leadScore: 76, status: "contatado", telefone: "(31) 99012-3456", bio: "completa", cta: false, reels: true },
  { id: 13, nome: "Farmácia São João", instagram: "@farmaciasaojoao_poa", estado: "RS", cidade: "Porto Alegre", bairro: "Moinhos de Vento", categoria: "Saúde", seguidores: 1870, engajamento: 0.5, posts: 43, ultimoPost: 22, leadScore: 86, status: "novo", telefone: "(51) 99345-6789", bio: "incompleta", cta: false, reels: false },
  { id: 14, nome: "Imobiliária Vista Mar", instagram: "@vistamar_imoveis", estado: "SC", cidade: "Florianópolis", bairro: "Jurerê", categoria: "Imobiliária", seguidores: 4100, engajamento: 0.6, posts: 230, ultimoPost: 18, leadScore: 80, status: "novo", telefone: "(48) 98876-5432", bio: "completa", cta: false, reels: false },
  { id: 15, nome: "Buffet Sabores da Bahia", instagram: "@saboresbahia_ssa", estado: "BA", cidade: "Salvador", bairro: "Barra", categoria: "Restaurante", seguidores: 2340, engajamento: 0.4, posts: 67, ultimoPost: 55, leadScore: 93, status: "novo", telefone: "(71) 97654-3210", bio: "incompleta", cta: false, reels: false },
  { id: 16, nome: "Studio Dança Movimento", instagram: "@dancamovimento_bsb", estado: "DF", cidade: "Brasília", bairro: "Asa Sul", categoria: "Academia", seguidores: 980, engajamento: 0.7, posts: 89, ultimoPost: 41, leadScore: 88, status: "novo", telefone: "(61) 99123-4567", bio: "incompleta", cta: false, reels: true },
];

const nichos = [
  { nome: "Restaurantes", leads: 142, cor: "#f97316", engMedio: 0.74 },
  { nome: "Moda & Vestuário", leads: 98, cor: "#a855f7", engMedio: 0.82 },
  { nome: "Autopeças", leads: 76, cor: "#3b82f6", engMedio: 0.41 },
  { nome: "Beleza & Estética", leads: 65, cor: "#ec4899", engMedio: 0.61 },
  { nome: "Alimentação", leads: 54, cor: "#22c55e", engMedio: 0.53 },
  { nome: "Saúde & Clínicas", leads: 43, cor: "#06b6d4", engMedio: 1.12 },
];

const cidades = [
  { nome: "São Paulo", leads: 312, lat: -23.55, lng: -46.63 },
  { nome: "Rio de Janeiro", leads: 198, lat: -22.90, lng: -43.17 },
  { nome: "Belo Horizonte", leads: 154, lat: -19.92, lng: -43.94 },
  { nome: "Curitiba", leads: 87, lat: -25.43, lng: -49.27 },
  { nome: "Fortaleza", leads: 76, lat: -3.71, lng: -38.54 },
  { nome: "Recife", leads: 62, lat: -8.05, lng: -34.88 },
];

const statusColors = {
  novo: { bg: "#1a3a2a", text: "#4ade80", border: "#166534" },
  contatado: { bg: "#1a2a3a", text: "#60a5fa", border: "#1d4ed8" },
  negociação: { bg: "#3a2a1a", text: "#fb923c", border: "#c2410c" },
  cliente: { bg: "#2a3a1a", text: "#a3e635", border: "#3f6212" },
  descartado: { bg: "#2a1a1a", text: "#f87171", border: "#991b1b" },
};

function ScoreBar({ score, size = "md" }) {
  const color = score >= 85 ? "#ef4444" : score >= 70 ? "#f97316" : score >= 50 ? "#eab308" : "#22c55e";
  const h = size === "sm" ? "4px" : "6px";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: h, background: "#1a2035", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 999, transition: "width 1s ease", boxShadow: `0 0 8px ${color}88` }} />
      </div>
      <span style={{ fontSize: size === "sm" ? 11 : 13, color, fontWeight: 700, minWidth: 28, fontFamily: "'JetBrains Mono', monospace" }}>{score}</span>
    </div>
  );
}

function EngBadge({ eng }) {
  const level = eng < 1 ? { label: "CRÍTICO", color: "#ef4444" } : eng < 3 ? { label: "BAIXO", color: "#f97316" } : eng < 6 ? { label: "MÉDIO", color: "#eab308" } : { label: "ALTO", color: "#22c55e" };
  return (
    <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: level.color, background: level.color + "22", border: `1px solid ${level.color}44`, borderRadius: 4, padding: "2px 6px", letterSpacing: 1 }}>
      {eng.toFixed(1)}% · {level.label}
    </span>
  );
}

function StatCard({ icon, label, value, sub, color = "#06b6d4", trend }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #0d1526 0%, #111827 100%)", border: `1px solid ${color}33`, borderRadius: 12, padding: "20px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: color + "08", borderRadius: "0 12px 0 80px" }} />
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: trend > 0 ? "#4ade80" : "#f87171", marginTop: 6, fontWeight: 600 }}>{trend > 0 ? "▲" : "▼"} {sub}</div>}
    </div>
  );
}

function AIInsightPanel({ lead }) {
  const insights = [
    { icon: "📹", text: `Usar Reels pode aumentar alcance em até 3×`, priority: "alta" },
    { icon: "✍️", text: `Bio incompleta — adicionar CTA e link WhatsApp`, priority: "alta" },
    { icon: "📅", text: `Postar no mínimo 4× por semana (frequência atual: baixa)`, priority: "média" },
    { icon: "🏷️", text: `Usar hashtags locais do bairro ${lead?.bairro || ""}`, priority: "média" },
    { icon: "💬", text: `Responder comentários aumenta engajamento orgânico`, priority: "baixa" },
  ];
  const p = { alta: "#ef4444", média: "#f97316", baixa: "#eab308" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {insights.map((ins, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "#0d1526", borderRadius: 8, border: `1px solid ${p[ins.priority]}22`, alignItems: "flex-start" }}>
          <span style={{ fontSize: 16 }}>{ins.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.5 }}>{ins.text}</div>
            <span style={{ fontSize: 10, color: p[ins.priority], fontWeight: 700, letterSpacing: 0.5 }}>PRIORIDADE {ins.priority.toUpperCase()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniMap() {
  const dots = [
    { x: 42, y: 58, size: 18, city: "SP", leads: 312 },
    { x: 55, y: 55, size: 14, city: "RJ", leads: 198 },
    { x: 40, y: 52, size: 12, city: "BH", leads: 154 },
    { x: 35, y: 70, size: 9, city: "CWB", leads: 87 },
    { x: 55, y: 35, size: 8, city: "FOR", leads: 76 },
    { x: 65, y: 45, size: 7, city: "REC", leads: 62 },
    { x: 30, y: 60, size: 6, city: "POA", leads: 45 },
    { x: 48, y: 40, size: 5, city: "SSA", leads: 38 },
  ];
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, #060d1a 0%, #0a1628 100%)", borderRadius: 12, overflow: "hidden", border: "1px solid #1e3a5f" }}>
      <svg viewBox="0 0 100 70" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
        <path d="M20,20 Q30,15 40,18 Q50,20 55,25 Q60,30 65,35 Q62,45 55,50 Q50,55 45,60 Q35,65 25,62 Q18,58 15,50 Q12,42 15,33 Z" fill="#1e40af" stroke="#3b82f6" strokeWidth="0.5" />
        <path d="M55,18 Q60,15 65,18 Q70,20 72,25 Q68,32 65,38 Q60,35 58,30 Z" fill="#1e40af" stroke="#3b82f6" strokeWidth="0.5" />
        <path d="M30,50 Q35,48 40,52 Q38,58 32,60 Q28,58 28,54 Z" fill="#1e3a6a" stroke="#3b82f6" strokeWidth="0.3" />
      </svg>
      {/* Grid lines */}
      {[20, 40, 60, 80].map(x => <div key={x} style={{ position: "absolute", left: `${x}%`, top: 0, bottom: 0, width: 1, background: "#ffffff08" }} />)}
      {[20, 40, 60, 80].map(y => <div key={y} style={{ position: "absolute", top: `${y}%`, left: 0, right: 0, height: 1, background: "#ffffff08" }} />)}

      {dots.map((d, i) => (
        <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ position: "absolute", left: `${d.x}%`, top: `${d.y}%`, transform: "translate(-50%,-50%)", cursor: "pointer" }}>
          <div style={{ width: d.size, height: d.size, borderRadius: "50%", background: "#06b6d4", opacity: 0.9, boxShadow: `0 0 ${d.size * 2}px #06b6d488`, border: "2px solid #06b6d4", animation: "pulse 2s infinite" }} />
          {hovered === i && (
            <div style={{ position: "absolute", bottom: "120%", left: "50%", transform: "translateX(-50%)", background: "#0d1526", border: "1px solid #06b6d4", borderRadius: 6, padding: "4px 8px", whiteSpace: "nowrap", zIndex: 10 }}>
              <div style={{ fontSize: 11, color: "#06b6d4", fontWeight: 700 }}>{d.city}</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>{d.leads} leads</div>
            </div>
          )}
        </div>
      ))}
      <div style={{ position: "absolute", bottom: 10, left: 12, fontSize: 11, color: "#475569" }}>● Densidade de leads por cidade</div>
    </div>
  );
}

function ProspectMessage({ lead }) {
  const msg = `Olá ${lead?.nome || "empresa"}! 👋\n\nAnalisei o perfil do Instagram de vocês (@${lead?.instagram?.replace("@", "") || ""}) e identifiquei oportunidades concretas para aumentar o alcance e atrair mais clientes.\n\nVocês têm ${lead?.seguidores?.toLocaleString()} seguidores, mas o engajamento está em ${lead?.engajamento?.toFixed(1)}% — bem abaixo do potencial do nicho.\n\nPosso enviar um diagnóstico GRATUITO com estratégias personalizadas para o setor de ${lead?.categoria || "vocês"}.\n\nInteresse? 🚀`;
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ background: "#0d1526", borderRadius: 10, border: "1px solid #1e3a5f", overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", background: "#060d1a", borderBottom: "1px solid #1e3a5f", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>MENSAGEM DE PROSPECÇÃO</span>
        <button onClick={() => { navigator.clipboard?.writeText(msg); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ fontSize: 11, color: copied ? "#4ade80" : "#06b6d4", background: "none", border: `1px solid ${copied ? "#4ade80" : "#06b6d4"}44`, borderRadius: 4, padding: "3px 10px", cursor: "pointer", fontWeight: 600 }}>
          {copied ? "✓ COPIADO" : "COPIAR"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "14px", fontSize: 12, color: "#94a3b8", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono', monospace" }}>{msg}</pre>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterCidade, setFilterCidade] = useState("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("leadScore");
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [leads, setLeads] = useState(mockLeads);
  const [notification, setNotification] = useState(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanEstado, setScanEstado] = useState("");
  const [scanCidade, setScanCidade] = useState("");
  const [scanNicho, setScanNicho] = useState("");
  const [scanRaio, setScanRaio] = useState("10");

  const cidadesDoEstadoFiltro = filterEstado !== "todos" ? estadosCidades[filterEstado]?.cidades || [] : [];
  const cidadesDoEstadoScan = scanEstado ? estadosCidades[scanEstado]?.cidades || [] : [];

  const totalLeads = leads.length;
  const leadsNovos = leads.filter(l => l.status === "novo").length;
  const mediaEng = (leads.reduce((a, b) => a + b.engajamento, 0) / leads.length).toFixed(2);
  const clientes = leads.filter(l => l.status === "cliente").length;

  const filteredLeads = leads
    .filter(l => filterStatus === "todos" || l.status === filterStatus)
    .filter(l => filterEstado === "todos" || l.estado === filterEstado)
    .filter(l => filterCidade === "todas" || l.cidade === filterCidade)
    .filter(l => l.nome.toLowerCase().includes(searchTerm.toLowerCase()) || l.instagram.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortBy === "leadScore" ? b.leadScore - a.leadScore : sortBy === "engajamento" ? a.engajamento - b.engajamento : b.seguidores - a.seguidores);

  const startScan = () => {
    if (!scanEstado || !scanCidade) { showNotif("⚠ Selecione estado e cidade para varrer."); return; }
    setShowScanModal(false);
    setScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setScanning(false);
          showNotif(`✅ Varredura em ${scanCidade}/${scanEstado} concluída! 3 novos leads encontrados.`);
          return 100;
        }
        return p + 2;
      });
    }, 60);
  };

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const updateStatus = (id, status) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    showNotif(`Status atualizado para "${status}"`);
  };

  const tabs = [
    { id: "dashboard", icon: "⬛", label: "Dashboard" },
    { id: "leads", icon: "◈", label: "Leads" },
    { id: "mapa", icon: "◉", label: "Mapa" },
    { id: "analise", icon: "◬", label: "Análise" },
    { id: "ia", icon: "✦", label: "IA Insights" },
    { id: "automacao", icon: "⟳", label: "Automação" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#060d1a", minHeight: "100vh", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #060d1a; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 999px; }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(1.3); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scanLine { 0% { top: 0%; } 100% { top: 100%; } }
        .tab-btn { transition: all 0.2s; }
        .tab-btn:hover { background: #0d1a2e !important; }
        .lead-row { transition: all 0.15s; cursor: pointer; }
        .lead-row:hover { background: #0d1a2e !important; }
        .btn-primary { transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px #06b6d444 !important; }
        .notif { animation: fadeIn 0.3s ease; }
      `}</style>

      {/* Header */}
      <header style={{ background: "#060d1a", borderBottom: "1px solid #1e3a5f", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #0891b2, #7c3aed)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>◎</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9", letterSpacing: -0.5, fontFamily: "'Space Grotesk', sans-serif" }}>Local Social Lead Finder</div>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1, fontWeight: 500 }}>INTELLIGENCE PLATFORM</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {scanning && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#0d1526", border: "1px solid #0891b2", borderRadius: 20, padding: "4px 12px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0891b2", animation: "pulse 1s infinite" }} />
              <span style={{ fontSize: 11, color: "#0891b2", fontWeight: 600 }}>VARRENDO {scanProgress}%</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            {["SP", "RJ", "BH", "CWB"].map(c => (
              <span key={c} style={{ fontSize: 10, color: "#475569", background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 4, padding: "3px 7px", fontFamily: "'JetBrains Mono', monospace" }}>{c}</span>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setShowScanModal(true)} disabled={scanning}
            style={{ background: scanning ? "#1e3a5f" : "linear-gradient(135deg, #0891b2, #0e7490)", color: "white", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: scanning ? "not-allowed" : "pointer", letterSpacing: 0.5 }}>
            {scanning ? `VARRENDO...` : "▶ NOVA VARREDURA"}
          </button>
        </div>
      </header>

      {/* Nav */}
      <nav style={{ background: "#080f1e", borderBottom: "1px solid #1e3a5f44", padding: "0 24px", display: "flex", gap: 2 }}>
        {tabs.map(t => (
          <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id)}
            style={{ background: activeTab === t.id ? "#0d1526" : "transparent", border: "none", borderBottom: activeTab === t.id ? "2px solid #06b6d4" : "2px solid transparent", color: activeTab === t.id ? "#06b6d4" : "#64748b", padding: "12px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, letterSpacing: 0.3 }}>
            <span style={{ opacity: 0.8 }}>{t.icon}</span> {t.label}
          </button>
        ))}
      </nav>

      {/* Notification */}
      {notification && (
        <div className="notif" style={{ position: "fixed", top: 72, right: 20, background: "#0d1526", border: "1px solid #06b6d4", borderRadius: 10, padding: "10px 18px", fontSize: 13, color: "#e2e8f0", zIndex: 999, boxShadow: "0 4px 24px #000a" }}>
          {notification}
        </div>
      )}

      {/* Scan Progress */}
      {scanning && (
        <div style={{ height: 2, background: "#1e3a5f" }}>
          <div style={{ height: "100%", width: `${scanProgress}%`, background: "linear-gradient(90deg, #0891b2, #06b6d4)", transition: "width 0.1s", boxShadow: "0 0 8px #06b6d4" }} />
        </div>
      )}

      {/* Scan Modal */}
      {showScanModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowScanModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 16, width: 480, overflow: "hidden", animation: "fadeIn 0.2s ease", boxShadow: "0 24px 60px #000c" }}>
            {/* Modal header */}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #1e3a5f", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#060d1a" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Space Grotesk', sans-serif" }}>▶ Nova Varredura</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Configure a busca por localização</div>
              </div>
              <button onClick={() => setShowScanModal(false)} style={{ background: "none", border: "none", color: "#475569", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            {/* Modal body */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Estado */}
              <div>
                <label style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>ESTADO *</label>
                <select value={scanEstado} onChange={e => { setScanEstado(e.target.value); setScanCidade(""); }}
                  style={{ width: "100%", background: "#060d1a", border: `1px solid ${scanEstado ? "#0891b2" : "#1e3a5f"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: scanEstado ? "#e2e8f0" : "#475569", outline: "none" }}>
                  <option value="">Selecione o estado...</option>
                  {Object.entries(estadosCidades).sort((a, b) => a[1].nome.localeCompare(b[1].nome)).map(([uf, { nome }]) => (
                    <option key={uf} value={uf}>{nome} ({uf})</option>
                  ))}
                </select>
              </div>

              {/* Cidade */}
              <div>
                <label style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>CIDADE *</label>
                <select value={scanCidade} onChange={e => setScanCidade(e.target.value)} disabled={!scanEstado}
                  style={{ width: "100%", background: "#060d1a", border: `1px solid ${scanCidade ? "#0891b2" : "#1e3a5f"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: scanCidade ? "#e2e8f0" : "#475569", outline: "none", opacity: scanEstado ? 1 : 0.5 }}>
                  <option value="">{scanEstado ? "Selecione a cidade..." : "Primeiro selecione o estado"}</option>
                  {cidadesDoEstadoScan.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {/* Nicho */}
                <div>
                  <label style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>NICHO (opcional)</label>
                  <select value={scanNicho} onChange={e => setScanNicho(e.target.value)}
                    style={{ width: "100%", background: "#060d1a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#94a3b8", outline: "none" }}>
                    <option value="">Todos os nichos</option>
                    {["Restaurante","Moda","Autopeças","Beleza","Alimentação","Saúde","Academia","Pet Shop","Educação","Imobiliária"].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                {/* Raio */}
                <div>
                  <label style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>RAIO DE BUSCA</label>
                  <select value={scanRaio} onChange={e => setScanRaio(e.target.value)}
                    style={{ width: "100%", background: "#060d1a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#94a3b8", outline: "none" }}>
                    {["5","10","20","30","50"].map(r => <option key={r} value={r}>{r} km</option>)}
                  </select>
                </div>
              </div>

              {/* Preview */}
              {scanEstado && scanCidade && (
                <div style={{ background: "#060d1a", borderRadius: 8, border: "1px solid #0891b233", padding: "12px 14px", animation: "fadeIn 0.2s ease" }}>
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 6 }}>PRÉVIA DA VARREDURA</div>
                  <div style={{ fontSize: 13, color: "#e2e8f0" }}>
                    📍 <strong style={{ color: "#06b6d4" }}>{scanCidade}</strong>, {estadosCidades[scanEstado]?.nome}
                    {scanNicho && <> · Nicho: <strong style={{ color: "#a78bfa" }}>{scanNicho}</strong></>}
                    {" "}· Raio: <strong style={{ color: "#94a3b8" }}>{scanRaio}km</strong>
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>~estimativa: 15–40 perfis a analisar</div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #1e3a5f", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowScanModal(false)} style={{ background: "none", border: "1px solid #1e3a5f", borderRadius: 8, padding: "9px 18px", color: "#64748b", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Cancelar</button>
              <button onClick={startScan} disabled={!scanEstado || !scanCidade}
                style={{ background: (!scanEstado || !scanCidade) ? "#1e3a5f" : "linear-gradient(135deg, #0891b2, #0e7490)", color: "white", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 13, fontWeight: 700, cursor: (!scanEstado || !scanCidade) ? "not-allowed" : "pointer", opacity: (!scanEstado || !scanCidade) ? 0.5 : 1 }}>
                ▶ Iniciar Varredura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main style={{ flex: 1, padding: "24px", overflow: "auto", animation: "fadeIn 0.3s ease" }}>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              <StatCard icon="◈" label="Total de Leads" value={totalLeads} sub="+3 hoje" trend={1} color="#06b6d4" />
              <StatCard icon="◉" label="Leads Novos" value={leadsNovos} sub="+1 esta semana" trend={1} color="#f97316" />
              <StatCard icon="◬" label="Eng. Médio" value={`${mediaEng}%`} sub="Abaixo de 1%" trend={-1} color="#ef4444" />
              <StatCard icon="✓" label="Convertidos" value={clientes} sub="+1 este mês" trend={1} color="#4ade80" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Top Leads */}
              <div style={{ background: "#0d1526", borderRadius: 12, border: "1px solid #1e3a5f", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e3a5f", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.5 }}>🔥 TOP OPORTUNIDADES</span>
                  <span style={{ fontSize: 11, color: "#475569" }}>por Lead Score</span>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {leads.filter(l => l.status === "novo").sort((a, b) => b.leadScore - a.leadScore).slice(0, 5).map((lead, i) => (
                    <div key={lead.id} onClick={() => { setSelectedLead(lead); setActiveTab("ia"); }}
                      className="lead-row" style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace", minWidth: 16 }}>#{i + 1}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{lead.nome}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{lead.instagram} · {lead.cidade}</div>
                      </div>
                      <ScoreBar score={lead.leadScore} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Nichos */}
              <div style={{ background: "#0d1526", borderRadius: 12, border: "1px solid #1e3a5f", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e3a5f" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.5 }}>📊 NICHOS COM MAIS OPORTUNIDADES</span>
                </div>
                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {nichos.map(n => (
                    <div key={n.nome} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: n.cor, boxShadow: `0 0 6px ${n.cor}88`, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#94a3b8", minWidth: 130 }}>{n.nome}</span>
                      <div style={{ flex: 1, height: 5, background: "#1a2035", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ width: `${(n.leads / 142) * 100}%`, height: "100%", background: n.cor, borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: 11, color: n.cor, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, minWidth: 28 }}>{n.leads}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pipeline Kanban mini */}
            <div style={{ background: "#0d1526", borderRadius: 12, border: "1px solid #1e3a5f", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e3a5f" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.5 }}>⟳ PIPELINE DE PROSPECÇÃO</span>
              </div>
              <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {Object.entries(statusColors).map(([status, sc]) => {
                  const count = leads.filter(l => l.status === status).length;
                  return (
                    <div key={status} style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: sc.text, fontFamily: "'JetBrains Mono', monospace" }}>{count}</div>
                      <div style={{ fontSize: 11, color: sc.text, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{status}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* LEADS TABLE */}
        {activeTab === "leads" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Filters */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar empresa ou @instagram..."
                style={{ background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#e2e8f0", outline: "none", minWidth: 240 }} />
              <select value={filterEstado} onChange={e => { setFilterEstado(e.target.value); setFilterCidade("todas"); }}
                style={{ background: "#0d1526", border: `1px solid ${filterEstado !== "todos" ? "#0891b2" : "#1e3a5f"}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, color: filterEstado !== "todos" ? "#06b6d4" : "#94a3b8", outline: "none" }}>
                <option value="todos">Todos os estados</option>
                {Object.entries(estadosCidades).sort((a, b) => a[1].nome.localeCompare(b[1].nome)).map(([uf, { nome }]) => (
                  <option key={uf} value={uf}>{nome} ({uf})</option>
                ))}
              </select>
              <select value={filterCidade} onChange={e => setFilterCidade(e.target.value)} disabled={filterEstado === "todos"}
                style={{ background: "#0d1526", border: `1px solid ${filterCidade !== "todas" ? "#0891b2" : "#1e3a5f"}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, color: filterCidade !== "todas" ? "#06b6d4" : "#94a3b8", outline: "none", opacity: filterEstado === "todos" ? 0.5 : 1 }}>
                <option value="todas">{filterEstado === "todos" ? "Selecione o estado primeiro" : "Todas as cidades"}</option>
                {cidadesDoEstadoFiltro.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                style={{ background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 8, padding: "8px 14px", fontSize: 12, color: "#94a3b8", outline: "none" }}>
                <option value="todos">Todos os status</option>
                {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 8, padding: "8px 14px", fontSize: 12, color: "#94a3b8", outline: "none" }}>
                <option value="leadScore">Ordenar: Lead Score</option>
                <option value="engajamento">Ordenar: Engajamento</option>
                <option value="seguidores">Ordenar: Seguidores</option>
              </select>
              {(filterEstado !== "todos" || filterCidade !== "todas" || filterStatus !== "todos") && (
                <button onClick={() => { setFilterEstado("todos"); setFilterCidade("todas"); setFilterStatus("todos"); setSearchTerm(""); }}
                  style={{ fontSize: 11, color: "#ef4444", background: "#ef444422", border: "1px solid #ef444433", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontWeight: 600 }}>
                  ✕ Limpar filtros
                </button>
              )}
              <div style={{ marginLeft: "auto", fontSize: 12, color: "#475569" }}>{filteredLeads.length} leads encontrados</div>
            </div>

            {/* Table */}
            <div style={{ background: "#0d1526", borderRadius: 12, border: "1px solid #1e3a5f", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e3a5f" }}>
                    {["Empresa", "Instagram", "Cidade/Nicho", "Seguidores", "Engajamento", "Lead Score", "Status", "Ações"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", fontSize: 10, color: "#475569", fontWeight: 700, textAlign: "left", letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="lead-row" onClick={() => setSelectedLead(lead)} style={{ borderBottom: "1px solid #0d1a2e" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{lead.nome}</div>
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>☎ {lead.telefone}</div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 12, color: "#06b6d4", fontFamily: "'JetBrains Mono', monospace" }}>{lead.instagram}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>{lead.cidade}</div>
                        <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>
                          <span style={{ color: "#0891b2", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{lead.estado}</span> · {lead.categoria}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
                        {lead.seguidores.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <EngBadge eng={lead.engajamento} />
                      </td>
                      <td style={{ padding: "12px 16px", minWidth: 120 }}>
                        <ScoreBar score={lead.leadScore} size="sm" />
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: statusColors[lead.status]?.text, background: statusColors[lead.status]?.bg, border: `1px solid ${statusColors[lead.status]?.border}`, borderRadius: 4, padding: "3px 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => { setSelectedLead(lead); setActiveTab("ia"); }}
                            style={{ fontSize: 10, background: "#0d1a35", border: "1px solid #1e3a5f", borderRadius: 4, padding: "4px 8px", color: "#06b6d4", cursor: "pointer", fontWeight: 600 }}>IA</button>
                          <select defaultValue="" onChange={e => { if (e.target.value) updateStatus(lead.id, e.target.value); }}
                            style={{ fontSize: 10, background: "#0d1a35", border: "1px solid #1e3a5f", borderRadius: 4, padding: "4px 6px", color: "#94a3b8", cursor: "pointer" }}>
                            <option value="" disabled>Status</option>
                            {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MAPA */}
        {activeTab === "mapa" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
              <div>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>◉ MAPA DE OPORTUNIDADES — BRASIL</span>
                  <span style={{ fontSize: 11, color: "#475569" }}>Hover para detalhes</span>
                </div>
                <MiniMap />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 1, marginBottom: 4 }}>RANKING POR CIDADE</div>
                {cidades.sort((a, b) => b.leads - a.leads).map((c, i) => (
                  <div key={c.nome} style={{ background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: i === 0 ? "#f97316" : "#1e3a5f", fontFamily: "'JetBrains Mono', monospace" }}>#{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{c.nome}</div>
                      <div style={{ height: 4, background: "#1a2035", borderRadius: 999, marginTop: 4, overflow: "hidden" }}>
                        <div style={{ width: `${(c.leads / 312) * 100}%`, height: "100%", background: "#06b6d4", borderRadius: 999 }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#06b6d4", fontFamily: "'JetBrains Mono', monospace" }}>{c.leads}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANÁLISE */}
        {activeTab === "analise" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {nichos.map(n => (
                <div key={n.nome} style={{ background: "#0d1526", border: `1px solid ${n.cor}33`, borderRadius: 12, padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{n.nome}</div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Eng. médio: {n.engMedio}%</div>
                    </div>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: n.cor, boxShadow: `0 0 10px ${n.cor}` }} />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: n.cor, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>{n.leads}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>leads identificados</div>
                  <div style={{ height: 4, background: "#1a2035", borderRadius: 999, marginTop: 12, overflow: "hidden" }}>
                    <div style={{ width: `${(n.leads / 142) * 100}%`, height: "100%", background: n.cor }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11 }}>
                    <span style={{ color: "#475569" }}>Oportunidade:</span>
                    <span style={{ color: n.engMedio < 0.7 ? "#ef4444" : n.engMedio < 1.5 ? "#f97316" : "#eab308", fontWeight: 700 }}>
                      {n.engMedio < 0.7 ? "🔥 ALTÍSSIMA" : n.engMedio < 1.5 ? "⚡ ALTA" : "✦ MÉDIA"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Engajamento distribution */}
            <div style={{ background: "#0d1526", borderRadius: 12, border: "1px solid #1e3a5f", padding: "20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16, letterSpacing: 0.5 }}>DISTRIBUIÇÃO DE ENGAJAMENTO — TODOS OS LEADS</div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 80 }}>
                {["0-0.5%", "0.5-1%", "1-2%", "2-3%", "3%+"].map((range, i) => {
                  const counts = [3, 5, 2, 1, 1];
                  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4"];
                  return (
                    <div key={range} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: "100%", background: colors[i], borderRadius: "4px 4px 0 0", height: `${counts[i] * 14}px`, minHeight: 8, opacity: 0.85 }} />
                      <div style={{ fontSize: 9, color: "#475569", textAlign: "center" }}>{range}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* IA INSIGHTS */}
        {activeTab === "ia" && (
          <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
            {/* Lead selector */}
            <div style={{ background: "#0d1526", borderRadius: 12, border: "1px solid #1e3a5f", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e3a5f", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 1 }}>SELECIONAR PERFIL</div>
              <div style={{ maxHeight: 500, overflowY: "auto" }}>
                {leads.map(lead => (
                  <div key={lead.id} className="lead-row" onClick={() => setSelectedLead(lead)}
                    style={{ padding: "10px 14px", borderBottom: "1px solid #0d1a2e", background: selectedLead?.id === lead.id ? "#0d1a35" : "transparent", borderLeft: selectedLead?.id === lead.id ? "3px solid #06b6d4" : "3px solid transparent" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{lead.nome}</div>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{lead.instagram} · {lead.engajamento}% eng.</div>
                    <div style={{ marginTop: 6 }}><ScoreBar score={lead.leadScore} size="sm" /></div>
                  </div>
                ))}
              </div>
            </div>

            {selectedLead ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Profile header */}
                <div style={{ background: "linear-gradient(135deg, #0d1526, #111827)", borderRadius: 12, border: "1px solid #1e3a5f", padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9" }}>{selectedLead.nome}</div>
                      <div style={{ fontSize: 14, color: "#06b6d4", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{selectedLead.instagram}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{selectedLead.cidade} · {selectedLead.bairro} · {selectedLead.categoria}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>LEAD SCORE</div>
                      <div style={{ fontSize: 36, fontWeight: 800, color: selectedLead.leadScore >= 85 ? "#ef4444" : "#f97316", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{selectedLead.leadScore}</div>
                      <div style={{ fontSize: 10, color: "#475569" }}>/100</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
                    {[
                      { label: "Seguidores", val: selectedLead.seguidores.toLocaleString(), color: "#06b6d4" },
                      { label: "Engajamento", val: `${selectedLead.engajamento}%`, color: "#ef4444" },
                      { label: "Total Posts", val: selectedLead.posts, color: "#94a3b8" },
                      { label: "Dias sem postar", val: selectedLead.ultimoPost, color: selectedLead.ultimoPost > 30 ? "#ef4444" : "#eab308" },
                    ].map(m => (
                      <div key={m.label} style={{ background: "#060d1a", borderRadius: 8, padding: "10px 12px", border: "1px solid #1e3a5f" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.val}</div>
                        <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Flags */}
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {!selectedLead.cta && <span style={{ fontSize: 10, color: "#ef4444", background: "#ef444422", border: "1px solid #ef444444", borderRadius: 4, padding: "3px 8px", fontWeight: 600 }}>⚠ SEM CTA</span>}
                    {selectedLead.bio === "incompleta" && <span style={{ fontSize: 10, color: "#f97316", background: "#f9731622", border: "1px solid #f9731644", borderRadius: 4, padding: "3px 8px", fontWeight: 600 }}>⚠ BIO INCOMPLETA</span>}
                    {!selectedLead.reels && <span style={{ fontSize: 10, color: "#eab308", background: "#eab30822", border: "1px solid #eab30844", borderRadius: 4, padding: "3px 8px", fontWeight: 600 }}>⚠ SEM REELS</span>}
                    {selectedLead.ultimoPost > 30 && <span style={{ fontSize: 10, color: "#ef4444", background: "#ef444422", border: "1px solid #ef444444", borderRadius: 4, padding: "3px 8px", fontWeight: 600 }}>⚠ PERFIL INATIVO</span>}
                  </div>
                </div>

                {/* AI Insights */}
                <div style={{ background: "#0d1526", borderRadius: 12, border: "1px solid #7c3aed33", overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #7c3aed22", background: "#0d0f26", display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 14 }}>✦</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", letterSpacing: 0.5 }}>DIAGNÓSTICO DA IA</span>
                    <span style={{ fontSize: 10, color: "#475569", marginLeft: 4 }}>Análise automática do perfil</span>
                  </div>
                  <div style={{ padding: "16px" }}>
                    <AIInsightPanel lead={selectedLead} />
                  </div>
                </div>

                {/* Prospect message */}
                <ProspectMessage lead={selectedLead} />
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#0d1526", borderRadius: 12, border: "1px dashed #1e3a5f", height: 300 }}>
                <div style={{ textAlign: "center", color: "#475569" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>◈</div>
                  <div style={{ fontSize: 14 }}>Selecione um lead para ver o diagnóstico da IA</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AUTOMAÇÃO */}
        {activeTab === "automacao" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { icon: "💬", nome: "WhatsApp", status: "Ativo", enviados: 47, cor: "#22c55e" },
                { icon: "📷", nome: "Instagram DM", status: "Configurar", enviados: 0, cor: "#a855f7" },
                { icon: "📧", nome: "E-mail", status: "Ativo", enviados: 123, cor: "#06b6d4" },
              ].map(c => (
                <div key={c.nome} style={{ background: "#0d1526", border: `1px solid ${c.cor}33`, borderRadius: 12, padding: "20px" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>{c.nome}</div>
                  <div style={{ fontSize: 12, color: c.status === "Ativo" ? "#4ade80" : "#94a3b8", marginTop: 4, fontWeight: 600 }}>● {c.status}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: c.cor, fontFamily: "'JetBrains Mono', monospace", marginTop: 12 }}>{c.enviados}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>mensagens enviadas</div>
                  <button style={{ marginTop: 16, width: "100%", padding: "8px", background: c.cor + "22", border: `1px solid ${c.cor}44`, borderRadius: 6, color: c.cor, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    {c.status === "Ativo" ? "GERENCIAR" : "CONECTAR"}
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: "#0d1526", borderRadius: 12, border: "1px solid #1e3a5f", padding: "20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16, letterSpacing: 0.5 }}>⟳ FILA DE PROSPECÇÃO AUTOMÁTICA</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {leads.filter(l => l.status === "novo").slice(0, 5).map((lead, i) => (
                  <div key={lead.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: "#060d1a", borderRadius: 8, border: "1px solid #1e3a5f" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{lead.nome}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{lead.instagram} · Score: {lead.leadScore}</div>
                    </div>
                    <span style={{ fontSize: 10, color: "#475569" }}>{lead.telefone}</span>
                    <button onClick={() => showNotif(`✅ Mensagem enviada para ${lead.nome}!`)}
                      style={{ fontSize: 10, background: "#0d1a35", border: "1px solid #1e3a5f", borderRadius: 4, padding: "5px 10px", color: "#06b6d4", cursor: "pointer", fontWeight: 600 }}>
                      ENVIAR
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1e3a5f44", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#2d3f5e", fontFamily: "'JetBrains Mono', monospace" }}>LOCAL SOCIAL LEAD FINDER v1.0 · {new Date().toLocaleDateString("pt-BR")}</span>
        <div style={{ display: "flex", gap: 16 }}>
          {[{ label: "Leads analisados", val: "1.2K" }, { label: "Cidades", val: "6" }, { label: "Taxa conversão", val: `${((clientes / totalLeads) * 100).toFixed(0)}%` }].map(s => (
            <span key={s.label} style={{ fontSize: 10, color: "#2d3f5e", fontFamily: "'JetBrains Mono', monospace" }}>{s.label}: <span style={{ color: "#475569" }}>{s.val}</span></span>
          ))}
        </div>
      </footer>
    </div>
  );
}
