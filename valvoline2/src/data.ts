export type Status = 'Complete' | 'In progress' | 'Not started' | 'At risk' | 'Blocked' | 'Approved' | 'Pending'

export type TransitionTask = {
  id: string; title: string; phase: string; workstream: string; owner: string; start: number; duration: number
  status: Status; priority: 'Critical' | 'High' | 'Medium'; predecessor: string; deliverable: string; acceptance: string
}

export type Risk = { id: string; title: string; severity: 'Critical' | 'High' | 'Medium'; impact: string; owner: string; due: string; mitigation: string; status: Status; taskId: string }
export type Incident = { id: string; shortDescription: string; service: string; priority: 'P1' | 'P2' | 'P3' | 'P4'; state: string; owner: string; created: string; resolved: string; category: string; rca: string; resolution: string; problemId: string }
export type TransitionPhase = { id: string; name: string; startDay: number; endDay: number; exitCriteria: string[] }
export type Milestone = { id: string; title: string; day: number; owner: string; status: Status; evidence: string }
export type KTSession = { id: string; topic: string; sme: string; attendees: string[]; planned: string; actual: string | null; status: string; signoff: string; documentId: string }
export type Document = { id: string; name: string; type: string; source: string; received: boolean; approved: boolean; updated: string; related: string }
export type Meeting = { id: string; name: string; cadence: string; participants: string; purpose: string; agenda: string; output: string; actions: string; escalation: string }
export type ActionItem = { id: string; title: string; owner: string; due: string; status: Status; related: string }
export type Problem = { id: string; title: string; cause: string; sop: string; incidents: number; action: string; enhancementId: string }
export type ResourceRole = { title: string; capacity: string; responsibility: string; onboarding: string; continuity: string }
export type SLARecord = { id: string; month: string; eligibleTargets: number; metTargets: number; breaches: number; achievement: number; responseEligible: number; responseMet: number; responseCompliance: number; resolutionEligible: number; resolutionMet: number; resolutionCompliance: number; breachReasons: Record<string, number> }
export type AvailabilityRecord = { id: string; period: string; scheduledMinutes: number; availableMinutes: number }
export type SOP = { id: string; title: string; module: string; documentId: string; problemId: string }
export type Integration = { id: string; name: string; pattern: string; source: string; target: string; owner: string; documentId: string }
export type ServiceNowModule = { id: string; name: string; purpose: string; evidence: string[] }
export type ChangeRequest = { id: string; title: string; state: string; approvalState: 'Approved' | 'Pending'; priority: string; owner: string; estimate: string; value: string; component: string }
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
  ['Service takeover approval criteria pending', 'Critical', 'Day 90 acceptance may be delayed without agreed evidence.', 'Governance', '2026-12-28', 32],
]
export const seedRisks: Risk[] = riskSeeds.map(([title, severity, impact, owner, due, task], i) => ({
  id: `RISK-${String(i + 1).padStart(3, '0')}`, title: String(title), severity: severity as Risk['severity'], impact: String(impact), owner: String(owner), due: String(due),
  mitigation: ['Validate access weekly; use named access matrix and escalation at 48 hours.', 'Request artifact review with architecture owner and track evidence gaps.', 'Lock SME calendar and record sessions for asynchronous review.'][i % 3],
  status: i === 0 ? 'At risk' : i === 3 ? 'Blocked' : i < 4 ? 'In progress' : 'Pending', taskId: `TR-${String(Number(task) + 1).padStart(3, '0')}`,
}))

