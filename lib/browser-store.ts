"use client";
import { useMemo, useSyncExternalStore } from "react";

export function createBrowserStore<T>(
  key: string,
  initial: T,
  decode: (raw: unknown) => T,
  migrate?: () => T,
  merge?: (known: T, incoming: T) => T,
  recover?: (raw: unknown, known: T) => T,
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
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
        const incoming = decode(parsed);
        const normalized = JSON.stringify(merge && listeners.size > 0 ? merge(JSON.parse(memory) as T, incoming) : incoming);
        memory = normalized;
        return normalized;
      } catch {
        status = "recovered";
        if (memory === server && migrate) {
          try { memory = JSON.stringify(decode(migrate())); } catch { /* Keep the last usable record. */ }
        }
        if (recover && parsed && typeof parsed === "object") {
          try { memory = JSON.stringify(decode(recover(parsed, JSON.parse(memory) as T))); } catch { /* Keep the last usable record. */ }
        }
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
        else if (merge) {
          try {
            memory = JSON.stringify(decode(merge(JSON.parse(memory) as T, decode(JSON.parse(event.newValue)))));
            if (status === "saved") {
              const latest = localStorage.getItem(key);
              if (latest !== null) {
                memory = JSON.stringify(decode(merge(JSON.parse(memory) as T, decode(JSON.parse(latest)))));
                if (latest !== memory) {
                  try { localStorage.setItem(key, memory); } catch { status = "session"; }
                }
              }
            }
          } catch { /* read() preserves usable memory and reports storage problems. */ }
        }
        listener();
      }
    };
    const progressSync=()=>{read();listener();};
    window.addEventListener("cornerstone-progress-sync",progressSync);
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
      window.removeEventListener("cornerstone-progress-sync",progressSync);
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
