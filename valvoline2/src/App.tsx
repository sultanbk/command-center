import { useEffect, useRef, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Activity, AlertTriangle, ArrowDownToLine, ArrowLeft, ArrowRight, BookOpen, Bot, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, FileCheck2, FileText, Gauge, GitBranch, LayoutDashboard, ListChecks, Menu, MessageSquare, Network, Printer, RefreshCw, Search, Settings2, ShieldAlert, ShieldCheck, Sparkles, Users, Workflow, X } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { actionItems as seedActionItems, assistantQuestions, documents, enhancements, getAssistantAnswer, graphEdges, graphNodes, incidents, integrations, ktSessions, meetings, milestones, problems, raciRows, raciValues, roles, seedRisks, serviceAvailability, slaBreachEvidence, slaTrend, sops, testCases, transitionPhases, transitionTasks, type ActionItem, type Incident, type KTSession, type Risk, type Status, type TransitionTask } from './data'

const valvolineLogo = new URL('../valvoline-logo.svg', import.meta.url).href
const synaptLogo = new URL('../synapt-logo-new.svg', import.meta.url).href
type LinkItem = { title: string; path: string; icon?: typeof Activity }
type Group = { title: string; icon: typeof Activity; items: LinkItem[] }
const slug = (text: string) => text.toLowerCase().replaceAll(' ', '-').replaceAll('&', 'and')
const groups: Group[] = [
  { title: 'Executive Overview', icon: LayoutDashboard, items: [{ title: 'Executive Overview', path: '/' }] },
  { title: 'Transition', icon: GitBranch, items: ['Executive Dashboard', 'Day -1 to Day 90 Plan', 'KT and Deliverables', 'Governance Calendar', 'RACI', 'Risks and Escalations', 'Team and Readiness'].map(title => ({ title, path: `/transition/${slug(title)}` })) },
  { title: 'Operations', icon: Activity, items: ['Service Health', 'Incident Management', 'SLA Performance', 'Backlog and Aging', 'Problem and RCA', 'Operational Governance'].map(title => ({ title, path: `/operations/${slug(title)}` })) },
  { title: 'Enhancements', icon: Workflow, items: ['Enhancement Pipeline', 'Change Requests', 'Impact Analysis', 'Development and Testing', 'Release Calendar', 'AI SDLC'].map(title => ({ title, path: `/enhancements/${slug(title)}` })) },
  { title: 'Synapt AI', icon: Sparkles, items: ['Knowledge Ingestion', 'Context Knowledge Graph', 'Transition Assistant', 'Operations Assistant', 'Enhancement Assistant'].map(title => ({ title, path: `/synapt/${slug(title)}` })) },
]

