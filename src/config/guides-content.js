// Explicit .js extension: scripts/prerender.js reaches this file under plain
// Node ESM (via structured-data.js), which does not resolve extensionless paths.
import { CONTENT_SEASON } from './season.js';
import { PUNT_GUIDES } from './punt-guides-2026-27.js';
import { syncPuntGuide } from './punt-guide-market.js';
import { YAHOO_ADP_DATE, YAHOO_PRERANK_DATE } from './top-150-2026-27.js';
import { SLEEPERS_UPDATED_AT, SLEEPERS_YAHOO_ADP_DATE, SLEEPERS_YAHOO_PRERANK_DATE } from './sleepers-busts-2026-27.js';
import { BUSTS_UPDATED_AT, BUSTS_YAHOO_ADP_DATE, BUSTS_YAHOO_PRERANK_DATE } from './sleepers-busts-2026-27.js';

// Editorial content for the Guides section.
// The live stat cards come from player_period_averages via <RankingTable>,
// <TeamRadar> and <DraftBuilder>. Historical numbers quoted in the editorial
// notes are the corrected 2025-26 season lines, not 2026-27 projections.
//
// Adding a guide = add an entry here. The template (Guide.jsx) and the hub
// (Guides.jsx) render everything off this config. No database, no CMS.

// The nine fantasy categories, with a fixed colour identity used across the
// whole Guides section. `zKey` maps to the column in player_period_averages.
export const CATEGORIES = [
  { key: 'pts', zKey: 'points_z',         label: 'PTS', name: 'Points',       color: '#f2711c' },
  { key: '3pm', zKey: 'three_pointers_z', label: '3PM', name: 'Threes',       color: '#8e44ad' },
  { key: 'reb', zKey: 'rebounds_z',       label: 'REB', name: 'Rebounds',     color: '#16a085' },
  { key: 'ast', zKey: 'assists_z',        label: 'AST', name: 'Assists',      color: '#2f80ed' },
  { key: 'stl', zKey: 'steals_z',         label: 'STL', name: 'Steals',       color: '#27ae60' },
  { key: 'blk', zKey: 'blocks_z',         label: 'BLK', name: 'Blocks',       color: '#c0392b' },
  { key: 'fg',  zKey: 'fg_percentage_z',  label: 'FG%', name: 'Field Goal %', color: '#b8860b' },
  { key: 'ft',  zKey: 'ft_percentage_z',  label: 'FT%', name: 'Free Throw %', color: '#c2185b' },
  { key: 'to',  zKey: 'turnovers_z',      label: 'TO',  name: 'Turnovers',    color: '#546e7a' },
];

export const categoryByKey = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

// The season the guides are written for. Editorial only — the live boards read
// their numbers from STATS_SEASON, which lags this until the new season's data
// lands. See config/season.js for why the two flip separately.
export const CURRENT_GUIDE_SEASON = CONTENT_SEASON;

// ---------------------------------------------------------------------------
// GUIDES
// ---------------------------------------------------------------------------
// The four rankings/reference guides are written out below. `punt-blocks` is
// the free, indexable punt build and doubles as the shape every other punt
// guide follows; the written premium builds live in punt-guides-2026-27.js and
// are spread in at the foot of the array. Builds not yet written are in
// PLANNED_GUIDES and deliberately render nowhere.

