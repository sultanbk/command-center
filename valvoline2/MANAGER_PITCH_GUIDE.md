# Valvoline ServiceNow Managed Services Command Center
## Manager Pitch and Demo Guide

Use this guide to prepare and present the proposal demo. It gives you a speaking path, explains the sample measures, and provides honest answers to common questions. The records and values in the website are synthetic examples; they are not Valvoline service data or confirmed delivery commitments.

---

## 1. The proposal in one minute

> “This command center demonstrates how Prodapt could manage a 90-day ServiceNow transition for Valvoline and continue into ongoing operations and service improvement. It connects the transition plan, knowledge transfer, operational health, and enhancement traceability in one interactive workspace. The current records are synthetic examples. The purpose is to show the proposed operating model and discuss the scope, measures, roles, and acceptance criteria we would validate together.”

### The story

**Transition → Knowledge handoff → Operations → Improvement**

- **Transition:** Plan the 90-day handoff, assign owners, track risks, and review readiness.
- **Knowledge handoff:** Track KT sessions, questions, documents, and approval evidence.
- **Operations:** Review service availability, incidents, recurring problems, and SLA trends.
- **Improvement:** Trace a sample enhancement through affected components and test evidence.
- **Synapt AI:** Demonstrate how local sample knowledge can be organized and queried. It is a deterministic simulation, not a live AI service.

### The decision to request

Ask the team to confirm or nominate owners for:

1. Service scope and exclusions.
2. Transition start date, incumbent overlap, and governance participants.
3. KPI definitions, source systems, eligible populations, and reporting periods.
4. Day 30, Day 60, and Day 90 acceptance criteria and decision-makers.
5. Which integrations and knowledge repositories should be considered in a future implementation.

---

## 2. Five-minute guided tour script

The on-screen demo tour follows seven stops. Use the **SHOW** cue to guide the audience’s attention, then deliver the short talk track. Avoid reading every detail on the screen.

### Stop 1 — Executive Overview: start with readiness

**Show:** Transition completion, Day 90 countdown, KT, documents, access readiness, and open risks.

> “This is the leadership view of transition progress and readiness gaps. The measures are calculated from sample task, KT, document, and risk records. In a real transition, we would agree the baseline, dates, data owners, and KPI definitions before using this view for decisions.”

**Know what the cards mean:** Completion is completed tasks divided by seeded tasks. The countdown uses a fixed scenario date and target. KT and document cards count seeded records and local demo edits. Access readiness is completed tasks within the Platform & Access workstream. The risk count excludes risks marked Complete or Approved.

### Stop 2 — Day -1 to Day 90 Plan: make the work actionable

**Show:** The four phases, one task’s owner and deliverable, and its acceptance statement.

> “The plan organizes mobilization, onboarding, knowledge transfer, and operational acceptance into four phases. Each task has an owner and evidence expectation, so governance can review progress at the phase gates.”

**Important:** The task sequence and predecessor references are illustrative, not a validated critical path. The dates are relative to Day 0. Confirm sequencing, calendar dates, dependencies, capacity, owners, and exit criteria with Valvoline and the incumbent team before presenting this as a delivery baseline. Phase checklists are separate from task completion.

### Stop 3 — KT and Deliverables: show evidence and follow-up

**Show:** One KT session, its linked document, and an open knowledge action. If useful, compare received and approved document counts.

> “This view tracks sessions, unanswered questions, and document receipt and approval together. That makes knowledge gaps visible and gives them owners. A session marked complete does not by itself prove that knowledge transferred; we would validate understanding through walkthroughs, shadowing, reverse KT, and agreed acceptance criteria.”

**Seeded reference values:** 18 sessions; initially 7 complete, 5 in progress, and 6 planned. The document register has 26 artifacts; initially 19 received and 14 approved. Local demo edits may change these values.

### Stop 4 — Knowledge Ingestion: connect artifacts to the work

**Show:** A document’s type, source ID, update date, and related record. The Run Demo Ingestion button animates sample progress.

> “The workspace illustrates how transition artifacts could be organized and connected to records. In this demo, ingestion is simulated; no SharePoint repository or AI extraction service is connected.”

### Stop 5 — Transition Assistant: make sample knowledge findable

**Show:** Select the suggested question “What are the pending KT actions?” and open a cited source.

> “The assistant gives deterministic answers from the local dataset and links to sample source records. The point is to demonstrate a traceable knowledge experience. It is not connected to a live LLM, ServiceNow, or an external repository.”

