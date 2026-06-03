import { useState } from 'preact/hooks';
import type { Equipment, GeneratorInput } from '../lib/programs/types';
import type { Locale } from '../i18n';
import { getProgram } from '../lib/programs/index';
import { PlanTable } from './PlanTable';

type Unit = 'kg' | 'lb';

type Messages = {
  input_1rm: string;
  input_bench: string; input_squat: string; input_dead: string; input_press: string;
  input_equipment: string;
  equip_barbell: string; equip_dumbbell: string; equip_machine: string;
  equip_cable: string; equip_chinning: string;
  input_target: string; target_bench: string; target_squat: string; target_both: string;
  generate_btn: string;
  result_day: string; result_focus: string; result_exercise: string;
  result_sets: string; result_reps: string; result_weight: string; result_notes: string;
  no_weight: string; nutrition: string; recovery: string;
  unit_label: string; hint_1rm: string; no_signup: string;
  stat_top_weight: string; stat_total_sets: string; stat_week_volume: string;
  stat_days: string; bw_label: string; equip_warning: string;
};

interface Props {
  slug: string;
  locale: Locale;
  isSmolov?: boolean;
  messages: Messages;
}

const PLAY_STORE_JA = 'https://play.google.com/store/apps/details?id=com.gymreco.ai&hl=ja';
const PLAY_STORE_EN = 'https://play.google.com/store/apps/details?id=com.gymreco.ai&hl=en';
const APP_STORE_JA  = 'https://apps.apple.com/jp/app/%E3%82%B8%E3%83%A0%E3%83%AC%E3%82%B3ai-%E7%AD%8B%E3%83%88%E3%83%AC%E8%A8%98%E9%8C%B2-%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%A0%E4%BD%9C%E6%88%90/id6764790714';
const APP_STORE_EN  = 'https://apps.apple.com/us/app/gymreco-ai/id6764790714';


const LB_PER_KG = 2.20462;

function lbToKg(lb: number): number {
  return lb / LB_PER_KG;
}

