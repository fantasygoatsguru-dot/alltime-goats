import { PLAYERS, YAHOO_ADP_DATE, YAHOO_PRERANK_DATE } from './top-150-2026-27.js';

const playersByName = new Map(PLAYERS.map(player => [player.name, player]));

export function syncPuntGuide(guide) {
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
