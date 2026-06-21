# Sage Mobile — 30 User Workflows (Comprehensive)

Each workflow doubles as a spec entry and a test case. Template:
**Trigger** (how it starts) · **Flow** (detailed steps, incl. routing and consent gates) · **Edge / fallback** (ambiguity, failure, offline) · **Boundary** (on-device vs cloud, consent) · **Capabilities**.

The **Boundary** line is Sage's differentiator — it must be true and visible in the product, not just on paper. A coverage map is at the end.

---

## A. Daily rhythm & personal context

### 1. Morning Brief
**Trigger:** Scheduled 06:30 daily (set once), or "Sage, brief me."
**Flow:**
1. A background agent wakes, gathers today's calendar, important unread mail, monitored topics, and any overnight task results.
2. The privacy-aware router summarises mail/calendar **on-device**; only the non-personal news topic is fetched from the cloud.
3. Sage reads a spoken digest in natural voice while the user gets ready.
4. User interrupts by voice — "skip," "remind me about the 2pm," "draft a reply to the first one" — and Sage acts inline.
**Edge / fallback:** No connectivity → delivers the local portions (calendar, on-device mail) and notes the news section is queued. Empty day → a one-line "nothing urgent" rather than padding.
**Boundary:** Personal summarisation on-device; only a non-personal query leaves the phone.
**Capabilities:** async/scheduled · personal context · privacy-aware routing · voice.

### 2. Find That Thing
**Trigger:** "What was the Wi-Fi password in the rental screenshot?" / "Which restaurant did my brother text me about?"
**Flow:**
1. Sage searches the local encrypted index across photos, messages, mail.
2. Reads the password off the screenshot via on-device OCR, or surfaces the relevant message thread with the restaurant name highlighted.
3. Offers a next action — save to Notes, open in Maps, copy.
**Edge / fallback:** Multiple candidate matches → presents a short ranked list to disambiguate rather than guessing. No match → says so plainly and offers to widen the time window.
**Boundary:** Entirely **on-device**. Nothing is sent to a server to answer this.
**Capabilities:** personal context · visual intelligence (OCR) · cross-app action.

### 3. Read My Screen, Act On It
**Trigger:** While viewing a contract / article / recipe: "What does this commit me to?" / "Turn this into a shopping list."
**Flow:**
1. Sage captures the on-screen content and summarises the parts that matter — obligations, dates, quantities, steps.
2. Proposes structured actions: reminders, a calendar event, a Notes checklist.
3. User approves each write individually.
**Edge / fallback:** Content too long for one screen → offers to scroll-capture with permission. Ambiguous intent → asks one clarifying question before acting.
**Boundary:** Screen content processed **locally**, discarded after the task unless saved. Cross-app writes are consent-gated.
**Capabilities:** screen awareness · cross-app action · consent ledger.

### 4. Photo Memory Book
**Trigger:** "Make an album from the December trip." / "Show me this time last year."
**Flow:**
1. Sage clusters photos on-device by date, place, and recurring faces (local face grouping, not cloud identity).
2. Drafts an album with a suggested cover and caption; user reorders or trims.
3. On approval, saves the album locally; offers to share specific photos via a chosen channel.
**Edge / fallback:** Sparse photos for the period → broadens the window and says it did. Sharing request → each recipient and photo confirmed before send.
**Boundary:** All clustering and face grouping **on-device**; no biometric data leaves the phone.
**Capabilities:** personal context · visual intelligence · messaging reach.

### 5. Learning Companion
**Trigger:** "Explain how X works." / "Quiz me on what we covered yesterday."
**Flow:**
1. Sage recalls the user's level and prior topics from memory and pitches the explanation accordingly.
2. Routes deep/open-ended reasoning to a frontier model (consented, non-personal) and keeps the running thread in local memory.
3. Offers follow-ups — analogy, worked example, a short quiz — and adapts difficulty from answers.
**Edge / fallback:** User struggles repeatedly → drops a level and slows down rather than repeating the same explanation.
**Boundary:** Topic content can be cloud-served (non-personal); the user's progress and level live in **local memory**.
**Capabilities:** multi-model routing · memory · voice.