export const guides = [
  syncPuntGuide({
  "slug": "punt-blocks",
  "type": "punt",
  "puntKey": "blk",
  "title": "Punt Blocks",
  "season": CONTENT_SEASON,
  "difficulty": "Advanced",
  "isPremium": false,
  "tagline": "Build a strong perimeter team without giving away rebounds, shooting percentages or turnovers.",
  "strengths": [
    "pts",
    "ast",
    "stl",
    "3pm",
    "ft"
  ],
  "weaknesses": [
    "blk",
    "reb",
    "fg",
    "to"
  ],
  "board": {
    "minGames": 30,
    "freeLimit": null,
    "previewRows": 4
  },
  "sections": [
    {
      "id": "strategy",
      "heading": "The strategy",
      "body": [
        "Punt blocks lets you stop paying for rim protection and spend those picks on scoring, passing and shooting. Towns is a useful example: his 11.9 rebounds and 85.8% FT come with only 0.5 blocks. In a balanced draft, you may feel pressure to pair him with a shot blocker. Here, the next pick can strengthen assists or steals instead. Pritchard is another good fit because almost all of his useful production survives when blocks are removed.",
        "The strongest version still has a frontcourt. Replacing every center with a guard often gives away rebounds and FG% as well as blocks, leaving very little room for an off week in the perimeter categories. Jokić makes the balance easier through his rebounding, passing and efficient volume. Shai gives you exceptional percentage support from guard. Near the first-round turn, a Mitchell-Towns opening can establish the offense and boards together. Each route asks for different help in the following rounds.",
        "This guide assumes a 12-team, nine-category head-to-head league. The aim is to create several reliable ways to reach five category wins, not to declare the same five columns won on draft night. A team with strong guards can still compete in rebounds or FG% if the picks are deliberate. In roto, conceding a full season of blocks costs standings points that must be recovered elsewhere, so the same roster choices require a different calculation."
      ]
    },
    {
      "id": "correlation",
      "heading": "Natural strengths & weaknesses",
      "body": [
        "Points, threes, assists and FT% are accessible through the guards, but steals need deliberate attention. Brunson averaged 26.0 points and 6.8 assists with only 0.8 steals; Murphy gave you 1.5 steals alongside 3.2 threes. That difference matters when the team already has enough passing. Anunoby, Daniels and Wallace offer other ways to add defense without buying blocks you do not intend to use.",
        "Rebounds and FG% are separate problems. Bam supplied ten boards but shot 44.2% on 15.7 attempts, so he can solve the first while making the second harder. Duren gave you 10.5 rebounds and 65.0% FG, with a different cost at the line: 74.7% on 6.1 attempts. Towns is easier to fit in FT%, while Hart adds 7.4 boards from a wing. Choose the particular kind of rebounding your early percentages can support.",
        "Free-throw volume can make an apparent mismatch workable. Daniels' 61.5% came on 1.6 attempts, and Hart's 72.0% on 1.9. Those rates deserve attention, but they do not have the same influence as a weak shooter taking six or ten a game. Bane and Daniels combine to about 82.7% when their historical makes and attempts are weighted with equal games. Conversely, a player who shoots nearly 90% on one attempt cannot repair a large deficit alone.",
        "Turnovers are the other easy category to lose. Luka averaged four and Harden 3.5, so collecting assists without regard to who supplies them can become a second punt. Murray gave you 7.1 assists with 2.3 turnovers; Quickley supplied 5.9 with 1.5. Once the early scoring is established, those differences can be more valuable than adding another impressive points average. Removing blocks has no effect on any of those possession costs."
      ]
    },
    {
      "id": "draft",
      "heading": "Where the value sits in the draft",
      "body": [
        "Start with scoring and percentage support, but keep a real plan for rebounds. Durant offers an efficient second-round scoring foundation, while Flagg brings rebounding and passing upside. Neither makes Towns or Bam redundant if your opening guard leaves the frontcourt thin.",
        "Murphy and Markkanen are third-round targets; Quickley can supply passing in the middle rounds. Bane is worth a fourth-round selection when his percentage balance matters more than White's remaining production after blocks are removed. Brown needs a discount because this punt does not solve his turnovers or uncertain scoring volume.",
        "Sabonis fits the category plan, but his small prior-season sample and availability concern matter at the price. Vučević is a final-round consideration because Orlando's center minutes are uncertain. Cameron Johnson and Harper offer different alternatives: complementary shooting versus developing guard creation. Choose the contribution your roster needs, not simply the biggest name available."
      ]
    },
    {
      "id": "ranking-update",
      "heading": "How to use the board and draft targets",
      "body": [
        "The Top 150 estimates overall draft value; this guide focuses on the categories you intend to win. A player's best fit and sensible buying range can differ from his overall rank.",
        "The table and example-team totals use 2025-26 NBA results with the punted category excluded from value. Written recommendations account for role and availability. Rookies without an NBA season row are excluded from the historical radar, not assigned zero projected production. Example rosters illustrate category trade-offs rather than guaranteed draft paths."
      ]
    }
  ],
  "buildingBlocks": [
    {
      "name": "A first pick that defines the next need",
      "note": "Jokić gives you the boards to draft guards freely. Shai supplies accurate shooting volume but needs rebounding help. Luka supplies more threes and assists while asking more of the later percentages and turnovers."
    },
    {
      "name": "Rebounding you can afford",
      "note": "Towns supports free throws, Duren moves FG%, and Hart adds boards from the wing. The right choice depends on the percentage impact and shooting already present."
    },
    {
      "name": "Useful production without extra turnovers",
      "note": "Murphy and Anunoby add steals and threes; Pritchard and Quickley add passing with good ball security. Choose the missing contribution once the primary scorers are in place."
    }
  ],
  "exampleTeams": [
    {
      "name": "Jokić with balanced guard production",
      "color": "#2e9e53",
      "roster": [
        "Nikola Jokić",
        "Jamal Murray",
        "Bam Adebayo",
        "Trey Murphy III",
        "Desmond Bane",
        "OG Anunoby",
        "De'Aaron Fox",
        "Josh Hart"
      ],
      "note": "Jokić supplies the efficient rebounding that makes this backcourt possible. Murray and Fox add creation, Murphy and Anunoby cover shooting and steals, and Hart adds boards from the wing. The eight historical lines total 162.0 points, 53.5 rebounds, 42.1 assists and 17.7 threes at 49.1% FG and 83.2% FT. Turnovers reach 17.5, so the later picks should favor ball security rather than another lead guard. Bam helps the boards, but his 44.2% shooting is why the team cannot assume FG% is dominant. At current prices, prioritize the early rebounder and use Quickley or a later shooter when the preferred wing has already gone. Have alternatives ready if the shooting wings you want are already taken."
    },
    {
      "name": "Mitchell and Towns near the turn",
      "color": "#ff6f61",
      "roster": [
        "Donovan Mitchell",
        "Karl-Anthony Towns",
        "Jalen Duren",
        "Trey Murphy III",
        "Desmond Bane",
        "Dyson Daniels",
        "Mikal Bridges",
        "Josh Hart"
      ],
      "note": "Towns and Duren protect rebounds while Mitchell and Bane provide accurate free-throw volume. Daniels and Hart add passing and boards without another high-usage guard, and Bridges keeps turnovers down. These eight historical lines combine for 147.3 points, 54.7 rebounds, 33.0 assists and 10.1 steals at 50.8% FG and 82.5% FT, with 15.7 turnovers. Threes are the next priority at 13.7 across the group. At current prices, prioritize the early rebounder and use Quickley or a later shooter when the preferred wing has already gone. Have alternatives ready if the shooting wings you want are already taken."
    }
  ],
  "roundTargets": [
    {
      "round": 1,
      "candidates": [
        {
          "name": "Nikola Jokić",
          "note": "The easiest opening for this build because he solves the problems a guard-heavy draft usually creates. Jokić supplied 12.9 rebounds and 56.9% FG on 17.4 attempts, while his 10.7 assists let you spend later guard picks on shooting or steals instead of chasing another primary creator. Losing his 0.8 blocks is a relatively small cost beside the rest of that production. His 83.1% FT also comes on enough volume to support a weaker shooter later. The category that still needs care is turnovers: at 3.7 a game, he makes Bridges, Pritchard and other efficient secondary passers particularly appealing. You can build a strong backcourt around him without taking a lead guard at every opportunity."
        },
        {
          "name": "Shai Gilgeous-Alexander",
          "note": "Shai gives a perimeter-first team an unusual advantage in both percentages. He shot 55.3% on 19.4 field-goal attempts and 87.9% on nine free throws, enough volume to shape the whole roster. His 31.1 points and 6.6 assists come with only 2.2 turnovers, which leaves more room to choose another creator than a Luka opening does. The missing contribution is rebounding: 4.3 boards means you cannot simply keep drafting guards and expect the frontcourt to take care of itself. Towns is an excellent theoretical partner, but his ADP around 15 means he is unlikely to reach Shai's next turn. Be ready to address boards through the available center and a rebounding wing rather than assuming that pairing."
        },
        {
          "name": "Luka Dončić",
          "note": "Luka is the most direct route to a large points, threes and assists advantage. His 33.4 points, four threes, 8.2 assists and 7.7 rebounds give you plenty to build around even when the 0.5 blocks disappear. The difficult part is protecting the less visible categories. He shot 47.6% on 22.7 attempts and 78.0% on ten free throws, so both percentages depend on what follows. Four turnovers also make another high-usage passer a more expensive choice than his assist total suggests. Towns or an efficient rebounder can help the frontcourt; Bane and low-turnover wings can keep the perimeter strong. Luka works here, but he needs a more deliberate finish than Shai."
        },
        {
          "name": "Donovan Mitchell",
          "note": "Mitchell is a second-round target overall, with a case near the first-round turn specifically when blocks are removed. His 27.9 points, 3.2 threes and 1.5 steals come with 48.3% FG and 86.5% FT, so the scoring does not require accepting a major percentage weakness. He offers less passing than Harden, but 5.7 assists are a useful start, and the 0.3 blocks cost little to remove. Our Top 150 places him at {{rank}} against Yahoo ADP near 14; his Yahoo pre-rank of {{preRank}} may still push him earlier than our second-round valuation. If he reaches you, Towns is an attractive next pick because Mitchell's 4.5 rebounds need support. That pairing can establish the offense without sacrificing the center categories you still want to win."
        }
      ]
    },
    {
      "round": 2,
      "candidates": [
        {
          "name": "Austin Reaves",
          "note": "Reaves offers accurate shooting on meaningful volume, which becomes more important as you add guards. He shot 48.7% FG and 86.8% FT on 7.1 attempts at the line, with 22.9 points and 5.5 assists. LeBron's departure creates room for more creation beside Luka, but last season's 51 games mean the upside also depends on availability. The 2.9 turnovers are a reason to avoid treating him as a completely clean second guard. Compared with Murray, you get less proven passing and outside shooting; compared with many lower-efficiency scorers, the percentages are easier to support. Our rank of {{rank}} against Yahoo ADP near 22 makes the opportunity attractive when the first pick has a dependable workload."
        },
        {
          "name": "Cooper Flagg",
          "note": "Flagg moves ahead of Kawhi on the general board, and his 21 points, 6.7 rebounds and 4.5 assists give this build more than a scoring bet. You discard his blocks, but still keep useful wing rebounding and steals. Kyrie's return makes an automatic usage leap less likely; the upside is improving the efficiency and balance of the existing line. I would take him early in round two when the roster needs broad production, while recognizing that Yahoo's much earlier pre-rank can remove the opportunity."
        },
        {
          "name": "Kevin Durant",
          "note": "Durant's scoring is useful here because it comes with percentage support rather than another problem to repair. His 26 points on 52.0% FG and 87.4% FT fit beside a high-volume guard, while the modest blocks are easy to give up. That is not a durability guarantee after a 78-game season; leave room for age-related absences and find your steals elsewhere. He is an early-second-round option, not a player to defer simply because Yahoo orders him later."
        },
        {
          "name": "Kawhi Leonard",
          "note": "Kawhi supplies unusually efficient scoring and steals at a second-round price. His 27.5 points, 1.8 steals and 50.8% shooting make sense without blocks; Toronto's new offense and his age keep the availability risk in the price. For this punt, Durant is particularly attractive when both percentages need support, while Flagg offers more growth potential. Take Kawhi in round two when the fit warrants it, not because September's ADP promises another full round to wait."
        },
        {
          "name": "Jamal Murray",
          "note": "Murray supplies enough of the difficult guard categories to make an early center pick easy to live with. He averaged 25.4 points, 3.3 threes and 7.1 assists across 75 games, with 88.7% FT and only 2.3 turnovers. That last number matters: he gives you considerably more passing than many wings without the turnover rate of Harden. Denver's addition of DeRozan could reduce some of his scoring opportunities, so the appeal is the established shooting and creation rather than another usage jump. After Jokić, he reinforces the backcourt while the first pick already covers rebounds. After Shai, I would like the guard pairing but make the next frontcourt selection a priority."
        },
        {
          "name": "Karl-Anthony Towns",
          "note": "Towns is the early center whose main weakness fits the plan. His 0.5 blocks no longer matter, leaving 11.9 rebounds, 50.1% FG and 85.8% FT on 5.5 attempts. That free-throw volume is what separates him from the usual rebounding center: he can strengthen the line while filling a position many guard-heavy teams struggle to cover. His 1.5 threes help too, although they are not enough to treat him as a substitute for a high-volume shooter. The 2.5 turnovers remain a cost. Around the first/second-round turn, I particularly like him beside Mitchell or another scoring guard; managers picking near the very top should not count on him surviving until their second selection."
        }
      ]
    },
    {
      "round": 3,
      "candidates": [
        {
          "name": "Trey Murphy III",
          "note": "Murphy is an excellent complement to an early passer because he improves shooting and steals without adding many turnovers. He made 3.2 threes and averaged 1.5 steals, with 21.5 points and only 1.8 turnovers. His 5.7 rebounds also give you more frontcourt support than a pure shooting guard. The 88.6% FT helps on 3.7 attempts, while 47.0% FG is manageable beside an efficient first pick. You lose only 0.4 blocks here, so most of his value remains useful. Our Top 150 ranks him {{rank}} against Yahoo ADP near 40. I would be willing to take him before the end of round four rather than assume that gap survives another turn."
        },
        {
          "name": "Bam Adebayo",
          "note": "Bam's ten rebounds, 3.2 assists and 1.2 steals are useful contributions from center, and you give up little by removing his 0.7 blocks. The important caution is FG%. He shot 44.2% on 15.7 attempts, so he cannot be the efficient big expected to repair a run of guards. His 77.8% FT on 5.8 attempts also needs support if the line is meant to be a strength. Giannis' arrival changes Miami's shot distribution; easier looks are possible, but an efficiency rebound should be treated as upside rather than assumed. I prefer Bam after Jokić or Shai, where accurate volume is already established. After Harden, the same selection could make both shooting percentages harder to manage."
        },
        {
          "name": "Lauri Markkanen",
          "note": "Markkanen gives you scoring and shooting from a big roster slot without the turnover cost of another lead guard. His 26.6 points, 2.7 threes and 89.6% FT on 6.4 attempts came with only 1.5 turnovers. That is a valuable combination after Luka or Harden. The 6.8 rebounds help, but they do not replace a true rebounding center if the opening has been all guards. He played 42 games, and Utah's additional frontcourt scoring makes another season at the same usage uncertain. Our rank of {{rank}} is well ahead of his ADP near 39 because the per-game production is strong. I would still pair him with dependable availability rather than turn the whole draft into a health bet."
        },
        {
          "name": "James Harden",
          "note": "Harden can give you an assist and free-throw foundation in one pick. His 7.9 assists came with three threes and 88.2% FT on 7.4 attempts, so the percentage contribution is substantial. Cleveland now has him sharing the offense with Mitchell, which limits the case for simply projecting his old usage upward. More importantly, 43.2% FG and 3.5 turnovers remain real costs after blocks are removed. A Shai start gives you room to consider that trade; a Luka start makes it much harder to protect both categories. I would take Harden when creation and accurate free-throw volume are the needs, then favor an efficient rebounder and lower-turnover wings with the next picks."
        },
        {
          "name": "Jalen Brunson",
          "note": "Brunson fits the punt because you are giving up almost nothing in blocks. His 26.0 points and 6.8 assists came with 2.4 turnovers across 74 games, a useful combination of creation and recent availability. The limitation is on the rest of the counting stats: 3.3 rebounds and 0.8 steals leave more work for the next selections. Murray supplies more threes and assists at a similar Yahoo price, so I would generally prefer him if both are available. Brunson makes sense when you need another established scorer and can pair him with a rebounder and a defensive wing. His ADP near 22 is earlier than our overall rank of {{rank}}; the build improves his fit, but it does not erase the price difference."
        },
        {
          "name": "Dyson Daniels",
          "note": "Daniels is a useful antidote to a guard-heavy opening that has become short of rebounds and steals. He gave you 6.8 boards, 5.9 assists and two steals with only 1.8 turnovers, while 51.7% FG helps the percentage rather than undermining it. The shooting limitations need different treatment: 0.3 threes is a major gap, whereas 61.5% FT came on only 1.6 attempts and can be supported by accurate volume elsewhere. Bane and Daniels together shot about 82.7% with equal games and attempts properly weighted. I prefer Daniels when the earlier picks already shoot; if they include several non-shooters, Anunoby may do more for the categories that remain close."
        },
        {
          "name": "Jalen Duren",
          "note": "Duren is worth considering even though his clearest home is a free-throw punt. His 65.0% FG on 11.5 attempts and 10.5 rebounds can repair two of this build's common weaknesses, while 19.5 points keep the offense useful. You are not paying primarily for his 0.8 blocks. The tradeoff is 74.7% FT on 6.1 attempts, enough volume that the surrounding guards need to be strong at the line. Towns is the easier balanced fit; Duren is the more powerful FG% choice once accurate free-throw volume is already secured. I would consider him near his late-third-round price after Shai or a Mitchell-Towns opening, with a clear plan to buy threes afterward."
        },
        {
          "name": "Domantas Sabonis",
          "note": "The category fit is obvious: Sabonis supplies rebounds and passing while contributing almost no blocks. The latest season is much less reassuring as a projection base. He played only 19 games, averaging 11.4 rebounds and 4.1 assists, with 54.3% FG and 72.7% FT. His earlier passing ceiling is appealing, but a return to that level needs to be earned through health and workload rather than assumed. Yahoo's ADP near 27 is ahead of our rank of {{rank}}, so I would want some room in the price or a particularly strong need for boards and center assists. He also adds little shooting and 2.7 turnovers. A good punt fit does not make all of those costs disappear."
        }
      ]
    },
    {
      "round": 4,
      "candidates": [
        {
          "name": "Desmond Bane",
          "note": "Bane is the guard I would look for when the early picks already supply creation and the roster needs dependable scoring and percentages. He played all 82 games, averaged 20.1 points and 4.1 assists, and shot 48.3% FG with 90.8% FT on 4.2 attempts. His two turnovers are manageable for that workload. White offers more blocks, but that advantage has no value in this build; Bane's much stronger FG% becomes the more useful distinction. He gives you two threes rather than the volume of Murphy, so the choice depends on whether shooting quantity or overall efficiency is the priority. Around the fourth round, he fits particularly well after a riskier early selection."
        }
      ]
    },
    {
      "round": 5,
      "candidates": [
        {
          "name": "Franz Wagner",
          "note": "Wagner is a useful way to add scoring without another guard-sized rebounding line or a large turnover total. His 20.6 points came with 5.2 boards, 48.1% FG and 1.7 turnovers. The concern is availability after only 34 games, which is why this is a fifth-round decision rather than a straightforward early pick. His 1.4 threes also mean he will not repair a major shooting shortage on his own. I prefer Bane when the roster needs dependable games and stronger free-throw support; Wagner is more appealing when the forward slot and rebounding matter. After an injury-risk opening, I would be cautious about adding another player whose projection needs a large improvement in games played."
        },
        {
          "name": "Keyonte George",
          "note": "George supplies real free-throw impact as well as scoring. His 89.1% FT came on seven attempts, alongside 23.5 points and 6.1 assists, so he can support a weaker-shooting big more effectively than a high-percentage guard who rarely reaches the line. The price is 45.9% FG and 3.1 turnovers, plus a 54-game season. Utah has also added Peterson to the backcourt, creating competition for some of the ballhandling. I would consider George when points, assists and FT% are all needs, with enough efficient volume already in place. After Luka or Harden, the turnover total makes a cleaner guard more attractive. His fifth-round ADP is reasonable only if those particular contributions improve the whole team."
        },
        {
          "name": "Mikal Bridges",
          "note": "Bridges is valuable when the first few rounds have already supplied the scoring and the turnover count is climbing. His 3.7 assists came with only one turnover, alongside 1.3 steals, 1.9 threes and 49.0% FG. He played all 82 games, a useful recent record after a Kawhi or Markkanen pick. You lose his 0.8 blocks here, so he is less of a specialist bargain than in a build that keeps every defensive category. The rest of the line still fits without asking you to change direction. Anunoby gives you more steals and threes; Bridges offers more passing and cleaner possessions. Around pick 80, that can be the better use of a wing slot than another scorer."
        },
        {
          "name": "Payton Pritchard",
          "note": "Pritchard gives you much of the guard production this build wants while contributing almost nothing in the category you are removing. He made 2.7 threes and averaged 5.2 assists with 1.4 turnovers and only 0.1 blocks. That makes him especially attractive compared with paying several rounds more for White and then discarding White's rim protection. His 46.3% FG still needs support, and 89.0% FT on 1.7 attempts is helpful rather than enough to carry the line. Boston's changed offense may trim some creation, so I would value a repeat of the supporting role rather than another usage increase. After an early scoring guard and a rebounding big, he can finish the passing without making turnovers worse."
        }
      ]
    },
    {
      "round": 6,
      "candidates": [
        {
          "name": "OG Anunoby",
          "note": "Anunoby gives this build steals without forcing you to draft another primary creator. His 1.6 steals come with 2.3 threes, 48.4% FG and 1.8 turnovers, so he can strengthen the perimeter while leaving the offense to your early picks. You discard 0.7 blocks, but enough of the line remains useful. The 5.2 rebounds help a little; the 2.2 assists will not solve a shortage of passing. Compared with Daniels, Anunoby is the easier shooting fit and the weaker source of rebounds and assists. I like him after an opening that already has two creators, especially if adding another high-usage guard would put turnovers beyond reach. His 67 games keep availability part of the decision."
        },
        {
          "name": "Tyler Herro",
          "note": "Herro is appealing when the team needs shooting and has already covered defense. He supplied 20.5 points and 2.5 threes while making 91.7% of his free throws, with 48.0% FG keeping the scoring reasonably efficient. His move to Milwaukee creates an opportunity for offense, but only 33 games last season makes health a large part of the bet. He also adds limited steals, so choosing him after several score-first guards can leave that category thin. Bane offers the more reassuring recent workload; Herro is the later upside choice when your early picks are dependable and a defensive wing is already in place. I would not assume that a new team automatically produces a larger, healthier season."
        },
        {
          "name": "Immanuel Quickley",
          "note": "Quickley is a particularly useful later guard for a team trying to stay competitive in turnovers. He averaged 5.9 assists and 2.5 threes with just 1.5 turnovers, enough creation to support a star without duplicating the star's possession cost. He also added 1.3 steals. The 44.3% FG on 12.9 attempts is the main category sacrifice; this is a more comfortable pick after Jokić than after several inefficient guards. Kawhi's arrival in Toronto may reduce some ballhandling, so last season's assist total is a reference rather than a promise. Near pick 97, I would prefer Quickley to another scorer when passing, threes and ball security are the categories that still need help."
        },
        {
          "name": "Jaden McDaniels",
          "note": "McDaniels can still help a punt-blocks roster, but I would choose him for a specific reason rather than automatically carry over his value from another build. His one block disappears, leaving 51.5% FG, 83.5% FT, 1.1 steals and 1.4 threes. Those percentages are useful after a low-efficiency guard, while the 4.2 rebounds and 2.7 assists are more modest contributions. Hart does much more for rebounding and passing at a similar draft stage. McDaniels is the choice when those categories are already covered and the wing slot needs efficient scoring and steals. Minnesota's new backcourt may change his shot opportunities, but defense remains the reason to expect him to earn minutes."
        }
      ]
    },
    {
      "round": 7,
      "candidates": [
        {
          "name": "De'Aaron Fox",
          "note": "Fox is useful when you need assists but cannot afford another serious FG% penalty. His 6.2 assists came with 48.6% shooting and 2.3 turnovers, a more manageable balance than several earlier lead guards. He also made 1.8 threes, so the shot distribution is not as restrictive as a non-shooting passer's. The 76.0% FT on 3.4 attempts is the cost to check, especially if the frontcourt already includes Duren or Bam. Pritchard is the better shooting-and-ball-security option; Fox adds more scoring, assists and steals. Sharing San Antonio's creation with Castle and Wembanyama limits the case for a scoring rebound. I would use him to fill a specific passing gap around his seventh-round price."
        }
      ]
    },
    {
      "round": 8,
      "candidates": [
        {
          "name": "Norman Powell",
          "note": "Powell is one of the later ways to buy a meaningful scoring contribution. His 21.7 points and 2.7 threes came with 47.0% FG and 82.7% FT on 5.5 attempts, so the line supplies more than empty shot volume. Chicago signed him after his Miami season, and the new offense gives him an opportunity without guaranteeing the same usage. His 3.5 rebounds and 2.5 assists explain why he should finish an established core rather than be expected to do everything a guard provides. He also played 58 games. I like the eighth-round price when points and threes are still short, with rebounding and passing already secured and room for some availability risk."
        },
        {
          "name": "Dylan Harper",
          "note": "Harper's preseason starting opportunity alongside Fox and Castle earns him a place in the middle-to-late rounds. His rookie line of 11.8 points, 3.4 rebounds and 3.9 assists needs more minutes to become a strong fantasy package, but a punt-blocks team can use growth in scoring and passing without demanding rim protection. Do not assume three starting guards all receive lead-guard usage. He is a calculated upside pick after dependable shooting, not your only answer for assists."
        },
        {
          "name": "Josh Hart",
          "note": "Hart solves a problem that another scoring wing usually cannot. His 7.4 rebounds are substantial from a perimeter slot, and 4.8 assists with 1.9 turnovers keep the passing useful without adding another lead guard. He shot 50.8% FG, so those extra boards do not come with a shooting penalty from the field. His 72.0% FT needs context: on 1.9 attempts it is a manageable drag if the earlier picks supply accurate volume. The 12.0 points and 1.5 threes are modest, which makes him a much better fit after established scorers than on a team still chasing offense. Around the end of round eight, I would prioritize him when rebounding is the last major weakness."
        }
      ]
    },
    {
      "round": 9,
      "candidates": [
        {
          "name": "CJ McCollum",
          "note": "McCollum remains a practical way to add offense after the primary creators are gone. His 18.7 points and 2.5 threes came with 3.9 assists and 1.8 turnovers, so he can support the backcourt without needing to run the whole fantasy team. Atlanta re-signed him, but the workload alongside Daniels and the other creators still matters. His 45.5% FG and 77.2% FT on 3.1 attempts are the reason I would not treat him as an automatic percentage-friendly veteran. Powell gives you more scoring and stronger FT% at an earlier price; Quickley offers more assists. McCollum fits when your first picks have covered the percentages and the remaining need is points and shooting."
        }
      ]
    },
    {
      "round": 10,
      "candidates": [
        {
          "name": "Collin Gillespie",
          "note": "Gillespie lets you add threes and passing without another large turnover total. He made 2.9 triples and averaged 4.6 assists with 1.6 turnovers across 80 games, a useful late version of the contributions Pritchard offers earlier. The important difference is FG%: Gillespie shot 41.8% on 10.5 attempts. His 87.4% FT also came on only 1.1 attempts, so it cannot compensate for a weak team line by itself. Phoenix brought him back, but Booker and the other scorers keep the creation ceiling in perspective. I would take him near the tenth/eleventh-round turn for shooting and secondary assists, with enough efficient volume already secured to absorb the field goals."
        },
        {
          "name": "Ayo Dosunmu",
          "note": "Dosunmu offers a different kind of late guard help from the volume shooters. He made 51.7% of his field goals and 87.6% of his free throws, with 3.6 assists and 1.4 turnovers. That makes him appealing after Quickley or another guard whose shooting needs support. His 1.8 threes are useful, though he will not replace a missing high-volume shooter or steals specialist. Minnesota's Ball-Edwards backcourt creates competition for minutes and creation, so I would keep expectations tied to a supporting role. Around the tenth round, the existing efficiency is enough to make the case if the rotation gives him the floor time; there is little need to assume a breakout."
        },
        {
          "name": "Tre Jones",
          "note": "Jones is one of the few late passers who can improve FG% while adding assists. He averaged 5.4 assists with 1.4 turnovers and shot 55.3% on 9.5 attempts, making him a useful follow-up to a low-efficiency early guard. His 84.1% FT on 3.5 attempts helps as well. The tradeoff is 0.6 threes, so he fits a team that has already bought outside shooting. Giddey remains a major creator in Chicago; the argument is for Jones' existing supporting production, not a prediction that he takes over the offense. If percentages and assists are your remaining gaps, his price near 116 can make more sense than another wing who only adds threes. His hip absence also needs an availability check before you use him as an immediate passing fix."
        }
      ]
    },
    {
      "round": 11,
      "candidates": [
        {
          "name": "Saddiq Bey",
          "note": "Bey is useful when the roster still needs points and rebounding from a wing without another turnover burden. He averaged 17.7 points, 5.6 boards and 2.1 threes with only 0.9 turnovers, while 84.1% FT on 4.1 attempts adds meaningful support at the line. His 45.1% FG and modest steals keep him from being a complete late solution, but his limited blocks cost nothing here. Compared with Wallace, Bey does much more for offense and rebounds; Wallace is the specialist for a steals deficit. Near the tenth/eleventh-round turn, choose according to the category that is actually short rather than take another guard just because the build began on the perimeter."
        },
        {
          "name": "Cason Wallace",
          "note": "Wallace can make sense even when the rest of the team already has plenty of guards. Two steals with 0.9 turnovers give him a distinct job on a roster whose early scorers supplied little defense. His 8.6 points and 2.6 assists are too modest to repair an unfinished offense, and 43.2% FG still needs support despite the limited shot volume. Daniels provides more rebounds and passing at a much earlier price; Wallace is the cheaper way to address steals once those other categories are handled. I would use him near the end of round ten or early eleven when points and threes are healthy, instead of assuming the smallest scoring line is automatically unsuitable for a guard-focused build."
        },
        {
          "name": "DeMar DeRozan",
          "note": "DeRozan is a useful late choice when the team needs scoring and free throws more than another outside shooter. He averaged 18.1 points and 4.1 assists with only 1.2 turnovers, shooting 49.5% FG and 86.5% FT on 5.5 attempts. That is enough volume to support a weaker free-throw shooter elsewhere. Denver's offense will run through Jokić, so the new role could reduce some touches; the efficiency and ball security are the reasons to consider him. His 0.6 threes and 2.9 rebounds are real limitations. After several shooting guards and a dependable center, he can help the remaining categories; after a low-three opening, another scorer is not the same as the shooter you need."
        }
      ]
    },
    {
      "round": 12,
      "candidates": [
        {
          "name": "Cameron Johnson",
          "note": "Johnson is a late shooting option when the early frontcourt has already handled rebounds and passing. Denver does not need him to become a primary creator for that role to help, and giving up blocks costs this profile relatively little. Choose him for complementary offense rather than hoping the preseason makes him a steals specialist. Keep the pick flexible if regular-season minutes disappoint."
        },
        {
          "name": "Nikola Vučević",
          "note": "Vučević can still supply 8.4 rebounds, 3.3 assists and low turnovers, but Orlando's shared center minutes limit how much you should pay. Removing blocks helps the profile without creating more playing time. I would wait until the last rounds and check the rotation rather than chase the September ADP near 115. If you need boards immediately, a center with an established workload is a better answer than hoping the old scoring role follows him to a new team."
        },
        {
          "name": "Julian Champagnie",
          "note": "Champagnie's shooting and rebounding are useful late, but Harper's move into San Antonio's preseason starting group changes the minutes question. The previous fantasy role should not be carried forward automatically. Removing blocks does not protect you from a smaller workload, and the uncertain workload makes him a final-round option. Choose him only if threes and wing boards fit the last slot; do not treat him as a dependable starter just because the September price was earlier."
        },
        {
          "name": "Quentin Grimes",
          "note": "Grimes is a final-pick option for secondary passing and shooting if the Lakers give him a steady wing role. He averaged 13.4 points, 3.3 assists and 1.7 threes while shooting 84.0% FT, a usable supporting line without much dependence on blocks. Luka and Reaves will handle most of the creation, so a major usage increase is a poor basis for the pick. Our rank of {{rank}} is later than Yahoo ADP around 120; I would prefer a fall rather than chase him for the new team. He does more passing than Moody but supplies fewer threes and more turnovers. Let the last open category determine which of those profiles belongs on the roster."
        }
      ]
    }
  ],
  "faqs": [
    {
      "q": "Does punting blocks mean drafting as few centers as possible?",
      "a": "No. You still need rebounds and enough efficient shot volume to support the guards. Towns and Jokić are especially useful because their value comes from much more than blocks. A center who also blocks shots can still be the right pick; the question is whether the other categories justify the price."
    },
    {
      "q": "Can I keep both percentages competitive?",
      "a": "Yes, but evaluate attempts as well as rates. Duren's FG% helps on meaningful volume and costs FT% on meaningful volume too. Daniels has a much worse free-throw rate but takes relatively few attempts. An early source of accurate volume such as Shai, Reaves or Towns gives you more room to use those profiles. A big percentage on one attempt has much less influence."
    },
    {
      "q": "Should I avoid Derrick White because he blocks shots?",
      "a": "You do not have to avoid him, but losing 1.3 blocks removes an important part of what makes his price attractive. His 39.5% FG still counts against you. Bane offers stronger percentages at a similar draft stage, while Pritchard can supply comparable threes and assists later. White becomes more interesting if he falls or his remaining categories address a specific need."
    },
    {
      "q": "How should I use the last roster spots?",
      "a": "Check whether the unresolved problem is rebounds, shooting or steals before taking another guard. Hart and rebounding wings may do more than a points specialist if the frontcourt is thin. Wallace can help steals when scoring is secure. During weekly matchups, extra games can worsen percentages and turnovers, so stream toward a category you can actually change rather than fill every open slot automatically."
    },
    {
      "q": "Does this work in eight-category leagues?",
      "a": "Yes, but turnovers no longer separate the cleaner secondary guards from high-usage creators. Luka and Harden become easier to combine, while the relative appeal of a low-turnover specialist shrinks. Rebounds and shooting percentages still need the same care. Use an eight-category board before applying the nine-category draft ranges."
    }
  ]
}),

  // ---- Rankings ------------------------------------------------------------
  {
    slug: 'top-150',
    type: 'rankings',
    puntKey: null, // general draft board; punt-dependent players use their likely build price
    title: 'Top 150',
    season: CURRENT_GUIDE_SEASON,
    difficulty: 'Beginner',
    isPremium: false,
    tagline:
      '2026-27 nine-category draft ranks updated for preseason roles, injuries and schedule context, with corrected 2025-26 results kept separate from the forecast.',
    strengths: [],
    weaknesses: [],

    // This guide renders the 2026-27 projection (config/top-150-2026-27.js),
    // refreshed against corrected 2025-26 results. `projection` switches
    // Guide.jsx to <ProjectionList>.
    // All 150 ranks and write-ups are public.
    projection: {},

    sections: [
      {
        id: 'strategy',
        heading: 'What this ranking is',
        body: [
          "This is a nine-category draft board: points, threes, rebounds, assists, steals, blocks, field-goal percentage, free-throw percentage and turnovers all matter. Most players are placed for their projected overall value. For a player whose realistic drafter will punt a category, the rank reflects what that build can pay. The order is an editorial 2026-27 projection, not a simulated stat line.",
          "Giannis is the clearest example. His free throws pull down a balanced nine-category valuation, but a manager drafting him in the first round is almost certainly building around that weakness. Read his rank as a punt-FT% price. The player notes identify similar cases and explain when a balanced roster should wait longer.",
        ],
      },
      {
        id: 'method',
        heading: 'How the projection was built',
        body: [
          `The rankings use 2025-26 nine-category production as a baseline, with preseason participation, health and role informing the 2026-27 outlook. Yahoo public pre-ranks: ${YAHOO_PRERANK_DATE}; ADP snapshot: ${YAHOO_ADP_DATE}. Pre-rank describes draft-room ordering; ADP describes average selections. Neither determines our projections.`,
          "Field-goal and free-throw impact use makes and attempts, not percentage alone. Turnovers count too, so a high-volume creator can be valuable in points and assists while costing you a category. Each player's note names the season behind its exact numbers; the rank itself is the forward-looking call.",
          "Availability changes the order. A strong per-game line in a short season can still make a good pick, but the cost of missed games belongs in the draft decision. Players without a 2025-26 line use their earlier production with a larger uncertainty discount.",
          "Preseason minutes and participation can change confidence in a role or recovery. A hot shooting night cannot establish a new season-long percentage, and a routine rest absence is not a new injury. Re-evaluation dates are checkpoints, not promised returns. The price must reflect whether a player can contribute and how much waiting the roster can afford.",
        ],
      },
      {
        id: 'ranking-review',
        heading: 'Where category fit and risk shape the order',
        body: [
          "The October 13 comparison is a challenge to our assumptions, not an average of three rankings. RotoBaller's October 12 category guide and FantasyPros' six-expert draft consensus highlight disagreements worth investigating. Although the FantasyPros URL says rest-of-season, its page currently identifies the displayed data as 2026-27 draft rankings. Yahoo public pre-rank describes the room's ordering, not an independent projection or today's ADP.",
          "Participation helps assess the recovery risk for Tatum, Haliburton, Miller, Kessler and Irving. LaMelo and Trae supply scarce assists and threes, while Murray, Markkanen and Brown need prices that account for usage and availability. Queta and Hartenstein offer useful center categories without requiring a scoring breakout.",
          "Some disagreements remain intentional. Cade's turnovers still matter in nine-category play. Daniels' steals are more valuable in a compatible punt than on a balanced roster, while Knueppel's uncertain start still warrants a discount. Dejounte's toe absence warrants a discount despite his passing and steals. No consensus number overrides a current availability problem, and a Yahoo discount does not make a player intrinsically worse.",
          "Rookies such as Boozer, Wilson, Peterson, Dybantsa and Lendeborg are evaluated through college evidence, preseason roles and a wider range of outcomes. Harper and Murray-Boyles offer development upside; Cameron Johnson supplies complementary shooting. Butler and Porziņģis belong on the injury watchlist because their uncertain availability calls for a stash decision rather than an active roster plan.",
        ],
      },
      {
        id: 'schedule',
        heading: 'How the schedule affects the price',
        body: [
          "The NBA season runs October 20, 2026 through April 11, 2027. The release assigns 80 games per team, with two more determined through NBA Cup results. I have not treated unassigned games as missing season volume or projected an extra regular-season game for reaching the Cup final.",
          "For a concrete H2H example, the weeks March 8–14, March 15–21 and March 22–28 give Golden State 4/3/4 games and Philadelphia 3/4/4. Golden State has a back-to-back in each of those weeks; Philadelphia has them March 17–18 and March 23–24, plus March 8 follows a March 7 game. Those are scheduled opportunities, not guaranteed appearances by Curry, Butler, Embiid or LeBron. The examples use the official team schedule and must be rechecked for changes.",
          "Your league's actual playoff dates, lineup locks and games limits decide how much those differences matter. This remains a general draft board, not a ranking optimized for an assumed playoff window. Use schedule density and likely workload as tiebreakers within a tier, especially for players returning from injury; do not drop an otherwise better player several rounds solely for a particular March week. In roto, games caps can reduce the importance of team game counts without removing availability risk.",
        ],
      },
      {
        id: 'draft',
        heading: 'How to actually use it on draft day',
        body: [
          "Compare this projected rank with Yahoo ADP and pre-rank. A large gap can reveal a useful price, but check the player note before treating it as a bargain: health, a new team or a role change may explain the difference. ADP can move during camp, so the linked Yahoo pages are the source for the current draft room.",
          "As your roster takes shape, use category fit alongside the order. A punt-dependent player may be placed at his best-build price here; take him later if you are trying to win the category he gives away. A slightly lower-ranked player who supplies a category you can realistically win may help more than a duplicate source of points or threes.",
          "Once you know which category you are conceding, use the matching punt guide for the rest of the board. It removes that category from every player's calculation, which is more precise than this single list's selected build adjustments.",
        ],
      },
      {
        id: 'caveats',
        heading: 'What this list does not know',
        body: [
          "The board draws on player production, roles and availability, with Yahoo, RotoBaller and FantasyPros used as reference points. Dated sources accompany player notes; a missing injury mention is not medical clearance. Rookie college and preseason evidence is labeled separately from historical NBA results.",
          "Injury returns have the widest range of outcomes. Tyrese Haliburton, Kyrie Irving and Damian Lillard have no 2025-26 season line here; their notes use verified 2024-25 numbers and identify the recovery risk. A blank prior-season stat row does not mean a zero projection.",
          "The injury watchlist below the board is separate from the 150 draft recommendations. Butler and Porziņģis belong there because waiting through an uncertain absence is a different decision from filling an active roster spot. Extra injured-reserve capacity can make a stash worthwhile; the general board does not assume that capacity is free.",
        ],
      },
    ],

    faqs: [
      {
        q: 'Are these projections or last season\'s rankings?',
        a: 'Projections for 2026-27. Corrected 2025-26 numbers are the historical baseline, while Yahoo draft prices and roster context inform forward-looking adjustments. The stat pills show actual prior-season results, not projected 2026-27 averages.',
      },
      {
        q: 'Should I just draft straight down this list?',
        a: 'Use the order with Yahoo ADP and your roster needs. Punt-dependent players are placed at a price their best build can justify; take them later if you are trying to win the category they give away.',
      },
      {
        q: 'Why is a big scorer ranked below a player who averages far fewer points?',
        a: 'The ranking weighs the whole category profile, expected availability and, for build-dependent players, the price a likely punt team can justify. A scorer may give value back through turnovers or shooting impact, while another player adds steals, blocks or efficient volume.',
      },
      {
        q: 'Does this work for 8-cat leagues?',
        a: 'Mostly. If your league drops turnovers, high-usage playmakers are worth more than they appear here — anyone whose write-up flags turnovers as the main cost should move up a round or so.',
      },
      {
        q: 'How are incoming rookies ranked without an NBA baseline?',
        a: 'The board includes selected 2026 rookies using verified college and preseason evidence, role expectations and a wider uncertainty allowance. Those are editorial projections, not invented NBA averages. A missing prior-season stat card is expected for a rookie.',
      },
    ],
  },

  {
    slug: 'sleepers',
    type: 'rankings',
    puntKey: null,
    title: 'Sleepers',
    season: CURRENT_GUIDE_SEASON,
    difficulty: 'Intermediate',
    isPremium: false,
    // Freemium: six entries for anyone, the full shortlist with a free account.
    // Moved off the Draft Pass for 2026-27 because the punt guides now carry
    // the pass as originally intended (see PLANNED_GUIDES), and because these
    // two pages were the wrong thing to sell — they draw the draft-season
    // search intent ("fantasy basketball sleepers") but were converting nobody
    // at 1.5s average engagement. As a login gate they buy the one thing the
    // funnel is actually short of: accounts, created before the purchase
    // moment rather than during it.
    requiresLogin: true,
    tagline:
      'Fantasy basketball sleepers with useful categories, realistic draft prices and clear role risks.',
    strengths: [],
    weaknesses: [],

    // Unranked write-up list (config/sleepers-busts-2026-27.js).
    playerNotes: {
      source: 'sleepers',
      accent: '#2e9e53',
      // Six public entries regardless of the shortlist length.
      //
      // Six public entries make this a useful list; a free account opens the
      // remaining write-ups.
      //
      // rosterBlock() in seo-content.js reads this number rather than copying
      // it, so the crawlable block ships exactly the six a logged-out visitor
      // sees, plus the remaining count and free-account requirement. Never hand a crawler
      // the locked remainder — that is cloaking.
      freeLimit: 6,
      previewRows: 2,
      heading: 'The sleepers',
      lead:
        `For standard 12-team, nine-category drafts. Yahoo pre-ranks: ${SLEEPERS_YAHOO_PRERANK_DATE}; ADP snapshot: ${SLEEPERS_YAHOO_ADP_DATE}. Ranks come from our Top 150; stat pills show 2025-26 results. Use the buying ranges alongside your roster's needs and the price in your room.`,
    },

    sections: [
      {
        id: 'strategy',
        heading: 'What a sleeper actually is',
        body: [
          "A sleeper is a player whose useful production can cost less than it should in your draft room. These candidates combine a plausible role with categories worth buying at the stated range. A gap between Yahoo's ordering and our Top 150 is a starting point for that decision, not proof of a bargain.",
          "Some gaps reflect healthy skepticism about missed games or a crowded rotation. Others persist because draft rooms lag behind a player's changed role or overlook categories such as steals, blocks and low turnovers. The notes identify the risk instead of treating every gap as a guaranteed bargain.",
        ],
      },
      {
        id: 'draft',
        heading: 'How to use this list',
        body: [
          "Choose the kind of value your roster needs. Kevin Porter Jr. is a risky assists-and-steals pick, Norman Powell supplies scoring, Brandin Podziemski contributes across several categories, Tari Eason offers bench-role upside, and Draymond Green fits teams that already have enough points. Their weaknesses matter as much as the discount.",
          "Quickley, Bane, Michael Porter Jr. and Sarr offer established category production. Their current pre-ranks leave room relative to our board, although the gap is modest for Bane and Quickley. Use the buying range rather than reaching to our projected rank. ADP is historical where available; no average is invented for Green. Give role evidence more weight than preseason shooting percentages.",
        ],
      },
      {
        id: 'shortlist-changes',
        heading: 'When a promising player is not a bargain',
        body: [
          "Good players are not necessarily sleepers. Yahoo places Jamal Murray, Lauri Markkanen and Austin Reaves prominently enough that you should expect to pay for their production. Murphy, White, Daniels, Alexander-Walker, Okongwu and Rollins also attract draft-room attention. Treat an actual fall as an opportunity, not something the roster plan depends on.",
          "Sheppard's shooting is interesting, but Yahoo's pre-rank of 56 asks for more than our projection. Suggs' unresolved illness weakens the immediate buying case. Either could make sense at a sufficient discount; neither deserves a reach simply because the category upside is attractive.",
          "A possible rotation opening does not automatically create a bargain. Black's ankle-related absence requires more reassurance than a practice update, while Maluach's Yahoo position already carries a substantial development premium. Apply the same price and availability checks to speculative players as to established starters.",
        ],
      },
      {
        id: 'caveats',
        heading: 'What this list does not know',
        body: [
          `News and Yahoo public pre-ranks: ${SLEEPERS_UPDATED_AT}. ADP snapshot: ${SLEEPERS_YAHOO_ADP_DATE}. Public pre-rank differs from Yahoo expert rank and custom league ordering. The stat line shows 2025-26 results; the Top 150 and buying ranges express the forward-looking draft advice.`,
        ],
      },
    ],

    faqs: [
      {
        q: 'How are these different from the top 150?',
        a: 'The top 150 projects 2026-27 value using corrected 2025-26 results as its statistical baseline. This list is about the gap between projected value and draft cost; a player may appear in both, but the lists answer different questions.',
      },
      {
        q: 'How many sleepers should I actually draft?',
        a: 'There is no quota. Match the category need and actual price, and avoid stacking uncertain rotations or availability bets. A smaller shortlist is better than labeling every possible draft fall a sleeper.',
      },
      {
        q: 'Why does Yahoo pre-rank sometimes disagree with ADP?',
        a: 'Public pre-rank is an ordering, while ADP summarizes selections from drafts. They are different signals, and these snapshots have different dates. September ADP may understate today’s cost after preseason news. Use your live room rather than assume a player will last to that average.',
      },
    ],
  },

  {
    slug: 'busts',
    type: 'rankings',
    puntKey: null,
    title: 'Busts',
    season: CURRENT_GUIDE_SEASON,
    difficulty: 'Intermediate',
    isPremium: false,
    // Freemium, same reasoning as the sleepers list above.
    requiresLogin: true,
    tagline:
      'Twelve draft risks to weigh against price, category fit and availability.',
    strengths: [],
    weaknesses: [],

    playerNotes: {
      source: 'busts',
      accent: '#c0392b',
      // Gated at 5 of 12 from the 2026-27 draft season on — same reasoning as
      // the sleepers list above: the punt guides that were meant to carry the
      // pass do not exist yet. Five free entries keeps the page a real list for
      // "fantasy basketball busts"; the other seven come with the pass, and
      // rosterBlock() in seo-content.js mirrors the split into the crawlable
      // HTML automatically.
      freeLimit: 5,
      previewRows: 2,
      heading: 'The busts',
      lead:
        `For standard 12-team, nine-category drafts. Yahoo pre-ranks: ${BUSTS_YAHOO_PRERANK_DATE}; ADP snapshot: ${BUSTS_YAHOO_ADP_DATE}. Ranks come from our Top 150; stat pills show 2025-26 results. These are price and roster-fit cautions, not a do-not-draft list.`,
    },

    sections: [
      {
        id: 'strategy',
        heading: 'What "bust" means here',
        body: [
          "A bust here is a player who could disappoint at an aggressive draft price, not someone we expect to have a bad NBA season. September ADP identified the original price concerns; it does not prove those prices still exist. Several current Yahoo pre-ranks are already later than our own valuations, so the same player can be overpriced in one room and a bargain in another.",
          "The risks differ: high-volume percentage damage, competition for usage, limited category coverage, or uncertain availability. The October review softens the Davis and Lillard warnings after preseason participation. Sabonis and Kessler have encouraging practice updates, but practice participation is not the same as game clearance. Rest absences are not treated as new injuries.",
        ],
      },
      {
        id: 'draft',
        heading: 'How to use this list',
        body: [
          "Read each tag as a buying range in a twelve-team league, not a prediction of availability. Compare it with the actual pick you would spend. Brown or Banchero can become attractive if their prices fall far enough. Davis is a calculated fifth-round health risk, while Lillard is a seventh- or eighth-round option for a roster with dependable starters.",
          "A punt changes which weaknesses matter, but it does not fix missed games. Castle's turnover cost disappears in eight-category formats; Siakam becomes more appealing when FT% is excluded. Keep those format differences separate from the balanced nine-category board, and do not count a favorable build adjustment twice. One hot or cold exhibition is much weaker evidence than a full-season category profile.",
        ],
      },
      {
        id: 'caveats',
        heading: 'What this list does not know',
        body: [
          `News and Yahoo public pre-ranks: ${BUSTS_UPDATED_AT}. ADP snapshot: ${BUSTS_YAHOO_ADP_DATE}. Public pre-rank differs from expert rank and custom league ordering. Historical results, the Top 150 projection and buying advice answer different questions. Lillard's last played season was 2024-25, not 2025-26.`,
        ],
      },
    ],

    faqs: [
      {
        q: 'Are you saying these players are bad?',
        a: 'No. These are conditional objections to expensive draft positions. September ADP supplies historical context, while the notes use October preseason news and updated pre-ranks. If the actual price falls enough, a player on this list can become a good pick.',
      },
      {
        q: 'Why can a punt-friendly player still be a bust?',
        a: 'Removing a weak category can improve a player’s fit, but availability and role uncertainty remain. Compare the cost with your actual build rather than assuming a punt removes every concern. These calls are for nine-category leagues; other formats can change the answer.',
      },
      {
        q: 'What if one of these players falls to me late?',
        a: 'Compare his new price with the wait-until round and your roster fit. Every bust case here is a price objection, so a large enough fall can make him a good pick.',
      },
    ],
  },

  // Written punt builds, one file per season — see config/punt-guides-2026-27.js.
  // They live outside this file because each runs 200+ lines and several of them
  // would bury the four rankings guides above.
  ...PUNT_GUIDES,
];

