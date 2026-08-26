# JobNova Indeed workflow

A small backend exercise that discovers a few Indeed jobs, stores an approved application queue, restores an encrypted browser session, and advances each application through a resumable state machine.

This is intentionally not an unattended bot. Account creation, login, SMS/email verification, CAPTCHA, unknown required questions, and the initial decision to submit are human-controlled. Use only your own profile and only jobs you genuinely want to apply for.

## Architecture

- `automation/indeed/browser.js` owns short-lived Playwright browsers.
- `session.js` stores Playwright `storageState` in PostgreSQL after AES-256-GCM encryption. No password is stored and the browser can close between runs.
- `login.js` opens a headed browser for account setup, login, or a paused manual step.
- `search.js` discovers a limited number of jobs and records a simple keyword match score. Review these results yourself before creating applications.
- `apply.js` is the resumable worker. It fills only known profile fields, never guesses answers, and persists every status transition.
- Prisma stores `CandidateProfile`, `BrowserSession`, `Job`, and `Application` records. Next.js route handlers expose small profile/job/application APIs.

The application states are `PENDING -> IN_PROGRESS -> SUBMITTED`. A run becomes `MANUAL_ACTION_REQUIRED` for verification, an unknown required field, an unfamiliar page, or review without `--submit`. Unexpected exceptions become `FAILED`; rerunning the same application ID starts another attempt.

## Setup

1. Copy `.env.example` to `.env`. Keep both `DATABASE_URL` and the encryption key secret. Generate the key once and do not rotate it without discarding existing browser sessions:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
   ```

2. Install dependencies and a browser, then apply the database migration and generate Prisma Client:

   ```bash
   npm install
   npx playwright install chromium
   npx prisma migrate dev
   npx prisma generate
   ```

3. Start the API with `npm run dev`.

4. Create your profile with your real information. JSON arrays/objects are accepted for work experience, education, and preferences. `resumePath` must be an absolute path readable by the worker.

   ```bash
   curl -X POST http://localhost:3000/api/profile \
     -H "Content-Type: application/json" \
     -d '{"firstName":"Your","lastName":"Name","email":"you@example.com","phone":"+15555555555","currentTitle":"Backend Engineer","location":"Chicago, IL","resumePath":"C:/private/resume.pdf","workExperience":[],"education":[],"jobPreferences":{"keywords":["backend","java","spring"]}}'
   ```

   Save the returned profile `id`.

5. Create/sign in to your own Indeed account in the visible browser. Complete all verification yourself, then return to the terminal and press Enter. The browser closes and its session is encrypted in PostgreSQL.

   ```bash
   npm run indeed:session -- --profile PROFILE_ID
   ```

6. Discover only a small set of relevant jobs. Indeed changes its markup periodically, so selectors in `search.js` may need maintenance.

   ```bash
   npm run indeed:discover -- --profile PROFILE_ID --query "backend engineer" --location "remote" --limit 3
   ```

   Review the stored jobs via `GET /api/jobs`. For each one you approve, create a pending application:

   ```bash
   curl -X POST http://localhost:3000/api/applications \
     -H "Content-Type: application/json" \
     -d '{"profileId":"PROFILE_ID","jobId":"JOB_ID"}'
   ```

7. Run once without submission. The worker fills safe known fields and pauses at review as `SUBMISSION_APPROVAL_REQUIRED`:

   ```bash
   npm run indeed:run -- --application APPLICATION_ID
   ```

   After reviewing the job and your answers, explicitly allow the final click:

   ```bash
   npm run indeed:run -- --application APPLICATION_ID --submit
   ```

## Manual verification and resume

When a run sees CAPTCHA, SMS/email verification, a sign-in gate, an unanswered required question, or an unknown step, it saves the current browser state, closes the browser, and records `MANUAL_ACTION_REQUIRED` plus the reason.

Open the exact application in a headed browser, complete the check yourself, and press Enter to save the refreshed session:

```bash
npm run indeed:manual -- --application APPLICATION_ID
npm run indeed:run -- --application APPLICATION_ID --submit
```

Nothing in this project attempts to solve, outsource, suppress, or bypass a platform check. Failed runs retain the error and attempt count for diagnosis. The status API is `GET /api/applications?profileId=PROFILE_ID`; a trusted operator can correct a status with `PATCH /api/applications/APPLICATION_ID`.

## Multiple users

The schema already scopes sessions and applications by `profileId`, so the worker never shares storage state between profiles. A production extension should add application authentication, make each profile belong to an authenticated user/tenant, authorize every API query, use a managed KMS with per-user envelope-encryption keys, move browser work to an isolated queue worker, enforce per-user concurrency/rate limits, and keep an audit log. Never expose decrypted cookies to the browser-facing Next.js client.

## Verification

```bash
npm test
npm run lint
npm run build
```

Browser automation against Indeed is change-sensitive and may also be restricted by platform terms. Confirm the current rules for your intended use and keep the job count low.