const incidentScenarios = [
  ['Employee Center', 'Manager approval remained pending', 'Inactive manager group prevented the approval activity from advancing.', 'Reactivated the approver group and replayed the request.', 'PRB001', 'Workflow'],
  ['Employee Center', 'Catalog fulfillment task routed to an inactive group', 'The catalog item referenced a retired fulfillment group.', 'Updated the fulfillment group and reassigned the open task.', 'PRB001', 'Request'],
  ['ITSM', 'Regional incident assigned to the wrong resolver group', 'The assignment rule did not include the site region value.', 'Added the region condition and reassigned affected incidents.', 'PRB002', 'Assignment'],
  ['ITSM', 'Priority queue accumulated unassigned incidents', 'A rule condition excluded incidents submitted through the portal.', 'Corrected the condition and reprocessed the unassigned queue.', 'PRB002', 'Assignment'],
  ['CMDB', 'Service map omitted a recently discovered server', 'The discovery schedule did not include the server subnet.', 'Added the subnet to discovery scope and refreshed the service map.', 'PRB003', 'Configuration'],
  ['CMDB', 'Configuration item relationship was not refreshed', 'A discovery credential expired before the scheduled scan.', 'Renewed the credential and reran the discovery scan.', 'PRB003', 'Configuration'],
  ['IntegrationHub', 'HR import rejected a department value', 'The source department code was missing from the transform map.', 'Added the department mapping and replayed the rejected row.', 'PRB004', 'Integration'],
  ['IntegrationHub', 'Employee manager feed stopped after a schema change', 'A new source field changed the payload shape expected by the flow.', 'Updated the field mapping and replayed the failed import set.', 'PRB004', 'Integration'],
  ['Knowledge', 'Search returned an expired support article', 'The article passed its review date but remained published in the index.', 'Reviewed the content and refreshed the knowledge index.', 'PRB005', 'Knowledge'],
  ['Knowledge', 'Approved article was missing from employee search', 'The article audience criteria excluded the employee support group.', 'Corrected the audience criteria and validated search visibility.', 'PRB005', 'Knowledge'],
] as const
const incidentRegions = ['North America', 'Europe', 'India', 'LATAM', 'APAC']
const incidentMonths = ['05', '06', '07', '08', '09', '10']
const normalIncidentDays = [2, 5, 8, 20, 24, 27]
export const incidents: Incident[] = Array.from({ length: 50 }, (_, index) => {
  const scenario = incidentScenarios[index % incidentScenarios.length]
  const monthIndex = Math.floor(index * incidentMonths.length / 50)
  const monthStart = Math.ceil(monthIndex * 50 / incidentMonths.length)
  const positionInMonth = index - monthStart
  const dayNumber = positionInMonth < 3 ? 12 + monthIndex : normalIncidentDays[positionInMonth - 3]
  const day = String(dayNumber).padStart(2, '0')
  const created = `2026-${incidentMonths[monthIndex]}-${day}`
  const priority: Incident['priority'] = index % 19 === 0 ? 'P1' : index % 5 === 0 ? 'P2' : index % 3 === 0 ? 'P3' : 'P4'
  const active = [38, 43, 49].includes(index)
  const resolved = active ? '—' : `2026-${incidentMonths[monthIndex]}-${String(Math.min(28, dayNumber + 1)).padStart(2, '0')}`
  const region = incidentRegions[Math.floor(index / incidentScenarios.length)]
  return {
    id: `INC${String(1001 + index)}`, shortDescription: `${String(scenario[1])} · ${region}`, service: String(scenario[0]), priority,
    state: active ? 'In progress' : 'Resolved', owner: owners[index % owners.length], created, resolved,
    category: String(scenario[5]), rca: String(scenario[2]), resolution: String(scenario[3]), problemId: String(scenario[4]),
  }
}).sort((a, b) => b.created.localeCompare(a.created))
const ktTopics = ['Platform architecture and environments', 'Incident lifecycle and priorities', 'Employee Center catalog fulfillment', 'CMDB data model and ownership', 'HR IntegrationHub transforms and retries', 'SLA measurement and breach process', 'Problem management and root cause analysis', 'Service mapping and discovery scope', 'Access provisioning and platform roles', 'Request assignment rules', 'Change enablement and approvals', 'Knowledge authoring and review', 'Major incident communications', 'Release and rollback procedure', 'Integration monitoring and recovery', 'Service catalog test evidence', 'Escalation matrix and on-call coverage', 'Transition signoff and operational acceptance']
export const ktSessions: KTSession[] = Array.from({ length: 18 }, (_, i) => ({
  id: `KT-${String(i + 1).padStart(2, '0')}`, topic: ktTopics[i],
  sme: ['Valvoline platform owner', 'Incumbent ServiceNow lead', 'Incumbent integration SME'][i % 3], attendees: ['Valvoline service owner', 'Incumbent SME', 'Prodapt technical SME'], planned: i < 7 ? `2026-10-${String(12 + i).padStart(2, '0')}` : i < 12 ? `2026-10-${String(27 + i - 7).padStart(2, '0')}` : `2026-11-${String(1 + i - 12).padStart(2, '0')}`, actual: i < 7 ? `2026-10-${String(13 + i).padStart(2, '0')}` : null, status: i < 7 ? 'Complete' : i < 12 ? 'In progress' : 'Planned', signoff: i < 5 ? 'Approved' : 'Pending', documentId: `DOC-${String((i % 24) + 1).padStart(3, '0')}`,
}))

