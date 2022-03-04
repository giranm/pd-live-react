import {
  getInitials, getSubdomainFromUserUrl,
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
