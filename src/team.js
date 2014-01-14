var teamtime = (function(tm) {
  "use strict";

  var Team = function Team() {
    this.entries = {};
    this.load();
  };
  Team.prototype = new tm.Map();

  Team.prototype.parent_put = Team.prototype.put;
  Team.prototype.put = function put(key, value) {
    this.parent_put(key, value);
    this.store();
  };

  Team.prototype.parent_remove = Team.prototype.remove;
  Team.prototype.remove = function remove(name) {
    var person = this.get(name);

    person.getProjects().each(function (project) {
      project.unassignPerson(person);
    });

    this.parent_remove(name);
    this.store();
  };

  Team.prototype.load = function load() {
    try {
      var person, entries_array = JSON.parse(localStorage.getItem('team') || '[]');
      for (var i = 0; i < entries_array.length; i++) {
          person = new tm.Person(entries_array[i]);
          this.parent_put(person.id, person);
      }
    } catch (e) {
      console.log('team load error: ' + e);
    }
  };

  Team.prototype.store = function store() {
    try {
      var entries_array = [];
      this.each(function(person) {
        entries_array.push(person.storageObject());
      });
      localStorage.setItem('team', JSON.stringify(entries_array));
    } catch (e) {
      console.log('team store error: ' + e);
    }
  };

  tm.Team = Team;

  return tm;

})(teamtime || {});