### Stop 6 — Service Health: connect transition to operations

**Show:** Availability, active incident activity, problem clusters, and the SLA trend.

> “This view illustrates how the handoff could lead into service reviews with availability, incident, problem, and SLA signals in one place. The displayed values are synthetic examples, not actual Valvoline performance.”

**Seeded reference values:** The availability example uses 43,165 available minutes out of 43,200 scheduled minutes for a 30-day period, or 99.92%. The incident sample has 50 records across May–October 2026; 3 are marked in progress in the seeded state. October’s SLA example is 554 of 563 targets met, or 98.4%, with 9 breaches.

**Important:** The service pulse is a simple demo rule. It labels risk Elevated and customer impact High when an open P1 exists. It is not a validated business-impact assessment. The availability value is separate from the incident records.

### Stop 7 — Impact Analysis: close with controlled improvement

**Show:** The employee onboarding manager-approval request, its dependency graph, and related test evidence.

> “The final step connects an operational improvement idea to affected components and test evidence. The sample recommendation is simulated. A real change would require impact validation, approval, development controls, testing, and release readiness.”

### Close the tour

> “The proposal is a connected operating model: govern the transition, capture and validate knowledge, use it to support operations, and feed service learning into controlled improvements. The next step is to confirm scope, ownership, data sources, and acceptance gates so the model can be grounded in the actual environment.”

---

## 3. Transition pages and how to explain them

### Governance Calendar

The sample defines five forums: a daily transition stand-up, daily KT coordination during active KT, weekly transition governance, biweekly executive steering, and phase readiness reviews. Selecting a card shows participants, agenda, expected output, actions, and escalation. The meeting register can be exported; it does not create real calendar invitations.

> “The calendar proposes an operating rhythm for day-to-day blockers, weekly decisions, sponsor escalations, and phase acceptance. The participants and cadence need to be agreed with the teams.”

### RACI

Ten sample activities are mapped across Valvoline, the incumbent vendor, the Prodapt Transition Lead, the Prodapt Service Delivery Manager, and Prodapt Technical SMEs.

- **R — Responsible:** Performs the work.
- **A — Accountable:** Owns the outcome or final decision.
- **C — Consulted:** Provides input.
- **I — Informed:** Kept up to date.

> “The matrix is a starting point for confirming who performs the work and who has final accountability. These assignments are proposed examples, not agreed decision rights.”

### Risks and Escalations

The risk register includes severity, impact, owner, due date, mitigation, status, and a linked transition task. Status changes in demo mode update the open-risk count. The example escalation path is workstream owner → Transition Lead within 24 hours → weekly governance → executive steering.

> “The register demonstrates how a risk can be assigned, mitigated, and escalated. The actual thresholds and escalation service levels must be agreed with Valvoline.”

The overdue calculation uses a fixed scenario date (October 25, 2026), not today’s live date.

### Team and Readiness

Role cards use role placeholders and sample capacity/onboarding values; they do not identify confirmed people or staffing commitments. The readiness bars calculate the share of tasks marked Complete within each workstream. They do not assess individual skill, prove resource availability, or independently accept evidence.

> “This page outlines the role coverage and workstream progress we would use to manage readiness. Named staffing and evidence-based acceptance would be validated with the team.”

**Presenter note:** The current workstream card caption says “evidence items accepted,” while its calculation counts completed tasks. Explain it as a completed-task ratio, not accepted evidence. Phase exit criteria are shown separately in the transition plan.

---

## 4. Operations pages

### Incident Management

The register supports searching and filtering sample incidents. Selecting a row opens the incident summary, root cause, resolution, related problem, and a short history. The history is synthetic demo content, not a real ServiceNow activity log.

### SLA Performance

Each month stores eligible targets, met targets, response and resolution denominators, and breach categories. Overall achievement is **met targets ÷ eligible targets**; breach count is **eligible targets − met targets**. Response and resolution compliance use their own eligible populations.

The six-month example sums to 86 breaches. Linked incident records are representative examples for each breach category; they do not account one-to-one for every aggregate breach.

> “The page demonstrates the calculations and drill-down approach. Before relying on real service reporting, we would validate target definitions, exclusions, eligible populations, reporting windows, and source reports.”

### Backlog and Aging

Use this view to explain how an operations team could monitor open work by priority, aging band, and assignment load. Confirm the aging thresholds and ownership model with the service team before treating them as operational policy. Ticket ages are calculated against the fixed demo date.

### Problem and RCA

