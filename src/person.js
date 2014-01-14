var teamtime = (function(tm) {
  "use strict";

  var Person = function Person(config) {
    var con = (Object.prototype.toString.call(config) === "[object Object]") ? config : { 'name': config};
    this.name = con.name;
    this.id  = con.id || this.name.replace(/[^a-zA-Z0-9]+/g,'').toLowerCase();
    this.projects = new tm.Map();
    if (con.projects) {
      this.projects_array = con.projects;
    }
  };

  Person.prototype.loadProjects = function loadProjects() {
    var project;
    for (var i = 0; i < this.projects_array.length; i++) {
        project = tm.app.projects.get(this.projects_array[i]);
        this.assignProject(project);
    }
  };

  Person.prototype.getProjects = function getProjects() {
    return this.projects;
  };

  Person.prototype.assignProject = function assignProject(project) {
    this.projects.put(project.name, project);
    project.getTeam().put(this.name, this);
    if (tm.app) tm.app.persist();
  };

  Person.prototype.unassignProject = function unassignProject(project) {
    this.projects.remove(project.name);
    project.getTeam().remove(this.name);
    if (tm.app) tm.app.persist();
  };

  Person.prototype.storageObject = function storageObject() {
    var result = {
      'name': this.name,
      'id': this.id,
      'projects': []
    };

    this.projects.each(function(person) {
      result.projects.push(person.id);
    });

    return result;
  };

  tm.Person = Person;

  return tm;

})(teamtime || {});