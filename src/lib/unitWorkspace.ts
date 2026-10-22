export type Metric = { label: string; value: number; unit: string; target?: number; direction: 'up' | 'down'; source: string; period: string; series: { label: string; value: number }[] };
export type UnitSnapshot = { summary: string; metrics: Metric[]; risks: string[]; decisions: string[]; updatedAt: string; source: string };
export function parseSnapshot(input: unknown, source: string): UnitSnapshot {
  const x = input as any;
  if (!x || typeof x.summary !== 'string' || !Array.isArray(x.metrics)) throw new Error('تعذر قراءة المؤشرات؛ أعد المحاولة بمستند أوضح.');
  const text = (v: unknown) => typeof v === 'string' ? v.slice(0, 2000) : '';
  const list = (v: unknown) => Array.isArray(v) ? v.filter(a => typeof a === 'string').slice(0, 10).map(text) : [];
  return { summary: text(x.summary), source, updatedAt: new Date().toISOString(), risks: list(x.risks), decisions: list(x.decisions), metrics: x.metrics.slice(0, 8).filter((m: any) => m && typeof m.value === 'number' && Number.isFinite(m.value) && typeof m.label === 'string').map((m: any) => ({ label: text(m.label), value: m.value, unit: text(m.unit), target: typeof m.target === 'number' && Number.isFinite(m.target) ? m.target : undefined, direction: m.direction === 'down' ? 'down' : 'up', source: text(m.source) || source, period: text(m.period), series: Array.isArray(m.series) ? m.series.filter((p: any) => p && typeof p.value === 'number' && Number.isFinite(p.value) && typeof p.label === 'string').slice(0, 24).map((p: any) => ({ label: text(p.label), value: p.value })) : [] })) };
}
export function achievement(m: Metric): number | undefined {
  if (m.target === undefined || m.target <= 0 || m.value < 0) return undefined;
  if (m.direction === 'down') return m.value === 0 ? 100 : m.target / m.value * 100;
  return m.value / m.target * 100;
}