The problem view groups recurring sample incidents under problem records and connects each cluster to a root cause, recommended action, SOP, and enhancement. The links illustrate a traceability model; they are seeded examples, not validated production RCA.

### Operational Governance

The sample operating rhythm includes daily operations review, weekly service review, monthly SLA review, and continuous improvement tracking. Meeting outcomes are example summaries, not minutes from real governance meetings.

---

## 5. Enhancements pages

### Enhancement Pipeline and Change Requests

These pages show sample demand moving through intake, analysis, approval, development, testing, and release. The cards and filters support a demo workflow; they do not create or approve real ServiceNow changes.

### Impact Analysis

The featured example adds manager approval to an employee onboarding catalog item. The graph illustrates possible impacts to the catalog item, Flow Designer, approval logic, HR integration, notifications, and regression tests.

> “This is a simulated impact assessment to show how a change could be traced. The actual component dependencies and approval path would need to be checked in the target ServiceNow instance.”

### Development, Testing, Release Calendar, and AI SDLC

These views illustrate requirement-to-test traceability, sample release windows, approval states, and rollback readiness. They do not connect to source control, a deployment pipeline, or a live release calendar. No live code generation or deployment is performed.

---

## 6. Synapt AI and the knowledge graph

### Knowledge Ingestion

The document library and ingestion progress are local simulations. There is no SharePoint connection, document parsing service, vector database, or external AI request.

### Context Knowledge Graph

The graph shows seeded relationships between selected modules, incidents, SOPs, KT sessions, changes, and SLA reports. Clicking a node opens its connected records. It demonstrates the intended relationship model; it is not a graph built from a live instance scan.

### Assistants

Transition, Operations, and Enhancement Assistants return deterministic answers based on keyword rules and local TypeScript records. Answers can expose clickable source IDs. Unsupported questions should report that information is unavailable.

> “The assistant is a transparent prototype of the user experience and source-linking approach. It is not a live AI or ServiceNow integration.”

---

## 7. Likely manager questions

### “Are these Valvoline’s real numbers?”

“No. They are synthetic sample records used to demonstrate the proposed screens and calculations. We would replace them with validated sources after agreeing scope, definitions, and access.”

### “Is the assistant connected to a live model?”

“No. It uses deterministic local rules and seeded sample data. There are no external AI calls.”

### “Does this connect to ServiceNow or SharePoint?”

“No. This is a client-side prototype. Those would be integrations in a future implementation, subject to architecture, security, access, and data-governance decisions.”

### “Does completed KT mean the team is ready?”

“Not by itself. Session status is only one signal. We would validate understanding through walkthroughs, shadowing, reverse KT, and agreed acceptance criteria.”

### “Are the task dependencies and dates approved?”

“No. They are illustrative Day 0-relative planning data. We would baseline the calendar, critical path, dependencies, resource capacity, and incumbent overlap with the delivery teams.”

### “Who is accountable for final sign-off?”

“The RACI proposes an assignment for discussion. The final decision authority and acceptance criteria need to be agreed with Valvoline.”

### “What is needed to make this production-ready?”

“Validated scope and data definitions; approved architecture and integrations; identity and access controls; security and privacy review; production-grade auditability; tested workflows; and an agreed support and ownership model.”

---

## 8. Technical overview for follow-up questions

- **React + TypeScript + Vite:** Builds the single-page web application.
- **React Router:** Handles the main pages and nested navigation.
- **Recharts:** Renders the dashboard and SLA charts.
- **Lucide React:** Provides interface icons.
- **`src/App.tsx`:** Shared navigation, page components, interactions, state, and record drawers.
- **`src/data.ts`:** Typed synthetic records, cross-references, and deterministic assistant answers.
- **`src/styles.css`:** Visual system, responsive layouts, and interaction styling.
- **Browser `localStorage`:** Persists demo edits on the current browser. Reset Demo restores seeded state.
- **Static deployment:** The project is designed to build into `dist` for Vercel or Netlify. It has no required environment variables or backend.

The production build has passed. That verifies compilation and bundling; it does not validate every business assumption, real data source, or production integration.

---

## 9. Pre-pitch checklist

- Reset the demo so the browser begins from the seeded state.
- Open the Executive Overview and confirm the page renders at the presentation display size.
- Start the guided tour and rehearse the seven transitions once.
- Use the suggested assistant question and open one source record.
- Keep the proposal brief available for scope assumptions and decision asks.
- Describe sample figures as synthetic and avoid claiming live connectivity.
- Close with the decisions needed to move from proposal demo to validated solution design.
