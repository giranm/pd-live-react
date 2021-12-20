import { getInitials } from './helpers';

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
