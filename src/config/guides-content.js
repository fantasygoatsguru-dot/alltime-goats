// Explicit .js extension: scripts/prerender.js reaches this file under plain
// Node ESM (via structured-data.js), which does not resolve extensionless paths.
import { CONTENT_SEASON } from './season.js';
import { PUNT_GUIDES } from './punt-guides-2026-27.js';

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
  {
  "slug": "punt-blocks",
  "type": "punt",
  "puntKey": "blk",
  "title": "Punt Blocks",
  "season": CURRENT_GUIDE_SEASON,
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
        "Your draft position changes the opening. Towns goes near pick 15 by Yahoo ADP, making him a realistic partner for a guard taken at the first-round turn. He is much less likely to be there after a top-four pick. Jokić managers can use the next turn for guard production; Shai managers should make a plan for the rebounder actually available, rather than assume the ideal center falls a full round.",
        "The middle rounds are where the team needs should break ties. Bane's percentages and dependable recent workload can be more useful here than White's blocks, which you would discard. Hart adds much more rebounding than McDaniels at a similar draft stage. Sabonis is a natural category fit, but a 19-game season and Yahoo ADP near 27 still make him a risk against our overall rank of 39. The punt improves a profile; it does not guarantee that the market price is right.",
        "Written targets use the September 26 Yahoo ADP snapshot and standard pre-ranks checked October 3, alongside our 2026-27 Top 150. The two Yahoo numbers can disagree, so expect some players to leave before their listed round. The live board removes blocks from corrected 2025-26 production. Sample-team totals combine those per-game lines with equal games for each player, weighting percentages by makes and attempts. They are a check on the construction before health, role changes and weekly schedules affect the result."
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
      "note": "Jokić supplies the efficient rebounding that makes this backcourt possible. Murray and Fox add creation, Murphy and Anunoby cover shooting and steals, and Hart adds boards from the wing. The eight historical lines total 162.0 points, 53.5 rebounds, 42.1 assists and 17.7 threes at 49.1% FG and 83.2% FT. Turnovers reach 17.5, so the later picks should favor ball security rather than another lead guard. Bam helps the boards, but his 44.2% shooting is why the team cannot assume FG% is dominant. From pick one, the turns are 1, 24, 25, 48, 49, 72, 73 and 96. Murphy must fall roughly eight picks from ADP and Anunoby about five; this path needs those modest discounts and is less likely in rooms that follow their earlier default ranks."
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
      "note": "Towns and Duren protect rebounds while Mitchell and Bane provide accurate free-throw volume. Daniels and Hart add passing and boards without another high-usage guard, and Bridges keeps turnovers down. These eight historical lines combine for 147.3 points, 54.7 rebounds, 33.0 assists and 10.1 steals at 50.8% FG and 82.5% FT, with 15.7 turnovers. Threes are the next priority at 13.7 across the group. From pick 12, the turns are 12, 13, 36, 37, 60, 61, 84 and 85. Bane needs to slide about seven picks, and Hart at 85 is an intentional reach of roughly eleven picks to address rebounding. Mitchell may go much earlier in a room that shares our Top 150 valuation, so the opening is conditional on a draft closer to Yahoo ADP."
    }
  ],
  "roundTargets": [
    {
      "round": 1,
      "candidates": [
        {
          "name": "Nikola Jokić",
          "yahooAdp": 1.9,
          "yahooPreRank": 1,
          "note": "The easiest opening for this build because he solves the problems a guard-heavy draft usually creates. Jokić supplied 12.9 rebounds and 56.9% FG on 17.4 attempts, while his 10.7 assists let you spend later guard picks on shooting or steals instead of chasing another primary creator. Losing his 0.8 blocks is a relatively small cost beside the rest of that production. His 83.1% FT also comes on enough volume to support a weaker shooter later. The category that still needs care is turnovers: at 3.7 a game, he makes Bridges, Pritchard and other efficient secondary passers particularly appealing. You can build a strong backcourt around him without taking a lead guard at every opportunity."
        },
        {
          "name": "Shai Gilgeous-Alexander",
          "yahooAdp": 4.1,
          "yahooPreRank": 2,
          "note": "Shai gives a perimeter-first team an unusual advantage in both percentages. He shot 55.3% on 19.4 field-goal attempts and 87.9% on nine free throws, enough volume to shape the whole roster. His 31.1 points and 6.6 assists come with only 2.2 turnovers, which leaves more room to choose another creator than a Luka opening does. The missing contribution is rebounding: 4.3 boards means you cannot simply keep drafting guards and expect the frontcourt to take care of itself. Towns is an excellent theoretical partner, but his ADP around 15 means he is unlikely to reach Shai's next turn. Be ready to address boards through the available center and a rebounding wing rather than assuming that pairing."
        },
        {
          "name": "Luka Dončić",
          "yahooAdp": 3.5,
          "yahooPreRank": 5,
          "note": "Luka is the most direct route to a large points, threes and assists advantage. His 33.4 points, four threes, 8.2 assists and 7.7 rebounds give you plenty to build around even when the 0.5 blocks disappear. The difficult part is protecting the less visible categories. He shot 47.6% on 22.7 attempts and 78.0% on ten free throws, so both percentages depend on what follows. Four turnovers also make another high-usage passer a more expensive choice than his assist total suggests. Towns or an efficient rebounder can help the frontcourt; Bane and low-turnover wings can keep the perimeter strong. Luka works here, but he needs a more deliberate finish than Shai."
        },
        {
          "name": "Donovan Mitchell",
          "yahooAdp": 13.8,
          "yahooPreRank": 8,
          "note": "Mitchell gives you a realistic way into the build near the first-round turn. His 27.9 points, 3.2 threes and 1.5 steals come with 48.3% FG and 86.5% FT, so the scoring does not require accepting a major percentage weakness. He offers less passing than Harden, but 5.7 assists are a useful start, and the 0.3 blocks cost little to remove. Our Top 150 places him fifth against Yahoo ADP near 14; a room using the stronger valuation may take him well before your turn. If he reaches you, Towns is an attractive next pick because Mitchell's 4.5 rebounds need support. That pairing can establish the offense without sacrificing the center categories you still want to win."
        }
      ]
    },
    {
      "round": 2,
      "candidates": [
        {
          "name": "Karl-Anthony Towns",
          "yahooAdp": 15,
          "yahooPreRank": 11,
          "note": "Towns is the early center whose main weakness fits the plan. His 0.5 blocks no longer matter, leaving 11.9 rebounds, 50.1% FG and 85.8% FT on 5.5 attempts. That free-throw volume is what separates him from the usual rebounding center: he can strengthen the line while filling a position many guard-heavy teams struggle to cover. His 1.5 threes help too, although they are not enough to treat him as a substitute for a high-volume shooter. The 2.5 turnovers remain a cost. Around the first/second-round turn, I particularly like him beside Mitchell or another scoring guard; managers picking near the very top should not count on him surviving until their second selection."
        },
        {
          "name": "Jamal Murray",
          "yahooAdp": 20.5,
          "yahooPreRank": 9,
          "note": "Murray supplies enough of the difficult guard categories to make an early center pick easy to live with. He averaged 25.4 points, 3.3 threes and 7.1 assists across 75 games, with 88.7% FT and only 2.3 turnovers. That last number matters: he gives you considerably more passing than many wings without the turnover rate of Harden. Denver's addition of DeRozan could reduce some of his scoring opportunities, so the appeal is the established shooting and creation rather than another usage jump. After Jokić, he reinforces the backcourt while the first pick already covers rebounds. After Shai, I would like the guard pairing but make the next frontcourt selection a priority."
        },
        {
          "name": "Austin Reaves",
          "yahooAdp": 22.3,
          "yahooPreRank": 17,
          "note": "Reaves offers accurate shooting on meaningful volume, which becomes more important as you add guards. He shot 48.7% FG and 86.8% FT on 7.1 attempts at the line, with 22.9 points and 5.5 assists. LeBron's departure creates room for more creation beside Luka, but last season's 51 games mean the upside also depends on availability. The 2.9 turnovers are a reason to avoid treating him as a completely clean second guard. Compared with Murray, you get less proven passing and outside shooting; compared with many lower-efficiency scorers, the percentages are easier to support. Our rank of 12 against Yahoo ADP near 22 makes the opportunity attractive when the first pick has a dependable workload."
        },
        {
          "name": "Jalen Brunson",
          "yahooAdp": 21.9,
          "yahooPreRank": 42,
          "note": "Brunson fits the punt because you are giving up almost nothing in blocks. His 26.0 points and 6.8 assists came with 2.4 turnovers across 74 games, a useful combination of creation and recent availability. The limitation is on the rest of the counting stats: 3.3 rebounds and 0.8 steals leave more work for the next selections. Murray supplies more threes and assists at a similar Yahoo price, so I would generally prefer him if both are available. Brunson makes sense when you need another established scorer and can pair him with a rebounder and a defensive wing. His ADP near 22 is earlier than our overall rank of 31; the build improves his fit, but it does not erase the price difference."
        }
      ]
    },
    {
      "round": 3,
      "candidates": [
        {
          "name": "Bam Adebayo",
          "yahooAdp": 30.1,
          "yahooPreRank": 30,
          "note": "Bam's ten rebounds, 3.2 assists and 1.2 steals are useful contributions from center, and you give up little by removing his 0.7 blocks. The important caution is FG%. He shot 44.2% on 15.7 attempts, so he cannot be the efficient big expected to repair a run of guards. His 77.8% FT on 5.8 attempts also needs support if the line is meant to be a strength. Giannis' arrival changes Miami's shot distribution; easier looks are possible, but an efficiency rebound should be treated as upside rather than assumed. I prefer Bam after Jokić or Shai, where accurate volume is already established. After Harden, the same selection could make both shooting percentages harder to manage."
        },
        {
          "name": "James Harden",
          "yahooAdp": 35.1,
          "yahooPreRank": 49,
          "note": "Harden can give you an assist and free-throw foundation in one pick. His 7.9 assists came with three threes and 88.2% FT on 7.4 attempts, so the percentage contribution is substantial. Cleveland now has him sharing the offense with Mitchell, which limits the case for simply projecting his old usage upward. More importantly, 43.2% FG and 3.5 turnovers remain real costs after blocks are removed. A Shai start gives you room to consider that trade; a Luka start makes it much harder to protect both categories. I would take Harden when creation and accurate free-throw volume are the needs, then favor an efficient rebounder and lower-turnover wings with the next picks."
        },
        {
          "name": "Kawhi Leonard",
          "yahooAdp": 29.3,
          "yahooPreRank": 15,
          "note": "Kawhi supplies the kind of scoring that makes a punt-blocks team easier to balance. He averaged 27.5 points and 1.8 steals while shooting 50.8% FG and 88.8% FT, with only two turnovers. The 6.2 rebounds are also more helpful than another small guard's contribution. Toronto's addition of him changes the role beside Barnes, so the full scoring line should not be copied forward without adjustment. Age and availability remain the larger risks after a 65-game season. Our rank of 14 against Yahoo ADP near 29 leaves room for that uncertainty, but I would be less comfortable adding him after another early injury gamble. When the roster can carry the risk, the percentages and steals are an excellent fit."
        },
        {
          "name": "Jalen Duren",
          "yahooAdp": 36,
          "yahooPreRank": 28,
          "note": "Duren is worth considering even though his clearest home is a free-throw punt. His 65.0% FG on 11.5 attempts and 10.5 rebounds can repair two of this build's common weaknesses, while 19.5 points keep the offense useful. You are not paying primarily for his 0.8 blocks. The tradeoff is 74.7% FT on 6.1 attempts, enough volume that the surrounding guards need to be strong at the line. Towns is the easier balanced fit; Duren is the more powerful FG% choice once accurate free-throw volume is already secured. I would consider him near his late-third-round price after Shai or a Mitchell-Towns opening, with a clear plan to buy threes afterward."
        },
        {
          "name": "Domantas Sabonis",
          "yahooAdp": 27,
          "yahooPreRank": 38,
          "note": "The category fit is obvious: Sabonis supplies rebounds and passing while contributing almost no blocks. The latest season is much less reassuring as a projection base. He played only 19 games, averaging 11.4 rebounds and 4.1 assists, with 54.3% FG and 72.7% FT. His earlier passing ceiling is appealing, but a return to that level needs to be earned through health and workload rather than assumed. Yahoo's ADP near 27 is ahead of our rank of 39, so I would want some room in the price or a particularly strong need for boards and center assists. He also adds little shooting and 2.7 turnovers. A good punt fit does not make all of those costs disappear."
        }
      ]
    },
    {
      "round": 4,
      "candidates": [
        {
          "name": "Trey Murphy III",
          "yahooAdp": 40.1,
          "yahooPreRank": 22,
          "note": "Murphy is an excellent complement to an early passer because he improves shooting and steals without adding many turnovers. He made 3.2 threes and averaged 1.5 steals, with 21.5 points and only 1.8 turnovers. His 5.7 rebounds also give you more frontcourt support than a pure shooting guard. The 88.6% FT helps on 3.7 attempts, while 47.0% FG is manageable beside an efficient first pick. You lose only 0.4 blocks here, so most of his value remains useful. Our Top 150 ranks him 24th against Yahoo ADP near 40. I would be willing to take him before the end of round four rather than assume that gap survives another turn."
        },
        {
          "name": "Lauri Markkanen",
          "yahooAdp": 38.7,
          "yahooPreRank": 18,
          "note": "Markkanen gives you scoring and shooting from a big roster slot without the turnover cost of another lead guard. His 26.6 points, 2.7 threes and 89.6% FT on 6.4 attempts came with only 1.5 turnovers. That is a valuable combination after Luka or Harden. The 6.8 rebounds help, but they do not replace a true rebounding center if the opening has been all guards. He played 42 games, and Utah's additional frontcourt scoring makes another season at the same usage uncertain. Our rank of 20 is well ahead of his ADP near 39 because the per-game production is strong. I would still pair him with dependable availability rather than turn the whole draft into a health bet."
        }
      ]
    },
    {
      "round": 5,
      "candidates": [
        {
          "name": "Desmond Bane",
          "yahooAdp": 52.9,
          "yahooPreRank": 44,
          "note": "Bane is the guard I would look for when the early picks already supply creation and the roster needs dependable scoring and percentages. He played all 82 games, averaged 20.1 points and 4.1 assists, and shot 48.3% FG with 90.8% FT on 4.2 attempts. His two turnovers are manageable for that workload. White offers more blocks, but that advantage has no value in this build; Bane's much stronger FG% becomes the more useful distinction. He gives you two threes rather than the volume of Murphy, so the choice depends on whether shooting quantity or overall efficiency is the priority. Around the fifth round, he fits particularly well after a riskier early selection."
        },
        {
          "name": "Franz Wagner",
          "yahooAdp": 53.2,
          "yahooPreRank": 39,
          "note": "Wagner is a useful way to add scoring without another guard-sized rebounding line or a large turnover total. His 20.6 points came with 5.2 boards, 48.1% FG and 1.7 turnovers. The concern is availability after only 34 games, which is why this is a fifth-round decision rather than a straightforward early pick. His 1.4 threes also mean he will not repair a major shooting shortage on his own. I prefer Bane when the roster needs dependable games and stronger free-throw support; Wagner is more appealing when the forward slot and rebounding matter. After an injury-risk opening, I would be cautious about adding another player whose projection needs a large improvement in games played."
        },
        {
          "name": "Keyonte George",
          "yahooAdp": 56.3,
          "yahooPreRank": 121,
          "note": "George supplies real free-throw impact as well as scoring. His 89.1% FT came on seven attempts, alongside 23.5 points and 6.1 assists, so he can support a weaker-shooting big more effectively than a high-percentage guard who rarely reaches the line. The price is 45.9% FG and 3.1 turnovers, plus a 54-game season. Utah has also added Peterson to the backcourt, creating competition for some of the ballhandling. I would consider George when points, assists and FT% are all needs, with enough efficient volume already in place. After Luka or Harden, the turnover total makes a cleaner guard more attractive. His fifth-round ADP is reasonable only if those particular contributions improve the whole team."
        }
      ]
    },
    {
      "round": 6,
      "candidates": [
        {
          "name": "OG Anunoby",
          "yahooAdp": 66.6,
          "yahooPreRank": 60,
          "note": "Anunoby gives this build steals without forcing you to draft another primary creator. His 1.6 steals come with 2.3 threes, 48.4% FG and 1.8 turnovers, so he can strengthen the perimeter while leaving the offense to your early picks. You discard 0.7 blocks, but enough of the line remains useful. The 5.2 rebounds help a little; the 2.2 assists will not solve a shortage of passing. Compared with Daniels, Anunoby is the easier shooting fit and the weaker source of rebounds and assists. I like him after an opening that already has two creators, especially if adding another high-usage guard would put turnovers beyond reach. His 67 games keep availability part of the decision."
        },
        {
          "name": "Dyson Daniels",
          "yahooAdp": 62.9,
          "yahooPreRank": 20,
          "note": "Daniels is a useful antidote to a guard-heavy opening that has become short of rebounds and steals. He gave you 6.8 boards, 5.9 assists and two steals with only 1.8 turnovers, while 51.7% FG helps the percentage rather than undermining it. The shooting limitations need different treatment: 0.3 threes is a major gap, whereas 61.5% FT came on only 1.6 attempts and can be supported by accurate volume elsewhere. Bane and Daniels together shot about 82.7% with equal games and attempts properly weighted. I prefer Daniels when the earlier picks already shoot; if they include several non-shooters, Anunoby may do more for the categories that remain close."
        },
        {
          "name": "Tyler Herro",
          "yahooAdp": 68.8,
          "yahooPreRank": 48,
          "note": "Herro is appealing when the team needs shooting and has already covered defense. He supplied 20.5 points and 2.5 threes while making 91.7% of his free throws, with 48.0% FG keeping the scoring reasonably efficient. His move to Milwaukee creates an opportunity for offense, but only 33 games last season makes health a large part of the bet. He also adds limited steals, so choosing him after several score-first guards can leave that category thin. Bane offers the more reassuring recent workload; Herro is the later upside choice when your early picks are dependable and a defensive wing is already in place. I would not assume that a new team automatically produces a larger, healthier season."
        }
      ]
    },
    {
      "round": 7,
      "candidates": [
        {
          "name": "Mikal Bridges",
          "yahooAdp": 79.6,
          "yahooPreRank": 41,
          "note": "Bridges is valuable when the first few rounds have already supplied the scoring and the turnover count is climbing. His 3.7 assists came with only one turnover, alongside 1.3 steals, 1.9 threes and 49.0% FG. He played all 82 games, a useful recent record after a Kawhi or Markkanen pick. You lose his 0.8 blocks here, so he is less of a specialist bargain than in a build that keeps every defensive category. The rest of the line still fits without asking you to change direction. Anunoby gives you more steals and threes; Bridges offers more passing and cleaner possessions. Around pick 80, that can be the better use of a wing slot than another scorer."
        },
        {
          "name": "Payton Pritchard",
          "yahooAdp": 79.6,
          "yahooPreRank": 33,
          "note": "Pritchard gives you much of the guard production this build wants while contributing almost nothing in the category you are removing. He made 2.7 threes and averaged 5.2 assists with 1.4 turnovers and only 0.1 blocks. That makes him especially attractive compared with paying several rounds more for White and then discarding White's rim protection. His 46.3% FG still needs support, and 89.0% FT on 1.7 attempts is helpful rather than enough to carry the line. Boston's changed offense may trim some creation, so I would value a repeat of the supporting role rather than another usage increase. After an early scoring guard and a rebounding big, he can finish the passing without making turnovers worse."
        },
        {
          "name": "De'Aaron Fox",
          "yahooAdp": 80.1,
          "yahooPreRank": 85,
          "note": "Fox is useful when you need assists but cannot afford another serious FG% penalty. His 6.2 assists came with 48.6% shooting and 2.3 turnovers, a more manageable balance than several earlier lead guards. He also made 1.8 threes, so the shot distribution is not as restrictive as a non-shooting passer's. The 76.0% FT on 3.4 attempts is the cost to check, especially if the frontcourt already includes Duren or Bam. Pritchard is the better shooting-and-ball-security option; Fox adds more scoring, assists and steals. Sharing San Antonio's creation with Castle and Wembanyama limits the case for a scoring rebound. I would use him to fill a specific passing gap around his seventh-round price."
        }
      ]
    },
    {
      "round": 8,
      "candidates": [
        {
          "name": "Josh Hart",
          "yahooAdp": 96.3,
          "yahooPreRank": 68,
          "note": "Hart solves a problem that another scoring wing usually cannot. His 7.4 rebounds are substantial from a perimeter slot, and 4.8 assists with 1.9 turnovers keep the passing useful without adding another lead guard. He shot 50.8% FG, so those extra boards do not come with a shooting penalty from the field. His 72.0% FT needs context: on 1.9 attempts it is a manageable drag if the earlier picks supply accurate volume. The 12.0 points and 1.5 threes are modest, which makes him a much better fit after established scorers than on a team still chasing offense. Around the end of round eight, I would prioritize him when rebounding is the last major weakness."
        },
        {
          "name": "Jaden McDaniels",
          "yahooAdp": 89.2,
          "yahooPreRank": 43,
          "note": "McDaniels can still help a punt-blocks roster, but I would choose him for a specific reason rather than automatically carry over his value from another build. His one block disappears, leaving 51.5% FG, 83.5% FT, 1.1 steals and 1.4 threes. Those percentages are useful after a low-efficiency guard, while the 4.2 rebounds and 2.7 assists are more modest contributions. Hart does much more for rebounding and passing at a similar draft stage. McDaniels is the choice when those categories are already covered and the wing slot needs efficient scoring and steals. Minnesota's new backcourt may change his shot opportunities, but defense remains the reason to expect him to earn minutes."
        },
        {
          "name": "Norman Powell",
          "yahooAdp": 92.4,
          "yahooPreRank": 115,
          "note": "Powell is one of the later ways to buy a meaningful scoring contribution. His 21.7 points and 2.7 threes came with 47.0% FG and 82.7% FT on 5.5 attempts, so the line supplies more than empty shot volume. Chicago signed him after his Miami season, and the new offense gives him an opportunity without guaranteeing the same usage. His 3.5 rebounds and 2.5 assists explain why he should finish an established core rather than be expected to do everything a guard provides. He also played 58 games. I like the eighth-round price when points and threes are still short, with rebounding and passing already secured and room for some availability risk."
        }
      ]
    },
    {
      "round": 9,
      "candidates": [
        {
          "name": "Immanuel Quickley",
          "yahooAdp": 97,
          "yahooPreRank": 71,
          "note": "Quickley is a particularly useful later guard for a team trying to stay competitive in turnovers. He averaged 5.9 assists and 2.5 threes with just 1.5 turnovers, enough creation to support a star without duplicating the star's possession cost. He also added 1.3 steals. The 44.3% FG on 12.9 attempts is the main category sacrifice; this is a more comfortable pick after Jokić than after several inefficient guards. Kawhi's arrival in Toronto may reduce some ballhandling, so last season's assist total is a reference rather than a promise. Near pick 97, I would prefer Quickley to another scorer when passing, threes and ball security are the categories that still need help."
        },
        {
          "name": "CJ McCollum",
          "yahooAdp": 108.3,
          "yahooPreRank": 111,
          "note": "McCollum remains a practical way to add offense after the primary creators are gone. His 18.7 points and 2.5 threes came with 3.9 assists and 1.8 turnovers, so he can support the backcourt without needing to run the whole fantasy team. Atlanta re-signed him, but the workload alongside Daniels and the other creators still matters. His 45.5% FG and 77.2% FT on 3.1 attempts are the reason I would not treat him as an automatic percentage-friendly veteran. Powell gives you more scoring and stronger FT% at an earlier price; Quickley offers more assists. McCollum fits when your first picks have covered the percentages and the remaining need is points and shooting."
        }
      ]
    },
    {
      "round": 10,
      "candidates": [
        {
          "name": "Ayo Dosunmu",
          "yahooAdp": 114.9,
          "yahooPreRank": 96,
          "note": "Dosunmu offers a different kind of late guard help from the volume shooters. He made 51.7% of his field goals and 87.6% of his free throws, with 3.6 assists and 1.4 turnovers. That makes him appealing after Quickley or another guard whose shooting needs support. His 1.8 threes are useful, though he will not replace a missing high-volume shooter or steals specialist. Minnesota's Ball-Edwards backcourt creates competition for minutes and creation, so I would keep expectations tied to a supporting role. Around the tenth round, the existing efficiency is enough to make the case if the rotation gives him the floor time; there is little need to assume a breakout."
        },
        {
          "name": "Collin Gillespie",
          "yahooAdp": 120.8,
          "yahooPreRank": 100,
          "note": "Gillespie lets you add threes and passing without another large turnover total. He made 2.9 triples and averaged 4.6 assists with 1.6 turnovers across 80 games, a useful late version of the contributions Pritchard offers earlier. The important difference is FG%: Gillespie shot 41.8% on 10.5 attempts. His 87.4% FT also came on only 1.1 attempts, so it cannot compensate for a weak team line by itself. Phoenix brought him back, but Booker and the other scorers keep the creation ceiling in perspective. I would take him near the tenth/eleventh-round turn for shooting and secondary assists, with enough efficient volume already secured to absorb the field goals."
        },
        {
          "name": "Tre Jones",
          "yahooAdp": 116,
          "yahooPreRank": 156,
          "note": "Jones is one of the few late passers who can improve FG% while adding assists. He averaged 5.4 assists with 1.4 turnovers and shot 55.3% on 9.5 attempts, making him a useful follow-up to a low-efficiency early guard. His 84.1% FT on 3.5 attempts helps as well. The tradeoff is 0.6 threes, so he fits a team that has already bought outside shooting. Giddey remains a major creator in Chicago; the argument is for Jones' existing supporting production, not a prediction that he takes over the offense. If percentages and assists are your remaining gaps, his price near 116 can make more sense than another wing who only adds threes."
        },
        {
          "name": "Nikola Vučević",
          "yahooAdp": 114.7,
          "yahooPreRank": null,
          "note": "Vučević is worth considering when the late roster still needs a center who contributes beyond blocks. He averaged 8.4 rebounds, 3.3 assists and 1.6 threes with only 1.3 turnovers. The 49.3% FG and 82.8% FT are easier to fit around guards than the percentages of many finishing centers, although the free throws come on limited volume. Orlando signed him to a reserve frontcourt role, so last season's minutes cannot be assumed. That is why the opportunity belongs in the later rounds despite a profile that suits this punt. I would prefer to secure a dependable rebounder earlier, then use Vučević as depth if the rotation supports him rather than make him the entire center plan."
        }
      ]
    },
    {
      "round": 11,
      "candidates": [
        {
          "name": "Saddiq Bey",
          "yahooAdp": 120.1,
          "yahooPreRank": 109,
          "note": "Bey is useful when the roster still needs points and rebounding from a wing without another turnover burden. He averaged 17.7 points, 5.6 boards and 2.1 threes with only 0.9 turnovers, while 84.1% FT on 4.1 attempts adds meaningful support at the line. His 45.1% FG and modest steals keep him from being a complete late solution, but his limited blocks cost nothing here. Compared with Wallace, Bey does much more for offense and rebounds; Wallace is the specialist for a steals deficit. Near the tenth/eleventh-round turn, choose according to the category that is actually short rather than take another guard just because the build began on the perimeter."
        },
        {
          "name": "Cason Wallace",
          "yahooAdp": 118.2,
          "yahooPreRank": 76,
          "note": "Wallace can make sense even when the rest of the team already has plenty of guards. Two steals with 0.9 turnovers give him a distinct job on a roster whose early scorers supplied little defense. His 8.6 points and 2.6 assists are too modest to repair an unfinished offense, and 43.2% FG still needs support despite the limited shot volume. Daniels provides more rebounds and passing at a much earlier price; Wallace is the cheaper way to address steals once those other categories are handled. I would use him near the end of round ten or early eleven when points and threes are healthy, instead of assuming the smallest scoring line is automatically unsuitable for a guard-focused build."
        },
        {
          "name": "Julian Champagnie",
          "yahooAdp": 110.9,
          "yahooPreRank": 128,
          "note": "Champagnie gives you rebounding and threes from a low-usage wing, which can be more helpful than another late guard. His 5.8 boards and 2.4 threes came with only 0.8 turnovers across all 82 games. The limitations are 11.1 points, 1.5 assists and 43.7% FG, so he fits after the main scoring and creation are established. San Antonio's stars give little reason to project a much larger offensive role. Our rank of 131 is later than Yahoo ADP near 111; I would want him closer to the final rounds unless the combination of boards and shooting is exactly what the roster lacks. The availability record helps, but it does not make every draft price attractive."
        },
        {
          "name": "DeMar DeRozan",
          "yahooAdp": 116.2,
          "yahooPreRank": 155,
          "note": "DeRozan is a useful late choice when the team needs scoring and free throws more than another outside shooter. He averaged 18.1 points and 4.1 assists with only 1.2 turnovers, shooting 49.5% FG and 86.5% FT on 5.5 attempts. That is enough volume to support a weaker free-throw shooter elsewhere. Denver's offense will run through Jokić, so the new role could reduce some touches; the efficiency and ball security are the reasons to consider him. His 0.6 threes and 2.9 rebounds are real limitations. After several shooting guards and a dependable center, he can help the remaining categories; after a low-three opening, another scorer is not the same as the shooter you need."
        }
      ]
    },
    {
      "round": 12,
      "candidates": [
        {
          "name": "Donte DiVincenzo",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "DiVincenzo is an option if the final guard slot needs a lot of threes without giving away steals. He made three triples a game and added 1.3 steals, 3.8 assists and 4.1 rebounds across 82 games. His 40.6% FG is the major cost, especially after another low-efficiency guard, and Minnesota's new backcourt creates uncertainty about the workload. Our Top 150 ranks him 90th, so the missing Yahoo ADP should not be read as evidence that he will be available in round twelve. If he reaches a late pick, the shooting can be valuable. I would be more cautious when FG% is still a close category than when efficient early stars have already established a cushion."
        },
        {
          "name": "Moses Moody",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "Moody has a clear late-round job: add threes without asking to run the offense. He made 2.5 a game with only 0.9 turnovers, while 1.6 assists and 3.3 rebounds limit the help elsewhere. His 44.1% FG and 77.0% FT also mean he is not the guard to choose for percentage protection. Golden State's rotation determines how much of last season's 60-game workload he can retain. I would use him when the main creators and rebounders are already in place and outside shooting is the remaining need. If assists are short, Jones or Gillespie gives the team a more useful contribution even if Moody looks cleaner in turnovers."
        },
        {
          "name": "Quentin Grimes",
          "yahooAdp": 120.4,
          "yahooPreRank": 129,
          "note": "Grimes is a final-pick option for secondary passing and shooting if the Lakers give him a steady wing role. He averaged 13.4 points, 3.3 assists and 1.7 threes while shooting 84.0% FT, a usable supporting line without much dependence on blocks. Luka and Reaves will handle most of the creation, so a major usage increase is a poor basis for the pick. Our rank of 146 is later than Yahoo ADP around 120; I would prefer a fall rather than chase him for the new team. He does more passing than Moody but supplies fewer threes and more turnovers. Let the last open category determine which of those profiles belongs on the roster."
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
},

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
      '2026-27 nine-category draft ranks refreshed with corrected 2025-26 results. Punt-dependent players are priced for the build most likely to draft them.',
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
          "The baseline is corrected 2025-26 nine-category production from the same database that powers the rankings tool. I combined that value with Yahoo's standard public pre-rank, projected-season rank, current ADP and the previous 2026-27 projection. I then adjusted for minutes, usage, age, injury recovery, verified team moves and the best realistic punt fit for build-dependent players. Yahoo prices show the market; they are not forecasts of fantasy value.",
          "Field-goal and free-throw impact use makes and attempts, not percentage alone. Turnovers count too, so a high-volume creator can be valuable in points and assists while costing you a category. Each player's note names the season behind its exact numbers; the rank itself is the forward-looking call.",
          "Availability changes the order. A strong per-game line in a short season can still make a good pick, but the cost of missed games belongs in the draft decision. Players without a 2025-26 line use their earlier production with a larger uncertainty discount.",
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
          "Team assignments and transaction notes were refreshed against NBA transaction reporting and Yahoo rosters on September 26, 2026. Later camp moves, depth-chart decisions and ADP shifts can change a projection quickly, so check the linked market pages when you draft. The incoming 2026 rookie class is excluded because there is no NBA category baseline yet.",
          "Injury returns have the widest range of outcomes. Tyrese Haliburton, Kyrie Irving and Damian Lillard have no 2025-26 season line here; their notes use verified 2024-25 numbers and identify the recovery risk. A blank prior-season stat row does not mean a zero projection.",
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
        q: 'Why are there no rookies?',
        a: 'The incoming 2026 class has no NBA nine-category baseline yet. This edition covers established NBA players, including players who were rookies in 2025-26; evaluate the new class separately once preseason roles are clear.',
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
    // Freemium: six entries for anyone, all fifteen for anyone with an account.
    // Moved off the Draft Pass for 2026-27 because the punt guides now carry
    // the pass as originally intended (see PLANNED_GUIDES), and because these
    // two pages were the wrong thing to sell — they draw the draft-season
    // search intent ("fantasy basketball sleepers") but were converting nobody
    // at 1.5s average engagement. As a login gate they buy the one thing the
    // funnel is actually short of: accounts, created before the purchase
    // moment rather than during it.
    requiresLogin: true,
    tagline:
      'Fifteen players whose 2026-27 draft ranks beat their September Yahoo ADP, from early guards to late category values.',
    strengths: [],
    weaknesses: [],

    // Unranked write-up list (config/sleepers-busts-2026-27.js).
    playerNotes: {
      source: 'sleepers',
      accent: '#2e9e53',
      // Gated at 6 of 15 from the 2026-27 draft season on.
      //
      // Six public entries make this a useful list; a free account opens the
      // remaining nine write-ups.
      //
      // rosterBlock() in seo-content.js reads this number rather than copying
      // it, so the crawlable block ships exactly the six a logged-out visitor
      // sees, plus the "9 more with a Draft Pass" line. Never hand a crawler
      // the locked remainder — that is cloaking.
      freeLimit: 6,
      previewRows: 2,
      heading: 'The sleepers',
      lead:
        "Each name has a projected rank ahead of Yahoo ADP in the September 26 snapshot. The cards show ADP, Yahoo pre-rank, our rank and the corrected 2025-26 line; check the live draft room before acting.",
    },

    sections: [
      {
        id: 'strategy',
        heading: 'What a sleeper actually is',
        body: [
          "A sleeper is a player whose projected value exceeds the price at which Yahoo drafts are taking him. That can happen in round two as easily as round ten. The comparison here is between our 2026-27 rank, Yahoo ADP and Yahoo's public pre-rank; last season's category line and current role explain whether the gap is worth buying.",
          "Some gaps reflect healthy skepticism about missed games or a crowded rotation. Others persist because draft rooms lag behind a player's changed role or overlook categories such as steals, blocks and low turnovers. The notes identify the risk instead of treating every gap as a guaranteed bargain.",
        ],
      },
      {
        id: 'draft',
        heading: 'How to use this list',
        body: [
          "Target the Yahoo price shown on each card, adjusting to your room. Jamal Murray and Austin Reaves are early-round value calls; Jalen Suggs and Reed Sheppard are later category bets. Reaching to our rank erases much of the edge. Compare the player's best categories with the roster you have already built.",
          "Spread role and injury risk across your picks. A roster can carry one health gamble more easily than several, and a late-round breakout candidate is easier to replace if the minutes never arrive. Revisit the case during camp when rotations become clearer.",
        ],
      },
      {
        id: 'caveats',
        heading: 'What this list does not know',
        body: [
          "The Yahoo ADP and pre-rank values are a September 26, 2026 snapshot, not live prices. Camp injuries, trades and role decisions can close a value gap quickly. The 2025-26 stat line is historical evidence; our rank is a forward projection.",
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
        a: 'Take value where your room offers it. Several names here are early-round targets, while later options carry more role risk. Avoid stacking multiple injury or minutes bets in the same draft.',
      },
      {
        q: 'Why does Yahoo pre-rank sometimes disagree with ADP?',
        a: 'Pre-rank is Yahoo’s ordering; ADP measures where people actually draft. When the two diverge, the price you can usually pay is ADP, while pre-rank helps reveal what the platform already recognizes.',
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
      'Twelve 2026-27 nine-category price fades where Yahoo ADP sits ahead of our projected rank, even after build fit.',
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
        "These are price objections, not predictions that good NBA players will fail. Each card compares September Yahoo ADP and pre-rank with our 2026-27 rank, then explains the category, role or availability risk behind the gap.",
    },

    sections: [
      {
        id: 'strategy',
        heading: 'What "bust" means here',
        body: [
          "A bust here is a player whose current draft price requires a better 2026-27 outcome than we are willing to project. The list includes stars who may still produce excellent stretches. The question is whether those stretches cover the pick you must spend to acquire them.",
          "These cases are driven by different risks: a high-volume percentage penalty, a new team with less available usage, a thin category line, or too few recent games to support the market price. Some players already receive a punt-friendly rank on our Top 150 and are still going too early on Yahoo.",
        ],
      },
      {
        id: 'draft',
        heading: 'How to use this list',
        body: [
          "Read the tag as the round where the price becomes easier to defend in a standard twelve-team league. A bust at Yahoo ADP can be a useful pick if your room lets him fall. Check the card's Yahoo pre-rank as well: it can differ sharply from where managers actually draft.",
          "A punt can help, but it does not fix missed games or a lost role. Our Top 150 already prices selected punt-dependent players for a likely build; the bust call is based on Yahoo ADP being higher still. Use the matching punt guide when you know your team's category plan.",
        ],
      },
      {
        id: 'caveats',
        heading: 'What this list does not know',
        body: [
          "Yahoo ADP and pre-rank are a September 26, 2026 snapshot, not live market data. A falling ADP can erase a bust case, while camp news can change a role or health assumption. The cards show corrected 2025-26 results beneath forward-looking analysis.",
        ],
      },
    ],

    faqs: [
      {
        q: 'Are you saying these players are bad?',
        a: 'No. The claim is about value at the September Yahoo ADP. A player can have a strong season and still return less than the pick costs.',
      },
      {
        q: 'Why can a punt-friendly player still be a bust?',
        a: 'The Top 150 already prices selected specialists for their likely punt build. A player remains a bust candidate when Yahoo ADP is higher than that favorable rank or when health and role risks still make the price too aggressive.',
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
