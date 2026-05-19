import { ADJECTIVES } from '../locales/adjectives.js';
import { NOUNS }      from '../locales/nouns.js';
import { COLORS }     from '../locales/colors.js';

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

export async function* streamTeamConfigs({ chunkSize = 10000 } = {}) {
  let i = 0;
  for (const config of allTeamConfigs()) {
    yield config;
    if (++i % chunkSize === 0) {
      await new Promise(r => setTimeout(r, 0));
    }
  }
}

export function pickInstantConfig(teamIndex) {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun      = NOUNS     [Math.floor(Math.random() * NOUNS.length)];
  const color     = COLORS    [Math.floor(Math.random() * COLORS.length)];
  return {
    adjective,
    noun,
    color,
    colorHex:  color.hex || color,
    teamIndex: teamIndex % TEAM_SLOTS,
  };
}

export async function pickRandomConfigForSlot(teamIndex, { onTick, tickEvery = 3000 } = {}) {
  let selected = null;
  let count    = 0;
  for await (const config of streamTeamConfigs({ chunkSize: 10000 })) {
    if (config.teamIndex !== teamIndex) continue;
    count++;
    if (Math.random() < 1 / count) selected = config;
    if (onTick && count % tickEvery === 0) onTick(selected);
  }
  return selected;
}

export async function processTeamConfigsInChunks(chunkSize, onChunk) {
  let chunk = [], chunkIndex = 0;
  for await (const config of streamTeamConfigs({ chunkSize })) {
    chunk.push(config);
    if (chunk.length >= chunkSize) {
      await onChunk(chunk, chunkIndex++);
      chunk = [];
    }
  }
  if (chunk.length > 0) await onChunk(chunk, chunkIndex);
}

export async function computeStreamStats() {
  const uniqueNames = new Set();
  const perSlot     = new Array(TEAM_SLOTS).fill(0);
  const perColor    = {};
  let total = 0, longestName = '';
  for await (const config of streamTeamConfigs({ chunkSize: 10000 })) {
    total++;
    uniqueNames.add(config.name);
    perSlot[config.teamIndex]++;
    perColor[config.color.name] = (perColor[config.color.name] ?? 0) + 1;
    if (config.name.length > longestName.length) longestName = config.name;
  }
  return { total, uniqueNames: uniqueNames.size, perSlot, perColor, longestName };
}