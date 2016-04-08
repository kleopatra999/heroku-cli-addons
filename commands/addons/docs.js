'use strict';

let cli     = require('heroku-cli-util');
let co      = require('co');
let resolve = require('../../lib/resolve');

function* run (context, heroku) {
  let id = context.args.addon.split(':')[0];
  let addon = yield heroku.get(`/addon-services/${encodeURIComponent(id)}`).catch(() => null);
  if (!addon) addon = (yield resolve.addon(heroku, context.app, id)).addon_service;
  let url = `https://devcenter.heroku.com/articles/${addon.name}`;

  if (context.flags.url) {
    cli.log(url);
  } else {
    cli.log(`Opening ${cli.color.cyan(url)}...`);
    yield cli.open(url);
  }
}

module.exports = {
  topic:       'addons',
  command:     'docs',
  wantsApp:    true,
  needsAuth:   true,
  args:        [{name: 'addon'}],
  flags:       [{name: 'url', description: 'print URL, do not open browser'}],
  run:         cli.command({preauth: true}, co.wrap(run)),
  description: `open an add-on's Dev Center documentation in your browser`
};