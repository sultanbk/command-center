export type Status = 'Complete' | 'In progress' | 'Not started' | 'At risk' | 'Blocked' | 'Approved' | 'Pending'

export type TransitionTask = {
  id: string; title: string; phase: string; workstream: string; owner: string; start: number; duration: number
  status: Status; priority: 'Critical' | 'High' | 'Medium'; predecessor: string; deliverable: string; acceptance: string
}

export type Risk = { id: string; title: string; severity: 'Critical' | 'High' | 'Medium'; impact: string; owner: string; due: string; mitigation: string; status: Status; taskId: string }
export type Incident = { id: string; service: string; priority: 'P1' | 'P2' | 'P3' | 'P4'; state: string; owner: string; created: string; resolved: string; category: string; rca: string; resolution: string; problemId: string }
export type TransitionPhase = { id: string; name: string; startDay: number; endDay: number; exitCriteria: string[] }
export type Milestone = { id: string; title: string; day: number; owner: string; status: Status; evidence: string }
export type KTSession = { id: string; topic: string; sme: string; attendees: string[]; planned: string; actual: string | null; status: string; signoff: string; documentId: string }
export type Document = { id: string; name: string; type: string; source: string; received: boolean; approved: boolean; updated: string; related: string }
export type Meeting = { id: string; name: string; cadence: string; participants: string; purpose: string; agenda: string; output: string; actions: string; escalation: string }
export type ActionItem = { id: string; title: string; owner: string; due: string; status: Status; related: string }
export type Problem = { id: string; title: string; cause: string; sop: string; incidents: number; action: string }
export type ResourceRole = { title: string; capacity: string; responsibility: string; onboarding: string; continuity: string }
export type SLARecord = { id: string; month: string; achievement: number; breaches: number }
export type SOP = { id: string; title: string; module: string; documentId: string; problemId: string }
export type Integration = { id: string; name: string; pattern: string; source: string; target: string; owner: string; documentId: string }
export type ServiceNowModule = { id: string; name: string; purpose: string; evidence: string[] }
export type ChangeRequest = { id: string; title: string; state: string; priority: string; owner: string; estimate: string; value: string; component: string }
export type TestCase = { id: string; requirementId: string; title: string; type: string; status: string }
export type KnowledgeRelationship = { source: string; target: string }

export const transitionPhases: TransitionPhase[] = [
  { id: 'PH-00', name: 'Pre-Day 0', startDay: -1, endDay: 0, exitCriteria: ['Scope and governance agreed', 'Named roles and incumbent coordination confirmed'] },
  { id: 'PH-01', name: 'Day 0-30', startDay: 0, endDay: 30, exitCriteria: ['Access and environments validated', 'Initial document inventory and reporting baseline accepted'] },
  { id: 'PH-02', name: 'Day 30-60', startDay: 30, endDay: 60, exitCriteria: ['Structured KT and shadowing complete', 'Day 60 readiness review approved'] },
  { id: 'PH-03', name: 'Day 60-90', startDay: 60, endDay: 90, exitCriteria: ['Reverse KT and Prodapt-led execution validated', 'Service takeover and closeout signed off'] },
]

export const milestones: Milestone[] = [
  { id: 'MS-001', title: 'Transition mobilization complete', day: 10, owner: 'Transition Lead', status: 'Complete', evidence: 'TR-006' },
  { id: 'MS-002', title: 'Access and environment readiness', day: 30, owner: 'Platform SME', status: 'In progress', evidence: 'TR-016' },
  { id: 'MS-003', title: 'Day 30 knowledge inventory accepted', day: 30, owner: 'Knowledge Lead', status: 'In progress', evidence: 'DOC-019' },
  { id: 'MS-004', title: 'Day 60 readiness gate', day: 60, owner: 'Transition Lead', status: 'Not started', evidence: 'TR-026' },
  { id: 'MS-005', title: 'Reverse KT validated', day: 72, owner: 'Operations Lead', status: 'Not started', evidence: 'TR-027' },
  { id: 'MS-006', title: 'Operational acceptance sign-off', day: 90, owner: 'Service Delivery Manager', status: 'Not started', evidence: 'TR-033' },
]

