// SHARED quote spec (extracted from contractorschoiceagency.com lib/quote/quoteSpec.ts, 2026-11-21).
// Single source of truth used by BOTH the browser form (QuoteForm.tsx) and the server route
// (quote-route.ts) so the two can never disagree. Canonical field names are what
// ~/josh-workspace/skills/acord-forms/scripts/map_quote_125.py reads: DO NOT RENAME any of them.
//
// DIFFERENCES from the CCA original (everything else is byte-identical logic):
//   * QuoteOptions: heavy requirements are opt-in groups (fein, physicalCounty, yn subset, yn required or not).
//   * sanitizeYn(): a yn_* value that is not exactly 'Yes' or 'No' is stored as '' (blank), never 'No'.
//   * validateQuote(d, opts) takes the options; defaults reproduce the CCA form exactly.
//   * HARD RULE (host 2026-11-21): no signature, signed-date or initials field exists in this spec. Keep it so.
//
// Scope: ACORD 125 / 126 (GL) applicant-answerable fields, per
// skills/acord-forms/forms/acord-125-126-140/FIELDS.md. Payment plan/method, card data,
// applicant signature, DOB, driver license and SSN are deliberately NOT collected here.

export type Flat = Record<string, string>

export const YES_NO = ['Yes', 'No']

// ---------------------------------------------------------------- option lists
export const ENTITY_TYPES = [
  'Individual/Sole prop',
  'Partnership',
  'Corporation',
  'S Corporation',
  'LLC',
  'Joint venture',
  'Not for profit',
  'Trust',
]

export const TRADE_TYPES = [
  'General Contractor',
  'Remodeling / Handyman',
  'Roofing',
  'Spray Foam / Insulation',
  'Concrete / Masonry',
  'Carpentry / Framing',
  'Drywall / Painting',
  'Electrical',
  'Plumbing',
  'HVAC',
  'Flooring / Tile',
  'Excavation / Grading',
  'Landscaping',
  'Specialty Trade',
  'Other',
]

export const US_STATE_CODES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

export const GL_EACH_OCCURRENCE = ['$300,000', '$500,000', '$1,000,000', '$2,000,000']
export const GL_GENERAL_AGGREGATE = ['$1,000,000', '$2,000,000', '$3,000,000', '$4,000,000']
export const GL_PRODUCTS_COMPOPS = ['$1,000,000', '$2,000,000', '$3,000,000', '$4,000,000']
export const GL_PERSONAL_ADV = ['$1,000,000', '$2,000,000']
export const GL_RENTED_PREMISES = ['$50,000', '$100,000', '$300,000', '$500,000']
export const GL_MEDICAL_EXPENSE = ['$5,000', '$10,000']
export const GL_OFFER_PACKAGES = [
  'Standard - $1M occurrence / $2M aggregate',
  'Enhanced - $2M occurrence / $4M aggregate',
  'Custom - discuss with an agent',
  'No preference',
]

export const LOSS_LINES = ['GL', 'WC', 'Auto', 'Property', 'Umbrella', 'Other']

// ONE "other coverage you need" checklist (General Liability is the application itself).
export const OTHER_COVERAGES: Array<{ key: string; label: string }> = [
  { key: 'pollution', label: 'Pollution' },
  { key: 'workersComp', label: 'Workers Compensation' },
  { key: 'commercialAuto', label: 'Commercial Auto' },
  { key: 'umbrella', label: 'Umbrella / Excess' },
  { key: 'bonds', label: 'Bonds' },
  { key: 'equipmentInlandMarine', label: 'Equipment / Inland Marine' },
  { key: 'liquor', label: 'Liquor' },
]

export const SAFETY_ELEMENTS = ['Safety Manual', 'Safety Position', 'Monthly Meetings', 'OSHA Compliance', 'Other']
export const POOL_FEATURES = ['Approved Fence', 'Limited Access', 'Diving Board', 'Slide', 'Life Guard']
export const RENT_EQUIPMENT_TYPES = ['Small Tools', 'Large Equipment']
export const TERMINATION_REASONS: Array<{ key: string; label: string }> = [
  { key: 'nonPayment', label: 'Non-Payment' },
  { key: 'nonRenewal', label: 'Non-Renewal' },
  { key: 'agentStopRepresenting', label: 'Agent No Longer Represents Carrier' },
  { key: 'underwriting', label: 'Underwriting' },
]

