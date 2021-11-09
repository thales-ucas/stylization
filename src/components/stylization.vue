<template>
  <div class="ai989">
    <article>
      <h1>风格迁移</h1>
      <p>加载图片，然后选择风格，然后调节强度，可以生成最终的图片</p>
    </article>
    <fieldset>
      <legend>请选择原始图片</legend>
      <van-uploader :after-read="onAfterRead" />
      <div><img ref="contentImg" :src="contentImgSrc" class="style-img" crossorigin="anonymous"/></div>
    </fieldset>
    <fieldset>
      <legend>请选择风格</legend>
      <ul class="image-list">
        <li v-for="(image, index) in styleImages" :data-index="index" @click.stop="onChooseStyle" >
          <img :src="image" />
        </li>
      </ul>
      <div><img ref="styleImg" :src="styleImgSrc" class="style-img" crossorigin="anonymous"/></div>
    </fieldset>
    <fieldset>
      <legend>最终图片</legend>
      <div>{{msg}}</div>
      <canvas ref="stylizedImg" class="style-img" ></canvas>
      <van-field name="slider" label="强度">
        <template #input>
          <van-slider v-model="ratio" :min="0" :max="1" :step="0.001"/>
        </template>
      </van-field>
      <van-loading v-if="loading" type="spinner">生成中……</van-loading>
      <van-button v-else type="primary" @click.stop="onLaunch">生成</van-button>
      <img />
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue-demi';
import { useModel } from '@/store';
import { Stylization } from '@/utils/main';

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
const msg = computed(() => store.msg);
const loading = computed(() => stylization.loading);
const styleImages = computed(() => store.styleImages);
const contentImgSrc = computed(() => store.contentImgSrc);
const styleImgSrc = computed(() => store.styleImgSrc);
const styleImg = ref<InstanceType<typeof HTMLImageElement>>();
const contentImg = ref<InstanceType<typeof HTMLImageElement>>();
const stylizedImg = ref<HTMLCanvasElement>();
const ratio = ref<number>(0.5);
const stylization = new Stylization();
watch(
  () => stylization.loading,
  (current, prev) => {
    console.log(current, prev);
  }
);

/**
 * 开始创建
 */
function onLaunch(e:MouseEvent) {
  if(styleImg.value && contentImg.value && stylizedImg.value) {
    stylization.stylize(styleImg.value, contentImg.value, stylizedImg.value, ratio.value);
  }
}
onMounted(() => {
  stylization.load();
});

</script>


<style lang="scss" scoped>
.ai989 {
  .style-img {
    width: 100%;
    max-width: 500px;
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
