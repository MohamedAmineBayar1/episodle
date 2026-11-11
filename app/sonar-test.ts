function demo(a: number) {
  const unused = 42;            // unused variable
  if (a == 1) { }               // empty block
  try { JSON.parse("{") } catch (e) { }   // empty catch
  return a;
}
const key = "AKIAIOSFODNN7EXAMPLE";   // secrets detection (AWS key pattern)