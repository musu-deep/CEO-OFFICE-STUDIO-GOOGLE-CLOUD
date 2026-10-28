# Executive data workspace

The dashboard has Group, Entities, and Comparison views. Only approved revisions enter group indicators and comparisons. Missing numbers remain absent. Comparison requires one metric per selected axis and entity with matching measurement definition, unit, period and improvement direction. It does not average companies or sum overlapping parent/child results.

Each company has functional reporting scopes (`company-id::finance`, etc.). These are reporting scopes, not assertions that every company has those departments staffed. The existing organizational matrix is preserved.

## Server records and persistence

Records, revisions, objectives, grants and audit entries are written atomically to `EXECUTIVE_DATA_DIR/state.json`. Uploaded documents are stored in `EXECUTIVE_DATA_DIR/documents/` with generated IDs. The default directory is `data/executive` and is shared across authenticated clients of this server instance. It is NOT durable across Render redeployments without a persistent disk.

For production, mount a Render persistent disk at `/var/data` and set `EXECUTIVE_DATA_DIR=/var/data/executive`. Keep a single server instance for this file-backed implementation; use a transactional database before scaling to multiple instances. The dashboard explicitly reports when the persistent path is unconfigured. Records can be exported through the administrator backup link; that JSON export includes metadata, not document bytes. Back up the whole data directory to include attachments.

Odoo is not connected by this change. Inputs are authenticated manual submissions, document uploads, and Gemini extraction (if GEMINI_API_KEY is configured). No fake AI answer is used when the provider is unavailable. The existing live demo remains an explicit separate mode and never enters approved comparisons.

## Accounts and authorization

Accounts and passwords continue to come from ARAAK_AUTH_USERS. Roles `ceo` and `admin` have access to all executive records. Other roles have no executive record permissions until an administrator grants units and actions via “إعداد الخطة والصلاحيات”. Grants refer to an existing login email and do not create an account. Company scope includes its organizational descendants and functional reporting scopes. Every data, document and AI route checks the authenticated account on the server; front-end role changes do not grant access.

Actions: read, upload, edit, review, approve, direct. Upload-only partners can submit documents and drafts without reading existing records. Review is required before approval. Saving a new draft requires the latest record version to prevent lost updates. Earlier approved records remain in revision history. Documents are downloaded through a scoped authenticated route. Local snapshots from older releases can only be imported explicitly as a draft, never silently approved.

## Verification

`npm run check`
`node --import tsx --test tests/*.test.ts`
`node --test tests/executiveApi.test.mjs` (after production build)
