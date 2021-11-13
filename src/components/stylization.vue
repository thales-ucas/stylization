<template>
  <div class="ai989">
    <article>
      <h1>风格迁移</h1>
      <p>加载图片，然后选择风格，然后调节强度，可以生成最终风格化后的图片</p>
    </article>
    <van-loading v-if="loading" type="spinner">模型加载中……</van-loading>
    <div v-else>
      <fieldset>
        <legend>请选择原始图片</legend>
        <van-uploader :after-read="onAfterRead" />
        <div><img ref="contentImg" :src="contentImgSrc" alt="contentImgSrc" class="style-img" crossorigin="anonymous"/></div>
      </fieldset>
      <fieldset>
        <legend>请选择风格</legend>
        <ul class="image-list">
          <li v-for="(image, index) in styleImages" :key="index" :class="{active:index==styleImageIndex}" :data-index="index" @click.stop="onChooseStyle" >
            <img :src="image" :alt="`style-${index}`" />
          </li>
        </ul>
        <div><img ref="styleImg" :src="styleImgSrc" alt="styleImgSrc" class="style-img" crossorigin="anonymous"/></div>
      </fieldset>
      <fieldset>
        <legend>最终图片</legend>
        <canvas ref="stylizedImg" class="style-img" ></canvas>
        <van-field name="slider" label="强度">
          <template #input>
            <van-slider v-model="ratio" :min="0" :max="1" :step="0.001"/>
          </template>
        </van-field>
        <van-loading v-if="stylizing" type="spinner">生成中……</van-loading>
        <van-button v-else type="primary" @click.stop="onLaunch">生成</van-button>
      </fieldset>
    </div>
    <fieldset>
      <legend>源码</legend>
      <ul>
        <li>
          <a href="https://gitee.com/thales-ucas/stylization.git" target="_blank">https://gitee.com/thales-ucas/stylization.git</a>
        </li>
        <li>
          <a href="https://github.com/thales-ucas/stylization.git" target="_blank">https://github.com/thales-ucas/stylization.git</a>
        </li>
      </ul>
    </fieldset>
    <fieldset>
      <legend>参考文献</legend>
      <h2><a href="https://arxiv.org/abs/1508.06576" target="_blank">A Neural Algorithm of Artistic Style</a></h2>
      <h3>
        <span class="descriptor">Authors:</span>
        <a href="https://arxiv.org/search/cs?searchtype=author&amp;query=Gatys%2C+L+A" target="_blank">Leon A. Gatys</a>,
        <a href="https://arxiv.org/search/cs?searchtype=author&amp;query=Ecker%2C+A+S" target="_blank">Alexander S. Ecker</a>,
        <a href="https://arxiv.org/search/cs?searchtype=author&amp;query=Bethge%2C+M" target="_blank">Matthias Bethge</a>
      </h3>
      <p>In fine art, especially painting, humans have mastered the skill to create unique visual experiences through composing a complex interplay between the content and style of an image. Thus far the algorithmic basis of this process is unknown and there exists no artificial system with similar capabilities. However, in other key areas of visual perception such as object and face recognition near-human performance was recently demonstrated by a class of biologically inspired vision models called Deep Neural Networks. Here we introduce an artificial system based on a Deep Neural Network that creates artistic images of high perceptual quality. The system uses neural representations to separate and recombine content and style of arbitrary images, providing a neural algorithm for the creation of artistic images. Moreover, in light of the striking similarities between performance-optimised artificial neural networks and biological vision, our work offers a path forward to an algorithmic understanding of how humans create and perceive artistic imagery.</p>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue-demi';
import { useModel } from '@/store';

const store = useModel();

function onAfterRead(fileEvt:any) {
  const fileReader = new FileReader();
  fileReader.onload = ((e:ProgressEvent<FileReader>) => {
    store.contentImgSrc = (e.target as FileReader).result as string;
  });
  fileReader.readAsDataURL(fileEvt.file);
}
/**
 * 选择风格
 */
function onChooseStyle(e:MouseEvent) {
  store.styleImageIndex = parseInt((e.currentTarget as HTMLLIElement).dataset.index as string);
}
const loading = computed(() => store.loading); // 加载状态
const stylizing = computed(() => store.stylizing); // 风格化状态
const styleImages = computed(() => store.styleImages); // 风格图片列表
const styleImageIndex = computed(() => store.styleImageIndex); // 风格图片index
const contentImgSrc = computed(() => store.contentImgSrc); // 原始图片src
const styleImgSrc = computed(() => store.styleImgSrc); // 风格图片src
const styleImg = ref<InstanceType<typeof HTMLImageElement>>(); // 风格图片
const contentImg = ref<InstanceType<typeof HTMLImageElement>>(); // 原始图片
const stylizedImg = ref<HTMLCanvasElement>(); // 最终图片
const ratio = ref<number>(0.9); // 风格比率

/**
 * 开始创建
 */
function onLaunch(e:MouseEvent) {
  if(styleImg.value && contentImg.value && stylizedImg.value) {
    store.launch(styleImg.value, contentImg.value, stylizedImg.value, ratio.value);
  }
}
onMounted(() => {
  store.ready();
});
</script>


<style lang="scss" scoped>
.ai989 {
  article {
    padding: 0 12px;
    h1 {
      text-align: center;
    }
  }
  .style-img {
    width: 100%;
    max-width: 800px;
  }
  .image-list {
    li {
      width: 50px;
      height: 50px;
      border: 1px solid #000;
      margin: 2px;
      display: inline-block;
      list-style: none;
      vertical-align: middle;
      &.active {
        border-color: #F00;
      }
      img {
        width: 100%;
      }
    }
  }
}
.camera {
  position: relative;
}
.camera video {
  position: absolute;
  z-index: 1;
}
.camera canvas {
  position: absolute;
  z-index: 2;
}
</style>
