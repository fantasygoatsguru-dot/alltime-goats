// Punt guides for 2026-27.
// Historical boards: corrected 2025-26 season values with the punted category removed.
// Editorial round targets: 2026-27 roles and Yahoo ADP/pre-rank snapshot of 2026-09-26.
// Player names match player_period_averages for the historical line and draft builder.

import { CONTENT_SEASON } from './season.js';

export const PUNT_FT = {
  "slug": "punt-ft",
  "type": "punt",
  "puntKey": "ft",
  "title": "Punt FT%",
  "season": CONTENT_SEASON,
  "difficulty": "Beginner",
  "isPremium": true,
  "tagline": "Build around dominant finishers, then give them the shooting and passing needed to win the matchup.",
  "strengths": [
    "fg",
    "reb",
    "blk",
    "pts"
  ],
  "weaknesses": [
    "ft",
    "3pm",
    "ast",
    "to"
  ],
  "freeSections": 2,
  "board": {
    "minGames": 30,
    "freeLimit": 20,
    "previewRows": 4
  },
  "sections": [
    {
      "id": "strategy",
      "heading": "The strategy",
      "body": [
        "Giannis is the clearest reason to build this way. He made 65.0% of his free throws on 9.9 attempts a game in 2025-26, enough volume that one excellent shooter is unlikely to rescue the team percentage. Once you stop trying to repair it, his 27.6 points, 9.8 rebounds and 62.4% FG become much easier to build around. Mobley and Gobert offer different versions of the same opportunity: useful frontcourt production that comes with a free-throw cost other managers have to consider.",
        "The important decision comes after the first pick. A Giannis team still needs threes, assists and real shot blocking; he averaged only 0.7 blocks himself. Taking every available big with a weak free-throw percentage can leave you with impressive rebounds and too few other ways to win. Murray, Murphy and White may give up some value at the line, yet their shooting or passing can do more for the finished team than another center.",
        "This guide assumes a 12-team, nine-category head-to-head league. You are building a reliable route to five weekly category wins, with enough depth to compete in more when the schedule or opponent changes. In roto, finishing near the bottom in FT% creates a season-long standings deficit, so the same concession is harder to justify. In head-to-head, it is a practical way to stop spending draft capital on a category your opening picks make expensive."
      ]
    },
    {
      "id": "correlation",
      "heading": "Natural strengths & weaknesses",
      "body": [
        "FG% and rebounds are the natural starting advantages, but the player differences matter. Duren shot 65.0% on 11.5 attempts; Gobert shot 68.2% on 6.5. Duren has more influence over the team percentage through volume, while Gobert gives you almost twice the blocks. Sengun supplies 6.2 assists from center, but his 51.9% FG is much less powerful than Giannis' efficiency. Choose the contribution your opening leaves short rather than treating every low-FT big as the same bargain.",
        "Shooting is the easiest category to lose by accident. Gobert and Duren give you no threes, while Amen and Daniels each made only 0.3. That does not rule out combining them, but it means the other slots have real work to do. Murphy's 3.2 threes with 1.5 steals or Murray's 3.3 with 7.1 assists are valuable precisely because they cover more than one missing guard category. You still need points as well: Gobert, Ausar and Wallace can help a great deal without supplying much scoring.",
        "Turnovers need a separate plan. Giannis and Sengun each averaged 3.2, and Castle brings another 3.2. Putting all three together may win assists while quietly conceding another category. Daniels supplied 5.9 assists with 1.8 turnovers, and Pritchard gave 5.2 with 1.4. Those alternatives help you add passing without making every possession expensive. Efficient bigs also let you carry a weaker shooter, but only up to a point: adding White, Suggs and DiVincenzo together can make FG% difficult despite the intended strength of the build."
      ]
    },
    {
      "id": "draft",
      "heading": "Where the value sits in the draft",
      "body": [
        "Yahoo's September 26 ADP puts Giannis around pick eight, Murray around 21 and Mobley around 30. That creates a plausible opening from the middle of the first round, provided you respond to who is available at each turn. A manager starting with Luka near pick three has a different choice: the early shooting makes Sengun easier to use, but their combined turnovers mean the following guards should be selected more carefully.",
        "The middle rounds are where the roster needs should start breaking ties. Our Top 150 ranks White 29th and Okongwu 37th, ahead of Yahoo prices near 47 and 55. Siakam and Castle go in a similar range despite our lower overall rankings; removing FT% helps them, but Siakam still gives few blocks and Castle still turns it over. Gobert belongs in the discussion around pick 73, especially if the earlier draft favored guards. After several bigs, Anunoby or Pritchard may be more useful at their prices than another attractive center.",
        "The cards retain the dated September 26 ADP snapshot and use Yahoo standard pre-ranks checked October 3. Default order and ADP sometimes disagree sharply, so the rounds are buying ranges rather than guarantees of availability. Our Top 150 provides the 2026-27 outlook; the live punt board removes FT% from corrected 2025-26 production. The example totals combine last season's per-game lines with equal games for each player, weighting FG% by makes and attempts. They show the roster's tradeoffs before injuries, role changes and weekly schedules enter the picture."
      ]
    }
  ],
  "buildingBlocks": [
    {
      "name": "Efficient scoring and rebounding",
      "note": "Giannis and Duren supply enough accurate shot volume to support weaker-shooting guards. Gobert adds more blocks, while Sengun brings passing. Choose the kind of frontcourt help you actually need."
    },
    {
      "name": "Guards who keep the offense competitive",
      "note": "Murray and Fox supply creation; Murphy and Anunoby add shooting and steals. Buy those combinations before filling every flexible slot with a center."
    },
    {
      "name": "Room to win turnovers",
      "note": "Pritchard, Daniels and the late low-turnover guards can support a high-usage first pick. Removing free throws does not make a fourth turnover-heavy creator harmless."
    }
  ],
  "exampleTeams": [
    {
      "name": "Giannis with enough perimeter offense",
      "color": "#2f80ed",
      "roster": [
        "Giannis Antetokounmpo",
        "Jamal Murray",
        "Evan Mobley",
        "Trey Murphy III",
        "Onyeka Okongwu",
        "Dyson Daniels",
        "Payton Pritchard",
        "Jaden McDaniels"
      ],
      "note": "Murray and Murphy give this team the shooting a Giannis-Mobley start needs, while Daniels adds passing and steals without another large turnover total. Okongwu keeps some threes in the center slot, and Pritchard fills out the backcourt. The eight historical lines combine for 151.5 points, 51.5 rebounds, 36.9 assists and 14.2 threes at 51.4% FG, with 5.8 blocks and 15.8 turnovers. Blocks are still worth strengthening later; the team should not assume that a big-heavy opening has already won them. From pick eight, the turns are 8, 17, 32, 41, 56, 65, 80 and 89. These prices require a few small falls, with Daniels particularly vulnerable to going earlier because of his Yahoo default rank. Giannis' 36-game season remains the major availability risk."
    },
    {
      "name": "Luka with blocks and efficient finishers",
      "color": "#16a085",
      "roster": [
        "Luka Dončić",
        "Alperen Sengun",
        "Chet Holmgren",
        "Derrick White",
        "Desmond Bane",
        "OG Anunoby",
        "Rudy Gobert",
        "Jaden McDaniels"
      ],
      "note": "Luka supplies the early shooting, Sengun adds frontcourt passing, and Holmgren and Gobert do most of the rim protection. White, Bane and Anunoby keep the supporting cast from becoming all non-shooters. With equal games, these eight historical lines total 149.9 points, 55.0 rebounds, 32.1 assists, 14.3 threes and 8.6 blocks at 49.8% FG. The 17.5 turnovers are the clear cost, so the later picks should favor shooting and ball security over another lead creator. From pick three, the turns are 3, 22, 27, 46, 51, 70, 75 and 94. Sengun, Anunoby, Gobert and McDaniels each need modest falls from ADP; those are possible outcomes rather than a draft script. If Sengun goes earlier, Murray offers a different route with more threes and fewer turnovers."
    }
  ],
  "roundTargets": [
    {
      "round": 1,
      "candidates": [
        {
          "name": "Giannis Antetokounmpo",
          "yahooAdp": 7.8,
          "yahooPreRank": 50,
          "note": "The clearest reason to commit to this build in the first round. Giannis shot 65.0% on 9.9 free throws a game, enough volume to make winning the category difficult even with good shooters around him. Remove that problem and you get 27.6 points, 9.8 rebounds and 5.4 assists on 62.4% FG. The important correction is on defense: he blocked only 0.7 shots, so you still need a proper source of rim protection. Miami's pairing with Bam changes how the offense will be shared, and last season's 36 games make availability a serious part of the price. Around pick eight, I would build for a big FG% advantage, then look for a shooter and a shot blocker at the next two turns."
        },
        {
          "name": "Nikola Jokić",
          "yahooAdp": 1.9,
          "yahooPreRank": 1,
          "note": "Starting with Jokić keeps the decision open. His 27.7 points, 12.9 rebounds and 10.7 assists give you enough production to consider almost any direction, including a free-throw punt if the next picks make it worthwhile. You are giving up useful value at the line, so I would want the later discounts to be substantial: Mobley or Gobert becomes a much more comfortable selection, while their blocks fill a category Jokić does not dominate. His 56.9% FG also gives you room for a volume shooter later. The limit is turnovers. At 3.7 a game, he makes the low-turnover passing of Murray or Pritchard more attractive than simply adding the next available lead guard."
        },
        {
          "name": "Luka Dončić",
          "yahooAdp": 3.5,
          "yahooPreRank": 5,
          "note": "Luka gives this build its perimeter offense before you draft a center. His 33.4 points, four threes and 8.2 assists are especially valuable when the following rounds might include Gobert, Mobley or another big who adds very little outside shooting. The 78.0% FT on ten attempts becomes irrelevant once you commit. What remains is 47.6% FG on 22.7 shots and four turnovers: neither is fixed by removing free throws. You need substantial efficient volume from the frontcourt, and you should be selective about adding another high-turnover creator. A Luka-Sengun opening can work, but the next guard should probably look more like White or Bane than Castle. In eight-category leagues, that turnover concern disappears and the pairing becomes easier."
        }
      ]
    },
    {
      "round": 2,
      "candidates": [
        {
          "name": "Alperen Sengun",
          "yahooAdp": 18.4,
          "yahooPreRank": null,
          "note": "Sengun lets you buy assists without using another guard slot, which matters when the available guards mostly hurt FG%. He averaged 20.4 points, 8.9 rebounds and 6.2 assists, with 1.2 steals and 1.1 blocks giving the line more breadth than a simple points-and-rebounds center. His 69.1% FT on 5.2 attempts is a meaningful penalty you can remove. He is not, however, another Giannis-level FG% anchor: 51.9% is useful but will not erase several inefficient shooters. The 3.2 turnovers and 0.6 threes make Murray a very different second-round choice at a similar price. I prefer Sengun when the first pick supplies shooting; after Giannis, I would be more inclined to secure a perimeter creator unless the market gives a clear discount."
        },
        {
          "name": "Amen Thompson",
          "yahooAdp": 23.6,
          "yahooPreRank": 10,
          "note": "Amen can give a guard slot the rebounding and efficiency of a forward. His 7.8 boards and 53.4% FG came with 5.3 assists and 1.5 steals, a helpful way to keep the frontcourt advantages growing without filling every roster spot with centers. His free throws were a manageable 77.9%, so the strongest argument here is the overall fit rather than an enormous FT% discount. The 0.3 threes are much harder to accommodate after a Giannis start. VanVleet's return may also take away some of the ballhandling that produced those assists. I like Amen more beside Luka, who has already supplied four threes a game, than as the second member of an opening that still has almost no shooting."
        },
        {
          "name": "Jamal Murray",
          "yahooAdp": 20.5,
          "yahooPreRank": 9,
          "note": "Murray is the second-round guard I would look for after Giannis. His 3.3 threes and 7.1 assists cover two categories that become harder to find when you keep selecting bigs, and 25.4 points help you avoid turning into a team of defensive specialists. He did that with 2.3 turnovers and 48.3% FG, a relatively comfortable combination for this build. Denver has added DeRozan, so projecting the same scoring workload would be optimistic; the shooting and passing remain the reasons to draft him. You give up the value of his 88.7% FT, but that is a reasonable cost when the rest of the line fits this well. His 75-game season also makes him a reassuring partner for Giannis after an injury-shortened year."
        }
      ]
    },
    {
      "round": 3,
      "candidates": [
        {
          "name": "Evan Mobley",
          "yahooAdp": 30,
          "yahooPreRank": 45,
          "note": "Mobley's free throws are a much bigger problem than some managers still assume. He made 60.6% on 4.6 attempts, which can pull a balanced team in the wrong direction. Here you can concentrate on nine rebounds, 1.7 blocks and 54.6% FG, with 3.6 assists adding useful passing from the frontcourt. He makes particular sense beside Giannis because the blocks cover an actual need. Compared with Duren, you get considerably more rim protection and passing but less scoring and FG% impact. The one three per game is a contribution, not enough to solve a shooting shortage. After this pick, I would normally spend on a guard or wing rather than keep increasing a rebounding advantage that may already be large enough."
        },
        {
          "name": "Jalen Duren",
          "yahooAdp": 36,
          "yahooPreRank": 28,
          "note": "Duren is the strongest FG% option in this range. He made 65.0% of 11.5 shots a game while supplying 19.5 points and 10.5 rebounds, so the efficiency comes with enough volume to move your team percentage. Removing his 74.7% FT on 6.1 attempts makes that package much easier to use. The distinction from Mobley is important: Duren blocked only 0.8 shots and made no threes. If your first pick was Giannis, the pair still needs real shot blocking as well as shooting. Stewart's departure leaves less competition in Detroit's frontcourt, but I would value the production Duren has already shown before paying for another jump. He is particularly appealing after an early guard whose shot volume needs efficient support."
        },
        {
          "name": "Chet Holmgren",
          "yahooAdp": 27.7,
          "yahooPreRank": 19,
          "note": "Holmgren gives you a little more freedom than most centers in this build. His 1.3 threes and 1.6 turnovers make it easier to retain shooting and ball security while adding 8.9 boards, 1.9 blocks and 55.7% FG. Mobley gains more directly from removing FT%, but that does not automatically make him the better fit beside a non-shooting first pick. Holmgren is already productive in 28.9 minutes; Oklahoma City's depth makes a major workload increase uncertain. At an ADP near 28, he usually requires a pick early in the third rather than a hope that he survives to its end. Passing remains the tradeoff, so the next selection needs to account for his modest 1.7 assists."
        }
      ]
    },
    {
      "round": 4,
      "candidates": [
        {
          "name": "Derrick White",
          "yahooAdp": 47.1,
          "yahooPreRank": 26,
          "note": "White is a useful way to buy shooting and blocks at the same time. His 2.7 threes, 5.4 assists and 1.3 blocks let you use a guard slot for work that might otherwise require another center. The cost is substantial: 39.5% FG on 14.4 attempts can undo the efficiency you spent the first rounds building. Giannis gives you enough volume to make that pairing plausible; their historical makes and attempts combine to about 51.8% with equal games. Boston's changed offense could alter White's creation, but the defense and outside shooting remain valuable. I would take him when blocks are still a need. If the frontcourt already dominates that category, Murphy offers more points and threes without the same FG% damage."
        },
        {
          "name": "Donovan Clingan",
          "yahooAdp": 41.6,
          "yahooPreRank": 29,
          "note": "Clingan is a rebounding pick first. His 11.5 boards and 1.7 blocks came with only 1.2 turnovers, making him a comfortable follow-up to a guard who already handles most of the offense. The 69.2% FT no longer complicates the choice, and 1.1 threes give you something back in a category traditional centers often leave empty. What he will not provide is Duren's scoring or efficiency advantage: 12.1 points and 52.1% FG are more modest contributions. He played 77 games, a useful recent availability record at a position full of injury risks. I would choose him after a shooting-heavy opening, especially if another high-usage player would make turnovers difficult to recover."
        },
        {
          "name": "Trey Murphy III",
          "yahooAdp": 40.1,
          "yahooPreRank": 22,
          "note": "Murphy is the kind of player a punt-FT% team can miss by concentrating too hard on bad free-throw shooters. He made 3.2 threes, scored 21.5 points and added 1.5 steals with only 1.8 turnovers. That is a lot of the perimeter production a Giannis-Mobley opening still needs. His 47.0% FG is also easier to absorb than White's, although you lose White's blocks and some passing. You are discarding his excellent free throws, but the alternative may be another big who makes your existing strengths larger while leaving several categories uncompetitive. Around pick 40, I would be happy to make that trade if assists are already covered. The 66-game season is a reason to keep some dependable options in the later rounds."
        }
      ]
    },
    {
      "round": 5,
      "candidates": [
        {
          "name": "Pascal Siakam",
          "yahooAdp": 49.3,
          "yahooPreRank": 79,
          "note": "Siakam is worth considering when an efficient frontcourt still needs more scoring. He averaged 24.0 points and 6.6 rebounds, and removing 69.3% FT on 6.1 attempts takes away a substantial part of his nine-category penalty. The danger is assuming that a forward with those numbers also strengthens the traditional center categories. He shot 48.4% and blocked only 0.4 shots, so he does much less for FG% and blocks than Mobley or Duren. Haliburton's return could reduce some of the creation Siakam had to supply last season. Our Top 150 places him 70th against a Yahoo price near 49; the punt makes that price easier to discuss, but I would pay it only when scoring is a clear need and the defense is already in place."
        },
        {
          "name": "Stephon Castle",
          "yahooAdp": 54.4,
          "yahooPreRank": 81,
          "note": "Castle can rescue assists from a guard slot: 7.4 per game is unusually strong at this stage of the draft, and 5.3 rebounds add something most comparable passers do not. Removing his 73.4% FT helps, but it leaves 3.2 turnovers and just 1.2 threes. That is why a Giannis-Sengun-Castle opening can become uncomfortable even though all three look attractive with free throws removed. Fox offers fewer assists but more shooting and fewer turnovers at a later Yahoo price. I would choose Castle when the existing roster has clean possessions and enough outside shooting to support him. Sharing San Antonio's creation with Fox and Wembanyama also makes it unwise to assume another large assist increase."
        },
        {
          "name": "Onyeka Okongwu",
          "yahooAdp": 54.7,
          "yahooPreRank": 37,
          "note": "Okongwu is a useful change of direction after two traditional bigs. His 1.9 threes and 3.1 assists let the center position contribute to categories you might otherwise have to chase with the remaining guards. You still get 7.6 rebounds and 1.1 each in steals and blocks. The 75.7% FT is easier to ignore here, but 48.0% FG explains why he should complement an efficient finisher rather than be mistaken for one himself. Clingan supplies a much bigger rebounding advantage; Okongwu spreads the help around. Our rank of 37 against Yahoo ADP near 55 leaves a useful buying range, particularly when you want a center without making the team even more dependent on perimeter shooting later."
        },
        {
          "name": "Desmond Bane",
          "yahooAdp": 52.9,
          "yahooPreRank": 44,
          "note": "Bane remains useful even after you throw away his best percentage. He gave Orlando 20.1 points, 4.1 assists and two threes while shooting 48.3% FG and playing all 82 games. After a risky first pick or two non-shooting bigs, that is a practical combination of offense and availability. His 90.8% FT does not help this team, so I would generally prefer Murphy when threes and steals are the main shortages, or White when blocks are still a problem. Bane makes more sense when you need points and passing without another difficult FG% line. He is also a cleaner follow-up to Luka or Sengun than another three-turnover creator. The fifth-round price is reasonable for that role without requiring an offensive leap."
        }
      ]
    },
    {
      "round": 6,
      "candidates": [
        {
          "name": "Dyson Daniels",
          "yahooAdp": 62.9,
          "yahooPreRank": 20,
          "note": "Daniels can cover the guard rebounding and passing that a roster of finishers leaves short. His 6.8 boards and 5.9 assists came with two steals and only 1.8 turnovers, so he adds creation without the possession cost of Castle or Sengun. Shooting 51.7% from the field is another advantage. His 61.5% FT disappears from the calculation, although the low 1.6-attempt volume means that was never the only reason to draft him. The real decision is whether you can accommodate 0.3 threes. After Murray and Murphy, that is much easier than after Amen and a non-shooting center. His ADP near 63 is attractive against our rank of 33, but the much earlier Yahoo default order means you should not count on that price in every room."
        },
        {
          "name": "Zion Williamson",
          "yahooAdp": 69.7,
          "yahooPreRank": 107,
          "note": "Zion is a way to add scoring while protecting FG%, which most late guards cannot do. His 21.0 points came on 60.0% shooting, and punting 71.6% FT on 7.5 attempts removes a meaningful burden. The rest of the line explains why he still needs the right team: 5.7 rebounds and 0.5 blocks are modest for a frontcourt player, and he gives you no threes. He played 62 games, so a roster already carrying Giannis has another availability concern to weigh. Our overall rank of 82 is later than his ADP near 70. I would take him for a specific scoring-and-FG% shortage, not simply because a second weak free-throw shooter seems to confirm the strategy."
        },
        {
          "name": "OG Anunoby",
          "yahooAdp": 66.6,
          "yahooPreRank": 60,
          "note": "Anunoby is a good sixth-round choice when the frontcourt is strong and the guards are running out of help. His 2.3 threes come with 1.6 steals and 0.7 blocks, so you can improve shooting without weakening the defense. The 48.4% FG is also a more comfortable fit than another low-efficiency volume shooter. He supplies little creation, which is why Daniels may be the better choice if assists are the missing category. After a Murray or Luka opening, however, Anunoby often covers more of what remains. Our Top 150 ranks him 49th against an ADP around 67. The appeal is getting useful shooting and defense at that price, with no need for him to become a featured scorer."
        }
      ]
    },
    {
      "round": 7,
      "candidates": [
        {
          "name": "Rudy Gobert",
          "yahooAdp": 72.5,
          "yahooPreRank": 87,
          "note": "Gobert should be one of the first names you consider once free throws are off the table. His 52.6% at the line is the major obstacle to using 11.5 rebounds, 1.6 blocks and 68.2% FG in a balanced team. He also kept turnovers to 1.4 and played 76 games. The percentage is excellent, but it comes on 6.5 shots a game, so Duren still has more influence over a team's FG% through volume. Gobert gives you no threes and only 10.9 points; he makes far more sense after an opening that already has shooting and scoring than after several similar centers. Around the sixth/seventh-round turn, this is a substantial rebounding and defensive addition without needing a larger offensive role."
        },
        {
          "name": "Kel'el Ware",
          "yahooAdp": 73.2,
          "yahooPreRank": 51,
          "note": "Ware's rebounding was already useful in a limited workload: nine boards in about 22 minutes, alongside 1.1 blocks and 1.2 threes. Milwaukee acquired him in the Giannis deal, and the chance of a bigger role is the attraction. Turner is still part of the frontcourt, though, so more minutes cannot simply be added to last season's line. Ware's 0.8 turnovers are helpful, while 11.1 points and 0.7 assists leave most of the offense to your other picks. I prefer Gobert when I need established rebounds and blocks at this price. Ware is the more speculative choice when a little center shooting matters and you can tolerate uncertainty about the rotation."
        },
        {
          "name": "De'Aaron Fox",
          "yahooAdp": 80.1,
          "yahooPreRank": 85,
          "note": "Fox is a useful answer when the early draft has left you short of assists. He averaged 6.2 with 1.8 threes and 48.6% FG, allowing you to improve the backcourt without the shooting penalty of several other guards in this range. His 76.0% FT is no obstacle here. Castle gave you more assists and rebounds, but Fox kept turnovers to 2.3 rather than 3.2 and costs less in Yahoo drafts. That makes him the more comfortable companion for Giannis or Sengun when both passing and ball security need attention. Sharing the offense with Castle and Wembanyama limits the case for a return to his old scoring totals. I would be satisfied with useful secondary creation around his price near 80."
        },
        {
          "name": "Payton Pritchard",
          "yahooAdp": 79.6,
          "yahooPreRank": 33,
          "note": "Pritchard is a good way to keep the punt from spreading to threes or turnovers. He supplied 2.7 triples and 5.2 assists with just 1.4 turnovers, enough shooting and passing to make a roster of frontcourt finishers work. His 46.3% FG is a cost an efficient early core can usually accommodate. Boston's return to a Tatum-led offense could change his creation, so I would draft him for a supporting role rather than assume another jump in usage. You lose the value of his good free throws, but you are still getting the two guard categories this build often lacks. With blocks already covered, he can be a better use of a seventh-round pick than another center."
        },
        {
          "name": "VJ Edgecombe",
          "yahooAdp": 74.7,
          "yahooPreRank": 31,
          "note": "Edgecombe gives you several useful guard contributions without needing to lead an offense. His first season brought 16.0 points, two threes, 5.6 rebounds, 4.2 assists and 1.4 steals across 75 games. Philadelphia now has Brown and LeBron alongside Maxey and Embiid, so repeating the same touches is less certain than repeating his effort on defense and the boards. The 43.8% FG also needs support from your bigs. I would choose Pritchard first if assists and threes are the urgent needs; Edgecombe is more interesting when guard rebounds and steals would round out the team. His much earlier Yahoo default rank can make him expensive in some rooms, and I would not chase that price on the assumption of a larger scoring role."
        }
      ]
    },
    {
      "round": 8,
      "candidates": [
        {
          "name": "Ausar Thompson",
          "yahooAdp": 88.5,
          "yahooPreRank": 82,
          "note": "Ausar is one of the clearest defensive beneficiaries of this punt. Remove his 57.1% FT and you can use two steals, 0.9 blocks and 52.5% FG from a wing, with 5.7 rebounds adding more frontcourt help. The price is paid elsewhere: 9.9 points and 0.1 threes still count, and enough players with that profile can leave you conceding offense as well as free throws. He is an excellent fit after a start with Murray and Murphy; he is much harder to add after Amen and Daniels. Wallace offers similar steals with more shooting at a later price, while Ausar gives you much more rebounding and better FG%. Let those differences determine whether the eighth-round pick belongs to him."
        },
        {
          "name": "Nic Claxton",
          "yahooAdp": 90.1,
          "yahooPreRank": 105,
          "note": "Claxton's passing is the part of the line that separates him from a routine finishing center. He averaged 3.7 assists with only 1.4 turnovers, along with 57.1% FG and 1.1 blocks. Removing his 61.6% FT lets you use those contributions without another percentage problem. Chicago acquired him from Brooklyn, so the role alongside its other frontcourt players still needs to settle. He also averaged only 6.9 rebounds and 11.7 points, which means this is not a complete solution to your big-man categories. I like the fit when the team needs some assists without another guard and already has enough scoring and threes. If rebounds and blocks are the priority, Gobert is worth the earlier selection."
        },
        {
          "name": "Jaden McDaniels",
          "yahooAdp": 89.2,
          "yahooPreRank": 43,
          "note": "McDaniels lets you add a block a game from the wing while keeping FG% strong. His 51.5% shooting came with 1.1 steals and 1.4 threes, giving him a much easier offensive fit than Ausar after a few non-shooting bigs. Ausar has the stronger steals case; McDaniels spreads the contribution across shooting and rim protection. Minnesota's new Ball-Edwards backcourt could change the shot distribution, but defense should remain his route to minutes. He will not fix a shortage of rebounds or assists, so I would treat him as the wing who finishes a well-built frontcourt rather than a substitute for a missing center. Around pick 90, that can be a useful distinction."
        }
      ]
    },
    {
      "round": 9,
      "candidates": [
        {
          "name": "Myles Turner",
          "yahooAdp": 100.3,
          "yahooPreRank": 108,
          "note": "Turner is worth a look when the team needs blocks and threes from the same remaining slot. He supplied 1.6 and 2.1 respectively, and removing his 74.0% FT eliminates one of the costs. The others remain: 44.0% FG, 5.3 rebounds and 11.9 points are modest returns from a center. A Giannis or Duren foundation can make the shooting percentage easier to carry, but Turner is not the big to draft if FG% itself is the problem. Milwaukee's addition of Ware also puts another player in the frontcourt rotation. I would use the ninth-round price to buy this particular combination after the efficient rebounding is covered, rather than expect the fuller line associated with his earlier seasons."
        },
        {
          "name": "Jalen Suggs",
          "yahooAdp": 111.4,
          "yahooPreRank": 89,
          "note": "Suggs is a later route to assists and steals if the earlier guards went too quickly. His 5.5 assists and 1.8 steals came with 2.1 threes, so he leaves much less shooting work for the rest of the roster than Daniels does. The compromise is 43.5% FG and 2.7 turnovers, plus a 57-game season. Those costs matter after a Luka-Sengun start, even if you have stopped worrying about free throws. I would prefer Wallace when steals are the main shortage and the passing is already strong. Suggs earns the earlier selection when you need both creation and defense, with enough efficient frontcourt volume to support his shooting."
        }
      ]
    },
    {
      "round": 10,
      "candidates": [
        {
          "name": "Jusuf Nurkić",
          "yahooAdp": 112.8,
          "yahooPreRank": null,
          "note": "Nurkić still offers an unusual combination this late: 10.4 rebounds and 4.8 assists from center. His 54.9% FT makes that line awkward for many teams, but the punt allows you to consider the passing and boards on their own merits. The more serious questions are workload and availability after a 41-game season. Utah's frontcourt gives you little reason to assume all of the old minutes will be there. His 0.5 blocks and 2.5 turnovers also prevent him from being a simple late substitute for Gobert. I would take him when rebounds and assists are both short and the earlier picks are dependable; a team already carrying several health risks should be less willing to wait on the role."
        },
        {
          "name": "P.J. Washington",
          "yahooAdp": 115.8,
          "yahooPreRank": 178,
          "note": "Washington can be useful when your open forward slot still needs rebounds and blocks. He supplied seven boards, a steal and 1.1 blocks, with 1.4 threes preventing the line from being entirely dependent on interior play. His 68.7% FT stops hurting, but the 45.0% FG still puts pressure on a category this build usually wants to win. That is a manageable trade after Giannis or Duren and a less comfortable one after several stretch bigs. Dallas' changing shot distribution may reduce his scoring opportunities; the defensive contributions are the stronger reason to draft him. With only 56 games last season, I would keep the price late and avoid treating him as the dependable frontcourt piece an injury-heavy roster needs."
        },
        {
          "name": "Neemias Queta",
          "yahooAdp": 115.2,
          "yahooPreRank": 116,
          "note": "Queta offers a straightforward late contribution: 8.4 rebounds, 1.3 blocks and 65.3% FG with about one turnover. His 70.3% free throws no longer complicate that line. Boston has added Mitchell Robinson, however, so last season's 25.3 minutes and 76 games do not guarantee the same workload. Our Top 150 puts Queta 138th while Yahoo drafts him near 115; the punt improves the fit, but the competition for minutes is still a reason to prefer a discount. He also takes only 6.6 shots a game, limiting how much the high percentage can repair your team total. Choose him for efficient boards and blocks when shooting and passing are already handled."
        }
      ]
    },
    {
      "round": 11,
      "candidates": [
        {
          "name": "Cason Wallace",
          "yahooAdp": 118.2,
          "yahooPreRank": 76,
          "note": "Wallace is the late guard for a team that has enough offense and wants to win steals without losing turnovers. He averaged two steals with just 0.9 turnovers, and 1.3 threes provide more shooting than Ausar or Daniels. The 8.6 points and 2.6 assists explain why he should be one of the final pieces rather than the guard expected to rescue an unfinished offense. His 43.2% FG also needs to be weighed, though 7.6 attempts give it less influence than White's shooting. A Giannis-Murray start can make good use of this line. After several low-scoring centers, Bey or Sheppard may do more for the categories still within reach."
        },
        {
          "name": "Saddiq Bey",
          "yahooAdp": 120.1,
          "yahooPreRank": 109,
          "note": "Bey gives a big-heavy team something it can run out of late: scoring that does not bring a large turnover total. His 17.7 points, 2.1 threes and 5.6 rebounds came with only 0.9 turnovers across 72 games. The percentages and defensive stats are less exciting, so he is a better choice when the early picks already supply blocks and steals. Compared with another low-scoring center, Bey can improve the actual shape of the team even if that center rises further on the punt board. I would look for him near the tenth/eleventh-round turn when points and threes have fallen behind, without needing to predict a much larger role in New Orleans."
        },
        {
          "name": "Tre Jones",
          "yahooAdp": 116,
          "yahooPreRank": 156,
          "note": "Jones is useful when the team needs assists without more turnovers or a FG% problem. His 5.4 assists came with 1.4 turnovers and 55.3% shooting on 9.5 attempts, a noticeably different package from Suggs. You give up the value of his good free throws, but the remaining line still has a purpose here. His 0.6 threes are the limitation: he fits beside established shooters and becomes harder to use after Amen or Daniels. Giddey remains an important creator in Chicago, so Jones should be valued for the supporting role he has shown rather than a projected takeover of the offense. At a price around 116, he is worth considering slightly before this round if passing is the last major gap."
        },
        {
          "name": "Reed Sheppard",
          "yahooAdp": 120.8,
          "yahooPreRank": 56,
          "note": "Sheppard is the late shooting bet I would make when the frontcourt already protects FG%. His 2.8 threes came with 1.5 steals and 0.7 blocks, so he adds enough defense to remain useful even when the shots are not falling. The 43.0% FG is a real cost on 11.5 attempts. Houston also has VanVleet returning, making a repeat of Sheppard's 26.2-minute workload uncertain. Wallace is the cleaner steals-and-turnovers choice; Sheppard supplies more than twice the threes. Around the tenth/eleventh-round turn, that difference can matter more than which player gains most directly from the free-throw punt."
        }
      ]
    },
    {
      "round": 12,
      "candidates": [
        {
          "name": "Isaiah Hartenstein",
          "yahooAdp": 105.4,
          "yahooPreRank": 141,
          "note": "Hartenstein's 9.4 rebounds, 3.5 assists and 62.2% FG fit this build well, and his 61.0% FT no longer gets in the way. The concern is paying for that fit before accounting for the role. He played 47 games, Oklahoma City has plenty of frontcourt depth, and he supplied only 0.8 blocks with no threes. Our rank of 145 is much later than Yahoo's ADP around 105, so this is a fall-to-you target rather than a player to chase in the ninth. He makes sense as a final passing big if the rest of the team already has shooting and blocks. Otherwise another center may simply deepen strengths you have already paid for."
        },
        {
          "name": "Jay Huff",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "Huff's 1.9 blocks and 1.5 threes give you a way to finish the frontcourt without completely giving up outside shooting. He managed that in 21 minutes while appearing in all 82 games, but Zubac is now ahead of him in Indiana and could leave a smaller reserve workload. His four rebounds and 47.6% FG are the other limitations: he will not supply the usual efficient rebounding you might expect from a center. I like him as a final pick when those categories are already strong and blocks need help. If the team instead needs volume on the boards, Queta or a discounted Hartenstein fits better."
        },
        {
          "name": "Donte DiVincenzo",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "Three threes a game is enough to make DiVincenzo interesting to a roster that has spent heavily on finishers. He added 1.3 steals and 3.8 assists with 1.4 turnovers across 82 games, so this is more than a one-category shooting line. His 40.6% FG is the obvious cost, and Minnesota's addition of Ball changes the guard rotation. Our Top 150 places him 90th, while the dated Yahoo snapshot has no reliable ADP; that absence should not be mistaken for evidence that he will last until round twelve. If he does fall, he addresses a real need here. I would be less interested after already taking White and Suggs, where another low-FG guard could erase the frontcourt's advantage."
        },
        {
          "name": "Moses Moody",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "Moody is a simple option for the final wing slot when threes and turnovers matter more than extra creation. He made 2.5 threes with only 0.9 turnovers, but 1.6 assists and 3.3 rebounds mean there is little reason to choose him for an all-around role. His 44.1% FG also needs the efficient bigs to do their part. Golden State's rotation will determine how much of last season's 60-game workload carries forward. I would take him after the primary passing is covered and treat the shooting as the job. With no reliable Yahoo ADP in the snapshot, this is a conditional late option rather than a promise that he will be available."
        }
      ]
    }
  ],
  "faqs": [
    {
      "q": "Should I decide to punt FT% before the draft?",
      "a": "Have the plan ready, but let the opening picks justify it. Giannis is a clear reason to commit because his attempt volume makes repairing FT% expensive. Jokić leaves more options open, and there is no need to give away his positive free-throw impact unless the later discounts make the trade worthwhile. Your draft position determines which of those openings is realistic."
    },
    {
      "q": "Do good free-throw shooters become bad picks?",
      "a": "They lose the value of that category, but the rest of their line can still be exactly what you need. Murray brings threes and assists; Murphy adds shooting and steals; White supplies unusual blocks from guard. Passing on all of them because their FT% is strong can leave you with a roster that wins rebounds and struggles to find four other wins."
    },
    {
      "q": "How do I avoid accidentally punting threes too?",
      "a": "Count the shooting after each pair of picks. Giannis, Amen, Daniels and a finishing center together leave a lot of work for the remaining slots. Spend on a player who makes several threes before taking another non-shooter, and use shooting centers or forwards when the available guards do not fit. A weak-three player can still be a good pick; several of them require a deliberate response."
    },
    {
      "q": "What should I stream during the season?",
      "a": "Stream toward the closest category you can realistically win. Once rebounds and blocks are comfortably ahead, another center may contribute less than a wing who can add threes or steals. FG% depends on attempts, and turnovers can worsen with extra games, so check the matchup before filling every available slot. The best addition is the one that changes a likely category result."
    },
    {
      "q": "Does this work in eight-category leagues?",
      "a": "Yes. Removing turnovers makes Giannis, Sengun, Luka and Castle easier to combine because their biggest remaining shared cost disappears. Shooting and steals still need deliberate sources, and centers still differ in how much FG% help they provide. Reorder the board for the actual league settings before using the nine-category round targets."
    }
  ]
};

