import png from "pngjs";
import pixelmatch from "pixelmatch";

const { PNG } = png;

class ComparisionResult {
  constructor(matches, failureMessage, imageDiffData) {
    this.matches = matches;
    this.failureMessage = failureMessage;
    this.imageDiffData = imageDiffData;
  }
}

function compareSizes(img1, img2) {
  const { width: width1, height: height1 } = img1;
  const { width: width2, height: height2 } = img2;
  return new ComparisionResult(
    width1 === width2 && height1 === height2,
    `Images have different sizes: ${width1}x${height1} vs ${width2}x${height2}.`
  );
}

function extractAndSum(items, property) {
  return items
    .map(({ [property]: value }) => value)
    .reduce((total, num) => total + num, 0);
}

function generate3wayImageDiff(png1, pngDiff, png2) {
  const images = [png1, pngDiff, png2];
  const threeWayDiffImg = new PNG({
    width: extractAndSum(images, "width"),
    height: png1.height,
  });

  let xOffset = 0;
  images.forEach((image) => {
    PNG.bitblt(
      image,
      threeWayDiffImg,
      0,
      0,
      image.width,
      image.height,
      xOffset,
      0
    );
    xOffset += image.width;
  });

  // Filter type 4 is less expensive.
  return PNG.sync.write(threeWayDiffImg, { filterType: 4 });
}

function comparePixels(img1, img2) {
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const pixelsDifferent = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.1,
    }
  );
  return new ComparisionResult(
    pixelsDifferent === 0,
    `Images do not match ${pixelsDifferent} pixels are different.`,
    generate3wayImageDiff(img1, diff, img2)
  );
}

export default function compareImages(found, expected) {
  const img1 = PNG.sync.read(expected);
  const img2 = PNG.sync.read(found);
  const sizeResult = compareSizes(img1, img2);
  if (!sizeResult.matches) {
    return sizeResult;
  }

  return comparePixels(img1, img2);
}