// ------------------------------------------------- 57 Yes/No questions (ACORD 125/126)
export const YN_QUESTIONS: Array<{ key: string; label: string }> = [
  { key: 'buildingLeasedToOthers', label: 'Is Building Leased to Others?' },
  { key: 'applicantSubsidiary', label: 'Is Applicant a Subsidiary?' },
  { key: 'applicantHasSubsidiaries', label: 'Does Applicant Have Subsidiaries?' },
  { key: 'safetyProgramsExist', label: 'Do Safety Programs Exist?' },
  { key: 'exposureFlammables', label: 'Any Exposure to Flammables, Explosives, Chemicals?' },
  { key: 'otherInsurance', label: 'Any Other Insurance with This Company?' },
  { key: 'coverageTerminated', label: 'Has a Policy Coverage Ever Been Terminated?' },
  { key: 'pastAllegations', label: 'Past Allegations of Abuse, Molestation, or Discrimination?' },
  { key: 'indictedOrConvicted', label: 'Any Indictments or Convictions?' },
  { key: 'safetyViolations', label: 'Any Uncorrected Fire and/or Safety Violations?' },
  { key: 'negativeFinancialAction', label: 'Any Past Negative Financial Action?' },
  { key: 'judgementOrLien', label: 'Any Judgement or Lien?' },
  { key: 'businessInTrust', label: 'Has the Business Been Placed in a Trust?' },
  { key: 'foreignOperations', label: 'Any Foreign Operations or Products?' },
  { key: 'otherVentures', label: 'Do Other Ventures Exist?' },
  { key: 'possessDrones', label: 'Does Applicant Possess Drones?' },
  { key: 'hireDroneOperators', label: 'Does Applicant Hire Drone Operators?' },
  { key: 'priorExclusionUninsured', label: 'Has Any Product, Work, Accident or Location Been Excluded, Uninsured or Self-Insured from Any Previous Coverage?' },
  { key: 'tailCoveragePurchased', label: 'Was Tail Coverage Purchased Under Any Previous Policy?' },
  { key: 'drawsPlansForOthers', label: 'Does Applicant Draw Plans, Designs or Specifications for Others?' },
  { key: 'blastingOrExplosives', label: 'Do Any Operations Include Blasting, or Utilize/Store Explosive Material?' },
  { key: 'excavationOrEarthMoving', label: 'Does Any Operation Involve Excavation, Tunneling, Underground Work or Earth Moving?' },
  { key: 'subsRequireLowerLimits', label: 'Do Subcontractors Carry Coverages or Limits Less Than Applicant?' },
  { key: 'subsWorkWithoutCOI', label: 'Are Subcontractors Allowed to Work Without Providing a Certificate of Insurance?' },
  { key: 'leaseEquipmentToOthers', label: 'Does Applicant Lease Equipment to Others, With or Without Operators?' },
  { key: 'installServiceDemoProducts', label: 'Does Applicant Install, Service or Demonstrate Products?' },
  { key: 'foreignProducts', label: 'Foreign Products Sold, Distributed, or Used as Components?' },
  { key: 'researchAndDevelopment', label: 'Research and Development Conducted, or New Products Planned?' },
  { key: 'guaranteesWarranties', label: 'Guarantees, Warranties, or Hold Harmless Agreements?' },
  { key: 'aircraftSpaceProducts', label: 'Products Related to the Aircraft/Space Industry?' },
  { key: 'productsRecalled', label: 'Products Recalled, Discontinued, or Changed?' },
  { key: 'productsRepackagedUnderLabel', label: 'Products of Others Sold or Repackaged Under Applicant Label?' },
  { key: 'productsUnderOthersLabel', label: 'Products Sold Under the Label of Others?' },
  { key: 'vendorsCoverageRequired', label: 'Vendors Coverage Required?' },
  { key: 'sellsToOtherNamedInsured', label: 'Does Any Named Insured Sell to Another Named Insured?' },
  { key: 'medicalFacilities', label: 'Any Medical Facilities Provided, or Medical Professionals Employed/Contracted?' },
  { key: 'radioactiveExposure', label: 'Any Exposure to Radioactive/Nuclear Materials?' },
  { key: 'hazardousMaterialOps', label: 'Do/Have Past, Present or Discontinued Operations Involved Storing, Treating, Discharging, Applying, Disposing or Transporting Hazardous Material?' },
  { key: 'operationsSoldAcquired', label: 'Any Operations Sold, Acquired or Discontinued in the Last 5 Years?' },
  { key: 'rentOrLoanEquipment', label: 'Do You Rent or Loan Equipment to Others?' },
  { key: 'watercraftDocksFloats', label: 'Any Watercraft, Docks or Floats Owned, Hired or Leased?' },
  { key: 'parkingFacilities', label: 'Any Parking Facilities Owned or Rented?' },
  { key: 'parkingFeeCharged', label: 'Is a Fee Charged for Parking?' },
  { key: 'recreationFacilities', label: 'Recreation Facilities Provided?' },
  { key: 'lodgingOperations', label: 'Are There Any Lodging Operations, Including Apartments?' },
  { key: 'swimmingPool', label: 'Is There a Swimming Pool on the Premises?' },
  { key: 'socialEvents', label: 'Are Social Events Sponsored?' },
  { key: 'athleticTeams', label: 'Are Athletic Teams Sponsored?' },
  { key: 'structuralAlterations', label: 'Any Structural Alterations Contemplated?' },
  { key: 'demolitionExposure', label: 'Any Demolition Exposure Contemplated?' },
  { key: 'activeJointVentures', label: 'Has Applicant Been Active in, or Is Currently Active in, Joint Ventures?' },
  { key: 'leaseEmployees', label: 'Do You Lease Employees to or from Other Employers?' },
  { key: 'laborInterchange', label: 'Is There a Labor Interchange with Any Other Business or Subsidiaries?' },
  { key: 'dayCareFacilities', label: 'Are Day Care Facilities Operated or Controlled?' },
  { key: 'crimesOnPremises', label: 'Have Any Crimes Occurred or Been Attempted on Your Premises Within the Last 3 Years?' },
  { key: 'formalSafetyPolicy', label: 'Is There a Formal, Written Safety and Security Policy in Effect?' },
  { key: 'promotionalSafetyClaims', label: "Does the Business' Promotional Literature Make Any Representation About the Safety or Security of the Premises?" },
]

