describe("A person", function () {

  var person;

  beforeEach(function () {
    person = new teamtime.Person("a");
  });

  it("can have projects assigned", function () {
    expect(person.getProjects().size()).toEqual(0);

    person.assignProject(new teamtime.Project("d"));
    person.assignProject(new teamtime.Project("e"));
    person.assignProject(new teamtime.Project("f"));

    expect(person.getProjects().size()).toEqual(3);
  });

  it("is added to the projects team when a project gets assigned", function () {
    var project = new teamtime.Project("d");
    person.assignProject(project);

    expect(project.getTeam().get(person.name)).toBeDefined();
  });


  it("is removed from the projects team when a project gets unassigned", function () {
    var project = new teamtime.Project("d");
    person.assignProject(project);
    person.unassignProject(project);

    expect(project.getTeam().get(person.name)).not.toBeDefined();
  });

  describe("uses its name to generate a valid html id", function () {

    it("spaces get stripped", function () {
      person = new teamtime.Person("a b");
      expect(person.id).toEqual("ab");
    });

    it("characters except a-z, A-Z and 0-9 get stripped", function () {
      person = new teamtime.Person("abcdefghijklmnopqrstuvwxyz0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ öäüß@!§$%&/()=<>,;.:-_#'");
      expect(person.id).toEqual("abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz");
    });

    it("valid characters are converted to lowercase", function () {
      person = new teamtime.Person("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
      expect(person.id).toEqual("abcdefghijklmnopqrstuvwxyz");
    });
      
  });

});