const documentNames = ['ServiceNow platform architecture', 'Incident management SOP', 'Employee Center catalog runbook', 'Integration inventory', 'SLA measurement definition', 'CMDB data model', 'Major incident RCA', 'Knowledge article standards', 'Environment access matrix', 'Release calendar and rollback plan', 'Service mapping runbook', 'Discovery credential matrix', 'HR transform map specification', 'Request fulfillment workflow', 'Assignment rules catalog', 'Severity and escalation policy', 'Knowledge taxonomy and ownership', 'Monthly SLA report sample', 'Integration recovery runbook', 'Change approval policy', 'Problem management standards', 'Service catalog test evidence', 'Architecture KT recording', 'ITSM workflow KT recording', 'Operations support model', 'Transition acceptance checklist']
const documentTypes = ['Architecture', 'SOP', 'Runbook', 'Integration', 'SLA report', 'Configuration', 'RCA', 'Requirements', 'Configuration', 'Change Request', 'SOP', 'Configuration', 'Integration', 'Requirements', 'Configuration', 'SOP', 'Requirements', 'SLA report', 'Runbook', 'Change Request', 'SOP', 'Test evidence', 'KT recording', 'KT recording', 'Runbook', 'Acceptance evidence']
const receivedDocumentNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 20, 22, 25])
const approvedDocumentNumbers = new Set([1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17])
export const documents: Document[] = Array.from({ length: 26 }, (_, i) => {
  const monthIndex = Math.floor(i * 6 / 26)
  const month = ['05', '06', '07', '08', '09', '10'][monthIndex]
  return {
    id: `DOC-${String(i + 1).padStart(3, '0')}`, name: documentNames[i], type: documentTypes[i], source: `SP-SNOW-${String(240 + i)}`,
    received: receivedDocumentNumbers.has(i + 1), approved: approvedDocumentNumbers.has(i + 1),
    updated: `2026-${month}-${String(3 + (i * 7) % 25).padStart(2, '0')}`, related: `KT-${String((i % 18) + 1).padStart(2, '0')}`,
  }
})

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
  { id: 'ACT-004', title: 'Approve incident routing runbook', owner: 'Transition Lead', due: '2026-11-04', status: 'In progress', related: 'DOC-002' },
]

export const problems: Problem[] = [
  { id: 'PRB001', title: 'Catalog approvals intermittently stall', cause: 'Inactive or misrouted approver group', sop: 'SOP-002', incidents: incidents.filter(x => x.problemId === 'PRB001').length, action: 'Quarterly approval group validation and automated exception report', enhancementId: 'ENH-101' },
  { id: 'PRB002', title: 'Assignment delays for regional incidents', cause: 'Assignment rule conditions do not include all locations', sop: 'SOP-001', incidents: incidents.filter(x => x.problemId === 'PRB002').length, action: 'Normalize location values and add rule coverage tests', enhancementId: 'ENH-104' },
  { id: 'PRB003', title: 'Service map relationship gaps', cause: 'Discovery credential scope excludes selected subnets', sop: 'SOP-004', incidents: incidents.filter(x => x.problemId === 'PRB003').length, action: 'Review credential coverage with infrastructure owners', enhancementId: 'ENH-103' },
  { id: 'PRB004', title: 'HR integration transform exceptions', cause: 'New source department values are not mapped', sop: 'SOP-003', incidents: incidents.filter(x => x.problemId === 'PRB004').length, action: 'Add mapping governance and alerting for unmapped values', enhancementId: 'ENH-105' },
  { id: 'PRB005', title: 'Knowledge search returns stale content', cause: 'Article review validity expired before search index refresh', sop: 'SOP-005', incidents: incidents.filter(x => x.problemId === 'PRB005').length, action: 'Automate article review reminders and validate index refresh completion', enhancementId: 'ENH-102' },
]