// ---------------------------------------------------------------------------
// PLANNED — deliberately NOT in `guides`, so nothing renders and nothing links
// here.
// ---------------------------------------------------------------------------
// These builds were listed on /guides with a Premium lock badge while holding no
// prose, no board and no example teams — a paywall in front of an empty page,
// on the most-searched build in 9-cat (punt FT) among others. Unlisting them is
// not a demotion of the plan; it is refusing to sell what is not written.
//
// To ship one: add its complete config to punt-guides-2026-27.js, remove its
// planned entry, and add the route and crawlable copy to the SEO config files.
export const PLANNED_GUIDES = [
  { slug: 'punt-steals',     type: 'punt', puntKey: 'stl', title: 'Punt Steals',      season: CURRENT_GUIDE_SEASON, difficulty: 'Advanced',     isPremium: true,  tagline: 'Ignore the noisiest category.',        strengths: ['pts', 'reb', 'blk', 'fg'], weaknesses: ['stl'] },
];

// How much of a guide a signed-out visitor actually gets. DERIVED from the
// gating rather than hand-set, because a badge that is maintained separately
// from the paywall eventually lies about it:
//
//   'free'    nothing is held back — the whole guide renders for everyone
//   'login'   the whole guide renders, but only once you have an account
//   'partial' the page opens and then stops; the rest needs a Draft Pass
//   'premium' the guide is behind the pass outright
//
// The rule that matters: "Free" is reserved for guides where it is true of the
// entire page. A guide showing you the first six of fifteen is not free, and
// labelling it that way spends trust to save a word. 'login' costs no money but
// it is still a gate, so it gets its own badge rather than borrowing "Free".
//
// Order is significant: a guide flagged both premium and requiresLogin is a
// paid guide — money is the higher bar, and quoting the lower one would promise
// access the reader will not get.
export function guideAccess(guide) {
  if (guide.isPremium) return 'premium';
  if (guide.requiresLogin) return 'login';
  const limits = [guide.playerNotes, guide.projection, guide.board]
    .filter(Boolean)
    .map((x) => x.freeLimit);
  return limits.some((n) => Number.isFinite(n)) ? 'partial' : 'free';
}

