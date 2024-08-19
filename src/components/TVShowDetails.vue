<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NImage, NH1, NRate, NText } from 'naive-ui';
import { Helper } from '../utils/Helper';
import ApiService from '../services/api.service';
import TVShow from '../types/TVShow';
import Image from '../types/Image';
import Status from '../types/Status';

const tvShowData = ref<TVShow>();
const images = ref<Image[]>([]);
const selectedImageUrl = ref<string>();

onMounted(async () => {
  [ tvShowData.value, images.value ] = await Promise.all([ApiService.getShowDetails(), ApiService.getShowImages()]);
  selectedImageUrl.value = images.value[0].resolutions.original.url;
});

</script>

<template>
  <section class="tv-show-details" v-if="tvShowData">
    <div class="tv-show-details__images">
      <n-image
        width="384px"
        :preview-disabled="true"
        :src="selectedImageUrl"
      />
      <div>
        <n-image
          v-for="image in images"
          class="tv-show-details__thumbnail"
          width="48px"
          height="48px"
          object-fit="fill"
          preview-disabled
          @click="selectedImageUrl = image.resolutions.original.url"
          :src="image.resolutions.medium?.url || image.resolutions.original.url"
        />
      </div>
    </div>

    <div class="tv-show-details__information">
      <n-h1>{{ tvShowData.name }}</n-h1>
      <n-text :innerHTML="tvShowData.summary" />
      <n-text>
        {{ $translate('rating.label') }}
        <n-rate
          :allow-half="true"
          :value="tvShowData.rating.average / 2"
          size="small"
          readonly
        />
        ({{ tvShowData.rating.average / 2 }})
      </n-text>
      <n-text v-if="tvShowData.genres.length">
        {{ $translate('genres.label') }}
        {{ tvShowData.genres.join(', ') }}
      </n-text>
      <n-text>
        {{ $translate('status.label') }}
        {{ tvShowData.status }}
      </n-text>
      <n-text>
        {{ $translate('premiere-date.label') }}
        {{ Helper.formatDate(tvShowData.premiered) }}
      </n-text>
      <n-text v-if="tvShowData.status === Status.Ended">
        {{ $translate('end-date.label') }}
        {{ Helper.formatDate(tvShowData.ended) }}
      </n-text>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.tv-show-details {
  padding: 2.5rem;
  display: flex;

  &__thumbnail {
    padding: 0.4rem 0.4rem 0 0;
    cursor: pointer;
  }

  &__images {
    text-align: start;
    display: flex;
    flex-direction: column;

    .n-image:first-of-type {
      box-shadow: 5px 5px 20px -2px rgba(0,0,0,0.25);
    }
  }

  &__information {
    padding: 0 2.5rem;
    text-align: start;
    display: flex;
    flex-direction: column;
  }
}
</style>
