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
  slug: 'punt-assists',
  type: 'punt',
  puntKey: 'ast',
  title: 'Punt Assists',
  season: CONTENT_SEASON,
  difficulty: 'Intermediate',
  isPremium: true,
  tagline: 'Keep the points and defensive stats; stop paying for playmaking you will not use.',
  strengths: ['pts', 'reb', 'blk', 'to'],
  weaknesses: ['ast', 'stl', 'ft', '3pm'],
  freeSections: 2,
  board: { minGames: 30, freeLimit: 20, previewRows: 4 },
  sections: [
    {
      id: 'strategy',
      heading: 'The strategy',
      body: [
        'Punt assists is a nine-category plan for a roster whose best players score, rebound, defend and finish possessions without creating many shots for teammates. Victor Wembanyama is the cleanest opening: his 2025-26 line included 25.0 points, 11.5 rebounds and 3.1 blocks, but only 3.1 assists. Removing assists makes that already elite combination easier to build around; his first-pick price is justified by the full line, not by a supposed punt discount.',
        'The next picks should buy points and threes from wings while preserving enough FG%, FT% and steals to win at least five of the eight remaining categories. Anthony Edwards is another plausible first-round start, with 28.8 points and 3.4 threes, but his 79.6% free throws on volume and ordinary block production make his follow-up picks very different from Wembanyama\'s.'
      ]
    },
    {
      id: 'correlation',
      heading: 'Natural strengths & weaknesses',
      body: [
        'Centers and finishing forwards make rebounds, FG% and blocks accessible, while low-usage wings can keep turnovers down. That is a menu of possible strengths, not a promise that every punt-assists team wins all four. An Edwards start still needs blocks and boards; a Wembanyama-Clingan start has plenty of both but must buy perimeter scoring and steals elsewhere.',
        'The danger is drifting into a second punt. Traditional centers often give little in threes, and some also damage FT%. Gobert\'s 52.6% free throws make him an expensive fit if you still intend to win the line; Clingan\'s 69.2% is a smaller but real cost. Use shooting wings such as Murphy or Porter for threes, and defenders such as Anunoby or Wallace for steals. Low assists alone do not make a player a target: the other eight categories must justify his draft price.'
      ]
    },
    {
      id: 'draft',
      heading: 'Where the value sits in the draft',
      body: [
        'Yahoo\'s September 26 snapshot puts Wembanyama near pick two and Edwards near pick eight. Towns and Durant usually cost a second-round pick; Holmgren and Kawhi are third-round prices. Use the first three picks to establish points and either defensive big-man production or efficient shooting. Murphy, Porter and later three-point wings can fill the opposite side, but they cannot rescue a roster that has already given away FT% and steals.',
        'The board below removes assists from corrected 2025-26 production; it records last season rather than projecting 2026-27. The round targets use the dated Yahoo ADP and pre-rank snapshot, then account for role and availability. Treat the round labels as a draft queue, especially after pick 100 where the market is tightly packed.'
      ]
    }
  ],
  buildingBlocks: [
    { name: 'An anchor with real category weight', note: 'Wembanyama supplies blocks and boards; Edwards supplies points and threes. Draft the complement, not a copy of the first pick.' },
    { name: 'Scoring without an assist premium', note: 'Use wings such as Murphy, Porter and Powell for points and threes after securing the frontcourt.' },
    { name: 'Protected percentages and steals', note: 'Check FT% attempts and FG% volume, then add a genuine steals source before the late rounds.' }
  ],
  exampleTeams: [
    {
      name: 'Wembanyama with shooting wings',
      color: '#2f80ed',
      note: 'A roughly one-per-round eight-pick start by Yahoo price. Wembanyama and Holmgren carry blocks, while Murphy, Bane and Durant supply threes and points. Anunoby adds steals and Bridges keeps turnovers modest. Recheck steals and rebounds before filling the last roster spots; two elite shot blockers do not settle every category.',
      roster: ['Victor Wembanyama', 'Kevin Durant', 'Chet Holmgren', 'Trey Murphy III', 'Desmond Bane', 'OG Anunoby', 'Mikal Bridges', 'Norman Powell']
    },
    {
      name: 'Edwards with a defensive frontcourt',
      color: '#16a085',
      note: 'Edwards, Kawhi and Porter carry scoring while Towns, Clingan and Buzelis buy back boards and blocks. McDaniels adds steals and efficient wing shooting. Clingan\'s free throws and the health of Kawhi and Porter are the constraints; avoid another poor-FT big until the team radar says the line is safe.',
      roster: ['Anthony Edwards', 'Karl-Anthony Towns', 'Kawhi Leonard', 'Donovan Clingan', 'Michael Porter Jr.', 'Matas Buzelis', 'Mikal Bridges', 'Jaden McDaniels']
    }
  ],
  roundTargets: [
    { round: 1, candidates: [
      { name: 'Victor Wembanyama', yahooAdp: 1.6, yahooPreRank: 3, note: 'The 3.1 blocks, 11.5 boards and 25.0 points make Wembanyama a first-pick anchor even before the assist punt. His 3.1 assists become unused value, but the real benefit is freedom to take later scorers who do not pass. Add threes and steals around him.' },
      { name: 'Anthony Edwards', yahooAdp: 8.3, yahooPreRank: 6, note: 'Edwards gives 28.8 points and 3.4 threes without asking you to win assists. His 79.6% FT on volume can still hurt, so buy a strong free-throw source and a blocker in the next two rounds.' },
      { name: 'Jayson Tatum', yahooAdp: 9.8, yahooPreRank: 14, note: 'Ten rebounds and 2.9 threes in his 16-game return show a useful forward shape for this build. The post-Achilles sample is short; draft for the broader scoring and shooting possibility while pricing in uncertain availability.' }
    ] },
    { round: 2, candidates: [
      { name: 'Karl-Anthony Towns', yahooAdp: 15, yahooPreRank: 13, note: 'Towns offers 11.9 boards, threes and 85.8% free throws from a center slot. He is especially helpful after Edwards because he repairs frontcourt production without turning FT% into a second punt. His 2.5 turnovers are the tradeoff.' },
      { name: 'Kevin Durant', yahooAdp: 16.9, yahooPreRank: 27, note: 'Durant scored 26.0 points on 52.0% shooting and 87.4% free throws across 78 games. That is a strong percentages partner for Wembanyama or Edwards; add steals and rebounding next rather than expecting Durant to carry either.' },
      { name: 'Stephen Curry', yahooAdp: 23.9, yahooPreRank: 11, note: 'Curry supplies elite threes and FT% without requiring a team to chase his passing. Forty-three games last season make the late-second price a health bet. Pair him with a reliable rebounder and do not count on full-season volume.' }
    ] },
    { round: 3, candidates: [
      { name: 'Chet Holmgren', yahooAdp: 27.7, yahooPreRank: 19, note: 'His 1.9 blocks, 8.9 rebounds and 1.3 threes give you the defensive big who does not erase spacing. The 1.7 assists no longer hold the line back; his minutes in Oklahoma City still limit the volume ceiling.' },
      { name: 'Kawhi Leonard', yahooAdp: 29.3, yahooPreRank: 15, note: 'Kawhi brought 27.5 points and 1.8 steals in 65 games, solving two columns a big-heavy opening can miss. His Toronto role after the September trade is new, and age makes another 65-game season uncertain.' },
      { name: 'Jaylen Brown', yahooAdp: 27.5, yahooPreRank: 95, note: 'Brown\'s 28.5 points and 6.9 boards are useful from a wing once assists disappear. Philadelphia has more mouths to feed than last year\'s Boston lineup; treat the old scoring rate as a ceiling, not a settled forecast.' }
    ] },
    { round: 4, candidates: [
      { name: 'Trey Murphy III', yahooAdp: 40.1, yahooPreRank: 21, note: 'Murphy made 3.2 threes, scored 21.5 points and added 1.5 steals. He is the clean perimeter complement to an early Wembanyama or Clingan pick, though his strong FT% should be preserved rather than wasted beside several poor-FT centers.' },
      { name: 'Lauri Markkanen', yahooAdp: 38.7, yahooPreRank: 18, note: 'Markkanen gives 26.6 points, useful threes and 89.6% free throws while his 2.1 assists stop mattering. Forty-two games and Utah\'s changed frontcourt make this a price-sensitive upside pick; do not rely on him alone for scoring volume.' },
      { name: 'Donovan Clingan', yahooAdp: 41.6, yahooPreRank: 29, note: 'Clingan\'s 11.5 rebounds and 1.7 blocks over 77 games can secure the frontcourt early. His 69.2% free throws and modest points mean he works best after a strong shooting and scoring start, not beside another FT% drag.' }
    ] },
    { round: 5, candidates: [
      { name: 'Jaren Jackson Jr.', yahooAdp: 50.5, yahooPreRank: 54, note: 'Jackson offers blocks and scoring from a forward slot, a useful bridge when early picks bought threes. His 1.4 blocks were below his old peak, and Utah\'s frontcourt is crowded; do not pay for a return to his best defensive season.' },
      { name: 'Michael Porter Jr.', yahooAdp: 59.6, yahooPreRank: 55, note: 'Porter supplied 24.2 points, 3.4 threes and 7.1 boards in Brooklyn, with only three assists to give away. Fifty-two games and a changing Nets frontcourt make the fifth-round cost attractive but far from certain.' },
      { name: 'Nickeil Alexander-Walker', yahooAdp: 60.1, yahooPreRank: 24, note: 'His 20.8 points, 3.2 threes and 90.2% free throws over 81 games can balance a big-heavy start. He is a better fit when your first four picks already bought rebounds and blocks; draft the scoring role rather than expecting lead-guard assists.' }
    ] },
    { round: 6, candidates: [
      { name: 'Desmond Bane', yahooAdp: 52.9, yahooPreRank: 44, note: 'Bane played 82 games, scored 20.1 points and shot 90.2% at the line. A team carrying Clingan\'s FT% can use him to protect that category; he adds threes without forcing another high-turnover creator.' },
      { name: 'Matas Buzelis', yahooAdp: 61.9, yahooPreRank: 34, note: 'The 2.2 threes and 1.5 blocks are a rare forward combination. His next step depends on Chicago\'s role distribution, so buy the existing shooting-and-block profile and treat a scoring leap as upside.' },
      { name: 'OG Anunoby', yahooAdp: 66.6, yahooPreRank: 60, note: 'Anunoby adds 1.6 steals and 2.3 threes without needing the ball. He fills a common punt-assists hole after a center-heavy start, with 67 games providing a sturdier availability base than several other wings in this range.' }
    ] },
    { round: 7, candidates: [
      { name: 'Naz Reid', yahooAdp: 62.5, yahooPreRank: 53, note: 'Reid brings threes, rebounds and blocks from the frontcourt. Charlotte offers a new route to minutes, but his precise role is still uncertain; use him when your roster needs spacing and defense from the same slot.' },
      { name: 'Mikal Bridges', yahooAdp: 79.6, yahooPreRank: 41, note: 'Bridges played all 82 games, shot 49.0% and contributed threes, steals and low turnovers. The 14.4 points do not make him a scorer to build around, but his clean wing line complements higher-volume early picks.' },
      { name: 'Kel\'el Ware', yahooAdp: 73.2, yahooPreRank: 51, note: 'Ware posted nine rebounds, 1.1 blocks and 1.2 threes. Milwaukee\'s rotation after the Giannis trade is a projection, so this is a bet on a useful category mix rather than guaranteed extra minutes.' }
    ] },
    { round: 8, candidates: [
      { name: 'Jaden McDaniels', yahooAdp: 89.2, yahooPreRank: 43, note: 'McDaniels gave 1.1 steals, 1.0 blocks and 51.5% shooting while contributing 14.8 points. He is a clean wing defender after an Edwards start; Minnesota\'s new guard rotation could change his shots.' },
      { name: 'Norman Powell', yahooAdp: 92.4, yahooPreRank: 115, note: 'Powell\'s 21.7 points and 2.7 threes are unusually available at this price, and the light assists cost nothing here. Chicago is a new scoring context, so draft him to finish an established team rather than to carry its first offensive category.' },
      { name: 'Jabari Smith Jr.', yahooAdp: 94.1, yahooPreRank: 84, note: 'Smith made 2.3 threes and grabbed 6.9 boards over 77 games. He fits when early scorers left the forward slots thin on rebounding; Houston\'s crowded frontcourt limits how much more to project.' }
    ] },
    { round: 9, candidates: [
      { name: 'Andrew Wiggins', yahooAdp: 100.7, yahooPreRank: 103, note: 'Wiggins gives two threes, a steal and a block from the wing. His 47.5% shooting is manageable beside an efficient big, but Giannis\' arrival in Miami makes the old scoring share uncertain.' },
      { name: 'Myles Turner', yahooAdp: 100.3, yahooPreRank: 109, note: 'Turner still supplied 2.1 threes and 1.6 blocks, a rare late-center pair. His 44.0% FG and 5.3 rebounds are real costs; take him after FG% and boards are secure, not as a substitute for them.' },
      { name: 'Toumani Camara', yahooAdp: 110.1, yahooPreRank: 98, note: 'Camara played 82 games and made 2.6 threes with 5.1 rebounds. His 70.7% free throws can pull down an otherwise clean punt-assists build, so check attempts and roster impact before paying for the shooting.' }
    ] },
    { round: 10, candidates: [
      { name: 'Cason Wallace', yahooAdp: 118.2, yahooPreRank: 76, note: 'Two steals and just 0.9 turnovers make Wallace useful when the first nine picks already secured points. His 8.6 points cannot rescue offense, but the 2.6 assists are no longer a reason to pass on him.' },
      { name: 'Saddiq Bey', yahooAdp: 120.1, yahooPreRank: 108, note: 'Bey gave 17.7 points, 2.1 threes, 5.6 boards and 0.9 turnovers in 72 games. Limited defensive stats mean he belongs on a roster that already has steals and blocks.' },
      { name: 'Devin Vassell', yahooAdp: 116.5, yahooPreRank: 122, note: 'Vassell made 2.5 threes with fewer than one turnover per game, useful final shooting without a playmaking premium. His thin steals mean the category needs another source earlier.' }
    ] },
    { round: 11, candidates: [
      { name: 'P.J. Washington', yahooAdp: 115.8, yahooPreRank: 178, note: 'Washington adds seven boards, a steal and a block from forward, useful defensive insurance after several shooting wings. His 45.0% FG is a poor fit if your first centers were already inefficient.' },
      { name: 'Julian Champagnie', yahooAdp: 110.9, yahooPreRank: 128, note: 'Champagnie supplied 2.4 threes and 5.8 boards in 82 games with modest usage. He is a late shooting-and-rebounding piece; the clustered Yahoo market can push him a round earlier.' },
      { name: 'Neemias Queta', yahooAdp: 115.2, yahooPreRank: 116, note: 'Queta shot 65.3% with 8.4 boards and 1.3 blocks over 76 games. His zero threes and 70.3% FT create pressure elsewhere, so take him only if shooting and the line can absorb it.' }
    ] },
    { round: 12, candidates: [
      { name: 'Moses Moody', yahooAdp: null, yahooPreRank: null, note: 'Moody made 2.5 threes with 0.9 turnovers and little creation, exactly the clean wing shape this build can use. His 60 games and Golden State\'s crowded rotation make him an end-of-draft option, not a volume guarantee.' },
      { name: 'Jay Huff', yahooAdp: null, yahooPreRank: null, note: 'Huff paired 1.9 blocks with 1.5 threes across 82 games. Indiana\'s addition of Zubac threatens his minutes, so take him only when the late price and your block need justify that role risk.' },
      { name: 'Dillon Brooks', yahooAdp: 114.9, yahooPreRank: 171, note: 'Brooks scored 20.2 points and made 2.3 threes with only 1.8 assists, but 43.5% shooting can undo the benefit. Draft him after a strong FG% base and only if you still need points.' }
    ] }
  ],
  faqs: [
    { q: 'Does punt assists mean I should draft only bigs?', a: 'No. A big-heavy team can lose threes, steals and FT%. Use low-assist scoring wings and defenders to keep those columns competitive.' },
    { q: 'Should I avoid every good passer?', a: 'No. Wembanyama and Towns remain valuable even when some assists are discarded. Pay for the categories a player still wins; do not spend an early pick mainly for passing.' },
    { q: 'What is the most common second punt?', a: 'FT% is the main risk when several traditional centers are paired. Threes or steals can also slip away if every later pick is another rebounder.' },
    { q: 'Does this work in eight-category leagues?', a: 'Yes, but turnovers disappear, taking away one of the natural benefits of low-usage players. Recheck the seven remaining category strengths before assuming the same targets are discounted.' }
  ]
};