export const enhancements: ChangeRequest[] = [
  { id: 'ENH-101', title: 'Manager approval for employee onboarding', state: 'Impact analysis', approvalState: 'Pending', priority: 'High', owner: 'Platform SME', estimate: '8 days', value: 'Reduce incomplete onboarding requests', component: 'Employee Center' },
  { id: 'ENH-102', title: 'Automate stale knowledge review reminders', state: 'Approved', approvalState: 'Approved', priority: 'Medium', owner: 'Knowledge Lead', estimate: '5 days', value: 'Improve knowledge freshness', component: 'Knowledge' },
  { id: 'ENH-103', title: 'Service map exception dashboard', state: 'Testing', approvalState: 'Approved', priority: 'Medium', owner: 'ServiceNow Architect', estimate: '10 days', value: 'Increase CMDB relationship visibility', component: 'CMDB' },
  { id: 'ENH-104', title: 'Regional assignment rule normalization', state: 'Development', approvalState: 'Approved', priority: 'High', owner: 'Operations Lead', estimate: '6 days', value: 'Reduce incident routing time', component: 'ITSM' },
  { id: 'ENH-105', title: 'HR feed mapping exception notifications', state: 'Intake', approvalState: 'Pending', priority: 'Medium', owner: 'Platform SME', estimate: '4 days', value: 'Shorten integration recovery', component: 'IntegrationHub' },
  ...Array.from({ length: 7 }, (_, i) => ({ id: `ENH-${106 + i}`, title: ['Self-service password reset improvements', 'Major incident communication template', 'Change conflict visibility', 'Catalog fulfillment analytics', 'SLA warning notifications', 'CMDB ownership attestation', 'Request fulfillment automation'][i], state: ['Intake', 'Prioritization', 'Approved', 'Development', 'Testing', 'Release ready', 'Intake'][i], approvalState: i === 2 || i === 3 || i === 4 || i === 5 ? 'Approved' as const : 'Pending' as const, priority: i % 2 ? 'Medium' : 'Low', owner: owners[i % owners.length], estimate: `${4 + (i % 7)} days`, value: 'Improve service experience and operational efficiency', component: ['ITSM', 'ITSM', 'Change', 'Employee Center', 'Service Level Management', 'CMDB', 'Employee Center'][i] }))
]

export const roles: ResourceRole[] = [
  { title: 'Transition Lead', capacity: '1.0 FTE', responsibility: 'Own integrated plan, governance, risk and readiness', onboarding: 'Complete', continuity: 'Service Delivery Manager' },
  { title: 'Service Delivery Manager', capacity: '1.0 FTE', responsibility: 'Service model, SLA baseline, operational acceptance', onboarding: 'Complete', continuity: 'Operations Lead' },
  { title: 'ServiceNow Architect', capacity: '0.8 FTE', responsibility: 'Architecture, platform guardrails and integrations', onboarding: 'In progress', continuity: 'Platform SME' },
  { title: 'Platform and Process SMEs', capacity: '3.0 FTE pooled', responsibility: 'KT, configuration, workflow and operational shadowing', onboarding: 'In progress', continuity: 'Operations practice' },
  { title: 'QA Lead', capacity: '0.5 FTE', responsibility: 'Test strategy, evidence and acceptance traceability', onboarding: 'Planned', continuity: 'Enhancement QA' },
  { title: 'Governance Analyst', capacity: '0.5 FTE', responsibility: 'Actions, minutes, reports and evidence repository', onboarding: 'Complete', continuity: 'Service reporting' },
]

