// Kill switch for the Yahoo Fantasy integration.
//
// Since 2026-07-22 Yahoo refuses every Fantasy API request ("This application
// is not authorized to perform this action") from apps that have not been
// approved through its new access program (sports.yahoo.com/developer/access).
// OAuth login still works, so connecting looked successful and then every
// league call failed — and the front end retried them thousands of times an
// hour.
//
// While false:
//   - nobody is treated as Yahoo-connected (AuthContext), so no Yahoo calls run;
//     a stored connection is left in localStorage untouched for when it returns;
//   - every connect prompt renders YAHOO_PAUSED_NOTICE instead of a button;
//   - the header / menu "Connect Yahoo" entries are hidden.
// Flip back to true once Yahoo approves the app.
export const YAHOO_ENABLED = false;

export const YAHOO_PAUSED_NOTICE = {
  title: 'Yahoo league sync is temporarily unavailable',
  body:
    "Yahoo has changed how third-party apps can read Fantasy data, and we're waiting on their approval. " +
    'Rankings, guides and schedules all work as usual in the meantime.',
};
