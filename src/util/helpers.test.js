import {
  getInitials,
  getSubdomainFromUserUrl,
  generateRandomInteger,
  getTextWidth,
} from './helpers';

describe('getInitials', () => {
  it('Given a singular name (1 word), it will return 1 initial', () => {
    const fullName = 'Bob';
    const initials = getInitials(fullName);
    expect(initials).toEqual('B');
  });
  it('Given a full name (2 words), it will return 2 initials', () => {
    const fullName = 'Bob Smith';
    const initials = getInitials(fullName);
    expect(initials).toEqual('BS');
  });
  it('Given a full name (3 words), it will return 2 initials', () => {
    const fullName = 'Bob Dave Smith';
    const initials = getInitials(fullName);
    expect(initials).toEqual('BS');
  });
});

describe('getSubdomainFromUserUrl', () => {
  it('Given a valid user html string (US domain), it will return the subdomain ', () => {
    const htmlURL = 'https://acme-dev.pagerduty.com/users/PABCXYZ';
    const subdomain = getSubdomainFromUserUrl(htmlURL);
    expect(subdomain).toEqual('acme-dev');
  });
  it('Given a valid user html string (EU domain), it will return the subdomain ', () => {
    const htmlURL = 'https://acme-dev.eu.pagerduty.com/users/PABCXYZ';
    const subdomain = getSubdomainFromUserUrl(htmlURL);
    expect(subdomain).toEqual('acme-dev');
  });
});

describe('generateRandomInteger', () => {
  it('Given two valid numbers, it will generate a random integer between both', () => {
    const min = 0;
    const max = 100;
    const randomInteger = generateRandomInteger(min, max);
    expect(randomInteger).toBeGreaterThanOrEqual(min);
    expect(randomInteger).toBeLessThanOrEqual(max);
  });
  it('Given two identical numbers, it will return the same number', () => {
    const integer = 20;
    const expectedInteger = generateRandomInteger(integer, integer);
    expect(expectedInteger).toEqual(integer);
  });
});

describe('getTextWidth', () => {
  it('Given text and font type, it will return a valid text width', () => {
    const text = 'This is a test string';
    const font = '12pt sans-serif bold';
    const expectedTextWidth = 21;
    const calculatedTextWidth = getTextWidth(text, font);
    expect(expectedTextWidth).toEqual(calculatedTextWidth);
  });
});
