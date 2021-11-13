import { defineStore } from 'pinia';
import { STYLES } from '@/type';
import { Stylization } from '@/utils/main';

const stylization:Stylization = new Stylization();
const useModel= defineStore({
  id: 'stylization',
  state: () => ({
    loading: <boolean>(false), // 模型加载
    stylizing: <boolean>(false), // 风格化
    msg: <string>(''), // 消息
    contentImgSrc: <string>('./images/helianthus.jpg'),
    styleImageIndex: <number>(0) // 所选样式图片index
  }),
  getters: {
    styleImages():string[] {
      return STYLES;
    },
    styleImgSrc():string {
      return this.styleImages[this.styleImageIndex];
    }
  },
  actions: {
    /**
     * 准备(加载模型)
     */
    async ready() {
      this.loading = true;
      await stylization.init();
      this.loading = false;
    },
    /**
     * 启动(风格化)
     * @param styleImg 风格图片
     * @param contentImg 原始图片
     * @param stylizedImg 生成图片
     * @param ratio 风格比率
     */
    async launch(styleImg:HTMLImageElement, contentImg:HTMLImageElement, stylizedImg:HTMLCanvasElement, ratio:number) {
      this.stylizing = true;
      await stylization.stylize(styleImg, contentImg, stylizedImg, ratio);
      this.stylizing = false;
    }
  }
});
export default useModel;