---

## B. Capture & create

### 6. Meeting Capture & Follow-up
**Trigger:** "Sage, capture this meeting." (in-person or call)
**Flow:**
1. On-device STT transcribes live; Sage segments by speaker where possible.
2. At the end it extracts decisions, action items, and owners, and drafts a follow-up message.
3. User reviews the draft and the action list; approves sending and adding items to a task connector.
**Edge / fallback:** Poor audio → flags low-confidence segments rather than inventing text. Sensitive meeting → user can mark it "local only, never sync."
**Boundary:** Transcription **on-device** by default; transcript and audio stay local unless the user exports. Outbound follow-up confirmed first.
**Capabilities:** on-device STT · memory · connectors · consent.

### 7. Draft From Personal Context
**Trigger:** "Draft my landlord a notice about the broken geyser." / "Reply to the bank about the disputed charge."
**Flow:**
1. Sage pulls the relevant lease clause, prior messages, and dates from the local index.
2. Composes a grounded draft citing the specifics (clause, dates, amounts) without exposing them to the cloud.
3. Presents for edit; sends only on approval through the chosen channel.
**Edge / fallback:** Missing a needed fact → asks for it instead of fabricating. Tone matters → offers a firmer and a softer variant.
**Boundary:** Drafting prefers **on-device** for personal mail; the draft is not sent autonomously.
**Capabilities:** personal context · drafting · privacy-aware routing · consent.

### 8. Creative Content Pipeline (Skill)
**Trigger:** "Turn these voice notes into an episode beat sheet." / saved skill run.
**Flow:**
1. Sage transcribes the voice notes on-device and structures them into the user's preferred format (acts, beats, hooks) remembered from past runs.
2. Routes generative drafting to a frontier model with the (non-personal) creative brief.
3. Returns a draft the user can iterate on; versions kept locally.
**Edge / fallback:** Thin source material → asks targeted questions to fill gaps rather than padding. Style drift → user can pin a reference and re-run.
**Boundary:** Raw voice notes transcribed **locally**; only the abstracted brief is sent for drafting, with consent.
**Capabilities:** custom skills · on-device STT · multi-model · memory.

### 9. Talk / Sermon Prep (Skill)
**Trigger:** "Build me an outline from this passage." / "Prep speaker notes for Sunday."
**Flow:**
1. Sage gathers references and structures an expository outline from the chosen passage, in the user's remembered preaching structure.
2. Background sub-agents pull supporting context; Sage assembles points, illustrations, and a flow.
3. Produces speaker notes the user edits; saved to the local skill library.
**Edge / fallback:** Source ambiguous → confirms the exact passage/translation first. Time-boxed talk → fits the outline to the stated length.
**Boundary:** Reference lookups cloud-side (non-personal); the user's notes and style stay **local**.
**Capabilities:** custom skills · research sub-agents · drafting · memory.

### 10. Difficult Message Strategy
**Trigger:** "Help me reply to this — I need to push back without burning the relationship."
**Flow:**
1. Sage reads the thread (on-screen or from mail) and identifies the competing goals and stakes.
2. Drafts 2–3 strategically distinct versions — e.g. *hold firm*, *concede and redirect*, *buy time* — labelling what each trades off.
3. User picks or blends; Sage finalises and sends on approval.
**Edge / fallback:** High emotional stakes → flags it and slows down, no auto-send. Unclear relationship → asks one question to calibrate tone.
**Boundary:** Thread read **locally**; a frontier model assists drafting only with consent, on de-identified content where possible.
**Capabilities:** drafting · multi-model · screen awareness · consent.

---

## C. Communication & coordination

