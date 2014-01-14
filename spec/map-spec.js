describe("A map", function () {

  var map;

  beforeEach(function () {
    map = new teamtime.Map();
  });

  it("holds an entry by a specific key", function () {
    map.put("a", 1);
    expect(map.entries.a).toBeDefined();
    expect(map.entries.a).toEqual(1);
  });

  it("returns entries by their key", function () {
    map.put("a", 1);
    expect(map.get("a")).toBeDefined();
  });

  it("deletes entries by their key", function () {
    map.put("a", 1);
    map.remove("a");
    expect(map.entries.a).toBeUndefined();
  });

});