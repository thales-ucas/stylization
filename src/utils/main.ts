import { IModelsKey, MODELS, IModelCache } from '@/type';
import * as tf from '@tensorflow/tfjs';

/**
 * 风格化
 */
export class Stylization {
  styleNet:tf.GraphModel|undefined;
  transformNet:tf.GraphModel|undefined;
  modelCache:IModelCache;
  msg:string;
  styleRatio:number;
  constructor() {
    this.modelCache = {};
    this.styleRatio = 0.5;
    this.msg = 'start';
  }
  /**
   * 读取模型
   */
  async init() {
    const reses:tf.GraphModel[] = await Promise.all([
      this.loadModel('mobilenet'),
      this.loadModel('separable'),
    ])
    this.styleNet = reses[0];
    this.transformNet = reses[1];
  }
  async loadModel(name:IModelsKey) {
    if (!this.modelCache[name]) {
      this.modelCache[name]= await tf.loadGraphModel(MODELS[name]);
    }
    return this.modelCache[name];
  }
  /**
   * 风格化
   * @param styleImg 
   * @param contentImg 
   * @param stylizedImg 
   * @param ratio 
   */
  async stylize(styleImg:HTMLImageElement, contentImg:HTMLImageElement, stylizedImg:HTMLCanvasElement, ratio:number) {
    await tf.nextFrame();
    this.msg = 'Generating 100D style representation';
    await tf.nextFrame();
    let bottleneck:tf.Tensor<tf.Rank>|tf.Tensor<tf.Rank>[]|tf.NamedTensorMap|undefined = tf.tidy(() => {
      return this.styleNet?.predict(tf.browser.fromPixels(styleImg).toFloat().div(tf.scalar(255)).expandDims());
    });
    if(!bottleneck) return;
    this.msg = 'Generating 100D identity style representation';
    await tf.nextFrame();
    const identityBottleneck:tf.Tensor<tf.Rank>|tf.Tensor<tf.Rank>[]|tf.NamedTensorMap|undefined = await tf.tidy(() => {
      return this.styleNet?.predict(tf.browser.fromPixels(contentImg).toFloat().div(tf.scalar(255)).expandDims());
    })
    if(!identityBottleneck) return;
    const styleBottleneck = bottleneck;
    bottleneck = await tf.tidy(() => {
      const styleBottleneckScaled = tf.mul(styleBottleneck as tf.Tensor, tf.scalar(ratio));
      const identityBottleneckScaled = tf.mul(identityBottleneck as tf.Tensor, tf.scalar(1.0-ratio));
      return styleBottleneckScaled.add(identityBottleneckScaled)
    })
    tf.dispose(styleBottleneck);
    tf.dispose(identityBottleneck);

    this.msg = 'Stylizing image...';
    await tf.nextFrame();
    const stylized = await tf.tidy(() => {
      return tf.squeeze(this.transformNet?.predict([tf.browser.fromPixels(contentImg).toFloat().div(tf.scalar(255)).expandDims(), bottleneck as tf.Tensor]) as tf.Tensor);
    })
    await tf.browser.toPixels(stylized as tf.Tensor2D, stylizedImg);
    tf.dispose(bottleneck);  // Might wanna keep this around
    tf.dispose(stylized);
  }
}