const phaseTasks = [
  ['Pre-Day 0', 'Mobilization & scope confirmation', 'Governance', 0, 4], ['Pre-Day 0', 'Confirm incumbent coordination model', 'Governance', 1, 5],
  ['Pre-Day 0', 'Staffing and role alignment', 'People', 2, 7], ['Pre-Day 0', 'Draft governance and escalation paths', 'Governance', 3, 6],
  ['Pre-Day 0', 'Scope, service catalog and SLA baseline', 'Service Management', 5, 6], ['Pre-Day 0', 'Environment and access request inventory', 'Platform & Access', 7, 5],
  ['Day 0-30', 'Kickoff and stakeholder introductions', 'Governance', 10, 2], ['Day 0-30', 'Provision platform and repository access', 'Platform & Access', 11, 10],
  ['Day 0-30', 'Validate instance and environment map', 'Architecture', 13, 8], ['Day 0-30', 'Inventory documents and knowledge gaps', 'Knowledge', 14, 10],
  ['Day 0-30', 'Configure Synapt knowledge workspace', 'AI & Knowledge', 16, 8], ['Day 0-30', 'Establish service reporting baseline', 'Service Management', 18, 8],
  ['Day 0-30', 'Confirm integration inventory and owners', 'Integrations', 19, 9], ['Day 0-30', 'Complete role-based onboarding', 'People', 20, 10],
  ['Day 0-30', 'Approve transition governance calendar', 'Governance', 22, 4], ['Day 0-30', 'Validate initial access and controls', 'Platform & Access', 25, 5],
  ['Day 30-60', 'Run structured knowledge transfer sessions', 'Knowledge', 30, 15], ['Day 30-60', 'Walk through priority SOPs and runbooks', 'Knowledge', 32, 14],
  ['Day 30-60', 'Analyze ticket trends and recurring issues', 'Operations', 35, 12], ['Day 30-60', 'Shadow incident and request execution', 'Operations', 37, 15],
  ['Day 30-60', 'Validate architecture and integration flows', 'Architecture', 39, 12], ['Day 30-60', 'Reconcile SLA baseline and reporting logic', 'Service Management', 41, 10],
  ['Day 30-60', 'Close critical knowledge gaps', 'Knowledge', 44, 12], ['Day 30-60', 'Review risk actions at readiness checkpoint', 'Governance', 47, 8],
  ['Day 30-60', 'Validate knowledge articles and evidence', 'AI & Knowledge', 49, 10], ['Day 30-60', 'Conduct Day 60 readiness review', 'Governance', 55, 5],
  ['Day 60-90', 'Execute reverse KT and scenario validation', 'Operations', 60, 12], ['Day 60-90', 'Transition Prodapt-led ticket execution', 'Operations', 63, 15],
  ['Day 60-90', 'Run incumbent consultation and office hours', 'Governance', 64, 15], ['Day 60-90', 'Validate support model and escalation routing', 'Service Management', 67, 10],
  ['Day 60-90', 'Stabilization and daily service checkpoints', 'Operations', 72, 14], ['Day 60-90', 'Complete operational acceptance evidence', 'Governance', 77, 8],
  ['Day 60-90', 'Confirm service takeover and sign-off', 'Governance', 85, 5], ['Day 60-90', 'Publish transition closeout and improvement plan', 'Service Management', 86, 4],
  ['Day 60-90', 'Publish knowledge handoff and article ownership map', 'AI & Knowledge', 82, 7],
]

const owners = ['Transition Lead', 'Service Delivery Manager', 'ServiceNow Architect', 'Platform SME', 'Knowledge Lead', 'Operations Lead', 'Governance Analyst']
export const transitionTasks: TransitionTask[] = phaseTasks.map(([phase, title, workstream, start, duration], index) => ({
  id: `TR-${String(index + 1).padStart(3, '0')}`, phase: String(phase), title: String(title), workstream: String(workstream),
  owner: owners[index % owners.length], start: Number(start), duration: Number(duration),
  status: index < 9 ? 'Complete' : index < 20 ? 'In progress' : index === 24 ? 'At risk' : 'Not started',
  priority: index === 7 || index === 16 || index === 32 ? 'Critical' : index % 3 === 0 ? 'High' : 'Medium',
  predecessor: index ? `TR-${String(index).padStart(3, '0')}` : 'None', deliverable: `${String(workstream)} evidence pack`,
  acceptance: `Owner and Valvoline counterpart approve ${String(title).toLowerCase()} evidence`,
}))

