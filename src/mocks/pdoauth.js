// Stub for methods used in PD OAuth
import crypto from 'crypto';

import {
  TextEncoder, TextDecoder,
} from 'util';

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
    subtle: {
      digest: (algorithm, data) => new Promise((resolve) => resolve(
        crypto.createHash(algorithm.toLowerCase().replace('-', '')).update(data).digest(),
      )),
    },
  },
});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