// Questions whose "Yes" answer is covered by structured detail fields instead of (or in
// addition to) a free-text explanation. Every other Yes forces ynExplain_<key>.
export interface DetailField {
  key: string
  label: string
  kind?: 'text' | 'date' | 'percent'
  max?: number
}

export const GENERAL_DETAILS: Record<string, DetailField[]> = {
  applicantSubsidiary: [
    { key: 'parentName', label: 'Parent Company Name' },
    { key: 'relationship', label: 'Relationship Description', max: 39 },
    { key: 'ownershipPercentage', label: 'Ownership Percentage', kind: 'percent' },
  ],
  applicantHasSubsidiaries: [
    { key: 'subsidiaryName', label: 'Subsidiary Company Name' },
    { key: 'relationship', label: 'Relationship Description' },
    { key: 'ownershipPercentage', label: 'Ownership Percentage', kind: 'percent' },
  ],
  otherInsurance: [
    { key: 'lineOfBusiness', label: 'Line of Business' },
  ],
  negativeFinancialAction: [
    { key: 'occurenceDate', label: 'Occurrence Date', kind: 'date' },
    { key: 'explanation', label: 'Explanation' },
    { key: 'resolution', label: 'Resolution' },
    { key: 'resolutionDate', label: 'Resolution Date', kind: 'date' },
  ],
  judgementOrLien: [
    { key: 'occurenceDate', label: 'Occurrence Date', kind: 'date' },
    { key: 'explanation', label: 'Explanation' },
    { key: 'resolution', label: 'Resolution' },
    { key: 'resolutionDate', label: 'Resolution Date', kind: 'date' },
  ],
  safetyViolations: [
    { key: 'occurenceDate', label: 'Occurrence Date', kind: 'date' },
    { key: 'explanation', label: 'Explanation' },
    { key: 'resolution', label: 'Resolution' },
    { key: 'resolutionDate', label: 'Resolution Date', kind: 'date' },
  ],
  exposureFlammables: [{ key: 'description', label: 'Exposure Description' }],
  pastAllegations: [{ key: 'description', label: 'Past Allegations Description' }],
  indictedOrConvicted: [{ key: 'description', label: 'Indicted or Convicted Description' }],
  businessInTrust: [{ key: 'name', label: 'Trust Name' }],
  otherVentures: [{ key: 'description', label: 'Description of Other Ventures' }],
  possessDrones: [{ key: 'description', label: 'Description of Drone Possession' }],
  hireDroneOperators: [{ key: 'description', label: 'Description of Drone Hiring' }],
}

// "Yes" on these is answered by the structured details above; the others get a
// free-text ynExplain box that must be filled when the answer is Yes.
export const EXPLAIN_MAX: Record<string, number> = { rentOrLoanEquipment: 72 }
export const EXPLAIN_DEFAULT_MAX = 136
export const QUESTIONS_WITH_EXPLAIN = YN_QUESTIONS.map(q => q.key).filter(
  k => !(k in GENERAL_DETAILS) && !['coverageTerminated', 'safetyProgramsExist', 'swimmingPool', 'athleticTeams'].includes(k)
)

export interface QuoteOptions {
  /** When the FEIN is asked, must it be filled? (default true; excavation port: false, optional box, format still checked when filled). */
  feinRequired?: boolean
  /** Ask for the FEIN and require it (CCA: true). Thin trade forms may set false (the field is then not shown/posted). */
  fein?: boolean
  /** Ask for the physical county and require it (CCA: true). */
  physicalCounty?: boolean
  /** Which yn_* questions this form shows: true = all 57, 'audit' = the 41 the ACORD audit needs answered
   *  (measured 2026-11-21: the other 16 are 125 tick-boxes where an unticked box is a valid No on the PDF),
   *  false/[] = none, string[] = those keys. */
  yn?: boolean | 'audit' | string[]
  /** When yn questions are shown, must every one be answered? (CCA: true). false = a blank answer is allowed and stays blank. */
  ynRequired?: boolean
  /** When usesSubcontractors = Yes, must the 'type of work subcontracted' box be filled? (default true; roll-off pilot: false, optional box). */
  subcontractedDescriptionRequired?: boolean
  /** Allowed values for tradeType (default TRADE_TYPES, the CCA contractor list). A site with its own classes MUST set this, or validateQuote rejects its own select. */
  tradeTypeOptions?: string[]
}

