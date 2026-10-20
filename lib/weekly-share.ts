import { lessons } from "./lessons";
import { displayDate, signedMoney } from "./presentation";
import type { HistoricalData } from "./historical-data";
import type { PortfolioWeek } from "./weekly-portfolio";
import { editionRange, weeklyEditorial } from "./weekly-editorial";
import { stoneAppearance } from "./stone-wall";
import { weatherPaths } from "./weekly-weather-art";

export const SHARE_WIDTH = 1080;
export const SHARE_HEIGHT = 1350;

export function wallSnapshot(completed: readonly string[]) {
  const rows = Math.ceil(lessons.length / 3);
  const slots = lessons.map((lesson,index) => {
    const course = Math.floor(index / 3);
    const peers = lessons.slice(course * 3, course * 3 + 3);
    const weights = peers.map(peer => stoneAppearance(peer.id).weight);
    const total = weights.reduce((sum,weight) => sum + weight,0);
    const inset = course % 2 ? 28 : 0;
    const available = 560 - inset - (peers.length - 1) * 6;
    const column = index % 3;
    return {id:lesson.id, ...stoneAppearance(lesson.id), laid:completed.includes(lesson.id),
      x:inset + weights.slice(0,column).reduce((sum,weight) => sum + weight / total * available + 6,0),
      y:course * 68, width:weights[column] / total * available, height:64};
  });
  return {slots,width:560,height:Math.max(64,rows * 68 - 4),count:slots.filter(slot => slot.laid).length,total:lessons.length};
}

// Default output deliberately contains no holding IDs, amounts, shares or cost basis.
export function weeklyShareModel(week: PortfolioWeek, history: HistoricalData, completed: readonly string[], includeAmounts = false, learningAsOf = new Date().toISOString().slice(0,10)) {
  return {
    ...weeklyEditorial(week.percent), edition:editionRange(week.startDate,week.endDate),
    asOf:displayDate(week.endDate), learningAsOf:displayDate(learningAsOf), source:history.mode === "sample" ? `Sample data - as of ${displayDate(week.endDate)}` : `Closing prices - as of ${displayDate(week.endDate)}`,
    wall:wallSnapshot(completed),
    ...(includeAmounts ? {amounts:{total:signedMoney(Number(week.change.toFixed(2))),
      driver:week.driver ? `${week.driver.ticker} ${signedMoney(Number(week.driver.contribution.toFixed(2)))}` : ""}} : {}),
  };
}
export type WeeklyShareModel = ReturnType<typeof weeklyShareModel>;

export function drawWeeklyShare(ctx: CanvasRenderingContext2D, model: WeeklyShareModel, fonts = {serif:"Georgia",sans:"Arial"}) {
  ctx.clearRect(0,0,SHARE_WIDTH,SHARE_HEIGHT);
  ctx.fillStyle = "#f6f8f4"; ctx.fillRect(0,0,SHARE_WIDTH,SHARE_HEIGHT);
  ctx.fillStyle = "#183d2d"; ctx.font = `52px ${fonts.serif}`;
  ctx.fillText("The Cornerstone Weekly",90,100,900);
  ctx.fillStyle = "#52614f"; ctx.font = `26px ${fonts.sans}`;
  ctx.fillText(model.edition,90,155,900); ctx.font = `23px ${fonts.sans}`; ctx.fillText(model.source,90,200,900);
  ctx.fillStyle = "#204b38"; ctx.fillRect(70,250,940,570);
  ctx.save(); ctx.translate(100,285); ctx.scale(1.3,1.3);
  ctx.strokeStyle = "#c8dac0"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
  for (const path of weatherPaths(model.weather)) {
    ctx.save(); if (path.offset) ctx.translate(...path.offset); ctx.stroke(new Path2D(path.d)); ctx.restore();
  }
  ctx.restore(); ctx.fillStyle = "#f5f7ed"; ctx.font = `76px ${fonts.serif}`;
  let line = "", y = 490;
  for (const word of model.headline.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > 820) { ctx.fillText(line,100,y,820); y += 90; line = word; }
    else line = candidate;
  }
  ctx.fillText(line,100,y,820);
  if (model.amounts) {
    ctx.font = `32px ${fonts.sans}`; ctx.fillText(`${model.amounts.total} this week`,100,735,820);
    ctx.font = `26px ${fonts.sans}`; ctx.fillText(model.amounts.driver,100,782,820);
  }
  const scale = Math.min(900 / model.wall.width,230 / model.wall.height);
  ctx.save(); ctx.translate((1080 - model.wall.width * scale) / 2,930); ctx.scale(scale,scale);
  for (const stone of model.wall.slots) {
    ctx.save(); ctx.translate(stone.x,stone.y); ctx.scale(stone.width / 100,1);
    const path = new Path2D(stone.path);
    ctx.fillStyle = stone.tint; ctx.strokeStyle = "#77876e"; ctx.lineWidth = 0.8;
    ctx.setLineDash(stone.laid ? [] : [2,2]);
    if (stone.laid) ctx.fill(path);
    ctx.stroke(path);
    if (stone.laid) {
      ctx.clip(path); ctx.strokeStyle = "#819179"; ctx.lineWidth = 0.3;
      for (let x = 8; x < 100; x += 19) for (let y = 8; y < 64; y += 17) { ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x + 5,y - 1); ctx.stroke(); }
    }
    ctx.restore();
  }
  ctx.restore(); ctx.fillStyle = "#52614f"; ctx.textAlign = "center"; ctx.font = `30px ${fonts.sans}`;
  ctx.fillText(`${model.wall.count} of ${model.wall.total} stones laid`,540,1220);
  ctx.font = `23px ${fonts.sans}`; ctx.fillText(`Learning as of ${model.learningAsOf}`,540,1270); ctx.textAlign = "start";
}
