import { BadRequestException } from '@nestjs/common';
import { ParseDatePipe } from './';

describe('ParseDatePipe', () => {
  it('should parse a valid date string', () => {
    const pipe = new ParseDatePipe();
    const result = pipe.transform('2024-06-15');
    expect(result).toBeInstanceOf(Date);
  });

  it('should throw on empty value when not optional', () => {
    const pipe = new ParseDatePipe();
    expect(() => pipe.transform('')).toThrow(BadRequestException);
  });

  it('should return undefined for empty value when optional', () => {
    const pipe = new ParseDatePipe({ optional: true });
    const result = pipe.transform('');
    expect(result).toBeUndefined();
  });

  it('should throw on invalid date string', () => {
    const pipe = new ParseDatePipe();
    expect(() => pipe.transform('not-a-date')).toThrow(BadRequestException);
  });

  it('should create via static method', () => {
    const pipe = ParseDatePipe.create({ optional: true });
    expect(pipe).toBeInstanceOf(ParseDatePipe);
  });

  it('should create without options', () => {
    const pipe = ParseDatePipe.create();
    expect(pipe).toBeInstanceOf(ParseDatePipe);
  });
});
