import tildify from 'tildify';
import { magenta } from 'picocolors';
import { basename } from 'path';
import Hexo from '../../hexo';
import type Promise from 'bluebird';

const reservedKeys = {
  _: true,
  title: true,
  layout: true,
  slug: true,
  s: true,
  path: true,
  p: true,
  replace: true,
  r: true,
  // Global options
  config: true,
  debug: true,
  safe: true,
  silent: true
};

interface NewArgs {
  _?: string[]
  p?: string
  path?: string
  s?: string
  slug?: string
  r?: boolean
  replace?: boolean
  [key: string]: any
}

function newConsole(this: Hexo, args: NewArgs): Promise<void> {
  const path = args.p || args.path;
  let title: string;
  if (args._.length) {
    title = args._.pop();
  } else if (path) {
    // Default title
    title = basename(path);
  } else {
    // Display help message if user didn't input any arguments
    return this.call('help', { _: ['new'] });
  }

  const data = {
    title,
    layout: args._.length ? args._[0] : this.config.default_layout,
    slug: args.s || args.slug,
    path
  };

  const keys = Object.keys(args);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    if (!reservedKeys[key]) data[key] = args[key];
  }

  return this.post.create(data, args.r || args.replace).then(post => {
    this.log.info('Created: %s', magenta(tildify(post.path)));
  });
}

export = newConsole;
