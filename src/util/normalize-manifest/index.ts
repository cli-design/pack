

import {Manifest} from '../../types.js';
import Config from '../../config.js';
import validate from './validate.js';
import fix from './fix.js';

import * as path from 'path';

export default (async function(info: any, moduleLoc: string, config: Config, isRoot: boolean): Promise<Manifest> {
  // Append dependencies
  // if (depInfo) {
  //   info.dependencies = depInfo.main;
  //   info.devDependencies = depInfo.dev;
  // }
  // create human readable name
  const {name, version} = info;
  let human: string | undefined;
  if (typeof name === 'string') {
    human = name;
  }
  if (human && typeof version === 'string' && version) {
    human += `@${version}`;
  }
  if (isRoot && info._loc) {
    human = path.relative(config.cwd, info._loc);
  }

  function warn(msg: string) {
    if (human) {
      msg = `${human}: ${msg}`;
    }
    config.reporter.warn(msg);
  }

  await fix(info, moduleLoc, config.reporter, warn);

  try {
    validate(info, isRoot, config.reporter, warn);
  } catch (err) {
    if (human) {
      err.message = `${human}: ${err.message}`;
    }
    throw err;
  }

  return info;
});
