const fs = require('fs');
const path = require('path');

const body = process.env.ISSUE_BODY || '';
const issueNumber = process.env.ISSUE_NUMBER;

function extract(label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('### ' + escaped + '\\s*\\n\\n([\\s\\S]*?)(\\n### |$)');
  const m = body.match(re);
  if (!m) return '';
  let val = m[1].trim();
  if (val === '_No response_') val = '';
  return val;
}

const studentName = extract('Student name');
const deliverableName = extract('Deliverable / credential name');
const programNote = extract('Program note (optional)');
const issueMonth = extract('Issue month (YYYY-MM)');

if (!studentName || !deliverableName || !issueMonth) {
  console.error('Missing a required field (name, deliverable, or issue month) — aborting.');
  process.exit(1);
}

const year = (issueMonth.split('-')[0] || new Date().getFullYear());
const certId = `PLL-${year}-${String(issueNumber).padStart(4, '0')}`;

const dataPath = path.join(__dirname, '..', 'data', 'certificates.json');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

records.push({
  certId,
  studentName,
  deliverableName,
  programNote,
  issueDate: issueMonth,
  issueNumber: Number(issueNumber)
});

fs.writeFileSync(dataPath, JSON.stringify(records, null, 2) + '\n');
console.log('Added certificate', certId, 'for', studentName);
