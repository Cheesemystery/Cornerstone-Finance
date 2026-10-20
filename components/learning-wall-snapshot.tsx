import { wallSnapshot } from "@/lib/weekly-share";
import { displayDate, pluralize } from "@/lib/presentation";

export function LearningWallSnapshot({completed,asOf}: {completed:readonly string[];asOf?:string}) {
  const wall = wallSnapshot(completed);
  return <figure style={{width:"100%",maxWidth:560,margin:"24px auto"}}>
    <svg viewBox={`0 0 ${wall.width} ${wall.height}`} width="100%" role="img" aria-label={`Cumulative learning wall: ${wall.count} of ${wall.total} ${pluralize(wall.total, "stone")} laid`}>
      {wall.slots.map(stone => <g key={stone.id} transform={`translate(${stone.x} ${stone.y}) scale(${stone.width / 100} 1)`}>
        <path d={stone.path} fill={stone.laid ? stone.tint : "none"} stroke="#77876e" strokeWidth="1" strokeDasharray={stone.laid ? undefined : "3 3"} vectorEffect="non-scaling-stroke" />
      </g>)}
    </svg>
    <figcaption className="tabular-nums" style={{fontSize:13,textAlign:"center",marginTop:12}}>{wall.count} of {wall.total} {pluralize(wall.total, "stone")} laid{asOf && <><br />Learning as of {displayDate(asOf)}</>}</figcaption>
  </figure>;
}
