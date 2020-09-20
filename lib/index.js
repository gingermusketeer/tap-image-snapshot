import ImageSnapshot from "./image-snapshot.js";
import compareImages from "./compare-image.js";

export default function installImageSnapshot(t) {
  t.Test.prototype.addAssert("matchImageSnapshot", 2, function (
    foundImage,
    snapshotName = "",
    message,
    extra
  ) {
    message = message || "should match the image snapshot.";
    let fullSnapshotName = this.fullname;
    if (snapshotName) {
      fullSnapshotName += "__" + snapshotName;
    }
    const snapshot = new ImageSnapshot(fullSnapshotName);
    if (this.writeSnapshot) {
      return this.notOk(snapshot.snap(foundImage), message, extra);
    }
    const { matches, failureMessage, imageDiffData } = compareImages(
      foundImage,
      snapshot.read()
    );
    if (matches) {
      return t.pass(message);
    }
    snapshot.snapDiff(imageDiffData);
    return t.fail(`${message} ${failureMessage}`);
  });
}
