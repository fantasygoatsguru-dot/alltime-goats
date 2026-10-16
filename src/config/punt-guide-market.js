import { PLAYERS, UNRANKED_INJURIES, YAHOO_ADP_DATE, YAHOO_PRERANK_DATE } from './top-150-2026-27.js';

const playersByName = new Map(PLAYERS.map(player => [player.name, player]));
const unrankedInjuryNames = new Set(UNRANKED_INJURIES.map(player => player.name));

// `others` is a bare list of extra names per round, with no note to carry an
// injury caveat. Every name must therefore be on the Top 150 (where availability
// is already priced), never an unranked injury, and not repeat a written
// target in the same guide.
function checkOthers(guide) {
  const written = new Set(guide.roundTargets.flatMap(round => round.candidates.map(c => c.name)));
  const seen = new Set();
  for (const round of guide.roundTargets) {
    for (const name of round.others || []) {
      if (unrankedInjuryNames.has(name)) throw new Error(`${guide.slug} round ${round.round}: ${name} is an unranked injury`);
      if (!playersByName.has(name)) throw new Error(`${guide.slug} round ${round.round}: other target missing from Top 150: ${name}`);
      if (Number.isFinite(playersByName.get(name).availability)) throw new Error(`${guide.slug} round ${round.round}: ${name} has an injury discount and needs a written note, not a bare name`);
      if (written.has(name)) throw new Error(`${guide.slug} round ${round.round}: ${name} is already a written target`);
      if (seen.has(name)) throw new Error(`${guide.slug} round ${round.round}: ${name} is listed twice`);
      seen.add(name);
    }
  }
}

export function syncPuntGuide(guide) {
  checkOthers(guide);
  const resolveText = (text, player) => text.replace(
    /\{\{(rank|preRank)(?::([^}]+))?\}\}/g,
    (token, field, name) => {
      const match = name ? playersByName.get(name) : player;
      const value = field === 'rank' ? match?.rank : match?.yahooPreRank;
      if (!Number.isFinite(value)) throw new Error(`Unresolved punt-guide reference: ${token}`);
      return String(value);
    },
  );
  return {
    ...guide,
    marketNote: `Yahoo public pre-ranks: ${YAHOO_PRERANK_DATE}; ADP: ${YAHOO_ADP_DATE} (dated snapshot). Overall ranks are not punt ranks. Round labels are buying ranges, not availability guarantees. The radar uses historical NBA results and excludes players without a matching season row.`,
    sections: guide.sections.map(section => ({
      ...section,
      body: section.body.map(text => resolveText(text)),
    })),
    exampleTeams: guide.exampleTeams.map(team => ({
      ...team,
      note: resolveText(team.note),
    })),
    roundTargets: guide.roundTargets.map(round => ({
      ...round,
      candidates: round.candidates.map(candidate => {
        const player = playersByName.get(candidate.name);
        if (!player) throw new Error(`Punt target missing from Top 150: ${candidate.name}`);
        return {
          ...candidate,
          yahooAdp: player.yahooAdp,
          yahooPreRank: player.yahooPreRank,
          boardRank: player.rank,
          note: resolveText(candidate.note, player),
        };
      }),
    })),
  };
}