const slaSeeds = [
  { id: 'SLA-MAY-26', month: 'May', eligibleTargets: 563, metTargets: 545, responseEligible: 1000, responseMet: 984, resolutionEligible: 1000, resolutionMet: 973, breachReasons: { 'Late assignment / routing': 5, 'Catalog approval / fulfillment': 4, 'Integration mapping / import': 3, 'Knowledge search / article quality': 3, 'CMDB discovery / relationship': 3 } },
  { id: 'SLA-JUN-26', month: 'Jun', eligibleTargets: 540, metTargets: 526, responseEligible: 1000, responseMet: 989, resolutionEligible: 1000, resolutionMet: 981, breachReasons: { 'Late assignment / routing': 4, 'Catalog approval / fulfillment': 3, 'Integration mapping / import': 2, 'Knowledge search / article quality': 3, 'CMDB discovery / relationship': 2 } },
  { id: 'SLA-JUL-26', month: 'Jul', eligibleTargets: 552, metTargets: 531, responseEligible: 1000, responseMet: 983, resolutionEligible: 1000, resolutionMet: 974, breachReasons: { 'Late assignment / routing': 6, 'Catalog approval / fulfillment': 5, 'Integration mapping / import': 4, 'Knowledge search / article quality': 3, 'CMDB discovery / relationship': 3 } },
  { id: 'SLA-AUG-26', month: 'Aug', eligibleTargets: 580, metTargets: 569, responseEligible: 1000, responseMet: 991, resolutionEligible: 1000, resolutionMet: 985, breachReasons: { 'Late assignment / routing': 3, 'Catalog approval / fulfillment': 2, 'Integration mapping / import': 2, 'Knowledge search / article quality': 2, 'CMDB discovery / relationship': 2 } },
  { id: 'SLA-SEP-26', month: 'Sep', eligibleTargets: 552, metTargets: 539, responseEligible: 1000, responseMet: 987, resolutionEligible: 1000, resolutionMet: 978, breachReasons: { 'Late assignment / routing': 4, 'Catalog approval / fulfillment': 3, 'Integration mapping / import': 2, 'Knowledge search / article quality': 2, 'CMDB discovery / relationship': 2 } },
  { id: 'SLA-OCT-26', month: 'Oct', eligibleTargets: 563, metTargets: 554, responseEligible: 1000, responseMet: 993, resolutionEligible: 1000, resolutionMet: 983, breachReasons: { 'Late assignment / routing': 3, 'Catalog approval / fulfillment': 2, 'Integration mapping / import': 2, 'Knowledge search / article quality': 1, 'CMDB discovery / relationship': 1 } },
]
export const slaTrend: SLARecord[] = slaSeeds.map(item => ({
  ...item,
  breaches: item.eligibleTargets - item.metTargets,
  achievement: Number((item.metTargets / item.eligibleTargets * 100).toFixed(1)),
  responseCompliance: Number((item.responseMet / item.responseEligible * 100).toFixed(1)),
  resolutionCompliance: Number((item.resolutionMet / item.resolutionEligible * 100).toFixed(1)),
}))

export const serviceAvailability: AvailabilityRecord = {
  id: 'AVAIL-2026-10', period: 'Rolling 30 days', scheduledMinutes: 43200, availableMinutes: 43165,
}

