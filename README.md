# Praxis Legal Lab — Certificates

This repo issues and publishes Praxis Legal Lab completion certificates. It needs no
login system of its own — access is controlled entirely through GitHub collaborator
permissions on this repo.

## To issue a certificate (this is the entire process)

1. Go to the **Issues** tab → **New Issue** → **Certificate Request**.
2. Fill in the student's name, the deliverable/credential name, an optional program
   note, and the issue month (e.g. `2026-09`).
3. Submit the issue.
4. Within a minute or two, an automated comment appears on the issue with the
   certificate's verification link. Copy that link (or the "Add to LinkedIn" button
   on the page it opens) and send it to the student.

That's it — nothing else to configure, run, or maintain for day-to-day use.

## What happens behind the scenes

- The issue is parsed by `scripts/process-issue.js`, which appends a record to
  `data/certificates.json`. The certificate ID is built from the issue number
  (`PLL-<year>-<issue number>`), so IDs are always unique automatically.
- `scripts/build-site.js` regenerates a static verification page for every record
  into `docs/verify/`, using `templates/certificate-template.html` and computing
  that certificate's "Add to LinkedIn" link from LinkedIn's own
  `linkedin.com/profile/add` URL scheme.
- GitHub Pages serves the `docs/` folder, so the new page goes live automatically
  as part of the same automated commit.

## Who can issue certificates

Anyone added as a **Collaborator** on this repo (Settings → Collaborators) with at
least Write access. Remove someone's access there to revoke it — there are no
separate passwords or accounts to manage.

## One-time setup (only needed once, or if re-creating this repo)

1. Repo Settings → **Pages** → set source to the `docs/` folder on the `main` branch.
2. Add collaborators under Settings → **Collaborators**.
3. Confirm `assets/kevron-signature.png` is the current signature image. If a
   Director's signature is added later, drop it in as `assets/blankenship-signature.png`
   and reference it in `templates/certificate-template.html` the same way Kevron's
   is referenced.

## Files

| Path | Purpose |
|---|---|
| `.github/ISSUE_TEMPLATE/certificate-request.yml` | The issue form used to request a certificate |
| `.github/workflows/issue-certificate.yml` | The automation that runs on each request |
| `data/certificates.json` | The full record of every certificate issued |
| `scripts/process-issue.js` | Parses a submitted issue into a data record |
| `scripts/build-site.js` | Builds a verification page per record |
| `templates/certificate-template.html` | The certificate's visual design |
| `assets/` | Signature images and other static assets |
| `docs/verify/` | The generated, published verification pages (do not hand-edit) |
