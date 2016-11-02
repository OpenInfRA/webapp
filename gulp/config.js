var cfg    = {};
var config;

try {
  config = require('../OpenInfRA.json');

} catch(e) {
  config = {};
}

var cfgApp = config.app     || {};
    cfgEnd = cfgApp.backend || {};

var RAPP = '.app',
    RTPL = RAPP + '/tpl';

var DIST = 'dist',
    DAPP = DIST + '/' + RAPP,
    DTPL = DIST + '/' + RTPL,

    BASE = cfgApp.url || '/';
    CORE = cfgEnd.url || '';

cfg.RAPP = RAPP;
cfg.RTPL = RTPL;

cfg.DIST = DIST;
cfg.DAPP = DAPP;
cfg.DTPL = DTPL;

cfg.BASE = BASE;
cfg.CORE = CORE;

cfg.config = config;

module.exports = cfg;
