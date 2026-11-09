const OPS = new Map<string, (a: number, b: number) => number>([
  ["add", (a, b) => a + b],
  ["mul", (a, b) => a * b],
]);

export function run(op: string, a: number, b: number) {
  const fn = OPS.get(op);
  if (!fn) throw new Error("Unsupported operation");
  return fn(a, b);
}
