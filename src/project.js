var teamtime = (function (tm) {
  "use strict";

  var Project = function Project(config) {
    var con = (Object.prototype.toString.call(config) === "[object Object]") ? config : { 'name': config};
    this.name = con.name;
    this.id  = con.id || this.name.replace(/[^a-zA-Z0-9]+/g,'');
    this.team = new tm.Map();
    if (con.team) {
      this.team_array = con.team;
    }
  };

  Project.prototype.loadTeam = function loadTeam() {
    var person;
    for (var i = 0; i < this.team_array.length; i++) {
        person = tm.app.team.get(this.team_array[i]);
        this.assignPerson(person);
    }
  };

  Project.prototype.getTeam = function getTeam() {
    return this.team;
  };

  Project.prototype.assignPerson = function assignPerson(person) {
    this.team.put(person.name, person);
    person.getProjects().put(this.name, this);
    if (tm.app) tm.app.persist();
  };

  Project.prototype.unassignPerson = function unassignPerson(person) {
    this.team.remove(person.name);
    person.getProjects().remove(this.name);
    if (tm.app) tm.app.persist();
  };

  Project.prototype.storageObject = function storageObject() {
    var result = {
      'name': this.name,
      'id': this.id,
      'team': []
    };

    this.team.each(function(person) {
      result.team.push(person.id);
    });

    return result;
  };

  tm.Project = Project;

  return tm;

}(teamtime || {}));