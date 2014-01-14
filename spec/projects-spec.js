describe("Projects", function () {

  var projects;

  beforeEach(function () {
    localStorage.removeItem('projects');
    projects = new teamtime.Projects();
  });

  it("is made up of projects", function () {
    projects.put("d", new teamtime.Project("d"));
    projects.put("e", new teamtime.Project("e"));
    projects.put("f", new teamtime.Project("f"));

    expect(projects.size()).toEqual(3);
    expect(projects.get("d")).toBeDefined();
    expect(projects.get("e")).toBeDefined();
    expect(projects.get("f")).toBeDefined();
    expect(projects.get("a")).not.toBeDefined();
  });

  it("should unassign projects from their teammembers, when a project get removed", function () {
    var team = new teamtime.Team();

    team.put("a", new teamtime.Person("a"));
    team.put("b", new teamtime.Person("b"));
    team.put("c", new teamtime.Person("c"));

    projects.put("d", new teamtime.Project("d"));
    projects.put("e", new teamtime.Project("e"));
    projects.put("f", new teamtime.Project("f"));

    team.get('a').assignProject(projects.get('d'));
    team.get('a').assignProject(projects.get('e'));
    team.get('a').assignProject(projects.get('f'));

    team.get('b').assignProject(projects.get('e'));
    team.get('b').assignProject(projects.get('f'));

    team.get('c').assignProject(projects.get('d'));
    team.get('c').assignProject(projects.get('f'));

    projects.remove("e");

    expect(team.get("a").getProjects().size()).toEqual(2);
    expect(team.get("a").getProjects().get("d")).toBeDefined();
    expect(team.get("a").getProjects().get("f")).toBeDefined();

    expect(team.get("b").getProjects().size()).toEqual(1);
    expect(team.get("a").getProjects().get("f")).toBeDefined();

    expect(team.get("c").getProjects().size()).toEqual(2);
    expect(team.get("a").getProjects().get("d")).toBeDefined();
    expect(team.get("a").getProjects().get("f")).toBeDefined();
  });

  it("can be converted to an array", function () {
    projects.put("d", new teamtime.Project("d"));
    projects.put("e", new teamtime.Project("e"));
    projects.put("f", new teamtime.Project("f"));

    expect(projects.size()).toEqual(3);
    expect(projects.toArray().length).toEqual(3);
  });

});