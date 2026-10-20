"use client";

// Adapted from shadcn/ui's reviewed new-york-v4 Switch registry source.
import * as React from "react";
import { cn } from "@/lib/utils";
import { Switch as SwitchPrimitive } from "radix-ui";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root data-slot="switch" className={cn("cs-switch", className)} {...props}>
      <SwitchPrimitive.Thumb data-slot="switch-thumb" className="cs-switch-thumb" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