// Representative seeded incident evidence behind the simulated breach-reason categories.
export const slaBreachEvidence: Record<string, string[]> = {
  'Late assignment / routing': ['INC1003', 'INC1004', 'INC1013', 'INC1014'],
  'Catalog approval / fulfillment': ['INC1001', 'INC1002', 'INC1011'],
  'Integration mapping / import': ['INC1007', 'INC1008', 'INC1017', 'INC1018'],
  'Knowledge search / article quality': ['INC1009', 'INC1010', 'INC1019', 'INC1020'],
  'CMDB discovery / relationship': ['INC1005', 'INC1006', 'INC1015', 'INC1016'],
}

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
  { id: 'IntegrationHub', type: 'Integration', x: 81, y: 68 }, { id: 'DOC-003', type: 'SOP', x: 28, y: 68 }, { id: 'INC1043', type: 'Incident', x: 50, y: 77 },
  { id: 'KT-03', type: 'KT session', x: 18, y: 49 }, { id: 'ENH-101', type: 'Change request', x: 68, y: 50 }, { id: 'SLA-OCT-26', type: 'Report', x: 47, y: 20 },
]
export const graphEdges: KnowledgeRelationship[] = [
  { source: 'ITSM', target: 'INC1043' }, { source: 'ITSM', target: 'DOC-003' }, { source: 'Employee Center', target: 'ENH-101' },
  { source: 'ENH-101', target: 'IntegrationHub' }, { source: 'CMDB', target: 'SLA-OCT-26' }, { source: 'KT-03', target: 'DOC-003' },
  { source: 'INC1043', target: 'SLA-OCT-26' }, { source: 'ITSM', target: 'KT-03' }, { source: 'ENH-101', target: 'ITSM' },
]

export const assistantQuestions = [
  'What is our ServiceNow architecture?', 'Which integrations are in scope?', 'What were the incident trends over the last six months?',
  'Which days had unusual incident spikes?', 'Summarize KT session 3.', 'What are the pending KT actions?',
  'Which transition documents are missing?', 'What percentage of transition is complete?', 'What could delay Day 60 readiness?',
]

