# Firebase Security Specifications: Trent TV Portal

## Data Invariants

1. **Authentication Boundary**
   - Public visitors can read schedule grids, video catalogs, "about us" information, and live-stream configuration.
   - Any signed-in user (authenticated via Google) can apply as a volunteer or manage content in the CMS dashboard.
   - For administrative operations, we require a valid authenticated Firebase user (`request.auth != null` and email verification where appropriate).

2. **Structural Document Constraints**
   - **liveStream**: Custom standby poster image, broadcast URL, active-status boolean, and view counter. Max poster size is strictly guarded if base64 payloads are sent.
   - **schedule**: Slots require non-empty alphanumeric day identifiers, category values matching the subset enum, and timestamp bounds.
   - **videos**: On-demand videos require a valid 11-character YouTube video ID.
   - **volunteers**: Standard student registrations including email details, sanitized course text, and size constraints to prevent Denial-of-Wallet attacks.

3. **Temporal Integrity**
   - Audits, registrations, and creations use database-enforced server-side request times rather than trusting client-set parameters.

---

## The "Dirty Dozen" Payloads (Exploit Scenery Analysis)

The following payloads represent malicious attempts to bypass identity, structure, or state invariants.

### 1. The ID-Poisoning Attack on Schedule
Attacker attempts to inject excessive metadata into the ID parameter of a physical schedule slot document.
- **Payload**: `/schedule/MALICIOUS_LONG_ID_OR_CHARS_!#$@%`
- **Inbound Block**: `isValidId()` blocks junk characters and lengths > 128.

### 2. Privilege Escalation - Self-Assigned Role
Unauthenticated user attempts to set system administrative flags on custom user configurations.
- **Payload**: `{ "uid": "attacker_id", "isAdmin": true, "role": "Station Manager" }`
- **Inbound Block**: Prevented by strict write guards.

### 3. Ghost Field Poisoning (Shadow Update)
Attacker tries to store arbitrary analytics keys to cause memory exhaustion on clients.
- **Payload**: `{ "id": "yt-1", "youtubeId": "R-v_UjMyxU8", "extra_pollutant": "1MB string..." }`
- **Inbound Block**: `affectedKeys().hasOnly()` gates update fields exactly.

### 4. Overwriting Permanent Timestamps
Attempting to falsify the historical creation timestamp of an approved volunteer.
- **Payload**: `{ "name": "Fake Student", "createdAt": "2000-01-01T00:00:00Z" }`
- **Inbound Block**: Checked against `request.time`.

### 5. Type Tampering - Live Viewer Spoofing
Attacker attempts to make live viewer counts a list or floating-point number.
- **Payload**: `{ "viewerCount": [99999] }`
- **Inbound Block**: Verified via `data.viewerCount is int`.

### 6. Invalid Category Injection on Shows
Attempting to create a schedule slot with an illegal category string that breaks CSS styling.
- **Payload**: `{ "title": "Malicious", "category": "super-spy" }`
- **Inbound Block**: Gated by exact enum checks: `category in ['news', 'sports', 'entertainment', 'music', 'other']`.

### 7. Denial-of-Wallet Document Inflation
Attacker tries to register as a volunteer but sends a giant 500KB bio block.
- **Payload**: `{ "name": "Fake Student", "email": "fake@my.ntu.ac.uk", "course": "A" * 100000 }`
- **Inbound Block**: Checked via `course.size() <= 200`.

### 8. Spoofing Foreign Volunteer Identity
Unauthenticated guest tries to overwrite an existing volunteer's application.
- **Payload**: `/volunteers/target_user` -> `{ "email": "swapped_attacker@ntu.ac.uk" }`
- **Inbound Block**: Checked via write/update restrictions.

### 9. Setting Invalid YouTube IDs
A payload where YouTube video ID is too long or contains invalid characters.
- **Payload**: `{ "youtubeId": "https://youtube.com/watch?v=S3mG6p_s65_E" }`
- **Inbound Block**: Verified as alphanumeric and exactly 11 characters.

### 10. Blank fields in Schedule Show
Trying to submit a schedule block with missing fundamental fields like `title`.
- **Payload**: `{ "host": "Jack", "day": "Monday" }`
- **Inbound Block**: Strict key counts require all fields.

### 11. Overwriting About Us Philosophy with spam link
An attacker attempts to insert spam references into our station biography.
- **Payload**: `/config/aboutUs` -> `{ "philosophy": "https://malicious-spam-url.com" }`
- **Inbound Block**: Requiring authenticated CMS session.

### 12. Negative State Values
Submitting a video with negative views or negative likes.
- **Payload**: `{ "title": "Tampered Views", "views": -100 }`
- **Inbound Block**: Enforces `views >= 0`.

---

## Test Runner Verification Structure
The security states will be modeled in the `firestore.rules` file and checked via ESLint rule validation.
