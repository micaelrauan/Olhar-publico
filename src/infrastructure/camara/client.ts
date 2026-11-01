import { z } from "zod";
import https from "node:https";
import { unstable_cache } from "next/cache";

export const CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2";

const deputy = z.object({
  id: z.number().int(),
  uri: z.url(),
  nome: z.string(),
  siglaPartido: z.string().nullish(),
  siglaUf: z.string().nullish(),
  urlFoto: z.string().nullish(),
});
const link = z.object({ rel: z.string(), href: z.string() });
const expense = z.object({
  ano: z.number().nullish(),
  dataDocumento: z.string().nullish(),
  tipoDespesa: z.string().nullish(),
  nomeFornecedor: z.string().nullish(),
  valorLiquido: z.number().nullish(),
  urlDocumento: z.string().nullish(),
  codDocumento: z.string().nullish(),
});
const history = z.object({
  dataHora: z.string().nullish(),
  descricaoStatus: z.string().nullish(),
  situacao: z.string().nullish(),
  siglaPartido: z.string().nullish(),
  siglaUf: z.string().nullish(),
});
const detail = z.object({
  id: z.number().int(),
  nomeCivil: z.string().nullish(),
  ultimoStatus: z.object({ nome: z.string().nullish(), siglaPartido: z.string().nullish(), siglaUf: z.string().nullish(), situacao: z.string().nullish() }).nullish(),
});

export class CamaraApiError extends Error {
  constructor(message: string, public readonly status?: number) { super(message); this.name = "CamaraApiError"; }
}

const cachedResponse = unstable_cache(async (url: string): Promise<unknown> => new Promise((resolve, reject) => {
  const request = https.get(url, { headers: { Accept: "application/json" }, timeout: 10000 }, (response) => {
    if (response.statusCode !== 200) {
      response.resume();
      reject(new CamaraApiError(`A API da Câmara respondeu ${response.statusCode}.`, response.statusCode));
      return;
    }
    const chunks: Buffer[] = [];
    let length = 0;
    response.on("data", (chunk: Buffer) => {
      length += chunk.length;
      if (length > 4_000_000) { request.destroy(new CamaraApiError("Resposta da Câmara excede o limite esperado.")); return; }
      chunks.push(chunk);
    });
    response.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); }
      catch { reject(new CamaraApiError("A API da Câmara retornou uma resposta inválida.")); }
    });
    response.on("error", reject);
  });
  request.on("timeout", () => request.destroy(new CamaraApiError("A API da Câmara demorou a responder.")));
  request.on("error", reject);
}), ["camara-api-v1"], { revalidate: 3600 });

async function get<T>(path: string, params: Record<string, string | number | undefined>, schema: z.ZodType<T>): Promise<{ data: T; links: z.infer<typeof link>[]; url: string }> {
  const url = new URL(`${CAMARA_API}${path}`);
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  let body: unknown;
  try { body = await cachedResponse(url.toString()); }
  catch (error) { if (error instanceof CamaraApiError) throw error; throw new CamaraApiError("A API da Câmara está temporariamente indisponível."); }
  const parsed = z.object({ dados: schema, links: z.array(link).optional() }).safeParse(body);
  if (!parsed.success) throw new CamaraApiError("O formato dos dados da Câmara mudou.");
  return { data: parsed.data.dados, links: parsed.data.links ?? [], url: url.toString() };
}

export async function listDeputies(filters: { q?: string; party?: string; state?: string; page?: number }) {
  const result = await get("/deputados", { nome: filters.q, siglaPartido: filters.party?.toUpperCase(), siglaUf: filters.state, pagina: filters.page ?? 1, itens: 20, ordenarPor: "nome", ordem: "ASC" }, z.array(deputy));
  return { deputies: result.data, hasNext: result.links.some((item) => item.rel === "next"), sourceUrl: result.url };
}

export async function getDeputy(id: number) { return get(`/deputados/${id}`, {}, detail); }
export async function getDeputyExpenses(id: number) { return get(`/deputados/${id}/despesas`, { itens: 50, pagina: 1, ordenarPor: "dataDocumento", ordem: "DESC" }, z.array(expense)); }
export async function getDeputyHistory(id: number) { return get(`/deputados/${id}/historico`, {}, z.array(history)); }