export function ProgramGenerator({ slug, locale, isSmolov = false, messages: m }: Props) {
  const equipmentOptions: { key: Equipment; label: string }[] = [
    { key: 'barbell',  label: m.equip_barbell  },
    { key: 'dumbbell', label: m.equip_dumbbell },
    { key: 'machine',  label: m.equip_machine  },
    { key: 'cable',    label: m.equip_cable    },
    { key: 'chinning', label: m.equip_chinning },
  ];

  // Unit selection
  const [unit, setUnit] = useState<Unit>('kg');

  // Smolov Jr: single 1RM with lift selector
  const [smolovTarget, setSmolovTarget] = useState<'bench' | 'squat'>('bench');
  const [smolovRM, setSmolovRM]     = useState('100');

  // Other programs: multi-field 1RM
  const [bench, setBench] = useState('');
  const [squat, setSquat] = useState('');
  const [dead,  setDead]  = useState('');
  const [press, setPress] = useState('');

  const [equipment, setEquipment] = useState<Equipment[]>(['barbell', 'dumbbell']);
  const [result, setResult] = useState<ReturnType<typeof getProgram>>(null);

  function toggleEquipment(key: Equipment) {
    setEquipment(prev => prev.includes(key) ? prev.filter(e => e !== key) : [...prev, key]);
  }

  function stepRM(delta: number) {
    setSmolovRM(prev => String(Math.max(20, (parseFloat(prev) || 100) + delta)));
  }

  function parseWeight(val: string): number | undefined {
    const v = parseFloat(val);
    if (isNaN(v) || v <= 0) return undefined;
    return unit === 'lb' ? lbToKg(v) : v;
  }

  function generate() {
    let tw: GeneratorInput['targetWeights'];
    const target: 'bench' | 'squat' = smolovTarget;

    if (isSmolov) {
      const v = parseWeight(smolovRM);
      tw = {
        bench: smolovTarget === 'bench' ? v : undefined,
        squat: smolovTarget === 'squat' ? v : undefined,
      };
    } else {
      tw = {
        bench: parseWeight(bench),
        squat: parseWeight(squat),
        dead:  parseWeight(dead),
        press: parseWeight(press),
      };
    }

    setResult(getProgram(slug, { targetWeights: tw, equipment: equipment.length ? equipment : ['barbell', 'dumbbell'], locale, smolovTarget: target }));
  }

  // Which 1RM fields to show for non-Smolov programs
  const allFields = [
    { key: 'bench' as const, label: m.input_bench, val: bench, set: setBench },
    { key: 'squat' as const, label: m.input_squat, val: squat, set: setSquat },
    { key: 'dead'  as const, label: m.input_dead,  val: dead,  set: setDead  },
    { key: 'press' as const, label: m.input_press, val: press, set: setPress },
  ];

  const unitLabel = unit === 'lb' ? 'lb' : 'kg';
  const smolovStep = unit === 'lb' ? 5 : 2.5;
  const hideEquipment = ['smolov-jr', 'starting-strength', 'stronglifts-5x5', 'texas-method'].includes(slug);
  const hasAnchorEquip = hideEquipment || equipment.includes('barbell') || equipment.includes('dumbbell');

  return (
    <div>
      {/* === GENERATOR FORM === */}
      <section class="generator-wrap" id="generator">
        <div class="generator-form">
          {/* Unit toggle */}
          <div class="unit-toggle" style="display:flex;align-items:center;gap:6px;margin-bottom:14px;">
            <span style="font-size:13px;color:var(--text-dim);">{m.unit_label}:</span>
            <div class="seg" role="group">
              <button
                type="button"
                onClick={() => setUnit('kg')}
                style={unit === 'kg' ? 'background:var(--primary);color:#062229;font-weight:700;' : ''}
              >kg</button>
              <button
                type="button"
                onClick={() => setUnit('lb')}
                style={unit === 'lb' ? 'background:var(--primary);color:#062229;font-weight:700;' : ''}
              >lb</button>
            </div>
          </div>

          {isSmolov ? (
            /* Smolov Jr: lift selector + single big 1RM */
            <div class={`field-row${hideEquipment ? ' field-row--single' : ''}`}>
              <div class="field">
                <label class="field-label">
                  {smolovTarget === 'squat' ? m.input_squat : m.input_bench}
                  <span class="hint">— {m.hint_1rm}</span>
                </label>
                <div class="seg" role="group" style="margin-bottom:10px;">
                  {(['bench', 'squat'] as const).map(lift => (
                    <button
                      key={lift}
                      type="button"
                      onClick={() => setSmolovTarget(lift)}
                      style={smolovTarget === lift ? 'background:var(--primary);color:#062229;font-weight:700;' : ''}
                    >
                      {lift === 'bench' ? m.target_bench : m.target_squat}
                    </button>
                  ))}
                </div>
                <div class="input-unit">
                  <input
                    type="number" inputmode="decimal"
                    value={smolovRM} min="20" max="1000" step={smolovStep}
                    onInput={e => setSmolovRM((e.target as HTMLInputElement).value)}
                    onKeyDown={e => e.key === 'Enter' && generate()}
                    aria-label={`1RM (${unitLabel})`}
                  />
                  <div class="stepper">
                    <button type="button" onClick={() => stepRM(smolovStep)} aria-label="increase">▲</button>
                    <button type="button" onClick={() => stepRM(-smolovStep)} aria-label="decrease">▼</button>
                  </div>
                  <span class="unit">{unitLabel}</span>
                </div>
              </div>

              {!hideEquipment && (
                <div class="field">
                  <span class="field-label">{m.input_equipment}</span>
                  <div class="equip-checkboxes">
                    {equipmentOptions.slice(0, 3).map(({ key, label }) => (
                      <button key={key} type="button" class={`equip-label${equipment.includes(key) ? ' is-active' : ''}`} onClick={() => toggleEquipment(key)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Other programs: multi 1RM grid */
            <div>
              <div class="field-label-row">{m.input_1rm}</div>
              <div class="weights-grid">
                {allFields.map(({ label, val, set }) => (
                  <div key={label} class="field">
                    <span class="field-label">{label}</span>
                    <div class="input-row">
                      <input
                        type="number" min="0" step={unit === 'lb' ? 5 : 2.5} placeholder="—"
                        value={val}
                        onInput={e => set((e.target as HTMLInputElement).value)}
                        class="weight-input"
                      />
                      <span class="unit-label">{unitLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
              {!hideEquipment && (
                <div class="field" style="margin-top:8px;">
                  <span class="field-label">{m.input_equipment}</span>
                  <div class="equip-checkboxes">
                    {equipmentOptions.map(({ key, label }) => (
                      <button key={key} type="button" class={`equip-label${equipment.includes(key) ? ' is-active' : ''}`} onClick={() => toggleEquipment(key)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div class="gen-submit">
            <button
              class="btn btn--primary btn--lg generate-btn"
              type="button"
              onClick={generate}
              disabled={!hasAnchorEquip}
              style={!hasAnchorEquip ? 'opacity:0.4;cursor:not-allowed;' : ''}
            >
              {m.generate_btn} <span class="arrow">→</span>
            </button>
            <span class="note" style={!hasAnchorEquip ? 'color:var(--warning,#f5a623);' : ''}>
              {hasAnchorEquip ? m.no_signup : m.equip_warning}
            </span>
          </div>
        </div>
      </section>

      {/* === RESULT + POST-CTA === */}
      {result && (
        <>
          <PlanTable
            program={result}
            noWeightLabel={m.no_weight}
            locale={locale}
            unit={unit}
            labels={{
              day: m.result_day, focus: m.result_focus, exercise: m.result_exercise,
              sets: m.result_sets, reps: m.result_reps, weight: m.result_weight,
              notes: m.result_notes, nutrition: m.nutrition, recovery: m.recovery,
              top_weight: m.stat_top_weight, total_sets: m.stat_total_sets,
              week_volume: m.stat_week_volume, days_label: m.stat_days,
              bw_label: m.bw_label,
            }}
          />
          <PostGenerateCTA locale={locale} />
        </>
      )}
    </div>
  );
}

function PostGenerateCTA({ locale }: { locale: Locale }) {
  const isJa = locale === 'ja';
  return (
    <section class="post-cta is-revealing">
      <div class="post-cta__inner">
        <div class="post-cta__copy">
          <span class="kick">{isJa ? 'プラン生成完了' : 'Plan ready'}</span>
          <h2>{isJa ? '計算も、記録も、アプリひとつで。' : 'Everything in one app.'}</h2>
          <p>{isJa
            ? '重量計算・セット記録・休憩タイマー・進捗グラフ。ジムレコAI なら、トレーニングに必要なものがスマホ一台にまとまっています。'
            : 'Weight calculation, set logging, rest timer, progress graphs. GymRec AI keeps everything you need for training in one app.'
          }</p>
          <div class="store-badges">
            <a href={isJa ? PLAY_STORE_JA : PLAY_STORE_EN} target="_blank" rel="noopener" aria-label="Google Play">
              <img src={import.meta.env.BASE_URL + 'badges/google-play.png'} alt={isJa ? 'Google Play で入手' : 'Get it on Google Play'} style="height:40px;width:auto;" />
            </a>
            <a href={isJa ? APP_STORE_JA : APP_STORE_EN} target="_blank" rel="noopener" aria-label="App Store">
              <img src={import.meta.env.BASE_URL + 'badges/app-store.svg'} alt={isJa ? 'App Store でダウンロード' : 'Download on the App Store'} style="height:40px;width:auto;" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