export const PUNT_ASSISTS = {
  "slug": "punt-assists",
  "type": "punt",
  "puntKey": "ast",
  "title": "Punt Assists",
  "season": CONTENT_SEASON,
  "difficulty": "Intermediate",
  "isPremium": true,
  "tagline": "Build around finishers, protect both percentages, and leave the playmaking premium to someone else.",
  "strengths": [
    "pts",
    "reb",
    "blk",
    "to"
  ],
  "weaknesses": [
    "ast",
    "stl",
    "ft",
    "3pm"
  ],
  "freeSections": 2,
  "board": {
    "minGames": 30,
    "freeLimit": 20,
    "previewRows": 4
  },
  "sections": [
    {
      "id": "strategy",
      "heading": "What you are actually giving up",
      "body": [
        "Punt assists is a head-to-head nine-category plan, not an instruction to draft the players with the fewest assists. You are accepting a likely loss in one category so that the other eight can support a winning roster. The useful targets are players whose scoring, shooting, rebounding or defense justify their price without needing their passing. A high-assist player can still be the right pick; a low-assist player can still be an expensive mistake. In roto, deliberately finishing near the bottom in assists carries a season-long standings cost, so this is a much less comfortable default.",
        "Wembanyama is the clearest early foundation because his 25.0 points, 11.5 rebounds and 3.1 blocks already cover several jobs. His 82.7% free throws on 7.0 attempts also let you keep competing at the line. The next picks should exploit that freedom: a scorer who adds threes and steals is often more valuable to this particular team than another shot blocker. Edwards starts the same punt from the other direction. His 28.8 points and 3.4 threes are the offense; the next turns need to supply frontcourt production.",
        "Do not confuse removing assists with removing turnovers. Brown still committed 3.6 per game and Durant 3.2, whereas Markkanen scored 26.6 points with only 1.5. Those differences remain part of the decision. Likewise, a guard such as Curry can fit perfectly because his threes and free throws justify the cost even after his passing is discarded. The aim is to stop paying primarily for creation, not to enforce a rule against guards."
      ]
    },
    {
      "id": "correlation",
      "heading": "Keep one punt from becoming three",
      "body": [
        "Rebounds and blocks are accessible through the early bigs, but neither becomes automatic simply because you stop drafting point guards. Towns contributed 11.9 rebounds and only 0.5 blocks; Turner supplied 1.6 blocks but just 5.3 rebounds. FG% needs the same care. Holmgren's 55.7% shooting helps an inefficient perimeter scorer, while Turner's 44.0% does not. Check the actual line rather than assuming every center protects the same categories.",
        "Free throws are often where the build goes wrong. Edwards shot 79.6% on 7.2 attempts, a larger volume than Clingan's 69.2% on 2.5 attempts. Either can fit with strong shooters; combining several weaknesses without measuring the totals is the problem. Bane's 90.8% on 4.2 attempts or Markkanen's 89.6% on 6.4 provide genuine counterweights. Average made and attempted shots across the roster, not the individual percentages. The same principle applies to FG%, especially when a late scorer takes many more shots than your efficient reserve center.",
        "Steals and threes need deliberate attention before the late rounds. Murphy supplies both at 1.5 steals and 3.2 threes; Anunoby is another way to keep a big-led opening from becoming one-dimensional. Wallace can repair steals later, but his 8.6 points make that choice harder if the offense is already weak. Low-turnover wings are useful finishing pieces, not substitutes for establishing points early. There is no reward for winning rebounds by a huge margin while conceding assists, steals, threes and free throws."
      ]
    },
    {
      "id": "draft",
      "heading": "Draft the complement, not another copy",
      "body": [
        "These targets assume a 12-team snake draft. The first three rounds should establish enough scoring and an identifiable frontcourt plan. After Wembanyama, consider efficient offense or shooting rather than reflexively taking the next center. After Edwards, Towns supplies boards and free throws while Holmgren offers stronger FG% and blocks. Kawhi can solve scoring and steals together, but stacking him with other availability risks makes a theoretical category advantage much less dependable.",
        "The middle rounds are where the market and our rankings differ most usefully. Murphy is 24th for us against ADP 40, Markkanen 20th against 39, and Bane 38th against 53. Those are reasons to have alternatives ready, not reasons to assume all three fall to the same team. Conversely, Brown's ADP near 28 is more expensive than our No. 42 valuation even before accounting for this build's turnover and FT% concerns. Bane belongs in the fifth-round queue and Reid in the sixth; their old placements a round later were too optimistic.",
        "The live board removes assists from corrected 2025-26 production and is historical, not a 2026-27 projection. The written notes compare that baseline with our projected Top 150, Yahoo ADP saved September 26 and Yahoo standard pre-ranks checked October 3. ADP has not been refreshed to October 3. Pre-rank affects who appears near the top of the draft room and can make a player go well before the older average; it is not another name for ADP.",
        "After pick 100, choose the missing category rather than following a fixed list. Wallace is a steals purchase, Bey supplies scoring with low turnovers, and Queta is a conditional efficiency-and-rebounding option. Washington, Champagnie, Queta and Brooks are fallbacks only if they slip beyond the prices that make them less appealing on our board. The late round labels describe when we would consider them, not a claim that their ADPs predict they will still be available."
      ]
    }
  ],
  "buildingBlocks": [
    {
      "name": "Enough offense to afford specialists",
      "note": "Secure points before relying on Clingan or Wallace. Markkanen's 26.6 points with 1.5 turnovers illustrate the ideal offensive shape, but his 42 games require a plan for availability too."
    },
    {
      "name": "Bigs with different jobs",
      "note": "Towns brings rebounding and FT% volume; Holmgren brings FG% and blocks. Turner brings threes and blocks without the same rebounding or efficiency. Match the choice to the first picks rather than the position label."
    },
    {
      "name": "A real steals source and weighted percentages",
      "note": "Murphy and Anunoby can keep steals competitive without dropping threes. Check total makes and attempts before adding another poor foul shooter; a good-looking percentage on one attempt cannot cancel a weakness on seven."
    }
  ],
  "exampleTeams": [
    {
      "name": "Pick two: Wembanyama, then perimeter offense",
      "color": "#2f80ed",
      "note": "An illustrative eight-pick start at slots 2, 23, 26, 47, 50, 71, 74 and 95. Curry around his ADP is plausible but not assured with a pre-rank of 12; Murphy must slip roughly seven picks past ADP and Anunoby about four. If either goes earlier, use the same category brief rather than assume the roster is guaranteed. Summing each player's 2025-26 per-game line gives 163.1 points, 19.8 threes, 46.4 rebounds, 9.3 steals, 7.9 blocks and 15.4 turnovers, with attempt-weighted 49.0% FG and 85.3% FT. These are equal-games illustrations, not weekly forecasts or proof of category wins. Rebounding is the clearer remaining need than more blocks. Curry's 43 games and Wembanyama's 64 make usable depth important despite Bane and Bridges each playing 82.",
      "roster": [
        "Victor Wembanyama",
        "Stephen Curry",
        "Chet Holmgren",
        "Trey Murphy III",
        "Desmond Bane",
        "OG Anunoby",
        "Mikal Bridges",
        "Norman Powell"
      ]
    },
    {
      "name": "Pick eight: Edwards with complementary bigs",
      "color": "#16a085",
      "note": "Slots 8, 17, 32, 41, 56, 65, 80 and 89 give each pick a plausible September 26 ADP range; Towns and Kawhi still need to last a few picks beyond their averages, and Yahoo's higher pre-ranks can prevent that. The eight historical per-game lines total 158.1 points, 17.5 threes, 55.5 rebounds, 8.8 steals, 6.9 blocks and 15.8 turnovers. Aggregate makes divided by attempts give 49.2% FG and 82.8% FT, not an average of eight percentages. Towns and Kawhi help contain Edwards' and Clingan's foul-line costs, but another poor shooter would weaken that balance. Look for steals and FT% support next rather than another rebounding specialist. Edwards played 61 games, Kawhi 65 and Porter 52, so these totals should not be mistaken for guaranteed weekly output.",
      "roster": [
        "Anthony Edwards",
        "Karl-Anthony Towns",
        "Kawhi Leonard",
        "Donovan Clingan",
        "Michael Porter Jr.",
        "Matas Buzelis",
        "Mikal Bridges",
        "Jaden McDaniels"
      ]
    }
  ],
  "roundTargets": [
    {
      "round": 1,
      "candidates": [
        {
          "name": "Victor Wembanyama",
          "yahooAdp": 1.6,
          "yahooPreRank": 3,
          "note": "The appeal is not simply that you can ignore his assists. Wembanyama gives you enough rim protection to stop drafting every center as a blocks specialist: his 3.1 blocks were more than Holmgren and Clingan supplied individually, alongside 25.0 points and 11.5 rebounds. That freedom matters when the next turns offer shooting wings instead of bigs. His 82.7% free throws on 7.0 attempts also keep the line playable, unlike many rebounding anchors. Our No. 2 ranking and Yahoo's near-second-pick cost leave no hidden discount. You are buying the foundation, then using the punt to widen your later choices. After a 64-game season, dependable perimeter minutes matter more than assembling another collection of high-upside injury bets."
        },
        {
          "name": "Anthony Edwards",
          "yahooAdp": 8.3,
          "yahooPreRank": 6,
          "note": "An Edwards start should look different from a Wembanyama start. You already have 28.8 points and 3.4 threes, but five rebounds and 0.8 blocks do not remove the need for a frontcourt. Towns can supply the boards without making free throws worse; Holmgren is the better next step if blocks and FG% are the priority. The important catch is Edwards' 79.6% on 7.2 free-throw attempts. That volume matters considerably more than a reserve center missing an occasional foul shot. His 61 games also make the old durability reputation a poor substitute for planning. Near pick eight, he is a sensible scoring anchor, not permission to ignore percentages because assists have disappeared."
        },
        {
          "name": "Jayson Tatum",
          "yahooAdp": 9.8,
          "yahooPreRank": 14,
          "note": "Tatum is a recovery bet first and a punt-assists fit second. Ten rebounds and 2.9 threes from a forward are attractive, but the same 16-game return produced 41.1% shooting on 17.9 attempts. Removing assists does nothing to erase that field-goal damage. Nor should such a short post-Achilles sample become the forecast for an entire season. Brown's departure gives Tatum room to reclaim a larger offensive role; how efficiently and consistently he handles it is the question. Our board places him 13th against an ADP near ten, so I would rather take him around the turn than move him ahead of Edwards for this build. Follow with efficiency and reliable production rather than another recovery story."
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
          "note": "Towns lets an Edwards-led team catch up in rebounds without sacrificing the foul line. His 11.9 boards came with 85.8% free throws on 5.5 attempts, a genuinely useful contribution rather than a good percentage on negligible volume. There is a reason to choose him over Clingan even if you intend to ignore assists: Towns also brings 20.1 points and 1.5 threes. What he does not bring is a defensive anchor's block total. Half a block per game leaves that job for Holmgren, Buzelis or another later pick. At roughly pick 15 he costs slightly more than our No. 17 valuation, so the category fit should be doing real work. Do not pay that price merely because he qualifies at center."
        },
        {
          "name": "Kevin Durant",
          "yahooAdp": 16.9,
          "yahooPreRank": 27,
          "note": "If your first pick leaves both shooting percentages vulnerable, Durant is a more convincing repair than another specialist. His 26.0 points came on 52.0% from the field and 87.4% at the line, with enough attempts in both categories to influence the team result. That is why discarding his 4.8 assists does not make him a bad selection here. There are still costs: 3.2 turnovers are not low, and 0.8 steals leave defense to someone else. Last season's 78 games were encouraging, not protection against age-related absences. His second-round ADP agrees fairly closely with our No. 18 ranking. Take him for efficient scoring, then prefer an Anunoby-type defender over another wing whose main contribution is points."
        },
        {
          "name": "Stephen Curry",
          "yahooAdp": 23.9,
          "yahooPreRank": 12,
          "note": "Curry is the exception to the idea that punt assists means avoiding expensive guards. You are paying for 4.4 threes and 92.2% free throws on 5.1 attempts, not primarily for his 4.7 assists. Those shooting contributions make a later Clingan pick much easier to accommodate and reduce the pressure to find three-point specialists in every round. The decision near the second-round turn is mostly about availability after 43 games, with 3.6 rebounds adding a separate roster constraint. Yahoo's standard pre-rank of 12 may also take him off the board well before his ADP near 24. Our No. 19 valuation supports taking the discount when it exists, not pretending it exists in every room."
        }
      ]
    },
    {
      "round": 3,
      "candidates": [
        {
          "name": "Chet Holmgren",
          "yahooAdp": 27.7,
          "yahooPreRank": 19,
          "note": "Holmgren is the cleanest way to add blocks without bringing all of a traditional center's limitations. He shot 55.7%, collected 8.9 rebounds and blocked 1.9 shots, while contributing 1.3 threes. His 79.2% free throws on 4.1 attempts are not a strength, but they are a much smaller problem than building around several genuinely poor shooters. Next to Edwards, he supplies the categories the first pick lacks. Next to Wembanyama, he creates a substantial block base and makes the next perimeter picks more urgent. The 17.1 points explain why you should not keep drafting defensive bigs afterward. Our No. 23 ranking gives him a reasonable case near his third-round ADP without needing to assume a major minutes increase."
        },
        {
          "name": "Kawhi Leonard",
          "yahooAdp": 29.3,
          "yahooPreRank": 15,
          "note": "A big-heavy opening often needs someone who can score efficiently and win steals possessions. Kawhi did both: 27.5 points, 1.8 steals, 50.8% field goals and 88.8% free throws, with only 2.0 turnovers. Few wings combine those contributions, which is why his third-round ADP looks so different from our No. 14 ranking. The September move to Toronto introduces a different offensive setting, and his age makes the 65-game season a baseline to question rather than bank. I like the fit beside a rebounder much more than beside two other availability risks. If he goes near Yahoo's pre-rank of 15, the discount has largely disappeared; at the third-round price, the upside is worth considering."
        },
        {
          "name": "Jaylen Brown",
          "yahooAdp": 27.5,
          "yahooPreRank": 95,
          "note": "Brown is a price warning, not an automatic target just because he scores more than he passes. Last season's 28.5 points and 6.9 rebounds are tempting, but 3.6 turnovers still count against you after assists are removed. So do 79.5% free throws on 7.5 attempts. Pairing him with Edwards would concentrate substantial foul-line weakness in the very players meant to carry your offense. Philadelphia's new collection of scorers also makes a repeat of his Boston workload uncertain. Our No. 42 ranking sits well below his ADP near 28, and this punt does not resolve the reasons for that gap. Let him fall rather than using a third-round pick to force the fit; Holmgren or Kawhi answers a clearer need there."
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
          "note": "Murphy keeps a center-led team from becoming a collection of rebounds and blocks with no perimeter offense. His 3.2 threes and 1.5 steals address two different shortages, and 21.5 points make him more than a specialist you tolerate to fill them. There is little hidden damage: 88.6% free throws on 3.7 attempts help, while 1.8 turnovers are modest for that offensive contribution. He will not replace an elite rebounder, and 47.0% shooting is not a FG% rescue. The value is in how many wing jobs he handles at once. Our No. 24 ranking is well ahead of his ADP near 40; Yahoo's pre-rank of 22 means waiting until the fourth round can still lose him."
        },
        {
          "name": "Lauri Markkanen",
          "yahooAdp": 38.7,
          "yahooPreRank": 18,
          "note": "Markkanen is one of the clearest examples of why this punt can work: 26.6 points, 2.7 threes and 6.8 rebounds came with just 1.5 turnovers. Removing his 2.1 assists leaves a scorer who does not need lead-guard usage to help your offense. His 89.6% free throws on 6.4 attempts are especially valuable after Edwards or before Clingan. The catch is substantial: he played 42 games, and Utah must distribute touches with Jackson in the frontcourt. Our No. 20 projection reflects the per-game appeal, while an ADP near 39 reflects the risk. I would take that fourth-round opportunity on an otherwise dependable roster, not stack it on top of a Curry-Tatum opening and call the team balanced."
        },
        {
          "name": "Donovan Clingan",
          "yahooAdp": 41.6,
          "yahooPreRank": 29,
          "note": "Clingan makes sense when you have already spent early picks on scoring. He can supply 11.5 rebounds and 1.7 blocks without asking for many possessions, and 1.2 turnovers protect a category this build should at least contest. His 1.1 threes are a welcome extra, not a reason to treat him like an offensive stretch star. The distinction between his two percentages matters: 52.1% shooting is helpful but hardly dominant center efficiency, while 69.2% free throws came on only 2.5 attempts. A strong shooting backcourt can absorb that; adding another poor foul shooter is where the trouble begins. Around pick 42, he is a more useful complement to Edwards and Towns than a third big after Wembanyama and Holmgren."
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
          "note": "Bane is the practical answer when an attractive big has put your free throws under pressure. His 90.8% on 4.2 attempts provides meaningful support, and 48.3% shooting means you are not trading that repair for a new FG% problem. He also played all 82 games, a valuable counterweight to a riskier early selection. The tradeoff is ceiling in individual counting categories: 20.1 points and 2.0 threes help, but he does not shoot like Porter or steal the ball like Kawhi. That is fine when the surrounding picks already carry those jobs. Our No. 38 ranking makes his ADP near 53 appealing; he belongs in the fifth-round plan, not on a list that assumes he survives comfortably into the sixth."
        },
        {
          "name": "Jaren Jackson Jr.",
          "yahooAdp": 50.5,
          "yahooPreRank": 54,
          "note": "Jackson is useful when your first few picks bought points and free throws but left you short of blocks. His 19.4 points, 1.8 threes and 80.3% foul shooting make him easier to accommodate than a low-scoring rim protector. Be careful about buying the reputation instead of the recent line, though: 1.4 blocks and 5.7 rebounds do not make him a frontcourt all by himself. He also played only 48 games before a season-ending knee procedure. Utah's pairing with Markkanen gives him a different setting, not a guaranteed return to his defensive peak. Near his fifth-round ADP, I would use him to add blocks to an established rebounding base rather than expect him to supply both."
        },
        {
          "name": "Michael Porter Jr.",
          "yahooAdp": 59.6,
          "yahooPreRank": 55,
          "note": "Porter can solve the awkward middle-round choice between a three-point shooter and a rebounder. Brooklyn's larger offensive role produced 24.2 points, 3.4 threes and 7.1 boards, enough to help an early defensive-big build without adding another center. That does not make him an efficiency anchor: 46.3% on 18.4 field-goal attempts carries real weight, even though 85.9% free throws are useful. The 52-game season is the larger reason not to treat our No. 40 ranking as guaranteed profit at an ADP near 60. I prefer him when points and rebounds are both missing; Murphy offers more steals, and Bane offers a stronger recent availability record. The punt removes a weakness, not those choices."
        },
        {
          "name": "Nickeil Alexander-Walker",
          "yahooAdp": 60.1,
          "yahooPreRank": 24,
          "note": "Alexander-Walker's Atlanta season gave this build something more useful than another low-assist role player: real perimeter scoring with foul-line support. He averaged 20.8 points and 3.2 threes, shot 90.2% on 3.9 free-throw attempts and added 1.3 steals. That combination can balance an opening built around Holmgren and another rebounder. His 45.9% field-goal shooting and 3.4 boards make him less suitable if efficiency and rebounding are already weak. He played 78 games, a useful contrast with several of the higher-ceiling wings nearby. Our No. 36 valuation supports interest near his ADP of 60, but Yahoo's pre-rank of 24 can make him much more expensive. Do not budget him as a guaranteed fifth-round bargain."
        }
      ]
    },
    {
      "round": 6,
      "candidates": [
        {
          "name": "Matas Buzelis",
          "yahooAdp": 61.9,
          "yahooPreRank": 34,
          "note": "Buzelis offers a different route to blocks than drafting another center. His 1.5 blocks came with 2.2 threes and 16.3 points, so a Towns-led frontcourt can add rim protection without giving up all its shooting. Jackson supplied a similar mix at a higher price, although their health and role risks differ. Buzelis is not yet the finished, low-turnover forward this build might ideally want: he shot 46.3% and committed 2.1 turnovers, with only 0.7 steals. Chicago's changed roster leaves room for development, but a larger scoring role should remain upside rather than the purchase price. Our No. 59 ranking is close to his ADP near 62; Yahoo's pre-rank of 34 asks for considerably more improvement."
        },
        {
          "name": "OG Anunoby",
          "yahooAdp": 66.6,
          "yahooPreRank": 60,
          "note": "Anunoby becomes especially valuable after you realize that your excellent centers are contributing fewer steals than expected. His 1.6 steals, 0.7 blocks and 2.3 threes provide defensive coverage without turning the wing spot into an offensive sacrifice. He also shot 48.4%, useful next to a less efficient volume scorer. The limitation is how much offense you can ask him to replace: 16.7 points will not cover for missing an early scoring anchor, and his 82.8% free throws are supportive rather than transformative. At a sixth-round price against our No. 49 ranking, he is a sensible complement to Wembanyama or Holmgren. I would prioritize him over another rebounding specialist when steals are the category keeping the roster from working."
        },
        {
          "name": "Naz Reid",
          "yahooAdp": 62.5,
          "yahooPreRank": 52,
          "note": "Reid's shooting can be useful, but calling him a center does not make him an efficiency pick. Last season's 2.1 threes, 6.2 rebounds and roughly one steal and one block came with 45.6% field goals and 73.2% free throws. The foul-line damage is limited by just 1.6 attempts; the field-goal percentage matters more across 11.3 shots. Charlotte offers a new opportunity, though a larger role does not automatically improve either rate. His ADP near 63 places him in the sixth-round discussion, close to our No. 63 valuation, rather than making him a seventh-round bargain. Choose him when threes and mixed defensive production are missing; Ware is the clearer rebounding choice if your shooting is already covered."
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
          "note": "Bridges is how a high-usage opening can get some of its turnover advantage back. He averaged only 1.0 giveaway while providing 1.9 threes, 1.3 steals and 0.8 blocks, a useful spread beside scorers who cannot offer the same restraint. His 49.0% shooting helps too. The 82-game season is a reason to prefer him after an injury-risk pick, not a promise that availability repeats. There is also a clear limit: 14.4 points and 3.8 rebounds will not rescue those categories. Our No. 60 ranking makes the seventh-round ADP attractive, but Yahoo's pre-rank of 41 may bring earlier competition. If a room takes him there, look for a cheaper complement rather than paying as though he were a primary scorer."
        },
        {
          "name": "Kel'el Ware",
          "yahooAdp": 73.2,
          "yahooPreRank": 51,
          "note": "Nine rebounds with only 0.8 turnovers is a useful way to finish a frontcourt that already has its scorers. Ware also made 1.2 threes and blocked 1.1 shots, so the contribution is not confined to boards. His 74.0% free throws sound worse than their actual impact: he attempted just 1.2 a game, much easier to absorb than a high-volume poor shooter. The July move to Milwaukee makes the next workload uncertain, especially with Turner another frontcourt option. More minutes could help the counting stats but would also expose more of the foul-line weakness. Around his ADP of 73, slightly later than our No. 66 ranking, I like him as a rebounding supplement rather than the team's only dependable source of blocks."
        }
      ]
    },
    {
      "round": 8,
      "candidates": [
        {
          "name": "Jaden McDaniels",
          "yahooAdp": 89.2,
          "yahooPreRank": 43,
          "note": "McDaniels is a useful answer to the team that has enough scorers but still needs defensive stats from a wing. His 1.1 steals and 1.0 blocks came with 51.5% shooting, which separates him from late defenders whose percentages create another repair job. The cost is shooting volume: 1.4 threes are well below Murphy, Anunoby or Powell, and 14.8 points do not replace a featured scorer. Minnesota's addition of LaMelo changes the offensive mix, so I would buy the established defensive profile rather than predict a scoring jump. Our No. 78 ranking supports an eighth-round selection near his ADP of 89. Yahoo's pre-rank of 43 is a very different bet and too aggressive for this particular role."
        },
        {
          "name": "Norman Powell",
          "yahooAdp": 92.4,
          "yahooPreRank": 115,
          "note": "Powell is useful precisely because the late rounds usually make you choose between scoring and an otherwise playable line. His 21.7 points and 2.7 threes came on 47.0% shooting, with 82.7% free throws rather than an obvious percentage punt attached. His 2.5 assists are irrelevant here, but the 3.5 rebounds and 0.2 blocks still explain what teammates must provide. Chicago is a new setting, and 58 games mean last season's scoring rate should not be confused with full-season reliability. At an ADP near 92 against our No. 81 ranking, he can finish the offense after early bigs. If points are already comfortable and defense is not, McDaniels is the more useful selection even with the smaller scoring average."
        },
        {
          "name": "Jabari Smith Jr.",
          "yahooAdp": 94.1,
          "yahooPreRank": 84,
          "note": "Smith is the middle ground between a rebounding center and a pure shooting wing. He contributed 6.9 boards and 2.3 threes, with 0.9 blocks giving a Towns-led roster some extra protection. The 77-game season also provides more recent workload evidence than several similarly priced forwards. Do not mistake that versatility for clean percentages, though: 45.0% shooting on 12.6 attempts and 77.5% free throws do not repair either category. Houston's crowded frontcourt makes a major scoring leap difficult to assume. Near pick 94, he suits a roster that needs boards without losing threes; an already inefficient team should be more interested in McDaniels' shooting or a genuine FG%-positive center."
        }
      ]
    },
    {
      "round": 9,
      "candidates": [
        {
          "name": "Andrew Wiggins",
          "yahooAdp": 100.7,
          "yahooPreRank": 103,
          "note": "Wiggins gives a late wing slot enough of everything to matter when your remaining needs are scattered. Two threes, 1.1 steals and 1.0 blocks are useful together, particularly if the early bigs covered rebounds but not steals. His 15.4 points and 47.5% shooting are respectable support rather than something to build the offense around. Giannis' arrival in Miami is a reason to be cautious about projecting more shots, not a reason to erase the defensive contribution. Our No. 86 ranking leaves some room at an ADP near 101. Compared with McDaniels, Wiggins offers more threes but a less favorable field-goal rate; choose according to the actual shortage rather than treating the two defensive wings as interchangeable."
        },
        {
          "name": "Myles Turner",
          "yahooAdp": 100.3,
          "yahooPreRank": 108,
          "note": "Turner is an unusual late center because the threes and blocks are much more helpful than the traditional big-man categories. His 2.1 threes and 1.6 blocks can complete a roster, but 44.0% shooting and 5.3 rebounds can also disappoint a manager who drafts the position instead of the line. The 74.0% free throws on 2.5 attempts add another cost. Milwaukee's changed frontcourt, including Ware, makes it unwise to assume every old minute carries over. At roughly pick 100, he is worth considering if your early rebounders already protect FG% and the line. If those are the holes you still need to fill, taking Turner because you need a center solves the wrong problem."
        }
      ]
    },
    {
      "round": 10,
      "candidates": [
        {
          "name": "Toumani Camara",
          "yahooAdp": 110.1,
          "yahooPreRank": 97,
          "note": "Camara's 2.6 threes and 5.1 rebounds give you more than the usual low-usage defensive-wing contribution, and he played all 82 games. The efficiency is where the decision becomes less comfortable. His 70.7% free throws came on just 1.6 attempts, so the percentage alone exaggerates that particular problem; 44.0% field-goal shooting on 10.8 attempts is harder to hide. His 1.1 steals are useful without approaching Wallace's specialist impact. Our No. 104 ranking is close to his ADP near 110, making him a reasonable tenth-round fit rather than a major bargain. Take him when shooting and wing rebounding are the missing pieces, not when your roster needs someone to restore its percentages."
        },
        {
          "name": "Cason Wallace",
          "yahooAdp": 118.2,
          "yahooPreRank": 76,
          "note": "Wallace is the late pick to consider when all those scoring wings have left steals surprisingly ordinary. His 2.0 steals can materially change that category, and 0.9 turnovers keep him from undoing the benefit elsewhere. You must already have enough offense: 8.6 points and 1.3 threes will not patch a scoring deficit, while 43.2% field-goal shooting is another small cost. His 80.9% free throws also came on fewer than one attempt, so he cannot repair the line simply by having a respectable rate. Near pick 118, the specialist case is clear. Yahoo's pre-rank of 76 may push him earlier, where a team still missing points should prefer a fuller offensive contributor."
        },
        {
          "name": "Saddiq Bey",
          "yahooAdp": 120.1,
          "yahooPreRank": 109,
          "note": "Bey is a useful alternative to chasing a late creator whose best category you have already abandoned. He supplied 17.7 points, 2.1 threes and 5.6 rebounds with just 0.9 turnovers, keeping the offense moving without much statistical waste. His 84.1% free throws on 4.1 attempts are also substantial enough to matter, unlike the tidy percentages attached to many low-volume reserves. What you give up is rim protection: 0.1 blocks make him a poor choice if the frontcourt is still incomplete. Our No. 102 ranking leaves room near his ADP of 120. Compared with Powell, he offers less scoring but more rebounding and fewer turnovers, a worthwhile trade when the early rounds already supplied your points."
        },
        {
          "name": "Devin Vassell",
          "yahooAdp": 116.5,
          "yahooPreRank": 122,
          "note": "Vassell can add shooting without the turnover bill that usually accompanies a guard pick. He made 2.5 threes and averaged only 0.9 turnovers, so an already productive offense can use him without trying to turn him into its playmaker. The restraint does not make the whole line efficient: 43.7% from the field on 11.3 attempts remains a cost, and 0.9 steals are not a defensive solution. His 13.9 points also trail the late scoring alternatives. With our No. 121 ranking close to his ADP near 117, this is a needs-based selection rather than a discount to chase. Pick him over Champagnie for more scoring; pick Champagnie if the same roster spot needs to help rebounding."
        }
      ]
    },
    {
      "round": 11,
      "candidates": [
        {
          "name": "P.J. Washington",
          "yahooAdp": 115.8,
          "yahooPreRank": 178,
          "note": "Washington is a fallback when rebounds and defensive stats matter more than another shooter. Seven boards, 1.0 steals and 1.1 blocks offer useful coverage from a forward, but the percentages make him a poor default punt-assists target. He shot 45.0% from the field and 68.7% on 3.3 free-throw attempts; pairing him with Clingan can turn a manageable weakness into a second punt. The 56-game season is another reason not to pay for the best possible version of his line. Our No. 124 ranking is below his ADP near 116. I would consider him if he slips into the eleventh round and the roster can absorb both rates, rather than take him early merely because he barely passes."
        },
        {
          "name": "Julian Champagnie",
          "yahooAdp": 110.9,
          "yahooPreRank": 128,
          "note": "Champagnie makes sense after a scoring-heavy opening that still needs rebounding from a wing. He contributed 5.8 boards and 2.4 threes with just 0.8 turnovers, a different late-round balance from Vassell's greater scoring and lighter rebounding. His 82 games are encouraging, but 11.1 points and 43.7% shooting explain why that availability did not turn him into a must-draft player. Nor can 84.4% free throws on 1.6 attempts carry the team at the line. Yahoo's ADP near 111 is ahead of our No. 131 ranking. That makes this an eleventh-round fallback if available, not a recommendation to reach in the tenth for a profile whose usefulness depends heavily on the surrounding roster."
        },
        {
          "name": "Neemias Queta",
          "yahooAdp": 115.2,
          "yahooPreRank": 116,
          "note": "Queta can repair FG% without requiring a high-usage offensive role. His 65.3% shooting came on 6.6 attempts, alongside 8.4 rebounds and 1.3 blocks, which is useful after several perimeter picks. The difference from Ware is spacing: Queta offered essentially no threes, and 70.3% free throws on 2.3 attempts make the surrounding shooters important. Boston's addition of Mitchell Robinson is also a direct reason to question how much of last season's workload repeats. That helps explain why our No. 138 ranking is less enthusiastic than his ADP near 115. Consider him if he slides and traditional center production is your remaining need; do not assume the historical board guarantees the same minutes or use him as a cheap offensive fix."
        }
      ]
    },
    {
      "round": 12,
      "candidates": [
        {
          "name": "Moses Moody",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "Moody is a final-pick shooting option, not a player to move up just because assists are missing from his line. His 2.5 threes and 0.9 turnovers are useful beside high-usage scorers, and roughly one steal gives him something beyond shooting. But 12.1 points, 3.3 rebounds and 44.1% field goals leave plenty of work to teammates. He played 60 games, and the next rotation still needs to support enough minutes for those threes to matter. Our No. 141 ranking fits an end-of-draft approach; there is no reliable Yahoo ADP in the saved snapshot to justify a precise market claim. If his role looks smaller, use the slot for a player with a clearer path to playing time."
        },
        {
          "name": "Jay Huff",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "Huff is appealing if the last roster spot needs blocks without surrendering every three-pointer. He averaged 1.9 blocks and 1.5 threes, an uncommon combination even among more expensive centers. What he did not provide was conventional center volume: 4.0 rebounds and 9.5 points leave him far from a complete frontcourt answer. Indiana now has Zubac, so repeating the workload behind those numbers is the central uncertainty. His 82-game season tells you he was available, not that the next rotation owes him the same opportunity. With no reliable Yahoo ADP in the snapshot, keep him as a final-pick option. A roster that already has Wembanyama and Holmgren is more likely to need a rebounder or steals source."
        },
        {
          "name": "Dillon Brooks",
          "yahooAdp": 114.9,
          "yahooPreRank": 171,
          "note": "Brooks shows why low assists are not enough to qualify as a good pick for this strategy. The attractive 20.2 points and 2.3 threes came with 43.5% shooting on 17.1 attempts, enough volume to pull against the efficient bigs you drafted earlier. His 84.2% free throws help, but only 3.6 rebounds and 0.2 blocks leave the contribution narrow. Our No. 143 ranking is much less optimistic than his ADP near 115, so this is a late fallback rather than someone to chase at market price. If scoring is still short and FG% is well protected, he has a purpose. Otherwise, Bey's boards and lower turnovers or Wallace's steals are more useful ways to finish the roster."
        }
      ]
    }
  ],
  "faqs": [
    {
      "q": "Do I have to avoid every good passer?",
      "a": "No. Ignore assists when deciding whether the remaining production is worth the price. Curry's threes and free throws can justify a pick without his passing. What you want to avoid is paying a premium mainly for assists, then discovering the player does not provide enough of the categories you still need."
    },
    {
      "q": "Why not just draft centers and low-assist wings?",
      "a": "Because their weaknesses can overlap. Towns supplies rebounds but few blocks; Turner supplies blocks and threes but weak FG% and modest boards. Shooting wings can still damage FG%, and low assists do not guarantee low turnovers. Build around complementary contributions rather than a position or an assist cutoff."
    },
    {
      "q": "Can I draft Clingan without punting free throws too?",
      "a": "Yes, provided the rest of the roster supports it. His 69.2% came on 2.5 attempts per game, so high-volume strong shooters can offset the damage. Add the roster's makes and attempts to check the result. Combining him with several other poor shooters is a different decision from absorbing him alone."
    },
    {
      "q": "What changes in eight-category leagues?",
      "a": "Turnovers disappear, so low-turnover players lose one of their advantages. Markkanen's scoring and shooting remain useful, but the reason to favor a quiet role player over a higher-usage scorer is weaker. Reassess the seven categories left after assists rather than copying this nine-category queue."
    },
    {
      "q": "Are the sample teams weekly projections?",
      "a": "No. They sum eight players' corrected 2025-26 per-game production, giving each the same number of appearances, and weight percentages by attempts. Actual weekly results depend on schedules, availability, lineup limits and changing roles. The pick sequences demonstrate plausible draft paths, not guaranteed availability or category wins."
    }
  ]
};

