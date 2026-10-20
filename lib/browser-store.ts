"use client";
import { useMemo, useSyncExternalStore } from "react";

export function createBrowserStore<T>(
  key: string,
  initial: T,
  decode: (raw: unknown) => T,
  migrate?: () => T,
) {
  const server = JSON.stringify(initial);
  let memory = server;
  let status: "saved" | "session" | "recovered" = "saved";
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((listener) => listener());
  function read() {
    if (typeof window === "undefined") return server;
    if (status === "session") return memory;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        if (memory === server && migrate) memory = JSON.stringify(migrate());
        return memory;
      }
      try {
        const normalized = JSON.stringify(decode(JSON.parse(raw)));
        memory = normalized;
        return normalized;
      } catch {
        status = "recovered";
        return memory;
      }
    } catch {
      status = "session";
      return memory;
    }
  }
  function update(change: (current: T) => T) {
    const value = decode(change(JSON.parse(read()) as T));
    memory = JSON.stringify(value);
    try {
      localStorage.setItem(key, memory);
      status = "saved";
    } catch {
      status = "session";
    }
    emit();
  }
  function subscribe(listener: () => void) {
    listeners.add(listener);
    const sync = (event: StorageEvent) => {
      if (event.key === key || event.key === null) {
        if (event.newValue === null) memory = server;
        listener();
      }
    };
    window.addEventListener("storage", sync);
    try {
      const probe = `${key}:check`;
      localStorage.setItem(probe, "1");
      localStorage.removeItem(probe);
    } catch {
      status = "session";
      listener();
    }
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", sync);
    };
  }
  function useStore() {
    const raw = useSyncExternalStore(subscribe, read, () => server);
    const persistence = useSyncExternalStore(
      subscribe,
      () => status,
      () => "saved" as const,
    );
    const value = useMemo(() => JSON.parse(raw) as T, [raw]);
    return { value, update, persistence };
  }
  return { useStore, update, read, reset: () => update(() => initial) };
}
