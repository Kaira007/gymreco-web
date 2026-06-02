import type { GeneratedProgram, GeneratorInput, DayPlan } from '../types';
import { makeT, makeName, calcWeight, exWeightDefault, mainLift, slot } from '../helpers';

export function generateGVT(input: GeneratorInput): GeneratedProgram {
  const { targetWeights: tw, equipment, locale, accessoryChoices: ac } = input;
  const t = makeT(locale);
  const n = makeName(locale);

  const hasDumbbell = equipment.includes('dumbbell');
  const hasMachine  = equipment.includes('machine');
  const hasCable    = equipment.includes('cable');

  const benchJa = mainLift(equipment, { barbell: 'ベンチプレス', dumbbell: 'ダンベルプレス', machine: 'チェストプレス' });
  const squatJa = mainLift(equipment, { barbell: 'スクワット', dumbbell: 'ダンベルスクワット', machine: 'レッグプレス' });
  const pressJa = mainLift(equipment, { barbell: 'ショルダープレス', dumbbell: 'ダンベルショルダープレス' });
  const rdlJa   = mainLift(equipment, { barbell: 'ルーマニアンデッドリフト', dumbbell: 'ダンベルRDL', machine: 'レッグカール' });
  const rowJa   = hasDumbbell ? 'ダンベルロウ' : hasCable ? 'ケーブルロウ' : 'バーベルロウ';
  const curlJa  = hasDumbbell ? 'ダンベルカール' : hasCable ? 'ケーブルカール' : 'バーベルカール';
  const pushdownJa = hasCable ? 'ケーブルプッシュダウン' : 'トライセプスエクステンション';
  const pullAcc = hasMachine ? 'ラットプルダウン' : hasDumbbell ? 'ダンベルロウ' : 'チンニング';
  const calfJa  = hasDumbbell ? 'ダンベルカーフレイズ' : 'スタンディングカーフレイズ';

  const days: DayPlan[] = [];

  for (let week = 1; week <= 6; week++) {
    const isPhase2 = week >= 5;
    const w = `Week ${week} - `;
    const mainReps = isPhase2 ? '6' : '10';
    const mainPct  = isPhase2 ? 0.75 : 0.60;
    const phaseNote = isPhase2
      ? t('フェーズ2: 1RMの75%。インターバル60秒', 'Phase 2: 75% 1RM. 60 sec rest')
      : t('1RMの60%。インターバル60秒。10セット同じ重量', '60% 1RM. 60 sec rest. Same weight all 10 sets');
    const accNote = isPhase2
      ? t('フェーズ2補助: やや重め', 'Phase 2 accessory: slightly heavier')
      : t('軽めの重量。回復促進', 'Light weight. Promote recovery');
    const accPct = isPhase2 ? 0.65 : 0.50;

    days.push(
      {
        dayName: `${w}Day 1`,
        focus: t(`胸・背中（10×${mainReps}）`, `Chest & Back (10×${mainReps})`),
        exercises: [
          { exerciseName: n(benchJa), recommendedSets: 10, recommendedReps: mainReps, notes: phaseNote, recommendedWeight: calcWeight(tw, benchJa, mainPct) },
          { exerciseName: n(rowJa), recommendedSets: 10, recommendedReps: mainReps, notes: t('スーパーセットで実施可能', 'Can superset with bench'), recommendedWeight: exWeightDefault(tw, rowJa) },
          ...(hasCable ? [{ exerciseName: n('ケーブルフライ'), recommendedSets: 3, recommendedReps: '10-12', notes: t('補助種目', 'Accessory'), recommendedWeight: exWeightDefault(tw, 'ケーブルフライ') }] : []),
        ],
      },
      {
        dayName: `${w}Day 2`,
        focus: t(`脚・腹筋（10×${mainReps}）`, `Legs & Abs (10×${mainReps})`),
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 10, recommendedReps: mainReps, notes: phaseNote, recommendedWeight: calcWeight(tw, squatJa, mainPct) },
          { exerciseName: n(rdlJa), recommendedSets: 10, recommendedReps: mainReps, notes: t('ハムストリング', 'Hamstrings'), recommendedWeight: calcWeight(tw, rdlJa, mainPct) },
          { exerciseName: n(slot('core_accessory', 'クランチ', ac)), recommendedSets: 3, recommendedReps: '15-20', notes: t('腹筋仕上げ', 'Core finisher'), recommendedWeight: exWeightDefault(tw, slot('core_accessory', 'クランチ', ac)) },
        ],
      },
      {
        dayName: `${w}Day 3`,
        focus: t(`肩・腕（10×${mainReps}）`, `Shoulders & Arms (10×${mainReps})`),
        exercises: [
          { exerciseName: n(pressJa), recommendedSets: 10, recommendedReps: mainReps, notes: phaseNote, recommendedWeight: calcWeight(tw, pressJa, mainPct) },
          { exerciseName: n(slot('bicep_accessory', curlJa, ac)), recommendedSets: 10, recommendedReps: mainReps, notes: t('スーパーセット: カール+プッシュダウン', 'Superset: curl + pushdown'), recommendedWeight: exWeightDefault(tw, slot('bicep_accessory', curlJa, ac)) },
          { exerciseName: n(slot('tricep_accessory', pushdownJa, ac)), recommendedSets: 10, recommendedReps: mainReps, notes: t('スーパーセットで実施', 'Perform as superset'), recommendedWeight: exWeightDefault(tw, slot('tricep_accessory', pushdownJa, ac)) },
        ],
      },
      {
        dayName: `${w}Day 4`,
        focus: t('胸・背中（補助）', 'Chest & Back (Accessory)'),
        exercises: [
          { exerciseName: n(slot('chest_accessory', hasDumbbell ? 'ダンベルプレス' : benchJa, ac)), recommendedSets: 3, recommendedReps: '10-12', notes: accNote, recommendedWeight: calcWeight(tw, benchJa, accPct) },
          { exerciseName: n(slot('pull_accessory', pullAcc, ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('背中の補助', 'Back accessory'), recommendedWeight: exWeightDefault(tw, slot('pull_accessory', pullAcc, ac)) },
          ...(hasDumbbell ? [{ exerciseName: n(slot('shoulder_accessory', 'サイドレイズ', ac)), recommendedSets: 3, recommendedReps: '12-15', notes: t('肩の補助', 'Shoulder accessory'), recommendedWeight: exWeightDefault(tw, slot('shoulder_accessory', 'サイドレイズ', ac)) }] : []),
          { exerciseName: n(calfJa), recommendedSets: 3, recommendedReps: '15-20', notes: t('カーフ', 'Calves'), recommendedWeight: exWeightDefault(tw, calfJa) },
        ],
      },
    );
  }

  return {
    title: t('German Volume Training 10×10 筋肥大プログラム', 'German Volume Training 10×10 Hypertrophy Program'),
    weeklyPlan: days,
    nutritionAdvice: t(
      '超高ボリュームのため大量のカロリーが必要です。体重×2.2g以上のタンパク質、体重×6-8gの炭水化物を目安にしてください。トレーニング中のカーボドリンクが特に有効です。',
      'Extremely high volume requires massive calories. Target 2.2g+ protein and 6–8g carbs per kg bodyweight. Intra-workout carb drinks are especially effective.',
    ),
    recoveryAdvice: t(
      '10セット×10レップは極めて高い筋損傷を引き起こします。最初の数週間はDOMSが激しいので覚悟してください。インターバルは厳密に60秒を守りましょう。6週間を1サイクルとし、終了後は1週間のディロードを入れてください。',
      '10×10 causes extreme muscle damage. Expect severe DOMS in the first weeks. Strictly keep 60-second rest intervals. Run 6-week cycles followed by a 1-week deload.',
    ),
  };
}
