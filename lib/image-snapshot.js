import fs from "fs";
import mkdirp from "mkdirp";
import path from "path";
import writeFile from "write-file-atomic";
const cwd = process.cwd();

function save(filepath, data) {
  mkdirp.sync(path.dirname(filepath));
  writeFile.sync(filepath, data);
}

export default class ImageSnapshot {
  constructor(name) {
    const basefile = path.resolve(
      cwd,
      "tap-snapshots",
      name.trim().replace(/[^a-zA-Z0-9\._\-]+/g, "-")
    );
    this.file = basefile + ".test.png";
    this.diffFile = basefile + ".diff.png";
  }

  read() {
    try {
      return fs.readFileSync(this.file);
    } catch (er) {
      throw new Error(
        "Snapshot file not found: " +
          this.file +
          "\n" +
          "Run with TAP_SNAPSHOT=1 in the environment\n" +
          "to create snapshot files"
      );
    }
  }

  snap(data) {
    save(this.file, data);
  }

  snapDiff(data) {
    save(this.diffFile, data);
  }
}