/** The 41 yn_* keys whose blank makes audit.py fail (text Y/N boxes on ACORD 126/140 pages). Measured by blanking each key. */
export const YN_AUDIT_REQUIRED: string[] = [
  "buildingLeasedToOthers",
  "priorExclusionUninsured",
  "tailCoveragePurchased",
  "drawsPlansForOthers",
  "blastingOrExplosives",
  "excavationOrEarthMoving",
  "subsRequireLowerLimits",
  "subsWorkWithoutCOI",
  "leaseEquipmentToOthers",
  "installServiceDemoProducts",
  "foreignProducts",
  "researchAndDevelopment",
  "guaranteesWarranties",
  "aircraftSpaceProducts",
  "productsRecalled",
  "productsRepackagedUnderLabel",
  "productsUnderOthersLabel",
  "vendorsCoverageRequired",
  "sellsToOtherNamedInsured",
  "medicalFacilities",
  "radioactiveExposure",
  "hazardousMaterialOps",
  "operationsSoldAcquired",
  "rentOrLoanEquipment",
  "watercraftDocksFloats",
  "parkingFacilities",
  "parkingFeeCharged",
  "recreationFacilities",
  "lodgingOperations",
  "swimmingPool",
  "socialEvents",
  "athleticTeams",
  "structuralAlterations",
  "demolitionExposure",
  "activeJointVentures",
  "leaseEmployees",
  "laborInterchange",
  "dayCareFacilities",
  "crimesOnPremises",
  "formalSafetyPolicy",
  "promotionalSafetyClaims"
]

export const DEFAULT_OPTIONS: Required<QuoteOptions> = { feinRequired: true, fein: true, physicalCounty: true, yn: true, ynRequired: true, subcontractedDescriptionRequired: true, tradeTypeOptions: TRADE_TYPES }

export function resolveOptions(o: QuoteOptions = {}): Required<QuoteOptions> {
  return { ...DEFAULT_OPTIONS, ...o }
}

/** The yn question keys a form shows (order = spec order). Unknown keys throw so a typo cannot silently drop a question. */
export function ynKeysFor(o: QuoteOptions = {}): string[] {
  const { yn } = resolveOptions(o)
  const all = YN_QUESTIONS.map(q => q.key)
  if (yn === true) return all
  if (yn === 'audit') return all.filter(k => YN_AUDIT_REQUIRED.includes(k))
  if (!yn) return []
  for (const k of yn) if (!all.includes(k)) throw new Error(`Unknown yn question key: ${k}`)
  return all.filter(k => yn.includes(k))
}

/** Field names a form with these options posts. Hidden groups are NOT posted at all. */
export function fieldsFor(o: QuoteOptions = {}): string[] {
  const opts = resolveOptions(o)
  const ynShown = new Set(ynKeysFor(opts))
  const drop = new Set<string>()
  if (!opts.fein) drop.add('fein')
  if (!opts.physicalCounty) drop.add('physicalCounty')
  const hiddenYn = (n: string) => {
    for (const q of YN_QUESTIONS) {
      if (ynShown.has(q.key)) continue
      if (n === `yn_${q.key}` || n === `ynExplain_${q.key}` || n.startsWith(`general_${q.key}__`)) return true
    }
    return false
  }
  return ALL_FIELDS.filter(n => !drop.has(n) && !hiddenYn(n))
}

/**
 * Blank-is-not-No enforcement (the only place a yn value is normalised): anything other than exactly
 * 'Yes' or 'No' becomes ''. Nothing in this package ever writes 'No' for an unanswered question.
 */
export function sanitizeYn(d: Flat): Flat {
  const out = { ...d }
  for (const q of YN_QUESTIONS) {
    const k = `yn_${q.key}`
    if (k in out && out[k] !== 'Yes' && out[k] !== 'No') out[k] = ''
  }
  return out
}

export const detailName = (q: string, f: string) => `general_${q}__${f}`

// -------------------------------------------------------------- scalar field list
// Existing live fields are listed first and are NEVER renamed.
export const LIVE_FIELDS = [
  'firstName','lastName','contactTitle','businessName','dba','entityType','yearBusinessStarted','website',
  'address','city','state','zip','premisesAddress','email','phone','fein',
  'businessDescription','tradeType','classCode','naicsCode','statesOfOperation','residentialPct','commercialPct',
  'newConstructionPct','usesSubcontractors','subsCarryInsurance',
  'lastGrossSales','lastSubcontractingCosts','lastEmployeeCount','lastEmployeePayroll','lastProjectCount',
  'lastLargestJobAmount','lastLargestJobDescription',
  'nextGrossEstimate','nextSubcontractingCosts','nextEmployeeCount','nextEmployeePayroll','nextOwnerPayroll',
  'nextMaterialCosts','nextJobAmount','nextJobDescription','partTimeEmployees','ownerCount',
  'currentlyInsured','currentCarrier','currentPolicyExpiration','currentLimits','currentPremium','cancelledOrNonRenewed',
  'lossesLast3Years','lossCount','lossDescription',
  'coverageTypes','requestedLimits','desiredEffectiveDate','additionalInsuredNeeded','notes',
]

