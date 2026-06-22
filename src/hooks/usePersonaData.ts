import { useMemo } from "react";
import { useDemoMode } from "@/lib/demo-mode";
import type { DemoPersona } from "@/lib/demo-profiles";

interface PersonaData {
  persona: DemoPersona | undefined;
  threads: DemoPersona["threads"];
  memories: DemoPersona["memories"];
  skills: DemoPersona["skills"];
  agents: DemoPersona["agents"];
  profile: DemoPersona["profile"] | undefined;
}

export function usePersonaData(): PersonaData {
  const { activePersona } = useDemoMode();

  return useMemo(
    () => ({
      persona: activePersona,
      threads: activePersona?.threads ?? [],
      memories: activePersona?.memories ?? [],
      skills: activePersona?.skills ?? [],
      agents: activePersona?.agents ?? [],
      profile: activePersona?.profile,
    }),
    [activePersona]
  );
}
