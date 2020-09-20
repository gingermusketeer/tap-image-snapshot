import tap from "tap";
import fs from "fs";
import installImageSnapshot from "../lib/index.js";

installImageSnapshot(tap);

tap.test("images are different (VM)", (t) => {
  if (t.writeSnapshot) {
    t.matchImageSnapshot(fs.readFileSync("test/fixtures/1b.png"));
  } else {
    t.matchImageSnapshot(fs.readFileSync("test/fixtures/1a.png"));
  }
  t.end();
});
