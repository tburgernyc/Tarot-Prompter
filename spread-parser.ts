// lib/spread/parser.ts
// Deterministic card name parser and validation

import { z } from 'zod';

// Rider-Waite card names (Major Arcana + Minor Arcana)
const MAJOR_ARCANA = [
  'The Fool',
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
];

const MINOR_ARCANA_WANDS = [
  'Ace of Wands',
  'Two of Wands',
  'Three of Wands',
  'Four of Wands',
  'Five of Wands',
  'Six of Wands',
  'Seven of Wands',
  'Eight of Wands',
  'Nine of Wands',
  'Ten of Wands',
  'Page of Wands',
  'Knight of Wands',
  'Queen of Wands',
  'King of Wands',
];

const MINOR_ARCANA_CUPS = [
  'Ace of Cups',
  'Two of Cups',
  'Three of Cups',
  'Four of Cups',
  'Five of Cups',
  'Six of Cups',
  'Seven of Cups',
  'Eight of Cups',
  'Nine of Cups',
  'Ten of Cups',
  'Page of Cups',
  'Knight of Cups',
  'Queen of Cups',
  'King of Cups',
];

const MINOR_ARCANA_SWORDS = [
  'Ace of Swords',
  'Two of Swords',
  'Three of Swords',
  'Four of Swords',
  'Five of Swords',
  'Six of Swords',
  'Seven of Swords',
  'Eight of Swords',
  'Nine of Swords',
  'Ten of Swords',
  'Page of Swords',
  'Knight of Swords',
  'Queen of Swords',
  'King of Swords',
];

const MINOR_ARCANA_PENTACLES = [
  'Ace of Pentacles',
  'Two of Pentacles',
  'Three of Pentacles',
  'Four of Pentacles',
  'Five of Pentacles',
  'Six of Pentacles',
  'Seven of Pentacles',
  'Eight of Pentacles',
  'Nine of Pentacles',
  'Ten of Pentacles',
  'Page of Pentacles',
  'Knight of Pentacles',
  'Queen of Pentacles',
  'King of Pentacles',
];

const ALL_CARDS = [
  ...MAJOR_ARCANA,
  ...MINOR_ARCANA_WANDS,
  ...MINOR_ARCANA_CUPS,
  ...MINOR_ARCANA_SWORDS,
  ...MINOR_ARCANA_PENTACLES,
];

// Build lowercase alias map for fuzzy matching
const cardAliases: Record<string, string> = {};
ALL_CARDS.forEach((card) => {
  const lower = card.toLowerCase();
  cardAliases[lower] = card;
  // Also add common shorthand (e.g., "ace wands" -> "Ace of Wands")
  const parts = card.split(' of ');
  if (parts.length === 2) {
    const shorthand = `${parts[0]} ${parts[1]}`.toLowerCase();
    cardAliases[shorthand] = card;
  }
});

export const spreadSchema = z.object({
  currentSituation: z.array(z.string()).length(3),
  currentFeelings: z.array(z.string()).length(3),
  messageFromSpirit: z.array(z.string()).length(3),
  overallOutcome: z.array(z.string()).length(3),
  bottomOfDeck: z.string(),
});

export type SpreadData = z.infer<typeof spreadSchema>;

/**
 * Normalize a card name by fuzzy matching against known cards.
 * Returns the canonical card name or null if not found.
 */
export function normalizeCardName(rawName: string): string | null {
  const cleaned = rawName.trim().toLowerCase();

  // Exact match first
  if (cardAliases[cleaned]) {
    return cardAliases[cleaned];
  }

  // Try removing "(R)" or "reversed" suffix
  const withoutReversal = cleaned
    .replace(/\(r\)/, '')
    .replace(/reversed/, '')
    .trim();

  if (cardAliases[withoutReversal]) {
    return cardAliases[withoutReversal];
  }

  // Fuzzy: find best match by word overlap
  const words = cleaned.split(/\s+/);
  let bestMatch: [string, number] | null = null;

  Object.entries(cardAliases).forEach(([key, canonical]) => {
    const keyWords = key.split(/\s+/);
    const overlap = words.filter((w) => keyWords.includes(w)).length;
    if (overlap > 0) {
      if (!bestMatch || overlap > bestMatch[1]) {
        bestMatch = [canonical, overlap];
      }
    }
  });

  return bestMatch ? bestMatch[0] : null;
}

/**
 * Check if a card name is reversed (contains "(R)", "reversed", etc.)
 */
export function isReversed(rawName: string): boolean {
  return /\(r\)|reversed/i.test(rawName);
}

/**
 * Parse spread JSON from raw transcribed text or user input.
 * Returns parsed spread data or error details.
 */
export function parseSpreadFromText(rawText: string): {
  success: boolean;
  data?: SpreadData;
  errors?: string[];
  needsReview?: boolean;
} {
  const lines = rawText.split('\n').filter((l) => l.trim());

  // Very basic: expect lines like "Card 1: The Magician" or just "The Magician"
  // This is a placeholder; a real impl would use more sophisticated parsing
  const allCardNames: string[] = [];

  lines.forEach((line) => {
    // Remove numbering, colons, etc.
    const cleaned = line.replace(/^.*?:\s*/, '').trim();
    const normalized = normalizeCardName(cleaned);
    if (normalized) {
      allCardNames.push(normalized);
    }
  });

  if (allCardNames.length < 13) {
    return {
      success: false,
      errors: [`Expected 13 cards (12 spread + bottom), found ${allCardNames.length}`],
      needsReview: true,
    };
  }

  try {
    const data: SpreadData = {
      currentSituation: allCardNames.slice(0, 3) as [string, string, string],
      currentFeelings: allCardNames.slice(3, 6) as [string, string, string],
      messageFromSpirit: allCardNames.slice(6, 9) as [string, string, string],
      overallOutcome: allCardNames.slice(9, 12) as [string, string, string],
      bottomOfDeck: allCardNames[12],
    };

    spreadSchema.parse(data);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      errors: [err instanceof Error ? err.message : 'Unknown parsing error'],
      needsReview: true,
    };
  }
}

/**
 * Validate spread manually by user confirmation UI.
 */
export function validateSpreadManually(userConfirmed: SpreadData): {
  valid: boolean;
  errors?: string[];
} {
  try {
    spreadSchema.parse(userConfirmed);
    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      errors: [err instanceof Error ? err.message : 'Validation error'],
    };
  }
}
