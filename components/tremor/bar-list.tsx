"use client";

// Tremor BarList [v1.0.0], Apache-2.0. See LICENSE and README.md.
// Modified for Cornerstone: signed magnitudes, semantic rows, internal links,
// selection, React 19 refs and existing brand styles. No animation or new data.
import Link from "next/link";
import { useId, useMemo, type HTMLAttributes, type Ref } from "react";
import { cn } from "@/lib/utils";
import styles from "./bar-list.module.css";

type Bar = {
  key: string;
  name: string;
  description?: string;
  value: number;
  href?: string;
};
interface BarListProps extends HTMLAttributes<HTMLDivElement> {
  data: Bar[];
  valueFormatter: (value: number) => string;
  onValueChange?: (item: Bar) => void;
  selectedKey?: string | null;
  sortOrder?: "ascending" | "descending" | "none";
  tone?: "light" | "dark";
  ref?: Ref<HTMLDivElement>;
}

export function BarList({
  data,
  valueFormatter,
  onValueChange,
  selectedKey,
  sortOrder = "descending",
  tone = "light",
  className,
  "aria-label": label = "Price contributions",
  ...props
}: BarListProps) {
  const captionId = useId();
  const sortedData = useMemo(() => sortOrder === "none" ? data : [...data].sort((a, b) =>
    sortOrder === "ascending" ? a.value - b.value : b.value - a.value,
  ), [data, sortOrder]);
  const widths = useMemo(() => {
    // Price contributions can be negative. Keep the original signed values;
    // only the decorative bar's length uses magnitude.
    const magnitudes = sortedData.map(item => Number.isFinite(item.value) ? Math.abs(item.value) : 0);
    const maxValue = Math.max(...magnitudes, 0);
    return magnitudes.map(value => value === 0 ? 0 : Math.max((value / maxValue) * 100, 2));
  }, [sortedData]);

  return (
    <div data-tremor-id="tremor-raw" className={cn(styles.list, tone === "dark" && styles.dark, className)} {...props}>
      <ul role="list" aria-label={label} aria-describedby={captionId}>
        {sortedData.map((item, index) => {
          const finite = Number.isFinite(item.value);
          const direction = !finite || item.value === 0 ? "flat" : item.value < 0 ? "negative" : "positive";
          const contents = <>
            <span className={styles.bar} data-direction={direction} aria-hidden="true" style={{ width: `${widths[index]}%` }} />
            <span className={styles.label}><strong>{item.name}</strong>{item.description && <small>{item.description}</small>}</span>
            <span className={styles.amount} data-direction={direction}>
              <strong>{finite ? valueFormatter(item.value) : "Unavailable"}</strong>
              <small>{!finite ? "No valid price contribution" : item.value < 0 ? "Negative contribution" : item.value > 0 ? "Positive contribution" : "No price change"}</small>
            </span>
          </>;
          return <li key={item.key}>
            {onValueChange ? (
              <button type="button" className={styles.row} aria-pressed={selectedKey === undefined ? undefined : selectedKey === item.key} onClick={() => onValueChange(item)}>{contents}</button>
            ) : item.href ? (
              <Link href={item.href} className={styles.row}>{contents}</Link>
            ) : <div className={styles.row}>{contents}</div>}
          </li>;
        })}
      </ul>
      <p id={captionId} className={styles.caption}>Bar length shows the size of each price contribution. Signed amounts show gains and losses.</p>
    </div>
  );
}
