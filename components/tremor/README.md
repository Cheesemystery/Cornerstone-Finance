# Selected Tremor visualizations

`bar-list.tsx` adapts the official **Tremor Raw BarList v1.0.0**, reviewed on 2026-10-16:

- [Documentation and copyable source](https://www.tremor.so/docs/visualizations/barlist)
- [Upstream component](https://github.com/tremorlabs/tremor/tree/main/src/components/BarList)
- [Installation/compatibility](https://www.tremor.so/docs/getting-started/installation)
- [Upstream license](https://github.com/tremorlabs/tremor/blob/main/LICENSE), retained in full as [LICENSE](LICENSE)

Tremor Raw is source-distributed under Apache-2.0. The retained upstream file also includes third-party notices; retain it and the modification notice when redistributing this source. No commercial Blocks source was copied.

Official setup supports React 18.2+ and Tailwind 4+. Cornerstone uses React 19.2.8, Next 16.3.8 and Tailwind 4.3.3. This selected component only needs React, existing Next Link, and the shared `cn` helper already introduced with shadcn/ui. It adds no dependency, icon library or chart runtime. Do not install the older `@tremor/react` package or duplicate shared controls to extend this foundation.

## Local adaptations

- Retained the upstream memoized sorting, formatter, optional row actions and proportional bar approach. Required stable keys and explicit formatters; React 19 passes the ref as a prop.
- Financial contributions can be negative: **only decorative width** uses magnitude, with finite-value guards and zero-width zero values. Signed amounts remain unchanged. Both callers use `sortOrder="none"` to retain their existing financial ranking.
- Each semantic list row contains its complete name, company, signed dollar value and written direction. Magnitude bars are hidden from assistive technology and explained by a visible caption. Unknown values display Unavailable.
- Native buttons expose controlled `aria-pressed` selection in Portfolio. Recap uses full-row internal Next links. No nested link/button actions or new tab behavior.
- Scoped CSS replaces upstream blue utility classes with Cornerstone's green/paper and dark variants, wrapping company labels, mobile stacked rows and visible focus rings. No global theme replacement. Bars have no animation or transition, including under reduced motion.

Portfolio and Recap feed the component their existing derived contributions. This presentation component does not calculate returns, fetch prices, create records or fill missing history. Keep source, period and missing-data explanations in the page components. Existing practice-history graphics remain unchanged.

Future updates must review upstream source, license and dependency changes before copying code. Keep equivalent interactions in `components/ui/` rather than adding another control system.