const riskSeeds = [
  ['Delayed platform access for transition SMEs', 'Critical', 'Access delays may compress shadowing and reverse KT.', 'Platform & Access', '2026-11-04', 7],
  ['Architecture diagrams incomplete or outdated', 'High', 'Integration and service dependency understanding may be incomplete.', 'Architecture', '2026-11-12', 8],
  ['Incumbent SME availability below plan', 'High', 'Planned KT coverage and question resolution may slip.', 'Knowledge', '2026-11-08', 16],
  ['Unresolved integration ownership', 'High', 'Support routing and recovery paths could remain unclear.', 'Integrations', '2026-11-19', 12],
  ['Runbook approval evidence outstanding', 'Medium', 'Operational acceptance evidence may be delayed.', 'Knowledge', '2026-11-25', 17],
  ['SLA reporting logic not reconciled', 'Medium', 'Baseline comparisons may not be consistent.', 'Service Management', '2026-11-29', 21],
  ['Environment refresh window conflicts with KT', 'Medium', 'Hands-on validation may need to be rescheduled.', 'Platform & Access', '2026-12-02', 15],
  ['Open critical incident during reverse KT', 'High', 'Reverse KT availability may be diverted to service recovery.', 'Operations', '2026-12-16', 26],
  ['Knowledge article ownership not confirmed', 'Medium', 'Knowledge maintenance handoff may be unclear.', 'AI & Knowledge', '2026-12-08', 24],
  ['Service takeover approval criteria pending', 'Critical', 'Day 90 acceptance may be delayed without agreed evidence.', 'Governance', '2027-01-12', 32],
]
export const seedRisks: Risk[] = riskSeeds.map(([title, severity, impact, owner, due, task], i) => ({
  id: `RISK-${String(i + 1).padStart(3, '0')}`, title: String(title), severity: severity as Risk['severity'], impact: String(impact), owner: String(owner), due: String(due),
  mitigation: ['Validate access weekly; use named access matrix and escalation at 48 hours.', 'Request artifact review with architecture owner and track evidence gaps.', 'Lock SME calendar and record sessions for asynchronous review.'][i % 3],
  status: i === 0 ? 'At risk' : i === 3 ? 'Blocked' : i < 4 ? 'In progress' : 'Pending', taskId: `TR-${String(Number(task) + 1).padStart(3, '0')}`,
}))

const incidentTitles = [
  ['Employee Center', 'Catalog request approval stalled', 'Workflow approval group was inactive', 'Updated approver group and replayed flow', 'PRB001'],
  ['ITSM', 'Incident assignment queue delay', 'Assignment rule condition excluded location', 'Corrected rule condition and reprocessed queue', 'PRB002'],
  ['CMDB', 'CI relationship not visible in service map', 'Discovery schedule missed a credential scope', 'Updated credential scope and reran discovery', 'PRB003'],
  ['IntegrationHub', 'HR feed import completed with errors', 'Source payload contained unmapped department code', 'Added mapping and replayed failed transform rows', 'PRB004'],
  ['Knowledge', 'Knowledge search returned stale article', 'Article review date exceeded validity policy', 'Reviewed article and refreshed search index', 'PRB005'],
]
export const incidents: Incident[] = Array.from({ length: 50 }, (_, index) => {
  const seed = incidentTitles[index % incidentTitles.length]
  const day = String((index % 28) + 1).padStart(2, '0')
  const priority = index % 19 === 0 ? 'P1' : index % 5 === 0 ? 'P2' : index % 3 === 0 ? 'P3' : 'P4'
  const active = index % 7 === 0 && index !== 6
  return { id: `INC${String(1001 + index)}`, service: String(seed[0]), priority, state: active ? 'In progress' : 'Resolved', owner: owners[index % owners.length], created: `2026-${index < 25 ? '10' : '09'}-${day}`, resolved: active ? '—' : `2026-${index < 25 ? '10' : '09'}-${String(Math.min(28, Number(day) + 1)).padStart(2, '0')}`, category: ['Access', 'Workflow', 'Integration', 'Data'][index % 4], rca: String(seed[2]), resolution: String(seed[3]), problemId: String(seed[4]) }
})

