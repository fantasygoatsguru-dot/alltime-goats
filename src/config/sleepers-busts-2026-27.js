// 2026-27 draft value calls for standard 12-team, nine-category leagues.
// Yahoo ADP and public pre-rank: September 26, 2026 snapshot.
// `boardRank` is our projected draft rank; exact stat claims use corrected
// 2025-26 season averages unless another season is named.

export const SLEEPERS = [
  {
    name: 'Jamal Murray', team: 'DEN', tag: 'Round 2 target',
    yahooAdp: 20.5, yahooPreRank: 9, boardRank: 7,
    note: "Yahoo's own pre-rank puts Murray in the top ten, yet drafts are letting him reach the middle of round two. He averaged 25.4 points, 3.3 threes and 7.1 assists in 75 games, with 88.7% free throws and only 2.3 turnovers. Those are first-round guard numbers in nine-category play, and his established role beside Jokić gives the projection a firmer base than a speculative breakout. The discount disappears if your room takes him near Yahoo's pre-rank; at the current ADP, he is one of the clearest early values.",
  },
  {
    name: 'Lauri Markkanen', team: 'UTA', tag: 'Round 3 target',
    yahooAdp: 38.7, yahooPreRank: 18, boardRank: 20,
    note: "The market is treating Markkanen like a fourth-round player despite a 26.6-point, 2.7-three season with 89.6% free throws on meaningful volume. His 1.5 turnovers are especially useful for a high-scoring forward, and Utah's addition of Jaren Jackson Jr. does not erase the shooting role. The 42 games played and the Jazz's late-season habits explain the discount, so pair him with durable early picks. Yahoo's pre-rank is 18; if his draft cost stays close to 39, the gap is large enough to accept that risk.",
  },
  {
    name: 'Trey Murphy III', team: 'NOP', tag: 'Round 3–4 target',
    yahooAdp: 40.1, yahooPreRank: 21, boardRank: 24,
    note: "Murphy is going near the fourth-round turn even though his 21.5 points, 3.2 threes and 1.5 steals solve three scarce categories at once. He also shot 47.0% from the field and 88.6% from the line, making him easier to pair with a high-usage guard than most volume shooters. New Orleans has other scorers, but this line did not depend on one injured teammate absorbing all the shots. Yahoo ranks him 21st before the draft; the ADP near 40 is the opportunity.",
  },
  {
    name: 'Derrick White', team: 'BOS', tag: 'Round 4 target',
    yahooAdp: 47.1, yahooPreRank: 26, boardRank: 29,
    note: "White is a guard who can give you 2.7 threes, 5.4 assists and 1.3 blocks without forcing a turnover punt. He played 77 games and averaged only 1.7 turnovers, a combination that lets him balance an early scorer. The 39.5% shooting is a real FG% cost, so he fits best behind efficient first picks or in a punt-FG% build. Boston's Tatum return and Paul George addition may change the shot count, but a fourth-round ADP still underprices the defensive guard line.",
  },
  {
    name: 'Dyson Daniels', team: 'ATL', tag: 'Round 6 value',
    yahooAdp: 62.9, yahooPreRank: 20, boardRank: 33,
    note: "Yahoo's pre-rank recognizes Daniels as a top-20 category player, while drafters are waiting until roughly pick 63. His 2.0 steals came with 6.8 rebounds and 5.9 assists across 76 games; few guards can cover all three categories that strongly. The 0.3 threes and 61.5% free throws make him a particularly good punt-threes or punt-FT% fit, though only 1.6 free-throw attempts soften the latter cost. Draft him for that build at the market price, not as a substitute for your primary scorer.",
  },
  {
    name: 'Nickeil Alexander-Walker', team: 'ATL', tag: 'Round 5 target',
    yahooAdp: 60.1, yahooPreRank: 24, boardRank: 36,
    note: "Atlanta's larger role produced 20.8 points, 3.2 threes and 1.3 steals over 78 games, a much fuller line than the old defensive-specialist reputation suggests. His 90.2% free throws and 2.1 turnovers give that scoring a clean nine-category shape. The Hawks have changed their perimeter rotation, so last year's usage is not guaranteed, but Yahoo's pre-rank of 24 shows the upside is visible. An ADP around 60 still lets you pay for a step back and profit if most of the role holds.",
  },
  {
    name: 'Austin Reaves', team: 'LAL', tag: 'Round 2 target',
    yahooAdp: 22.3, yahooPreRank: 17, boardRank: 12,
    note: "Reaves averaged 22.9 points, 5.5 assists and 2.3 threes while shooting 48.7% from the field and 86.8% at the line. LeBron's move to Philadelphia leaves more creation available beside Luka, although the two guards will still share the ball. Fifty-one games last season explain why drafters are cautious; the role change gives him a path to outproduce a late-second-round cost. He is an especially useful second pick after a big who covers rebounds and blocks but needs guard scoring and FT%.",
  },
  {
    name: 'Onyeka Okongwu', team: 'ATL', tag: 'Round 5 target',
    yahooAdp: 54.7, yahooPreRank: 36, boardRank: 37,
    note: "Okongwu's 1.9 threes, 7.6 rebounds, 1.1 steals and 1.1 blocks give a center production that usually requires two roster slots. He played 74 games, so this is a real season-long role rather than a short stretch of per-minute promise. His 75.7% free throws and 48.0% FG keep him from being a percentage anchor, but the category coverage is worth more than a fifth-round pick. Yahoo pre-ranks him 36th; the draft room is still buying the old backup label.",
  },
  {
    name: 'Desmond Bane', team: 'ORL', tag: 'Round 5 target',
    yahooAdp: 52.9, yahooPreRank: 44, boardRank: 38,
    note: "Bane played all 82 games while averaging 20.1 points, 4.1 assists and 90.8% free throws. The 48.3% field-goal mark and only 2.0 turnovers make him a steadier nine-category scorer than many guards taken a round earlier. Orlando's crowded offense limits the case for a huge scoring jump, so the appeal is reliability at a fifth-round ADP. He is a comfortable fit next to a first pick with a shakier free-throw or availability profile.",
  },
  {
    name: 'Michael Porter Jr.', team: 'BKN', tag: 'Round 5 target',
    yahooAdp: 59.6, yahooPreRank: 55, boardRank: 40,
    note: "Porter's first Brooklyn season brought 24.2 points, 3.4 threes and 7.1 rebounds, enough volume to make a fifth-round ADP look light. Julius Randle's arrival gives the Nets another scorer, so repeating that usage is far from certain. Even a moderate step back leaves a strong source of points, threes and wing boards, provided you can cover his modest blocks and 52-game availability. This is a bet on the shape of the line at pick 60, not on another 24-point season.",
  },
  {
    name: 'Alex Sarr', team: 'WAS', tag: 'Round 6 target',
    yahooAdp: 71.9, yahooPreRank: 59, boardRank: 45,
    note: "Two blocks a game with 16.3 points and 7.4 rebounds give Sarr an unusually high ceiling for a player available around pick 72. Washington now has Anthony Davis, so minutes and frontcourt pairing matter; that is the main reason not to pay his full best-case price. His 48.2% shooting and 69.2% free throws also need a roster plan. If you already have reliable scoring and FT%, the blocks upside is worth a sixth-round swing.",
  },
  {
    name: 'Ryan Rollins', team: 'MIL', tag: 'Round 7 target',
    yahooAdp: 77.7, yahooPreRank: 58, boardRank: 61,
    note: "Rollins turned a larger Milwaukee role into 17.3 points, 2.5 threes, 5.6 assists and 1.5 steals across 74 games. Giannis' move to Miami opens more creation, although the Bucks also added Tyler Herro and Jaime Jaquez Jr. The 2.7 turnovers and 79.6% free throws keep him out of the cleanest guard tier, but a seventh-round price leaves room for that cost. He is a better upside buy there than an early-round bet that he becomes Milwaukee's undisputed lead guard.",
  },
  {
    name: 'Immanuel Quickley', team: 'TOR', tag: 'Round 9 target',
    yahooAdp: 97.0, yahooPreRank: 69, boardRank: 64,
    note: "Quickley gave Toronto 5.9 assists, 2.5 threes and 1.3 steals with only 1.5 turnovers in 70 games. That ball security is a real nine-category advantage over later high-usage guards, and he can fit beside a first pick who already produces points. Toronto's addition of Kawhi Leonard may trim some creation, so do not project a sudden leap in assists. Yahoo pre-ranks him 69th, yet the ADP near 97 is a much cheaper way to buy the same stable role.",
  },
  {
    name: 'Jalen Suggs', team: 'ORL', tag: 'Round 10 target',
    yahooAdp: 111.4, yahooPreRank: 87, boardRank: 72,
    note: "Suggs' 1.8 steals, 5.5 assists and 0.7 blocks from a guard slot can repair several categories late in a draft. He shot 43.5% and missed 25 games, so the injury and FG% discounts are understandable. A tenth-round ADP gives you room to absorb those flaws while paying for far less defense than he can supply. He fits best with efficient, durable early picks, rather than another guard who already strains FG%.",
  },
  {
    name: 'Reed Sheppard', team: 'HOU', tag: 'Round 10–11 target',
    yahooAdp: 120.8, yahooPreRank: 56, boardRank: 85,
    note: "Sheppard made 2.8 threes with 1.5 steals and 0.7 blocks in all 82 games, an unusual mix from a young guard. Fred VanVleet's return makes his minutes uncertain, which explains the distance between Yahoo's pre-rank of 56 and an ADP around 121. The shooting and defensive rates can still pay off at that late cost even if his assists fall short of a lead guard's. Take him for threes and stocks, then treat any larger creation role as upside.",
  },
];

