import { sum } from "./index";

describe("Index Page", () => {
  it("test", () => {
    expect(sum(1, 2)).toBe(4);
  });
});