export const ktSessions: KTSession[] = Array.from({ length: 18 }, (_, i) => ({
  id: `KT-${String(i + 1).padStart(2, '0')}`, topic: ['Platform architecture overview', 'Incident and request workflows', 'Employee Center catalog', 'CMDB and discovery', 'IntegrationHub patterns', 'SLA and reporting logic'][i % 6],
  sme: ['Valvoline platform owner', 'Incumbent ServiceNow lead', 'Incumbent integration SME'][i % 3], attendees: ['Valvoline service owner', 'Incumbent SME', 'Prodapt technical SME'], planned: i < 7 ? `2026-10-${String(12 + i).padStart(2, '0')}` : i < 12 ? `2026-10-${String(27 + i - 7).padStart(2, '0')}` : `2026-11-${String(1 + i - 12).padStart(2, '0')}`, actual: i < 7 ? `2026-10-${String(13 + i).padStart(2, '0')}` : null, status: i < 7 ? 'Complete' : i < 12 ? 'In progress' : 'Planned', signoff: i < 5 ? 'Approved' : 'Pending', documentId: `DOC-${String((i % 24) + 1).padStart(3, '0')}`,
}))

export const documents: Document[] = Array.from({ length: 26 }, (_, i) => ({
  id: `DOC-${String(i + 1).padStart(3, '0')}`, name: ['ServiceNow platform architecture', 'Incident management SOP', 'Catalog request runbook', 'Integration inventory', 'SLA measurement definition', 'CMDB data model', 'Major incident RCA', 'Knowledge article standards', 'Environment access matrix', 'Release calendar'][i % 10],
  type: ['Architecture', 'SOP', 'Runbook', 'Integration', 'SLA report', 'Configuration', 'RCA', 'Requirements', 'KT recording', 'Change Request'][i % 10], source: `SP-SNOW-${String(240 + i)}`, received: i < 19, approved: i < 14, updated: `2026-10-${String(10 + (i % 18)).padStart(2, '0')}`, related: `KT-${String((i % 18) + 1).padStart(2, '0')}`,
}))

export const meetings: Meeting[] = [
  { id: 'GOV-01', name: 'Transition stand-up', cadence: 'Daily', participants: 'Transition workstream leads, Prodapt delivery team', purpose: 'Resolve blockers and coordinate next-day execution.', agenda: 'Progress, access blockers, KT actions, critical path', output: 'Updated action log and escalations', actions: 'Confirm access owners; assign blocker actions; update critical path.', escalation: 'Transition Lead to executive steering' },
  { id: 'GOV-02', name: 'KT coordination', cadence: 'Daily during active KT', participants: 'Valvoline SMEs, incumbent SMEs, Prodapt SMEs', purpose: 'Confirm session readiness and close knowledge questions.', agenda: 'Session attendance, evidence, open questions', output: 'Session notes and action owners', actions: 'Confirm SME attendance; publish session notes; assign unanswered questions.', escalation: 'Service Delivery Manager' },
  { id: 'GOV-03', name: 'Transition governance', cadence: 'Weekly', participants: 'Valvoline owner, incumbent lead, Prodapt leads', purpose: 'Review milestone health, dependencies, decisions and risks.', agenda: 'RAG health, plan variance, risks, decisions', output: 'Governance summary and decisions', actions: 'Approve corrective actions; confirm dependency owners; record decisions.', escalation: 'Executive steering' },
  { id: 'GOV-04', name: 'Executive steering', cadence: 'Biweekly', participants: 'Valvoline IT leadership, Prodapt leadership, incumbent sponsor', purpose: 'Align sponsors on readiness, scope and material escalations.', agenda: 'Executive dashboard, critical path, decisions required', output: 'Decision log and sponsor actions', actions: 'Resolve sponsor decisions; confirm scope direction; review critical escalations.', escalation: 'CIO / account leadership' },
  { id: 'GOV-05', name: 'Phase readiness review', cadence: 'At phase exit', participants: 'Workstream owners and service owners', purpose: 'Validate evidence against phase exit criteria.', agenda: 'Checklist, exceptions, acceptance recommendation', output: 'Gate approval or corrective actions', actions: 'Review evidence checklist; document exceptions; record gate decision.', escalation: 'Transition governance' },
]

