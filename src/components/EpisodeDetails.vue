<script setup lang="ts">
import { NButton, NIcon, NH2, NP, NImage } from 'naive-ui';
import { ChevronBack } from '@vicons/ionicons5';
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import Episode from '../types/Episode';
import { useTVShowStore } from '../store/tv-show.store'
import { Helper } from '../utils/Helper';

const episode = ref<Episode>();
const route = useRoute();
const router = useRouter();
const tvShowStore = useTVShowStore();

onMounted(async () => {
  const episodeId = route.params.episodeId;
  episode.value = tvShowStore.getEpisodeById(+episodeId);

  if (!episode.value) {
    router.replace('/');
  }
});
</script>

<template>
  <section v-if="episode" class="episode-details__header">
    <RouterLink to="/">
      <n-button>
        <n-icon><ChevronBack /></n-icon>
        {{ $translate('go-back') }}
      </n-button>
    </RouterLink>
    <n-h2>
      {{ episode.name }}
    </n-h2>
    <div>
      <template v-if="episode.season && episode.number">
        {{ $translate('season') }} {{ episode.season }}
        {{ $translate('episode') }} {{ episode.number }}
      </template>
    </div>
  </section>

  <section v-if="episode" class="episode-details__content">
    <n-image
      v-if="episode.image"
      width="384px"
      :preview-disabled="true"
      :src="episode.image.original"
    />
    <n-p>
      {{ $translate('premiere-date-colon') }}
      {{ Helper.formatDate(episode.airdate) }}
    </n-p>
    <n-p>
      {{ $translate('episode-duration-colon') }}
      {{ episode.runtime }}  {{ $translate('minutes-abbreviation') }}
    </n-p>
    <n-p :innerHTML="episode.summary"></n-p>
  </section>
</template>

<style lang="scss" scoped>
.episode-details {
  &__header {
    margin: 2rem;
    display: flex;
    justify-content: space-between;

    .n-h2 {
      margin-top: 0;
    }
  }

  &__content {
    margin: 2rem;
  }
}
</style>