export const NEW_FIELDS = [
  // mailing + physical location
  'mailingCounty','physicalAddress','physicalCity','physicalCounty','physicalState','physicalZip',
  // exposure
  'fullTimeEmployees','businessStartDate','sicCode','locationDescription','buildingAreaSqFt','occupiedAreaSqFt',
  'retailPercent','offPremisesPercent','numberOfMembers','workSubcontractedPercent','workSubcontractedDescription',
  // policy
  'desiredExpirationDate',
  // GL limits + selections
  'glEachOccurrence','glGeneralAggregate','glProductsCompOpsAggregate','glPersonalAdvertisingInjury',
  'glDamageToRentedPremises','glMedicalExpense','glOfferPackages',
  'glTrigger','glAggregateAppliesTo','premisesCityLimits','premisesInterest','billingPlan',
  // yes-triggered selections
  'safetyProgramElements','safetyOtherText',
  'athleticSportDescription','athleticContactSport','athleticSponsorshipExtent','athleticTeamAgeGroup',
  'poolConstruction','poolSafetyFeatures',
  'rentEquipmentTypes','rentEquipmentInstructionGiven','leaseEmployeesWorkersCompCarried',
  'general_coverageTerminated__nonPayment','general_coverageTerminated__nonRenewal',
  'general_coverageTerminated__agentStopRepresenting','general_coverageTerminated__underwriting',
  'general_coverageTerminated__conditionCorrected','general_coverageTerminated__conditionCorrectedDescription',
  // loss row
  'lossLineOfBusiness','lossDate','lossHistoryStatus','lossAmountPaid','lossAmountReserved','lossSubrogation','lossAdditional',
  // other coverage checklist
  'otherCoverages',
]

export const DYNAMIC_FIELDS: string[] = [
  ...YN_QUESTIONS.map(q => `yn_${q.key}`),
  ...QUESTIONS_WITH_EXPLAIN.map(k => `ynExplain_${k}`),
  ...Object.entries(GENERAL_DETAILS).flatMap(([q, fs]) => fs.map(f => detailName(q, f.key))),
  ...OTHER_COVERAGES.map(c => `otherCoverageDetail_${c.key}`),
]

// `name` is derived (first + last) so the lead pipeline's name column is populated.
export const ALL_FIELDS: string[] = [...LIVE_FIELDS, ...NEW_FIELDS, ...DYNAMIC_FIELDS, 'name']

export function emptyQuote(): Flat {
  const o: Flat = {}
  for (const f of ALL_FIELDS) o[f] = ''
  o.coverageTypes = 'General Liability'
  return o
}

// ------------------------------------------------------------------- labels
export const LABELS: Record<string, string> = {
  firstName: 'First name', lastName: 'Last name', businessName: 'Business name', entityType: 'Business entity',
  businessStartDate: 'Date business started', fein: 'FEIN', sicCode: 'SIC code', naicsCode: 'NAICS code',
  address: 'Mailing address', city: 'Mailing city', state: 'Mailing state', zip: 'Mailing ZIP',
  physicalAddress: 'Physical street address', physicalCity: 'Physical city', physicalCounty: 'Physical county',
  physicalState: 'Physical state', physicalZip: 'Physical ZIP', email: 'Email', phone: 'Phone',
  businessDescription: 'Description of operations', tradeType: 'Trade / class of business',
  statesOfOperation: 'States where you work', usesSubcontractors: 'Do you use subcontractors',
  subsCarryInsurance: 'Do your subs carry their own insurance', workSubcontractedPercent: 'Percent of work subcontracted',
  workSubcontractedDescription: 'Type of work subcontracted', lastSubcontractingCosts: 'Amount paid to subcontractors (last 12 months)',
  lastGrossSales: 'Annual gross sales / revenue', fullTimeEmployees: 'Full-time employees', partTimeEmployees: 'Part-time employees',
  locationDescription: 'Description of the premises', desiredEffectiveDate: 'Coverage start date',
  desiredExpirationDate: 'Coverage end date', glEachOccurrence: 'Each occurrence limit',
  glGeneralAggregate: 'General aggregate limit', glProductsCompOpsAggregate: 'Products / completed operations aggregate',
  glPersonalAdvertisingInjury: 'Personal & advertising injury limit', glDamageToRentedPremises: 'Damage to rented premises limit',
  glMedicalExpense: 'Medical expense limit', glTrigger: 'Occurrence / claims-made', glAggregateAppliesTo: 'How the aggregate applies',
  premisesCityLimits: 'Inside / outside city limits', premisesInterest: 'Owner / tenant', billingPlan: 'Billing plan',
  currentlyInsured: 'Currently insured', lossesLast3Years: 'Losses in the last 3 years',
  lossCount: 'Number of losses', lossLineOfBusiness: 'Loss line of business', lossDate: 'Loss date',
  lossDescription: 'Loss description', lossAmountPaid: 'Loss amount paid', lossAmountReserved: 'Loss amount reserved',
  lossHistoryStatus: 'Loss open/closed', lossSubrogation: 'Loss subrogation',
  safetyProgramElements: 'Safety program elements', safetyOtherText: 'Other safety program',
  athleticSportDescription: 'Athletic team sport', athleticContactSport: 'Athletic team contact sport',
  athleticSponsorshipExtent: 'Athletic team sponsorship extent', athleticTeamAgeGroup: 'Athletic team age group',
  poolConstruction: 'Pool construction', poolSafetyFeatures: 'Pool safety features',
  rentEquipmentTypes: 'Type of equipment rented or loaned', rentEquipmentInstructionGiven: 'Instruction given to renters',
  leaseEmployeesWorkersCompCarried: 'Workers compensation carried for leased employees',
  general_coverageTerminated__conditionCorrectedDescription: 'Description of how the condition was corrected',
  general_coverageTerminated__reasons: 'Reason coverage was terminated',
}