export const actionItems: ActionItem[] = [
  { id: 'ACT-001', title: 'Confirm HR feed retry and recovery procedure', owner: 'Integration SME', due: '2026-10-29', status: 'In progress', related: 'KT-05' },
  { id: 'ACT-002', title: 'Share current approval group ownership', owner: 'Valvoline platform owner', due: '2026-10-30', status: 'Pending', related: 'KT-03' },
  { id: 'ACT-003', title: 'Validate service map credential scope', owner: 'Incumbent platform SME', due: '2026-11-02', status: 'Pending', related: 'RISK-002' },
  { id: 'ACT-004', title: 'Approve incident routing runbook', owner: 'Transition Lead', due: '2026-11-04', status: 'In progress', related: 'DOC-003' },
]

export const problems: Problem[] = [
  { id: 'PRB001', title: 'Catalog approvals intermittently stall', cause: 'Inactive or misrouted approver group', sop: 'DOC-003', incidents: incidents.filter(x => x.problemId === 'PRB001').length, action: 'Quarterly approval group validation and automated exception report' },
  { id: 'PRB002', title: 'Assignment delays for regional incidents', cause: 'Assignment rule conditions do not include all locations', sop: 'DOC-002', incidents: incidents.filter(x => x.problemId === 'PRB002').length, action: 'Normalize location values and add rule coverage tests' },
  { id: 'PRB003', title: 'Service map relationship gaps', cause: 'Discovery credential scope excludes selected subnets', sop: 'DOC-006', incidents: incidents.filter(x => x.problemId === 'PRB003').length, action: 'Review credential coverage with infrastructure owners' },
  { id: 'PRB004', title: 'HR integration transform exceptions', cause: 'New source department values are not mapped', sop: 'DOC-004', incidents: incidents.filter(x => x.problemId === 'PRB004').length, action: 'Add mapping governance and alerting for unmapped values' },
  { id: 'PRB005', title: 'Knowledge search returns stale content', cause: 'Article review validity expired before search index refresh', sop: 'DOC-008', incidents: incidents.filter(x => x.problemId === 'PRB005').length, action: 'Automate article review reminders and validate index refresh completion' },
]

export const enhancements: ChangeRequest[] = [
  { id: 'ENH-101', title: 'Manager approval for employee onboarding', state: 'Impact analysis', priority: 'High', owner: 'Platform SME', estimate: '8 days', value: 'Reduce incomplete onboarding requests', component: 'Employee Center' },
  { id: 'ENH-102', title: 'Automate stale knowledge review reminders', state: 'Approved', priority: 'Medium', owner: 'Knowledge Lead', estimate: '5 days', value: 'Improve knowledge freshness', component: 'Knowledge' },
  { id: 'ENH-103', title: 'Service map exception dashboard', state: 'Testing', priority: 'Medium', owner: 'ServiceNow Architect', estimate: '10 days', value: 'Increase CMDB relationship visibility', component: 'CMDB' },
  { id: 'ENH-104', title: 'Regional assignment rule normalization', state: 'Development', priority: 'High', owner: 'Operations Lead', estimate: '6 days', value: 'Reduce incident routing time', component: 'ITSM' },
  { id: 'ENH-105', title: 'HR feed mapping exception notifications', state: 'Intake', priority: 'Medium', owner: 'Platform SME', estimate: '4 days', value: 'Shorten integration recovery', component: 'IntegrationHub' },
  ...Array.from({ length: 7 }, (_, i) => ({ id: `ENH-${106 + i}`, title: ['Self-service password reset improvements', 'Major incident communication template', 'Change conflict visibility', 'Catalog fulfillment analytics', 'SLA warning notifications', 'CMDB ownership attestation', 'Request fulfillment automation'][i], state: ['Intake', 'Prioritization', 'Approved', 'Development', 'Testing', 'Release ready', 'Intake'][i], priority: i % 2 ? 'Medium' : 'Low', owner: owners[i % owners.length], estimate: `${4 + (i % 7)} days`, value: 'Improve service experience and operational efficiency', component: ['ITSM', 'ITSM', 'Change', 'Employee Center', 'Service Level Management', 'CMDB', 'Employee Center'][i] }))
]