export const PUNT_FG = {
  slug: 'punt-fg',
  type: 'punt',
  puntKey: 'fg',
  title: 'Punt FG%',
  season: CONTENT_SEASON,
  difficulty: 'Intermediate',
  isPremium: true,
  tagline: 'Turn high-volume guard shooting into points, threes and assists without sacrificing the line or defense.',
  strengths: ['pts', '3pm', 'ast', 'ft'],
  weaknesses: ['fg', 'reb', 'blk', 'to'],
  freeSections: 2,
  board: { minGames: 30, freeLimit: 20, previewRows: 4 },
  sections: [
    {
      id: 'strategy',
      heading: 'The strategy',
      body: [
        'Punt FG% gives high-volume shooters a fairer price by removing the damage their misses do to one category. Luka Dončić is a plausible first-round anchor: his corrected 2025-26 line delivered 33.4 points, 4.0 threes, 7.7 rebounds and 8.2 assists, while his 4.0 turnovers still count. The punt does not excuse the rest of the line. It works best when the first pick gives enough scoring and creation to spend later picks on rebounds, blocks and ball security.',
        'LaMelo Ball shows the percentage discount: 3.8 threes and 7.1 assists came with 40.7% shooting. But Yahoo drafts him near pick 26 while our Top 150 places him 48th, reflecting his new shared backcourt in Minnesota. The punt improves his category fit without making a second-round reach sensible. Look for a price closer to the third round, then add defenders who do not need another high-usage guard spot.'
      ]
    },
    {
      id: 'correlation',
      heading: 'Natural strengths & weaknesses',
      body: [
        'Points, threes, assists and FT% are accessible when early picks favor perimeter scorers. None comes automatically: a low-FG defensive specialist does not replace an elite scorer, and a poor-FT guard can undo the line even if his shooting from the floor no longer matters. Derrick White is especially useful because his 39.5% FG is waived while 2.7 threes, 5.4 assists and 1.3 blocks remain.',
        'Rebounds and blocks are the structural test. Holmgren or a mid-round Buzelis can add blocks without giving up all your threes; Hart supplies rebounds from a wing. Turner gives 1.6 blocks and 2.1 threes at a late price, but only 5.3 rebounds. The other trap is turnovers: stacking Luka, LaMelo and Harden can make a second punt more likely than eight competitive categories. Check the whole roster before buying another creator.'
      ]
    },
    {
      id: 'draft',
      heading: 'Where the value sits in the draft',
      body: [
        'The September 26 Yahoo ADP puts Luka near pick four, Maxey and Edwards in the first round, Harden near 35 and White near 47. Our Top 150 has Harden 26th and White 29th, so neither belongs in a guide that asks you to wait until round five. Conversely, Trae is 55th on our board at a Yahoo price near 27, and LaMelo is 48th at a Yahoo price near 26; an FG% punt alone is not a reason to pay those second-to-third-round prices.',
        'The board below removes FG% from corrected 2025-26 production. It records what players produced, not their projected 2026-27 value. The targets use our Top 150 for the forward-looking case, a September 26 Yahoo ADP snapshot for draft cost, and Yahoo standard pre-ranks checked October 2. Round labels describe a price window, not a promise that a player will fall; after pick 100, use your room and roster needs rather than an exact number.'
      ]
    }
  ],
  buildingBlocks: [
    { name: 'One primary creator', note: 'Secure points, threes and assists without stacking several four-turnover players.' },
    { name: 'Defense from unusual slots', note: 'White can add blocks from guard; Holmgren, Buzelis or Turner combine rim protection with shooting.' },
    { name: 'Boards and free throws kept intact', note: 'Add a rebounding wing or center while checking FT% attempts, then monitor turnovers after each creator.' }
  ],
  exampleTeams: [
    {
      name: 'Luka with out-of-position blocks',
      color: '#8e44ad',
      note: 'A 12-team snake path from roughly pick four: the next turns land near 21, 28, 45, 52, 69, 76 and 93. Curry, Holmgren, White and Jackson are plausible at those prices, while Anunoby and Hart need small slips. White and Holmgren supply blocks and Hart adds wing boards. Luka and Curry make turnovers the eighth-category fight; choose low-turnover depth if that column stays close.',
      roster: ['Luka Dončić', 'Stephen Curry', 'Chet Holmgren', 'Derrick White', 'Jaren Jackson Jr.', 'OG Anunoby', 'Mikal Bridges', 'Josh Hart']
    },
    {
      name: 'Maxey with frontcourt balance',
      color: '#c2185b',
      note: 'A 12-team snake path from pick nine: Towns, Harden, White, Porter, Buzelis, Bridges and Hart fit the next turns near 16, 33, 40, 57, 64, 81 and 88. White and Harden gain from removing FG%, Towns protects boards and FT%, and Hart adds boards at a free-throw cost. Blocks still need the next pick or a later Turner-type center; Hart around 88 costs slightly more than his Yahoo ADP.',
      roster: ['Tyrese Maxey', 'Karl-Anthony Towns', 'James Harden', 'Derrick White', 'Michael Porter Jr.', 'Matas Buzelis', 'Mikal Bridges', 'Josh Hart']
    }
  ],
  roundTargets: [
    { round: 1, candidates: [
      { name: 'Luka Dončić', yahooAdp: 3.5, yahooPreRank: 5, note: 'The 33.4 points, 4.0 threes, 7.7 boards and 8.2 assists justify the early price; removing FG% makes high-volume nights easier to carry. His 4.0 turnovers still count, so buy ball security and blocks with the next picks rather than another lead guard.' },
      { name: 'Tyrese Maxey', yahooAdp: 8.8, yahooPreRank: 4, note: 'Maxey posted 28.3 points, 3.1 threes, 6.6 assists and 1.9 steals across 70 games. Philadelphia added LeBron and Jaylen Brown, so the old usage is not a forecast. The FG% punt helps if his shot volume stays high; seek rebounds and blocks next.' },
      { name: 'Anthony Edwards', yahooAdp: 8.3, yahooPreRank: 6, note: 'Edwards supplies 28.8 points and 3.4 threes, but his 79.6% FT on volume remains a cost even after FG% disappears. Do not mistake a scoring start for a complete punt: draft a strong FT% source and a blocker soon.' }
    ] },
    { round: 2, candidates: [
      { name: 'Karl-Anthony Towns', yahooAdp: 15, yahooPreRank: 11, note: 'Our Top 150 places Towns 17th, close to his Yahoo ADP of 15. His 11.9 rebounds and 85.8% free throws solve two common guard-build problems; giving away his positive FG% is acceptable when you need those scarce categories. His 2.5 turnovers still count.' },
      { name: 'Stephen Curry', yahooAdp: 23.9, yahooPreRank: 12, note: 'Curry made 4.4 threes and remains a major FT% contributor. Our Top 150 places him 19th, but his 43 games make a late-second price a health bet. Take him after a durable opener and buy rebounds soon.' },
      { name: 'Austin Reaves', yahooAdp: 22.3, yahooPreRank: 17, note: 'Our Top 150 places Reaves 12th against Yahoo ADP 22. His 22.9 points, 5.5 assists and 86.8% free throws work even though you give away his good 48.7% FG. The 51-game season and new usage beside Luka make a durable, high-stocks third pick important.' }
    ] },
    { round: 3, candidates: [
      { name: 'Chet Holmgren', yahooAdp: 27.7, yahooPreRank: 19, note: 'His 1.9 blocks, 8.9 rebounds and 1.3 threes solve the guard-heavy build\'s hardest pairing. You give away his 55.7% shooting, but the remaining categories still justify the pick; do not force a lower-ranked percentage drag just because it fits the punt more literally.' },
      { name: 'James Harden', yahooAdp: 35.1, yahooPreRank: 49, note: 'Our Top 150 has Harden 26th, so a third-round Yahoo price is already reasonable before FG% is removed. His 7.9 assists, 3.0 threes and 88.2% free throws suit the build, but 3.5 turnovers and shared Cleveland creation still matter. Use the next pick on defense rather than a third lead guard.' },
      { name: 'Devin Booker', yahooAdp: 26.9, yahooPreRank: 40, note: 'Booker offers scoring, around six assists and strong free throws. Phoenix added another scorer in Miles Bridges, so usage is not fixed. His balanced skill set is useful here when you still need FT% volume; pair him with blocks rather than yet another perimeter scorer.' }
    ] },
    { round: 4, candidates: [
      { name: 'Derrick White', yahooAdp: 47.1, yahooPreRank: 26, note: 'Our Top 150 puts White 29th, well ahead of his Yahoo ADP. Removing his 39.5% FG while keeping 2.7 threes, 5.4 assists and 1.3 blocks makes a fourth-round pick defensible. Do not plan on getting him in round five.' },
      { name: 'Trey Murphy III', yahooAdp: 40.1, yahooPreRank: 22, note: 'Our Top 150 has Murphy 24th, well ahead of Yahoo ADP 40. His 3.2 threes, 21.5 points, 1.5 steals and 88.6% free throws justify the fourth-round price even though FG% is not his main weakness. He is a cleaner partner for a poor-FG creator than another high-turnover guard.' },
      { name: 'Lauri Markkanen', yahooAdp: 38.7, yahooPreRank: 18, note: 'Markkanen gives 26.6 points, threes and 89.6% free throws from forward, with just 1.5 turnovers. Forty-two games and Utah\'s new frontcourt create uncertainty, so pay for the useful scoring-and-FT profile rather than assuming another full-volume season.' }
    ] },
    { round: 5, candidates: [
      { name: 'Brandon Miller', yahooAdp: 46.8, yahooPreRank: 46, note: 'Miller made 3.1 threes and scored 20.2 points despite 43.5% FG. Charlotte\'s changed backcourt could increase his role, but 2.5 turnovers and limited frontcourt stats remain. Select him when threes and points are worth more to your roster than another blocker.' },
      { name: 'Jaren Jackson Jr.', yahooAdp: 50.5, yahooPreRank: 54, note: 'Jackson\'s 1.4 blocks and 1.8 threes protect both ends of a guard-heavy build. He played 48 games and now shares Utah\'s frontcourt with Markkanen, so use his defensive rate without assuming a return to old minutes or block peaks.' },
      { name: 'Michael Porter Jr.', yahooAdp: 59.6, yahooPreRank: 55, note: 'Our Top 150 places Porter 40th against a Yahoo ADP near 60. His 24.2 points, 3.4 threes and 7.1 boards offer unusually useful wing rebounding, though 52 games and a changing Brooklyn role keep him a fifth-round health bet.' }
    ] },
    { round: 6, candidates: [
      { name: 'Matas Buzelis', yahooAdp: 61.9, yahooPreRank: 34, note: 'Buzelis supplied 2.2 threes and 1.5 blocks, a rare pairing that prevents the FG% punt from becoming a blocks punt. Chicago\'s larger role is possible rather than guaranteed; value last season\'s category mix first.' },
      { name: 'OG Anunoby', yahooAdp: 66.6, yahooPreRank: 60, note: 'Our Top 150 places Anunoby 49th. At Yahoo ADP 67, his 1.6 steals, 2.3 threes and 1.8 turnovers help a Luka or Harden team without adding another high-usage guard; take him in the sixth rather than assuming a seventh-round fall.' },
      { name: 'Alex Sarr', yahooAdp: 71.9, yahooPreRank: 59, note: 'Sarr is 45th on our Top 150 and costs a late sixth by Yahoo ADP. His 2.0 blocks and 16.3 points are useful category repair, but 69.2% free throws and a 48-game season make the exact fit conditional on your FT% base.' }
    ] },
    { round: 7, candidates: [
      { name: 'Mikal Bridges', yahooAdp: 79.6, yahooPreRank: 41, note: 'Our Top 150 has Bridges 60th versus a Yahoo ADP near 80. His 82 games, threes, steals and low turnovers make him a realistic seventh-round stabilizer after a high-usage opening, even though his good FG% is unused.' },
      { name: 'Kel\'el Ware', yahooAdp: 73.2, yahooPreRank: 51, note: 'Ware\'s nine rebounds, 1.1 blocks and 1.2 threes are an early-seventh frontcourt option if blocks remain thin. Our Top 150 places him 66th; Milwaukee\'s new rotation makes the old minutes less certain.' },
      { name: 'Paul George', yahooAdp: 80.4, yahooPreRank: 126, note: 'George is 76th on our Top 150 and goes near 80 by Yahoo ADP. His 2.7 threes and 1.7 steals offer wing depth without another point guard, but 37 games and a new Boston role make him an availability bet.' }
    ] },
    { round: 8, candidates: [
      { name: 'Jabari Smith Jr.', yahooAdp: 94.1, yahooPreRank: 84, note: 'Smith supplied 2.3 threes, 6.9 rebounds and 0.9 blocks across 77 games. He brings more boards than a pure shooting wing and more spacing than a traditional center; Houston\'s rotation limits the scoring projection.' },
      { name: 'Josh Hart', yahooAdp: 96.3, yahooPreRank: 68, note: 'Hart\'s 7.4 boards and 4.8 assists from a wing repair rebounding without another high-turnover creator. Yahoo ADP 96 puts him at the round-eight edge; securing him in the high 80s is a reasonable small reach if boards are scarce. His 72.0% FT still needs covering.' },
      { name: 'Norman Powell', yahooAdp: 92.4, yahooPreRank: 115, note: 'Our Top 150 has Powell 81st against Yahoo ADP 92. His 21.7 points and 2.7 threes provide late scoring, while light rebounds and assists mean he fits only after the first seven picks secure those categories.' }
    ] },
    { round: 9, candidates: [
      { name: 'Myles Turner', yahooAdp: 100.3, yahooPreRank: 108, note: 'Turner\'s 44.0% FG disappears here, leaving 2.1 threes and 1.6 blocks at center. Our Top 150 places him 88th, so Yahoo ADP 100 looks fair, but his 5.3 boards do not solve rebounding. Pair him with a rebounding wing or big.' },
      { name: 'Kristaps Porziņģis', yahooAdp: 98.8, yahooPreRank: 148, note: 'Porziņģis offered 1.7 threes and 1.2 blocks with strong free throws from center. Thirty-two games and Golden State\'s health management make this a volatile buy, so the rest of the early roster should be durable.' },
      { name: 'Andrew Wiggins', yahooAdp: 100.7, yahooPreRank: 103, note: 'Wiggins brings 2.0 threes, 1.1 steals and roughly one block from a wing spot. Our Top 150 places him 86th, close enough to Yahoo ADP 101 to use him as a ninth-round stocks patch; Giannis\' arrival in Miami makes scoring volume uncertain.' }
    ] },
    { round: 10, candidates: [
      { name: 'Grayson Allen', yahooAdp: 116.2, yahooPreRank: 113, note: 'Allen made 3.1 threes with 1.4 steals while shooting 40.3%. This is a real punt-FG% gain at a Yahoo ADP near 116, but his move to Charlotte and a 51-game season create role and availability risk. Use him when boards and blocks are secure.' },
      { name: 'Cason Wallace', yahooAdp: 118.2, yahooPreRank: 76, note: 'Wallace\'s 2.0 steals and 0.9 turnovers help rescue the ninth category after early creators. He scored only 8.6 points, so he must be a category finisher rather than your last source of offense.' },
      { name: 'Toumani Camara', yahooAdp: 110.1, yahooPreRank: 97, note: 'Camara made 2.6 threes with 5.1 boards in 82 games. Yahoo ADP near 110 makes him a late-tenth-round wing, and our Top 150 places him 104th. His 70.7% FT makes the pick conditional on strong FT% volume already in place.' }
    ] },
    { round: 11, candidates: [
      { name: 'Reed Sheppard', yahooAdp: 120.8, yahooPreRank: 56, note: 'Sheppard made 2.8 threes with 1.5 steals and 0.7 blocks. VanVleet\'s return could shrink his Houston role; take him for shooting and defense only if the camp rotation supports minutes.' },
      { name: 'Saddiq Bey', yahooAdp: 120.1, yahooPreRank: 109, note: 'Bey contributed 17.7 points, 2.1 threes, 5.6 boards and just 0.9 turnovers. He is 102nd on our Top 150 versus Yahoo ADP 120, but thin stocks mean you need defenders already in place.' },
      { name: 'P.J. Washington', yahooAdp: 115.8, yahooPreRank: 178, note: 'Washington adds seven rebounds, 1.0 steals and 1.1 blocks. Our Top 150 places him 124th, close to Yahoo ADP 116; his 45.0% FG no longer hurts, but 68.7% FT still can. Take him only after strong FT% guards.' }
    ] },
    { round: 12, candidates: [
      { name: 'Donte DiVincenzo', yahooAdp: null, yahooPreRank: null, note: 'Three threes and 1.3 steals across 82 games become more appealing once his 40.6% FG is removed. Minnesota\'s new Ball-Edwards backcourt could change minutes, and this Yahoo snapshot has no reliable ADP; take the value only if it reaches your last pick.' },
      { name: 'Herbert Jones', yahooAdp: null, yahooPreRank: 147, note: 'Jones gave 1.6 steals despite 38.3% shooting. The punt clears that weakness, but 1.4 threes and limited scoring still make him a specialist. Use him only when your final roster needs a steal-rate boost.' },
      { name: 'Jay Huff', yahooAdp: null, yahooPreRank: null, note: 'Huff paired 1.9 blocks with 1.5 threes in 82 games. Zubac\'s arrival in Indiana threatens his minutes, so this is a final-round block-and-spacing gamble rather than guaranteed frontcourt volume.' }
    ] }
  ],
  faqs: [
    { q: 'Does punt FG% mean I should draft only inefficient guards?', a: 'No. A positive-FG player can still be the right pick if he supplies scarce rebounds, blocks or low turnovers. The punt removes a penalty; it does not erase your other seven or eight needs.' },
    { q: 'Can I win turnovers with Luka or Harden?', a: 'Possibly, but it takes low-turnover wings and careful choices after the first creator. Stacking several high-usage guards makes a second punt much more likely.' },
    { q: 'Which other categories are most at risk?', a: 'Rebounds and blocks are the usual structural gaps. FT% can also slip if you solve them with poor free-throw centers, so check both rate and attempt volume.' },
    { q: 'Does this work in eight-category leagues?', a: 'Yes. Without turnovers, high-usage guards get an extra lift, but rebounds and blocks still need deliberate draft capital.' }
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
