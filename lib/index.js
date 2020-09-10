import fs from "fs";
import png from "pngjs";
import pixelmatch from "pixelmatch";

import ImageSnapshot from "./image-snapshot.js";

const { PNG } = png;

function compareImages(found, expected) {
  const img1 = PNG.sync.read(expected);
  const img2 = PNG.sync.read(found);
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const pixelsDifferent = pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 0.1,
  });

  return pixelsDifferent
}

export default function installImageSnapshot(t) {
  t.Test.prototype.addAssert("matchImageSnapshot", 2, function (
    foundImage,
    snapshotName,
    message,
    extra
  ) {
    message = message || "should match the image snapshot.";
    const fullSnapshotName = this.fullname + "__" + snapshotName;
    const snapshot = new ImageSnapshot(fullSnapshotName);
    if (this.writeSnapshot) {
      return this.notOk(snapshot.snap(foundImage), message, extra);
    }
    const pixelsDifferent = compareImages(foundImage, snapshot.read())
    if (pixelsDifferent === 0) {
      return t.pass(message)
    }
    return t.fail(`${message} Got ${pixelsDifferent} different pixels`)
  });
}
