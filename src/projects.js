var teamtime = (function(tm) {
  "use strict";

  var Projects = function Projects() {
    this.entries = {};
    this.load();
  };
  Projects.prototype = new tm.Map();

  Projects.prototype.parent_put = Projects.prototype.put;
  Projects.prototype.put = function put(key, value) {
    this.parent_put(key, value);
    this.store();
  };

  Projects.prototype.parent_remove = Projects.prototype.remove;
  Projects.prototype.remove = function remove(key) {
    var project = this.get(key);

    project.getTeam().each(function (person) {
      person.unassignProject(project);
    });

    this.parent_remove(key);
    this.store();
  };

  Projects.prototype.load = function load() {
    try {
      var project, entries_array = JSON.parse(localStorage.getItem('projects') || '[]');
      for (var i = 0; i < entries_array.length; i++) {
          project = new tm.Project(entries_array[i]);
          this.parent_put(project.id, project);
      }
    } catch (e) {
      console.log('projects load error: ' + e);
    }
  };

  Projects.prototype.store = function store() {
    try {
      var entries_array = [];
      this.each(function(project) {
        entries_array.push(project.storageObject());
      });
      localStorage.setItem('projects', JSON.stringify(entries_array));
    } catch (e) {
      console.log('projects store error: ' + e);
    }
  };

  tm.Projects = Projects;

  return tm;

})(teamtime || {});