### 11. Inbox Triage
**Trigger:** "Clear my inbox," or a scheduled monitor.
**Flow:**
1. Sage classifies new mail (reply-needed / FYI / archivable), drafts replies for the first set, proposes calendar moves for time-bound items.
2. Presents a review queue; every send and every archive shown before it happens.
3. User approves in batch or edits individually.
**Edge / fallback:** Low-confidence classification → defaults to "leave for human." Bulk archive → requires explicit confirm, reversible for a grace period.
**Boundary:** Classification/drafting prefer **on-device**; a frontier draft is used only with consent. **No mail sent autonomously.**
**Capabilities:** connectors · in-app actions · privacy-aware routing · consent ledger.

### 12. Cross-Channel Reach
**Trigger:** "Tell my co-founder on WhatsApp the build's done, and remind me on iMessage in an hour."
**Flow:**
1. Sage drafts the WhatsApp message and shows it before sending.
2. On approval, sends via WhatsApp Cloud API and sets the local reminder.
3. For task-triggered reach ("message me when the deploy finishes"), Sage notifies on the chosen channel on completion.
**Edge / fallback:** Channel unavailable → falls back to a local notification and tells the user it couldn't send. Wrong contact risk → confirms the recipient.
**Boundary:** Outbound messages **always confirmed first**; channels run through Hermes.
**Capabilities:** messaging reach · async execution · consent.

### 13. Family Logistics
**Trigger:** "Organise a get-together for Gogo's birthday and collect who's coming."
**Flow:**
1. Sage drafts an invite, proposes a date from shared availability, and lists recipients from the user's contacts.
2. On approval, sends via WhatsApp and tracks replies, tallying RSVPs as they arrive.
3. Sends reminders to non-responders (each batch confirmed) and gives the user a live headcount.
**Edge / fallback:** Conflicting dates → surfaces the clash and proposes alternatives. A contact opts out → stops messaging them and records it.
**Boundary:** Contact list stays **local**; only approved messages go out. RSVP state kept in local memory.
**Capabilities:** messaging reach · sub-agents · memory · consent.

### 14. Multilingual Bridge
**Trigger:** "Translate this as I speak." / "Reply to this isiXhosa message in English, and send my reply in isiXhosa."
**Flow:**
1. Sage transcribes and translates, preferring on-device language models for supported pairs.
2. For a relayed reply, it drafts in the target language, shows a back-translation so the user can verify meaning, then sends on approval.
3. In live mode, it interprets turn-by-turn with natural voice.
**Edge / fallback:** Low-resource language pair → escalates to a cloud model with consent, flagging that text leaves the device. Idiom risk → notes uncertainty rather than guessing.
**Boundary:** On-device translation where supported; cloud escalation is explicit and consented.
**Capabilities:** multi-model · voice · messaging reach · privacy-aware routing.

