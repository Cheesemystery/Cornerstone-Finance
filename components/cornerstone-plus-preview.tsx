"use client";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { CornerstoneMark } from "./cornerstone-mark";
export function CornerstonePlusPreview() {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <section className="cornerstone-plus-preview">
        <div className="plus-preview-brand">
          <CornerstoneMark />
          <strong>
            Cornerstone<span>+</span>
          </strong>
          <small>In the works</small>
        </div>
        <h3>A little more perspective.</h3>
        <p>
          We’re exploring deeper research and richer personal recaps for a
          future plan.
        </p>
        <button
          className="demo-link"
          onClick={() => dialog.current?.showModal()}
        >
          See the concept <ArrowUpRight size={15} />
        </button>
      </section>
      <dialog
        aria-labelledby="plus-concept-title"
        ref={dialog}
        className="demo-dialog plus-concept-dialog"
      >
        <span className="badge">Future plan · concept preview</span>
        <h2 id="plus-concept-title">
          Cornerstone<span>+</span>
        </h2>
        <p>More room to explore, at your pace.</p>
        <ul>
          <li>Deeper research tools and context</li>
          <li>Richer portfolio recaps and visual themes</li>
          <li>More personalized guidance when AI is connected</li>
        </ul>
        <p className="muted small">
          These are ideas for a future plan. Pricing and availability are not
          set. There is nothing to purchase or sign up for here.
        </p>
        <button
          className="button primary"
          onClick={() => dialog.current?.close()}
        >
          Back to the guide
        </button>
      </dialog>
    </>
  );
}
