# Executive data workspace

The dashboard has Group, Entities, and Comparison views. Only approved revisions enter group indicators and comparisons. Missing numbers remain absent. Comparison requires one metric per selected axis and entity with matching measurement definition, unit, period and improvement direction. It does not average companies or sum overlapping parent/child results.

Each company has functional reporting scopes (`company-id::finance`, etc.). These are reporting scopes, not assertions that every company has those departments staffed. The existing organizational matrix is preserved.

## Server records and persistence

Records, revisions, objectives, grants and audit entries are written atomically to `EXECUTIVE_DATA_DIR/state.json`. Uploaded documents are stored in `EXECUTIVE_DATA_DIR/documents/` with generated IDs. The default directory is `data/executive` and is shared across authenticated clients of this server instance. It is NOT durable across Render redeployments without a persistent disk.

For production, mount a Render persistent disk at `/var/data` and set `EXECUTIVE_DATA_DIR=/var/data/executive`. Keep a single server instance for this file-backed implementation; use a transactional database before scaling to multiple instances. The dashboard explicitly reports when the persistent path is unconfigured. Records can be exported through the administrator backup link; that JSON export includes metadata, not document bytes. Back up the whole data directory to include attachments.

Odoo is not connected by this change. Inputs are authenticated manual submissions, document uploads, and Gemini extraction (if GEMINI_API_KEY is configured). No fake AI answer is used when the provider is unavailable. The existing live demo remains an explicit separate mode and never enters approved comparisons.

## Accounts and authorization

Existing bootstrap accounts continue to come from ARAAK_AUTH_USERS. New department and institution managers can submit registration requests; see the manager workflow below. Roles `ceo` and `admin` have access to all executive records. Other roles have no executive record permissions until an administrator grants units and actions via “إعداد الخطة والصلاحيات”. Grants refer to an existing login email and do not create an account. Company scope includes its organizational descendants and functional reporting scopes. Every data, document and AI route checks the authenticated account on the server; front-end role changes do not grant access.

Actions: read, upload, edit, review, approve, direct. Upload-only partners can submit documents and drafts without reading existing records. Review is required before approval. Saving a new draft requires the latest record version to prevent lost updates. Earlier approved records remain in revision history. Documents are downloaded through a scoped authenticated route. Local snapshots from older releases can only be imported explicitly as a draft, never silently approved.

## Verification

`npm run check`
`node --import tsx --test tests/*.test.ts`
`node --test tests/executiveApi.test.mjs` (after production build)


## Manager registration and performance report inbox

- The login screen includes **تسجيل مدير جديد**. A request records the manager’s name, title, official email and requested organizational entity. The server assigns the `head` role; client-supplied roles or account status are ignored. Passwords are stored only as salted scrypt hashes in `EXECUTIVE_DATA_DIR/manager-accounts.json` (file mode 0600), separate from the executive JSON export.
- The CEO/admin dashboard includes **تسجيل المديرين وصلاحيات الجهات**. Approval chooses one or more actual entities and grants `read`, `upload`, `edit`. Company scopes include their descendants. Pending/rejected/suspended accounts cannot authenticate. Suspension invalidates existing sessions on the next API request. Existing bootstrap accounts cannot be overwritten by registration.
- **تقارير الأداء والمرفقات** opens the real report submission page. The manager submits a title, reporting period, performance summary, and up to five optional attachments (4 MiB each): PDF, DOC/DOCX, XLS/XLSX, PNG/JPEG, TXT, CSV. These are stored as attachments and downloaded; Word/Excel content is not automatically parsed by this workflow.
- Reports are stored in the existing `state.json` alongside the executive audit log. A manager can list/download their own reports only while retaining read access to the report’s entity. The CEO/admin sees the complete inbox and can mark reports reviewed or return them with a required note. Returned reports remain immutable submissions; the manager sends a new corrected report referencing the earlier title. Reviewing a report does not automatically approve its contents as dashboard metrics.
- Attachments are authenticated downloads with server-generated storage IDs, validated extensions, strict base64 and decoded size checks, and forced download responses. They are never served as inline HTML or exposed under public asset URLs.

### Render rollout

Before enabling production registration and uploads, verify the service has a persistent disk and set `EXECUTIVE_DATA_DIR` to a path on that disk, for example `/var/data/executive` when the disk is mounted at `/var/data`. Both new registration requests and new report submissions return an explanatory 503 until a data directory is explicitly configured in production. The environment variable alone does not create a disk. Keep one running service instance.

If the previous directory already contains real records/documents, copy and verify the entire old directory **before** any redeployment or path change; otherwise an ephemeral Render filesystem can lose it. Retain `SESSION_SECRET` and `ARAAK_AUTH_USERS` for existing CEO/admin access. Back up the whole data directory, including `manager-accounts.json` and `documents/`, to restore managers and attachments. Treat that backup as sensitive. The normal `/api/executive/backup` export does not include password hashes or attachment bytes.

Validation: `npx tsc --noEmit`, `npm run build`, `node --import tsx --test tests/*.test.ts`, and `node --test tests/executiveApi.test.mjs tests/managerRegistrationApi.test.mjs`. The manager integration test covers pending approval, server-assigned roles, scope enforcement, private attachments (including two managers in the same entity), review notes, duplicate registration, persistence after restart and suspension of live sessions.
