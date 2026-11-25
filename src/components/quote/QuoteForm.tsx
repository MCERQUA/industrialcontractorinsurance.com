"use client"
// SHARED quote form (React / Next client component). Dependency-free: React only, no Tailwind plugin, no icon lib.
// Style hooks: pass `classes` to restyle, or leave defaults (plain Tailwind utility strings, harmless without Tailwind).
//
// Posts CANONICAL field names only (see quoteSpec.ts). Hard rules baked in:
//   - NO signature / signed-date / initials field anywhere (host ruling 2026-11-21).
//   - yn_* answers are radio pairs with NO default: an unanswered question is posted as '' and stored blank, never 'No'
//     (sanitizeYn() runs before every submit; validateQuote() blocks a blank when ynRequired is true).
//   - Hidden groups (fein, physicalCounty, unselected yn questions) are not posted at all.
//   - Trade-specific preface questions post as `_info_<name>` (map_quote_125.py skips that prefix; the lead keeps them).
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  YES_NO, ENTITY_TYPES, TRADE_TYPES, US_STATE_CODES, GL_EACH_OCCURRENCE, GL_GENERAL_AGGREGATE, GL_PRODUCTS_COMPOPS,
  GL_PERSONAL_ADV, GL_RENTED_PREMISES, GL_MEDICAL_EXPENSE, LOSS_LINES, OTHER_COVERAGES, SAFETY_ELEMENTS, POOL_FEATURES,
  RENT_EQUIPMENT_TYPES, TERMINATION_REASONS, YN_QUESTIONS, GENERAL_DETAILS, QUESTIONS_WITH_EXPLAIN, EXPLAIN_MAX,
  EXPLAIN_DEFAULT_MAX, MAX_LEN, SELECT_OPTIONS, detailName, emptyQuote, fieldsFor, ynKeysFor, resolveOptions,
  sanitizeYn, validateQuote, oneYearAfter, type Flat, type QuoteOptions,
} from '@/lib/quote/quoteSpec'

export interface PrefaceQuestion {
  /** posted as `_info_<name>` */
  name: string
  label: string
  type?: 'text' | 'textarea' | 'select' | 'radio'
  options?: string[]
  required?: boolean
}

export interface LegacyQuestion {
  /** posted under EXACTLY this name (a name the site already posted before the port) */
  name: string
  label: string
  type?: 'text' | 'number' | 'date' | 'textarea' | 'select' | 'checks'
  options?: string[]
  /** checks only: values ticked on first render */
  defaultChecked?: string[]
}

export interface QuoteFormProps {
  /** Pre-port field names kept verbatim: extra inputs posted under their own names (optional, never required). */
  legacyQuestions?: LegacyQuestion[]
  /** Derive pre-port names from the canonical answers (called with the sanitised canonical data); results are posted as-is. */
  deriveLegacy?: (data: Flat) => Record<string, string>
  /** Netlify form name / form-name value (CCA: 'quote-request'; most Josh trade sites: 'quote'). */
  formName: string
  /** Human trade name shown in headings, e.g. 'Roll-Off Dumpster'. */
  tradeName: string
  /** Where to POST. Next sites with quote-route.ts: '/api/quote-request'. Sites posting straight to the lead webhook: its URL. */
  endpoint: string
  /** 'urlencoded' (default; Netlify/route style) or 'json' (webhook style). */
  format?: 'urlencoded' | 'json'
  /** json format only: Netlify Forms fallback path (e.g. '/__forms.html'). Used when the webhook does not answer {ok:true, stored!==false}
   *  (the leads webhook answers 200 {ok:true,stored:false} when it drops a body, so a bare 2xx is not acceptance). */
  netlifyFallback?: string
  /** Extra constant keys sent with every post, e.g. { form_name: 'quote', source: 'rolloffdumpsterinsurance.com' } (json) . */
  extraFields?: Record<string, string>
  /** Heavy-group switches, see quoteSpec.ts QuoteOptions. */
  options?: QuoteOptions
  /** Options for the tradeType select (default: CCA contractor list). Pass the trade's own classes. */
  tradeTypeOptions?: string[]
  /** Preface slot: any node rendered above the standard questions (intro copy, trust badges). */
  preface?: React.ReactNode
  /** Preface questions specific to the trade (posted as `_info_<name>`). */
  prefaceQuestions?: PrefaceQuestion[]
  /** Attribution (default true): hidden `traffic_source` + `landing_url`, same derivation as the old AeoFields component.
   *  Set false only for a site that never had AeoFields. Filled client-side after mount (SSR-safe). */
  attribution?: boolean
  /** Prefill (e.g. { tradeType: 'Roll-off dumpster rental' }). */
  defaults?: Partial<Flat>
  successMessage?: string
  errorMessage?: string
  onSuccess?: () => void
  classes?: Partial<typeof DEFAULT_CLASSES>
}

