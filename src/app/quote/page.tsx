"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FadeIn } from "@/components/animations/FadeIn";
import { SITE } from "@/lib/site";
import { US_STATES, QUOTE_SERVICE_TYPES, YEARS_OPTIONS, COPY } from "@/lib/content";
import { CheckCircle2, ShieldCheck, ArrowRight, Phone, Clock, Zap, MapPin } from "lucide-react";

const WEBHOOK_URL = `https://josh.jam-bot.com/social-api/api/leads/webhook/netlify?tenant=josh&site=${SITE.domain}`;

const trustItems = [
  { icon: ShieldCheck, title: COPY.quote.trustNicheTitle, desc: COPY.quote.trustNicheDesc },
  { icon: Zap, title: "~15-minute quotes", desc: "Real quotes from real markets, fast." },
  { icon: Clock, title: "2-hour claims response", desc: "When a loss hits, you reach a person." },
  { icon: MapPin, title: "All 50 states", desc: "Licensed nationwide — NPN #8608479." },
];

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: "", businessName: "", email: "", phone: "", state: "", serviceType: "", yearsInBusiness: "", message: "", "bot-field": "",
    address: "", city: "", zip: "",
    priorGrossSales: "", priorSubcontractorExpenses: "", priorEmployeeCount: "", priorEmployeePayroll: "",
    estGrossSales: "", estSubcontractorExpenses: "", estEmployeeCount: "", estEmployeePayroll: "", estMaterialCosts: "",
    subsHaveInsurance: "", subsInsuredPercent: "", needUninsuredSubCoverage: "",
    coverage_types: "", year_business_started: "", business_description: "", class_code_1: "", class_code_2: "", class_code_3: "", class_code_4: "", class_code_5: "", residential_vs_commercial: "", new_vs_existing_construction: "", largest_projects: "", prior_carrier_name: "", prior_policy_number: "", prior_policy_expiration: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData["bot-field"]) return;
    setSubmitting(true);
    setError("");
    try {
      await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ form_name: "quote", source: SITE.domain, ...formData }) });
      setSubmitted(true);
    } catch {
      setError(COPY.quote.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-adobe bg-cream/50 text-espresso placeholder-mocha/60 focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/20 transition-all text-sm";
  const labelClass = "block text-sm font-heading font-semibold text-espresso mb-1.5";

  return (
    <>
      <Navbar />
      <main>
        <section className="relative bg-warm-radial pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="container-wide">
            <FadeIn className="text-center max-w-2xl mx-auto mb-12">
              <span className="pill-clay"><ShieldCheck className="h-3.5 w-3.5" /> Free quote</span>
              <h1 className="mt-5 font-heading font-extrabold text-espresso text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                {COPY.quote.h1Lead}{" "}
                <span className="bg-gradient-to-r from-clay via-clay-light to-gold-dark bg-clip-text text-transparent">{COPY.quote.h1Highlight}</span>
              </h1>
              <p className="mt-5 lead">{COPY.quote.lead}</p>
            </FadeIn>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                {trustItems.map((item) => (
                  <FadeIn key={item.title}>
                    <div className="flex gap-3 p-5 rounded-2xl bg-white border border-adobe shadow-card">
                      <span className="flex-shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-clay/10 text-clay"><item.icon className="h-5 w-5" strokeWidth={2.2} /></span>
                      <div>
                        <p className="font-heading font-bold text-espresso text-sm">{item.title}</p>
                        <p className="text-mocha text-xs leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
                <FadeIn>
                  <div className="p-5 rounded-2xl bg-espresso text-cream text-center">
                    <p className="text-xs font-heading font-bold uppercase tracking-wider text-gold mb-2">Prefer to call?</p>
                    <a href={SITE.phoneHref} className="flex items-center justify-center gap-2 text-cream font-heading font-extrabold text-xl hover:text-gold-light transition-colors"><Phone className="h-5 w-5" />{SITE.phone}</a>
                    <p className="text-xs text-cream/60 mt-1">{SITE.hours}</p>
                  </div>
                </FadeIn>
              </div>

              <div className="lg:col-span-2">
                {submitted ? (
                  <FadeIn>
                    <div className="p-10 md:p-12 rounded-3xl bg-white border border-adobe shadow-card text-center">
                      <div className="w-16 h-16 rounded-full bg-sage/15 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="h-8 w-8 text-sage" /></div>
                      <h2 className="font-heading font-extrabold text-espresso text-2xl mb-3">Quote request received</h2>
                      <p className="text-mocha mb-2">Thank you! We'll review your operation and reach out within one business day with personalized quotes.</p>
                      <p className="text-sm text-mocha">Need it sooner? Call <a href={SITE.phoneHref} className="text-clay font-heading font-semibold">{SITE.phone}</a>.</p>
                      <Link href="/" className="btn-secondary mt-6 inline-flex">Back to home</Link>
                    </div>
                  </FadeIn>
                ) : (
                  <FadeIn>
                    <form name="quote" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit} className="rounded-3xl bg-white border border-adobe shadow-card p-7 md:p-9 space-y-5">
                      <input type="hidden" name="form-name" value="quote" />
                      <input name="bot-field" type="hidden" value={formData["bot-field"]} onChange={handleChange} className="hidden" />

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label htmlFor="name" className={labelClass}>Full name *</label><input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Jane Smith" className={inputClass} /></div>
                        <div><label htmlFor="businessName" className={labelClass}>Business name *</label><input id="businessName" name="businessName" type="text" required value={formData.businessName} onChange={handleChange} placeholder={COPY.quote.businessPlaceholder} className={inputClass} /></div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label htmlFor="email" className={labelClass}>Email *</label><input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder={COPY.quote.emailPlaceholder} className={inputClass} /></div>
                        <div><label htmlFor="phone" className={labelClass}>Phone *</label><input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder={COPY.quote.phonePlaceholder} className={inputClass} /></div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label htmlFor="state" className={labelClass}>Primary state *</label>
                          <select id="state" name="state" required value={formData.state} onChange={handleChange} className={inputClass}><option value="">Select a state…</option>{US_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}</select>
                        </div>
                        <div><label htmlFor="yearsInBusiness" className={labelClass}>Years in business</label>
                          <select id="yearsInBusiness" name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleChange} className={inputClass}><option value="">Select…</option>{YEARS_OPTIONS.map((y) => (<option key={y} value={y}>{y}</option>))}</select>
                        </div>
                      </div>

                      <div className="space-y-4 pt-5 border-t border-adobe">
                        <div>
                          <h3 className="font-heading font-bold text-espresso text-sm uppercase tracking-wider">Business address</h3>
                          <p className="text-xs text-mocha/70 mt-0.5">Where your operation is based.</p>
                        </div>
                        <div><label htmlFor="address" className={labelClass}>Street address</label><input id="address" name="address" type="text" value={formData.address} onChange={handleChange} placeholder="123 Main St, Suite 200" className={inputClass} /></div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div><label htmlFor="city" className={labelClass}>City</label><input id="city" name="city" type="text" value={formData.city} onChange={handleChange} placeholder="Phoenix" className={inputClass} /></div>
                          <div><label htmlFor="zip" className={labelClass}>ZIP code</label><input id="zip" name="zip" type="text" inputMode="numeric" pattern="[0-9]{5}(-[0-9]{4})?" value={formData.zip} onChange={handleChange} placeholder="85001" className={inputClass} /></div>
                        </div>
                      </div>

                      <div><label htmlFor="serviceType" className={labelClass}>What do you need? *</label>
                        <select id="serviceType" name="serviceType" required value={formData.serviceType} onChange={handleChange} className={inputClass}><option value="">Select coverage…</option>{QUOTE_SERVICE_TYPES.map((s) => (<option key={s} value={s}>{s}</option>))}</select>
                      </div>

                      <div className="space-y-4 pt-5 border-t border-adobe">
                        <div>
                          <h3 className="font-heading font-bold text-espresso text-sm uppercase tracking-wider">Prior year</h3>
                          <p className="text-xs text-mocha/70 mt-0.5">Your last completed 12 months. Best estimates are fine.</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div><label htmlFor="priorGrossSales" className={labelClass}>Gross sales</label><input id="priorGrossSales" name="priorGrossSales" type="text" inputMode="numeric" value={formData.priorGrossSales} onChange={handleChange} placeholder="$1,200,000" className={inputClass} /></div>
                          <div><label htmlFor="priorSubcontractorExpenses" className={labelClass}>Subcontractor expenses</label><input id="priorSubcontractorExpenses" name="priorSubcontractorExpenses" type="text" inputMode="numeric" value={formData.priorSubcontractorExpenses} onChange={handleChange} placeholder="$250,000" className={inputClass} /></div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div><label htmlFor="priorEmployeeCount" className={labelClass}>Employee count</label><input id="priorEmployeeCount" name="priorEmployeeCount" type="text" inputMode="numeric" value={formData.priorEmployeeCount} onChange={handleChange} placeholder="8" className={inputClass} /></div>
                          <div><label htmlFor="priorEmployeePayroll" className={labelClass}>Employee payroll</label><input id="priorEmployeePayroll" name="priorEmployeePayroll" type="text" inputMode="numeric" value={formData.priorEmployeePayroll} onChange={handleChange} placeholder="$420,000" className={inputClass} /></div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-5 border-t border-adobe">
                        <div>
                          <h3 className="font-heading font-bold text-espresso text-sm uppercase tracking-wider">Next twelve months — estimates</h3>
                          <p className="text-xs text-mocha/70 mt-0.5">What you expect over the coming year.</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div><label htmlFor="estGrossSales" className={labelClass}>Estimated gross sales</label><input id="estGrossSales" name="estGrossSales" type="text" inputMode="numeric" value={formData.estGrossSales} onChange={handleChange} placeholder="$1,500,000" className={inputClass} /></div>
                          <div><label htmlFor="estSubcontractorExpenses" className={labelClass}>Estimated subcontractor expenses</label><input id="estSubcontractorExpenses" name="estSubcontractorExpenses" type="text" inputMode="numeric" value={formData.estSubcontractorExpenses} onChange={handleChange} placeholder="$300,000" className={inputClass} /></div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div><label htmlFor="estEmployeeCount" className={labelClass}>Estimated employee count (year total)</label><input id="estEmployeeCount" name="estEmployeeCount" type="text" inputMode="numeric" value={formData.estEmployeeCount} onChange={handleChange} placeholder="10" className={inputClass} /></div>
                          <div><label htmlFor="estEmployeePayroll" className={labelClass}>Estimated annual employee payroll</label><input id="estEmployeePayroll" name="estEmployeePayroll" type="text" inputMode="numeric" value={formData.estEmployeePayroll} onChange={handleChange} placeholder="$520,000" className={inputClass} /></div>
                        </div>
                        <div><label htmlFor="estMaterialCosts" className={labelClass}>Estimated material costs</label><input id="estMaterialCosts" name="estMaterialCosts" type="text" inputMode="numeric" value={formData.estMaterialCosts} onChange={handleChange} placeholder="$180,000" className={inputClass} /></div>
                      </div>

                      <div className="space-y-4 pt-5 border-t border-adobe">
                        <div>
                          <h3 className="font-heading font-bold text-espresso text-sm uppercase tracking-wider">Subcontractor insurance</h3>
                          <p className="text-xs text-mocha/70 mt-0.5">This drives how your policy is rated — please answer even if you rarely use subs.</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div><label htmlFor="subsHaveInsurance" className={labelClass}>Do your subcontractors have insurance?</label><select id="subsHaveInsurance" name="subsHaveInsurance" value={formData.subsHaveInsurance} onChange={handleChange} className={inputClass}><option value="">Select…</option><option value="Yes — all of them">Yes — all of them</option><option value="Some of them">Some of them</option><option value="No">No</option><option value="We don't use subcontractors">We don't use subcontractors</option></select></div>
                          <div><label htmlFor="subsInsuredPercent" className={labelClass}>What percent of your subcontractors have insurance?</label><input id="subsInsuredPercent" name="subsInsuredPercent" type="text" inputMode="numeric" value={formData.subsInsuredPercent} onChange={handleChange} placeholder="75%" className={inputClass} /></div>
                        </div>
                        <div><label htmlFor="needUninsuredSubCoverage" className={labelClass}>Do you need coverage for uninsured subcontractors?</label><select id="needUninsuredSubCoverage" name="needUninsuredSubCoverage" value={formData.needUninsuredSubCoverage} onChange={handleChange} className={inputClass}><option value="">Select…</option><option value="Yes">Yes</option><option value="No">No</option><option value="Not sure">Not sure</option></select></div>
                      </div>

                      <div>
                        <label htmlFor="message" className={labelClass}>Tell us about your operation <span className="text-mocha/60 font-normal">(optional)</span></label>
                        <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} placeholder={COPY.quote.messagePlaceholder} className={`${inputClass} resize-none`} />
                      </div>
                      {/* complete class field set — forms-required-fields.json */}
                      <div>
                        <label className={labelClass}>Coverages requested (checkboxes)</label>
                        <div className="flex flex-wrap pt-1">
                          <label className="inline-flex items-center gap-2 mr-4 mb-1"><input type="checkbox" name="coverage_types" value="General liability" onChange={(e) => { const cur = (formData.coverage_types || "").split(", ").filter(Boolean); const next = e.target.checked ? [...cur, e.target.value] : cur.filter((v) => v !== e.target.value); setFormData({ ...formData, coverage_types: next.join(", ") }); }} /><span className="text-sm">General liability</span></label>
                          <label className="inline-flex items-center gap-2 mr-4 mb-1"><input type="checkbox" name="coverage_types" value="Commercial auto" onChange={(e) => { const cur = (formData.coverage_types || "").split(", ").filter(Boolean); const next = e.target.checked ? [...cur, e.target.value] : cur.filter((v) => v !== e.target.value); setFormData({ ...formData, coverage_types: next.join(", ") }); }} /><span className="text-sm">Commercial auto</span></label>
                          <label className="inline-flex items-center gap-2 mr-4 mb-1"><input type="checkbox" name="coverage_types" value="Workers compensation" onChange={(e) => { const cur = (formData.coverage_types || "").split(", ").filter(Boolean); const next = e.target.checked ? [...cur, e.target.value] : cur.filter((v) => v !== e.target.value); setFormData({ ...formData, coverage_types: next.join(", ") }); }} /><span className="text-sm">Workers compensation</span></label>
                          <label className="inline-flex items-center gap-2 mr-4 mb-1"><input type="checkbox" name="coverage_types" value="Umbrella / excess" onChange={(e) => { const cur = (formData.coverage_types || "").split(", ").filter(Boolean); const next = e.target.checked ? [...cur, e.target.value] : cur.filter((v) => v !== e.target.value); setFormData({ ...formData, coverage_types: next.join(", ") }); }} /><span className="text-sm">Umbrella / excess</span></label>
                          <label className="inline-flex items-center gap-2 mr-4 mb-1"><input type="checkbox" name="coverage_types" value="Pollution liability" onChange={(e) => { const cur = (formData.coverage_types || "").split(", ").filter(Boolean); const next = e.target.checked ? [...cur, e.target.value] : cur.filter((v) => v !== e.target.value); setFormData({ ...formData, coverage_types: next.join(", ") }); }} /><span className="text-sm">Pollution liability</span></label>
                          <label className="inline-flex items-center gap-2 mr-4 mb-1"><input type="checkbox" name="coverage_types" value="Professional liability" onChange={(e) => { const cur = (formData.coverage_types || "").split(", ").filter(Boolean); const next = e.target.checked ? [...cur, e.target.value] : cur.filter((v) => v !== e.target.value); setFormData({ ...formData, coverage_types: next.join(", ") }); }} /><span className="text-sm">Professional liability</span></label>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Year business started</label>
                        <input type="number" name="year_business_started" value={formData.year_business_started} onChange={(e) => setFormData({ ...formData, year_business_started: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Description of business</label>
                        <textarea name="business_description" rows={3} value={formData.business_description} onChange={(e) => setFormData({ ...formData, business_description: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Class code 1 (+ % of operations)</label>
                        <input type="text" name="class_code_1" value={formData.class_code_1} onChange={(e) => setFormData({ ...formData, class_code_1: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Class code 2 (+ % of operations)</label>
                        <input type="text" name="class_code_2" value={formData.class_code_2} onChange={(e) => setFormData({ ...formData, class_code_2: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Class code 3 (+ % of operations)</label>
                        <input type="text" name="class_code_3" value={formData.class_code_3} onChange={(e) => setFormData({ ...formData, class_code_3: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Class code 4 (+ % of operations)</label>
                        <input type="text" name="class_code_4" value={formData.class_code_4} onChange={(e) => setFormData({ ...formData, class_code_4: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Class code 5 (+ % of operations)</label>
                        <input type="text" name="class_code_5" value={formData.class_code_5} onChange={(e) => setFormData({ ...formData, class_code_5: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Residential vs commercial split</label>
                        <input type="text" name="residential_vs_commercial" value={formData.residential_vs_commercial} onChange={(e) => setFormData({ ...formData, residential_vs_commercial: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>New construction vs existing / remodel</label>
                        <input type="text" name="new_vs_existing_construction" value={formData.new_vs_existing_construction} onChange={(e) => setFormData({ ...formData, new_vs_existing_construction: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>5 largest projects ever (description + dollar amount)</label>
                        <textarea name="largest_projects" rows={3} value={formData.largest_projects} onChange={(e) => setFormData({ ...formData, largest_projects: e.target.value })} placeholder="Description and dollar amount for each" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Prior insurance carrier name</label>
                        <input type="text" name="prior_carrier_name" value={formData.prior_carrier_name} onChange={(e) => setFormData({ ...formData, prior_carrier_name: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Prior policy number</label>
                        <input type="text" name="prior_policy_number" value={formData.prior_policy_number} onChange={(e) => setFormData({ ...formData, prior_policy_number: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Prior policy expiration date</label>
                        <input type="date" name="prior_policy_expiration" value={formData.prior_policy_expiration} onChange={(e) => setFormData({ ...formData, prior_policy_expiration: e.target.value })} className={inputClass} />
                      </div>


                      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

                      <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-clay-gradient text-white font-heading font-bold rounded-full shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                        {submitting ? "Sending…" : "Request my free quote"}{!submitting && <ArrowRight className="h-5 w-5" />}
                      </button>
                      <p className="text-xs text-center text-mocha/70">No spam. No commitment. We'll only contact you about your quote.</p>
</form>
                  </FadeIn>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
