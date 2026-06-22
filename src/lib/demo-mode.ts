/**
 * Demo mode system: allows switching between 5 fully-realised personas
 * so every feature (chats, memories, skills, agents) has realistic data.
 *
 * Uses React context + localStorage (no extra dependencies).
 */

import { useState, useEffect, useCallback } from "react";
import { PERSONAS, type DemoPersona, getPersonaById } from "./demo-profiles";

const DEMO_KEY = "sage-demo-persona";

export function getStoredPersona(): string | null {
  try {
    return localStorage.getItem(DEMO_KEY);
  } catch {
    return null;
  }
}

export function setStoredPersona(id: string | null) {
  try {
    if (id) localStorage.setItem(DEMO_KEY, id);
    else localStorage.removeItem(DEMO_KEY);
  } catch {
    // ignore
  }
}

export function useDemoMode() {
  const [activePersonaId, setActivePersonaId] = useState<string | null>(getStoredPersona);
  const isDemoMode = activePersonaId !== null;
  const activePersona = activePersonaId ? getPersonaById(activePersonaId) : undefined;

  const setPersona = useCallback((id: string | null) => {
    setActivePersonaId(id);
    setStoredPersona(id);
  }, []);

  const exitDemo = useCallback(() => {
    setActivePersonaId(null);
    setStoredPersona(null);
  }, []);

  return { activePersonaId, isDemoMode, activePersona, setPersona, exitDemo };
}

export { PERSONAS, getPersonaById };
export type { DemoPersona };
