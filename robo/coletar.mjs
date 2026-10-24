// Robô de coleta: lê o resultado de presidente (Brasil) no TSE e guarda o histórico em dados/historico-<eleicao>.json.
// Roda no GitHub Actions a cada 5 minutos (veja .github/workflows/coletar.yml). Sem dependências: precisa só do Node 20.
// Variáveis opcionais: ELEICOES (padrão "6258"), BASE (para testes), JANELA_INICIO / JANELA_FIM (ISO), FORCAR=1.
import { readFile, writeFile, mkdir } from "node:fs/promises";

const BASE = process.env.BASE || "https://resultados.tse.jus.br/oficial/ele2026";
const ELEICOES = (process.env.ELEICOES || "6258").split(",").map((s) => s.trim()).filter(Boolean);
const INICIO = Date.parse(process.env.JANELA_INICIO || "2026-10-25T19:30:00Z");   // 16h30 de Brasília
const FIM = Date.parse(process.env.JANELA_FIM || "2026-10-28T03:00:00Z");
const MAX_PONTOS = 3000;

const agora = Date.now();
if (!process.env.FORCAR && (agora < INICIO || agora > FIM)) { console.log("Fora da janela de apuração; nada a fazer."); process.exit(0); }

const num = (x) => { const t = String(x ?? ""); const n = t.includes(",") ? parseFloat(t.replace(/\./g, "").replace(",", ".")) : parseFloat(t); return Number.isNaN(n) ? 0 : n; };
function candidatos(o, saida = []) {
  if (!o || typeof o !== "object") return saida;
  if (Array.isArray(o)) { o.forEach((x) => candidatos(x, saida)); return saida; }
  if (o.vap !== undefined && o.sqcand !== undefined) { saida.push(o); return saida; }
  Object.values(o).forEach((v) => candidatos(v, saida));
  return saida;
}
function tempo(d) {                                                       // data/hora de geração, horário de Brasília (UTC-3)
  const m = String(d.dg || "").match(/(\d{2})\/(\d{2})\/(\d{4})/), n = String(d.hg || "").match(/(\d{2}):(\d{2}):(\d{2})/);
  return m && n ? Date.UTC(+m[3], +m[2] - 1, +m[1], +n[1] + 3, +n[2], +n[3]) : Date.now();
}
const soma = (v) => (v || []).reduce((a, x) => a + (x || 0), 0);

await mkdir("dados", { recursive: true });
let mudou = false;
for (const ele of ELEICOES) {
  const url = `${BASE}/${ele}/dados/br/br-c0001-e${String(ele).padStart(6, "0")}-u.json`;
  let d;
  try {
    const r = await fetch(url, { headers: { "user-agent": "apuracao-2026-coletor (github actions)", "cache-control": "no-cache" } });
    if (r.status !== 200) { console.log(ele, "status", r.status); continue; }
    d = await r.json();
  } catch (e) { console.log(ele, "falha", String(e)); continue; }
  const cs = candidatos(d), votos = cs.map((c) => num(c.vap));
  if (!(soma(votos) > 0)) { console.log(ele, "ainda sem votos"); continue; }
  const arq = `dados/historico-${ele}.json`;
  let h; try { h = JSON.parse(await readFile(arq, "utf8")); } catch { h = { v: 1, eleicao: ele, nomes: [], pts: [] }; }
  cs.forEach((c) => { const n = c.nmu || c.nm; if (!h.nomes.includes(n)) h.nomes.push(n); });
  const b = h.nomes.map((n) => { const c = cs.find((x) => (x.nmu || x.nm) === n); return c ? num(c.vap) : 0; });
  const ult = h.pts[h.pts.length - 1];
  if (ult && ult[3] && soma(ult[3]) === soma(b)) { console.log(ele, "sem mudança"); continue; }
  let t = tempo(d); if (ult && t <= ult[0]) t = ult[0] + 1;
  h.pts.push([t, num(d.s && d.s.pst), null, b, null, null]);
  if (h.pts.length > MAX_PONTOS) h.pts = h.pts.slice(-MAX_PONTOS);
  h.atualizado_em = new Date().toISOString();
  await writeFile(arq, JSON.stringify(h));
  console.log(ele, "ponto gravado:", h.pts.length, "pontos");
  mudou = true;
}
console.log(mudou ? "Houve mudança." : "Nada novo.");
