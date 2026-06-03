import { useState } from 'preact/hooks';
import type { GeneratedProgram, DayPlan } from '../lib/programs/types';
import type { Locale } from '../i18n';

type Unit = 'kg' | 'lb';

interface Labels {
  day: string; focus: string; exercise: string;
  sets: string; reps: string; weight: string;
  notes: string; nutrition: string; recovery: string;
  top_weight: string; total_sets: string; week_volume: string;
  days_label: string; bw_label: string;
}

interface Props {
  program: GeneratedProgram;
  noWeightLabel: string;
  labels: Labels;
  locale: Locale;
  unit?: Unit;
}

interface WeekGroup { label: string; days: DayPlan[]; }

const LB_PER_KG = 2.20462;

function toDisplayWeight(kg: number, unit: Unit): number {
  if (unit === 'lb') return Math.round(kg * LB_PER_KG / 5) * 5;
  return kg;
}

function groupByWeek(days: DayPlan[]): WeekGroup[] {
  const pattern = /Week\s*(\d+)/i;
  const map = new Map<string, WeekGroup>();
  for (const day of days) {
    const m = day.dayName.match(pattern);
    const key = m ? `w${m[1]}` : 'all';
    const label = m ? `Week ${m[1]}` : 'Plan';
    if (!map.has(key)) map.set(key, { label, days: [] });
    map.get(key)!.days.push(day);
  }
  return Array.from(map.values());
}

function calcSummary(days: DayPlan[], unit: Unit) {
  let topWeightKg = 0, totalSets = 0, totalVol = 0;
  for (const day of days) {
    for (const ex of day.exercises) {
      totalSets += ex.recommendedSets;
      if (ex.recommendedWeight != null) {
        if (ex.recommendedWeight > topWeightKg) topWeightKg = ex.recommendedWeight;
        const reps = parseInt(ex.recommendedReps) || 0;
        totalVol += ex.recommendedWeight * ex.recommendedSets * reps;
      }
    }
  }
  const topWeight = topWeightKg > 0 ? toDisplayWeight(topWeightKg, unit) : 0;
  return { topWeight, totalSets, totalVol, topWeightKg };
}