export const roles: ResourceRole[] = [
  { title: 'Transition Lead', capacity: '1.0 FTE', responsibility: 'Own integrated plan, governance, risk and readiness', onboarding: 'Complete', continuity: 'Service Delivery Manager' },
  { title: 'Service Delivery Manager', capacity: '1.0 FTE', responsibility: 'Service model, SLA baseline, operational acceptance', onboarding: 'Complete', continuity: 'Operations Lead' },
  { title: 'ServiceNow Architect', capacity: '0.8 FTE', responsibility: 'Architecture, platform guardrails and integrations', onboarding: 'In progress', continuity: 'Platform SME' },
  { title: 'Platform and Process SMEs', capacity: '3.0 FTE pooled', responsibility: 'KT, configuration, workflow and operational shadowing', onboarding: 'In progress', continuity: 'Operations practice' },
  { title: 'QA Lead', capacity: '0.5 FTE', responsibility: 'Test strategy, evidence and acceptance traceability', onboarding: 'Planned', continuity: 'Enhancement QA' },
  { title: 'Governance Analyst', capacity: '0.5 FTE', responsibility: 'Actions, minutes, reports and evidence repository', onboarding: 'Complete', continuity: 'Service reporting' },
]

export const slaTrend: SLARecord[] = [
  { id: 'SLA-MAY-26', month: 'May', achievement: 96.8, breaches: 18 }, { id: 'SLA-JUN-26', month: 'Jun', achievement: 97.4, breaches: 14 }, { id: 'SLA-JUL-26', month: 'Jul', achievement: 96.2, breaches: 21 },
  { id: 'SLA-AUG-26', month: 'Aug', achievement: 98.1, breaches: 11 }, { id: 'SLA-SEP-26', month: 'Sep', achievement: 97.6, breaches: 13 }, { id: 'SLA-OCT-26', month: 'Oct', achievement: 98.4, breaches: 9 },
]

export const serviceNowModules: ServiceNowModule[] = [
  { id: 'ITSM', name: 'IT Service Management', purpose: 'Incident, request, problem, and change workflows', evidence: ['DOC-002', 'DOC-003'] },
  { id: 'Employee Center', name: 'Employee Center', purpose: 'Employee-facing catalog and service experiences', evidence: ['DOC-003', 'ENH-101'] },
  { id: 'CMDB', name: 'Configuration Management Database', purpose: 'Configuration item relationships and service maps', evidence: ['DOC-006', 'PRB003'] },
  { id: 'IntegrationHub', name: 'IntegrationHub', purpose: 'Integration flows and source data orchestration', evidence: ['DOC-004', 'PRB004'] },
  { id: 'Knowledge', name: 'Knowledge Management', purpose: 'Knowledge authoring, review, and search', evidence: ['DOC-008', 'ENH-102'] },
]

export const integrations: Integration[] = [
  { id: 'INT-001', name: 'HR employee and manager feed', pattern: 'Scheduled import / transform map', source: 'HR platform', target: 'ServiceNow Employee Center', owner: 'Integration SME', documentId: 'DOC-004' },
  { id: 'INT-002', name: 'Infrastructure discovery', pattern: 'MID Server discovery', source: 'Infrastructure network', target: 'ServiceNow CMDB', owner: 'Platform SME', documentId: 'DOC-006' },
  { id: 'INT-003', name: 'Knowledge artifact repository', pattern: 'Document ingestion simulation', source: 'SharePoint demo library', target: 'Synapt knowledge workspace', owner: 'Knowledge Lead', documentId: 'DOC-008' },
]

export const sops: SOP[] = [
  { id: 'SOP-001', title: 'Incident management SOP', module: 'ITSM', documentId: 'DOC-002', problemId: 'PRB002' },
  { id: 'SOP-002', title: 'Catalog request and approval runbook', module: 'Employee Center', documentId: 'DOC-003', problemId: 'PRB001' },
  { id: 'SOP-003', title: 'Integration recovery runbook', module: 'IntegrationHub', documentId: 'DOC-004', problemId: 'PRB004' },
  { id: 'SOP-004', title: 'CMDB discovery and service mapping', module: 'CMDB', documentId: 'DOC-006', problemId: 'PRB003' },
  { id: 'SOP-005', title: 'Knowledge article review and indexing', module: 'Knowledge', documentId: 'DOC-008', problemId: 'PRB005' },
]

