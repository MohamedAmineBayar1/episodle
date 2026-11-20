import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'reports';
const SEV = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'];
const rank = (s) => { const i = SEV.indexOf(String(s).toUpperCase()); return i < 0 ? 9 : i; };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function find(name, dir = ROOT) {
  if (!fs.existsSync(dir)) return null;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { const r = find(name, p); if (r) return r; }
    else if (e.name === name) return p;
  }
  return null;
}
function load(name) {
  const p = find(name);
  if (!p) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

const sections = [];
const add = (title, data, head, rows, note = '') =>
  sections.push({ title, missing: data === null, head, rows, note });

// Gitleaks
const gl = load('gitleaks-report.json');
add('Secrets (Gitleaks)', gl, ['Rule', 'File', 'Line'],
  (gl || []).map((f) => [f.RuleID, f.File, f.StartLine]));

// Semgrep
const sg = load('semgrep-report.json');
add('SAST (Semgrep)', sg, ['Severity', 'Rule', 'Location', 'Message'],
  (sg?.results || []).map((r) => [r.extra?.severity, r.check_id, `${r.path}:${r.start?.line}`, (r.extra?.message || '').slice(0, 140)])
    .sort((a, b) => rank(a[0]) - rank(b[0])));

// Trivy vulnerabilities (dependencies and image)
const vulnRows = (d) => (d?.Results || []).flatMap((r) =>
  (r.Vulnerabilities || []).map((v) => [v.Severity, v.VulnerabilityID, `${v.PkgName}@${v.InstalledVersion}`, v.FixedVersion || 'no fix', r.Target]))
  .sort((a, b) => rank(a[0]) - rank(b[0]));
const tdeps = load('trivy-deps.json');
add('Dependencies (Trivy)', tdeps, ['Severity', 'CVE', 'Package', 'Fixed in', 'Target'], vulnRows(tdeps));
const timg = load('trivy-image.json');
add('Docker image (Trivy)', timg, ['Severity', 'CVE', 'Package', 'Fixed in', 'Target'], vulnRows(timg));

// Trivy IaC
const iac = load('trivy-iac.json');
add('IaC / Dockerfile (Trivy)', iac, ['Severity', 'ID', 'Target', 'Title'],
  (iac?.Results || []).flatMap((r) => (r.Misconfigurations || []).filter((m) => m.Status !== 'PASS')
    .map((m) => [m.Severity, m.ID, r.Target, m.Title])).sort((a, b) => rank(a[0]) - rank(b[0])));

// npm audit
const npm = load('npm-audit.json');
add('npm audit', npm, ['Severity', 'Package', 'Fix available'],
  Object.values(npm?.vulnerabilities || {}).map((v) => [v.severity, v.name, typeof v.fixAvailable === 'object' ? 'yes (' + v.fixAvailable.name + ')' : String(v.fixAvailable)])
    .sort((a, b) => rank(a[0]) - rank(b[0])));

// ZAP
const zap = load('report_json.json');
add('DAST (OWASP ZAP)', zap, ['Risk', 'Alert', 'Instances'],
  (zap?.site || []).flatMap((s) => (s.alerts || []).map((a) => [a.riskdesc, a.name, a.count ?? (a.instances || []).length]))
    .sort((a, b) => String(b[0]).localeCompare(String(a[0]))));

// SBOM
const sbom = load('sbom.cdx.json');
add('SBOM (CycloneDX)', sbom, ['Info'], [], sbom ? `${(sbom.components || []).length} components listed` : '');

const status = (s) => (s.missing ? 'no report' : s.rows.length ? `${s.rows.length} finding(s)` : 'clean');
const MAX = 50;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>DevSecOps report</title>
<style>
body{font-family:system-ui,sans-serif;margin:2rem;color:#1a1a1a}
table{border-collapse:collapse;width:100%;margin:.5rem 0 2rem;font-size:14px}
th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;vertical-align:top}
th{background:#f3f3f3}.clean{color:#0a7d2c}.bad{color:#b00020}.na{color:#777}
</style></head><body>
<h1>DevSecOps pipeline report</h1>
<p>Commit <code>${esc(process.env.GITHUB_SHA)}</code> &middot; run ${esc(process.env.GITHUB_RUN_ID)} &middot; ${new Date().toISOString()}</p>
<h2>Summary</h2>
<table><tr><th>Control</th><th>Result</th></tr>
${sections.map((s) => `<tr><td>${esc(s.title)}</td><td class="${s.missing ? 'na' : s.rows.length ? 'bad' : 'clean'}">${status(s)}</td></tr>`).join('')}
</table>
${sections.map((s) => `<h2>${esc(s.title)}</h2>
${s.missing ? '<p class="na">No report found.</p>' : s.note ? `<p>${esc(s.note)}</p>` : s.rows.length === 0 ? '<p class="clean">No findings.</p>' :
`<table><tr>${s.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>
${s.rows.slice(0, MAX).map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>
${s.rows.length > MAX ? `<p>Showing ${MAX} of ${s.rows.length}. See the raw JSON for the full list.</p>` : ''}`}`).join('\n')}
</body></html>`;

fs.mkdirSync('security-report', { recursive: true });
fs.writeFileSync('security-report/index.html', html);

const md = ['## DevSecOps report', '', '| Control | Result |', '|---|---|',
  ...sections.map((s) => `| ${s.title} | ${status(s)} |`)].join('\n');
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');
console.log(md);