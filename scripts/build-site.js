const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || '';
const dataPath = path.join(__dirname, '..', 'data', 'certificates.json');
const templatePath = path.join(__dirname, '..', 'templates', 'certificate-template.html');
const outDir = path.join(__dirname, '..', 'docs', 'verify');

const records = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

fs.mkdirSync(outDir, { recursive: true });

const MONTHS = ['January','February','March','April','May','June','July','August',
                'September','October','November','December'];

function monthLabel(ym) {
  const [y, m] = String(ym || '').split('-');
  const name = MONTHS[parseInt(m, 10) - 1] || '';
  return `${name} ${y || ''}`.trim();
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

for (const rec of records) {
  const verifyUrl = `${SITE_URL}/verify/${rec.certId}.html`;
  const [y, m] = String(rec.issueDate || '').split('-');

  const li = new URLSearchParams();
  li.set('startTask', 'CERTIFICATION_NAME');
  li.set('name', rec.deliverableName);
  li.set('organizationName', 'Praxis Legal Lab');
  if (y) li.set('issueYear', y);
  if (m) li.set('issueMonth', String(parseInt(m, 10)));
  li.set('certUrl', verifyUrl);
  li.set('certId', rec.certId);
  const linkedInUrl = 'https://www.linkedin.com/profile/add?' + li.toString();

  const html = template
    .split('{{STUDENT_NAME}}').join(escapeHtml(rec.studentName))
    .split('{{DELIVERABLE_NAME}}').join(escapeHtml(rec.deliverableName))
    .split('{{PROGRAM_NOTE}}').join(escapeHtml(rec.programNote || ''))
    .split('{{ISSUE_MONTH_LABEL}}').join(escapeHtml(monthLabel(rec.issueDate)))
    .split('{{CERT_ID}}').join(escapeHtml(rec.certId))
    .split('{{LINKEDIN_URL}}').join(linkedInUrl);

  fs.writeFileSync(path.join(outDir, `${rec.certId}.html`), html);
}

console.log(`Built ${records.length} certificate page(s).`);
