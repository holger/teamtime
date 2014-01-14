var app = (function($, Handlebars, tm) {
  "use strict";

  var tpl_teammember = Handlebars.compile($('#tpl-teammember').html());
  var tpl_teammember_projects = Handlebars.compile($('#tpl-teammember-projects').html());
  var tpl_projects_selector = Handlebars.compile($('#tpl-projects-selector').html());
  var tpl_project = Handlebars.compile($('#tpl-project').html());
  var tpl_project_team = Handlebars.compile($('#tpl-project-team').html());
  var tpl_project_team_selector = Handlebars.compile($('#tpl-project-team-selector').html());

  Handlebars.registerPartial('tpl-teammember', tpl_teammember);
  Handlebars.registerPartial('tpl-teammember-projects', tpl_teammember_projects);
  Handlebars.registerPartial('tpl-projects-selector', tpl_projects_selector);
  Handlebars.registerPartial('tpl-project', tpl_project);
  Handlebars.registerPartial('tpl-project-team', tpl_project_team);
  Handlebars.registerPartial('tpl-project-team-selector', tpl_project_team_selector);

  var team = new tm.Team();
  var projects = new tm.Projects();

  var init = function init() {
    team.each(function(person) {
      person.loadProjects();
      addPerson(person);
    });

    projects.each(function(project) {
      project.loadTeam();
      addProject(project);
    });
  };

  var persist = function persist() {
    team.store();
    projects.store();
  };

  $('#team form button').click(function() {
    var name = $('#team form input').val(),
      person = new tm.Person(name);

    team.put(person.id, person);
    addPerson(person);
    $('#team form input').val('');
    return false;
  });

  var addPerson = function addPerson(person) {
    $('#team .team').append(tpl_teammember({
      'person': person,
      'person_projects': person.getProjects().toArray(),
      'projects': $(projects.toArray()).not(person.getProjects().toArray()).get()
    }));

    $('#team #person-' + person.id).click(function() {
      openPersonModal(person);
    });

    $('#team .remove-person').off('click', removePersonListener).on('click', removePersonListener);
    $('#team .select-project').off('change', assignProjectListener).on('change', assignProjectListener);
  };

  var removePersonListener = function removePersonListener() {
    var person_id = $(this).attr('href').substr(1);
    team.remove(person_id);
    $('#person-' + person_id).remove();
    updateProjects();
    return false;
  };

  var updateTeam = function updateTeam() {
    $('#team .team li').remove();
    team.each(function (person) { addPerson(person); });
  };

  var assignProjectListener = function assignProjectListener() {
    var person_id = $(this).data('teammember'),
      person = team.get(person_id),
      project_id = $(this).val(),
      project = projects.get(project_id);

    person.assignProject(project);
    updatePersonProjects(person_id);
    updateProjectTeam(project_id);
  };

  var addTeammemberListener = function addTeammemberListener() {
    var project_id = $(this).data('project'),
      project = projects.get(project_id),
      person_id = $(this).val(),
      person = team.get(person_id);

    project.assignPerson(person);
    updatePersonProjects(person_id);
    updateProjectTeam(project_id);
  };

  var updatePersonProjects = function updatePersonProjects(person_id) {
    var person = team.get(person_id);

    $("#person-" + person.id + " .projects").replaceWith(
      tpl_teammember_projects({ 'person_projects': person.getProjects().toArray() })
    );

    $("#person-modal[data-person='" + person.id + "'] .projects").replaceWith(tpl_teammember_projects(
      { 'person_projects': person.getProjects().toArray() }
    ));

    $("#person-modal[data-person='" + person.id + "'] .select-project").replaceWith(tpl_projects_selector({ 
      'person': person,
      'projects': $(projects.toArray()).not(person.getProjects().toArray()).get()
    }));

    $('#person-modal .select-project').unbind('change', assignProjectListener);
    $('#person-modal .select-project').change(assignProjectListener);
  };


  $('#projects form button').click(function() {
    var name = $('#projects form input').val(),
      project = new tm.Project(name);

    projects.put(project.id, project);
    addProject(project);
    $('#projects form input').val('');
    return false;
  });

  var openProjectModal = function openProjectModal(project) {
    $('#project-modal').attr('data-project', project.id);

    $('#project-modal .modal-title').html(project.name);

    $('#project-modal .modal-body .team').replaceWith(tpl_project_team({
      'project_team': project.getTeam().toArray()
    }));

    $('#project-modal .select-project-team').replaceWith(tpl_project_team_selector({
      'project': project,
      'available_team': $(team.toArray()).not(project.getTeam().toArray()).get()
    }));

    $('#project-modal .select-project-team').unbind('change', addTeammemberListener);
    $('#project-modal .select-project-team').change(addTeammemberListener);

    $('#project-modal').modal();
  };

  var openPersonModal = function openPersonModal(person) {
    $('#person-modal').attr('data-person', person.id);

    $('#person-modal .modal-title').html(person.name);

    $('#person-modal .modal-body .projects').replaceWith(tpl_teammember_projects({
      'person_projects': person.getProjects().toArray()
    }));

    $('#person-modal .select-project').replaceWith(tpl_projects_selector({ 
      'person': person,
      'projects': $(projects.toArray()).not(person.getProjects().toArray()).get()
    }));

    $('#person-modal .select-project').unbind('change', assignProjectListener);
    $('#person-modal .select-project').change(assignProjectListener);

    $('#person-modal').modal();
  };

  var addProject = function addProject(project) {
    $('#projects .projects').append(tpl_project({
      'project': project,
      'project_team': project.getTeam().toArray()
    }));

    $('#projects #project-' + project.id).click(function() {
      openProjectModal(project);
    });

    $('#projects .remove-project')
      .off('click', removeProjectListener)
      .on('click', removeProjectListener);
  };

  var removeProjectListener = function removeProjectListener() {
    var project_id = $(this).attr('href').substr(1);
    projects.remove(project_id);
    $('#project-' + project_id).remove();
    updateTeam();
    return false;
  };

  var updateProjects = function updateProjects() {
    $('#projects .projects li').remove();
    projects.each(function (project) { addProject(project); });
  };

  var updateProjectTeam = function updateProjectTeam(project_id) {
    var project = projects.get(project_id);

    $("#project-" + project.id + " .team").replaceWith(tpl_project_team(
      { 'project_team': project.getTeam().toArray() }
    ));

    $("#project-modal[data-project='" + project.id + "'] .team").replaceWith(tpl_project_team(
      { 'project_team': project.getTeam().toArray() }
    ));

    $("#project-modal[data-project='" + project.id + "'] .select-project-team").replaceWith(tpl_project_team_selector({
      'project': project,
      'available_team': $(team.toArray()).not(project.getTeam().toArray()).get()
    }));

    $('#project-modal .select-project-team').unbind('change', addTeammemberListener);
    $('#project-modal .select-project-team').change(addTeammemberListener);
  };

  app = {};
  app.team = team;
  app.projects = projects;
  app.persist = persist;
  tm.app = app;

  init();

  return app;

})(window.jQuery, Handlebars, teamtime);