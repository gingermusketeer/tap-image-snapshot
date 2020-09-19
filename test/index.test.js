import tap from "tap";
import fs from "fs";
import installImageSnapshot from "../lib/index.js";

installImageSnapshot(tap);

tap.test("images are the same", (t) => {
  t.matchImageSnapshot(fs.readFileSync("test/fixtures/1a.png"), "1a.png");
  t.end();
});

tap.test("images are different", { todo: true }, (t) => {
  if (t.writeSnapshot) {
    t.matchImageSnapshot(fs.readFileSync("test/fixtures/1b.png"), "1a.png");
  } else {
    t.matchImageSnapshot(fs.readFileSync("test/fixtures/1a.png"), "1a.png");
  }
  t.end();
});
