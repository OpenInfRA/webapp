angular.module('oi.util').service('oiUtilProgress', function () {
  'use strict';

  var Progress = function(notify, ticks) {
    this.fn = notify;

    this.ticks  = parseInt(ticks, 10) || 1;
    this.ticked = 0;
  };

  var proto = Progress.prototype;

  var _progress = function(ticked, ticks) {
    if (ticked >= ticks) { return 1; }
    return (ticked / ticks);
  };

  proto.progress = function() { return _progress(this.ticked, this.ticks); };

  proto.tick = function() {
    var old = this.progress();

    this.ticked++;
    this.fn(this.progress(), old);
  };
 
  proto.ticks = function(ticks) {
    ticks = parseInt(ticks, 10);
    if (ticks <= this.ticks) { return; }

    var old = this.progress();

    this.ticks = ticks;
    this.fn(this.progress(), old);
  };

  proto.create = function(ticks) {
    var that = this;

    return new Progress(function(tnew, told) {
      var old = that.progress();

      if (told) { tnew -= told; }
      that.ticked += tnew;

      that.fn(that.progress(), old);       
    }, ticks);
  };


  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  this.create = function(args) {
    if (!angular.isObject(args)) { return; }

    var fn = args.notify;
    if (typeof(fn) !== 'function') { return; }

    return new Progress(fn, args.ticks);
  };
});
