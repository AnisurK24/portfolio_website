# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters screening candidates and hiring engineers evaluating technical depth. Recruiters scan fast for role fit, years, stack, and a way to reach out. Hiring engineers look for proof: how problems were framed, what was shipped, and whether the craft of the site itself holds up.

## Product Purpose

Personal portfolio for Anisur Khan, a full-stack engineer (5+ years) specializing in SaaS integrations and AI tooling. Success is a visitor who understands his specialty within seconds and emails him or downloads the resume.

## Positioning

The integration layer between SaaS products (Salesforce, QuickBooks, HubSpot, USAePay, Quire, Regrid, Pendo, Mailgun) on React + Java/Spring services, plus hands-on Claude-based AI tooling. The site carries a live Claude chat grounded in his resume, which demonstrates the AI claim rather than asserting it.

## Capabilities and Constraints

- Next.js 15 App Router, React 19, TypeScript, Tailwind v4, hosted on Netlify. `/api/chat` is a server route (Anthropic SDK, Netlify Blobs rate limiting), so static export is not an option.
- Single long page with anchor navigation: home (hero), about, skills, stack, what I do, selected work, contact.
- Chat content grounding lives in `app/lib/context.ts` and must stay in sync with visible claims.

## Evidence on Hand

- `app/lib/context.ts`: the authoritative career record (CRETelligent Dec 2020 to Jun 2026, SWE I then II; Hi-Flier Apr 2020 to Jun 2021; App Academy; UC Davis B.S. Biology).
- `public/profile.jpg`: street-portrait photo, profile view, suit and glasses.
- `public/Anisur_Khan_Resume.pdf`.
- Public repo: github.com/AnisurK24/transcript-insights (71 tests).
- CRETelligent work is private: no screenshots, no client names beyond integrations listed.
- 2026 HubSpot integration contract work. Shown as "contract work" only: never name the agency or its clients.
- No testimonials, no metrics beyond those in context.ts. Do not invent any.

## Brand Commitments

- No phone number anywhere. Email is the only contact channel.
- Mentoring is peer and informal only; never describe formal mentorship or direct reports.
- Rails experience is from App Academy, never attributed to an employer.
- No em dashes in any copy.

## Product Principles

1. Prove, don't claim: every capability links to shipped work or a live demo.
2. Recruiter-fast: role, specialty, and contact are reachable from the first viewport.
3. Truth over polish: omit rather than inflate.
