"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { HistoricalData } from "@/lib/historical-data";
import type { PortfolioWeek } from "@/lib/weekly-portfolio";
import { drawWeeklyShare, SHARE_HEIGHT, SHARE_WIDTH, weeklyShareModel, type WeeklyShareModel } from "@/lib/weekly-share";
import styles from "./weekly-story.module.css";

export function WeeklySharePreview({week,history,completed,learningAsOf}: {week:PortfolioWeek;history:HistoricalData;completed:readonly string[];learningAsOf:string}) {
  const [includeAmounts,setIncludeAmounts] = useState(false);
  const model = useMemo(() => weeklyShareModel(week,history,completed,includeAmounts,learningAsOf),[week,history,completed,includeAmounts,learningAsOf]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [rendered,setRendered] = useState<WeeklyShareModel | null>(null);
  const [nativeShare,setNativeShare] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const ready = rendered === model;

  useEffect(() => {
    let cancelled = false;
    async function renderImage() {
      try {
        await document.fonts?.ready;
        if (cancelled || !canvas.current) return;
        const ctx = canvas.current.getContext("2d");
        if (!ctx) throw new Error("canvas");
        const css = getComputedStyle(canvas.current);
        drawWeeklyShare(ctx,model,{serif:css.getPropertyValue("--font-serif").trim() || "Georgia",sans:css.getPropertyValue("--font-sans").trim() || "Arial"});
        setRendered(model); setError("");
        const file = new File([new Blob([], {type:"image/png"})],"cornerstone-week.png",{type:"image/png"});
        let canShare = false;
        try { canShare = typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare({files:[file]}); } catch {}
        setNativeShare(canShare);
      } catch { if (!cancelled) setError("We couldn’t create the image. Close and reopen the preview to try again."); }
    }
    void renderImage();
    return () => { cancelled = true; };
  }, [model]);

  async function exportImage(share: boolean) {
    if (!ready || !canvas.current || busy) return;
    setBusy(true); setError("");
    try {
      const blob = await new Promise<Blob>((resolve,reject) => canvas.current!.toBlob(blob => blob ? resolve(blob) : reject(new Error("image")),"image/png"));
      const filename = `cornerstone-week-${week.endDate}.png`;
      if (share) await navigator.share({files:[new File([blob],filename,{type:"image/png"})],title:"The Cornerstone Weekly"});
      else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a"); link.href = url; link.download = filename; link.click();
        setTimeout(() => URL.revokeObjectURL(url),1000);
      }
    } catch (cause) {
      if (!(cause instanceof DOMException && cause.name === "AbortError")) setError("The image wasn’t shared or saved. Please try again.");
    } finally { setBusy(false); }
  }

  return <div className={styles.sharePreview}>
    <canvas ref={canvas} width={SHARE_WIDTH} height={SHARE_HEIGHT} role="img"
      aria-label={`${model.edition}. ${model.source}. ${model.headline}. ${model.wall.count} of ${model.wall.total} stones laid. Learning as of ${model.learningAsOf}. ${includeAmounts ? `Dollar amounts included: ${model.amounts?.total}; ${model.amounts?.driver}.` : "Dollar amounts and holding tickers hidden."}`} />
    <label className={styles.privacy}><input type="checkbox" checked={includeAmounts} onChange={event => setIncludeAmounts(event.target.checked)} />Include dollar amounts</label>
    <small>When enabled, includes the main holding ticker.</small>
    <div className={styles.shareActions}>
      <button type="button" className="button lime" disabled={!ready || busy} onClick={() => void exportImage(false)}>Download image</button>
      {nativeShare && <button type="button" className="button secondary" disabled={!ready || busy} onClick={() => void exportImage(true)}>Web Share</button>}
    </div>
    {error && <p role="alert">{error}</p>}
  </div>;
}
