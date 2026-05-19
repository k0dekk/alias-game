import { ADJECTIVES } from '../locales/teams/adjectives.js';
import { NOUNS }      from '../locales/teams/nouns.js';
import { COLORS }     from '../locales/teams/colors.js';

export const TEAM_SLOTS = 6;

function* allTeamConfigs() {
  for (const adjective of ADJECTIVES) {
    for (const noun of NOUNS) {
      for (let teamIndex = 0; teamIndex < TEAM_SLOTS; teamIndex++) {
        for (const color of COLORS) {
          yield { adjective, noun, name: `${adjective} ${noun}`, teamIndex, color };
        }
      }
    }
  }
}