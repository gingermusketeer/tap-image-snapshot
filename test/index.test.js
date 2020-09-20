import tap from "tap";
import fs from "fs";
import vm from "vm";
import installImageSnapshot from "../lib/index.js";

installImageSnapshot(tap);

tap.test("images are the same", (t) => {
  t.matchImageSnapshot(fs.readFileSync("test/fixtures/1a.png"), "1a.png");
  t.end();
});

tap.test("images are different", { todo: true }, (t) => {
  const code = `
    import tap from "tap";
    import installImageSnapshot from "../lib/index.js;

    installImageSnapshot(tap);
    tap.test("images are different (VM)", (t) => {
      t.matchImageSnapshot(fs.readFileSync("test/fixtures/1a.png"), "1a.png");
      t.end();
    });
  `;
  const script = new vm.Script(code);
  script.runInContext({});
  t.end();
});
