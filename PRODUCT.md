# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters screening candidates and hiring engineers evaluating technical depth. Recruiters scan fast for role fit, years, stack, and a way to reach out. Hiring engineers look for proof: how problems were framed, what was shipped, and whether the craft of the site itself holds up.

## Product Purpose

Personal portfolio for Anisur Khan, a full-stack engineer (5+ years) targeting full-stack, product engineering, and AI engineering roles. Success is a visitor who understands what he builds within seconds and emails him or downloads the resume.

## Positioning

Full-stack product engineering on React, Node.js and Java/Spring (self-service sign-up and payments, team management, production integrations with Salesforce, QuickBooks, HubSpot and USAePay), plus hands-on Claude-based AI tooling. Integrations are proof of depth, not the headline. The site carries a live Claude chat grounded in his resume, which demonstrates the AI claim rather than asserting it.

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
- Current role: Senior Full Stack Software Engineer at Hive Strategy (March 2026 to present). Name the agency; never name its clients (schools or school networks).
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