const ynLabel = (k: string) => YN_QUESTIONS.find(q => q.key === k)?.label ?? k
export function labelFor(name: string): string {
  if (LABELS[name]) return LABELS[name]
  if (name.startsWith('yn_')) return ynLabel(name.slice(3))
  if (name.startsWith('ynExplain_')) return `Explanation for: ${ynLabel(name.slice(10))}`
  if (name.startsWith('general_')) {
    const [q, f] = name.slice(8).split('__')
    const d = GENERAL_DETAILS[q]?.find(x => x.key === f)
    return d ? `${d.label} (${ynLabel(q)})` : name
  }
  if (name.startsWith('otherCoverageDetail_')) {
    const c = OTHER_COVERAGES.find(x => `otherCoverageDetail_${x.key}` === name)
    return `Details for ${c?.label ?? name}`
  }
  return name
}

// ------------------------------------------------------------------ validation
const ZIP_RE = /^\d{5}(-\d{4})?$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MONEY_RE = /^\$?\d{1,3}(,\d{3})+(\.\d{1,2})?$|^\$?\d+(\.\d{1,2})?$/
const INT_RE = /^\d+$/
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export const MONEY_FIELDS = [
  'lastGrossSales','lastSubcontractingCosts','lastEmployeePayroll','lastLargestJobAmount','nextGrossEstimate',
  'nextSubcontractingCosts','nextEmployeePayroll','nextOwnerPayroll','nextMaterialCosts','nextJobAmount',
  'currentPremium','lossAmountPaid','lossAmountReserved',
]
export const COUNT_FIELDS = [
  'lastEmployeeCount','nextEmployeeCount','fullTimeEmployees','partTimeEmployees','ownerCount','lastProjectCount',
  'lossCount','buildingAreaSqFt','occupiedAreaSqFt','numberOfMembers',
]
export const PERCENT_FIELDS = [
  'residentialPct','commercialPct','newConstructionPct','workSubcontractedPercent','retailPercent','offPremisesPercent',
]
// hard display limits of the ACORD boxes (silent clipping otherwise)
export const MAX_LEN: Record<string, number> = {
  physicalAddress: 35, physicalCity: 21, physicalCounty: 19, locationDescription: 54,
  lossLineOfBusiness: 11, lossDescription: 48, athleticSportDescription: 24, athleticSponsorshipExtent: 41,
  lastSubcontractingCosts: 16, workSubcontractedPercent: 7,
}

// SIC / NAICS are NOT required: the agency assigns them from the trade (josh-sms work order 2026-11-17-076,
// "Do NOT ask SIC/NAICS"); they stay on the form as optional "if known" fields and are format-checked when filled.
// desiredExpirationDate is NOT required: it defaults to 12 months after the start date (form + server route).
const ALWAYS_REQUIRED = [
  'firstName','lastName','businessName','entityType','businessStartDate',
  'address','city','state','zip','phone','email',
  'physicalAddress','physicalCity','physicalState','physicalZip','locationDescription',
  'businessDescription','tradeType','statesOfOperation',
  'fullTimeEmployees','partTimeEmployees','lastGrossSales',
  'usesSubcontractors','lastSubcontractingCosts','workSubcontractedPercent',
  'desiredEffectiveDate',
  'glEachOccurrence','glGeneralAggregate','glProductsCompOpsAggregate','glPersonalAdvertisingInjury',
  'glDamageToRentedPremises','glMedicalExpense',
  'glTrigger','glAggregateAppliesTo','premisesCityLimits','premisesInterest','billingPlan',
  'currentlyInsured','lossesLast3Years',
]