export const PUNT_FG = {
  "slug": "punt-fg",
  "type": "punt",
  "puntKey": "fg",
  "title": "Punt FG%",
  "season": CONTENT_SEASON,
  "difficulty": "Intermediate",
  "isPremium": true,
  "tagline": "Buy the offense others discount, then spend deliberately on boards, blocks and the foul line.",
  "strengths": [
    "pts",
    "3pm",
    "ast",
    "ft"
  ],
  "weaknesses": [
    "fg",
    "reb",
    "blk",
    "to"
  ],
  "freeSections": 2,
  "board": {
    "minGames": 30,
    "freeLimit": 20,
    "previewRows": 4
  },
  "sections": [
    {
      "id": "strategy",
      "heading": "What removing FG% actually buys you",
      "body": [
        "Punt FG% is a head-to-head nine-category strategy for a team whose strengths justify accepting a likely loss in field-goal percentage. It is not a contest to find the league's worst shooters. Removing a category makes Derrick White's misses irrelevant, but it does not make every low-percentage guard valuable or every efficient center wasteful. The draft decision is whether the other eight categories are worth the price. In roto, deliberately finishing near the bottom in one column carries a season-long standings cost, so the same approach is much less forgiving.",
        "Luka is an obvious starting point because 33.4 points, 4.0 threes, 7.7 rebounds and 8.2 assists give you so much offense in one pick. The more important follow-up question is what he leaves exposed. His 78.0% free throws came on ten attempts per game, and his 4.0 turnovers remain on the scorecard. You cannot assume a guard-led roster wins FT% or that conceding one shooting category gives you permission to ignore another. Maxey offers a different foundation: 89.2% free throws, 1.9 steals and fewer turnovers, but considerably less rebounding.",
        "White illustrates the direct benefit more clearly than many stars. His 39.5% field-goal shooting on 14.4 attempts is a substantial penalty in a balanced team; here you keep 2.7 threes, 5.4 assists and 1.3 blocks without carrying it. Conversely, Towns and Holmgren can still be excellent choices even though their positive FG% is discarded. Their rebounding or shot blocking may solve a problem another discounted guard only makes worse."
      ]
    },
    {
      "id": "correlation",
      "heading": "The categories that still need work",
      "body": [
        "Points, threes and assists are accessible through perimeter scorers, but there is little benefit in dominating all three while conceding rebounds, blocks, turnovers and FG%. Establish enough creation to compete, then use later picks to address the actual gaps. White can supply blocks from a guard slot, Murphy contributes steals without another high-turnover role, and Hart adds wing rebounding. None is a universal answer: White is not an elite scorer, Murphy is not a rim protector, and Hart does little for blocks.",
        "Rebounds and blocks must be evaluated separately. Towns averaged 11.9 rebounds and only 0.5 blocks; Turner supplied 1.6 blocks but just 5.3 boards. Taking one does not finish the frontcourt. Sarr offers 7.4 rebounds and 2.0 blocks, but his 69.2% free throws on 3.0 attempts introduce another cost. A center who no longer helps your punted percentage can still be worth drafting for those remaining contributions. A stretch center who fails to rebound cannot be assumed to solve the problem merely because he fills the position.",
        "Free-throw impact depends on attempts as well as accuracy. Curry's 92.2% on 5.1 attempts and Bane's 90.8% on 4.2 provide real support, but Luka's ten attempts mean one good shooter may not settle the category. Compare total makes with total attempts across the roster; averaging individual percentages hides who actually controls the result. Low-volume weakness is different too: Ware's 74.0% came on 1.2 attempts, whereas Washington's 68.7% came on 3.3.",
        "Turnovers are the other common accidental punt. Harden's 3.5 and Booker's 3.2 remain costs even after their field-goal rates stop mattering. Bridges, Wallace and Bey can add useful categories with roughly one turnover each, but a few careful late picks cannot guarantee they will undo any high-usage opening. In eight-category leagues this constraint disappears, making another creator more attractive. Rebounding, blocks and the foul line still need the same scrutiny."
      ]
    },
    {
      "id": "draft",
      "heading": "Where to spend, and where to stop chasing guards",
      "body": [
        "These targets assume a 12-team snake draft. Use the first three rounds to establish creation and at least a credible frontcourt plan. After Luka, Curry or Reaves can help the foul line while Holmgren supplies blocks. After Maxey, Towns can address rebounding without surrendering FT%. An Edwards start needs more passing than either of those openings. Harden is a better complement there than he is to a team already overloaded with assists and turnovers.",
        "Compare category fit with the projected Top 150 rather than replacing the ranking with a list of inefficient shooters. White is 29th for us at ADP 47, Murphy 24th at 40 and Bane 38th at 53. Those are useful opportunities if the room allows them. LaMelo's ADP near 26 and Trae's near 27 are much more aggressive than our respective rankings of 48 and 55. Removing FG% improves their fit, but it does not settle the usage, health and remaining-category questions behind those gaps. They are price-sensitive alternatives, not required purchases.",
        "Miller's ADP of 47 belongs in the fourth-round discussion, alongside White, rather than a plan that assumes both reach the fifth. In the middle rounds, choose the job you have not filled: Sarr or Buzelis for blocks, Porter for scoring with wing rebounds, Anunoby for steals and complementary defense. The late market still offers Turner for blocks and threes, Hart for boards and passing, or Allen for shooting and steals. Those options overlap in price, not in purpose.",
        "The round targets retain Yahoo ADP saved September 26 and use standard pre-ranks checked October 3; the ADP is not a newly refreshed October 3 average. A high pre-rank can bring earlier draft-room attention even when the older ADP is later. The live punt board removes FG% from corrected 2025-26 production, while the Top 150 is a forward-looking projection. New information can also override an old price: Porziņģis is now a conditional final-pick stash here, not a ninth-round recommendation. Late listings for Washington or players without an ADP are decision thresholds, not promises of availability."
      ]
    }
  ],
  "buildingBlocks": [
    {
      "name": "Creation with an explicit FT% plan",
      "note": "Luka supplies the offensive base but shot 78.0% on ten free throws a game. Maxey starts with stronger FT% and steals; Edwards needs more passing. The same second-round guard is not equally useful after all three."
    },
    {
      "name": "Rebounds and blocks treated separately",
      "note": "Towns' 11.9 boards do not replace Holmgren's rim protection. Turner can add blocks and threes later, but his 5.3 rebounds leave a different hole. Pick the actual category contribution, not just the center eligibility."
    },
    {
      "name": "Support without more high-usage costs",
      "note": "Anunoby adds steals, Bridges adds mixed defense with low turnovers, and Bane supplies real foul-line volume. These picks can improve the roster more than another inefficient guard whose best categories are already covered."
    }
  ],
  "exampleTeams": [
    {
      "name": "Pick four: Luka with shooting and defensive support",
      "color": "#8e44ad",
      "note": "An illustrative start at picks 4, 21, 28, 45, 52, 69, 76 and 93. Curry is plausible near his ADP but may go much earlier at pre-rank 12; Holmgren and Anunoby need small slips, and White is not guaranteed to last to 45. Bane replaces another injury-risk big here to strengthen FT% and passing. Summing the eight corrected 2025-26 per-game lines gives 156.7 points, 20.2 threes, 45.1 rebounds, 34.8 assists, 9.6 steals, 6.3 blocks and 16.9 turnovers. Aggregate free-throw makes divided by attempts yield 83.3%, showing that even Curry and Bane do not make Luka's volume irrelevant. These equal-games totals are not weekly forecasts or proof of category wins. Rebounding is still the clearest need, with blocks worth reinforcing too. Avoid solving that through several poor foul shooters, and account for Curry's 43 games rather than assuming this lineup is always available.",
      "roster": [
        "Luka Dončić",
        "Stephen Curry",
        "Chet Holmgren",
        "Derrick White",
        "Desmond Bane",
        "OG Anunoby",
        "Mikal Bridges",
        "Josh Hart"
      ]
    },
    {
      "name": "Pick nine: Maxey with boards and a second creator",
      "color": "#c2185b",
      "note": "Picks 9, 16, 33, 40, 57, 64, 81 and 88 produce a plausible September 26 ADP path. Towns and Bridges need only small slips; taking White at 40 and Hart at 88 means drafting them before their averages, not assuming bargains everywhere. The historical per-game totals are 154.9 points, 19.4 threes, 49.2 rebounds, 36.5 assists, 9.2 steals, 5.7 blocks and 17.5 turnovers, with attempt-weighted 85.7% FT. Compared with the Luka example, the lineup buys more boards and foul-line support but has less rim protection. A later Turner-type pick answers the block need better than another shooting guard, provided his remaining FT% cost fits. These are equal-appearance illustrations, not projected weekly results; Porter's 52 games and Philadelphia's changed offense are reasons to stress-test the attractive totals.",
      "roster": [
        "Tyrese Maxey",
        "Karl-Anthony Towns",
        "James Harden",
        "Derrick White",
        "Michael Porter Jr.",
        "Matas Buzelis",
        "Mikal Bridges",
        "Josh Hart"
      ]
    }
  ],
  "roundTargets": [
    {
      "round": 1,
      "candidates": [
        {
          "name": "Luka Dončić",
          "yahooAdp": 3.5,
          "yahooPreRank": 5,
          "note": "Luka lets you spend the next rounds fixing the roster rather than searching for its offense. His 33.4 points, 4.0 threes and 8.2 assists cover the guard categories, while 7.7 rebounds give you a head start on a weakness most perimeter builds must address later. The punt is not a free pass for the rest of the line, though. He shot 78.0% on ten free-throw attempts and committed 4.0 turnovers, so taking several more high-usage players can leave you conceding three categories instead of one. Our No. 4 ranking matches his early draft cost. Follow him with real foul-line volume and a plan for blocks, not another scorer simply because you no longer care about misses."
        },
        {
          "name": "Tyrese Maxey",
          "yahooAdp": 8.8,
          "yahooPreRank": 4,
          "note": "Maxey offers a cleaner foul-line and turnover foundation than Luka, although he gives you much less rebounding. His 28.3 points and 6.6 assists came with 89.2% free throws on 6.0 attempts and 2.4 turnovers. The 1.9 steals are another important distinction: you are not spending a first-round pick on offense and leaving every defensive category for later. Philadelphia's additions of LeBron and Brown make another season with the same shot and creation volume uncertain. Our No. 9 ranking accounts for that more conservatively than Yahoo's pre-rank of four. Near his ADP of nine, I like him as a foundation for Towns or Holmgren next; another expensive guard should address a specific shortage rather than duplicate what is already strong."
        },
        {
          "name": "Anthony Edwards",
          "yahooAdp": 8.3,
          "yahooPreRank": 6,
          "note": "Edwards is a scoring anchor who can work in this build, not a player whose biggest weakness disappears when you remove FG%. He actually shot 48.9% while supplying 28.8 points and 3.4 threes. The remaining issue is 79.6% free throws on 7.2 attempts, with only 3.7 assists compared with the best early creators. That makes Harden a more useful offensive complement than another scorer with little passing, provided you also budget for rebounds and blocks. His 61 games are a further reason to avoid treating the opening pick as automatic availability. Our No. 6 valuation supports interest around his ADP of eight, but the follow-up picks must protect the line and establish assists."
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
          "note": "Towns is worth considering even though his positive FG% goes unused. Finding 11.9 rebounds without a large free-throw penalty is difficult, and his 85.8% on 5.5 attempts can support a guard-led roster rather than drag against it. The 1.5 threes help you keep shooting while finally spending an early pick on size. What he cannot do is cover the whole frontcourt: 0.5 blocks leave that job to someone else. White, Buzelis or Turner becomes more important after a Towns selection, not less. His ADP near 15 is slightly ahead of our No. 17 ranking, so take him because rebounding and the foul line need him, not because every punt-FG% team must draft a particular center."
        },
        {
          "name": "Stephen Curry",
          "yahooAdp": 23.9,
          "yahooPreRank": 12,
          "note": "Curry gives you enough three-point volume to consider non-shooters later without immediately losing the category. His 4.4 threes came with 26.5 points and 92.2% free throws on 5.1 attempts, especially useful after Luka's heavy foul-line volume. He does not solve everything a guard-led opening needs: 4.7 assists are helpful rather than dominant, 3.6 rebounds leave work for the frontcourt, and 2.8 turnovers still count. The 43-game season is the main reason to be selective about the next risks. Our No. 19 valuation supports a late-second selection, but Yahoo's pre-rank of 12 may erase that opportunity. If he goes earlier, do not abandon your rebounding plan trying to reproduce his shooting with several more guards."
        },
        {
          "name": "Austin Reaves",
          "yahooAdp": 22.3,
          "yahooPreRank": 17,
          "note": "Reaves belongs here because foul-line volume and creation still matter even when his good field-goal shooting does not. He supplied 22.9 points, 5.5 assists and 86.8% free throws on 7.1 attempts, enough volume to provide meaningful support after Luka. LeBron's departure creates a route to more offensive responsibility, which is part of the case behind our No. 12 projection against an ADP near 22. It remains a projection: Reaves played 51 games, and 2.9 turnovers already accompanied the smaller role. His 2.3 threes and 0.4 blocks also make him a different purchase from Curry or White. Take the second-round opportunity if it fits, then look for defense and rebounding rather than another bet on expanding usage."
        }
      ]
    },
    {
      "round": 3,
      "candidates": [
        {
          "name": "Chet Holmgren",
          "yahooAdp": 27.7,
          "yahooPreRank": 19,
          "note": "Passing on Holmgren because he shoots too well misunderstands the punt. The reason to take him is 8.9 rebounds, 1.9 blocks and 1.3 threes with only 1.6 turnovers, a combination that lets the next roster spot remain a wing or guard. His 55.7% FG is value you give up, but the remaining categories can still be more useful than another inefficient scorer's. Be realistic about the foul line: 79.2% on 4.1 attempts is not a category repair after Luka or Edwards. At a third-round price against our No. 23 ranking, he is a sensible defensive anchor if strong FT% volume is already in place. Next to Towns he covers a different job; next to another elite blocker he may be less urgent."
        },
        {
          "name": "James Harden",
          "yahooAdp": 35.1,
          "yahooPreRank": 49,
          "note": "Harden is most useful when the first picks have supplied scoring but not enough passing or free-throw volume. His 7.9 assists, 3.0 threes and 88.2% free throws on 7.4 attempts answer those needs directly, and removing his 43.2% shooting makes the line much easier to use. The question is whether your roster can afford 3.5 turnovers on top of what it already has. After Edwards, Harden fills a real creation gap; after Luka and another high-usage guard, he may strengthen categories you already lead while exposing turnovers further. Cleveland's shared backcourt also makes unchanged usage an assumption. Our No. 26 ranking supports a third-round pick near ADP 35, not a rule to draft him regardless of the opening."
        },
        {
          "name": "Devin Booker",
          "yahooAdp": 26.9,
          "yahooPreRank": 40,
          "note": "Booker's strongest contribution here may be his trips to the line, not his jump shooting. He made 87.3% of 8.1 free-throw attempts while averaging 26.1 points and 6.0 assists. That is substantial FT% support for an Edwards or Luka start, even though 1.9 threes are fewer than you might expect from an expensive scoring guard. The defensive cost remains: 0.8 steals and 0.3 blocks put pressure on the next picks, while 3.2 turnovers make another ball-dominant teammate less attractive. Phoenix has added scoring around him, so the prior usage is a baseline rather than a guarantee. Near his ADP of 27 and our No. 28 ranking, choose him for points, passing and the line, then stop postponing defense."
        }
      ]
    },
    {
      "round": 4,
      "candidates": [
        {
          "name": "Derrick White",
          "yahooAdp": 47.1,
          "yahooPreRank": 26,
          "note": "White is one of the strongest reasons to consider this punt in the first place. His 39.5% shooting came on 14.4 attempts, a substantial cost that disappears entirely here. You keep 2.7 threes, 5.4 assists and 1.3 blocks, which is especially valuable after Towns leaves you short of rim protection. Just 1.7 turnovers also distinguish him from another lead guard. Tatum's return and Boston's new lineup may change the offensive workload, so do not assume last season's passing carries over unchanged. The defensive mix is the more distinctive reason to buy. Our No. 29 ranking already sits above an ADP near 47; Yahoo's pre-rank of 26 means even a fourth-round plan needs an alternative."
        },
        {
          "name": "Trey Murphy III",
          "yahooAdp": 40.1,
          "yahooPreRank": 22,
          "note": "Murphy prevents a productive backcourt from becoming a one-dimensional roster. His 3.2 threes and 21.5 points maintain the offense while 1.5 steals add something many scoring guards do not provide. There is also useful foul-line volume: 88.6% on 3.7 attempts, with only 1.8 turnovers. You do not need to care about his 47.0% FG to see why that line works. The decision against White is about what remains missing. Murphy supplies more scoring and steals; White supplies passing and much more shot blocking. Our No. 24 ranking makes an ADP near 40 attractive, although his pre-rank of 22 can bring earlier competition. If blocks are still empty, do not keep choosing wings just because each is good value in isolation."
        },
        {
          "name": "Lauri Markkanen",
          "yahooAdp": 38.7,
          "yahooPreRank": 18,
          "note": "Markkanen lets you add high-volume offense without automatically giving up more turnovers. He scored 26.6 points and made 2.7 threes with only 1.5 giveaways, while 89.6% free throws on 6.4 attempts provide the kind of support Luka needs. His 6.8 rebounds are useful from a forward, but 0.5 blocks mean he is not a replacement for a defensive center. Utah's partnership with Jackson changes the offensive context, and 42 games remain the strongest argument against treating the per-game line as a season-long promise. Our No. 20 ranking leaves obvious upside at an ADP near 39. I prefer that risk after a steadier opening, rather than pairing every discounted injury gamble and hoping the aggregate line survives."
        },
        {
          "name": "Brandon Miller",
          "yahooAdp": 46.8,
          "yahooPreRank": 46,
          "note": "Miller is a more natural fit once the 43.5% shooting on 16.1 attempts no longer damages a category. His 20.2 points and 3.1 threes remain, together with 89.2% free throws on 3.4 attempts. Charlotte's changes leave room for more responsibility, but 3.3 assists and 2.5 turnovers show why a scoring opportunity should not be mistaken for polished lead creation. Murphy offers more steals and fewer turnovers; Miller is the alternative when the former is gone and you still need perimeter offense. Our No. 41 ranking supports the range, but an ADP of 47 puts him in the fourth round of a 12-team league. Waiting until the fifth is a favorable fall, not the default plan."
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
          "note": "Bane is the addition I would make when a theoretically excellent punt-FG% roster still looks ordinary at the foul line. He shot 90.8% on 4.2 attempts and played all 82 games, a helpful combination after Luka or a riskier Curry selection. You also get 20.1 points and 4.1 assists without another three-plus-turnover guard. Giving away his 48.3% field-goal shooting is acceptable if the remaining production is what the team needs. The comparison with Jackson is instructive: Bane supports free throws and passing, while Jackson adds blocks. Neither choice fixes every hole. Our No. 38 valuation makes Bane appealing near his fifth-round ADP of 53, especially when the early frontcourt already includes a genuine shot blocker."
        },
        {
          "name": "Jaren Jackson Jr.",
          "yahooAdp": 50.5,
          "yahooPreRank": 54,
          "note": "Jackson is the middle-round option for a backcourt that needs blocks but cannot accommodate a center who makes no threes. He supplied 1.4 blocks, 1.8 threes and 19.4 points, while 80.3% free throws on 4.2 attempts are easier to carry than Sarr's rate. That does not make him an all-purpose frontcourt solution: 5.7 rebounds are modest and 2.2 turnovers are not especially light. His 48-game season and knee surgery also warrant more than a generic health disclaimer. At roughly pick 51, you are buying a useful category combination, not a guaranteed return to his old block peak. After Towns he supplies something missing; after Holmgren, assess whether rebounding or FT% support is the more urgent purchase."
        },
        {
          "name": "Michael Porter Jr.",
          "yahooAdp": 59.6,
          "yahooPreRank": 55,
          "note": "Porter's 7.1 rebounds are what make him especially useful to a punt-FG% team that has spent several early picks on guards. They come alongside 24.2 points and 3.4 threes, so adding boards does not require sacrificing the categories you intended to win. His 46.3% shooting on 18.4 attempts no longer needs balancing, although 2.3 turnovers and just 0.3 blocks remain part of the price. Brooklyn's changed offense introduces another usage question after a 52-game season. Our No. 40 ranking makes his ADP near 60 interesting, but I would not use him as the only answer to a frontcourt shortage. He repairs wing rebounding; a team still missing blocks needs a different next pick."
        }
      ]
    },
    {
      "round": 6,
      "candidates": [
        {
          "name": "Matas Buzelis",
          "yahooAdp": 61.9,
          "yahooPreRank": 34,
          "note": "Buzelis keeps you from having to choose between a shooter and a blocker with the same middle-round pick. His 2.2 threes and 1.5 blocks fit a guard-led opening, while 5.8 rebounds provide some frontcourt volume. Once 46.3% FG is removed, the concerns move elsewhere: 78.6% free throws on 3.1 attempts and 2.1 turnovers are not the clean supporting line of a low-usage veteran. Chicago may offer more opportunity, but that does not guarantee more efficient or mistake-free offense. Around his ADP of 62, close to our No. 59 valuation, the existing mix is enough to consider. Yahoo's pre-rank of 34 asks you to pay for much more of the improvement before it happens."
        },
        {
          "name": "OG Anunoby",
          "yahooAdp": 66.6,
          "yahooPreRank": 60,
          "note": "Anunoby is a good way to stop buying the same guard categories over and over. He adds 1.6 steals, 0.7 blocks and 2.3 threes with only 1.8 turnovers, useful next to Luka or Harden without requiring another major creation role. His 5.2 rebounds are supportive, though not enough to replace a rebounding big, and 82.8% free throws do not make him a rescue for a weak line. The appeal is the balance across categories you can still win. Our No. 49 ranking is comfortably ahead of his ADP near 67. After a scoring-heavy start, I would prioritize this defensive profile over another low-FG gunner whose points and threes merely extend an existing advantage."
        },
        {
          "name": "Alex Sarr",
          "yahooAdp": 71.9,
          "yahooPreRank": 59,
          "note": "Sarr is a useful reminder that solving blocks can create a different percentage problem. His 2.0 blocks and 7.4 rebounds offer a meaningful frontcourt contribution at a later price than Holmgren, and 16.3 points keep the offensive cost manageable. But his 69.2% free throws came on 3.0 attempts, which still count even if field-goal shooting does not. After Maxey and Harden, that may be affordable; after Luka and another poor foul shooter, it deserves much more caution. He also played 48 games. Our No. 45 projection leaves room at an ADP near 72, but the right question is whether his extra blocks are worth more to your team than Jackson's better foul shooting and greater three-point output."
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
          "note": "Bridges helps a high-usage team without asking for another high-usage role. His 1.0 turnover per game is a useful contrast to the three or four attached to many early guards, and you still get 1.9 threes, 1.3 steals and 0.8 blocks. Playing all 82 games is another reason to consider him after an availability gamble. The sacrifices are scoring and rebounding: 14.4 points and 3.8 boards will not repair those columns. His strong FG% is irrelevant here, but the defensive spread is not. Near ADP 80 against our No. 60 ranking, he fits a seventh-round plan. Yahoo's pre-rank of 41 may force a different choice; do not pay a primary-scorer price for a complementary line."
        },
        {
          "name": "Kel'el Ware",
          "yahooAdp": 73.2,
          "yahooPreRank": 51,
          "note": "Ware brings the rebounding volume that several stretch centers on this list do not. Nine boards came with 1.1 blocks, 1.2 threes and only 0.8 turnovers, useful when the first half of the draft has been dominated by guards. His 74.0% free throws were limited to 1.2 attempts, so the actual damage is smaller than the rate alone suggests. More minutes could change that balance as well as improve the counting stats. Milwaukee's new frontcourt makes the workload a projection, not something the old line settles. Near his ADP of 73, slightly later than our No. 66 ranking, choose him for boards and low turnovers; Turner is the stronger blocks-and-threes option if rebounding is already covered."
        },
        {
          "name": "Paul George",
          "yahooAdp": 80.4,
          "yahooPreRank": 126,
          "note": "George is tempting because his 2.7 threes and 1.7 steals resemble a much more expensive wing's contribution. Removing 43.9% FG makes those strengths easier to use, and 1.7 turnovers are manageable beside demanding creators. The question is how often that line reaches your active roster after a 37-game season. Boston is a new setting, not proof that the availability or workload improves. Our No. 76 ranking is close to his ADP near 80, so there is no need to describe the name as a huge market discount. Take him if the roster can afford a health bet and needs both shooting and steals; after several risky early picks, Bridges is the more defensible recent-workload choice."
        }
      ]
    },
    {
      "round": 8,
      "candidates": [
        {
          "name": "Jabari Smith Jr.",
          "yahooAdp": 94.1,
          "yahooPreRank": 84,
          "note": "Smith gives a guard-heavy roster more boards without forcing it to surrender another shooting slot. His 6.9 rebounds and 2.3 threes came with 0.9 blocks, useful secondary rim protection rather than enough to anchor the category. The 45.0% field-goal rate disappears here, but 77.5% free throws on 2.7 attempts remain a small cost. He played 77 games, offering a firmer recent workload than several higher-ceiling frontcourt options. Houston's rotation makes a large scoring increase uncertain, so buy the combination already demonstrated. Near ADP 94 against our No. 83 ranking, he is a reasonable eighth-round complement when boards and threes are both short. If blocks alone are the problem, Turner is more directly suited to it."
        },
        {
          "name": "Josh Hart",
          "yahooAdp": 96.3,
          "yahooPreRank": 68,
          "note": "Hart can rescue rebounding without using a center spot or giving up all your passing. His 7.4 boards and 4.8 assists are the reason to consider him after several scoring guards; 1.9 turnovers are a much smaller addition than another primary creator's. You do discard his 50.8% field-goal shooting, but that need not outweigh a genuine roster need. The remaining weaknesses are specific: 12.0 points, 1.5 threes and 0.3 blocks will not complete the offense or rim protection. His 72.0% free throws came on only 1.9 attempts, a manageable cost for a strong foul-shooting team. Around the eighth-round turn he is a needs-based pick, not a bargain to force, with our No. 93 ranking close to ADP 96."
        },
        {
          "name": "Norman Powell",
          "yahooAdp": 92.4,
          "yahooPreRank": 115,
          "note": "Powell is the late scoring option when earlier frontcourt picks have left points less secure than the punt's reputation suggests. His 21.7 points and 2.7 threes supply real offense without the turnovers of another lead guard. Chicago is a new context, and 58 games mean you should separate that scoring rate from a guaranteed season-long return. There is also less supporting production than many wings offer: 3.5 rebounds, 2.5 assists and 0.2 blocks leave those jobs elsewhere. His 82.7% free throws are usable but not the elite rate you might want after Luka. Our No. 81 ranking supports interest near ADP 92; take him to solve an actual scoring shortage, not simply because late points look cheap."
        }
      ]
    },
    {
      "round": 9,
      "candidates": [
        {
          "name": "Myles Turner",
          "yahooAdp": 100.3,
          "yahooPreRank": 108,
          "note": "Turner gains a clearer purpose when his 44.0% shooting no longer needs repair. You keep 2.1 threes and 1.6 blocks, a useful way to protect rim defense without undoing the shooting assembled in the early rounds. That is only half a center's job, though: 5.3 rebounds will not rescue a roster full of guards, and 74.0% free throws on 2.5 attempts remain a cost. Milwaukee's changed rotation also means the old workload is not assured. Near ADP 100 against our No. 88 ranking, he fits a team with a Towns or Hart-type rebounder already in place. A team that needs boards more than blocks should not draft him just because his FG% looks like a perfect punt fit."
        },
        {
          "name": "Andrew Wiggins",
          "yahooAdp": 100.7,
          "yahooPreRank": 103,
          "note": "Wiggins is useful when a late pick needs to improve several defensive categories rather than maximize one offensive number. His 1.1 steals and 1.0 blocks came with 2.0 threes, giving a guard-heavy roster more coverage without adding another creator's turnover total. Giannis' arrival changes Miami's shot distribution, so the 15.4 points should not be treated as the floor for a growing role. The shooting percentages are not the selling point: FG% is discarded, and 78.4% free throws on 2.4 attempts are a small remaining weakness. Our No. 86 ranking gives him a case around ADP 101. Choose him over a pure scorer when blocks and steals are still close enough to swing."
        }
      ]
    },
    {
      "round": 10,
      "candidates": [
        {
          "name": "Grayson Allen",
          "yahooAdp": 116.2,
          "yahooPreRank": 113,
          "note": "Allen is one of the late players whose fit changes materially when field-goal percentage disappears. His 40.3% shooting came on 13.1 attempts, not the tiny volume of a reserve who rarely shoots. Without that penalty, 3.1 threes, 1.4 steals and 85.7% free throws on 3.3 attempts are an appealing supporting line. Charlotte presents a different rotation, and 51 games make both opportunity and availability worth watching. He is not a rebounding or blocking solution, with 3.0 boards and 0.3 blocks. At ADP 116 against our No. 98 ranking, he is useful if those frontcourt jobs are already filled. Do not keep adding attractive shooters if doing so leaves the same two categories unwinnable."
        },
        {
          "name": "Cason Wallace",
          "yahooAdp": 118.2,
          "yahooPreRank": 76,
          "note": "Wallace is a specialist whose value depends on what the first nine picks accomplished. His 2.0 steals and 0.9 turnovers can help a productive offense compete in another category without adding much ball-handling risk. Removing 43.2% FG makes the fit easier, but 8.6 points, 1.3 threes and 2.6 assists still limit what he can fix. Nor can 80.9% free throws on fewer than one attempt cancel a high-volume weakness. Near ADP 118, he makes sense when points and passing are already secure. If you are still short of both threes and steals, Allen or Sheppard offers a broader offensive contribution; if the steals rate is the priority, Wallace is the more focused purchase."
        },
        {
          "name": "Toumani Camara",
          "yahooAdp": 110.1,
          "yahooPreRank": 97,
          "note": "Camara can add boards and shooting without asking for another high-usage roster spot. His 5.1 rebounds and 2.6 threes are useful late, and the 44.0% field-goal rate that hurts balanced teams disappears here. The rest is less specialized than his defensive reputation might suggest: 1.1 steals help, but 0.4 blocks do not replace a rim protector. Free throws are the remaining percentage issue, although 70.7% on only 1.6 attempts is easier to absorb than a larger-volume weakness. His 82-game season supports the recent workload case. Our No. 104 ranking is close to his ADP near 110; choose him for wing rebounding and threes rather than imagining every defensive wing supplies the same category mix."
        }
      ]
    },
    {
      "round": 11,
      "candidates": [
        {
          "name": "Reed Sheppard",
          "yahooAdp": 120.8,
          "yahooPreRank": 56,
          "note": "Sheppard's appeal is not just that you can ignore his 43.0% shooting. He paired 2.8 threes with 1.5 steals and 0.7 blocks, giving a late guard slot some of the defensive coverage a perimeter-heavy roster often lacks. Just 1.5 turnovers help as well. The 82-game season shows what he delivered when available, but VanVleet's expected return makes the next workload uncertain. Our No. 85 projection is much higher than ADP 121, while Yahoo's pre-rank of 56 may prevent that discount from reaching your room. I would not pay the latter price without firmer role evidence. Around the tenth-to-eleventh turn, the shooting and defense are worth considering if minutes still look attainable."
        },
        {
          "name": "Saddiq Bey",
          "yahooAdp": 120.1,
          "yahooPreRank": 109,
          "note": "Bey is a useful way to finish the offense without adding another expensive creator. His 17.7 points, 2.1 threes and 5.6 rebounds came with only 0.9 turnovers, and removing 45.1% FG makes the scoring easier to accept. His 84.1% free throws on 4.1 attempts also carry more weight than the rates of many low-usage late picks. The defensive limitation is substantial: 0.1 blocks offer virtually nothing, and 0.9 steals are not a specialist contribution. With our No. 102 ranking ahead of ADP 120, he is a reasonable target at the tenth-to-eleventh turn. Prefer him when points and rebounding remain unfinished; prefer Wallace or Wiggins if the offensive categories are already strong and defense is the problem."
        },
        {
          "name": "P.J. Washington",
          "yahooAdp": 115.8,
          "yahooPreRank": 178,
          "note": "Washington is a better fit here than on a team protecting FG%, but the remaining free-throw penalty still needs an honest calculation. He shot 68.7% on 3.3 attempts, enough volume to matter after Luka or Edwards. What you receive is seven rebounds, 1.0 steals and 1.1 blocks from a forward, useful coverage for a guard-heavy opening. His 1.4 threes are secondary rather than a major shooting contribution, and 56 games add availability risk. Our No. 124 ranking sits below his ADP near 116, so I would wait for an eleventh-round fall. A strong foul-line foundation can make the trade worthwhile; a roster already struggling there should not call this a harmless defensive patch."
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
          "note": "DiVincenzo is a legitimate late consideration because the 40.6% shooting penalty disappears while his 3.0 threes and 1.3 steals remain. The 3.8 assists also provide more passing than many final-round shooters, with only 1.4 turnovers. He played all 82 games, but Minnesota's Ball-Edwards backcourt makes unchanged minutes and usage uncertain. His 74.3% free throws are another remaining cost, limited by 1.3 attempts rather than absent altogether. Our No. 90 ranking reflects a useful category profile; the saved Yahoo snapshot has no reliable ADP, so a final-round listing is not a prediction that he will fall that far. Consider him earlier than other endgame options if the role is clear, without paying for last season's workload automatically."
        },
        {
          "name": "Herbert Jones",
          "yahooAdp": null,
          "yahooPreRank": 147,
          "note": "Jones is a steals specialist made easier to use by the punt, not a hidden complete player. His 38.3% FG no longer damages the roster, but 8.9 points, 1.4 threes and 3.4 rebounds still make the opportunity cost obvious. The reason to take him is 1.6 steals, ideally after enough offense has been drafted that a quiet scoring night will not matter. Wallace supplied more steals with fewer turnovers, so Jones is an alternative if that option is gone rather than the first specialist to chase. His 56 games also limit the recent availability case. Near our No. 142 valuation, use a final pick if steals are the clear need; there is no saved Yahoo ADP to justify a precise expected draft slot."
        },
        {
          "name": "Jay Huff",
          "yahooAdp": null,
          "yahooPreRank": null,
          "note": "Huff can supply late blocks without requiring you to give up every three-pointer from a center slot. His 1.9 blocks and 1.5 threes are the attraction, while 82.8% free throws avoid the obvious penalty attached to some cheaper bigs. That rate came on only 1.2 attempts, so it will not repair the team's foul shooting. Nor do 4.0 rebounds solve the structural rebounding problem. Indiana's addition of Zubac makes the minutes behind last season's line uncertain, despite Huff playing all 82 games. With no reliable Yahoo ADP in the snapshot, treat him as a final-pick role bet. If you already have enough blocks but lack boards, another specialist in the same category is the wrong finishing piece."
        },
        {
          "name": "Kristaps Porziņģis",
          "yahooAdp": 98.8,
          "yahooPreRank": 148,
          "note": "Treat Porziņģis as a conditional late stash, not the ninth-round frontcourt solution suggested by the older ADP. NBA.com reported him out indefinitely with a health issue on September 29. His 32-game baseline already required caution, even before that update. The appeal when available is clear: 1.7 threes, 1.2 blocks and 84.2% free throws on 4.9 attempts are useful from a center, while 44.6% FG no longer hurts. But only 5.2 rebounds mean even the healthy line does not solve every shortage. Our existing No. 117 ranking is not a medical update. With an open IL slot and a final pick, the upside may be worth monitoring; without those conditions, prefer someone who can contribute now."
        }
      ]
    }
  ],
  "faqs": [
    {
      "q": "Should I avoid efficient centers?",
      "a": "No. Their FG% no longer helps, but the remaining categories may be exactly what you need. Towns supplies rebounds and useful free-throw volume, while Holmgren supplies rebounds and blocks with some threes. Another low-FG guard is not automatically better if the roster already has enough offense."
    },
    {
      "q": "Does a Luka start guarantee strong free throws?",
      "a": "No. Luka shot 78.0% on ten attempts per game in 2025-26, so his volume can outweigh several smaller positive contributions. Calculate team FT% from total makes and attempts. Strong shooters such as Curry and Bane help, but you still need to measure the combined result before adding a poor foul-shooting center."
    },
    {
      "q": "Can I still compete in turnovers?",
      "a": "Yes, but not regardless of your picks. One high-usage creator is easier to balance than several, and low-turnover contributors such as Bridges or Bey can help. If you decide to concede turnovers too, treat that as a deliberate two-category build with less margin elsewhere, not an automatic benefit of punting FG%."
    },
    {
      "q": "What changes in eight-category leagues or roto?",
      "a": "Without turnovers, a second high-usage creator becomes easier to justify, but rebounds, blocks and FT% still need support. In roto, deliberately sacrificing FG% costs standings points for the whole season. This guide's main case is head-to-head categories, where a planned category loss can support a winning weekly combination."
    },
    {
      "q": "Are the sample teams projections or guaranteed draft paths?",
      "a": "Neither. They illustrate 12-team snake paths using dated Yahoo prices and sum eight players' historical per-game lines with equal appearances. FT% is weighted by attempts. Availability, new roles, weekly schedules, roster eligibility and your room's prices can all change the result; use the category decisions rather than expecting to draft every listed name."
    }
  ]
};

