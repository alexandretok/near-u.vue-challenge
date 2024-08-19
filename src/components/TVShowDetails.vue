<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NImage, NH1, NRate, NP, NCarousel } from 'naive-ui';
import { Helper } from '../utils/Helper';
import ApiService from '../services/api.service';
import TVShow from '../types/TVShow';
import Image from '../types/Image';

const tvShowData = ref<TVShow>();
const images = ref<Image[]>([]);
onMounted(async () => {
  tvShowData.value = await ApiService.getShowDetails();
  images.value = await ApiService.getShowImages();
  console.log(images.value);

});

</script>

<template>
  <section class="tv-show-details" v-if="tvShowData">
    <n-image
      class="tv-show-details__cover-image"
      width="100%"
      :preview-disabled="true"
      :src="tvShowData.image.original"
    />
    <div class="tv-show-details__information">
      <n-h1>{{ tvShowData.name }}</n-h1>
      <n-p :innerHTML="tvShowData.summary" />
      <n-p>
        {{ $translate('rating.label') }}
        <n-rate
          :allow-half="true"
          :value="tvShowData.rating.average / 2"
          size="small"
          readonly
        />
        ({{ tvShowData.rating.average / 2 }})
      </n-p>
      <n-p v-if="tvShowData.genres.length">
        {{ $translate('genres.label') }}
        {{ tvShowData.genres.join(', ') }}
      </n-p>
      <n-p>
        {{ $translate('status.label') }}
        {{ tvShowData.status }}
      </n-p>
      <n-p>
        {{ $translate('premiere-date.label') }}
        {{ Helper.formatDate(tvShowData.premiered) }}
      </n-p>
      <n-p>
        {{ $translate('end-date.label') }}
        {{ Helper.formatDate(tvShowData.ended) }}
      </n-p>
    </div>
  </section>

  <section v-if="images.length">
    {{ $translate('gallery.label') }}
    <n-carousel
      effect="card"
      style="height: 256px"
      show-arrow
      autoplay
      draggable
      :interval="3000"
    >
      <n-carousel-item v-for="image in images">
        <n-image
          width="256px"
          height="256px"
          object-fit="cover"
          :src="image.resolutions.medium?.url || image.resolutions.original.url"
          :preview-src="image.resolutions.original.url"
        />
      </n-carousel-item>
    </n-carousel>
  </section>
</template>

<style lang="scss" scoped>
.tv-show-details {
  display: flex;
}
</style>
