import { createContext, useContext, useState, type ReactNode } from "react";

interface IntroCtx {
  /** True once the boot loader has wiped away and the hero may animate in. */
  ready: boolean;
  markReady: () => void;
}

const Ctx = createContext<IntroCtx>({ ready: true, markReady: () => {} });

export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return <Ctx.Provider value={{ ready, markReady: () => setReady(true) }}>{children}</Ctx.Provider>;
}

export function useIntro(): IntroCtx {
  return useContext(Ctx);
}