export const PUNT_THREES = {
  slug: 'punt-threes',
  type: 'punt',
  puntKey: '3pm',
  title: 'Punt Threes',
  season: CONTENT_SEASON,
  difficulty: 'Intermediate',
  isPremium: true,
  tagline: 'Turn scarce rebounding, defense and efficient scoring into wins without giving away free throws.',
  strengths: ['fg', 'reb', 'blk', 'ast'],
  weaknesses: ['3pm', 'ft', 'pts', 'to'],
  freeSections: 2,
  board: { minGames: 30, freeLimit: 20, previewRows: 4 },
  sections: [
    {
      id: 'strategy',
      heading: 'The strategy',
      body: [
        'Punt threes lets finishers, slashers and passing bigs compete on the eight categories they actually produce. Scottie Barnes is a useful early example: he gave 7.5 rebounds, 5.9 assists, 1.4 steals and 1.4 blocks while making only 0.8 threes in 2025-26. Amen Thompson supplied 7.8 boards, 5.3 assists and 1.5 steals with 0.3 threes. The punt makes those profiles easier to pair, but it does not make every non-shooter a bargain at any price.',
        'Shai Gilgeous-Alexander is the safest first-round base if available: 31.1 points on 55.3% FG, 87.9% FT, 6.6 assists and only 2.2 turnovers. You discard some shooting value, but his scoring and percentages give a low-three frontcourt room to breathe. Jalen Johnson is a later first-round path to rebounds and assists, though his 78.8% FT on volume and 3.4 turnovers make the next picks more demanding.'
      ]
    },
    {
      id: 'correlation',
      heading: 'Natural strengths & weaknesses',
      body: [
        'FG%, rebounds, blocks and out-of-position assists are the natural rewards, especially if the early roster includes Barnes, Amen or a finishing center. Points and steals still require deliberate sources; a lineup of low-usage centers can dominate boards yet lose too many other columns. The best complement may be an ordinary shooter such as Kawhi or Bane whose points, steals or FT% remain valuable even after the threes are removed.',
        'FT% is the second-punt trap. Duren made 74.7% of his free throws, Clingan 69.2%, Dyson Daniels 61.5% and Ausar Thompson 57.1%. Stacking them does not become safe just because none makes threes. Measure percentage impact using attempts, buy real FT% volume before another poor-FT big, and keep an eye on turnovers if Johnson or Sengun is your main passer.'
      ]
    },
    {
      id: 'draft',
      heading: 'Where the value sits in the draft',
      body: [
        'Yahoo ADP from September 26 places Johnson near 12, Barnes near 14, Amen near 24, Duren near 36 and Clingan near 42; our Top 150 ranks them 11th, 15th, 22nd, 35th and 34th. Those are credible price bands, not players you can combine freely. In a 12-team snake, a Johnson-Barnes opening is possible near the turn, while a Shai start must wait until the next turn to see which frontcourt piece remains.',
        'The board below removes threes from corrected 2025-26 production, so it describes history rather than a 2026-27 projection. These round targets use our Top 150 for the forward-looking case, the dated Yahoo ADP for cost, and Yahoo standard pre-ranks checked October 2. A player near a round edge may leave before your turn, especially in rooms that recognize the same punt.'
      ]
    }
  ],
  buildingBlocks: [
    { name: 'Scoring and free-throw base', note: 'A Shai, Kawhi or Bane type supplies points and FT% volume before low-three bigs put the line under pressure.' },
    { name: 'Rebounds with playmaking', note: 'Barnes, Johnson and Amen contribute assists without the usual point-guard dependence on threes.' },
    { name: 'Selective rim protection', note: 'Duren, Clingan and later centers add boards and blocks only when their free throws fit the existing roster.' }
  ],
  exampleTeams: [
    {
      name: 'Shai with defensive depth',
      color: '#16a085',
      note: 'A plausible 12-team snake path from pick four, with turns near 21, 28, 45, 52, 69, 76 and 93. Amen, Holmgren, Clingan, Bane, Anunoby, Bridges and McDaniels sit near those Yahoo prices; Clingan, Anunoby and McDaniels each need a small slide. Shai and Bane protect scoring and FT%, but Amen and Clingan still make the line worth checking before every later big.',
      roster: ['Shai Gilgeous-Alexander', 'Amen Thompson', 'Chet Holmgren', 'Donovan Clingan', 'Desmond Bane', 'OG Anunoby', 'Mikal Bridges', 'Jaden McDaniels']
    },
    {
      name: 'Johnson and Barnes near the turn',
      color: '#b8860b',
      note: 'From the end of round one, Johnson, Barnes, Duren, Markkanen, Buzelis, Anunoby, McDaniels and Bridges fit turns near 12, 13, 36, 37, 60, 61, 84 and 85. Markkanen supplies points and FT% despite his unused threes; Duren carries the FG% and boards. This path depends on several small slips and on Markkanen staying available after a 42-game season. Free throws and scoring are the next categories to recheck.',
      roster: ['Jalen Johnson', 'Scottie Barnes', 'Jalen Duren', 'Lauri Markkanen', 'Matas Buzelis', 'OG Anunoby', 'Jaden McDaniels', 'Mikal Bridges']
    }
  ],
  roundTargets: [
    { round: 1, candidates: [
      { name: 'Shai Gilgeous-Alexander', yahooAdp: 4.1, yahooPreRank: 2, note: 'Our Top 150 ranks Shai third, in line with his Yahoo price. His 31.1 points, 55.3% FG, 87.9% FT, 6.6 assists and 2.2 turnovers protect several categories this punt can lose. Take the best player at pick four, then use the next turn for rebounds and defense.' },
      { name: 'Jalen Johnson', yahooAdp: 11.8, yahooPreRank: 16, note: 'Johnson is 11th on our Top 150 and goes near pick 12. His 10.3 rebounds and 7.9 assists from forward make a low-three roster easier to build, but 78.8% FT and 3.4 turnovers mean the next two picks should be cleaner.' },
      { name: 'Nikola Jokić', yahooAdp: 1.9, yahooPreRank: 1, note: 'Jokić remains our top overall player: 12.9 boards, 10.7 assists and 56.9% FG are a rare foundation. Punting his useful threes is an opportunity cost, so take him because the remaining eight categories still justify pick one, not because he is a punt-specific discount.' }
    ] },
    { round: 2, candidates: [
      { name: 'Scottie Barnes', yahooAdp: 14.1, yahooPreRank: 21, note: 'Our Top 150 has Barnes 15th, close to Yahoo ADP 14. His 0.8 threes stop mattering, while 7.5 boards, 5.9 assists, 1.4 steals and 1.4 blocks remain. Toronto\'s new Kawhi pairing may change scoring, so secure a true points source next.' },
      { name: 'Amen Thompson', yahooAdp: 23.6, yahooPreRank: 10, note: 'Amen is 22nd on our board and near pick 24 on Yahoo. The punt removes his 0.3 threes, preserving 7.8 rebounds, 5.3 assists, 1.5 steals and 53.4% FG from guard. VanVleet\'s return may reduce his on-ball time; check FT% before pairing him with another poor shooter at the line.' },
      { name: 'Austin Reaves', yahooAdp: 22.3, yahooPreRank: 17, note: 'Reaves ranks 12th on our Top 150 versus Yahoo ADP 22. His 22.9 points, 5.5 assists and 86.8% FT protect categories a big-heavy start can lose, though you discard 2.3 threes. A 51-game season makes him a health bet; follow with a reliable rebounder.' }
    ] },
    { round: 3, candidates: [
      { name: 'Jalen Duren', yahooAdp: 36, yahooPreRank: 28, note: 'Duren is 35th on our board and costs a late third by Yahoo ADP. He gave 19.5 points, 10.5 boards and 65.0% FG with no threes. His 74.7% FT is a real cost; he fits best after a high-volume FT anchor rather than beside Sengun or another weak-FT big.' },
      { name: 'Chet Holmgren', yahooAdp: 27.7, yahooPreRank: 19, note: 'Holmgren is 23rd on our board and near pick 28 on Yahoo. His 8.9 boards, 1.9 blocks and 79.2% FT support a frontcourt without a severe line penalty. You sacrifice 1.3 threes, but the remaining category spread is worth the third-round price.' },
      { name: 'Kawhi Leonard', yahooAdp: 29.3, yahooPreRank: 15, note: 'Kawhi sits 14th on our Top 150 at a Yahoo price near 29. The 27.5 points, 1.8 steals, 50.8% FG and 88.8% FT can protect four columns while your bigs dominate boards. His move to Toronto and age make another 65-game season uncertain.' }
    ] },
    { round: 4, candidates: [
      { name: 'Donovan Clingan', yahooAdp: 41.6, yahooPreRank: 29, note: 'Clingan is 34th on our board and near pick 42 on Yahoo. His 11.5 rebounds and 1.7 blocks in 77 games justify the price when frontcourt defense is missing. The 69.2% FT means pairing him with Duren, Amen or Dyson needs a strong line already in place.' },
      { name: 'Lauri Markkanen', yahooAdp: 38.7, yahooPreRank: 18, note: 'Our Top 150 places Markkanen 20th against Yahoo ADP 39. His 26.6 points, 89.6% FT and 1.5 turnovers address punt-threes pressure points, even though his 2.7 threes become unused value. Only 42 games and Utah\'s changed frontcourt keep the price discounted.' }
    ] },
    { round: 5, candidates: [
      { name: 'Desmond Bane', yahooAdp: 52.9, yahooPreRank: 44, note: 'Bane is 38th on our board versus Yahoo ADP 53. His 20.1 points, 90.8% FT, 48.3% FG and 82 games supply a reliable scoring-and-percentage counterweight to a Duren or Clingan pick. Losing his threes costs value, so choose him when the line needs the larger lift.' },
      { name: 'Jaren Jackson Jr.', yahooAdp: 50.5, yahooPreRank: 54, note: 'Jackson brings 1.4 blocks and better FT% than several finishing centers, but his 1.8 threes are lost here. Our Top 150 has him 43rd and Yahoo ADP near 50; 48 games and Utah\'s new frontcourt make health and role the bigger questions.' },
      { name: 'Matas Buzelis', yahooAdp: 61.9, yahooPreRank: 34, note: 'Buzelis goes near the round-five boundary despite a Top 150 rank of 59. His 1.5 blocks can protect rim defense from forward, while 2.2 threes are unused. Take him at the end of five only if the preceding picks need blocks more than FT% or scoring.' }
    ] },
    { round: 6, candidates: [
      { name: 'Dyson Daniels', yahooAdp: 62.9, yahooPreRank: 20, note: 'Our Top 150 ranks Daniels 33rd versus Yahoo ADP 63, and the punt removes his 0.3 threes. Two steals, 6.8 boards and 5.9 assists from guard are powerful, but 61.5% FT can quietly force a second punt. Take him only after enough FT% volume is secured.' },
      { name: 'Julius Randle', yahooAdp: 68.4, yahooPreRank: 101, note: 'Randle is 68th on our board and costs roughly the same by Yahoo ADP. His 21.1 points, 6.7 boards and 5.0 assists can repair scoring from a forward slot. Brooklyn offers new touches, but 2.7 turnovers and limited blocks remain costs.' },
      { name: 'OG Anunoby', yahooAdp: 66.6, yahooPreRank: 60, note: 'Anunoby sits 49th on our Top 150 versus Yahoo ADP 67. His 1.6 steals, 0.7 blocks and 1.8 turnovers help a big-heavy team keep defense and ball security. The 2.3 threes are unused, so the sixth-round price needs a clear steals need.' }
    ] },
    { round: 7, candidates: [
      { name: 'Zion Williamson', yahooAdp: 69.7, yahooPreRank: 107, note: 'Zion\'s 21.0 points on 60.0% FG come with no threes, a direct benefit of this punt. Our Top 150 places him 82nd versus Yahoo ADP 70 because 71.6% FT, limited blocks and health risk still matter. Wait for a discount or draft only after strong FT% volume.' },
      { name: 'Mikal Bridges', yahooAdp: 79.6, yahooPreRank: 41, note: 'Bridges is 60th on our Top 150 and goes near pick 80. His 82 games, 1.3 steals, 0.8 blocks and few turnovers can stabilize a Johnson or Randle start. You give away his threes, but the defensive coverage still plays at this price.' },
      { name: 'De\'Aaron Fox', yahooAdp: 80.1, yahooPreRank: 85, note: 'Fox is 75th on our Top 150 against Yahoo ADP 80. He supplies 18.6 points, 6.2 assists and 48.6% FG if your first six picks lack a guard creator. His middling FT% and shared San Antonio backcourt make him a conditional seventh-round fit.' }
    ] },
    { round: 8, candidates: [
      { name: 'Jaden McDaniels', yahooAdp: 89.2, yahooPreRank: 43, note: 'McDaniels ranks 78th on our board at Yahoo ADP 89. He gave 14.8 points, 51.5% FG, 1.1 steals and 1.0 blocks from a wing. His 1.4 threes are expendable here; Minnesota\'s new guard mix is the scoring uncertainty.' },
      { name: 'Josh Hart', yahooAdp: 96.3, yahooPreRank: 68, note: 'Hart is 93rd on our board and goes near the end of eight. His 7.4 rebounds and 4.8 assists from a wing work in a low-three build, with only 1.9 turnovers. The 72.0% FT requires another line anchor; do not use him as the fix for steals or points.' },
      { name: 'Norman Powell', yahooAdp: 92.4, yahooPreRank: 115, note: 'Powell ranks 81st on our board and costs roughly pick 92. His 21.7 points provide a late scoring lift after several defensive bigs. You lose 2.7 threes, so pay this price only if points and FT% are still winnable categories.' }
    ] },
    { round: 9, candidates: [
      { name: 'Andrew Wiggins', yahooAdp: 100.7, yahooPreRank: 103, note: 'Wiggins is 86th on our board and costs about pick 101. His steals, blocks and 47.5% FG can fill a wing slot without another low-FT center. The two threes you discard and Giannis\' arrival in Miami limit the scoring case.' },
      { name: 'Jalen Suggs', yahooAdp: 111.4, yahooPreRank: 89, note: 'Suggs gave 1.8 steals and 5.5 assists in 57 games. Our Top 150 ranks him 72nd, but 43.5% FG and availability still matter after threes are removed. He is a ninth-to-tenth-round defense and passing target, not a scoring solution.' },
      { name: 'Nikola Vučević', yahooAdp: 114.7, yahooPreRank: null, note: 'Vučević remains a source of 8.4 boards and low turnovers, but his 1.6 threes are lost in this build. Our Top 150 puts him 97th versus Yahoo ADP 115; only take him early if Orlando shows a clear frontcourt role.' }
    ] },
    { round: 10, candidates: [
      { name: 'Jimmy Butler III', yahooAdp: 117.1, yahooPreRank: null, note: 'Butler sits 79th on our Top 150 against Yahoo ADP 117 because the January ACL tear leaves his return uncertain. His 0.8 threes are expendable while 52.0% FG, 86.2% FT, 1.4 steals and 1.6 turnovers could fill several holes. Keep the rest of the roster durable.' },
      { name: 'DeMar DeRozan', yahooAdp: 116.2, yahooPreRank: 155, note: 'DeRozan is 118th on our board and costs near the same by Yahoo ADP. His 0.6 threes disappear, leaving 18.1 points, 86.5% FT, 4.1 assists and only 1.2 turnovers. Denver\'s changed offense may trim usage; buy the clean late scoring line, not a bigger role.' },
      { name: 'Cason Wallace', yahooAdp: 118.2, yahooPreRank: 76, note: 'Wallace is 103rd on our board against Yahoo ADP 118. Two steals and 0.9 turnovers can rescue close categories after several high-usage forwards. His 8.6 points are too light to repair a scoring deficit.' }
    ] },
    { round: 11, candidates: [
      { name: 'Ayo Dosunmu', yahooAdp: 114.9, yahooPreRank: 96, note: 'Dosunmu is 116th on our board and near pick 115 on Yahoo. The 51.7% FG, 87.6% FT and 1.4 turnovers are unusually clean for a late guard. Minnesota\'s crowded backcourt makes minutes uncertain; take him near this price only if your team needs efficiency more than scoring volume.' },
      { name: 'Tre Jones', yahooAdp: 116, yahooPreRank: 156, note: 'Jones gave 5.4 assists with 1.4 turnovers, 55.3% FG and 84.1% FT. His limited threes stop mattering, but scoring is still thin. Our Top 150 places him 130th, so he is an eleventh-round roster fit if you specifically need passing and clean percentages.' },
      { name: 'Neemias Queta', yahooAdp: 115.2, yahooPreRank: 116, note: 'Queta had zero threes, 65.3% FG, 8.4 rebounds and 1.3 blocks across 76 games. Yahoo ADP near 115 is earlier than our Top 150 rank of 138; his 70.3% FT makes him a late frontcourt contingency only after the line is secure.' }
    ] },
    { round: 12, candidates: [
      { name: 'Bilal Coulibaly', yahooAdp: null, yahooPreRank: null, note: 'Coulibaly supplies 1.3 steals and 1.0 blocks with modest threes. Our Top 150 places him 114th, but Yahoo gives no reliable ADP in this snapshot. His 42.5% FG and uncertain Washington scoring role make him a final-pick defensive bet, not a percentage anchor.' },
      { name: 'Jay Huff', yahooAdp: null, yahooPreRank: null, note: 'Huff blocked 1.9 shots in 82 games, but his 1.5 threes are unused here and Zubac\'s arrival could cut minutes. Yahoo gives no reliable ADP in this snapshot; take him only if blocks still need help and he actually reaches your last pick.' }
    ] }
  ],
  faqs: [
    { q: 'Does punt threes mean I should take every non-shooter?', a: 'No. A low-three player still has to help the other eight categories at the pick you spend. FT%, points and turnovers remain live costs.' },
    { q: 'Can I pair Amen Thompson with Dyson Daniels?', a: 'Their rebounds, assists and steals fit, but the combined free-throw impact can create a second punt. Make sure earlier picks supply enough FT% volume before choosing both.' },
    { q: 'Should I avoid all three-point shooters?', a: 'No. Shai, Kawhi, Markkanen or Bane may be worth the price for scoring and free throws even when some threes are unused.' },
    { q: 'Does punt threes work in eight-category leagues?', a: 'Yes, but removing turnovers also boosts high-usage passers. Recheck FT% and points; those remain the easiest columns to lose behind an all-frontcourt start.' }
  ]
};