export const testCases: TestCase[] = [
  { id: 'TC-101', requirementId: 'REQ-101', title: 'Manager receives approval for valid onboarding request', type: 'Functional', status: 'Ready' },
  { id: 'TC-102', requirementId: 'REQ-101', title: 'Approved request proceeds to fulfillment', type: 'Functional', status: 'Ready' },
  { id: 'TC-103', requirementId: 'REQ-102', title: 'Missing manager invokes fallback route', type: 'Exception', status: 'In progress' },
  { id: 'TC-104', requirementId: 'REQ-102', title: 'Approval timeout creates support action', type: 'Exception', status: 'Planned' },
  { id: 'TC-105', requirementId: 'REQ-103', title: 'Requester receives approval status notification', type: 'Functional', status: 'Ready' },
  { id: 'TC-106', requirementId: 'REQ-104', title: 'Existing catalog validations remain unchanged', type: 'Regression', status: 'Ready' },
]

export const raciRows = ['Access provisioning', 'Architecture baseline', 'Knowledge transfer', 'Document inventory', 'Ticket walkthrough', 'SLA baseline', 'Risk closure', 'Readiness recommendation', 'Service takeover', 'Final sign-off']
export const raciValues = [
  ['A', 'C', 'R', 'C', 'I'], ['C', 'R', 'A', 'C', 'R'], ['C', 'R', 'A', 'C', 'R'], ['A', 'R', 'C', 'I', 'C'], ['C', 'R', 'A', 'R', 'R'],
  ['A', 'C', 'C', 'R', 'I'], ['A', 'C', 'R', 'R', 'C'], ['A', 'C', 'R', 'R', 'C'], ['A', 'C', 'R', 'R', 'R'], ['A', 'C', 'R', 'R', 'I'],
]

export const graphNodes = [
  { id: 'ITSM', type: 'Module', x: 50, y: 42 }, { id: 'Employee Center', type: 'Module', x: 22, y: 28 }, { id: 'CMDB', type: 'Module', x: 77, y: 24 },
  { id: 'IntegrationHub', type: 'Integration', x: 81, y: 68 }, { id: 'DOC-003', type: 'SOP', x: 28, y: 68 }, { id: 'INC1007', type: 'Incident', x: 50, y: 77 },
  { id: 'KT-03', type: 'KT session', x: 18, y: 49 }, { id: 'ENH-101', type: 'Change request', x: 68, y: 50 }, { id: 'SLA-OCT-26', type: 'Report', x: 47, y: 20 },
]
export const graphEdges: KnowledgeRelationship[] = [
  { source: 'ITSM', target: 'INC1007' }, { source: 'ITSM', target: 'DOC-003' }, { source: 'Employee Center', target: 'ENH-101' },
  { source: 'ENH-101', target: 'IntegrationHub' }, { source: 'CMDB', target: 'SLA-OCT-26' }, { source: 'KT-03', target: 'DOC-003' },
  { source: 'INC1007', target: 'SLA-OCT-26' }, { source: 'ITSM', target: 'KT-03' }, { source: 'ENH-101', target: 'ITSM' },
]

export const assistantQuestions = [
  'What is our ServiceNow architecture?', 'Which integrations are in scope?', 'What were the incident trends over the last six months?',
  'Which days had unusual incident spikes?', 'Summarize KT session 3.', 'What are the pending KT actions?',
  'Which transition documents are missing?', 'What percentage of transition is complete?', 'What could delay Day 60 readiness?',
]