### 15. Travel Planning & Day-of Orchestration
**Trigger:** "Plan two days in Nairobi around my Thursday meeting." Then, on the day: automatic.
**Flow:**
1. Background sub-agents draft an itinerary (sights, food, transit) around the fixed meeting; user edits.
2. On travel day, a monitor watches flight status and traffic; if a flight slips, Sage reworks downstream timings and notifies the user.
3. Offers to message anyone affected (driver, contact) — each confirmed.
**Edge / fallback:** Disruption with no good option → presents the trade-offs rather than silently picking. Booking/payment → handed to the user, never auto-executed (see #16).
**Boundary:** Itinerary research cloud-side (non-personal); the user's calendar and contacts stay **local**.
**Capabilities:** sub-agents · async monitor · messaging · agent console.

---

## D. Money & sensitive actions

### 16. Sensitive Action via Tokenised Vault
**Trigger:** "Renew my vehicle licence." / "Pay the municipal account."
**Flow:**
1. Sage prepares the action operating on a **token/handle** for the payment method and ID — never the raw values.
2. It shows exactly what will happen: amount in rand, recipient, which stored item it will use.
3. Raw secrets are released only on explicit per-action consent in the trust UX. **Sage hands the confirmed financial step to the user or their authorised provider — it does not enter credentials or execute the transfer itself.**
**Edge / fallback:** Amount or recipient looks anomalous → flags and pauses. Consent declined → nothing is released and the action is logged as cancelled.
**Boundary:** Raw data stays in the **vault**; the agent works on tokens. POPIA-grade: purpose stated, consent and outcome logged.
**Capabilities:** tokenised vault · consent ledger · POPIA/GDPR.

### 17. Form Filling From Vault
**Trigger:** "Fill in this application with my details."
**Flow:**
1. Sage reads the form fields and maps them to vaulted personal data via tokens.
2. Shows a field-by-field preview of what it will enter; the user approves or edits each sensitive field.
3. On approval Sage populates the form but **pauses at submit** — the user presses submit, or explicitly authorises it.
**Edge / fallback:** Field meaning unclear → leaves it blank and flags. Form reached via an untrusted link → Sage refuses to autofill and explains why.
**Boundary:** Sensitive values released per-field with consent; nothing auto-submitted.
**Capabilities:** tokenised vault · forms · screen awareness · consent.

### 18. Expense & Receipt Reconciliation (Skill)
**Trigger:** Saved skill: monthly, or "reconcile this month's expenses."
**Flow:**
1. Throughout the month Sage files snapped receipts (camera) and flagged transactions into a local ledger.
2. At month-end it categorises, totals, flags anomalies and missing receipts, and builds a report.
3. Exports a spreadsheet on request; offers to send to the user's accountant — confirmed.
**Edge / fallback:** Duplicate or unreadable receipt → flags for review instead of guessing. Category ambiguous → asks once and remembers the rule.
**Boundary:** Ledger built **on-device**; export and any send are explicit user actions.
**Capabilities:** custom skills · vision · async · connectors.

### 19. Subscription & Data Audit
**Trigger:** "What am I paying for that I don't use?" / "Who has access to my data?"
**Flow:**
1. Sage scans transactions for recurring charges and cross-references usage; lists dormant subscriptions.
2. Separately, it lists every connector and skill with access, and what each can read or do.
3. Recommends cancellations and permission revocations; executes revocations on approval (cancellations are handed to the user).
**Edge / fallback:** Uncertain whether a charge is a subscription → marks it "review" rather than asserting. Revocation that breaks a skill → warns first.
**Boundary:** Analysis **on-device**; the permission ledger is the same one shown in #30.
**Capabilities:** connectors · privacy ledger · vault · consent.

---

## E. Vision, voice & device

### 20. Point-and-Understand (Camera)
**Trigger:** Raise camera, invoke Sage. "Split this bill three ways." / "What's in this dish?" / "Log this receipt."
**Flow:**
1. Sage reads the bill in rand, computes the per-person split with tip, and offers to message amounts to the table.
2. For a dish, it identifies items and rough nutrition; for a label it extracts text. (Health/medicine content carries a clear *not medical advice* note and no dosage guidance.)
3. For a receipt, digitises and files to the expense skill.
**Edge / fallback:** Blurry capture → asks for a retake rather than guessing numbers. Math the user disputes → shows the itemisation.
**Boundary:** Vision **on-device** where feasible; cloud escalation is shown and optional. Images not retained unless saved.
**Capabilities:** visual intelligence · custom skills · messaging.

### 21. Smart Home & System Settings
**Trigger:** "Set a focus mode for the next two hours and dim the lounge lights."
**Flow:**
1. Sage toggles the Focus mode and silences non-priority notifications.
2. Sends the light command to the connected smart-home connector.
3. Confirms what changed and offers to auto-revert after the window.
**Edge / fallback:** Device offline → reports which command failed and retries when it returns. Conflicting automation → asks before overriding.
**Boundary:** System toggles are local; smart-home actions go only to the user's connected, authorised devices.
**Capabilities:** system settings · in-app actions · scheduled execution.

### 22. Voice-First Hands-Free Mode
**Trigger:** "Hey Sage" while driving, or enabled as an accessibility default.
**Flow:**
1. Sage runs a fully spoken loop — no screen needed — for messages, reminders, navigation, and queries.
2. Consent for any send/action is given **by voice** with a clear read-back of what will happen.
3. Anything requiring the screen (e.g. releasing a vault secret) is deferred until the user is stationary, and Sage says so.
**Edge / fallback:** Noisy environment → confirms before acting on low-confidence speech. Risky action while driving → refuses and defers.
**Boundary:** On-device STT/TTS preferred; sensitive actions cannot be completed eyes-free.
**Capabilities:** voice · accessibility · consent · privacy-aware routing.

---

## F. Autonomy & work

### 23. Research → One-Pager (Sub-Agents)
**Trigger:** "Research the top three competitors to X and draft a one-page brief."
**Flow:**
1. Sage decomposes the objective and dispatches parallel background sub-agents (Hermes `delegate_task(background=true)`) — one per competitor, one to synthesise.
2. The user keeps using the phone; the agent console shows live progress per sub-agent.
3. Sub-agents browse and extract; Sage assembles the one-pager and presents it.
4. Nothing is saved to a connector or sent until the user picks the destination.
**Edge / fallback:** A sub-agent stalls → Sage reports partial results and offers to retry that branch only. Sources conflict → it flags the disagreement rather than averaging it away.
**Boundary:** Web research cloud-side (non-personal); the **draft stays local** until the user routes it.
**Capabilities:** multi-model orchestration · background sub-agents · agent console.

### 24. Mobile Dev Status & Control
**Trigger:** "Did CI pass on the Sage branch?" / "Summarise the open PR."
**Flow:**
1. Sage queries the connected code host: CI status, failing checks, the PR diff summarised in plain language.
2. It can trigger a re-run or post a brief comment — each as a confirmed action.
3. Subscribes the user to a notification on completion via their chosen channel.
**Edge / fallback:** Auth expired → prompts re-authentication rather than failing silently. Large diff → summarises by file and offers detail on request.
**Boundary:** A **status-and-control surface, not an IDE**; no code editing on mobile. Actions on the repo are consent-gated.
**Capabilities:** connectors · agent console · async · consent.

### 25. Build a Custom Skill
**Trigger:** "Make a skill: every Friday, summarise my week's notes into a status update draft."
**Flow:**
1. Sage captures the steps, names the skill, and asks which connectors and permissions it needs.
2. It scopes the skill (read Notes, draft only — no auto-send) and saves it locally with a preview.
3. The skill appears in the private skills surface; editable, pausable, deletable, with a per-skill permission summary.
**Edge / fallback:** Requested scope exceeds granted permissions → Sage asks for the specific grant or narrows the skill. Skill errors on a run → notifies and pauses, doesn't retry blindly.
**Boundary:** Skills are **private and local by default** — never published to a shared hub unless the user exports one.
**Capabilities:** custom skills · scheduled execution · permission scoping.

### 26. Proactive Nudge
**Trigger:** Opt-in only. A relevant context fires — e.g. near a pharmacy the user noted, or a monitored price drops.
**Flow:**
1. With explicit standing consent, Sage watches a small set of user-chosen triggers (a reminder-with-location, a price watch, a deadline).
2. When one fires it surfaces a single, dismissible nudge with the action ready ("pick up the prescription?").
3. The user acts or dismisses; dismissals tune frequency.
**Edge / fallback:** Over-firing → Sage self-throttles and offers to disable the trigger. Location used → only while the relevant nudge is armed, never logged.
**Boundary:** Location and triggers are **opt-in, per-trigger, and ephemeral**; no background location history is retained.
**Capabilities:** proactive context · async monitor · location consent · privacy-aware routing.

---

## G. Local resilience & control

### 27. Load-Shedding–Aware Scheduling
**Trigger:** Enabled for the user's area, or "work around load-shedding today."
**Flow:**
1. Sage tracks the area's schedule and overlays it on the user's day.
2. It nudges charge reminders before a slot, defers power-hungry background tasks (large syncs, media generation) to powered windows, and reschedules affected calendar items on request.
3. Warns ahead of a slot and confirms any reschedules.
**Edge / fallback:** Schedule changes at short notice → re-plans and tells the user what moved. No data on the area → asks the user to set their zone.
**Boundary:** Scheduling logic runs **on-device**; only the public schedule is fetched.
**Capabilities:** async monitor · scheduled execution · privacy-aware routing.

### 28. Offline / Degraded Mode
**Trigger:** Automatic when connectivity drops.
**Flow:**
1. Sage continues all on-device capabilities — personal recall, OCR, local drafting, reminders, captured-meeting transcription.
2. It queues any task that needs the cloud, telling the user exactly what's waiting and why.
3. On reconnect it asks before sending anything that was drafted offline, rather than flushing the queue automatically.
**Edge / fallback:** A queued task is now stale → Sage flags it for review instead of sending. Partial connectivity → prioritises the lightest essential calls.
**Boundary:** On-device first means most things **just work offline**; nothing queued leaves the device without a fresh consent on reconnect.
**Capabilities:** privacy-aware routing · on-device execution · resilience · consent.

### 29. Health & Medication Reminders (Non-Diagnostic)
**Trigger:** "Remind me to take my evening meds and prep questions for my Thursday appointment."
**Flow:**
1. Sage sets the reminders and, before the appointment, helps the user assemble a list of questions and symptoms to raise with their clinician.
2. It can summarise the user's own notes for the visit and, with consent, share them to the user's device for the doctor.
3. It explicitly **does not diagnose, dose, or advise on treatment** — it points the user to a professional for anything clinical.
**Edge / fallback:** User asks for medical judgment → Sage declines that part, keeps the logistics help, and recommends speaking to a clinician.
**Boundary:** All health notes stay **on-device**, in the vault; nothing is shared without explicit consent.
**Capabilities:** scheduled execution · personal context · careful-boundary handling · consent.

### 30. See and Prune What Sage Knows
**Trigger:** "What are you remembering about me?" / "What's running right now?"
**Flow:**
1. Sage opens an inspectable view of memory — preferences, facts, context — plus the agent console of active and queued background agents.
2. The user edits or deletes memory entries (atomic add/replace/remove against the budget) and stops or reschedules any running agent.
3. Full data export and erasure are available here; changes take effect immediately and land in the audit log.
**Edge / fallback:** Deleting a fact a skill depends on → Sage warns and names the affected skill first. Bulk erase → requires a deliberate confirm.
**Boundary:** Memory is **user-inspectable and user-editable**; deletion is real deletion. GDPR/POPIA export and erasure are first-class.
**Capabilities:** atomic memory · agent console · data export/erasure · user control.

---

## Coverage map
- **Personal context:** 1,2,3,4,7,29
- **Screen awareness:** 3,10,17
- **Visual intelligence:** 2,4,18,20
- **Voice:** 1,5,14,22
- **Multi-model routing:** 1,5,8,10,11,14
- **Background sub-agents:** 9,13,15,23
- **Connectors & in-app actions:** 6,11,18,19,21,24
- **Messaging reach:** 4,12,13,14,20
- **Tokenised vault / sensitive actions:** 16,17,19,29
- **Custom skills:** 8,9,18,25
- **Async / scheduled / monitors:** 1,11,15,21,26,27
- **Agent console:** 15,23,24,30
- **Memory:** 5,8,13,30
- **System / device:** 21
- **Accessibility:** 22
- **Privacy ledger / data control:** 19,28,30
- **Local resilience (SA-grounded):** 14,27,28
- **Consent & audit ledger:** every workflow.
