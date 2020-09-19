import ImageSnapshot from "./image-snapshot.js";
import compareImages from "./compare-image.js";

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
    const { difference, failureMessage } = compareImages(
      foundImage,
      snapshot.read()
    );
    if (difference) {
      return t.fail(`${message} ${failureMessage}`);
    }
    return t.pass(message);
  });
}
