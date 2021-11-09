import * as tf from '@tensorflow/tfjs';

/**
 * 风格化
 */
export class Stylization {
  loading:boolean;
  styleNet:tf.GraphModel|undefined;
  transformNet:tf.GraphModel|undefined;
  mobileStyleNet:tf.GraphModel|undefined;
  inceptionStyleNet:tf.GraphModel|undefined;
  originalTransformNet:tf.GraphModel|undefined;
  separableTransformNet:tf.GraphModel|undefined;
  msg:string;
  styleRatio:number;
  constructor() {
    this.loading = false;
    this.styleRatio = 0.5;
    this.msg = 'start';
  }
  /**
   * 读取模型
   */
  load() {
    this.loading = true;
    Promise.all([
      this.loadMobileNetStyleModel(),
      this.loadSeparableTransformerModel(),
    ]).then(([styleNet, transformNet]) => {
      this.styleNet = styleNet;
      this.transformNet = transformNet;
      this.loading = false;
    });
  }
  async loadMobileNetStyleModel() {
    if (!this.mobileStyleNet) {
      this.mobileStyleNet = await tf.loadGraphModel(
        'saved_model_style_js/model.json');
    }
    return this.mobileStyleNet;
  }
  async loadInceptionStyleModel() {
    if (!this.inceptionStyleNet) {
      this.inceptionStyleNet = await tf.loadGraphModel(
        'saved_model_style_inception_js/model.json');
    }
    return this.inceptionStyleNet;
  }
  async loadOriginalTransformerModel() {
    if (!this.originalTransformNet) {
      this.originalTransformNet = await tf.loadGraphModel(
        'saved_model_transformer_js/model.json'
      );
    }
    return this.originalTransformNet;
  }
  async loadSeparableTransformerModel() {
    if (!this.separableTransformNet) {
      this.separableTransformNet = await tf.loadGraphModel(
        'saved_model_transformer_separable_js/model.json'
      );
    }
    return this.separableTransformNet;
  }
  /**
   * 风格化
   * @param styleImg 
   * @param contentImg 
   * @param stylizedImg 
   * @param ratio 
   */
  async stylize(styleImg:HTMLImageElement, contentImg:HTMLImageElement, stylizedImg:HTMLCanvasElement, ratio:number) {
    this.loading = true;
    await tf.nextFrame();
    this.msg = 'Generating 100D style representation';
    await tf.nextFrame();
    let bottleneck:tf.Tensor<tf.Rank>|tf.Tensor<tf.Rank>[]|tf.NamedTensorMap = await tf.tidy(() => {
      return this.styleNet.predict(tf.browser.fromPixels(styleImg).toFloat().div(tf.scalar(255)).expandDims());
    });
    this.msg = 'Generating 100D identity style representation';
    await tf.nextFrame();
    const identityBottleneck:tf.Tensor<tf.Rank>|tf.Tensor<tf.Rank>[]|tf.NamedTensorMap = await tf.tidy(() => {
      return this.styleNet.predict(tf.browser.fromPixels(contentImg).toFloat().div(tf.scalar(255)).expandDims());
    })
    const styleBottleneck = bottleneck;
    bottleneck = await tf.tidy(() => {
      const styleBottleneckScaled = styleBottleneck.mul(tf.scalar(ratio));
      const identityBottleneckScaled = identityBottleneck.mul(tf.scalar(1.0-ratio));
      return styleBottleneckScaled.addStrict(identityBottleneckScaled)
    })
    styleBottleneck.dispose();
    identityBottleneck.dispose();

    this.msg = 'Stylizing image...';
    await tf.nextFrame();
    const stylized = await tf.tidy(() => {
      return this.transformNet.predict([tf.browser.fromPixels(contentImg).toFloat().div(tf.scalar(255)).expandDims(), bottleneck]).squeeze();
    })
    await tf.browser.toPixels(stylized, stylizedImg);
    bottleneck.dispose();  // Might wanna keep this around
    stylized.dispose();
    this.loading = false;
    return stylized;
  }
}