const DEFAULT_CLASSES = {
  form: 'space-y-8',
  section: 'space-y-4',
  heading: 'text-lg font-semibold',
  grid: 'grid md:grid-cols-2 gap-4',
  label: 'block text-sm font-medium mb-1',
  input: 'w-full px-3 py-2 border border-gray-300 rounded-md',
  error: 'text-sm text-red-600',
  legend: 'text-sm font-medium mb-1',
  option: 'flex items-center gap-2 text-sm',
  button: 'px-6 py-3 rounded-md font-semibold bg-gray-900 text-white disabled:opacity-50',
  ok: 'p-4 rounded-md bg-green-50 text-green-800',
  bad: 'p-4 rounded-md bg-red-50 text-red-800',
  detail: 'mt-2 grid md:grid-cols-2 gap-3 pl-4 border-l-2 border-gray-300',
}

export function QuoteForm(props: QuoteFormProps) {
  const C = { ...DEFAULT_CLASSES, ...props.classes }
  const opts = resolveOptions({ ...props.options, ...(props.tradeTypeOptions ? { tradeTypeOptions: props.tradeTypeOptions } : {}) })
  const ynKeys = ynKeysFor(opts)
  const prefaceQs = props.prefaceQuestions ?? []
  const [v, setV] = useState<Flat>(() => ({ ...emptyQuote(), ...(props.defaults as Flat) }))
  const [pf, setPf] = useState<Record<string, string>>({})
  const legacyQs = props.legacyQuestions ?? []
  const legacyInit = () => Object.fromEntries(legacyQs.filter(q => q.type === 'checks' && q.defaultChecked).map(q => [q.name, (q.defaultChecked ?? []).join(', ')]))
  const [lg, setLg] = useState<Record<string, string>>(legacyInit)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'bad'>('idle')
  const [message, setMessage] = useState('')
  // Attribution (old AeoFields): traffic_source = utm_source | ref | referrer hostname | 'direct'; landing_url = full href. Client-only.
  const attribution = props.attribution !== false
  const attr = useRef({ traffic_source: '', landing_url: '' })
  const [attrVals, setAttrVals] = useState(attr.current)
  useEffect(() => {
    if (!attribution) return
    try {
      const p = new URLSearchParams(window.location.search)
      let src = p.get('utm_source') || p.get('ref') || ''
      if (!src && document.referrer) { try { src = new URL(document.referrer).hostname } catch { src = document.referrer } }
      if (!src) src = 'direct'
      attr.current = { traffic_source: src, landing_url: window.location.href }
      setAttrVals(attr.current)
    } catch { /* attribution is best-effort, never blocks the form */ }
  }, [attribution])

  const errors = useMemo(() => validateQuote(sanitizeYn(v), new Date(), opts), [v, props.options, props.tradeTypeOptions]) // eslint-disable-line react-hooks/exhaustive-deps
  const pfErrors: Record<string, string> = {}
  for (const q of prefaceQs) if (q.required && !(pf[q.name] ?? '').trim()) pfErrors[`_info_${q.name}`] = `${q.label} is required`

  const set = (name: string, value: string) =>
    setV(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'businessStartDate' ? { yearBusinessStarted: value.slice(0, 4) } : {}),
    }))
  const touch = (name: string) => setTouched(t => ({ ...t, [name]: true }))
  const err = (name: string) => (touched[name] ? errors[name] ?? pfErrors[name] : undefined)
  const yes = (k: string) => v[`yn_${k}`] === 'Yes'

  // ---- tiny field helpers (all fields are controlled; names are the canonical ones)
  const Err = ({ n }: { n: string }) => (err(n) ? <p className={C.error} role="alert">{err(n)}</p> : null)
  const text = (name: string, label: string, o: { required?: boolean; type?: string; ph?: string } = {}) => (
    <div key={name}>
      <label htmlFor={`f-${name}`} className={C.label}>{label}{o.required === false ? '' : ' *'}</label>
      <input id={`f-${name}`} name={name} type={o.type ?? 'text'} value={v[name] ?? ''} placeholder={o.ph}
        maxLength={MAX_LEN[name]} className={C.input}
        onChange={e => set(name, e.target.value)} onBlur={() => touch(name)} />
      <Err n={name} />
    </div>
  )
  const area = (name: string, label: string, max?: number, required = true) => (
    <div key={name}>
      <label htmlFor={`f-${name}`} className={C.label}>{label}{required ? ' *' : ''}</label>
      <textarea id={`f-${name}`} name={name} rows={3} maxLength={max} value={v[name] ?? ''} className={C.input}
        onChange={e => set(name, e.target.value)} onBlur={() => touch(name)} />
      <Err n={name} />
    </div>
  )
  const select = (name: string, label: string, options: string[], required = true) => (
    <div key={name}>
      <label htmlFor={`f-${name}`} className={C.label}>{label}{required ? ' *' : ''}</label>
      <select id={`f-${name}`} name={name} value={v[name] ?? ''} className={C.input}
        onChange={e => { set(name, e.target.value); touch(name) }}>
        <option value="">Select</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <Err n={name} />
    </div>
  )
  // Radio pair with NO default checked: unanswered stays ''.
  const radio = (name: string, label: string, options: string[] = YES_NO, required = true) => (
    <fieldset key={name}>
      <legend className={C.legend}>{label}{required ? ' *' : ''}</legend>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {options.map(o => (
          <label key={o} className={C.option}>
            <input type="radio" name={name} value={o} checked={v[name] === o}
              onChange={() => { set(name, o); touch(name) }} />
            {o}
          </label>
        ))}
      </div>
      <Err n={name} />
    </fieldset>
  )
  const checks = (name: string, label: string, options: string[]) => {
    const picked = v[name] ? v[name].split(', ') : []
    const toggle = (o: string) => {
      const next = picked.includes(o) ? picked.filter(p => p !== o) : [...picked, o]
      set(name, options.filter(x => next.includes(x)).join(', ')); touch(name)
    }
    return (
      <fieldset key={name}>
        <legend className={C.legend}>{label} *</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {options.map(o => (
            <label key={o} className={C.option}>
              <input type="checkbox" checked={picked.includes(o)} onChange={() => toggle(o)} />{o}
            </label>
          ))}
        </div>
        <Err n={name} />
      </fieldset>
    )
  }

  const prefaceField = (q: PrefaceQuestion) => {
    const name = `_info_${q.name}`
    const val = pf[q.name] ?? ''
    const setP = (x: string) => { setPf(p => ({ ...p, [q.name]: x })); touch(name) }
    const lab = `${q.label}${q.required ? ' *' : ''}`
    if (q.type === 'select')
      return (<div key={name}><label className={C.label} htmlFor={`f-${name}`}>{lab}</label>
        <select id={`f-${name}`} name={name} className={C.input} value={val} onChange={e => setP(e.target.value)}>
          <option value="">Select</option>{(q.options ?? []).map(o => <option key={o}>{o}</option>)}</select><Err n={name} /></div>)
    if (q.type === 'radio')
      return (<fieldset key={name}><legend className={C.legend}>{lab}</legend>
        <div className="flex flex-wrap gap-x-6">{(q.options ?? YES_NO).map(o => (
          <label key={o} className={C.option}><input type="radio" name={name} checked={val === o} onChange={() => setP(o)} />{o}</label>))}</div><Err n={name} /></fieldset>)
    if (q.type === 'textarea')
      return (<div key={name}><label className={C.label} htmlFor={`f-${name}`}>{lab}</label>
        <textarea id={`f-${name}`} name={name} rows={3} className={C.input} value={val} onChange={e => setP(e.target.value)} /><Err n={name} /></div>)
    return (<div key={name}><label className={C.label} htmlFor={`f-${name}`}>{lab}</label>
      <input id={`f-${name}`} name={name} className={C.input} value={val} onChange={e => setP(e.target.value)} onBlur={() => touch(name)} /><Err n={name} /></div>)
  }

  // pre-port names, optional, posted verbatim (checks join every ticked value with ', ')
  const legacyField = (q: LegacyQuestion) => {
    const val = lg[q.name] ?? ''
    const setL = (x: string) => setLg(p => ({ ...p, [q.name]: x }))
    const id = `f-legacy-${q.name}`
    if (q.type === 'checks') {
      const picked = val ? val.split(', ') : []
      return (<fieldset key={q.name}><legend className={C.legend}>{q.label}</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-1">{(q.options ?? []).map(o => (
          <label key={o} className={C.option}><input type="checkbox" name={q.name} value={o} checked={picked.includes(o)}
            onChange={() => { const n = picked.includes(o) ? picked.filter(x => x !== o) : [...picked, o]; setL((q.options ?? []).filter(x => n.includes(x)).join(', ')) }} />{o}</label>))}</div></fieldset>)
    }
    if (q.type === 'select')
      return (<div key={q.name}><label className={C.label} htmlFor={id}>{q.label}</label>
        <select id={id} name={q.name} className={C.input} value={val} onChange={e => setL(e.target.value)}>
          <option value="">Select</option>{(q.options ?? []).map(o => <option key={o}>{o}</option>)}</select></div>)
    if (q.type === 'textarea')
      return (<div key={q.name}><label className={C.label} htmlFor={id}>{q.label}</label>
        <textarea id={id} name={q.name} rows={3} className={C.input} value={val} onChange={e => setL(e.target.value)} /></div>)
    return (<div key={q.name}><label className={C.label} htmlFor={id}>{q.label}</label>
      <input id={id} name={q.name} type={q.type ?? 'text'} className={C.input} value={val} onChange={e => setL(e.target.value)} /></div>)
  }

  const copyMailing = () =>
    setV(p => ({ ...p, physicalAddress: p.address.slice(0, MAX_LEN.physicalAddress), physicalCity: p.city.slice(0, MAX_LEN.physicalCity), physicalState: p.state, physicalZip: p.zip }))

  // ---- yn block with its follow-ups (explain box / structured detail / yes-triggered selections)
  const ynBlock = (key: string) => {
    const q = YN_QUESTIONS.find(x => x.key === key)!
    const out: React.ReactNode[] = [radio(`yn_${key}`, q.label, YES_NO, opts.ynRequired)]
    if (yes(key)) {
      if (QUESTIONS_WITH_EXPLAIN.includes(key))
        out.push(<div key={`x-${key}`}>{area(`ynExplain_${key}`, 'Please explain', EXPLAIN_MAX[key] ?? EXPLAIN_DEFAULT_MAX)}</div>)
      if (GENERAL_DETAILS[key])
        out.push(<div key={`d-${key}`} className={C.detail}>{GENERAL_DETAILS[key].map(f =>
          text(detailName(key, f.key), f.label, { type: f.kind === 'date' ? 'date' : 'text' }))}</div>)
      if (key === 'coverageTerminated')
        out.push(<div key="ct" className={C.detail}>
          <p className={C.legend}>Why was coverage terminated? (tick at least one) *</p>
          {[...TERMINATION_REASONS, { key: 'conditionCorrected', label: 'Condition Corrected' }].map(r => {
            const n = `general_coverageTerminated__${r.key}`
            return <label key={r.key} className={C.option}><input type="checkbox" checked={v[n] === 'Yes'}
              onChange={e => { set(n, e.target.checked ? 'Yes' : ''); touch('general_coverageTerminated__nonPayment') }} />{r.label}</label>
          })}
          <Err n="general_coverageTerminated__nonPayment" />
          {v.general_coverageTerminated__conditionCorrected === 'Yes' &&
            text('general_coverageTerminated__conditionCorrectedDescription', 'Describe how the condition was corrected')}
        </div>)
      if (key === 'safetyProgramsExist') {
        out.push(<div key="sp">{checks('safetyProgramElements', 'Safety program elements', SAFETY_ELEMENTS)}</div>)
        if ((v.safetyProgramElements ?? '').split(', ').includes('Other')) out.push(text('safetyOtherText', 'Other safety program'))
      }
      if (key === 'athleticTeams')
        out.push(<div key="at" className={C.detail}>{text('athleticSportDescription', 'Sport')}{radio('athleticContactSport', 'Contact sport?')}
          {text('athleticSponsorshipExtent', 'Extent of sponsorship')}{select('athleticTeamAgeGroup', 'Age group', SELECT_OPTIONS.athleticTeamAgeGroup)}</div>)
      if (key === 'swimmingPool')
        out.push(<div key="pool" className={C.detail}>{select('poolConstruction', 'Pool construction', SELECT_OPTIONS.poolConstruction)}
          {checks('poolSafetyFeatures', 'Pool safety features', POOL_FEATURES)}</div>)
      if (key === 'rentOrLoanEquipment')
        out.push(<div key="re" className={C.detail}>{checks('rentEquipmentTypes', 'Type of equipment rented or loaned', RENT_EQUIPMENT_TYPES)}
          {radio('rentEquipmentInstructionGiven', 'Is instruction given to renters?')}</div>)
      if (key === 'leaseEmployees')
        out.push(<div key="le" className={C.detail}>{radio('leaseEmployeesWorkersCompCarried', 'Workers compensation carried for leased employees?')}</div>)
    }
    return <div key={`yn-${key}`} className="space-y-2">{out}</div>
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const all = Object.fromEntries([...Object.keys(errors), ...Object.keys(pfErrors)].map(k => [k, true]))
    if (Object.keys(all).length) {
      setTouched(t => ({ ...t, ...all }))
      setStatus('bad'); setMessage('Please complete the highlighted fields.')
      return
    }
    setBusy(true); setStatus('idle')
    try {
      const data = sanitizeYn({ ...v })
      data.name = `${data.firstName} ${data.lastName}`.trim()
      if (data.businessStartDate) data.yearBusinessStarted = data.businessStartDate.slice(0, 4)
      if (!data.desiredExpirationDate && data.desiredEffectiveDate) data.desiredExpirationDate = oneYearAfter(data.desiredEffectiveDate)
      if (data.yn_coverageTerminated === 'Yes') // reasons are tick-boxes: unticked = No (only when terminated = Yes)
        for (const r of ['nonPayment', 'nonRenewal', 'agentStopRepresenting', 'underwriting', 'conditionCorrected']) {
          const k = `general_coverageTerminated__${r}`; if (data[k] !== 'Yes') data[k] = 'No'
        }
      const payload: Record<string, string> = {}
      for (const f of fieldsFor(opts)) payload[f] = data[f] ?? ''
      for (const q of prefaceQs) payload[`_info_${q.name}`] = pf[q.name] ?? ''
      if (props.deriveLegacy) Object.assign(payload, props.deriveLegacy(data))
      for (const q of legacyQs) payload[q.name] = lg[q.name] ?? ''
      if (attribution) { payload.traffic_source = attr.current.traffic_source; payload.landing_url = attr.current.landing_url }
      Object.assign(payload, props.extraFields ?? {})
      const json = props.format === 'json'
      const urlenc = (to: string) => fetch(to, {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': props.formName, ...payload }).toString(),
      })
      if (json) {
        let captured = false
        try {
          const res = await fetch(props.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
          if (res.ok) { const j = await res.json().catch(() => null); if (j && j.ok === true && j.stored !== false) captured = true }
        } catch { /* network failure: fall through to the fallback */ }
        if (!captured) {
          if (!props.netlifyFallback) throw new Error('not stored')
          const r = await urlenc(props.netlifyFallback)
          if (!r.ok) throw new Error(String(r.status))
        }
      } else {
        const res = await urlenc(props.endpoint)
        if (!res.ok) throw new Error(String(res.status)) // fetch resolves on 4xx/5xx: status says whether the lead was taken
      }
      setStatus('ok'); setMessage(props.successMessage ?? 'Thank you. We received your quote request and will be in touch within 24 hours.')
      setV({ ...emptyQuote(), ...(props.defaults as Flat) }); setPf({}); setLg(legacyInit()); setTouched({})
      props.onSuccess?.()
    } catch {
      setStatus('bad'); setMessage(props.errorMessage ?? 'Something went wrong. Please call us or try again.')
    } finally { setBusy(false) }
  }

  return (
    <form name={props.formName} method="POST" data-netlify="true" data-netlify-honeypot="bot-field" noValidate onSubmit={submit} className={C.form}>
      <input type="hidden" name="form-name" value={props.formName} />
      {attribution && <><input type="hidden" name="traffic_source" value={attrVals.traffic_source} readOnly />
        <input type="hidden" name="landing_url" value={attrVals.landing_url} readOnly /></>}
      <div style={{ display: 'none' }}><input name="bot-field" tabIndex={-1} autoComplete="off" /></div>

      {props.preface}
      {prefaceQs.length > 0 && (
        <section className={C.section}>
          <h3 className={C.heading}>About your {props.tradeName} operation</h3>
          <div className={C.grid}>{prefaceQs.map(prefaceField)}</div>
        </section>
      )}

      <section className={C.section}>
        <h3 className={C.heading}>Your business</h3>
        <div className={C.grid}>
          {text('firstName', 'First name')}{text('lastName', 'Last name')}
          {text('businessName', 'Business name')}{text('dba', 'DBA (if any)', { required: false })}
          {select('entityType', 'Business entity', ENTITY_TYPES)}
          {text('businessStartDate', 'Date business started', { type: 'date' })}
          {opts.fein && text('fein', 'FEIN (XX-XXXXXXX)', { ph: '00-0000000', required: opts.feinRequired })}
          {text('email', 'Email', { type: 'email' })}{text('phone', 'Phone', { type: 'tel' })}
        </div>
      </section>

      <section className={C.section}>
        <h3 className={C.heading}>Location</h3>
        <div className={C.grid}>
          {text('address', 'Mailing address')}{text('city', 'Mailing city')}
          {select('state', 'Mailing state', US_STATE_CODES)}{text('zip', 'Mailing ZIP')}
        </div>
        <button type="button" onClick={copyMailing} className="text-sm underline">Physical location is the same as mailing</button>
        <div className={C.grid}>
          {text('physicalAddress', 'Physical street address')}{text('physicalCity', 'Physical city')}
          {opts.physicalCounty && text('physicalCounty', 'Physical county')}
          {select('physicalState', 'Physical state', US_STATE_CODES)}{text('physicalZip', 'Physical ZIP')}
          {text('locationDescription', 'Description of the premises')}
          {select('premisesCityLimits', 'Inside / outside city limits', SELECT_OPTIONS.premisesCityLimits)}
          {select('premisesInterest', 'Owner / tenant of premises', SELECT_OPTIONS.premisesInterest)}
        </div>
      </section>

      <section className={C.section}>
        <h3 className={C.heading}>Operations</h3>
        {area('businessDescription', 'Description of operations')}
        <div className={C.grid}>
          {select('tradeType', 'Trade / class of business', opts.tradeTypeOptions)}
          {text('statesOfOperation', 'States where you work', { ph: 'e.g. AZ, NV' })}
          {text('lastGrossSales', 'Annual gross sales / revenue (numbers only)')}
          {text('fullTimeEmployees', 'Full-time employees')}{text('partTimeEmployees', 'Part-time employees')}
          {radio('usesSubcontractors', 'Do you use subcontractors?')}
          {text('lastSubcontractingCosts', 'Amount paid to subcontractors, last 12 months (0 if none)')}
          {text('workSubcontractedPercent', 'Percent of work subcontracted (0 if none)')}
          {v.usesSubcontractors === 'Yes' && radio('subsCarryInsurance', 'Do your subs carry their own insurance?')}
        </div>
        {v.usesSubcontractors === 'Yes' && area('workSubcontractedDescription', 'Type of work subcontracted', 136, opts.subcontractedDescriptionRequired)}
      </section>

      <section className={C.section}>
        <h3 className={C.heading}>Coverage and history</h3>
        <div className={C.grid}>
          {text('desiredEffectiveDate', 'Coverage start date', { type: 'date' })}
          {select('glEachOccurrence', 'Each occurrence limit', GL_EACH_OCCURRENCE)}
          {select('glGeneralAggregate', 'General aggregate limit', GL_GENERAL_AGGREGATE)}
          {select('glProductsCompOpsAggregate', 'Products / completed operations aggregate', GL_PRODUCTS_COMPOPS)}
          {select('glPersonalAdvertisingInjury', 'Personal & advertising injury limit', GL_PERSONAL_ADV)}
          {select('glDamageToRentedPremises', 'Damage to rented premises limit', GL_RENTED_PREMISES)}
          {select('glMedicalExpense', 'Medical expense limit', GL_MEDICAL_EXPENSE)}
          {select('glTrigger', 'Occurrence / claims-made', SELECT_OPTIONS.glTrigger)}
          {select('glAggregateAppliesTo', 'How the aggregate applies', SELECT_OPTIONS.glAggregateAppliesTo)}
          {select('billingPlan', 'Billing plan', SELECT_OPTIONS.billingPlan)}
          {radio('currentlyInsured', 'Currently insured?')}
          {v.currentlyInsured === 'Yes' && text('currentCarrier', 'Current carrier', { required: false })}
          {v.currentlyInsured === 'Yes' && text('currentPolicyExpiration', 'Current policy expiration', { type: 'date', required: false })}
          {radio('lossesLast3Years', 'Any losses in the last 3 years?')}
        </div>
        {v.lossesLast3Years === 'Yes' && (
          <div className={C.detail}>
            {text('lossCount', 'Number of losses')}{select('lossLineOfBusiness', 'Loss line of business', LOSS_LINES)}
            {text('lossDate', 'Loss date', { type: 'date' })}{text('lossDescription', 'Loss description')}
            {select('lossHistoryStatus', 'Open / closed', SELECT_OPTIONS.lossHistoryStatus)}
            {text('lossAmountPaid', 'Amount paid')}{text('lossAmountReserved', 'Amount reserved')}
            {radio('lossSubrogation', 'Subrogation?')}
          </div>
        )}
        <fieldset>
          <legend className={C.legend}>Other coverage you need (optional)</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {OTHER_COVERAGES.map(c => {
              const picked = (v.otherCoverages ?? '').split(', ').filter(Boolean)
              return <label key={c.key} className={C.option}><input type="checkbox" checked={picked.includes(c.key)}
                onChange={() => { const n = picked.includes(c.key) ? picked.filter(x => x !== c.key) : [...picked, c.key]
                  set('otherCoverages', OTHER_COVERAGES.map(o => o.key).filter(k => n.includes(k)).join(', ')) }} />{c.label}</label>
            })}
          </div>
          {(v.otherCoverages ?? '').split(', ').filter(Boolean).map(k =>
            text(`otherCoverageDetail_${k}`, `Details for ${OTHER_COVERAGES.find(o => o.key === k)?.label ?? k}`))}
        </fieldset>
        {area('notes', 'Anything else we should know?', undefined, false)}
      </section>

      {legacyQs.length > 0 && (
        <section className={C.section}>
          <h3 className={C.heading}>More about your {props.tradeName} operation (optional)</h3>
          <div className={C.grid}>{legacyQs.map(legacyField)}</div>
        </section>
      )}

      {ynKeys.length > 0 && (
        <section className={C.section}>
          <h3 className={C.heading}>Underwriting questions</h3>
          {opts.ynRequired ? null : <p className="text-sm">Answer what you can; unanswered questions stay blank.</p>}
          {ynKeys.map(ynBlock)}
        </section>
      )}

      {status !== 'idle' && <div className={status === 'ok' ? C.ok : C.bad} role="alert">{message}</div>}
      <button type="submit" disabled={busy} className={C.button}>{busy ? 'Sending...' : 'Request my quote'}</button>
    </form>
  )
}

export default QuoteForm
