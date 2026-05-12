import { describe, it, expect } from 'vitest';
import { parsedDate, sanity, capitalizeFirstLetter } from '../utils/utils';

describe('Utility Functions', () => {
  describe('parsedDate', () => {
    it('should parse date string correctly', () => {
      const result = parsedDate('15-01-2024');
      const expected = new Date('2024-01-15').getTime();
      expect(result).toBe(expected);
    });

    it('should handle different date formats', () => {
      const result = parsedDate('01-12-2023');
      const expected = new Date('2023-12-01').getTime();
      expect(result).toBe(expected);
    });

    it('should return a valid timestamp', () => {
      const result = parsedDate('15-06-2024');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('sanity', () => {
    it('should convert string to lowercase and trim', () => {
      expect(sanity('GROCERIES')).toBe('groceries');
      expect(sanity('  Gas  ')).toBe('gas');
      expect(sanity('  UTILITIES  ')).toBe('utilities');
    });

    it('should handle empty strings', () => {
      expect(sanity('')).toBe('');
    });

    it('should trim whitespace and lowercase mixed case', () => {
      expect(sanity('  GrOcErIeS  ')).toBe('groceries');
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirstLetter('groceries')).toBe('Groceries');
      expect(capitalizeFirstLetter('gas')).toBe('Gas');
    });

    it('should handle already capitalized words', () => {
      expect(capitalizeFirstLetter('Utilities')).toBe('Utilities');
    });

    it('should return empty string as is', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalizeFirstLetter('a')).toBe('A');
    });

    it('should handle mixed case strings', () => {
      expect(capitalizeFirstLetter('gROCERIES')).toBe('GROCERIES');
    });
  });
});