const STATUS_OPTIONS: Status[] = ['Complete', 'In progress', 'Not started', 'At risk', 'Blocked', 'Approved', 'Pending']
const formatPercent = (n: number) => `${Math.round(n)}%`
const safeRead = <T,>(key: string, fallback: T): T => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback } catch { return fallback }
}
const simulatedToday = new Date('2026-10-25T12:00:00')
const dateLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(simulatedToday)
const incidentAgeDays = (created: string) => {
  const [year, month, day] = created.split('-').map(Number)
  return Math.max(0, Math.floor((Date.UTC(simulatedToday.getFullYear(), simulatedToday.getMonth(), simulatedToday.getDate()) - Date.UTC(year, month - 1, day)) / 86400000))
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [tasks, setTasks] = useState<TransitionTask[]>(() => safeRead('vv-demo-tasks', transitionTasks))
  const [risks, setRisks] = useState<Risk[]>(() => safeRead('vv-demo-risks', seedRisks))
  const [sessions, setSessions] = useState<KTSession[]>(() => safeRead('vv-demo-kt-sessions', ktSessions))
  const [actions, setActions] = useState<ActionItem[]>(() => safeRead('vv-demo-kt-actions', seedActionItems))
  const [gateChecks, setGateChecks] = useState<boolean[][]>(() => safeRead('vv-demo-phase-gates', [[true, true, false], [true, false, false], [false, false, false], [false, false, false]]))
  const [receivedDocs, setReceivedDocs] = useState<string[]>(() => safeRead('vv-demo-docs', documents.filter(doc => doc.received).map(doc => doc.id)))
  const [approvedDocs, setApprovedDocs] = useState<string[]>(() => safeRead('vv-demo-approved', documents.filter(doc => doc.approved).map(doc => doc.id)))
  const [ingestionRun, setIngestionRun] = useState(false)
  const [ingestionProgress, setIngestionProgress] = useState(0)
  const ingestionTimer = useRef<number | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<{ title: string; body: string; facts?: string[] } | null>(null)
  const recordDrawerRef = useRef<HTMLElement | null>(null)
  const recordCloseRef = useRef<HTMLButtonElement | null>(null)
  const recordReturnFocusRef = useRef<HTMLElement | null>(null)
  const tourReturnFocusRef = useRef<HTMLElement | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [tourState, setTourState] = useState<'closed' | 'welcome' | 'running' | 'complete'>('closed')
  const [chat, setChat] = useState<{ question: string; text: string; sources: string[]; assistantKind: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [openGroup, setOpenGroup] = useState('Transition')

  useEffect(() => { localStorage.setItem('vv-demo-tasks', JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { localStorage.setItem('vv-demo-risks', JSON.stringify(risks)) }, [risks])
  useEffect(() => { localStorage.setItem('vv-demo-kt-sessions', JSON.stringify(sessions)) }, [sessions])
  useEffect(() => { localStorage.setItem('vv-demo-kt-actions', JSON.stringify(actions)) }, [actions])
  useEffect(() => { localStorage.setItem('vv-demo-phase-gates', JSON.stringify(gateChecks)) }, [gateChecks])
  useEffect(() => { localStorage.setItem('vv-demo-docs', JSON.stringify(receivedDocs)) }, [receivedDocs])
  useEffect(() => { localStorage.setItem('vv-demo-approved', JSON.stringify(approvedDocs)) }, [approvedDocs])
  useEffect(() => {
    if (tourState === 'running') {
      setSelectedRecord(null)
      setMobileOpen(false)
      navigate(tourSteps[tourStep].path, { replace: true })
    }
  }, [tourState, tourStep, navigate])
  useEffect(() => {
    const activeGroup = groups.find(group => group.items.some(item => item.path === location.pathname))
    if (activeGroup) setOpenGroup(activeGroup.title)
  }, [location.pathname])
  useEffect(() => {
    if (tourState === 'closed') return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { if (selectedRecord) return; setTourState('closed'); return }
      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === 'ArrowRight' && tourState === 'running') {
        event.preventDefault()
        if (tourStep === tourSteps.length - 1) setTourState('complete')
        else setTourStep(step => step + 1)
      }
      if (event.key === 'ArrowLeft' && tourState === 'running' && tourStep > 0) {
        event.preventDefault()
        setTourStep(step => step - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [tourState, tourStep, selectedRecord])
  useEffect(() => {
    if (tourState !== 'welcome' && tourState !== 'complete') {
      if (tourState === 'closed') { tourReturnFocusRef.current?.focus(); tourReturnFocusRef.current = null }
      return
    }
    const dialog = document.querySelector<HTMLElement>('.tour-scrim .tour-dialog')
    dialog?.setAttribute('tabindex', '-1')
    dialog?.focus()
    const trapDialogFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialog) return
      const focusable = dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
      if (!focusable.length) { event.preventDefault(); dialog.focus(); return }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', trapDialogFocus)
    return () => document.removeEventListener('keydown', trapDialogFocus)
  }, [tourState])
  useEffect(() => {
    if (!selectedRecord && tourState !== 'welcome' && tourState !== 'complete') return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [selectedRecord, tourState])
  useEffect(() => () => { if (ingestionTimer.current !== null) window.clearInterval(ingestionTimer.current) }, [])

  const completed = tasks.filter(task => task.status === 'Complete').length
  const completion = completed / tasks.length * 100
  const remainingDays = Math.max(0, 90 - Math.floor((simulatedToday.getTime() - new Date('2026-10-01T12:00:00').getTime()) / 86400000))
  const riskCount = risks.filter(risk => risk.status !== 'Complete' && risk.status !== 'Approved').length
  const ktDone = sessions.filter(session => session.status === 'Complete').length
  const receivedCount = receivedDocs.length
  const approvedCount = approvedDocs.length
  const accessTask = tasks.find(task => task.id === 'TR-008')
  const accessReady = tasks.filter(task => task.workstream === 'Platform & Access' && task.status === 'Complete').length

  const resetDemo = () => {
    if (ingestionTimer.current !== null) { window.clearInterval(ingestionTimer.current); ingestionTimer.current = null }
    setTasks(transitionTasks); setRisks(seedRisks); setSessions(ktSessions); setActions(seedActionItems); setGateChecks([[true, true, false], [true, false, false], [false, false, false], [false, false, false]]); setReceivedDocs(documents.filter(doc => doc.received).map(doc => doc.id));
    setApprovedDocs(documents.filter(doc => doc.approved).map(doc => doc.id)); setChat([]); setIngestionProgress(0); setIngestionRun(false)
    localStorage.removeItem('vv-demo-tasks'); localStorage.removeItem('vv-demo-risks'); localStorage.removeItem('vv-demo-kt-sessions'); localStorage.removeItem('vv-demo-kt-actions'); localStorage.removeItem('vv-demo-phase-gates'); localStorage.removeItem('vv-demo-docs'); localStorage.removeItem('vv-demo-approved')
    setSelectedRecord({ title: 'Demo data reset', body: 'All editable records have been restored to their seeded sample values.' })
  }
  const runIngestion = () => {
    if (ingestionTimer.current !== null) window.clearInterval(ingestionTimer.current)
    setIngestionRun(true); setIngestionProgress(0)
    ingestionTimer.current = window.setInterval(() => setIngestionProgress(value => {
      if (value >= 100) { if (ingestionTimer.current !== null) window.clearInterval(ingestionTimer.current); ingestionTimer.current = null; setIngestionRun(false); return 100 }
      return Math.min(100, value + 10)
    }), 160)
  }
  const sendQuestion = (question: string, assistantKind: string) => {
    const answer = getAssistantAnswer(question, completion, { sessions, actions, receivedDocs, approvedDocs, risks, assistantKind })
    setChat(previous => [...previous, { question, ...answer, assistantKind }]); setChatInput('')
  }
  const exportCsv = (filename: string, rows: string[][]) => {
    const csv = rows.map(row => row.map(cell => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n')
    const anchor = document.createElement('a'); anchor.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); anchor.download = filename; anchor.click(); URL.revokeObjectURL(anchor.href)
  }
  const title = groups.flatMap(group => group.items).find(item => item.path === location.pathname)?.title ?? 'Executive Overview'
  useEffect(() => {
    if (!selectedRecord) {
      recordReturnFocusRef.current?.focus()
      recordReturnFocusRef.current = null
      return
    }
    recordCloseRef.current?.focus()
    const handleDrawerKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.stopPropagation(); setSelectedRecord(null); return }
      if (event.key !== 'Tab') return
      const focusable = recordDrawerRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) { event.preventDefault(); recordDrawerRef.current?.focus(); return }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleDrawerKeyDown)
    return () => document.removeEventListener('keydown', handleDrawerKeyDown)
  }, [selectedRecord])
  const showRecord = (record: { title: string; body: string; facts?: string[] }) => {
    if (!selectedRecord) recordReturnFocusRef.current = document.activeElement as HTMLElement
    setSelectedRecord(record)
  }
  const startTour = () => { tourReturnFocusRef.current = document.activeElement as HTMLElement; setSelectedRecord(null); setMobileOpen(false); setTourStep(0); setTourState('welcome') }
  const openProposalBrief = () => showRecord({
    title: 'Proposal decision brief',
    body: 'A 90-day ServiceNow managed services transition with governed knowledge transfer, evidence-based readiness gates, and an operational model that connects service performance to controlled improvement. This workspace is a proposal demo; sample data and integrations are simulated.',
    facts: [
      'Scope to confirm: ServiceNow platform, ITSM, Employee Center, CMDB, integrations, knowledge, and transition support.',
      'Timeline assumption: 90 days from mobilization to operational acceptance; confirm the start date and incumbent overlap.',
      'SLA formula: monthly targets met ÷ eligible targets; breach count = eligible targets − met targets.',
      'Response and resolution compliance each use their own eligible-target denominator.',
      'Availability formula: available minutes ÷ scheduled minutes for the stated rolling 30-day period.',
      'Sample incident, SLA, availability, KT, and document records are synthetic and do not represent actual Valvoline performance.',
      'Decision requested: confirm scope, named owners and governance, KPI definitions and source systems, and Day 30/60/90 acceptance criteria.',
    ],
  })
  const pageProps: PageProps = { tasks, setTasks, risks, setRisks, sessions, setSessions, actions, setActions, gateChecks, setGateChecks, receivedDocs, setReceivedDocs, approvedDocs, setApprovedDocs, completion, remainingDays, riskCount, ktDone, receivedCount, approvedCount, accessReady, accessTask, onRecord: showRecord, onExport: exportCsv, ingestionProgress, ingestionRun, runIngestion, chat, chatInput, setChatInput, sendQuestion, navigate, onTour: startTour }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-logos"><img className="brand-valvoline" src={valvolineLogo} alt="Valvoline" /><span>ServiceNow Managed Services</span></div><button className="icon-button close-menu" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
      <div className="side-label">WORKSPACE NAVIGATION</div>
      <nav className="nav-groups" aria-label="Workspace navigation">{groups.map(group => <div className="nav-group" key={group.title}>
        <button type="button" className={`nav-group-title ${group.items.length > 1 && openGroup === group.title ? 'expanded' : ''} ${group.items.length === 1 && location.pathname === '/' ? 'route-active' : ''}`} aria-expanded={group.items.length > 1 && openGroup === group.title} aria-controls={group.items.length > 1 ? `nav-${slug(group.title)}` : undefined} onClick={() => { if (group.items.length === 1) { navigate(group.items[0].path); setMobileOpen(false); return } setOpenGroup(openGroup === group.title ? '' : group.title) }}>
          <group.icon size={17} /><span>{group.title}</span>{group.items.length > 1 && (openGroup === group.title ? <ChevronDown size={15} /> : <ChevronRight size={15} />)}
        </button>
        {group.items.length > 1 && <div className="nav-subitems" id={`nav-${slug(group.title)}`} hidden={openGroup !== group.title}>{group.items.map(item => <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{item.title}</NavLink>)}</div>}
      </div>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-health"><span className="pulse-dot" />Demo environment active<div>Local synthetic records</div></div><button className="reset-button" onClick={resetDemo}><RefreshCw size={15} />Reset demo data</button><div className="powered"><span>POWERED BY</span><img src={synaptLogo} alt="Synapt" /></div></div>
    </aside>
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
    <main className="main-shell">
      <header className="topbar"><button className="icon-button mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={19} /></button><div className="breadcrumbs"><span>Valvoline</span><ChevronRight size={14} /><b>{title}</b></div><div className="top-actions"><div className="demo-label"><span />SIMULATED DEMO DATA</div><button className="button secondary proposal-brief-button" onClick={openProposalBrief}><FileText size={14} />Proposal brief</button><button className="icon-button tour-trigger" title="Start demo tour" onClick={startTour}><CircleHelp size={18} /></button><button className="user-avatar" title="Demo workspace">VV</button></div></header>
      <div className="kpi-strip">
        <button className="top-kpi" onClick={() => navigate('/transition/executive-dashboard')}><span>TRANSITION COMPLETE</span><b>{formatPercent(completion)}</b><div className="mini-track"><i style={{ width: `${completion}%` }} /></div></button>
        <button className="top-kpi" onClick={() => navigate('/transition/day--1-to-day-90-plan')}><span>DAY 90 COUNTDOWN</span><b>{remainingDays} <small>days</small></b><div className="kpi-foot">Target close · Dec 30, 2026</div></button>
        <button className="top-kpi" onClick={() => navigate('/transition/kt-and-deliverables')}><span>KT SESSIONS</span><b>{ktDone}<small> / {ktSessions.length}</small></b><div className="kpi-foot">{ktSessions.length - ktDone} remaining</div></button>
        <button className="top-kpi" onClick={() => navigate('/transition/kt-and-deliverables')}><span>DOCUMENTS APPROVED</span><b>{approvedCount}<small> / {documents.length}</small></b><div className="kpi-foot">{receivedCount} received · {documents.length - receivedCount} missing</div></button>
        <button className="top-kpi risk-kpi" onClick={() => navigate('/transition/risks-and-escalations')}><span>OPEN RISKS</span><b>{riskCount}<small> tracked</small></b><div className="kpi-foot">{risks.filter(risk => risk.severity === 'Critical' && risk.status !== 'Complete').length} critical watch</div></button>
      </div>
      <div className="page-wrap"><div className="page-heading"><div><div className="eyebrow">VALVOLINE · SERVICE TRANSITION OFFICE</div><h1>{title}</h1><p>{pageSubtitle(title)}</p></div><div className="heading-actions"><span className="date-stamp"><CalendarDays size={15} />{dateLabel}</span><button className="button secondary" onClick={() => window.print()} title="Print this view"><Printer size={15} />Print</button><button className="button primary" onClick={startTour}><Sparkles size={15} />Demo tour</button></div></div>
        <Routes>
          <Route path="/" element={<ExecutiveOverview {...pageProps} />} />
          <Route path="/transition/:page" element={<TransitionPage {...pageProps} />} />
          <Route path="/operations/:page" element={<OperationsPage {...pageProps} />} />
          <Route path="/enhancements/:page" element={<EnhancementsPage {...pageProps} />} />
          <Route path="/synapt/:page" element={<SynaptPage {...pageProps} />} />
          <Route path="*" element={<ExecutiveOverview {...pageProps} />} />
        </Routes>
      </div>
    </main>
    {selectedRecord && <div className="drawer-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedRecord(null) }}><aside ref={recordDrawerRef} className="record-drawer" role="dialog" aria-modal="true" aria-labelledby="record-drawer-title" tabIndex={-1} onClick={event => event.stopPropagation()}><div className="drawer-head"><div><div className="eyebrow">RECORD DETAIL</div><h2 id="record-drawer-title">{selectedRecord.title}</h2></div><button ref={recordCloseRef} className="icon-button" onClick={() => setSelectedRecord(null)} aria-label="Close record details"><X size={18} /></button></div><p>{selectedRecord.body}</p>{selectedRecord.facts && <div className="drawer-facts">{selectedRecord.facts.map(fact => <div key={fact}><Check size={15} />{fact}</div>)}</div>}</aside></div>}
    {tourState === 'welcome' && <div className="tour-scrim"><section className="tour-dialog" role="dialog" aria-modal="true" aria-labelledby="tour-welcome-title"><div className="tour-dialog-icon"><Sparkles size={20} /></div><span className="eyebrow">PRESENTER WALKTHROUGH · ABOUT 5 MINUTES</span><h2 id="tour-welcome-title">From transition readiness to service improvement</h2><p>Follow the story from a governed Day 90 transition through knowledge capture, operational health, and a traceable improvement proposal.</p><div className="tour-dialog-meta"><span><Check size={14} />7 stops</span><span><CircleHelp size={14} />Arrow keys work during the tour</span></div><div className="tour-dialog-actions"><button className="button secondary" onClick={() => setTourState('closed')}>Not now</button><button className="button primary" onClick={() => setTourState('running')}>Begin walkthrough <ArrowRight size={15} /></button></div></section></div>}
    {tourState === 'running' && <section className="tour-card" aria-label="Guided demo tour" aria-live="polite" aria-keyshortcuts="ArrowLeft ArrowRight Escape"><div className="tour-card-top"><div className="tour-icon"><Sparkles size={17} /></div><div className="tour-step-meta"><b>STEP {String(tourStep + 1).padStart(2, '0')} / {String(tourSteps.length).padStart(2, '0')}</b><span>{tourSteps[tourStep].section}</span></div><button className="icon-button tour-close" onClick={() => setTourState('closed')} aria-label="End demo tour"><X size={17} /></button></div><div className="tour-progress" aria-hidden="true"><i style={{ width: `${(tourStep + 1) / tourSteps.length * 100}%` }} /></div><h2>{tourSteps[tourStep].title}</h2><p className="tour-narration">{tourSteps[tourStep].narration}</p><div className="tour-card-footer"><button className="button secondary" disabled={tourStep === 0} onClick={() => setTourStep(step => Math.max(0, step - 1))}><ArrowLeft size={14} />Previous</button><button className="button primary" onClick={() => tourStep === tourSteps.length - 1 ? setTourState('complete') : setTourStep(step => step + 1)}>{tourStep === tourSteps.length - 1 ? 'Finish' : 'Continue'}{tourStep === tourSteps.length - 1 ? <Check size={14} /> : <ArrowRight size={14} />}</button></div></section>}
    {tourState === 'complete' && <div className="tour-scrim"><section className="tour-dialog tour-completion" role="dialog" aria-modal="true" aria-labelledby="tour-complete-title"><div className="tour-dialog-icon"><Check size={20} /></div><span className="eyebrow">WALKTHROUGH COMPLETE</span><h2 id="tour-complete-title">A governed transition, ready for continuous improvement.</h2><p>You’ve seen how the plan, knowledge evidence, service signals, and enhancement traceability fit together. The records shown are simulated examples for this proposal.</p><div className="tour-dialog-actions"><button className="button secondary" onClick={() => { setTourStep(0); setTourState('welcome') }}>Run again</button><button className="button primary" onClick={() => setTourState('closed')}>Return to the workspace <Check size={15} /></button></div></section></div>}
  </div>
}

const tourSteps = [
  { path: '/', section: 'EXECUTIVE OVERVIEW', title: 'Transition readiness at a glance', narration: 'A consolidated view of progress, timing, knowledge, access, and risk.' },
  { path: '/transition/day--1-to-day-90-plan', section: 'TRANSITION PLAN', title: 'A structured 90-day handoff', narration: 'Phase-based activities connect owners, deliverables, dependencies, and readiness reviews.' },
  { path: '/transition/kt-and-deliverables', section: 'KNOWLEDGE TRANSFER', title: 'Sessions, actions, and evidence', narration: 'Track knowledge-sharing sessions alongside open questions and document status.' },
  { path: '/synapt/knowledge-ingestion', section: 'KNOWLEDGE WORKSPACE', title: 'Organized transition knowledge', narration: 'Explore sample artifacts and their relationships to transition and service records.' },
  { path: '/synapt/transition-assistant', section: 'TRANSITION ASSISTANT', title: 'Find answers with source records', narration: 'Ask a transition question and inspect the local sample records behind the response.' },
  { path: '/operations/service-health', section: 'SERVICE OPERATIONS', title: 'Operational health and performance', narration: 'Review availability, incident activity, recurring problems, and SLA trends.' },
  { path: '/enhancements/impact-analysis', section: 'CONTINUOUS IMPROVEMENT', title: 'Trace a change through its impact', narration: 'Connect a sample enhancement to affected components and test evidence.' },
]

function pageSubtitle(title: string) {
  const map: Record<string, string> = {
    'Executive Overview': 'One view of transition readiness, service health, and the path to Day 90.', 'Executive Dashboard': 'A consolidated view of transition completion, workstream health, and phase readiness.',
    'Day -1 to Day 90 Plan': 'Manage phase-based execution, dependencies, owners, and acceptance evidence.', 'KT and Deliverables': 'Track knowledge transfer, evidence completeness, and open knowledge actions.',
    'Governance Calendar': 'The operating rhythm for decisions, issue resolution, and readiness governance.', 'RACI': 'Three-party accountability across the transition lifecycle.',
    'Risks and Escalations': 'Monitor transition threats, mitigation ownership, and critical-path exposure.', 'Team and Readiness': 'Role coverage, onboarding, capacity, and continuity into operations.',
    'Service Health': 'A simulated operational pulse across availability, incidents, problems, and SLA performance.', 'Incident Management': 'Search and inspect the seeded incident sample and resolution history.',
    'SLA Performance': 'Review monthly service-level trends and drill into sample breach records.', 'Backlog and Aging': 'Monitor open-ticket volume, aging thresholds, and assignment load.', 'Problem and RCA': 'Connect recurring incidents to root causes, SOPs, and corrective actions.',
    'Operational Governance': 'Daily, weekly, and monthly controls that sustain service quality.', 'Enhancement Pipeline': 'Prioritize demand and move work from intake through release.', 'Change Requests': 'Review approved and proposed changes with value, scope, and effort.',
    'Impact Analysis': 'Explore simulated dependencies for the employee onboarding approval request.', 'Development and Testing': 'Trace enhancement requirements through test evidence and readiness.', 'Release Calendar': 'Coordinate release windows, dependencies, approvals, and rollback readiness.', 'AI SDLC': 'A transparent requirement-to-test-to-release traceability view.',
    'Knowledge Ingestion': 'Simulated document ingestion with evidence identifiers and linked artifacts.', 'Context Knowledge Graph': 'Explore the seeded relationships across modules, work, evidence, and operations.',
    'Transition Assistant': 'Ask repeatable transition questions grounded in the local demo dataset.', 'Operations Assistant': 'Query incident resolution, recurring problems, and current service status.', 'Enhancement Assistant': 'Review cross-module dependencies and test implications for a sample change.',
  }
  return map[title] ?? 'Explore the simulated ServiceNow managed services workspace.'
}

type PageProps = {
  tasks: TransitionTask[]; setTasks: React.Dispatch<React.SetStateAction<TransitionTask[]>>; risks: Risk[]; setRisks: React.Dispatch<React.SetStateAction<Risk[]>>
  sessions: KTSession[]; setSessions: React.Dispatch<React.SetStateAction<KTSession[]>>; actions: ActionItem[]; setActions: React.Dispatch<React.SetStateAction<ActionItem[]>>; gateChecks: boolean[][]; setGateChecks: React.Dispatch<React.SetStateAction<boolean[][]>>
  receivedDocs: string[]; setReceivedDocs: React.Dispatch<React.SetStateAction<string[]>>; approvedDocs: string[]; setApprovedDocs: React.Dispatch<React.SetStateAction<string[]>>
  completion: number; remainingDays: number; riskCount: number; ktDone: number; receivedCount: number; approvedCount: number; accessReady: number; accessTask?: TransitionTask
  onRecord: (record: { title: string; body: string; facts?: string[] }) => void
  onExport: (name: string, rows: string[][]) => void; ingestionProgress: number; ingestionRun: boolean; runIngestion: () => void
  chat: { question: string; text: string; sources: string[]; assistantKind: string }[]; chatInput: string; setChatInput: (v: string) => void; sendQuestion: (question: string, assistantKind: string) => void; navigate: (path: string) => void; onTour: () => void
}

function ExecutiveOverview(props: PageProps) {
  const { tasks, risks, completion, remainingDays, ktDone, receivedCount, approvedCount, accessReady, onRecord, navigate } = props
  const phases = transitionPhases.map(({ name: phase }) => {
    const group = tasks.filter(task => task.phase === phase); return { phase, complete: group.filter(task => task.status === 'Complete').length, total: group.length, percent: group.filter(task => task.status === 'Complete').length / group.length * 100 }
  })
  const workstreams = ['Governance', 'Knowledge', 'Operations', 'Architecture', 'Platform & Access', 'Service Management'].map(workstream => {
    const group = tasks.filter(task => task.workstream === workstream); const score = group.filter(task => task.status === 'Complete').length / group.length
    return { name: workstream, complete: Math.round(score * 100), health: score > .65 ? 'On track' : score > .25 ? 'Watch' : 'At risk' }
  })
  const upcoming = tasks.filter(task => task.status !== 'Complete').slice(0, 5)
  return <>
    <div className="metric-grid">
      <MetricCard label="Transition completion" value={formatPercent(completion)} note={`${tasks.filter(task => task.status === 'Complete').length} of ${tasks.length} activities closed`} icon={Gauge} tone="navy" onClick={() => navigate('/transition/day--1-to-day-90-plan')} progress={completion} />
      <MetricCard label="Days to Day 90" value={String(remainingDays)} note="Target service takeover · Dec 30" icon={Clock3} tone="blue" onClick={() => navigate('/transition/day--1-to-day-90-plan')} />
      <MetricCard label="KT sessions" value={`${ktDone} / ${ktSessions.length}`} note={`${ktSessions.length - ktDone} open or planned`} icon={MessageSquare} tone="red" onClick={() => navigate('/transition/kt-and-deliverables')} progress={ktDone / ktSessions.length * 100} />
      <MetricCard label="Documents approved" value={`${approvedCount} / ${documents.length}`} note={`${receivedCount} received · ${documents.length - receivedCount} outstanding`} icon={FileCheck2} tone="green" onClick={() => navigate('/transition/kt-and-deliverables')} progress={approvedCount / documents.length * 100} />
      <MetricCard label="Access readiness" value={`${accessReady} / ${tasks.filter(task => task.workstream === 'Platform & Access').length}`} note="Access workstream activities complete" icon={ShieldCheck} tone="blue" onClick={() => onRecord({ title: 'Access readiness', body: 'Readiness is calculated from platform and access workstream task records.', facts: ['Access requests tracked to named owners', 'Environment validation follows provisioning', 'Open blockers flow into the risk register'] })} />
      <MetricCard label="Open transition risks" value={String(risks.filter(risk => risk.status !== 'Complete').length)} note={`${risks.filter(risk => risk.severity === 'Critical' && risk.status !== 'Complete').length} critical items require attention`} icon={ShieldAlert} tone="amber" onClick={() => navigate('/transition/risks-and-escalations')} />
    </div>
    <div className="dashboard-grid">
      <section className="panel phase-panel"><PanelHeader title="Phase progress" eyebrow="90-DAY TRANSITION" action="View transition plan" onAction={() => navigate('/transition/day--1-to-day-90-plan')} />
        <div className="phase-list">{phases.map((phase, index) => <div className="phase-row" key={phase.phase}><div className="phase-number">0{index + 1}</div><div className="phase-info"><div className="phase-title"><b>{phase.phase}</b><span>{phase.complete}/{phase.total} tasks</span></div><div className="progress-track"><i style={{ width: `${phase.percent}%` }} /></div></div><div className="phase-percent">{formatPercent(phase.percent)}</div></div>)}</div>
        <div className="phase-footer"><span>Day -1</span><div className="phase-line"><i style={{ width: `${completion}%` }} /></div><span>Day 90</span></div>
      </section>
      <section className="panel chart-panel"><PanelHeader title="Transition execution" eyebrow="TASK COMPLETION" /><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={phases} margin={{ top: 8, right: 10, left: -23, bottom: 0 }}><CartesianGrid stroke="#e8edf2" vertical={false} /><XAxis dataKey="phase" tickLine={false} axisLine={false} tick={{ fill: '#778496', fontSize: 10 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: '#778496', fontSize: 10 }} /><Tooltip /><Bar dataKey="complete" name="Complete" fill="#b51f32" radius={[3, 3, 0, 0]} /><Bar dataKey="total" name="Total tasks" fill="#e9eef3" radius={[3, 3, 0, 0]} /></ComposedChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-red" />Completed tasks</span><span><i className="legend-gray" />Total planned</span></div></section>
      <section className="panel health-panel"><PanelHeader title="Workstream health" eyebrow="DELIVERY CONFIDENCE" action="Open readiness" onAction={() => navigate('/transition/team-and-readiness')} /><div className="health-table"><div className="table-head"><span>Workstream</span><span>Progress</span><span>Health</span></div>{workstreams.map(item => <div className="health-row" key={item.name}><b>{item.name}</b><div className="health-progress"><i style={{ width: `${item.complete}%` }} /></div><StatusPill status={item.health} /></div>)}</div></section>
      <section className="panel health-panel"><PanelHeader title="Milestone status" eyebrow="GOVERNANCE GATES" action="Open transition plan" onAction={() => navigate('/transition/day--1-to-day-90-plan')} /><div className="milestone-list">{milestones.map(item => <button key={item.id} onClick={() => onRecord({ title: `${item.id} · ${item.title}`, body: `Target Day ${item.day} milestone.`, facts: [`Owner: ${item.owner}`, `Status: ${item.status}`, `Evidence: ${item.evidence}`] })}><span><b>{item.title}</b><small>DAY {item.day} · {item.owner}</small></span><StatusPill status={item.status} /></button>)}</div></section>
      <section className="panel upcoming-panel"><PanelHeader title="Upcoming activities" eyebrow="NEXT IN PLAN" action="See all tasks" onAction={() => navigate('/transition/day--1-to-day-90-plan')} /><div className="upcoming-list">{upcoming.map(task => <button className="upcoming-item" key={task.id} onClick={() => onRecord({ title: `${task.id} · ${task.title}`, body: task.acceptance, facts: [`Owner: ${task.owner}`, `Workstream: ${task.workstream}`, `Deliverable: ${task.deliverable}`] })}><div className="activity-date"><b>DAY {task.start}</b><span>{task.phase === 'Pre-Day 0' ? 'PREP' : task.phase.replace('Day ', '')}</span></div><div className="activity-copy"><b>{task.title}</b><span>{task.owner} · {task.workstream}</span></div><ChevronRight size={16} /></button>)}</div></section>
    </div>
  </>
}

function MetricCard({ label, value, note, icon: Icon, tone, onClick, progress }: { label: string; value: string; note: string; icon: typeof Activity; tone: string; onClick?: () => void; progress?: number }) {
  return <button className={`metric-card tone-${tone}`} onClick={onClick}><div className="metric-top"><span>{label}</span><span className="metric-icon"><Icon size={17} /></span></div><strong>{value}</strong><span className="metric-note">{note}</span>{progress !== undefined && <div className="metric-track"><i style={{ width: `${progress}%` }} /></div>}</button>
}
function PanelHeader({ title, eyebrow, action, onAction }: { title: string; eyebrow: string; action?: string; onAction?: () => void }) {
  return <div className="panel-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action && <button className="text-action" onClick={onAction}>{action}<ChevronRight size={14} /></button>}</div>
}
function StatusPill({ status }: { status: string }) { return <span className={`status-pill ${slug(status).replaceAll('-', ' ')}`}>{status}</span> }

function TransitionPage(props: PageProps) {
  const page = useLocation().pathname.split('/').at(-1) ?? ''
  if (page === 'day--1-to-day-90-plan') return <TransitionPlan {...props} />
  if (page === 'kt-and-deliverables') return <KTDeliverables {...props} />
  if (page === 'governance-calendar') return <Governance {...props} />
  if (page === 'raci') return <Raci />
  if (page === 'risks-and-escalations') return <RiskView {...props} />
  if (page === 'team-and-readiness') return <TeamReadiness {...props} />
  return <ExecutiveOverview {...props} />
}

function TransitionPlan({ tasks, setTasks, gateChecks, setGateChecks, onRecord, onExport }: PageProps) {
  const [search, setSearch] = useState('')
  const [phaseFilter, setPhaseFilter] = useState('All')
  const [workstreamFilter, setWorkstreamFilter] = useState('All')
  const [ownerFilter, setOwnerFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const phases = ['All', 'Pre-Day 0', 'Day 0-30', 'Day 30-60', 'Day 60-90']
  const filtered = tasks.filter(task => (phaseFilter === 'All' || task.phase === phaseFilter) && (workstreamFilter === 'All' || task.workstream === workstreamFilter) && (ownerFilter === 'All' || task.owner === ownerFilter) && (statusFilter === 'All' || task.status === statusFilter) && (priorityFilter === 'All' || task.priority === priorityFilter) && `${task.title} ${task.id} ${task.owner} ${task.workstream}`.toLowerCase().includes(search.toLowerCase()))
  const updateStatus = (id: string, status: Status) => setTasks(previous => previous.map(task => task.id === id ? { ...task, status } : task))
  return <>
    <div className="stats-row"><div><b>{tasks.length}</b><span>planned activities</span></div><div><b>{tasks.filter(task => task.status === 'Complete').length}</b><span>complete</span></div><div><b>{tasks.filter(task => task.priority === 'Critical' && task.status !== 'Complete').length}</b><span>critical open</span></div><div className="filter-actions"><SearchControl value={search} onChange={setSearch} placeholder="Search tasks or owners" /><button className="button secondary" onClick={() => onExport('transition-plan.csv', [['ID', 'Task', 'Phase', 'Workstream', 'Owner', 'Status', 'Priority'], ...filtered.map(task => [task.id, task.title, task.phase, task.workstream, task.owner, task.status, task.priority])])}><ArrowDownToLine size={15} />Export CSV</button></div></div>
    <div className="filter-bar"><span className="filter-caption"><Settings2 size={15} />FILTER</span>{phases.map(phase => <button key={phase} className={`filter-chip ${phaseFilter === phase ? 'selected' : ''}`} onClick={() => setPhaseFilter(phase)}>{phase}</button>)}<select value={workstreamFilter} onChange={event => setWorkstreamFilter(event.target.value)} aria-label="Filter by workstream"><option value="All">All workstreams</option>{[...new Set(tasks.map(task => task.workstream))].map(value => <option key={value}>{value}</option>)}</select><select value={ownerFilter} onChange={event => setOwnerFilter(event.target.value)} aria-label="Filter by owner"><option value="All">All owners</option>{[...new Set(tasks.map(task => task.owner))].map(value => <option key={value}>{value}</option>)}</select><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label="Filter by status"><option value="All">All statuses</option>{STATUS_OPTIONS.map(value => <option key={value}>{value}</option>)}</select><select value={priorityFilter} onChange={event => setPriorityFilter(event.target.value)} aria-label="Filter by priority"><option value="All">All priorities</option>{['Critical', 'High', 'Medium'].map(value => <option key={value}>{value}</option>)}</select></div>
    <section className="panel gantt-panel"><PanelHeader title="Integrated transition plan" eyebrow="DAY -1 TO DAY 90" /><div className="gantt-scroll"><div className="gantt-head"><div className="gantt-task-label">Activity / owner</div><div className="gantt-days">{[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map(day => <span key={day}>D{day}</span>)}</div></div><div className="phase-bands"><div /><div className="gantt-days"><span className="pre-band">Pre-Day 0</span><span className="band-30">Day 0-30</span><span className="band-60">Day 30-60</span><span className="band-90">Day 60-90</span></div></div>{filtered.map(task => <div className="gantt-row" key={task.id}><button className="gantt-label" onClick={() => onRecord({ title: `${task.id} · ${task.title}`, body: task.acceptance, facts: [`Owner: ${task.owner}`, `Predecessor: ${task.predecessor}`, `Deliverable: ${task.deliverable}`, `Priority: ${task.priority}`] })}><span className="task-id">{task.id}</span><b>{task.title}</b><small>{task.owner} · {task.workstream}</small></button><div className="gantt-track"><div className={`gantt-bar ${slug(task.status)}`} style={{ left: `${task.start / 90 * 100}%`, width: `${task.duration / 90 * 100}%` }} title={`${task.title}: Day ${task.start} to ${task.start + task.duration}`} /><span className="gantt-today" /></div><select className="gantt-status" value={task.status} onChange={event => updateStatus(task.id, event.target.value as Status)} aria-label={`Status for ${task.id}`}>{STATUS_OPTIONS.map(status => <option key={status}>{status}</option>)}</select></div>)}</div></section>
    <div className="phase-gates">{['Pre-Day 0', 'Day 0-30', 'Day 30-60', 'Day 60-90'].map((phase, index) => <div className="gate-card" key={phase}><span className="gate-number">GATE 0{index + 1}</span><h3>{phase} exit criteria</h3>{['Evidence and deliverables reviewed', 'Open critical dependencies have owners', 'Valvoline acceptance recorded'].map((criterion, checkIndex) => <label key={criterion}><input type="checkbox" checked={gateChecks[index]?.[checkIndex] ?? false} onChange={event => setGateChecks(previous => previous.map((checks, gateIndex) => gateIndex === index ? checks.map((checked, itemIndex) => itemIndex === checkIndex ? event.target.checked : checked) : checks))} />{criterion}</label>)}</div>)}</div>
  </>
}

function KTDeliverables({ sessions, setSessions, actions, setActions, receivedDocs, setReceivedDocs, approvedDocs, setApprovedDocs, onRecord, onExport }: PageProps) {
  const [filter, setFilter] = useState('All')
  const toggle = (ids: string[], setIds: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    const wasIncluded = ids.includes(id)
    setIds(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id])
    if (setIds === setReceivedDocs && wasIncluded) setApprovedDocs(previous => previous.filter(value => value !== id))
  }
  return <>
    <div className="metric-grid compact"><MetricCard label="KT sessions completed" value={`${sessions.filter(session => session.status === 'Complete').length} / ${sessions.length}`} note="Attendance and evidence tracked" icon={MessageSquare} tone="blue" /><MetricCard label="Documents received" value={`${receivedDocs.length} / ${documents.length}`} note={`${documents.length - receivedDocs.length} still outstanding`} icon={FileText} tone="amber" /><MetricCard label="Documents approved" value={`${approvedDocs.length} / ${documents.length}`} note={`${receivedDocs.length - approvedDocs.length} awaiting review`} icon={FileCheck2} tone="green" /><MetricCard label="Open KT questions" value={`${actions.filter(item => item.status !== 'Complete' && item.status !== 'Approved').length}`} note={`${actions.length} tracked actions`} icon={CircleHelp} tone="red" /></div>
    <div className="split-grid"><section className="panel"><PanelHeader title="KT session tracker" eyebrow="KNOWLEDGE TRANSFER" /><div className="table-scroll"><table><thead><tr><th>Session / topic</th><th>SME / attendees</th><th>Planned</th><th>Actual</th><th>Status</th><th>Sign-off</th><th>Evidence</th></tr></thead><tbody>{sessions.map(session => <tr key={session.id} onClick={() => onRecord({ title: `${session.id} · ${session.topic}`, body: 'Session evidence and action ownership are linked to the supporting document. Attendee and question records are simulated for this demonstration.', facts: [`SME: ${session.sme}`, `Attendees: ${session.attendees.join(', ')}`, `Planned: ${session.planned}`, `Actual: ${session.actual ?? 'Not completed'}`, `Evidence: ${session.documentId}`, `Sign-off: ${session.signoff}`] })}><td><b>{session.id}</b><span className="cell-sub">{session.topic}</span></td><td>{session.sme}<span className="cell-sub">{session.attendees.length} attendees</span></td><td>{session.planned}</td><td>{session.actual ?? '—'}</td><td onClick={event => event.stopPropagation()}><select value={session.status} onChange={event => setSessions(previous => previous.map(item => item.id === session.id ? { ...item, status: event.target.value, actual: event.target.value === 'Complete' ? (item.actual ?? '2026-10-25') : item.actual } : item))} aria-label={`Status ${session.id}`}><option>Planned</option><option>In progress</option><option>Complete</option><option>At risk</option><option>Blocked</option></select></td><td><StatusPill status={session.signoff} /></td><td><a className="source-link">{session.documentId}</a></td></tr>)}</tbody></table></div></section>
    <section className="panel"><PanelHeader title="Knowledge actions" eyebrow="OPEN QUESTIONS" /><div className="action-list">{actions.map(item => <div className="action-row" key={item.id}><input type="checkbox" checked={item.status === 'Complete'} onChange={event => setActions(previous => previous.map(action => action.id === item.id ? { ...action, status: event.target.checked ? 'Complete' : 'In progress' } : action))} aria-label={`Complete action ${item.id}`} /><div><b>{item.title}</b><span>{item.owner} · Due {item.due} · {item.id}</span></div><StatusPill status={item.status} /></div>)}</div></section></div>
    <section className="panel documents-panel"><PanelHeader title="Required document register" eyebrow="EVIDENCE REPOSITORY" action="Export register" onAction={() => onExport('document-register.csv', [['ID', 'Document', 'Type', 'Source', 'Received', 'Approved'], ...documents.map(doc => [doc.id, doc.name, doc.type, doc.source, receivedDocs.includes(doc.id) ? 'Yes' : 'No', approvedDocs.includes(doc.id) ? 'Yes' : 'No'])])} /><div className="filter-bar slim"><span className="filter-caption">VIEW</span>{['All', 'Missing', 'Received', 'Needs approval', 'Approved'].map(value => <button key={value} className={`filter-chip ${filter === value ? 'selected' : ''}`} onClick={() => setFilter(value)}>{value}</button>)}</div><div className="table-scroll"><table><thead><tr><th>Document</th><th>Type</th><th>Source ID</th><th>Updated</th><th>Related KT</th><th>Received</th><th>Approved</th></tr></thead><tbody>{documents.filter(doc => filter === 'All' || (filter === 'Missing' && !receivedDocs.includes(doc.id)) || (filter === 'Received' && receivedDocs.includes(doc.id)) || (filter === 'Needs approval' && receivedDocs.includes(doc.id) && !approvedDocs.includes(doc.id)) || (filter === 'Approved' && approvedDocs.includes(doc.id))).map(doc => <tr key={doc.id}><td><b>{doc.name}</b><span className="cell-sub">{doc.id}</span></td><td>{doc.type}</td><td><a className="source-link">{doc.source}</a></td><td>{doc.updated}</td><td>{doc.related}</td><td><input type="checkbox" checked={receivedDocs.includes(doc.id)} onChange={() => toggle(receivedDocs, setReceivedDocs, doc.id)} aria-label={`${doc.id} received`} /></td><td><input type="checkbox" checked={approvedDocs.includes(doc.id)} disabled={!receivedDocs.includes(doc.id)} onChange={() => toggle(approvedDocs, setApprovedDocs, doc.id)} aria-label={`${doc.id} approved`} /></td></tr>)}</tbody></table></div></section>
  </>
}

function Governance({ onRecord, onExport }: PageProps) {
  return <><div className="stats-row"><div><b>{meetings.length}</b><span>governance forums</span></div><div><b>3</b><span>escalation levels</span></div><button className="button secondary" onClick={() => onExport('governance-meeting-summaries.csv', [['ID', 'Meeting', 'Cadence', 'Purpose', 'Participants', 'Agenda', 'Expected output', 'Actions', 'Escalation'], ...meetings.map(meeting => [meeting.id, meeting.name, meeting.cadence, meeting.purpose, meeting.participants, meeting.agenda, meeting.output, meeting.actions, meeting.escalation])])}><ArrowDownToLine size={15} />Download meeting summaries</button></div><div className="meeting-grid">{meetings.map(meeting => <button className="meeting-card panel" key={meeting.id} onClick={() => onRecord({ title: meeting.name, body: meeting.purpose, facts: [`Cadence: ${meeting.cadence}`, `Participants: ${meeting.participants}`, `Agenda: ${meeting.agenda}`, `Expected output: ${meeting.output}`, `Actions: ${meeting.actions}`, `Escalation: ${meeting.escalation}`] })}><span className="meeting-icon"><CalendarDays size={18} /></span><span className="eyebrow">{meeting.id} · {meeting.cadence}</span><h2>{meeting.name}</h2><p>{meeting.purpose}</p><div className="meeting-meta"><span><Users size={14} />{meeting.participants}</span><span><ListChecks size={14} />{meeting.output}</span></div><span className="meeting-open">Open meeting brief <ChevronRight size={15} /></span></button>)}</div></>
}
function Raci() {
  const [party, setParty] = useState('All parties')
  const parties = ['Valvoline', 'Incumbent Vendor', 'Prodapt Transition Lead', 'Prodapt Service Delivery Manager', 'Prodapt Technical SMEs']
  const shown = party === 'All parties' ? parties : [party]
  return <section className="panel raci-panel"><div className="raci-toolbar"><PanelHeader title="Transition accountability matrix" eyebrow="RACI" /><select value={party} onChange={event => setParty(event.target.value)} aria-label="Filter RACI party"><option>All parties</option>{parties.map(value => <option key={value}>{value}</option>)}</select></div><div className="table-scroll"><table className="raci-table"><thead><tr><th>Activity</th>{shown.map(value => <th key={value}>{value}</th>)}</tr></thead><tbody>{raciRows.map((row, i) => <tr key={row}><td><b>{row}</b></td>{parties.map((value, j) => shown.includes(value) && <td key={value}><span className={`raci-cell raci-${raciValues[i][j].toLowerCase()}`}>{raciValues[i][j]}</span></td>)}</tr>)}</tbody></table></div><div className="raci-legend"><b>RACI LEGEND</b><span><i className="raci-cell raci-r">R</i> Responsible · performs the work</span><span><i className="raci-cell raci-a">A</i> Accountable · one final owner</span><span><i className="raci-cell raci-c">C</i> Consulted · two-way input</span><span><i className="raci-cell raci-i">I</i> Informed · kept up to date</span></div></section>
}
function RiskView({ risks, setRisks, onRecord, onExport }: PageProps) {
  const updateStatus = (id: string, status: Status) => setRisks(previous => previous.map(risk => risk.id === id ? { ...risk, status } : risk))
  return <><div className="risk-summary"><div><span>CRITICAL</span><b>{risks.filter(r => r.severity === 'Critical' && r.status !== 'Complete').length}</b><small>Escalate to steering</small></div><div><span>HIGH</span><b>{risks.filter(r => r.severity === 'High' && r.status !== 'Complete').length}</b><small>Active mitigation plans</small></div><div><span>OVERDUE</span><b>{risks.filter(r => r.due < '2026-10-25' && r.status !== 'Complete').length}</b><small>Past due date</small></div><button className="button secondary" onClick={() => onExport('risk-register.csv', [['ID', 'Risk', 'Severity', 'Owner', 'Due', 'Status'], ...risks.map(r => [r.id, r.title, r.severity, r.owner, r.due, r.status])])}><ArrowDownToLine size={15} />Export risk register</button></div><section className="panel"><PanelHeader title="Transition risk register" eyebrow="RISK AND ESCALATION" /><div className="table-scroll"><table><thead><tr><th>Risk</th><th>Severity</th><th>Owner / due</th><th>Mitigation</th><th>Linked task</th><th>Status</th></tr></thead><tbody>{risks.map(risk => <tr key={risk.id} className={risk.severity === 'Critical' ? 'critical-row' : ''} onClick={() => onRecord({ title: `${risk.id} · ${risk.title}`, body: risk.impact, facts: [`Mitigation: ${risk.mitigation}`, `Escalation: ${risk.severity === 'Critical' ? 'Executive steering' : 'Weekly transition governance'}`, `Linked dependency: ${risk.taskId}`] })}><td><b>{risk.id}</b><span className="cell-sub">{risk.title}</span></td><td><StatusPill status={risk.severity} /></td><td>{risk.owner}<span className="cell-sub">Due {risk.due}</span></td><td className="mitigation-cell">{risk.mitigation}</td><td><a className="source-link">{risk.taskId}</a></td><td onClick={event => event.stopPropagation()}><select value={risk.status} onChange={event => updateStatus(risk.id, event.target.value as Status)} aria-label={`Status ${risk.id}`}>{STATUS_OPTIONS.map(status => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div></section><section className="escalation-flow"><span className="eyebrow">SAMPLE ESCALATION WORKFLOW</span><div><span className="flow-node">Workstream owner</span><ArrowRight size={16} /><span className="flow-node">Transition Lead · 24h</span><ArrowRight size={16} /><span className="flow-node">Weekly governance</span><ArrowRight size={16} /><span className="flow-node critical">Executive steering</span></div></section></>
}
function TeamReadiness({ tasks }: PageProps) {
  return <><div className="team-grid">{roles.map((role, i) => <article className="role-card panel" key={role.title}><div className="role-icon"><Users size={18} /></div><span className="eyebrow">ROLE {String(i + 1).padStart(2, '0')}</span><h2>{role.title}</h2><p>{role.responsibility}</p><div className="role-meta"><span>Capacity<b>{role.capacity}</b></span><span>Onboarding<StatusPill status={role.onboarding} /></span></div><div className="role-continuity"><span>OPERATIONS CONTINUITY</span><b>{role.continuity}</b></div></article>)}</div><section className="panel readiness-panel"><PanelHeader title="Workstream and phase exit readiness" eyebrow="READINESS CHECKPOINTS" /><div className="readiness-grid">{['Governance', 'Platform & Access', 'Knowledge', 'Architecture', 'Operations', 'Service Management'].map(stream => { const records = tasks.filter(task => task.workstream === stream); const percent = records.filter(task => task.status === 'Complete').length / records.length * 100; return <div key={stream}><div><b>{stream}</b><span>{Math.round(percent)}%</span></div><div className="progress-track"><i style={{ width: `${percent}%` }} /></div><small>{records.filter(task => task.status === 'Complete').length}/{records.length} evidence items accepted</small></div> })}</div></section></>
}

function OperationsPage(props: PageProps) {
  const page = useLocation().pathname.split('/').at(-1) ?? ''
  if (page === 'incident-management') return <IncidentManagement {...props} />
  if (page === 'sla-performance') return <SlaPerformance {...props} />
  if (page === 'backlog-and-aging') return <Backlog {...props} />
  if (page === 'problem-and-rca') return <ProblemRca {...props} />
  if (page === 'operational-governance') return <OperationalGovernance {...props} />
  return <ServiceHealth {...props} />
}

function ServiceHealth({ navigate, onRecord }: PageProps) {
  const open = incidents.filter(item => item.state !== 'Resolved')
  const priority = open.filter(item => item.priority === 'P1').length
  const p2Open = open.filter(item => item.priority === 'P2').length
  const riskLevel = priority ? 'Elevated' : p2Open ? 'Watch' : 'Healthy'
  const customerImpact = priority ? 'High' : p2Open ? 'Moderate' : 'Low'
  return <><div className="metric-grid"><MetricCard label="Service availability" value={`${(serviceAvailability.availableMinutes / serviceAvailability.scheduledMinutes * 100).toFixed(2)}%`} note={`${serviceAvailability.period}: ${serviceAvailability.scheduledMinutes - serviceAvailability.availableMinutes} minutes unavailable`} onClick={() => onRecord({ title: serviceAvailability.id, body: 'Service availability sample.', facts: [`Available minutes: ${serviceAvailability.availableMinutes}`, `Scheduled minutes: ${serviceAvailability.scheduledMinutes}`] })} icon={Activity} tone="green" /><MetricCard label="Priority incidents" value={String(priority)} note="Open P1 incidents" icon={AlertTriangle} tone="red" onClick={() => navigate('/operations/incident-management')} /><MetricCard label="Open problems" value={String(problems.length)} note="Recurring clusters under review" icon={GitBranch} tone="amber" onClick={() => navigate('/operations/problem-and-rca')} /><MetricCard label="SLA achievement" value={`${slaTrend.at(-1)?.achievement}%`} note="Latest monthly sample" icon={Gauge} tone="blue" onClick={() => navigate('/operations/sla-performance')} /></div>
    <div className="dashboard-grid"><section className="panel chart-panel"><PanelHeader title="SLA achievement trend" eyebrow="SIX-MONTH VIEW" action="Open SLA detail" onAction={() => navigate('/operations/sla-performance')} /><div className="chart-area tall"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={slaTrend}><CartesianGrid stroke="#e8edf2" vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} /><YAxis domain={[94, 100]} tickLine={false} axisLine={false} /><YAxis yAxisId="right" orientation="right" allowDecimals={false} tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="breaches" name="Breach count" fill="#e6ebf0" yAxisId="right" /><Line dataKey="achievement" name="SLA achievement %" stroke="#b51f32" strokeWidth={3} dot={{ r: 4 }} /></ComposedChart></ResponsiveContainer></div></section><section className="panel health-panel"><PanelHeader title="Current service pulse" eyebrow="SIMULATED HEALTH" /><div className="service-pulse"><div className="pulse-score"><b>{riskLevel}</b><span>Current risk level</span></div><div className="pulse-row"><span>Active incidents</span><b>{open.length}</b><StatusPill status={open.length ? 'Watch' : 'On track'} /></div><div className="pulse-row"><span>Open P1 / P2</span><b>{open.filter(i => i.priority === 'P1' || i.priority === 'P2').length}</b><StatusPill status={priority ? 'At risk' : p2Open ? 'Watch' : 'On track'} /></div><div className="pulse-row"><span>Customer impact</span><b>{customerImpact}</b><StatusPill status={priority ? 'At risk' : p2Open ? 'Watch' : 'On track'} /></div><div className="pulse-row"><span>Problem actions</span><b>{problems.length}</b><StatusPill status="In progress" /></div></div></section><section className="panel upcoming-panel"><PanelHeader title="Recent incident activity" eyebrow="LATEST RECORDS" action="All incidents" onAction={() => navigate('/operations/incident-management')} /><div className="recent-incidents">{incidents.slice(0, 6).map(item => <button key={item.id} onClick={() => showIncident(onRecord, item)}><StatusPill status={item.priority} /><b>{item.id}</b><span>{item.service}</span><ChevronRight size={15} /></button>)}</div></section><section className="panel health-panel"><PanelHeader title="Service controls" eyebrow="OPERATING MODEL" /><div className="control-list">{['Daily operational review', 'Major incident escalation', 'Problem management and RCA', 'Knowledge article validation', 'Monthly SLA governance'].map((item, i) => <div key={item}><span className="control-check"><Check size={13} /></span><b>{item}</b><span>{['08:30', 'On trigger', 'Weekly', 'Monthly', 'Monthly'][i]}</span></div>)}</div></section></div></>
}

function showIncident(onRecord: PageProps['onRecord'], item: Incident) {
  const history = [
    `${item.created} · Incident reported and categorized as ${item.priority}.`,
    `${item.created} · Assigned to ${item.owner} for ${item.service} support.`,
    item.state === 'Resolved' ? `${item.resolved} · ${item.resolution}.` : `${item.created} · Investigation remains in progress; next update is pending.`,
  ]
  onRecord({ title: `${item.id} · ${item.shortDescription}`, body: item.resolution, facts: [`Service: ${item.service}`, `Priority: ${item.priority} · ${item.state}`, `Category: ${item.category}`, `Assigned to: ${item.owner}`, `Created: ${item.created} · Resolved: ${item.resolved}`, `Root cause: ${item.rca}`, `Related problem: ${item.problemId}`, ...history.map(entry => `History: ${entry}`)] })
}

function IncidentManagement({ onRecord, onExport }: PageProps) {
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [serviceFilter, setServiceFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const filtered = incidents.filter(item => (priorityFilter === 'All' || item.priority === priorityFilter) && (serviceFilter === 'All' || item.service === serviceFilter) && (categoryFilter === 'All' || item.category === categoryFilter) && (statusFilter === 'All' || item.state === statusFilter) && `${item.id} ${item.service} ${item.owner} ${item.rca} ${item.resolution}`.toLowerCase().includes(search.toLowerCase()))
  return <><div className="stats-row"><div><b>{incidents.length}</b><span>sample incidents</span></div><div><b>{incidents.filter(x => x.state !== 'Resolved').length}</b><span>active</span></div><div><b>{incidents.filter(x => x.priority === 'P1').length}</b><span>P1 records</span></div><div className="filter-actions"><SearchControl value={search} onChange={setSearch} placeholder="Search ID, service, owner or RCA" /><button className="button secondary" onClick={() => onExport('incident-sample.csv', [['ID', 'Service', 'Priority', 'State', 'Owner', 'Created', 'RCA'], ...filtered.map(i => [i.id, i.service, i.priority, i.state, i.owner, i.created, i.rca])])}><ArrowDownToLine size={15} />Export</button></div></div><div className="filter-bar"><span className="filter-caption">FILTER</span><select value={priorityFilter} onChange={event => setPriorityFilter(event.target.value)} aria-label="Filter incidents by priority"><option>All</option>{['P1', 'P2', 'P3', 'P4'].map(value => <option key={value}>{value}</option>)}</select><select value={serviceFilter} onChange={event => setServiceFilter(event.target.value)} aria-label="Filter incidents by service"><option>All</option>{[...new Set(incidents.map(item => item.service))].map(value => <option key={value}>{value}</option>)}</select><select value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)} aria-label="Filter incidents by category"><option>All</option>{[...new Set(incidents.map(item => item.category))].map(value => <option key={value}>{value}</option>)}</select><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label="Filter incidents by status"><option>All</option>{[...new Set(incidents.map(item => item.state))].map(value => <option key={value}>{value}</option>)}</select><span className="table-result">Showing {filtered.length} of {incidents.length} records</span></div><section className="panel"><div className="table-scroll"><table><thead><tr><th>Ticket</th><th>Service / category</th><th>Priority</th><th>State</th><th>Owner</th><th>Created</th><th>Resolution</th></tr></thead><tbody>{filtered.map(item => <tr key={item.id} onClick={() => showIncident(onRecord, item)}><td><a className="source-link">{item.id}</a></td><td><b>{item.service}</b><span className="cell-sub">{item.category}</span></td><td><StatusPill status={item.priority} /></td><td><StatusPill status={item.state} /></td><td>{item.owner}</td><td>{item.created}</td><td className="resolution-cell">{item.resolution}</td></tr>)}</tbody></table></div></section></>
}

function SlaPerformance({ onRecord }: PageProps) {
  const breaches = slaTrend.reduce((sum, month) => sum + month.breaches, 0)
  const responseCompliance = slaTrend.reduce((sum, item) => sum + item.responseCompliance, 0) / slaTrend.length
  const resolutionCompliance = slaTrend.reduce((sum, item) => sum + item.resolutionCompliance, 0) / slaTrend.length
  const reasonTotals = slaTrend.reduce<Record<string, number>>((totals, item) => {
    Object.entries(item.breachReasons).forEach(([reason, count]) => { totals[reason] = (totals[reason] ?? 0) + count })
    return totals
  }, {})
  return <><div className="metric-grid compact"><MetricCard label="Latest achievement" value={`${slaTrend.at(-1)?.achievement}%`} note="Monthly target ≥ 97%" icon={Gauge} tone="green" /><MetricCard label="Six-month breaches" value={String(breaches)} note="Counts reconcile to monthly records" icon={AlertTriangle} tone="red" /><MetricCard label="Response compliance" value={`${responseCompliance.toFixed(1)}%`} note="Six-month average" icon={Clock3} tone="blue" /><MetricCard label="Resolution compliance" value={`${resolutionCompliance.toFixed(1)}%`} note="Six-month average" icon={Check} tone="green" /></div><div className="split-grid"><section className="panel"><PanelHeader title="Achievement and breaches" eyebrow="MONTHLY TREND" /><div className="chart-area tall"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={slaTrend}><CartesianGrid stroke="#e8edf2" vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} /><YAxis yAxisId="left" domain={[94, 100]} tickLine={false} axisLine={false} /><YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} /><Tooltip /><Bar yAxisId="right" dataKey="breaches" fill="#e8edf2" radius={[3, 3, 0, 0]} /><Line yAxisId="left" dataKey="achievement" stroke="#b51f32" strokeWidth={3} /></ComposedChart></ResponsiveContainer></div></section><section className="panel"><PanelHeader title="Breach reasons" eyebrow="SAMPLE CLASSIFICATION" /><div className="breach-list">{Object.entries(reasonTotals).map(([name, value]) => { const linkedIncidents = (slaBreachEvidence[name] ?? []).map(id => incidents.find(item => item.id === id)).filter((item): item is Incident => Boolean(item)); return <div key={name}><span>{name}</span><b>{value}</b><div className="progress-track"><i style={{ width: `${breaches ? value / breaches * 100 : 0}%` }} /></div><button className="source-link" onClick={() => onRecord({ title: `${name} · sample ticket evidence`, body: `Representative incident records linked to this simulated SLA breach category. These are evidence samples, not a one-to-one count of the monthly breach total.`, facts: linkedIncidents.map(item => `${item.id} · ${item.service} · ${item.priority} · ${item.rca}`) })}>View {linkedIncidents.length} sample tickets</button></div> })}</div></section></div><section className="panel"><PanelHeader title="SLA sample by month" eyebrow="DRILL-DOWN RECORDS" /><div className="table-scroll"><table><thead><tr><th>Month</th><th>Achievement</th><th>Breach count</th><th>Response compliance</th><th>Resolution compliance</th><th>Report</th></tr></thead><tbody>{slaTrend.map(item => <tr key={item.month} onClick={() => onRecord({ title: item.id, body: 'Simulated monthly SLA report.', facts: [`Achievement: ${item.achievement}%`, `Breaches: ${item.breaches}`, `Response compliance: ${item.responseCompliance}%`, `Resolution compliance: ${item.resolutionCompliance}%`] })}><td><b>2026 {item.month}</b></td><td>{item.achievement}%</td><td><StatusPill status={String(item.breaches)} /></td><td>{item.responseCompliance.toFixed(1)}%</td><td>{item.resolutionCompliance.toFixed(1)}%</td><td><a className="source-link">{item.id}</a></td></tr>)}</tbody></table></div></section></>
}

function Backlog({ onRecord }: PageProps) {
  const open = incidents.filter(item => item.state !== 'Resolved')
  const data = ['P1', 'P2', 'P3', 'P4'].map(priority => ({ priority, count: open.filter(item => item.priority === priority).length }))
  const agingBands = [['0-3 days', (age: number) => age <= 3, 'Within working window'], ['4-7 days', (age: number) => age > 3 && age <= 7, 'Monitor'], ['8-14 days', (age: number) => age > 7 && age <= 14, 'Owner action due'], ['15+ days', (age: number) => age > 14, 'Escalate']] as const
  const agingCounts = agingBands.map(([label, matches, text]) => ({ label, count: open.filter(item => matches(incidentAgeDays(item.created))).length, text }))
  const olderThan7 = open.filter(item => incidentAgeDays(item.created) > 7).length
  const olderThan14 = open.filter(item => incidentAgeDays(item.created) > 14).length
  const oldest = open.reduce<Incident | undefined>((result, item) => !result || incidentAgeDays(item.created) > incidentAgeDays(result.created) ? item : result, undefined)
  return <><div className="metric-grid compact"><MetricCard label="Open backlog" value={String(open.length)} note="Across all sample services" icon={ListChecks} tone="blue" /><MetricCard label="Older than 7 days" value={String(olderThan7)} note="Requires owner review" icon={Clock3} tone="amber" /><MetricCard label="Older than 14 days" value={String(olderThan14)} note="Escalation threshold" icon={AlertTriangle} tone="red" /><MetricCard label="Oldest open item" value={oldest ? `${incidentAgeDays(oldest.created)} days` : '—'} note={oldest ? `${oldest.id} · ${oldest.priority}` : 'No open incidents'} icon={CalendarDays} tone="navy" /></div><div className="split-grid"><section className="panel"><PanelHeader title="Open backlog by priority" eyebrow="CURRENT SAMPLE" /><div className="chart-area tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="#e8edf2" vertical={false} /><XAxis dataKey="priority" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="count" fill="#bd2838" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></section><section className="panel"><PanelHeader title="Aging threshold" eyebrow="OWNER REVIEW" /><div className="aging-list">{agingCounts.map(({ label, count, text }) => <div key={label}><b>{label}</b><span>{count} tickets</span><small>{text}</small></div>)}</div></section></div><section className="panel"><PanelHeader title="Active ticket owner drilldown" eyebrow="OPEN ITEMS" /><div className="table-scroll"><table><thead><tr><th>Ticket</th><th>Priority</th><th>Service</th><th>Age band</th><th>Assignment group</th><th>Owner</th></tr></thead><tbody>{open.slice(0, 12).map(item => { const age = incidentAgeDays(item.created); const band = agingCounts.find(({ label, }) => label === (age <= 3 ? '0-3 days' : age <= 7 ? '4-7 days' : age <= 14 ? '8-14 days' : '15+ days'))?.label ?? '15+ days'; return <tr key={item.id} onClick={() => showIncident(onRecord, item)}><td><a className="source-link">{item.id}</a></td><td><StatusPill status={item.priority} /></td><td>{item.service}</td><td>{band}</td><td>{item.service} Support</td><td>{item.owner}</td></tr> })}</tbody></table></div></section></>
}

function ProblemRca({ onRecord }: PageProps) {
  const openSop = (sopId: string) => {
    const sop = sops.find(item => item.id === sopId)
    if (!sop) return
    const doc = documents.find(item => item.id === sop.documentId)
    onRecord({ title: `${sop.id} · ${sop.title}`, body: `Applicable to ${sop.module}.`, facts: [`Evidence document: ${sop.documentId}${doc ? ` · ${doc.name}` : ''}`, `Related problem: ${sop.problemId}`] })
  }
  const openEnhancement = (enhancementId: string) => {
    const item = enhancements.find(record => record.id === enhancementId)
    if (item) onRecord({ title: `${item.id} · ${item.title}`, body: item.value, facts: [`Component: ${item.component}`, `Owner: ${item.owner}`, `State: ${item.state}`, `Estimate: ${item.estimate}`] })
  }
  return <><div className="problem-grid">{problems.map(problem => <button className="problem-card panel" key={problem.id} onClick={() => onRecord({ title: `${problem.id} · ${problem.title}`, body: `Root cause: ${problem.cause}`, facts: [`Related incidents: ${problem.incidents}`, `Recommended action: ${problem.action}`, `Linked SOP: ${problem.sop}`, `Related change: ${problem.enhancementId}`] })}><span className="eyebrow">PROBLEM RECORD · {problem.id}</span><h2>{problem.title}</h2><div className="cause-line"><span>ROOT CAUSE</span><b>{problem.cause}</b></div><div className="problem-links"><span><Activity size={14} />{problem.incidents} related incidents</span><span><BookOpen size={14} />{problem.sop}</span></div><div className="recommendation"><b>Recommended action</b><span>{problem.action}</span></div><span className="meeting-open">Inspect RCA <ChevronRight size={15} /></span></button>)}</div><section className="panel"><PanelHeader title="Recurring incident clusters" eyebrow="CROSS-LINKED OPERATIONS" /><div className="table-scroll"><table><thead><tr><th>Problem</th><th>Root cause</th><th>Incident sample</th><th>Applicable SOP</th><th>Recommended enhancement</th></tr></thead><tbody>{problems.map(problem => <tr key={problem.id}><td><a className="source-link" onClick={() => onRecord({ title: `${problem.id} · ${problem.title}`, body: `Root cause: ${problem.cause}`, facts: [`Related incidents: ${problem.incidents}`, `Recommended action: ${problem.action}`, `SOP: ${problem.sop}`, `Enhancement: ${problem.enhancementId}`] })}>{problem.id}</a><span className="cell-sub">{problem.title}</span></td><td>{problem.cause}</td><td>{incidents.filter(item => item.problemId === problem.id).slice(0, 2).map(item => <a className="source-link" key={item.id} onClick={() => showIncident(onRecord, item)}>{item.id} </a>)}</td><td><a className="source-link" onClick={() => openSop(problem.sop)}>{problem.sop}</a></td><td><a className="source-link" onClick={() => openEnhancement(problem.enhancementId)}>{problem.enhancementId}</a></td></tr>)}</tbody></table></div></section></>
}

function OperationalGovernance({ onRecord }: PageProps) {
  const reviews = [{ title: 'Daily operations review', cadence: 'Daily · 08:30', purpose: 'Review P1/P2 status, aging and overnight changes.', output: 'Priority incident actions and owner commitments', participants: 'Service Delivery Manager, Service Desk, platform SMEs' }, { title: 'Weekly service review', cadence: 'Weekly · Tuesday', purpose: 'Review service trends, problems, risks and improvement work.', output: 'Service review pack and improvement actions', participants: 'Valvoline service owner, Prodapt delivery and workstream leads' }, { title: 'Monthly SLA review', cadence: 'Monthly · Week 1', purpose: 'Validate attainment, breach reasons and corrective actions.', output: 'Approved SLA report and service credits review', participants: 'Valvoline IT leadership, service management, Prodapt leadership' }, { title: 'Continuous improvement register', cadence: 'Continuous', purpose: 'Track operational improvements from idea through measured outcome.', output: 'Prioritized improvement pipeline', participants: 'Operations and enhancement governance' }]
  const latestSla = slaTrend.at(-1)!
  const outcomes = ['3 actions assigned; no major incident open', 'Problem ownership confirmed for 5 recurring clusters', `${latestSla.achievement}% monthly attainment and ${latestSla.breaches} breaches reviewed`, '12 improvements prioritized across service and platform']
  return <div className="meeting-grid">{reviews.map((review, i) => <button className="meeting-card panel" key={review.title} onClick={() => onRecord({ title: review.title, body: review.purpose, facts: [`Cadence: ${review.cadence}`, `Participants: ${review.participants}`, `Expected output: ${review.output}`, `Sample report: OPS-REP-0${i + 1}`, `Last outcome: ${outcomes[i]}`] })}><span className="meeting-icon"><CalendarDays size={18} /></span><span className="eyebrow">{review.cadence}</span><h2>{review.title}</h2><p>{review.purpose}</p><div className="meeting-meta"><span><Users size={14} />{review.participants}</span><span><FileText size={14} />{review.output}</span></div><span className="meeting-open">Open sample summary <ChevronRight size={15} /></span></button>)}</div>
}

function EnhancementsPage(props: PageProps) {
  const page = useLocation().pathname.split('/').at(-1) ?? ''
  if (page === 'change-requests') return <ChangeRequests {...props} />
  if (page === 'impact-analysis') return <ImpactAnalysis {...props} />
  if (page === 'development-and-testing' || page === 'ai-sdlc') return <DevelopmentTesting {...props} />
  if (page === 'release-calendar') return <ReleaseCalendar {...props} />
  return <EnhancementPipeline {...props} />
}

function EnhancementPipeline({ onRecord, onExport }: PageProps) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const stages = ['Intake', 'Prioritization', 'Impact analysis', 'Approved', 'Development', 'Testing', 'Release ready']
  const filtered = enhancements.filter(item => (filter === 'All' || item.state === filter || item.priority === filter) && `${item.id} ${item.title} ${item.component} ${item.owner}`.toLowerCase().includes(search.toLowerCase()))
  return <><div className="stats-row"><div><b>{enhancements.length}</b><span>requests</span></div><div><b>{enhancements.filter(item => item.state === 'Approved' || item.state === 'Development').length}</b><span>approved / active</span></div><div><b>{enhancements.filter(item => item.state === 'Testing').length}</b><span>in testing</span></div><div className="filter-actions"><SearchControl value={search} onChange={setSearch} placeholder="Search enhancements" /><button className="button secondary" onClick={() => onExport('enhancement-pipeline.csv', [['ID', 'Title', 'State', 'Priority', 'Owner', 'Estimate'], ...filtered.map(item => [item.id, item.title, item.state, item.priority, item.owner, item.estimate])])}><ArrowDownToLine size={15} />Export</button></div></div><div className="filter-bar"><span className="filter-caption">STAGE</span><button className={`filter-chip ${filter === 'All' ? 'selected' : ''}`} onClick={() => setFilter('All')}>All</button>{stages.map(stage => <button className={`filter-chip ${filter === stage ? 'selected' : ''}`} key={stage} onClick={() => setFilter(stage)}>{stage}</button>)}</div><div className="kanban-board">{stages.map((stage, index) => <section className="kanban-column" key={stage}><div className="kanban-heading"><span>{stage}</span><b>{filtered.filter(item => item.state === stage).length}</b></div>{filtered.filter(item => item.state === stage).map(item => <button className="kanban-card" key={item.id} onClick={() => onRecord({ title: `${item.id} · ${item.title}`, body: item.value, facts: [`State: ${item.state}`, `Priority: ${item.priority}`, `Component: ${item.component}`, `Owner: ${item.owner}`, `Estimate: ${item.estimate}`] })}><div><span>{item.id}</span><StatusPill status={item.priority} /></div><b>{item.title}</b><span className="kanban-component">{item.component}</span><div className="kanban-foot"><span>{item.owner}</span><span>{item.estimate}</span></div></button>)}{filtered.filter(item => item.state === stage).length === 0 && <div className="kanban-empty">No items</div>}{index < stages.length - 1 && <span className="kanban-next"><ArrowRight size={13} /></span>}</section>)}</div><section className="panel pipeline-table"><PanelHeader title="Request register" eyebrow="PRIORITIZED DEMAND" /><div className="table-scroll"><table><thead><tr><th>Request</th><th>Business value</th><th>Component</th><th>Owner</th><th>Estimate</th><th>State</th></tr></thead><tbody>{filtered.map(item => <tr key={item.id} onClick={() => onRecord({ title: `${item.id} · ${item.title}`, body: item.value, facts: [`Component: ${item.component}`, `Owner: ${item.owner}`, `Estimate: ${item.estimate}`] })}><td><b>{item.id}</b><span className="cell-sub">{item.title}</span></td><td>{item.value}</td><td>{item.component}</td><td>{item.owner}</td><td>{item.estimate}</td><td><StatusPill status={item.state} /></td></tr>)}</tbody></table></div></section></>
}

function ChangeRequests({ onRecord }: PageProps) {
  const approved = enhancements.filter(item => item.approvalState === 'Approved').length
  const pending = enhancements.filter(item => item.approvalState === 'Pending').length
  return <><div className="stats-row"><div><b>{enhancements.length}</b><span>change requests</span></div><div><b>{approved}</b><span>approved</span></div><div><b>{pending}</b><span>approval pending</span></div><button className="button secondary" onClick={() => window.print()}><Printer size={15} />Print change summary</button></div><section className="panel"><PanelHeader title="Change request register" eyebrow="BUSINESS VALUE AND APPROVAL" /><div className="table-scroll"><table><thead><tr><th>Request ID</th><th>Description</th><th>Business value</th><th>Components</th><th>Owner</th><th>Estimate</th><th>Approval</th></tr></thead><tbody>{enhancements.map(item => <tr key={item.id} onClick={() => onRecord({ title: `${item.id} · ${item.title}`, body: item.value, facts: [`Affected component: ${item.component}`, `Owner: ${item.owner}`, `Estimate: ${item.estimate}`, `Delivery stage: ${item.state}`, `Approval state: ${item.approvalState}`] })}><td><a className="source-link">{item.id}</a></td><td><b>{item.title}</b></td><td>{item.value}</td><td>{item.component}</td><td>{item.owner}</td><td>{item.estimate}</td><td><StatusPill status={item.approvalState} /></td></tr>)}</tbody></table></div></section></>
}

function ImpactAnalysis({ onRecord }: PageProps) {
  const nodeDescriptions: Record<string, string> = { 'Employee onboarding catalog item': 'The requested catalog item captures employee identity and organization context.', 'Manager lookup flow': 'Flow Designer resolves the manager and initiates an approval task.', 'Approval rules': 'Approval logic routes to the manager with a fallback exception path.', 'HR integration': 'HR source attributes supply manager and department information.', 'Notification template': 'The requester and manager receive status notifications.', 'Regression suite': 'Test coverage validates happy path, missing manager and timeout scenarios.' }
  const nodes = Object.keys(nodeDescriptions)
  return <><div className="impact-banner"><div className="impact-symbol"><Workflow size={20} /></div><div><span className="eyebrow">SIMULATED RECOMMENDATION · ENH-101</span><h2>Manager approval for employee onboarding</h2><p>Add a manager approval step to the employee onboarding service catalog request.</p></div><StatusPill status="Impact analysis" /></div><div className="impact-layout"><section className="panel dependency-panel"><PanelHeader title="Architecture dependency graph" eyebrow="CONNECTED COMPONENTS" /><div className="dependency-canvas">{nodes.map((name, index) => { const position = [[50, 13], [25, 34], [50, 49], [78, 35], [24, 70], [68, 77]][index]; return <button key={name} className={`dependency-node dep-${index}`} style={{ left: `${position[0]}%`, top: `${position[1]}%` }} onClick={() => onRecord({ title: name, body: nodeDescriptions[name], facts: [`Related request: ENH-101`, `Evidence: ${['DOC-003', 'DOC-003', 'DOC-002', 'DOC-004', 'DOC-008', 'TC-101'][index]}`, `Recommendation is simulated, not an implemented change.`] })}><span>{index < 4 ? <Workflow size={16} /> : <FileCheck2 size={16} />}</span>{name}</button> })}<svg className="dependency-lines" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 20 L27 34 M50 20 L50 47 M50 20 L76 35 M27 42 L27 68 M50 56 L68 74 M76 42 L53 50 M50 56 L50 74" /></svg></div></section><section className="panel impact-detail"><PanelHeader title="Impact assessment" eyebrow="SIMULATED ANALYSIS" /><div className="impact-list">{[['Catalog item', 'Employee Onboarding Request'], ['Flow Designer', 'Manager approval orchestration'], ['Approval logic', 'Manager lookup with fallback routing'], ['Business rules', 'Validate manager and department values'], ['Integration', 'HR feed supplies manager attributes'], ['Test scenarios', '6 functional · 2 regression · 1 exception']].map(([key, value]) => <div key={key}><span>{key}</span><b>{value}</b></div>)}</div><div className="recommendation-box"><Sparkles size={16} /><span><b>Recommendation</b> Confirm manager data quality in the HR feed before approval routing is configured. Track missing-manager fallback as a negative test.</span></div></section></div><section className="panel"><PanelHeader title="Traceable evidence" eyebrow="SOURCE RECORDS" /><div className="evidence-row">{['ENH-101', 'DOC-003', 'DOC-004', 'DOC-008', 'TC-101', 'TC-102'].map((source, index) => <button className="evidence-chip" key={source} onClick={() => onRecord({ title: `${source} · ${['Enhancement request', 'Catalog runbook', 'HR integration inventory', 'Notification standards', 'Manager approval happy path', 'Manager unavailable fallback'][index]}`, body: 'This source identifier is part of the local seeded impact analysis evidence set.', facts: ['Relationship to ENH-101 is simulated', 'No production customer data is included'] })}><FileText size={14} />{source}</button>)}</div></section></>
}

function DevelopmentTesting({ onRecord }: PageProps) {
  const requirements = [['REQ-101', 'Manager approval before fulfillment', 'ENH-101', 'TC-101 · TC-102', 'Ready'], ['REQ-102', 'Fallback when manager record is missing', 'ENH-101', 'TC-103 · TC-104', 'In progress'], ['REQ-103', 'Update request status notifications', 'ENH-101', 'TC-105', 'Planned'], ['REQ-104', 'Preserve existing catalog validations', 'ENH-101', 'TC-106', 'Ready']]
  return <><div className="metric-grid compact"><MetricCard label="Requirements traced" value="4 / 4" note="Linked to enhancement records" icon={GitBranch} tone="blue" /><MetricCard label="Test coverage" value="83%" note="5 of 6 scenarios ready" icon={Check} tone="green" /><MetricCard label="Open defects" value="1" note="No severity 1 defects" icon={AlertTriangle} tone="amber" /><MetricCard label="UAT status" value="Pending" note="Business validation not started" icon={Users} tone="red" /></div><section className="panel"><PanelHeader title="Requirement to test traceability" eyebrow="DEVELOPMENT AND TESTING" /><div className="table-scroll"><table><thead><tr><th>Requirement</th><th>Description</th><th>Change</th><th>Test case(s)</th><th>Coverage</th><th>Defects / UAT</th></tr></thead><tbody>{requirements.map(row => <tr key={row[0]} onClick={() => onRecord({ title: `${row[0]} · ${row[1]}`, body: `Requirement links to ${row[2]} and test coverage ${row[3]}.`, facts: [`Test state: ${row[4]}`, 'Deployment is not implemented in this demo'] })}><td><a className="source-link">{row[0]}</a></td><td><b>{row[1]}</b></td><td>{row[2]}</td><td>{row[3]}</td><td><StatusPill status={row[4]} /></td><td>{row[0] === 'REQ-102' ? 'DEF-014 · Open' : 'No open defect'}</td></tr>)}</tbody></table></div></section><section className="panel sdlc-flow"><PanelHeader title="AI SDLC trace" eyebrow="NO LIVE CODE GENERATION OR DEPLOYMENT" /><div className="sdlc-steps">{[['Requirement', 'REQ-101 · Approved'], ['Design', 'Approval dependency map'], ['Development', 'Implementation task DEV-204'], ['Test', 'TC-101 to TC-106'], ['Release', 'Window pending approval']].map(([title, value], i) => <div key={title}><span className="sdlc-number">0{i + 1}</span><b>{title}</b><small>{value}</small>{i < 4 && <ArrowRight size={16} />}</div>)}</div></section></>
}

function ReleaseCalendar({ onRecord }: PageProps) {
  const releases = [['REL-2026-11', 'Nov 12, 2026', 'Platform configuration updates', 'Approved', 'CMDB ownership dashboard', 'Ready'], ['REL-2026-12', 'Dec 03, 2026', 'Employee Center approval flow', 'Pending', 'ENH-101, HR feed validation', 'Testing'], ['REL-2026-13', 'Dec 17, 2026', 'Integration mapping improvements', 'Pending', 'HR integration owner sign-off', 'In progress'], ['REL-2027-01', 'Jan 07, 2027', 'Service catalog refinements', 'Draft', 'Operational acceptance', 'Not started']]
  return <><div className="calendar-strip">{releases.map((release, i) => <div className={`release-date ${i === 0 ? 'current' : ''}`} key={release[0]}><span>2026</span><b>{release[1].slice(0, 6)}</b><small>Release {i + 1}</small></div>)}</div><section className="panel"><PanelHeader title="Release readiness calendar" eyebrow="CHANGE WINDOWS" /><div className="table-scroll"><table><thead><tr><th>Release</th><th>Window</th><th>Scope</th><th>Approval</th><th>Dependencies</th><th>Rollback readiness</th></tr></thead><tbody>{releases.map((row, i) => <tr key={row[0]} onClick={() => onRecord({ title: `${row[0]} · ${row[2]}`, body: 'Release window, dependencies, and rollback readiness are simulated for the demo.', facts: [`Window: ${row[1]}`, `Approval: ${row[3]}`, `Dependencies: ${row[4]}`, `Deployment status: ${row[5]}`, `Rollback plan: ${i === 0 ? 'Validated' : 'Draft under review'}`] })}><td><a className="source-link">{row[0]}</a></td><td>{row[1]}</td><td><b>{row[2]}</b></td><td><StatusPill status={row[3]} /></td><td>{row[4]}</td><td><StatusPill status={i === 0 ? 'Approved' : 'Pending'} /></td></tr>)}</tbody></table></div></section><div className="note-band"><AlertTriangle size={17} /><span>Release approvals, deployment, and rollback execution are not connected to a live platform. All records are simulated.</span></div></>
}

function SynaptPage(props: PageProps) {
  const page = useLocation().pathname.split('/').at(-1) ?? ''
  if (page === 'context-knowledge-graph') return <KnowledgeGraph {...props} />
  if (page === 'transition-assistant' || page === 'operations-assistant' || page === 'enhancement-assistant') return <AssistantView {...props} kind={page} />
  return <KnowledgeIngestion {...props} />
}

function KnowledgeIngestion({ ingestionProgress, ingestionRun, runIngestion, onRecord }: PageProps) {
  return <><div className="ingestion-header"><div><div className="eyebrow">SIMULATED SHAREPOINT REPOSITORY</div><h2>Transition knowledge workspace</h2><p>Local sample artifacts are indexed as a demonstration. No external repository or AI service is connected.</p></div><button className="button primary" onClick={runIngestion} disabled={ingestionRun}><Sparkles size={16} />{ingestionRun ? `Ingesting ${ingestionProgress}%` : ingestionProgress === 100 ? 'Run ingestion again' : 'Run demo ingestion'}</button></div>{(ingestionRun || ingestionProgress > 0) && <div className="ingestion-progress"><div><span>{ingestionRun ? 'Extracting metadata and relationships' : 'Demo ingestion complete'}</span><b>{ingestionProgress}%</b></div><div className="progress-track"><i style={{ width: `${ingestionProgress}%` }} /></div></div>}<div className="repository-path"><span>SharePoint</span><ChevronRight size={14} /><span>ServiceNow Managed Services</span><ChevronRight size={14} /><b>Transition artifacts</b><span className="repository-count">{documents.length} artifacts</span></div><section className="panel"><PanelHeader title="Artifact library" eyebrow="INGESTION STATUS" /><div className="table-scroll"><table><thead><tr><th>Artifact</th><th>Type</th><th>Source ID</th><th>Updated</th><th>Related records</th><th>Ingestion</th></tr></thead><tbody>{documents.map((doc, i) => <tr key={doc.id} onClick={() => onRecord({ title: `${doc.id} · ${doc.name}`, body: 'Sample artifact metadata stored locally for this simulated ingestion experience.', facts: [`Type: ${doc.type}`, `Repository source: ${doc.source}`, `Updated: ${doc.updated}`, `Related record: ${doc.related}`] })}><td><b>{doc.name}</b><span className="cell-sub">{doc.id}</span></td><td>{doc.type}</td><td><a className="source-link">{doc.source}</a></td><td>{doc.updated}</td><td>{doc.related} · {i % 2 ? 'ITSM' : 'Employee Center'}</td><td><StatusPill status={ingestionProgress === 100 ? 'Complete' : i < 14 ? 'Indexed' : i < 19 ? 'Queued' : 'Awaiting source'} /></td></tr>)}</tbody></table></div></section><section className="panel"><PanelHeader title="Connected artifact categories" eyebrow="SEEDED RELATIONSHIPS" /><div className="category-tags">{['Architecture', 'SOPs and runbooks', 'Configuration', 'Integrations', 'Tickets and RCAs', 'SLA reports', 'KT recordings', 'Requirements and CRs', 'Release evidence'].map((type, i) => <button key={type} onClick={() => onRecord({ title: type, body: 'Artifacts in this category connect to transition sessions, incidents, modules, and enhancement records.', facts: [`Sample source: DOC-${String(i + 1).padStart(3, '0')}`, 'Relationships are drawn from local seeded records'] })}><FileText size={15} />{type}<span>{[3, 4, 3, 2, 4, 2, 3, 3, 2][i]}</span></button>)}</div></section></>
}

function KnowledgeGraph({ onRecord }: PageProps) {
  const selectedNode = (id: string) => {
    const neighbors = graphEdges.filter(edge => edge.source === id || edge.target === id).map(edge => edge.source === id ? edge.target : edge.source)
    onRecord({ title: id, body: `Connected to ${neighbors.join(', ')} through seeded knowledge relationships.`, facts: [`Node type: ${graphNodes.find(node => node.id === id)?.type}`, ...neighbors.map(item => `Related: ${item}`)] })
  }
  return <><div className="graph-summary"><div><Network size={18} /><b>{graphNodes.length} entities</b></div><div><GitBranch size={18} /><b>{graphEdges.length} relationships</b></div><span>Click a node to inspect its connected records. Relationships use seeded sample data.</span></div><div className="graph-layout"><section className="panel graph-panel"><PanelHeader title="Transition and operations knowledge" eyebrow="CONTEXT GRAPH" /><div className="graph-canvas"><svg className="graph-edge-layer" viewBox="0 0 100 100" preserveAspectRatio="none">{graphEdges.map(edge => { const a = graphNodes.find(node => node.id === edge.source)!; const b = graphNodes.find(node => node.id === edge.target)!; return <line key={`${edge.source}-${edge.target}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} /> })}</svg>{graphNodes.map(node => <button key={node.id} className={`graph-node type-${slug(node.type)}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} onClick={() => selectedNode(node.id)}><span>{node.type}</span><b>{node.id}</b></button>)}</div><div className="graph-legend">{['Module', 'Incident', 'SOP', 'KT session', 'Change request', 'Report', 'Integration'].map((type, i) => <span key={type}><i className={`node-dot dot-${i}`} />{type}</span>)}</div></section><section className="panel graph-records"><PanelHeader title="Connected records" eyebrow="RELATIONSHIP INDEX" /><div>{graphNodes.map(node => <button key={node.id} onClick={() => selectedNode(node.id)}><span>{node.type}</span><b>{node.id}</b><ChevronRight size={14} /></button>)}</div></section></div></>
}

function openAssistantSource(id: string, props: Pick<PageProps, 'onRecord' | 'tasks' | 'risks' | 'sessions' | 'actions' | 'receivedDocs' | 'approvedDocs'>) {
  const { onRecord, tasks, risks, sessions, actions } = props
  const task = tasks.find(item => item.id === id)
  if (task) return onRecord({ title: `${task.id} · ${task.title}`, body: task.acceptance, facts: [`Phase: ${task.phase}`, `Owner: ${task.owner}`, `Workstream: ${task.workstream}`, `Status: ${task.status}`, `Deliverable: ${task.deliverable}`] })
  const risk = risks.find(item => item.id === id)
  if (risk) return onRecord({ title: `${risk.id} · ${risk.title}`, body: risk.impact, facts: [`Severity: ${risk.severity}`, `Owner: ${risk.owner}`, `Due: ${risk.due}`, `Status: ${risk.status}`, `Linked task: ${risk.taskId}`] })
  const action = actions.find(item => item.id === id)
  if (action) return onRecord({ title: `${action.id} · ${action.title}`, body: `Related record: ${action.related}`, facts: [`Owner: ${action.owner}`, `Due: ${action.due}`, `Status: ${action.status}`] })
  const session = sessions.find(item => item.id === id)
  if (session) return onRecord({ title: `${session.id} · ${session.topic}`, body: 'KT session record from the editable demo tracker.', facts: [`SME: ${session.sme}`, `Planned: ${session.planned}`, `Actual: ${session.actual ?? 'Not completed'}`, `Status: ${session.status}`, `Sign-off: ${session.signoff}`, `Evidence: ${session.documentId}`] })
  const document = documents.find(item => item.id === id)
  if (document) return onRecord({ title: `${document.id} · ${document.name}`, body: 'Document record from the simulated evidence library.', facts: [`Type: ${document.type}`, `Source: ${document.source}`, `Received: ${props.receivedDocs.includes(id) ? 'Yes' : 'No'}`, `Approved: ${props.approvedDocs.includes(id) ? 'Yes' : 'No'}`, `Related record: ${document.related}`] })
  const incident = incidents.find(item => item.id === id)
  if (incident) return showIncident(onRecord, incident)
  const problem = problems.find(item => item.id === id)
  if (problem) return onRecord({ title: `${problem.id} · ${problem.title}`, body: `Root cause: ${problem.cause}`, facts: [`${problem.incidents} related incidents`, `Recommended action: ${problem.action}`, `SOP: ${problem.sop}`, `Enhancement: ${problem.enhancementId}`] })
  const sop = sops.find(item => item.id === id)
  if (sop) return onRecord({ title: `${sop.id} · ${sop.title}`, body: `Applicable to ${sop.module}.`, facts: [`Evidence document: ${sop.documentId}`, `Related problem: ${sop.problemId}`] })
  const sla = slaTrend.find(item => item.id === id)
  if (sla) return onRecord({ title: `${sla.id} · ${sla.month} 2026 SLA report`, body: 'Simulated monthly service-level report.', facts: [`Overall target met: ${sla.metTargets} / ${sla.eligibleTargets} (${sla.achievement}%)`, `Breaches: ${sla.breaches}`, `Response targets met: ${sla.responseMet} / ${sla.responseEligible} (${sla.responseCompliance}%)`, `Resolution targets met: ${sla.resolutionMet} / ${sla.resolutionEligible} (${sla.resolutionCompliance}%)`] })
  const enhancement = enhancements.find(item => item.id === id)
  if (enhancement) return onRecord({ title: `${enhancement.id} · ${enhancement.title}`, body: enhancement.value, facts: [`Component: ${enhancement.component}`, `Owner: ${enhancement.owner}`, `Delivery stage: ${enhancement.state}`, `Approval: ${enhancement.approvalState}`, `Estimate: ${enhancement.estimate}`] })
  const integration = integrations.find(item => item.id === id)
  if (integration) return onRecord({ title: `${integration.id} · ${integration.name}`, body: `Integration pattern: ${integration.pattern}.`, facts: [`Source: ${integration.source}`, `Target: ${integration.target}`, `Owner: ${integration.owner}`, `Evidence document: ${integration.documentId}`] })
  const test = testCases.find(item => item.id === id)
  if (test) return onRecord({ title: `${test.id} · ${test.title}`, body: `Requirement ${test.requirementId}.`, facts: [`Type: ${test.type}`, `Status: ${test.status}`] })
  const meeting = meetings.find(item => item.id === id)
  if (meeting) return onRecord({ title: `${meeting.id} · ${meeting.name}`, body: meeting.purpose, facts: [`Cadence: ${meeting.cadence}`, `Agenda: ${meeting.agenda}`, `Output: ${meeting.output}`, `Escalation: ${meeting.escalation}`] })
  onRecord({ title: id, body: 'This source identifier is not present in the current seeded records.' })
}

function AssistantView({ kind, chat, chatInput, setChatInput, sendQuestion, onRecord, ...recordProps }: PageProps & { kind: string }) {
  const opsQuestions = ['How was incident INC1007 resolved?', 'What was the root cause?', 'Which SOP applies?', 'Who resolved similar incidents?', 'What is our current SLA status?', 'Which incidents are recurring?', 'Generate an operational summary.']
  const enhancementQuestions = ['What systems are impacted by manager approval?', 'Which integrations and workflows are related?', 'What test cases should be included?', 'Summarize the simulated impact analysis.']
  const questions = kind === 'operations-assistant' ? opsQuestions : kind === 'enhancement-assistant' ? enhancementQuestions : assistantQuestions
  const modeChat = chat.filter(item => item.assistantKind === kind)
  const heading = kind === 'operations-assistant' ? 'Operations Assistant' : kind === 'enhancement-assistant' ? 'Enhancement Assistant' : 'Transition Assistant'
  return <div className="assistant-layout"><section className="assistant-main panel"><div className="assistant-top"><div><span className="assistant-avatar"><Bot size={19} /></span><div><b>{heading}</b><span>Deterministic answers · local seeded sources only</span></div></div><span className="local-tag">SIMULATED</span></div><div className="chat-stream">{modeChat.length === 0 && <div className="assistant-welcome"><div className="welcome-mark"><Sparkles size={20} /></div><h2>Ask the transition workspace</h2><p>Responses are generated from this demo's local records and include source IDs for verification.</p><div className="suggestion-grid">{questions.map(question => <button key={question} onClick={() => sendQuestion(question, kind)}>{question}<ArrowRight size={14} /></button>)}</div></div>}{modeChat.map((item, i) => <div className="conversation" key={`${item.question}-${i}`}><div className="user-question"><span>You</span><p>{item.question}</p></div><div className="assistant-answer"><span><Bot size={14} /> DEMO RESPONSE</span><p>{item.text}</p>{item.sources.length > 0 && <div className="source-list"><b>SOURCES</b>{item.sources.map(source => <button key={source} onClick={() => openAssistantSource(source, { ...recordProps, onRecord })}>{source}</button>)}</div>}</div></div>)}</div><form className="chat-form" onSubmit={event => { event.preventDefault(); if (chatInput.trim()) sendQuestion(chatInput.trim(), kind) }}><input value={chatInput} onChange={event => setChatInput(event.target.value)} placeholder="Ask a question about the seeded records..." /><button className="button primary" type="submit" disabled={!chatInput.trim()}><ArrowRight size={16} />Ask</button></form></section><aside className="panel assistant-sources"><PanelHeader title="Demo scope" eyebrow="ANSWER BOUNDARIES" /><div className="source-scope"><div><FileText size={16} /><span>Transition tasks</span><b>{transitionTasks.length}</b></div><div><BookOpen size={16} /><span>Documents</span><b>{documents.length}</b></div><div><Activity size={16} /><span>Incidents</span><b>{incidents.length}</b></div><div><GitBranch size={16} /><span>Problems</span><b>{problems.length}</b></div><div><Workflow size={16} /><span>Enhancements</span><b>{enhancements.length}</b></div></div><div className="scope-note"><ShieldCheck size={15} />No live LLM connection. Unsupported questions are explicitly reported as unavailable.</div><button className="text-action" onClick={() => onRecord({ title: 'Source policy', body: 'Responses are deterministic and computed from this static local dataset. No external API requests.', facts: ['No external API requests', 'Unknown data returns unavailable', 'Source IDs match seeded entities'] })}>View answer policy<ChevronRight size={14} /></button></aside></div>
}

function SearchControl({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) { return <label className="search-control"><Search size={15} /><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} />{value && <button type="button" onClick={() => onChange('')} aria-label="Clear search"><X size={14} /></button>}</label> }