export const SELECT_OPTIONS: Record<string, string[]> = {
  entityType: ENTITY_TYPES, tradeType: TRADE_TYPES, state: US_STATE_CODES, physicalState: US_STATE_CODES,
  glEachOccurrence: GL_EACH_OCCURRENCE, glGeneralAggregate: GL_GENERAL_AGGREGATE,
  glProductsCompOpsAggregate: GL_PRODUCTS_COMPOPS, glPersonalAdvertisingInjury: GL_PERSONAL_ADV,
  glDamageToRentedPremises: GL_RENTED_PREMISES, glMedicalExpense: GL_MEDICAL_EXPENSE,
  glTrigger: ['Occurrence', 'Claims Made'],
  glAggregateAppliesTo: ['Per Policy', 'Per Project', 'Per Location', 'Other'],
  premisesCityLimits: ['Inside City Limits', 'Outside City Limits'],
  premisesInterest: ['Owner', 'Tenant'],
  billingPlan: ['Direct Bill', 'Agency Bill'],
  usesSubcontractors: YES_NO, subsCarryInsurance: YES_NO, currentlyInsured: YES_NO, lossesLast3Years: YES_NO,
  athleticContactSport: YES_NO, athleticTeamAgeGroup: ['12 and Under', '13 Through 18', 'Over 18'],
  poolConstruction: ['Above Ground', 'In Ground'], rentEquipmentInstructionGiven: YES_NO,
  leaseEmployeesWorkersCompCarried: YES_NO, lossLineOfBusiness: LOSS_LINES,
  lossHistoryStatus: ['Open', 'Closed'], lossSubrogation: YES_NO,
}

/** ISO date one year after `iso` (Feb 29 -> Feb 28), or '' when `iso` is not a valid YYYY-MM-DD date. */
export function oneYearAfter(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '')
  if (!m) return ''
  const y = Number(m[1]) + 1
  const day = m[2] === '02' && m[3] === '29' ? '28' : m[3]
  return `${y}-${m[2]}-${day}`
}

const listOf = (v: string | undefined) => (v ? v.split(', ').filter(Boolean) : [])

function validDate(v: string): Date | null {
  if (!ISO_DATE_RE.test(v)) return null
  const d = new Date(`${v}T00:00:00`)
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v) return null
  return d
}

/**
 * Returns { fieldName: message } for every problem. Empty object = valid.
 * Messages always name the field. Order of keys follows form order.
 */
