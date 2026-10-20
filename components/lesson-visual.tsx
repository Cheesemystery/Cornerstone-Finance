import {
  Coffee,
  Store,
  ShoppingBasket,
  Globe2,
  ShieldCheck,
  FileSearch,
  ArrowDownRight,
} from "lucide-react";
import type { LessonActivity } from "@/lib/lesson-activities";

export function LessonVisual({ scene }: { scene: LessonActivity["scene"] }) {
  if (scene === "cafe")
    return (
      <div
        className="lesson-art cafe-art"
        role="img"
        aria-label="A fictional café divided into 100 shares. One highlighted square is 1% ownership."
      >
        <div className="cafe-sign">
          <Coffee size={32} />
          <strong>CAMPUS CAFÉ</strong>
          <span>Made-up café. Real idea.</span>
        </div>
        <div className="share-grid" aria-hidden="true">
          {Array.from({ length: 100 }, (_, i) => (
            <i key={i} className={i === 0 ? "owned" : ""} />
          ))}
        </div>
        <div className="art-caption">
          <span className="art-dot" /> 1 share out of 100 = 1% ownership
        </div>
      </div>
    );
  if (scene === "prices")
    return (
      <div
        className="lesson-art price-art"
        role="img"
        aria-label="Fictional share price: Monday 20 dollars, Friday 18 dollars, a 2 dollar decline."
      >
        <div>
          <span>MONDAY</span>
          <strong>$20</strong>
        </div>
        <svg viewBox="0 0 260 100" aria-hidden="true">
          <path
            d="M10 20L55 30L100 18L145 52L185 45L250 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="10" cy="20" r="6" />
          <circle cx="250" cy="80" r="6" />
        </svg>
        <div>
          <span>FRIDAY</span>
          <strong>$18</strong>
        </div>
        <p>
          <ArrowDownRight size={20} /> −$2 per share · cause unknown
        </p>
      </div>
    );
  if (scene === "baskets")
    return (
      <div className="lesson-art basket-art">
        <div>
          <Store size={34} />
          <strong>Café basket</strong>
          <span>☕ ☕ ☕ ☕</span>
          <small>One kind of business</small>
        </div>
        <span aria-hidden="true">+</span>
        <div>
          <ShoppingBasket size={34} />
          <strong>Broad basket</strong>
          <span>☕ ⚙ ♧ ⌂</span>
          <small>Different businesses</small>
        </div>
      </div>
    );
  if (scene === "earnings")
    return (
      <div className="lesson-art earnings-art">
        <div>
          <span>LAST TERM</span>
          <strong>$1,000</strong>
          <small>sales − $700 costs</small>
          <b>$300 profit</b>
        </div>
        <div>
          <span>THIS TERM</span>
          <strong>$1,200</strong>
          <small>sales − $1,000 costs</small>
          <b>What is left?</b>
        </div>
      </div>
    );
  if (scene === "fees")
    return (
      <div
        className="lesson-art fee-art"
        role="img"
        aria-label="An illustration of two growing balances, with the higher-fee balance growing less."
      >
        <div className="fee-columns" aria-hidden="true">
          {[24, 32, 41, 54, 68, 88].map((height, i) => (
            <div key={height}>
              <i style={{ height }} />
              <i style={{ height: height * (1 - i * 0.06) }} />
            </div>
          ))}
        </div>
        <p>Same assumed growth. Different costs.</p>
      </div>
    );
  return (
    <div className="lesson-art checklist-art">
      <div>
        <FileSearch size={34} />
        <strong>Understand</strong>
      </div>
      <span aria-hidden="true">→</span>
      <div>
        <ShieldCheck size={34} />
        <strong>Verify</strong>
      </div>
      <span aria-hidden="true">→</span>
      <div>
        <Globe2 size={34} />
        <strong>Find the fit</strong>
      </div>
    </div>
  );
}
