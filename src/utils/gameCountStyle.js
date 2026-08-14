// Heat-map styling for "games played this week" cells, shared by the schedule
// grids so a 4-game week looks the same everywhere.
//
// Same hues as the /nba-playoffs grid, but each pairs its background with a
// readable foreground: the original scale put black text on a dark green and
// white text on a near-white grey, both of which are effectively unreadable.
export const getGameCountStyle = (count) => {
  if (count >= 5) return { backgroundColor: '#1B5E20', color: '#ffffff', fontWeight: 700 };
  if (count === 4) return { backgroundColor: '#66BB6A', color: '#0d2410', fontWeight: 700 };
  if (count === 3) return { backgroundColor: '#E0E0E0', color: '#2c3440', fontWeight: 600 };
  if (count === 2) return { backgroundColor: '#EF9A9A', color: '#4a1c1c', fontWeight: 600 };
  if (count === 1) return { backgroundColor: '#C62828', color: '#ffffff', fontWeight: 600 };
  return { backgroundColor: '#F5F5F5', color: '#9aa1ab', fontWeight: 400 };
};

export default getGameCountStyle;
