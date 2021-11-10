import { GraphModel } from '@tensorflow/tfjs';

export interface IStyleParameter {
  contentImageSize: number; // 尺寸
  styleImageSize: number; // 尺寸
  ratio: number; // 比率
}

export const MODELS = { // 模型
  mobilenet: 'saved_model_style_js/model.json', // 9.6m
  inception: 'saved_model_style_inception_js/model.json', // 36,3m
  separable: 'saved_model_transformer_separable_js/model.json', // 2.4m
  original: 'saved_model_transformer_js/model.json' // 7.9m
}
export type IModelsKey = keyof typeof MODELS;
export interface IModelCache {
  [porpName:string]:GraphModel;
}
export const STYLES:string[] = [ // 风格图片
  './images/seaport.jpg',
  './images/towers.jpg',
  './images/sketch.jpg',
  './images/clouds.jpg',
  './images/red_circles.jpg',
  './images/bricks.jpg',
  './images/stripes.jpg',
  './images/udnie.jpg',
  './images/zigzag.jpg',
  './images/star.jpg',
  './images/rob.jpg'
]