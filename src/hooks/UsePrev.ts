import { DependencyList, EffectCallback, useEffect, useState } from "react";
import { deepStrictEqual } from "assert";

export type PrevDepEffectCallback = <Args>({
  prevDeps,
}: { prevDeps: DependencyList } & Args) => void;

export const usePrev = (
  effect: PrevDepEffectCallback,
  deps: DependencyList
) => {
  const [prevDeps, setPrevDeps] = useState(deps);

  useEffect(() => {
    if (JSON.stringify(deps) === JSON.stringify(prevDeps)) {
      return;
    }
    setPrevDeps(deps);
    effect({ prevDeps });
  }, [deps, prevDeps, effect]);
};
