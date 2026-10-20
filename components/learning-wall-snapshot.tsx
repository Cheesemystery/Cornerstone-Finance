import { wallSnapshot } from "@/lib/weekly-share";
import { displayDate } from "@/lib/presentation";

export function LearningWallSnapshot({completed,asOf}: {completed:readonly string[];asOf?:string}) {
  const wall = wallSnapshot(completed);
  return <figure style={{width:"100%",maxWidth:560,margin:"24px auto"}}>
    <svg viewBox={`0 0 ${wall.width} ${wall.height}`} width="100%" role="img" aria-label={`Cumulative learning wall: ${wall.count} of ${wall.total} stones laid`}>
      {wall.slots.map(stone => <g key={stone.id} transform={`translate(${stone.x} ${stone.y}) scale(${stone.width / 100} 1)`}>
        <path d={stone.path} fill={stone.laid ? stone.tint : "none"} stroke="#77876e" strokeWidth="1" strokeDasharray={stone.laid ? undefined : "3 3"} vectorEffect="non-scaling-stroke" />
      </g>)}
    </svg>
    <figcaption style={{fontSize:13,textAlign:"center",marginTop:12,fontVariantNumeric:"tabular-nums"}}>{wall.count} of {wall.total} stones laid{asOf && <><br />Learning as of {displayDate(asOf)}</>}</figcaption>
  </figure>;
}
