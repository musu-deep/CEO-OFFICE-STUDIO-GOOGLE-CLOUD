export type AraakAgentStatus = 'active' | 'review' | 'paused' | 'error';
export type AraakApprovalLevel = 'green' | 'yellow' | 'red';
export type AraakApprovalStatus = 'pending' | 'approved' | 'rejected' | 'returned';

export interface AraakAgentSummary {
  id: string;
  name: string;
  role: string;
  status: AraakAgentStatus;
  queueSize: number;
  accuracyScore: number;
  lastRunAt?: string;
}

export interface AraakCommandCenterDashboard {
  activeAgents: number;
  queuedJobs: number;
  reviewAccuracy: number;
  publishedContentThisMonth: number;
  activeAcademyPrograms: number;
  pendingApprovals: number;
  mode: string;
  autoPublish: boolean;
  agents: AraakAgentSummary[];
}

export interface AraakContentBrief {
  title: string;
  objective: string;
  audience: string;
  channels: string[];
  formats: string[];
  sourceReferences?: string[];
  dueAt?: string;
}

export interface AraakContentItem extends AraakContentBrief {
  id: string;
  status: 'brief' | 'production' | 'review' | 'approval' | 'scheduled' | 'published';
  approvalLevel: AraakApprovalLevel;
  createdAt: string;
}

export interface AraakApprovalItem {
  id: string;
  title: string;
  entity: string;
  reason: string;
  level: AraakApprovalLevel;
  status: AraakApprovalStatus;
  dueAt: string;
  decidedAt?: string;
  note?: string;
}

export interface AraakApprovalDecision {
  approvalId: string;
  status: Exclude<AraakApprovalStatus, 'pending'>;
  note?: string;
}

export interface AraakAcademyProgram {
  id: string;
  name: string;
  registrations: number;
  target: number;
  status: string;
  qualityScore: number;
  nextMilestone: string;
}

export interface AraakAuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}

export interface AraakAgentRunResult {
  runId: string;
  status: string;
  output: string;
  provider: string;
  simulated: boolean;
  completedAt: string;
}

export interface AraakApiErrorPayload {
  error?: string;
  message?: string;
  details?: string;
}

const API_BASE = '/api/nama';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let details = 'تعذر تنفيذ الطلب في مركز القيادة الذكية.';

    try {
      const payload = (await response.json()) as AraakApiErrorPayload;
      details = payload.message || payload.error || payload.details || details;
    } catch {
      // Keep the safe Arabic fallback when the server does not return JSON.
    }

    throw new Error(details);
  }

  return response.json() as Promise<T>;
}

export const araakAiClient = {
  health: () => request<{ status: string; service: string; mode: string; autoPublish: boolean; timestamp: string }>('/health'),

  getDashboard: () => request<AraakCommandCenterDashboard>('/dashboard'),

  getAgents: () => request<AraakAgentSummary[]>('/agents'),

  runAgent: (agentId: string, instruction: string) =>
    request<AraakAgentRunResult>(`/agents/${encodeURIComponent(agentId)}/run`, {
      method: 'POST',
      body: JSON.stringify({ instruction }),
    }),

  updateAgentStatus: (agentId: string, status: AraakAgentStatus) =>
    request<AraakAgentSummary>(`/agents/${encodeURIComponent(agentId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getContent: () => request<AraakContentItem[]>('/content'),

  createContentBrief: (brief: AraakContentBrief) =>
    request<{ contentId: string; status: string; item: AraakContentItem }>('/content/brief', {
      method: 'POST',
      body: JSON.stringify(brief),
    }),

  getApprovals: () => request<AraakApprovalItem[]>('/approvals'),

  decideApproval: (decision: AraakApprovalDecision) =>
    request<{ success: boolean; approval: AraakApprovalItem }>(`/approvals/${encodeURIComponent(decision.approvalId)}/decision`, {
      method: 'POST',
      body: JSON.stringify({ status: decision.status, note: decision.note }),
    }),

  getAcademyPrograms: () => request<AraakAcademyProgram[]>('/academy/programs'),

  createAcademyProgram: (name: string, target: number) =>
    request<AraakAcademyProgram>('/academy/programs', {
      method: 'POST',
      body: JSON.stringify({ name, target }),
    }),

  getAuditLog: (limit = 50) => request<AraakAuditEntry[]>(`/audit?limit=${encodeURIComponent(limit)}`),
};
