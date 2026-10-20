"use client";
import { boolean, enum as enumSchema, literal, object } from "zod";
import { createBrowserStore } from "./browser-store";

export const BUILDING_CAPACITY = 24;
export const BRICK_DROP_MS = 1300;
export const BUILDING_STORAGE_KEY = "cornerstone.building.v1";
export const buildingSkins = [
  { id: "campus", label: "Campus hall" },
  { id: "library", label: "Library" },
  { id: "skyscraper", label: "Skyscraper" },
] as const;
export type BuildingSkin = typeof buildingSkins[number]["id"];
const schema = object({ version: literal(1), skin: enumSchema(["campus", "library", "skyscraper"]), chosen: boolean() });
const defaultChoice = { version: 1 as const, skin: "campus" as BuildingSkin, chosen: false };
const store = createBrowserStore(BUILDING_STORAGE_KEY, defaultChoice, raw => schema.parse(raw));

export const laidBrickCount = (completed: readonly string[]) => Math.min(BUILDING_CAPACITY, new Set(completed).size);

export function useBuildingChoice() {
  const saved = store.useStore();
  return {
    choice: saved.persistence === "recovered" ? defaultChoice : saved.value,
    persistence: saved.persistence,
    choose: (skin: BuildingSkin) => store.update(() => ({ version: 1, skin, chosen: true })),
  };
}
