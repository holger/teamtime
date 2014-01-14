var teamtime = (function (tm) {
  "use strict";

  var Map = function Map() {
    this.entries = {};
  };

  Map.prototype.put = function put(key, value) {
    this.entries[key] = value;
  };

  Map.prototype.get = function get(key) {
    return this.entries[key];
  };

  Map.prototype.remove = function remove(key) {
    delete this.entries[key];
  };

  Map.prototype.each = function each(callback) {
    var key;
    for (key in this.entries) {
      if (this.entries.hasOwnProperty(key)) {
        callback.call(this.entries[key], this.entries[key]);
      }
    }
  };

  Map.prototype.size = function size() {
    var count = 0;
    this.each(function () { count++; });
    return count;
  };

  Map.prototype.toArray = function toArray() {
    var result = [];
    this.each(function (entry) { result.push(entry); });
    return result;
  };

  tm.Map = Map;

  return tm;

}(teamtime || {}));