export const BUSTS = [
  {
    name: 'LaMelo Ball', team: 'MIN', tag: 'Wait past Round 4',
    yahooAdp: 26.0, yahooPreRank: 62, boardRank: 48,
    note: "Minnesota acquired Ball from Charlotte, so a draft price near pick 26 is paying for his old lead-guard role before seeing how he shares the offense with Anthony Edwards. He still averaged 7.1 assists and 3.8 threes in 72 games, but 40.7% shooting on 17.3 attempts is a serious nine-category drag. Yahoo's own pre-rank sits at 62, far behind where managers are taking him. A punt-FG% team can use the upside, but even that build should be careful about paying a third-round price for an unsettled usage split.",
  },
  {
    name: 'Trae Young', team: 'WAS', tag: 'Wait past Round 4',
    yahooAdp: 26.8, yahooPreRank: 72, boardRank: 55,
    note: "Washington acquired Young from Atlanta in January, but he managed only 15 games and averaged 17.9 points and 8.0 assists in that small sample. The passing ceiling is real; the current ADP near 27 assumes a healthy return to his old scoring load as well. FG%, turnovers and light defensive numbers leave little margin if either health or usage falls short. Even a punt-turnovers team should demand a bigger discount than the draft room is offering, and Yahoo pre-ranks him only 72nd.",
  },
  {
    name: 'Jaylen Brown', team: 'PHI', tag: 'Wait until Round 4',
    yahooAdp: 27.5, yahooPreRank: 95, boardRank: 42,
    note: "Brown's 28.5 points and 5.1 assists came in Boston, where Tatum's long absence expanded his creation role. Philadelphia acquired Brown in July and now has both Tyrese Maxey and LeBron James, making a repeat of that usage unlikely. His 3.6 turnovers and 79.5% free throws already cost nine-category value even before a scoring drop. Yahoo's pre-rank of 95 is too pessimistic, but drafters taking him around 28 are paying for last year's situation.",
  },
  {
    name: 'Pascal Siakam', team: 'IND', tag: 'Wait until Round 6',
    yahooAdp: 49.3, yahooPreRank: 79, boardRank: 70,
    note: "Siakam scored 24.0 points while Haliburton missed the season, so the return of Indiana's lead creator should change the shot and assist opportunities. He also shot 69.3% on 6.1 free-throw attempts, a much larger nine-category cost than his box-score averages suggest. The 6.6 rebounds and 1.1 steals keep him useful, especially in punt-FT%, but pick 49 asks for last year's volume without charging for the free throws. Yahoo pre-ranks him 79th; a sixth-round price is easier to justify.",
  },
  {
    name: 'Damian Lillard', team: 'POR', tag: 'Wait until Round 9',
    yahooAdp: 67.9, yahooPreRank: 77, boardRank: 99,
    note: "Lillard missed all of 2025–26 after an Achilles tear, then Portland acquired Ja Morant to share the backcourt. His last healthy season brought 24.9 points and 7.1 assists, but the old line cannot simply be assigned to a 36-year-old returning beside another high-usage guard. An ADP around 68 prices in a fairly smooth comeback and a clear creation role. The upside is worth considering later; in round six, too many things need to go right at once.",
  },
  {
    name: 'Domantas Sabonis', team: 'SAC', tag: 'Wait until Round 4',
    yahooAdp: 27.0, yahooPreRank: 38, boardRank: 39,
    note: "Sabonis can still supply the rebounds and center-position assists that make him an ideal punt-blocks big, but last season ended at 19 games. In that sample he averaged 11.4 boards and 4.1 assists with only 0.2 blocks and 72.7% free throws. His rank on our board already assumes a friendly build; the ADP near 27 asks you to pay more despite the health and category limitations. He is a useful fourth-round target if the first three picks cover shooting and defensive stats, not an automatic late-second-rounder.",
  },
  {
    name: 'Paolo Banchero', team: 'ORL', tag: 'Wait until Round 5',
    yahooAdp: 34.1, yahooPreRank: 119, boardRank: 51,
    note: "Banchero's 22.2 points, 8.4 rebounds and 5.2 assists look like third-round production until the percentages and 3.1 turnovers are counted. He shot 45.9% from the floor and 77.5% on 8.2 free-throw attempts, making him expensive in both percentage categories. A punt-turnovers or punt-FT% team can value that forward volume more highly, and our rank already allows for such a fit. Yahoo's pre-rank of 119 overcorrects, but an ADP near 34 still asks too much for a player who needs a build plan.",
  },
  {
    name: 'Walker Kessler', team: 'LAL', tag: 'Wait until Round 5',
    yahooAdp: 38.0, yahooPreRank: 32, boardRank: 54,
    note: "The Lakers acquired Kessler from Utah, a role that could give him plenty of finishes and blocks beside Luka. The problem with a pick near 38 is the evidence: he played only five games in 2025–26, so his 10.8 rebounds and 1.8 blocks are a tiny sample rather than a reliable new baseline. His 70.0% free throws also require planning in a balanced build. Yahoo pre-ranks him 32nd, but a fifth-round cost leaves a more reasonable cushion for the health risk.",
  },
  {
    name: 'Anthony Davis', team: 'WAS', tag: 'Wait until Round 5',
    yahooAdp: 40.5, yahooPreRank: 37, boardRank: 58,
    note: "Davis remains a potent per-game rebounder and shot blocker, averaging 11.1 boards and 1.7 blocks when he played last season. Dallas traded him to Washington in February, and 20 games are far too few to treat his availability as a routine concern. Alex Sarr also gives the Wizards a young frontcourt player who needs development minutes. A fourth-round ADP pays almost full freight for the healthy line; draft him later if your first picks can absorb another long absence.",
  },
  {
    name: 'Stephon Castle', team: 'SAS', tag: 'Wait until Round 6',
    yahooAdp: 54.4, yahooPreRank: 81, boardRank: 71,
    note: "Castle's 7.4 assists and 5.3 rebounds are valuable from a guard, but they came with 3.2 turnovers, 73.4% free throws and only 1.2 threes. He can be a useful sixth-round pick in a punt-turnovers or punt-FT% build; our rank already gives him that benefit. Yahoo pre-ranks him 81st while drafts are taking him around 54, leaving little room for the efficiency issues to persist. In eight-category leagues the turnover objection disappears, so this is mainly a nine-category price call.",
  },
  {
    name: 'Ivica Zubac', team: 'IND', tag: 'Wait until Round 8',
    yahooAdp: 64.8, yahooPreRank: 71, boardRank: 94,
    note: "Indiana acquired Zubac from the Clippers at the February deadline, and Haliburton's return should create easier finishes for him. That upside is visible, but last season's 10.5 rebounds and 60.0% FG came with only 0.8 blocks and 0.4 steals. A sixth-round price assumes he will deliver a larger defensive line than the recent numbers support, while 48 games add availability risk. He is a better late answer to FG% and rebounds than a mid-round solution to every big-man category.",
  },
  {
    name: 'Dillon Brooks', team: 'PHX', tag: 'Wait until Round 12',
    yahooAdp: 114.9, yahooPreRank: 171, boardRank: 143,
    note: "Brooks scored 20.2 points and hit 2.3 threes last season, but Phoenix now has Devin Booker, Jalen Green and newly acquired Miles Bridges competing for shots. His 43.5% shooting, 3.6 rebounds and 1.8 assists leave little category value if the scoring slips. Yahoo pre-ranks him 171st while drafts are taking him around 115, an aggressive price for a one-dimensional wing. He can help a punt-FG% roster late, but the current ADP spends a top-ten-round pick on the old scoring role.",
  },
];