export const getAssistantAnswer = (question: string, completion: number, context: { sessions?: KTSession[]; actions?: ActionItem[]; receivedDocs?: string[]; approvedDocs?: string[]; risks?: Risk[]; assistantKind?: string } = {}) => {
  const q = question.toLowerCase()
  const currentSessions = context.sessions ?? ktSessions
  const currentActions = context.actions ?? actionItems
  const currentRisks = context.risks ?? seedRisks
  const received = context.receivedDocs ?? documents.filter(item => item.received).map(item => item.id)
  const approved = context.approvedDocs ?? documents.filter(item => item.approved).map(item => item.id)
  if (context.assistantKind === 'enhancement-assistant') {
    const request = enhancements.find(item => item.id === 'ENH-101')!
    const linkedTests = testCases.filter(item => item.requirementId.startsWith('REQ-10'))
    if (q.includes('test')) return { text: `${linkedTests.length} seeded test cases cover the manager approval request: ${linkedTests.map(item => `${item.id} (${item.title})`).join('; ')}.`, sources: [request.id, ...linkedTests.map(item => item.id)] }
    if (q.includes('integration') || q.includes('workflow') || q.includes('system') || q.includes('impact') || q.includes('manager approval') || q.includes('summary')) return { text: `${request.title} affects the ${request.component} catalog request, a manager-approval workflow, and the HR employee and manager feed. Confirm manager data quality and test the fallback path before approval routing.`, sources: [request.id, 'DOC-003', 'INT-001', 'DOC-004', ...linkedTests.slice(0, 2).map(item => item.id)] }
    return { text: 'This enhancement detail is unavailable in the seeded demo dataset. Try one of the suggested impact questions.', sources: [] }
  }
  if (q.includes('architecture')) return { text: 'The demo architecture includes ITSM, Employee Center, CMDB, IntegrationHub, Knowledge, and service reporting. Architecture baseline evidence is tracked in the document inventory.', sources: ['DOC-001', 'DOC-006', 'DOC-004'] }
  if (q.includes('integration')) return { text: 'The seeded scope includes the HR feed through IntegrationHub, discovery credentials, and catalog fulfillment dependencies. Ownership confirmation is tracked as a transition risk.', sources: ['DOC-004', 'RISK-004', 'TR-013'] }
  if (q.includes('spike')) {
    const byDate = incidents.reduce<Record<string, Incident[]>>((groups, item) => { (groups[item.created] ??= []).push(item); return groups }, {})
    const spikeDays = Object.entries(byDate).filter(([, items]) => items.length >= 3).sort(([a], [b]) => a.localeCompare(b))
    const details = spikeDays.map(([date, items]) => `${date}: ${items.length} incidents`).join('; ')
    return { text: `For this synthetic sample, a spike is defined as 3 or more incidents opened on one date. Spike dates: ${details}. The median on other active dates is 1 incident.`, sources: spikeDays.flatMap(([, items]) => items.map(item => item.id)) }
  }
  if (q.includes('trend') || q.includes('six months')) {
    const monthly = incidentMonths.map((month, index) => {
      const records = incidents.filter(item => item.created.slice(5, 7) === month)
      return { label: ['May', 'June', 'July', 'August', 'September', 'October'][index], records }
    })
    return { text: `The ${incidents.length}-record synthetic incident sample spans May–October 2026. Monthly opened incidents: ${monthly.map(item => `${item.label} ${item.records.length}`).join(', ')}.`, sources: monthly.map(item => item.records[0]?.id).filter((id): id is string => Boolean(id)) }
  }
  if (q.includes('kt session 3') || q.includes('session 3')) { const session = currentSessions.find(item => item.id === 'KT-03') ?? ktSessions[2]; return { text: `${session.id} covers ${session.topic} with ${session.sme}. Status: ${session.status}; sign-off: ${session.signoff}.`, sources: [session.id, session.documentId] } }
  if (q.includes('kt action')) { const pending = currentActions.filter(item => item.status !== 'Complete' && item.status !== 'Approved'); return { text: `${pending.length} KT actions are open. ${pending.map(item => `${item.id}: ${item.title} (owner: ${item.owner}, due: ${item.due})`).join('; ') || 'All tracked KT actions are complete.'}`, sources: pending.map(item => item.id) } }
  if (q.includes('pending kt')) { const pending = currentSessions.filter(item => item.status !== 'Complete'); return { text: `${pending.length} KT sessions remain in progress, at risk, blocked, or planned.`, sources: pending.slice(0, 5).map(item => item.id) } }
  if (q.includes('missing') || q.includes('documents')) { const missing = documents.filter(item => !received.includes(item.id)); const needsApproval = documents.filter(item => received.includes(item.id) && !approved.includes(item.id)); return { text: `${missing.length} required documents are not yet received, and ${needsApproval.length} received documents still need approval.`, sources: [...missing, ...needsApproval].slice(0, 4).map(item => item.id) } }
  if (q.includes('complete') || q.includes('percentage')) return { text: `Transition completion is ${Math.round(completion)}% based on the current task records across ${transitionTasks.length} seeded activities.`, sources: ['TR-001', 'TR-009', 'TR-017'] }
  if (q.includes('day 60') || q.includes('delay')) { const watch = currentRisks.filter(item => item.status !== 'Complete' && item.status !== 'Approved').slice(0, 3); return { text: 'Day 60 readiness depends on access validation, completed structured KT, usable SOP evidence, and integration ownership. Current open risks include: ' + watch.map(item => item.title).join('; ') + '.', sources: [...watch.map(item => item.id), ...watch.map(item => item.taskId)] } }
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
  if (q.includes('sla')) { const latest = slaTrend.at(-1)!; return { text: `The latest simulated monthly SLA achievement is ${latest.achievement}%, with ${latest.breaches} recorded breaches.`, sources: [latest.id] } }
  if (q.includes('recurring')) return { text: `Recurring clusters include ${problems.map(item => item.title).join('; ')}.`, sources: problems.map(item => item.id) }
  if (q.includes('summary')) { const latest = slaTrend.at(-1)!; return { text: `Operational snapshot: ${incidents.filter(x => x.state !== 'Resolved').length} active incidents in this sample, ${problems.length} tracked problem clusters, and latest simulated SLA achievement of ${latest.achievement}%.`, sources: ['INC1001', 'PRB001', latest.id] } }
  if (q.includes('manager approval') || q.includes('enhancement')) return { text: 'The request touches Employee Center catalog item configuration, Flow Designer approval orchestration, approver-group logic, and the HR integration context. Regression should cover manager lookup, inactive approver fallback, and successful fulfillment.', sources: ['ENH-101', 'DOC-003', 'DOC-004', 'TC-101'] }
  return { text: 'This information is unavailable in the seeded demo dataset. Try one of the suggested questions for a deterministic, source-linked response.', sources: [] }
}
