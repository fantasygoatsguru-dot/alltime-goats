import { useEffect } from 'react';

const PROJECT_ID = 'xqju77r5i1';
const SCRIPT_ID = 'clarity-loader';

// TCF purpose 1, "store and/or access information on a device" — the purpose
// that covers Clarity's _clck/_clsk cookies and its session recording.
const REQUIRED_PURPOSE = 1;

// How long to wait for a CMP to register __tcfapi before giving up on it.
const CMP_WAIT_MS = 5000;
const POLL_MS = 200;

/**
 * Microsoft Clarity — session recording and heatmaps.
 *
 * This used to be an inline snippet in index.html, so it ran for every visitor
 * before anything could ask whether they had consented. The old CookieYes
 * banner never blocked it either (clarity.ms was not in its provider list),
 * which meant the banner told EEA visitors that analytics were held back while
 * Clarity was in fact recording their sessions.
 *
 * It now loads only once the CMP (Google Privacy & Messaging, tagged in
 * index.html) has answered:
 *
 *   - Outside the EEA/UK the CMP reports `gdprApplies === false`, and Clarity
 *     loads immediately — the same behaviour as before, for most of the site's
 *     traffic.
 *   - Inside it, we wait for consent to purpose 1.
 *   - If no CMP ever answers — an ad blocker is the usual reason, since the
 *     tag comes from fundingchoicesmessages.google.com — we cannot tell which
 *     of those two a visitor is, so Clarity does not load. That costs some
 *     analytics coverage. Guessing would cost the consent guarantee instead,
 *     which is the worse thing to lose.
 *
 * Deliberately has no entitlement check: this is analytics, not advertising,
 * and a pass buys ad-free browsing rather than exemption from measurement.
 */
export default function Clarity() {
  useEffect(() => {
    let settled = false;
    let listenerId = null;
    let pollTimer = null;
    let waited = 0;

    const load = () => {
      if (settled) return;
      settled = true;
      stopListening();

      if (document.getElementById(SCRIPT_ID)) return;

      // Clarity's own bootstrap: a queue stands in for the real API until the
      // tag arrives, so anything calling window.clarity early is not lost.
      window.clarity =
        window.clarity ||
        function () {
          (window.clarity.q = window.clarity.q || []).push(arguments);
        };

      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${PROJECT_ID}`;
      document.head.appendChild(script);
    };

    const stopListening = () => {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
      if (listenerId !== null && typeof window.__tcfapi === 'function') {
        window.__tcfapi('removeEventListener', 2, () => {}, listenerId);
        listenerId = null;
      }
    };

    // Fires again on every consent change, so it has to tolerate being called
    // repeatedly and only act once (`settled`).
    const onTcData = (tcData, success) => {
      if (settled || success === false || !tcData) return;

      if (typeof tcData.listenerId === 'number') listenerId = tcData.listenerId;

      // The user is still looking at the message; nothing to decide yet.
      if (tcData.eventStatus === 'cmpuishown') return;

      if (tcData.gdprApplies === false) {
        load();
        return;
      }

      if (tcData.purpose?.consents?.[REQUIRED_PURPOSE]) load();
    };

    const attach = () => {
      window.__tcfapi('addEventListener', 2, onTcData);
    };

    if (typeof window.__tcfapi === 'function') {
      attach();
    } else {
      // The CMP tag is async, so __tcfapi is usually not there on first paint.
      pollTimer = setInterval(() => {
        if (settled) {
          stopListening();
          return;
        }
        if (typeof window.__tcfapi === 'function') {
          clearInterval(pollTimer);
          pollTimer = null;
          attach();
          return;
        }
        waited += POLL_MS;
        if (waited >= CMP_WAIT_MS) {
          // No CMP, no consent signal, no recording. See the note above.
          stopListening();
          settled = true;
        }
      }, POLL_MS);
    }

    return stopListening;
  }, []);

  return null;
}
