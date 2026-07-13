import React from 'react';
import { Button } from '../core/Button.jsx';
import { Icon } from '../core/Icon.jsx';
import { Input } from '../forms/Input.jsx';
import { Select } from '../forms/Select.jsx';
import { Textarea } from '../forms/Textarea.jsx';
import { Radio } from '../forms/Radio.jsx';

/**
 * QuoteForm — a three-step quote request: service → details → contact.
 * Progress dots up top, Back/Next below, and a plain confirmation at the end.
 * Steps keep one idea per view; nothing is required until it must be.
 */
export function QuoteForm({ services = [], title = 'Request a Free Quote', lead, onSubmit, className = '', ...rest }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({ service: '', timing: '', details: '', name: '', phone: '', address: '' });
  const [done, setDone] = React.useState(false);
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target ? e.target.value : e }));
  const steps = ['Service', 'Details', 'Contact'];

  const submit = () => { setDone(true); onSubmit && onSubmit(data); };

  return (
    <div className={`sds-br-quote ${className}`} {...rest}>
      <div className="sds-br-quote__head">
        <h3 className="sds-br-quote__title">{title}</h3>
        {lead && !done && <p className="sds-br-quote__lead">{lead}</p>}
      </div>
      {done ? (
        <div className="sds-br-quote__done">
          <span className="sds-br-quote__done-icon"><Icon name="check-circle" size={24} /></span>
          <p className="sds-br-quote__done-title">Request received</p>
          <p className="sds-br-quote__done-body">We'll call {data.phone || 'you'} within one business day with your estimate.</p>
        </div>
      ) : (
        <React.Fragment>
          <ol className="sds-br-quote__steps">
            {steps.map((s, i) => (
              <li key={s} className={`sds-br-quote__step ${i === step ? 'sds-br-quote__step--on' : ''} ${i < step ? 'sds-br-quote__step--past' : ''}`}>
                <span className="sds-br-quote__stepnum">{i < step ? <Icon name="check" size={12} /> : i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="sds-br-quote__body">
            {step === 0 && (
              <React.Fragment>
                <Select label="What do you need?" required placeholder="Choose a service…" value={data.service} onChange={set('service')}
                  options={services} />
                <div>
                  <div className="sds-label" style={{ marginBottom: 8 }}>How soon?</div>
                  <div className="sds-br-quote__radios">
                    {['As soon as possible', 'Within a month', 'Just planning'].map((t) => (
                      <Radio key={t} name="timing" label={t} checked={data.timing === t} onChange={() => setData((d) => ({ ...d, timing: t }))} />
                    ))}
                  </div>
                </div>
              </React.Fragment>
            )}
            {step === 1 && (
              <Textarea label="Tell us about the job" rows={5} value={data.details} onChange={set('details')}
                placeholder="What's going on, roughly how big is the space, anything we should know before we come out?"
                helpText="A sentence or two is plenty — we confirm everything on the call." />
            )}
            {step === 2 && (
              <React.Fragment>
                <Input label="Name" required value={data.name} onChange={set('name')} />
                <Input label="Phone" type="tel" required value={data.phone} onChange={set('phone')} helpText="We call with the estimate — no spam, ever." />
                <Input label="Street address" value={data.address} onChange={set('address')} />
              </React.Fragment>
            )}
          </div>
          <div className="sds-br-quote__nav">
            {step > 0 ? <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button> : <span />}
            {step < 2
              ? <Button variant="primary" onClick={() => setStep(step + 1)}>Next</Button>
              : <Button variant="primary" onClick={submit}>Send Request</Button>}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

/**
 * StickyCallButton — a fixed bottom call bar for phones. Hidden on wide
 * screens; on mobile it keeps the number one thumb away at all times.
 */
export function StickyCallButton({ phone, label = 'Call Now', className = '', ...rest }) {
  const tel = 'tel:' + String(phone || '').replace(/[^+\d]/g, '');
  return (
    <a className={`sds-br-callbar ${className}`} href={tel} {...rest}>
      <Icon name="phone" size={18} />
      <span>{label}{phone ? ` · ${phone}` : ''}</span>
    </a>
  );
}
