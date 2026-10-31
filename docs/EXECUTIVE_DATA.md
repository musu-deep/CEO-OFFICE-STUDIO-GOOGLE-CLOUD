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

## Scoped workspaces and retiring temporary data

The application no longer loads `mockData`, the simulated executive feed, or the old local user list as an operational source. The mock exports are empty; the standalone simulated feed modules are removed. Legacy simulation endpoints return 410 to the office and are inaccessible to ordinary accounts. The generic AI and voice endpoints that manufactured fallback reports are retired. The entity agent is the supported AI path and uses approved records from that entity; an unavailable provider returns an error. Previously submitted real records and attachments are preserved. No untagged server record is guessed to be a demo and deleted.

The server-backed session determines the role. The sidebar, home screen and entity chooser use only `/api/workspace` scopes returned for that account, including for existing bootstrap managers. CEO/admin accounts retain the group dashboard and five executive destinations. Manager interfaces contain their authorized entities, their own explicitly assigned tasks, and their own reports. Entity records and attachments are still authorized on every request; hiding a menu is not the access boundary. Ordinary accounts see only objectives linked to their readable entity revisions, and only directives explicitly assigned to their email.

### Domain models

`src/lib/workspaceProfiles.ts` maps organizational IDs and functional scopes to 18 domain profiles. Functional departments override the parent company's profile. Forms start blank and missing numbers remain missing. Entries are stored under `businessRecords[unitId]`, versioned to prevent stale updates, and validated against the server's domain schema. They are operational submissions; they do not become approved dashboard metrics automatically.

| Domain | Fields and workflow | Layout |
| --- | --- | --- |
| Finance | Period, currency, budget, expenditure, receivables, payables, cash, source | Financial ledger and variance |
| Procurement | Requisition/contract, supplier, value, delivery, stage | Request → offers → contract → receipt |
| Human resources | Job group, planned/actual staffing, hires, exits, training | Staffing coverage table |
| Legal | Matter, counterparty, next action date, priority, case status | Legal register |
| Governance, quality and audit | Control, evidence, finding, corrective owner/due date | Control and corrective action register |
| Logistics | Tracking, origin, destination, quantity, delivery | Shipment pipeline |
| Industry | Line, target/actual output, rejections, downtime | Production panels |
| Sales | Order, customer, currency, order value, collection | Order and collection ledger |
| Projects | Project, milestone, due date, actual progress, cost, blocker | Milestone portfolio |
| Marketing | Channel, spend, leads, conversions, source | Campaign portfolio |
| Technology | Service, ticket, severity, availability, due date | Service/incident register |
| Education | Program, date, participants, completion, satisfaction | Program portfolio |
| Development | Initiative, partners, beneficiaries, resources, outcomes | Initiative portfolio |
| Investment | Asset, capital, valuation/reference, stage, risk | Investment portfolio |
| Pricing | Item, unit, total cost, proposed price, validity | Pricing ledger |
| Documents and secretariat | Reference, document type, responsible party, dates | Correspondence register |
| Corporate | Period, revenue, cost, cash, plan progress, headcount, decisions | Company portfolio |
| Administrative services | Request, service, owner, due date, result | Service register |

### Assignment-only accounts

During manager approval the office can choose **حساب للمهام المسندة فقط**. This activates the account with no entity-wide grant. The office assigns tasks through **التكليفات والمتابعة**, selecting the actual active recipient account and entity. Existing free-text directive owners are not guessed to match an account. Only an exact `assigneeEmail` assignment gives task access. A task-only account sees its assigned tasks and can update their execution status and submit a report referencing that task. It cannot read entity metrics, operational records, documents, objectives or other users' tasks. The related report and attachments are private to their author and the CEO/admin inbox. Company scope still explicitly includes organizational descendants when granted.

Additional validation: `node --test tests/scopedWorkspaceApi.test.mjs` after the build, and `tests/workspaceProfiles.test.ts` in the TypeScript test suite. These cover domain validation, cross-unit denial, task-only access, unrelated task/report denial, conflict checks, objective filtering, retired simulation APIs and persistence after restart.
