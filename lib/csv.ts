import { z } from "zod";
import type { Holding } from "./domain";

const rowSchema=z.object({symbol:z.string().trim().min(1).max(12),name:z.string().trim().min(1).max(160),quantity:z.coerce.number().nonnegative(),price:z.coerce.number().nonnegative(),previousClose:z.coerce.number().nonnegative().optional(),costBasis:z.coerce.number().nonnegative().optional(),sector:z.string().trim().max(80).default("Unclassified")});

function splitCsvLine(line:string){const cells:string[]=[];let current="";let quoted=false;for(let i=0;i<line.length;i++){const char=line[i];if(char==='"'&&line[i+1]==='"'){current+='"';i++;continue}if(char==='"'){quoted=!quoted;continue}if(char===','&&!quoted){cells.push(current.trim());current="";continue}current+=char}cells.push(current.trim());return cells}

export function parseHoldingsCsv(input:string):Holding[]{
  if(input.length>2_000_000)throw new Error("CSV is larger than 2 MB.");
  const lines=input.replace(/^\uFEFF/,"").split(/\r?\n/).filter(Boolean);if(lines.length<2)throw new Error("CSV must include a header and at least one holding.");if(lines.length>5001)throw new Error("CSV can contain at most 5,000 holdings.");
  const headers=splitCsvLine(lines[0]).map(h=>h.toLowerCase().replace(/[ _-]/g,""));
  const required=["symbol","name","quantity","price"];for(const name of required)if(!headers.includes(name))throw new Error(`Missing required column: ${name}`);
  return lines.slice(1).map((line,index)=>{const values=splitCsvLine(line);const raw=Object.fromEntries(headers.map((header,i)=>[header,values[i]??""]));const record={symbol:raw.symbol,name:raw.name,quantity:raw.quantity,price:raw.price,previousClose:raw.previousclose||undefined,costBasis:raw.costbasis||undefined,sector:raw.sector||undefined};const parsed=rowSchema.safeParse(record);if(!parsed.success)throw new Error(`Invalid holding on row ${index+2}.`);return {...parsed.data,symbol:parsed.data.symbol.toUpperCase(),previousClose:parsed.data.previousClose||parsed.data.price,sector:parsed.data.sector,assetClass:"equity" as const};});
}
