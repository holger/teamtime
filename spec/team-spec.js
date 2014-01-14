describe("A team", function () {

  var team;

  beforeEach(function () {
    localStorage.removeItem('team');
    team = new teamtime.Team();
  });

  it("is made up of people", function () {
    team.put("a", new teamtime.Person("a"));
    team.put("b", new teamtime.Person("b"));
    team.put("c", new teamtime.Person("c"));

    expect(team.size()).toEqual(3);
    expect(team.get("a")).toBeDefined();
    expect(team.get("b")).toBeDefined();
    expect(team.get("c")).toBeDefined();
    expect(team.get("d")).not.toBeDefined();
  });

  it("should unassign people from their projects, when a person get removed", function () {
    var projects = new teamtime.Projects();

    team.put("a", new teamtime.Person("a"));
    team.put("b", new teamtime.Person("b"));
    team.put("c", new teamtime.Person("c"));

    projects.put("d", new teamtime.Project("d"));
    projects.put("e", new teamtime.Project("e"));
    projects.put("f", new teamtime.Project("f"));


    projects.get('d').assignPerson(team.get('a'));
    projects.get('d').assignPerson(team.get('c'));

    projects.get('e').assignPerson(team.get('a'));
    projects.get('e').assignPerson(team.get('b'));

    projects.get('f').assignPerson(team.get('a'));
    projects.get('f').assignPerson(team.get('b'));
    projects.get('f').assignPerson(team.get('c'));

    team.remove("a");

    expect(team.get("a")).not.toBeDefined();

    expect(projects.get("d").getTeam().size()).toEqual(1);
    expect(projects.get("d").getTeam().get("c")).toBeDefined();

    expect(projects.get("e").getTeam().size()).toEqual(1);
    expect(projects.get("e").getTeam().get("b")).toBeDefined();

    expect(projects.get("f").getTeam().size()).toEqual(2);
    expect(projects.get("f").getTeam().get("b")).toBeDefined();
    expect(projects.get("f").getTeam().get("c")).toBeDefined();
  });

  it("can be converted to an array", function () {
    team.put("a", new teamtime.Person("a"));
    team.put("b", new teamtime.Person("b"));
    team.put("c", new teamtime.Person("c"));

    expect(team.size()).toEqual(3);
    expect(team.toArray().length).toEqual(3);
  });

});