export const PUNT_POINTS = {
  slug: 'punt-points',
  type: 'punt',
  puntKey: 'pts',
  title: 'Punt Points',
  season: CONTENT_SEASON,
  difficulty: 'Advanced',
  isPremium: true,
  tagline: 'Let other managers chase scoring while you build around passing, defense and efficient shooting.',
  strengths: ['reb', 'ast', 'stl', 'blk'],
  weaknesses: ['pts', '3pm', 'ft'],
  freeSections: 2,
  board: { minGames: 30, freeLimit: 20, previewRows: 4 },
  sections: [
    {
      id: 'strategy',
      heading: 'The strategy',
      body: [
        'Some of the most useful category players are difficult to draft together when you still need to win points. Cason Wallace scored 8.6 a game last season, Dyson Daniels 11.9 and Donovan Clingan 12.1. Put several of them on a conventional roster and you spend the rest of the draft trying to catch up in scoring. Punt points gives you permission to stop that chase. Wallace can earn his place through steals and ball security, Daniels through passing and rebounding, and Clingan through boards and blocks. The value comes from being able to use those players together at sensible prices.',
        'The opening rounds still need stars. Jokić gives you enough passing from center to spend later picks on defenders, while Wembanyama makes blocks a realistic strength before you draft a second big. Near the first-round turn, Jalen Johnson and Scottie Barnes offer a different foundation: rebounds and assists from forwards, with Barnes doing much more of the shot blocking. Their scoring will sometimes win you a week anyway. In head-to-head categories, the commitment is to stop spending picks to rescue points when another category would benefit more.',
        'The difficult part is keeping enough shooting. Many of the players who rise here also make very few threes, and taking every attractive defender can leave you conceding points, threes and FT%. That is a narrow path through a nine-category matchup. White, Anunoby and Pritchard matter because they let you keep the defensive specialists without surrendering the whole perimeter. This guide assumes a 12-team, nine-category head-to-head league; deliberately finishing near the bottom in points is a much more expensive concession in roto.'
      ]
    },
    {
      id: 'correlation',
      heading: 'Natural strengths & weaknesses',
      body: [
        'Rebounds and defensive stats are the easiest place to start, but the guards determine how flexible the finished team becomes. Daniels gave you 6.8 rebounds and 5.9 assists; Wallace supplied only 3.1 and 2.6 despite matching his two steals. They solve different problems. Likewise, Duren\'s 10.5 rebounds came with 0.8 blocks, while Holmgren gave 8.9 boards and 1.9 blocks. A collection of players who improve in the punt rankings can still leave you short in one of the categories you meant to win.',
        'Free-throw percentages can be misleading without the attempt volume. Daniels shot 61.5%, but on just 1.6 attempts per game. Duren made a much more respectable 74.7% while taking 6.1. Against an 80% target, each costs roughly three-tenths of a made free throw per game. You can absorb either with the right teammates: Bane and Daniels together shot about 82.7%, combining their 2025-26 makes and attempts with equal games for each. A strong percentage on tiny volume will not do the same job. Pritchard\'s 89.0% came on 1.7 attempts, so he helps without providing Bane\'s influence over the team total.',
        'FG% and turnovers also depend on who you choose. White\'s 39.5% on 14.4 shots can pull down an otherwise efficient frontcourt; Duren\'s 65.0% on 11.5 shots is enough to bring their combined shooting to about 50.9%. With turnovers, the attraction of a low-scoring roster disappears if all your assists come from high-usage creators. Jokić and Johnson averaged 3.7 and 3.4 turnovers. Pritchard, Bridges and Tre Jones give you ways to add passing without letting that column get away from you.'
      ]
    },
    {
      id: 'draft',
      heading: 'Where the value sits in the draft',
      body: [
        'Spend the early picks on production you cannot comfortably replace later. Jokić\'s assists and Wembanyama\'s blocks are obvious examples; Barnes\' combination of passing and defense is another. Barnes usually costs the first/second-round turn, Amen the next turn, and Holmgren an early third. A manager picking near the top cannot reasonably plan on getting all three. Decide which category your first pick leaves exposed, then use the available player at your actual turn.',
        'The middle rounds are where this build becomes interesting. White sits 29th on our Top 150 with Yahoo ADP around 47, and Okongwu is 37th against an ADP near 55. Both offer combinations that save you from using a later pick on a one-category specialist. Daniels has the larger ranking gap, but if Amen is already on the roster, Anunoby\'s shooting may be worth more to you than another rebound and assist boost. That is a sensible reason to pass on the player who looks better in isolation.',
        'The player cards show Yahoo ADP from September 26 and standard pre-ranks checked October 2. Those numbers can disagree sharply: Pritchard is near pick 80 by ADP but 33rd in the default order. Treat the listed rounds as shopping ranges, with room for a player to go earlier in a queue-driven draft. Our Top 150 supplies the 2026-27 outlook; the live punt board uses corrected 2025-26 production. The sample teams combine last season\'s per-game lines with equal games for each player and weight percentages by attempts. They are construction checks, not forecasts of weekly results.'
      ]
    }
  ],
  buildingBlocks: [
    { name: 'An early advantage you can build on', note: 'Jokić lets you get assists without filling the backcourt with lead guards. Wembanyama gives you room to choose a rebounding center who blocks fewer shots. Let that first advantage shape the next two picks.' },
    { name: 'Defenders who cover different needs', note: 'Daniels adds passing, Wallace protects turnovers, and McDaniels brings blocks from the wing. Choose the missing contribution instead of collecting several versions of the same player.' },
    { name: 'Enough shooting to keep your options open', note: 'Anunoby adds threes alongside steals; Pritchard brings threes and assists; Bane has the free-throw volume to support a weaker shooter. Their value rises when they let you keep another specialist.' }
  ],
  exampleTeams: [
    {
      name: 'Jokić with guard defense',
      color: '#16a085',
      note: 'Jokić supplies the passing that lets this team spend heavily on defense. With equal games, these eight 2025-26 lines total 52.9 rebounds, 33.6 assists and 8.5 blocks, while shooting 50.3% FG and 82.0% FT. That leaves room to compete in both percentages; the more obvious unfinished business is shooting, at 13.4 threes across eight players. Sheppard would help that in the later rounds, whereas another non-shooting center would mostly add to existing strengths. From pick one, the turns are 1, 24, 25, 48, 49, 72, 73 and 96. Anunoby and McDaniels each need a modest slide, and Yahoo\'s earlier pre-ranks could remove Amen or White before their ADP suggests. Jackson\'s 48-game season also makes a dependable next pick attractive.',
      roster: ['Nikola Jokić', 'Amen Thompson', 'Chet Holmgren', 'Derrick White', 'Jaren Jackson Jr.', 'OG Anunoby', 'Mikal Bridges', 'Jaden McDaniels']
    },
    {
      name: 'Johnson and Barnes near the turn',
      color: '#b8860b',
      note: 'Johnson and Barnes handle enough passing that Duren can be chosen for his rebounding and FG%. White then adds the guard blocks this opening needs, while Bane gives the free-throw volume to support Duren. The eight historical lines combine for 50.3 rebounds, 35.3 assists and 6.3 blocks at 49.4% FG and 82.4% FT. Threes sit at 13.7 and turnovers at 16.6, so the remaining picks should favor shooting and ball security. The price path is 12, 13, 36, 37, 60, 61, 84 and 85: White is a deliberate early selection relative to ADP, supported by our rank of 29, and Bane needs to fall about seven picks. If Bane goes earlier, Okongwu is an alternative near that turn, but the team would then need a stronger FT% contributor later.',
      roster: ['Jalen Johnson', 'Scottie Barnes', 'Jalen Duren', 'Derrick White', 'Desmond Bane', 'OG Anunoby', 'Jaden McDaniels', 'Payton Pritchard']
    }
  ],
  roundTargets: [
    { round: 1, candidates: [
      { name: 'Nikola Jokić', yahooAdp: 1.9, yahooPreRank: 1, note: 'Jokić makes this build much easier to draft because so much of your passing comes from a center. His 10.7 assists let you use a later guard slot on Wallace or Sheppard without expecting either to run an offense. Add 12.9 rebounds and 56.9% shooting on 17.4 attempts, and you have substantial help in two categories that those guards cannot carry. Wembanyama offers the bigger defensive advantage, but Jokić gives you more freedom to react when centers or point guards go early. The 3.7 turnovers still count, so I would lean toward Bridges and Pritchard later rather than keep adding high-usage passers. He remains worth a pick at the very top even when you stop chasing his points.' },
      { name: 'Victor Wembanyama', yahooAdp: 1.6, yahooPreRank: 3, note: 'The strongest reason to choose Wembanyama here is what his blocks allow you to do with the rest of the roster. He averaged 3.1 in only 29.2 minutes, alongside 11.5 rebounds, 1.9 threes and 82.7% FT on seven attempts. That gives you room to take a center such as Duren for FG% and boards without asking that player to be an elite shot blocker too. You still need a real assist source: Wembanyama\'s 3.1 are useful for a big, but nowhere close to Jokić\'s contribution. His 64 games also matter. If he is your first pick, I would want the next few selections to have dependable roles rather than make the entire frontcourt a bet on health.' },
      { name: 'Shai Gilgeous-Alexander', yahooAdp: 4.1, yahooPreRank: 2, note: 'Shai is the opening for a manager who wants to keep both percentages strong before choosing the specialists. His 87.9% FT came on nine attempts a game, giving him far more influence over the team total than a good shooter who visits the line once or twice. The 55.3% FG on 19.4 attempts is just as valuable, and 6.6 assists with 2.2 turnovers leaves room to compete in ball security. You are paying for 31.1 points that this build will not prioritize, so there is no need to decide on the punt before the next turn. If Barnes, Amen or Holmgren is the best available player there, Shai has already made their category tradeoffs easier to manage.' },
      { name: 'Jalen Johnson', yahooAdp: 11.8, yahooPreRank: 16, note: 'Johnson is an appealing way into this build near the end of round one. The 10.3 rebounds and 7.9 assists allow your next picks to concentrate on defense and shooting, and he contributes far more threes than Amen or Daniels. The catch is that a rebounding forward is not necessarily a shot blocker: Johnson averaged only 0.4 blocks. Barnes makes particular sense beside him because his defense fills that gap while adding another passer. With 3.4 turnovers and 78.8% FT on 5.3 attempts, Johnson also needs teammates who keep the possession count and free throws under control. Our 11th-place ranking and Yahoo\'s price near 12 make this a realistic opening at the turn, without requiring a major fall.' }
    ] },
    { round: 2, candidates: [
      { name: 'Scottie Barnes', yahooAdp: 14.1, yahooPreRank: 21, note: 'Barnes is one of the best reasons to consider this punt. You get 7.5 rebounds and 5.9 assists from forward, plus roughly a steal and a half and a block and a half, without needing a big scoring night. He played 80 games, which gives that broad line more practical value than an impressive per-game season spent mostly on the injury list. Kawhi\'s return to Toronto could take away shots; for this build, the more important question is how much passing Barnes keeps. There is enough else here to like the pairing, provided you buy shooting afterward. Barnes made fewer than one three per game, so following him with White or a shooting big leaves you more choices than immediately adding another non-shooter.' },
      { name: 'Amen Thompson', yahooAdp: 23.6, yahooPreRank: 10, note: 'Few guards can change a team\'s rebounding and FG% the way Amen does. His 7.8 boards and 53.4% shooting came with 5.3 assists and 1.5 steals, making him especially useful after an early center who does not pass much. The shooting limitations need to be separated: 0.3 threes is a major hole, while 77.9% FT on 4.9 attempts is a manageable cost with enough support. He is not in the same free-throw situation as Ausar. VanVleet\'s expected return could reduce the ballhandling that produced those assists, so I would not draft Amen assuming another increase. Around the second/third-round turn, the fit is compelling; Yahoo\'s much earlier default rank is a reason to have a backup plan, not to spend a first-round pick.' }
    ] },
    { round: 3, candidates: [
      { name: 'Chet Holmgren', yahooAdp: 27.7, yahooPreRank: 19, note: 'Holmgren is the center I would look for when the early roster already includes a non-shooting guard. His 1.3 threes are modest on their own, but they help you stay in the category while adding 8.9 rebounds and 1.9 blocks. The 55.7% FG also gives him an advantage over stretch centers who block shots at the expense of your percentage. His 79.2% free throws are manageable, although they will not carry a roster full of poor shooters. Oklahoma City\'s depth leaves the minutes ceiling uncertain after a 28.9-minute season; the appeal is how much he already produces in that workload. With only 1.7 assists, he fits more comfortably beside Jokić, Johnson or Barnes than as part of an opening with no established passer.' },
      { name: 'Jalen Duren', yahooAdp: 36, yahooPreRank: 28, note: 'Duren is the pick for a team that needs its FG% to move. He shot 65.0% on 11.5 attempts, enough volume to absorb much of the damage from a guard such as White. His 10.5 rebounds help too, but the 0.8 blocks explain why I would rather draft him after Barnes or Wembanyama than assume he completes the defense himself. Stewart\'s departure removes one source of competition in Detroit\'s frontcourt, although an increase over last season\'s workload remains a projection. The real cost is at the line: 74.7% on 6.1 attempts has a substantial effect, and he supplies no threes. If those categories already look thin, Holmgren is worth the earlier pick; if shooting is covered, Duren can make the frontcourt much harder to beat.' }
    ] },
    { round: 4, candidates: [
      { name: 'Derrick White', yahooAdp: 47.1, yahooPreRank: 26, note: 'White lets you pursue blocks without filling another center slot. His 1.3 per game came with 2.7 threes and 5.4 assists, which is why he is such an appealing partner for Barnes or a traditional rebounding big. Boston\'s offense will look different with Tatum back and George replacing Brown, so repeating all of last season\'s creation is not assured. His shooting and defensive contributions still give him several ways to help. The difficult number is 39.5% FG on 14.4 attempts: that is too much volume to dismiss as a small guard penalty. A Duren or Jokić start can absorb it much more comfortably than a collection of stretch forwards. Our rank of 29 supports taking him ahead of his fourth-round ADP when your draft position requires it.' },
      { name: 'Donovan Clingan', yahooAdp: 41.6, yahooPreRank: 29, note: 'Clingan gives you a lot of rebounding without asking for many possessions. He collected 11.5 boards and 1.7 blocks with only 1.2 turnovers, a useful combination when your first two picks are already doing most of the passing. The 1.1 threes help as well; he is less restrictive than a center who never shoots from outside. Be careful with the assumption that a player of his size must also dominate FG%. He shot 52.1% on 8.8 attempts, a much smaller percentage contribution than Duren. His 69.2% FT came on 2.5 attempts, so the damage is manageable with enough volume elsewhere. I prefer him when rebounds and turnovers need attention, especially after an opening that already has a dependable free-throw shooter.' }
    ] },
    { round: 5, candidates: [
      { name: 'Onyeka Okongwu', yahooAdp: 54.7, yahooPreRank: 37, note: 'Okongwu belongs in this conversation because he contributes to almost every category you still care about. His 7.6 rebounds came with 3.1 assists, 1.9 threes and 1.1 each in steals and blocks. Clingan is the better choice if you need a large rebounding advantage; Okongwu gives you more ways to finish a roster that already has one traditional center. That flexibility matters beside Amen or Daniels, whose missing threes have to come from somewhere. The percentages are the limitation: 48.0% FG is ordinary for a big, and 75.7% FT does not help a fragile line. Our Top 150 has him 37th against Yahoo ADP near 55. I like that fifth-round price when the early picks already supply efficient volume.' },
      { name: 'Desmond Bane', yahooAdp: 52.9, yahooPreRank: 44, note: 'Bane can make a defensive specialist affordable in ways that the punt rankings alone will miss. His 90.8% FT on 4.2 attempts supplies real support for a Daniels or Duren pick, and 48.3% FG is much easier to accommodate than White\'s shooting. He also gave you 4.1 assists and two threes, so you are getting more than a percentage specialist. The cost is that a meaningful part of his ordinary value comes from his 20.1 points, which this team is choosing to deprioritize. I would take White first if blocks are the pressing need, but Bane is the more comfortable choice when your bigs already cover defense and the free-throw total needs help. His 82-game season is another reason to like him after a riskier opening.' },
      { name: 'Jaren Jackson Jr.', yahooAdp: 50.5, yahooPreRank: 54, note: 'Jackson still gives you blocks and threes from the same frontcourt slot, but the name can create expectations that last season\'s line did not meet. He averaged 1.4 blocks and 5.7 rebounds; that is useful defense, not enough to carry both big-man categories on its own. His 1.8 threes and 80.3% FT make him easier to pair with a non-shooting center, which is the stronger argument at this price. Knee surgery ended his season, and he played only 48 games, so the possibility of a defensive rebound has to be weighed against availability. Buzelis actually supplied slightly more threes and blocks last year at a later Yahoo price. I would choose Jackson when I value his free throws and am comfortable with the health risk, rather than paying for his old block reputation.' }
    ] },
    { round: 6, candidates: [
      { name: 'Dyson Daniels', yahooAdp: 62.9, yahooPreRank: 20, note: 'Daniels is one of the players this punt is built to use. A guard giving you 6.8 rebounds, 5.9 assists and two steals with only 1.8 turnovers can improve several categories that usually require separate picks. His 51.7% FG helps too. The 61.5% FT looks alarming, but it came on 1.6 attempts; with Bane or Shai supplying accurate volume, it is a cost you can plan around. The harder hole to fill is 0.3 threes, particularly if Amen or Barnes is already on the roster. Compared with Wallace, Daniels supplies much more passing and rebounding, so he is worth the earlier pick when you need all three contributions. His ADP near 63 is attractive against our rank of 33, although Yahoo\'s default order puts him high enough that some rooms will never let him get there.' },
      { name: 'OG Anunoby', yahooAdp: 66.6, yahooPreRank: 60, note: 'Anunoby is often the better pick than the next specialist because he helps the categories that specialist would make harder. His 2.3 threes come alongside 1.6 steals and 0.7 blocks, so you can add shooting without giving back the defensive advantage you have been building. He also shot 48.4% FG and 82.8% FT, making him easier to place next to Daniels or Clingan than another poor shooter. The 2.2 assists will not repair a roster that lacks creation, and 67 games keep durability from being a guarantee. Around the sixth round, though, I would be comfortable prioritizing him over a bigger name whose main attraction is scoring. His line addresses several needs that tend to appear together in this build.' },
      { name: 'Matas Buzelis', yahooAdp: 61.9, yahooPreRank: 34, note: 'The useful part of a Buzelis breakout for this team is already visible. He averaged 2.2 threes and 1.5 blocks in 29.2 minutes, with 5.8 rebounds to keep the rest of the line useful. You do not need to predict a jump to 20 points for that combination to matter. Compared with Jackson, he supplied a little more shooting and rim protection last season and played 77 games, although he lacks Jackson\'s established track record. The less comfortable side is 46.3% FG, 78.6% FT and 2.1 turnovers. More offensive responsibility would not automatically improve those numbers. I like him around the fifth/sixth-round boundary when blocks and threes are both short; after White, I would want a stronger FG% base before adding another player who could leave that category exposed.' }
    ] },
    { round: 7, candidates: [
      { name: 'Mikal Bridges', yahooAdp: 79.6, yahooPreRank: 41, note: 'Bridges is a useful answer to a draft that has become too risky or too careless with the ball. His 3.7 assists came with only one turnover, and he added 1.3 steals, 0.8 blocks and 1.9 threes while playing all 82 games. Those contributions are easy to overlook beside a 14.4-point average, but nearly all of them matter here. Shooting 49.0% also makes him a comfortable follow-up to White. His 82.7% FT sounds helpful, yet just 1.2 attempts means he cannot rescue a team that has collected several weak free-throw shooters. Anunoby is the stronger steals-and-threes choice; Bridges offers more passing and a recent record of staying on the floor. That is a sensible seventh-round tradeoff for a team already carrying an injury risk.' },
      { name: 'Payton Pritchard', yahooAdp: 79.6, yahooPreRank: 33, note: 'One of the better ways to finish the backcourt after drafting Barnes or Amen. Pritchard made 2.7 threes and handed out 5.2 assists with only 1.4 turnovers, giving you the shooting those forwards leave short while helping you stay competitive in assists. That is close to White\'s offensive line several rounds later. White earns the higher pick through his blocks; Pritchard\'s advantage is a much easier FG% to absorb, at 46.3% against White\'s 39.5%. Boston\'s return to a Tatum-led offense, with George replacing Brown, could reduce his opportunities to create. I would be happy with something close to last season\'s role at his price around pick 80. Just avoid treating his 89.0% FT as a cure for a weak team percentage: on 1.7 attempts, he cannot do the work of a Bane or Shai.' }
    ] },
    { round: 8, candidates: [
      { name: 'Jaden McDaniels', yahooAdp: 89.2, yahooPreRank: 43, note: 'McDaniels lets you add blocks while keeping a wing slot productive in the percentages. He shot 51.5% FG and 83.5% FT with 1.1 steals and one block, which makes him a comfortable partner for White or a weak-FT center. His 1.4 threes are useful, though Anunoby supplies considerably more shooting. Minnesota\'s addition of Ball changes the offensive hierarchy, but McDaniels does not need a large share of the offense for this build to work; the minutes he earns through defense are more important. Be careful about counting him as a rebounder just because he is a long forward. At 4.2 boards a game, he is better used to complement your centers than to replace one.' },
      { name: 'Jabari Smith Jr.', yahooAdp: 94.1, yahooPreRank: 84, note: 'Smith is useful when you need a forward to keep threes competitive without giving away too much rebounding. His 2.3 threes and 6.9 boards came with 0.9 blocks and only 1.4 turnovers, a combination that fits comfortably after an opening built around passing. He already played 35.1 minutes, so a fantasy improvement needs to come from better production in those minutes rather than an easy workload increase. The 45.0% FG and 77.5% FT are the reason I would hesitate after several inefficient shooters. Buzelis gives you more blocks at an earlier price; Smith offers more rebounding and better ball security. Choose him when those are the gaps, with little need to predict a scoring breakout in Houston\'s crowded offense.' },
      { name: 'Josh Hart', yahooAdp: 96.3, yahooPreRank: 68, note: 'Hart gives you rebounding from a position where most available players are trying to help through scoring and threes. His 7.4 boards were almost level with Barnes, and 4.8 assists with 1.9 turnovers add useful secondary creation. The 50.8% FG is helpful too. He is much less useful if what you really need is another defensive specialist: 1.1 steals are respectable, but 0.3 blocks will not replace a missing big. His 72.0% FT came on 1.9 attempts, a manageable drag when the rest of the line is strong. I like Hart after a shooting-heavy start that needs boards and passing; after Amen and Daniels, his modest 1.5 threes leave too much of the same work for someone else.' }
    ] },
    { round: 9, candidates: [
      { name: 'Myles Turner', yahooAdp: 100.3, yahooPreRank: 108, note: 'Turner is worth considering before you leave all of the remaining blocks work to Huff. Last season he made 2.1 threes and blocked 1.6 shots, a useful combination for a team that spent its early picks on passing forwards. The 11.9 points are no concern here, but the other weaknesses still matter: 5.3 rebounds, 44.0% FG and 74.0% FT are a disappointing percentage-and-rebounding package from a center. I would use him beside an efficient rebounder such as Jokić or Duren, with free throws already supported. Milwaukee\'s changed frontcourt adds uncertainty about his workload, so the case is strongest around his ninth-round ADP. He is a way to buy blocks and shooting together, with a clear cost in the categories traditional centers usually help.' },
      { name: 'Jalen Suggs', yahooAdp: 111.4, yahooPreRank: 89, note: 'Suggs becomes appealing when you reach the later rounds and still need both assists and steals. His 5.5 assists and 1.8 steals came with 2.1 threes, so he offers a much better shooting balance than adding another Daniels-type guard. His 85.5% FT helps too, although the volume is modest. The concern is that this is not a particularly clean possession-by-possession line: 43.5% FG and 2.7 turnovers can eat into the advantages of a careful early draft. He also played 57 games. I would choose him over Wallace when the passing is needed, and Wallace when steals are the main job. Yahoo\'s ADP near 111 gives you time to assess that need, provided your room does not follow his earlier default rank.' },
      { name: 'Andrew Wiggins', yahooAdp: 100.7, yahooPreRank: 103, note: 'Wiggins offers a practical alternative when the earlier defensive wings are gone. His two threes, 1.1 steals and one block cover much of the same territory, although 47.5% FG is less helpful than McDaniels\' shooting. Giannis is now in Miami, so there is little reason to pay for a scoring jump; the useful question is whether Wiggins keeps the minutes and defensive production of a complementary wing. His 1.5 turnovers make the existing line easy to fit around Johnson or another primary passer. Free throws are merely tolerable at 78.4%, so I would prefer McDaniels if that percentage is already tight. Around pick 100, Wiggins is a reasonable way to keep both threes and blocks alive.' }
    ] },
    { round: 10, candidates: [
      { name: 'Cason Wallace', yahooAdp: 118.2, yahooPreRank: 76, note: 'Wallace is a much easier player to carry once you stop needing him to score. His two steals came with just 0.9 turnovers, allowing him to help at both ends of a possession while other guards handle the creation. That distinction matters: 2.6 assists will not solve a shortage of point-guard production. He is a particularly good companion for Jokić, whose passing lets you use a guard slot this way. Compared with Ausar, Wallace supplies more threes and a far less damaging free-throw percentage, so the defensive gain is easier to fit into a single punt. He still shot only 43.2% from the field, albeit on 7.6 attempts. Near the end of round ten, I would take him for steals and turnovers, without needing an offensive breakout.' },
      { name: 'Tre Jones', yahooAdp: 116, yahooPreRank: 156, note: 'Jones deserves more attention in this build than his general ranking suggests. He produced 5.4 assists with 1.4 turnovers, shot 55.3% FG and made 84.1% of his free throws on 3.5 attempts. Those percentages have enough volume to matter, especially after you have added a lower-efficiency guard. The main sacrifice is shooting from outside: 0.6 threes makes him difficult to pair with several other non-shooters. Chicago still has Giddey to handle a large share of the creation, so I would not project Jones as an unrestricted lead guard. His existing line is enough to make the argument. If assists and FG% are your last two needs, I would consider him around his ADP near 116 rather than insist on waiting until his overall rank of 130.' }
    ] },
    { round: 11, candidates: [
      { name: 'Reed Sheppard', yahooAdp: 120.8, yahooPreRank: 56, note: 'Sheppard is the late guard to look for when the early defense has left you short of threes. He made 2.8 per game while adding 1.5 steals and 0.7 blocks, enough defensive help that the shooting does not require a major change in direction. Wallace offers more steals and fewer turnovers, but less than half as many threes. The reason Sheppard remains a later pick is the workload question with VanVleet expected back; last season\'s 26.2 minutes and 82 games are a useful record, not a guaranteed role. His 43.0% FG is another reason to surround him with efficient finishers. Around the tenth/eleventh-round turn, I prefer that upside for a team which already has passing and can absorb the shooting percentage.' },
      { name: 'Ayo Dosunmu', yahooAdp: 114.9, yahooPreRank: 96, note: 'Dosunmu is a useful last guard when the roster needs better shooting percentages rather than another specialist in steals. He made 51.7% of his field goals and 87.6% of his free throws, with 1.8 threes and only 1.4 turnovers. That gives him a quieter route to helping than a guard who needs heavy usage to accumulate assists. The Minnesota rotation is the main obstacle: with Ball and Edwards together, Dosunmu has competition for both minutes and ballhandling. A repeat of his 27.3-minute workload would be enough to keep him interesting, but I would not assume a larger role. He fits after a White or Suggs pick when the existing defense is sound and the percentages need some support.' },
      { name: 'Brandin Podziemski', yahooAdp: 116.8, yahooPreRank: 99, note: 'Podziemski is useful when the roster has several small shortages rather than one glaring hole. His 5.1 rebounds, 3.7 assists and 1.9 threes cover more ground than a specialist who only blocks shots or steals the ball. He also played all 82 games and kept turnovers to 1.6, which is appealing after a few less dependable selections. The percentages explain why I would not choose him simply to make the team safer: 45.5% FG and 79.7% FT offer little protection. If assists are the main problem, Jones gives you more; if threes are urgent, Sheppard supplies more. Podziemski makes sense when you need a little of both plus guard rebounding, and he reaches the late tenth or early eleventh.' }
    ] },
    { round: 12, candidates: [
      { name: 'Neemias Queta', yahooAdp: 115.2, yahooPreRank: 116, note: 'Queta can still help a roster that reaches the final rounds without enough efficient rebounding. He shot 65.3% from the field, collected 8.4 boards and blocked 1.3 shots with about one turnover. The volume is worth noticing: those field goals came on 6.6 attempts, so he will have less influence over FG% than Duren despite the similar accuracy. Boston has added Mitchell Robinson, creating real competition for center minutes after Queta\'s 25.3-minute season. That is why I would want a discount from Yahoo\'s price near 115. His 70.3% FT and almost nonexistent threes also rule out using him as a universal final pick. He belongs here if he slips and your remaining need is specifically FG%, rebounds and blocks.' },
      { name: 'Jay Huff', yahooAdp: null, yahooPreRank: null, note: 'Getting 1.9 blocks and 1.5 threes from a player who barely scores is exactly the kind of trade this build can make. Huff produced that line in 21 minutes a game and appeared in all 82, so he has shown he can contribute without a starter\'s workload. Zubac is now ahead of him in Indiana, however, and there is a difference between maintaining a smaller role and being squeezed out of useful minutes. The other limitation is easy to miss: Huff averaged four rebounds and shot 47.6% FG. He will not replace the rebounding or efficiency you normally want from a center. I like him as a final pick beside an established rebounder, with his threes giving him an edge over a pure block specialist. If you are still chasing boards, Queta addresses that need more directly.' }
    ] }
  ],
  faqs: [
    { q: 'Am I wasting an early pick on a player who scores a lot?', a: 'Some of the scoring value will go unused, but the rest of the line can still justify the pick. Jokić gives you elite passing from center; Wembanyama supplies an exceptional block advantage; Shai has enough accurate shooting volume to support several specialists. Take that foundation when the price is right. The punt becomes a mistake when you pass on a better overall contribution simply to find someone with a lower points average.' },
    { q: 'Can I combine Amen Thompson and Dyson Daniels?', a: 'Yes, if the rest of the roster can supply the shooting. Together they offer excellent guard rebounding and passing, but only about half a three per game between them. The FT% problem is more manageable than the individual percentages suggest because Daniels takes relatively few attempts. A Shai or Bane can provide useful support at the line; White, Anunoby and a shooting big can keep threes competitive. Without that support, the pair can push the team toward more category concessions than you intended.' },
    { q: 'Why not just load up on Gobert, Ausar and other defensive specialists?', a: 'Their defense still has value, but removing points does nothing to remove weak free throws or missing threes. Several such players together can leave you needing to win almost every remaining category each week. Wallace is often easier to fit when steals are the goal, while Holmgren or Okongwu can add frontcourt defense and some shooting. Choose the specialist whose weaknesses your existing roster can absorb.' },
    { q: 'What should I stream once the draft is over?', a: 'Use the open spot for the closest winnable category. If rebounds and blocks are already comfortably ahead, another center may do less than a guard who can add threes or steals. Turnovers and percentages need particular care late in a matchup: extra games can hurt as well as help. An open slot does not have to be filled when the additional attempts or turnovers would put a category lead at risk.' },
    { q: 'Does this work in eight-category leagues or roto?', a: 'In eight-category head-to-head leagues, the idea still works, but you lose the turnover advantage that makes players such as Wallace and Pritchard attractive. High-usage passers become easier to draft, and you should reassess the player order with turnovers removed. In roto, a season-long concession in points costs standings points that must be recovered elsewhere. This guide and its sample teams are aimed at weekly head-to-head matchups, where you can build a more direct route to five category wins.' }
  ]
};

export const PUNT_GUIDES = [PUNT_FT, PUNT_ASSISTS, PUNT_FG, PUNT_THREES, PUNT_POINTS];
