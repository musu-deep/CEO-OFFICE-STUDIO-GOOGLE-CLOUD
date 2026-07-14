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

export interface AraakApprovalDecision {
  approvalId: string;
  status: Exclude<AraakApprovalStatus, 'pending'>;
  note?: string;
}

export interface AraakApiErrorPayload {
  error?: string;
  message?: string;
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
      details = payload.message || payload.error || details;
    } catch {
      // Keep the safe Arabic fallback when the server does not return JSON.
    }

    throw new Error(details);
  }

  return response.json() as Promise<T>;
}

export const araakAiClient = {
  getDashboard: () => request<AraakCommandCenterDashboard>('/dashboard'),

  getAgents: () => request<AraakAgentSummary[]>('/agents'),

  runAgent: (agentId: string, instruction: string) =>
    request<{ runId: string; status: string }>(`/agents/${encodeURIComponent(agentId)}/run`, {
      method: 'POST',
      body: JSON.stringify({ instruction }),
    }),

  updateAgentStatus: (agentId: string, status: AraakAgentStatus) =>
    request<AraakAgentSummary>(`/agents/${encodeURIComponent(agentId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  createContentBrief: (brief: AraakContentBrief) =>
    request<{ contentId: string; status: string }>('/content/brief', {
      method: 'POST',
      body: JSON.stringify(brief),
    }),

  decideApproval: (decision: AraakApprovalDecision) =>
    request<{ success: boolean }>(`/approvals/${encodeURIComponent(decision.approvalId)}/decision`, {
      method: 'POST',
      body: JSON.stringify({ status: decision.status, note: decision.note }),
    }),
};
