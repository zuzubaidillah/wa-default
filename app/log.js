'use strict';

import pino from 'pino';
import { log as pinoConfig } from './config.js';

export const log = pino(pinoConfig);