export function PlanTable({ program, noWeightLabel, labels, locale, unit = 'kg' }: Props) {
  const groups = groupByWeek(program.weeklyPlan);
  const hasWeeks = groups.length > 1;
  const [activeIdx, setActiveIdx] = useState(0);

  const currentDays = hasWeeks ? groups[activeIdx].days : program.weeklyPlan;
  const { topWeight, totalSets, totalVol, topWeightKg } = calcSummary(currentDays, unit);

  const volDisplay = unit === 'lb'
    ? ((totalVol * LB_PER_KG) / 1000).toFixed(1)
    : (totalVol / 1000).toFixed(1);
  const volUnit = unit === 'lb' ? 'k lb' : 't';

  return (
    <div class="plan-output is-revealing">
      {/* Header */}
      <div class="plan-output__head">
        <div>
          <h2 class="plan-title">{program.title}</h2>
          {topWeightKg > 0 && (
            <div class="meta">
              {labels.top_weight} <b>{topWeight} {unit}</b>
              {' · '}{labels.total_sets} <b>{totalSets}</b>
            </div>
          )}
        </div>
      </div>

      {/* Summary stats */}
      {topWeightKg > 0 && (
        <div class="plan-summary">
          <div class="summary-stat accent">
            <div class="k">{labels.top_weight}</div>
            <div class="v num">{topWeight}<small> {unit}</small></div>
          </div>
          <div class="summary-stat">
            <div class="k">{labels.total_sets}</div>
            <div class="v num">{totalSets}</div>
          </div>
          <div class="summary-stat">
            <div class="k">{labels.week_volume}</div>
            <div class="v num">{volDisplay}<small> {volUnit}</small></div>
          </div>
          <div class="summary-stat">
            <div class="k">{labels.days_label}</div>
            <div class="v num">{currentDays.length}</div>
          </div>
        </div>
      )}

      {/* Week tabs */}
      {hasWeeks && (
        <div class="week-tabs">
          {groups.map((g, i) => (
            <button
              key={g.label}
              type="button"
              class={i === activeIdx ? 'is-active' : ''}
              onClick={() => setActiveIdx(i)}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      {/* Days grid */}
      <div class="days-grid">
        {currentDays.map((day, i) => (
          <DayCard key={i} day={day} index={i} noWeightLabel={noWeightLabel} labels={labels} unit={unit} />
        ))}
      </div>

      {/* Nutrition + Recovery */}
      <div class="advice-grid">
        <div class="advice-card">
          <div class="ico">🍽️</div>
          <h3>{labels.nutrition}</h3>
          <p>{program.nutritionAdvice}</p>
        </div>
        <div class="advice-card">
          <div class="ico">😴</div>
          <h3>{labels.recovery}</h3>
          <p>{program.recoveryAdvice}</p>
        </div>
      </div>
    </div>
  );
}

function DayCard({ day, index, noWeightLabel, labels, unit }: {
  day: DayPlan; index: number;
  noWeightLabel: string; labels: Labels; unit: Unit;
}) {
  const dayNumMatch = day.dayName.match(/Day\s*(\d+)/i);
  const dnum = dayNumMatch ? `D${dayNumMatch[1]}` : `D${index + 1}`;

  const firstEx = day.exercises[0];
  const pctMatch = firstEx?.notes?.match(/(\d{2,3})%/);
  const intensityLabel = pctMatch ? `${pctMatch[1]}%` : null;

  let vol = 0;
  for (const ex of day.exercises) {
    if (ex.recommendedWeight) {
      vol += ex.recommendedWeight * ex.recommendedSets * (parseInt(ex.recommendedReps) || 0);
    }
  }
  const volDisplay = unit === 'lb'
    ? ((vol * LB_PER_KG) / 1000).toFixed(1)
    : (vol / 1000).toFixed(1);
  const volUnit = unit === 'lb' ? 'k lb' : 't';

  return (
    <div class={`day-card${day.isMaxDay ? ' day-card--max' : ''}`}>
      <div class="day-card__head">
        <div class="d">
          <span class="dnum">{dnum}</span>
          <div>
            <h3>{day.dayName.replace(/Week\s*\d+\s*-?\s*/i, '').trim() || day.dayName}</h3>
            <span class="focus">
              {day.isMaxDay ? <span class="maxtag">▲ MAX</span> : day.focus}
            </span>
          </div>
        </div>
        {intensityLabel && <span class="intensity">{intensityLabel}</span>}
      </div>

      <table class="ex-table">
        <thead>
          <tr>
            <th>{labels.exercise}</th>
            <th>{labels.sets}</th>
            <th>{labels.reps}</th>
            <th>{labels.weight}</th>
          </tr>
        </thead>
        <tbody>
          {day.exercises.map((ex, j) => (
            <tr key={j}>
              <td>{ex.exerciseName}</td>
              <td class="sets">{ex.recommendedSets}</td>
              <td class="reps">{ex.recommendedReps}</td>
              <td class="weight">
                {ex.recommendedWeight == null
                  ? <span class="no-weight">{noWeightLabel}</span>
                  : ex.recommendedWeight === 0
                  ? <span class="bw">{labels.bw_label}</span>
                  : <>{toDisplayWeight(ex.recommendedWeight, unit)}<span class="u"> {unit}</span></>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {vol > 0 && (
        <div class="day-card__foot">
          <span class="vol">{firstEx?.notes ? <span style="font-size:11px;color:var(--text-dim);">{firstEx.notes.slice(0, 40)}{firstEx.notes.length > 40 ? '…' : ''}</span> : ''}</span>
          <span class="num" style="color:var(--text-dim);">{volDisplay} {volUnit}</span>
        </div>
      )}
    </div>
  );
}