export function validateQuote(d: Flat, now: Date = new Date(), options: QuoteOptions = {}): Record<string, string> {
  const opts = resolveOptions(options)
  const err: Record<string, string> = {}
  const get = (k: string) => (d[k] ?? '').trim()
  const need = (k: string, msg?: string) => {
    if (!get(k)) err[k] = msg ?? `${labelFor(k)} is required`
  }

  ALWAYS_REQUIRED.forEach(k => need(k))
  if (opts.fein && opts.feinRequired) need('fein')
  if (opts.physicalCounty) need('physicalCounty')

  // conditionals
  if (get('usesSubcontractors') === 'Yes') {
    need('subsCarryInsurance'); if (opts.subcontractedDescriptionRequired) need('workSubcontractedDescription')
  }
  // currentCarrier / currentPolicyExpiration stay optional (joshmac ruling)
  if (get('lossesLast3Years') === 'Yes') {
    ;['lossCount','lossLineOfBusiness','lossDate','lossDescription','lossHistoryStatus','lossAmountPaid','lossAmountReserved','lossSubrogation']
      .forEach(k => need(k))
  }

  // format checks (only when filled)
  const fmt = (k: string, ok: boolean, msg: string) => { if (get(k) && !ok) err[k] = msg }
  fmt('email', EMAIL_RE.test(get('email')), 'Email must be a valid address')
  fmt('phone', /^[\d\s\-().+]+$/.test(get('phone')) && get('phone').replace(/\D/g, '').length >= 10, 'Phone must be a valid number with area code')
  fmt('zip', ZIP_RE.test(get('zip')), 'Mailing ZIP must be 5 digits (or ZIP+4)')
  fmt('physicalZip', ZIP_RE.test(get('physicalZip')), 'Physical ZIP must be 5 digits (or ZIP+4)')
  fmt('fein', /^\d{2}-?\d{7}$/.test(get('fein')), 'FEIN must be 9 digits (XX-XXXXXXX)')
  fmt('sicCode', /^\d{4}$/.test(get('sicCode')), 'SIC code must be 4 digits')
  fmt('naicsCode', /^\d{6}$/.test(get('naicsCode')), 'NAICS code must be 6 digits')
  MONEY_FIELDS.forEach(k => fmt(k, MONEY_RE.test(get(k)), `${labelFor(k)} must be an exact dollar amount (numbers only, e.g. 250000)`))
  COUNT_FIELDS.forEach(k => fmt(k, INT_RE.test(get(k)), `${labelFor(k)} must be a whole number`))
  PERCENT_FIELDS.forEach(k => fmt(k, /^\d+(\.\d+)?$/.test(get(k)) && Number(get(k)) <= 100, `${labelFor(k)} must be a number from 0 to 100`))
  Object.entries(MAX_LEN).forEach(([k, n]) => fmt(k, get(k).length <= n, `${labelFor(k)} must be ${n} characters or fewer`))
  Object.entries({ ...SELECT_OPTIONS, tradeType: opts.tradeTypeOptions }).forEach(([k, list]) => fmt(k, list.includes(get(k)), `${labelFor(k)}: choose one of the listed options`))

  // dates
  const start = get('businessStartDate')
  if (start) {
    const sd = validDate(start)
    if (!sd || sd.getFullYear() < 1800) err.businessStartDate = 'Date business started must be a valid date'
    else if (sd.getTime() > now.getTime()) err.businessStartDate = 'Date business started cannot be in the future'
  }
  const eff = get('desiredEffectiveDate')
  const exp = get('desiredExpirationDate')
  const ed = eff ? validDate(eff) : null
  const xd = exp ? validDate(exp) : null
  if (eff && !ed) err.desiredEffectiveDate = 'Coverage start date must be a valid date'
  if (exp && !xd) err.desiredExpirationDate = 'Coverage end date must be a valid date'
  if (ed && xd && xd.getTime() <= ed.getTime()) err.desiredExpirationDate = 'Coverage end date must be after the start date'
  if (get('lossDate') && !validDate(get('lossDate'))) err.lossDate = 'Loss date must be a valid date'

  // 57 Yes/No questions: every one answered; a Yes forces its follow-up
  const shown = new Set(ynKeysFor(opts))
  for (const q of YN_QUESTIONS) {
    if (!shown.has(q.key)) continue
    const a = get(`yn_${q.key}`)
    if (a !== 'Yes' && a !== 'No') {
      // blank is legal only when ynRequired is false; it is then stored blank (never 'No')
      if (a !== '' || opts.ynRequired) err[`yn_${q.key}`] = `Please answer Yes or No: ${q.label}`
      continue
    }
    if (a !== 'Yes') continue
    if (QUESTIONS_WITH_EXPLAIN.includes(q.key)) {
      const k = `ynExplain_${q.key}`
      const max = EXPLAIN_MAX[q.key] ?? EXPLAIN_DEFAULT_MAX
      if (!get(k)) err[k] = `Please explain your "Yes" answer: ${q.label}`
      else if (get(k).length > max) err[k] = `Explanation must be ${max} characters or fewer: ${q.label}`
    }
    for (const f of GENERAL_DETAILS[q.key] ?? []) {
      const k = detailName(q.key, f.key)
      if (!get(k)) { err[k] = `${f.label} is required because you answered Yes: ${q.label}`; continue }
      if (f.kind === 'date' && !validDate(get(k))) err[k] = `${f.label} must be a valid date`
      else if (f.kind === 'percent' && !(/^\d+(\.\d+)?$/.test(get(k)) && Number(get(k)) <= 100)) err[k] = `${f.label} must be a number from 0 to 100`
      else if (f.max && get(k).length > f.max) err[k] = `${f.label} must be ${f.max} characters or fewer`
    }
  }

  // Yes-triggered selections
  const yes = (k: string) => get(`yn_${k}`) === 'Yes'
  if (yes('coverageTerminated')) {
    // at least one of the four REASONS; "Condition Corrected" alone does not satisfy this
    const ticked = TERMINATION_REASONS.filter(r => get(`general_coverageTerminated__${r.key}`) === 'Yes')
    if (!ticked.length) err.general_coverageTerminated__nonPayment = 'Tick at least one reason the coverage was terminated'
    if (get('general_coverageTerminated__conditionCorrected') === 'Yes') need('general_coverageTerminated__conditionCorrectedDescription')
  }
  if (yes('safetyProgramsExist')) {
    const els = listOf(get('safetyProgramElements'))
    if (!els.length) err.safetyProgramElements = 'Select at least one safety program element'
    if (els.includes('Other')) need('safetyOtherText')
  }
  if (yes('athleticTeams')) {
    ;['athleticSportDescription','athleticContactSport','athleticSponsorshipExtent','athleticTeamAgeGroup'].forEach(k => need(k))
  }
  if (yes('swimmingPool')) {
    need('poolConstruction')
    if (!listOf(get('poolSafetyFeatures')).length) err.poolSafetyFeatures = 'Select at least one pool safety feature'
  }
  if (yes('rentOrLoanEquipment')) {
    if (!listOf(get('rentEquipmentTypes')).length) err.rentEquipmentTypes = 'Select the type of equipment rented or loaned'
    need('rentEquipmentInstructionGiven')
  }
  if (yes('leaseEmployees')) need('leaseEmployeesWorkersCompCarried')

  // Other coverage: a ticked item forces its free-text box
  for (const c of listOf(get('otherCoverages'))) {
    const k = `otherCoverageDetail_${c}`
    if (!OTHER_COVERAGES.some(x => x.key === c)) err.otherCoverages = 'Unknown coverage selection'
    else if (!get(k)) err[k] = `Tell us what you need for ${OTHER_COVERAGES.find(x => x.key === c)!.label}`
  }

  // reorder: keep insertion order as built above (form order approximated)
  return err
}
