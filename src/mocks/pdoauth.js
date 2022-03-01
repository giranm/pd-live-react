// Stub for methods used in PD OAuth
import {
  TextEncoder, TextDecoder,
} from 'util';

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (arr) => jest.fn().mockReturnValueOnce(new Uint32Array(10)),
  },
});

Object.defineProperty(crypto, 'subtle', {
  value: {
    digest: (hash, verifier) => '#',
  },
});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