export const getAssistantAnswer = (question: string, completion: number) => {
  const q = question.toLowerCase()
  if (q.includes('architecture')) return { text: 'The demo architecture includes ITSM, Employee Center, CMDB, IntegrationHub, Knowledge, and service reporting. Architecture baseline evidence is tracked in the document inventory.', sources: ['DOC-001', 'DOC-006', 'DOC-004'] }
  if (q.includes('integration')) return { text: 'The seeded scope includes the HR feed through IntegrationHub, discovery credentials, and catalog fulfillment dependencies. Ownership confirmation is tracked as a transition risk.', sources: ['DOC-004', 'RISK-004', 'TR-013'] }
  if (q.includes('spike')) return { text: 'Unusual incident spike days are unavailable from this sample because it has no anomaly baseline or spike annotations. The seeded records can be inspected by creation date in Incident Management.', sources: ['INC1001', 'INC1007', 'INC1050'] }
  if (q.includes('trend') || q.includes('six months')) return { text: `The ${incidents.length}-record incident sample covers September and October 2026, so it cannot support a six-month incident trend. The six-month SLA achievement series is available in Operations > SLA Performance.`, sources: ['INC1001', 'INC1026', 'SLA-MAY-26', 'SLA-OCT-26'] }
  if (q.includes('kt session 3') || q.includes('session 3')) return { text: 'KT-03 covers the Employee Center catalog request flow with the incumbent ServiceNow lead. Its linked evidence record is DOC-003; session completion and sign-off are tracked in the KT register.', sources: ['KT-03', 'DOC-003'] }
  if (q.includes('pending kt') || q.includes('kt action')) return { text: `${ktSessions.filter(x => x.status !== 'Complete').length} KT sessions remain in progress or planned. Open questions are owned through the session evidence log and transition governance action register.`, sources: ['KT-08', 'KT-12', 'GOV-02'] }
  if (q.includes('missing') || q.includes('documents')) return { text: `${documents.filter(x => !x.received).length} required documents are not yet received, and ${documents.filter(x => x.received && !x.approved).length} received documents still need approval.`, sources: documents.filter(x => !x.received || !x.approved).slice(0, 4).map(x => x.id) }
  if (q.includes('complete') || q.includes('percentage')) return { text: `Transition completion is ${Math.round(completion)}% based on the current task records across ${transitionTasks.length} seeded activities.`, sources: ['TR-001', 'TR-009', 'TR-017'] }
  if (q.includes('day 60') || q.includes('delay')) return { text: 'Day 60 readiness depends on access validation, completed structured KT, usable SOP evidence, and integration ownership. Current high-impact watch items include platform access and SME coverage.', sources: ['RISK-001', 'RISK-003', 'TR-016', 'TR-026'] }
  if (q.includes('inc1007') || q.includes('resolved') || q.includes('root cause') || q.includes('sop') || q.includes('who resolved')) {
    const incident = incidents.find(item => item.id === 'INC1007')!
    const problem = problems.find(item => item.id === incident.problemId)!
    if (q.includes('who resolved')) {
      const owners = [...new Set(incidents.filter(item => item.problemId === incident.problemId && item.state === 'Resolved').map(item => item.owner))]
      return { text: `Similar resolved incidents in ${problem.id} were handled by ${owners.join(', ')}.`, sources: [problem.id, ...incidents.filter(item => item.problemId === problem.id && item.state === 'Resolved').slice(0, 3).map(item => item.id)] }
    }
    if (q.includes('sop')) return { text: `The applicable procedure for ${problem.title} is ${problem.sop}. The recurring issue is tracked as ${problem.id}.`, sources: [incident.id, problem.id, problem.sop] }
    return { text: `${incident.id} (${incident.service}, ${incident.state}) has root cause: ${incident.rca}. Resolution: ${incident.resolution}. The recurring cluster is ${problem.id}.`, sources: [incident.id, problem.id, problem.sop] }
  }
  if (q.includes('sla')) return { text: 'The latest simulated monthly SLA achievement is 98.4%, with 9 recorded breaches. Use the SLA Performance view to inspect the trend and breach reasons.', sources: ['SLA-OCT', 'INC1007'] }
  if (q.includes('recurring')) return { text: 'Recurring clusters are catalog approval routing, regional assignment delays, service map relationship gaps, and HR integration transform exceptions.', sources: ['PRB001', 'PRB002', 'PRB003', 'PRB004'] }
  if (q.includes('summary')) return { text: `Operational snapshot: ${incidents.filter(x => x.state !== 'Resolved').length} active incidents in this sample, ${problems.length} tracked problem clusters, and latest simulated SLA achievement of 98.4%.`, sources: ['INC1001', 'PRB001', 'SLA-OCT'] }
  if (q.includes('manager approval') || q.includes('enhancement')) return { text: 'The request touches Employee Center catalog item configuration, Flow Designer approval orchestration, approver-group logic, and the HR integration context. Regression should cover manager lookup, inactive approver fallback, and successful fulfillment.', sources: ['ENH-101', 'DOC-003', 'DOC-004', 'TC-101'] }
  return { text: 'This information is unavailable in the seeded demo dataset. Try one of the suggested questions for a deterministic, source-linked response.', sources: [] }
}