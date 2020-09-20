import tap from "tap";
import fs from "fs";
import child_process from "child_process";
import installImageSnapshot from "../lib/index.js";

installImageSnapshot(tap);

tap.test("images are the same", (t) => {
  t.matchImageSnapshot(fs.readFileSync("test/fixtures/1a.png"), "1a.png");
  t.end();
});

tap.test("images are different", (t) => {
  try {
    child_process.execSync("node test/failing-test.js", {
      env: { TAP_SNAPSHOT: "0" },
    });
  } catch (e) {
    const output = e.output.toString();
    t.contains(
      output,
      "should match the image snapshot. Images do not match 106 pixels are different"
    );
  }
  t.end();
});
