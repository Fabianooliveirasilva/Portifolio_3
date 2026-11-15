const pairs = [
  ['ink on bg', '#F3E8E4', '#2B0A16', 4.5],
  ['ink on surface', '#F3E8E4', '#3A1220', 4.5],
  ['ink-muted on bg', '#C9AEB3', '#2B0A16', 4.5],
  ['ink-muted on surface', '#C9AEB3', '#3A1220', 4.5],
  ['accent on bg', '#F2B6C3', '#2B0A16', 4.5],
  ['accent on surface', '#F2B6C3', '#3A1220', 4.5],
  ['accent-ink on accent (button)', '#2B0A16', '#F2B6C3', 4.5],
  ['ok on bg', '#86C596', '#2B0A16', 4.5],
  ['line-strong on bg (UI)', '#A07E88', '#2B0A16', 3],
  ['line-strong on surface (UI)', '#A07E88', '#3A1220', 3],
];
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = c.map((v) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
let fail = false;
for (const [name, fg, bg, min] of pairs) {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  const ratio = (a + 0.05) / (b + 0.05);
  const ok = ratio >= min;
  if (!ok) fail = true;
  console.log(
    `${ok ? 'ok  ' : 'FAIL'} ${ratio.toFixed(2)} (min ${min}) ${name}`,
  );
}
process.exit(fail ? 1 : 0);
