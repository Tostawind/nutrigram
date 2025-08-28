declare module 'javascript-lp-solver' {
  interface SolveResult {
    feasible: boolean;
    bounded: boolean;
    result: number;
    [variable: string]: number | boolean;
  }

  interface Model {
    optimize: string;
    opType: 'min' | 'max';
    constraints: Record<string, { min?: number; max?: number; equal?: number }>;
    variables: Record<string, Record<string, number>>;
    ints?: Record<string, 1>;
  }

  export function Solve(model: Model): SolveResult;
  export default { Solve: Solve };
}