// What actually opens a given guide. Kept next to guideAccess() so the tier and
// the key that unlocks it cannot drift: a 'login' guide must never be gated on
// a pass, and a paid guide must never open on a bare sign-in.
export function isGuideUnlocked(guide, { isSignedIn, hasDraftPass }) {
  return guideAccess(guide) === 'login' ? Boolean(isSignedIn) : Boolean(hasDraftPass);
}

// The class every gated region on a guide carries, and the selector quoted to
// Google in the paywalled-content markup (structured-data.js). It lives here
// rather than in either consumer because it has to mean the same thing in two
// places at once: if the DOM and the JSON-LD disagree about which part of the
// page is gated, the markup stops describing the page and starts misreporting
// it. Google accepts ONLY `.class` selectors here, so this must stay a bare
// class name with no element or attribute qualifiers.
export const GATED_CLASS = 'fgg-gated';
export const GATED_SELECTOR = `.${GATED_CLASS}`;

// Badge copy and colour per access level, kept here so the hub cards and the
// guide hero cannot drift apart.
//
// Two badges, not three. 'partial' and 'premium' differ in how much of a page
// is held back, but from the reader's side they are the same thing — one $15
// Draft Pass opens both — so giving them separate labels only invites the
// question of what "Premium" is and whether it costs extra.
//
// Blue, not red or amber. This badge is the first thing a reader sees on a
// guide they might buy, and it should read as an invitation to click rather
// than a warning not to. It is the same blue as the primary CTA buttons.
const DRAFT_PASS_BADGE = { label: 'Draft Pass', color: '#2f80ed', locked: true };

export const ACCESS_BADGE = {
  free: { label: 'Free', color: '#27ae60', locked: false },
  // Teal rather than the plain-free green, so a reader can tell at a glance on
  // the hub which cards open on a click and which want an account first. Still
  // says "Free", because it is — the account is the price, and it is not money.
  login: { label: 'Free — sign in', color: '#16a085', locked: true },
  partial: DRAFT_PASS_BADGE,
  premium: DRAFT_PASS_BADGE,
};

export const guideBySlug = Object.fromEntries(guides.map((g) => [g.slug, g]));

// Grouping for the hub page. Both groups read from `guides`, so a guide appears
// on the hub only once it is actually written — PLANNED_GUIDES cannot leak in.
export const guideGroups = [
  {
    id: 'rankings',
    title: 'Rankings & Draft Prep',
    blurb:
      '2026-27 9-category projections based on corrected 2025-26 results, plus sleepers and busts whose projected value differs from draft cost.',
    guides: guides.filter((g) => g.type === 'rankings'),
  },
  {
    id: 'punt',
    title: 'Punt Guides',
    blurb:
      'Give up one column on purpose and dominate the rest. Each build comes with a live draft board re-ranked with that category removed.',
    guides: guides.filter((g) => g.type === 'punt'),
  },
];
