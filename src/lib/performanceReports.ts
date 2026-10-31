export type ReportAttachment = { id: string; name: string; mimeType: string; size: number };
export type PerformanceReport = {
  id: string; unitId: string; title: string; period: string; summary: string;
  author: string; createdAt: string; attachments: ReportAttachment[];
  status: 'submitted'|'reviewed'|'returned'; note?: string; reviewedBy?: string; reviewedAt?: string;
};
export const attachmentTypes: Record<string, string> = {
  pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', txt: 'text/plain', csv: 'text/csv',
};
export const maxAttachmentBytes = 4 * 1024 * 1024;
