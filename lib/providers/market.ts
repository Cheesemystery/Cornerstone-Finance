import { env } from "@/lib/env";
import { sampleNews } from "@/lib/sample-data";

export interface MarketNewsItem { id: string; symbol: string; source: string; publishedAt: string; headline: string; url?: string; summary?: string; }
export interface MarketProvider { searchNews(symbol?: string): Promise<MarketNewsItem[]>; quote(symbol: string): Promise<{ symbol: string; price: number; previousClose: number; asOf: string } | null>; }

export class FinnhubProvider implements MarketProvider {
  async searchNews(symbol?: string) {
    if (!env.FINNHUB_API_KEY) return sampleNews.filter(n=>!symbol||n.symbol===symbol).map(n=>({id:n.id,symbol:n.symbol,source:n.source,publishedAt:new Date().toISOString(),headline:n.headline}));
    const end = new Date(); const start = new Date(end); start.setDate(start.getDate()-7);
    const path = symbol ? `/company-news?symbol=${encodeURIComponent(symbol)}&from=${start.toISOString().slice(0,10)}&to=${end.toISOString().slice(0,10)}` : "/news?category=general";
    const response = await fetch(`https://finnhub.io/api/v1${path}`, { headers: { "X-Finnhub-Token": env.FINNHUB_API_KEY }, next: { revalidate: 900 } });
    if (!response.ok) throw new Error(`Market news unavailable (${response.status})`);
    const items = await response.json() as Array<{id:number;related?:string;source:string;datetime:number;headline:string;url?:string;summary?:string}>;
    return items.slice(0,20).map(item=>({id:String(item.id),symbol:item.related||symbol||"MARKET",source:item.source,publishedAt:new Date(item.datetime*1000).toISOString(),headline:item.headline,url:item.url,summary:item.summary}));
  }
  async quote(symbol:string){
    if(!env.FINNHUB_API_KEY)return null;
    const response=await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}`,{headers:{"X-Finnhub-Token":env.FINNHUB_API_KEY},next:{revalidate:300}});
    if(!response.ok)return null;const q=await response.json() as {c:number;pc:number;t:number};
    return {symbol,price:q.c,previousClose:q.pc,asOf:new Date(q.t*1000).toISOString()};
  }
}

export const marketProvider: MarketProvider = new FinnhubProvider();
