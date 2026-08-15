// Remembers which pass someone was trying to buy when they were sent off to
// sign in, so the purchase resumes by itself when they land back on /pricing.
//
// Both sign-in methods leave the site entirely — Google redirects out to the
// consent screen, and a magic link is opened from an email client, usually in
// a brand-new tab. That rules out sessionStorage, which is per-tab and would
// be empty in exactly the tab the magic link opens. localStorage survives both.
//
// The entry is read-and-cleared in one step so a resumed checkout can never
// fire twice (React's StrictMode double-invokes effects in dev, and the second
// read must come back empty), and it expires after PENDING_TTL_MS so an
// abandoned attempt can't hijack an unrelated visit later on.

const STORAGE_KEY = 'pending_pass_purchase';
const PENDING_TTL_MS = 30 * 60 * 1000; // 30 minutes

export function setPendingPass(passId) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ passId, ts: Date.now() }));
  } catch {
    // Private browsing or a full quota. Checkout still works — the user just
    // has to press Buy once more after signing in, which is today's behaviour.
  }
}

export function clearPendingPass() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
}

// Returns the stored pass id and forgets it, or null if there was nothing
// pending, the entry was malformed, or it has gone stale.
export function takePendingPass() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  clearPendingPass();

  try {
    const { passId, ts } = JSON.parse(raw);
    if (!passId || typeof ts !== 'number') return null;
    if (Date.now() - ts > PENDING_TTL_MS) return null;
    return passId;
  } catch {
    return null;
  }
}
