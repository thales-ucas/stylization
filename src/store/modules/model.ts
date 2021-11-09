import { IStyleParameter } from '@/type';
import { defineStore } from 'pinia';

const useModel= defineStore({
  id: 'stylization',
  state: () => ({
    loading: <number>(0),
    msg: <string>(''), // 消息
    contentImgSrc: <string>('./images/golden_gate.jpg'),
    styleImages: <string[]>([
      './images/seaport.jpg',
      './images/sketch.jpg',
      './images/clouds.jpg',
      './images/bricks.jpg',
      './images/red_circles.jpg',
      './images/stripes.jpg',
      './images/udnie.jpg',
      './images/zigzag.jpg',
      './images/rob.jpg',
      './images/towers.jpg'
    ]), // 样式图片列表
    styleImageIndex: <number>(0) // 所选样式图片index
  }),
  getters: {
    styleImgSrc():string {
      return this.styleImages[this.styleImageIndex];
    }
  },
  actions: {
    
  }
});
export default useModel;