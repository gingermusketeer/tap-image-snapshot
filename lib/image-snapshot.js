import fs from "fs";
import mkdirp from "mkdirp";
import path from "path";
import rimraf from "rimraf";
import writeFile from "write-file-atomic";
const cwd = process.cwd();

export default class ImageSnapshot {
  constructor(name) {
    this.file =
      path.resolve(
        cwd,
        "tap-snapshots",
        name.trim().replace(/[^a-zA-Z0-9\._\-]+/g, "-")
      ) + ".test.png";
    this.snapshot = null;
  }

  // should only ever call _one_ of read/save
  read() {
    try {
      this.snapshot = this.snapshot || fs.readFileSync(this.file);
    } catch (er) {
      throw new Error(
        "Snapshot file not found: " +
          this.file +
          "\n" +
          "Run with TAP_SNAPSHOT=1 in the environment\n" +
          "to create snapshot files"
      );
    }

    return this.snapshot;
  }

  snap(data) {
    this.save(data);
  }

  save(data) {
    mkdirp.sync(path.dirname(this.file));
    writeFile.sync(this.file, data);
  }
}
