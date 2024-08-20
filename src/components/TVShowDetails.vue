<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NImage, NH1, NH2, NRate, NText, NButtonGroup, NButton, NCard } from 'naive-ui';
import { Helper } from '../utils/Helper';
import ApiService from '../services/api.service';
import Status from '../types/Status';
import Season from '../types/Season';
import { useTVShowStore } from '../store/tv-show.store'

const selectedImageUrl = ref<string>();
const tvShowStore = useTVShowStore();

onMounted(async () => {
  const [ tvShowData, seasons, images ] = await Promise.all([
    tvShowStore.tvShow || ApiService.getShowDetails(),
    tvShowStore.seasons || ApiService.getShowSeasons(),
    tvShowStore.images || ApiService.getShowImages()
  ]);

  tvShowStore.setTVShow(tvShowData);
  tvShowStore.setSeasons(seasons);
  tvShowStore.setImages(images);

  document.title = tvShowData.name;
  selectedImageUrl.value = images[0].resolutions.original.url;

  if (!tvShowStore.selectedSeason || !tvShowStore.episodes?.length) {
    selectSeason(tvShowStore.selectedSeason || seasons[0]);
  }
});

const selectSeason = async (season: Season) => {
  tvShowStore.setSelectedSeason(season);
  const episodes = await ApiService.getSeasonEpisodesList(season.id);
  tvShowStore.setEpisodes(episodes);
};
</script>

<template>
  <section class="tv-show-details" v-if="tvShowStore.tvShow">
    <div class="tv-show-details__images">
      <n-image
        width="384px"
        :preview-disabled="true"
        :src="selectedImageUrl"
      />
      <div class="tv-show-details__thumbnail-container">
        <n-image
          v-for="image in tvShowStore.images"
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
      <n-h1>{{ tvShowStore.tvShow.name }}</n-h1>
      <n-text :innerHTML="tvShowStore.tvShow.summary" />
      <n-text>
        {{ $translate('average-rating-colon') }}
        <n-rate
          :allow-half="true"
          :value="tvShowStore.tvShow.rating.average / 2"
          size="small"
          readonly
        />
        ({{ tvShowStore.tvShow.rating.average / 2 }})
      </n-text>
      <n-text v-if="tvShowStore.tvShow.genres.length">
        {{ $translate('genres-colon') }}
        {{ tvShowStore.tvShow.genres.join(', ') }}
      </n-text>
      <n-text>
        {{ $translate('status-colon') }}
        {{ tvShowStore.tvShow.status }}
      </n-text>
      <n-text>
        {{ $translate('premiere-date-colon') }}
        {{ Helper.formatDate(tvShowStore.tvShow.premiered) }}
      </n-text>
      <n-text v-if="tvShowStore.tvShow.status === Status.Ended">
        {{ $translate('end-date-colon') }}
        {{ Helper.formatDate(tvShowStore.tvShow.ended) }}
      </n-text>
    </div>
  </section>

  <section class="tv-show-details__seasons">
    <n-h2>{{ $translate('episodes') }}</n-h2>
    <n-button-group>
      <n-button
        v-for="season in tvShowStore.seasons"
        :type="season.number === tvShowStore.selectedSeason?.number ? 'primary' : 'default'"
        @click="selectSeason(season)"
        ghost>
        {{ $translate('season') }} {{ season.number }}
      </n-button>
    </n-button-group>

    <n-card hoverable v-for="episode in tvShowStore.episodes">
      <RouterLink :to="`/episode/${episode.id}`">
        <n-h2>
          {{ episode.season && episode.number && `S${episode.season}E${episode.number}:` }}
          {{ episode.name }}
        </n-h2>
      </RouterLink>
      <div class="tv-show-details__episode">
        <RouterLink :to="`/episode/${episode.id}`">
          <n-image
            v-if="episode.image"
            width="256px"
            height="256px"
            preview-disabled
            :src="episode.image.original"
          />
        </RouterLink>
        <div class="tv-show-details__episode-information">
          <n-text v-if="episode.rating.average">
            {{ $translate('average-rating-colon') }}
            <n-rate
              :allow-half="true"
              :value="episode.rating.average / 2"
              size="small"
              readonly
            />
            ({{ episode.rating.average / 2 }})
          </n-text>

          <n-text v-if="episode.airdate">
            {{ $translate('aired-colon') }}
            {{ Helper.formatDate(episode.airdate) }}
          </n-text>

          <n-text v-if="episode.runtime">
            {{ $translate('episode-duration-colon') }}
            {{ episode.runtime }} {{ $translate('minutes-abbreviation') }}
          </n-text>
          <n-text :innerHTML="episode.summary"></n-text>
        </div>
      </div>
    </n-card>
  </section>
</template>

<style lang="scss" scoped>
.tv-show-details {
  padding: 2.5rem;
  display: flex;

  @media (max-width: 992px) {
    flex-direction: column;
  }

  &__thumbnail-container {
    max-width: 384px;
  }

  &__thumbnail {
    padding: 0.4rem 0.4rem 0 0;
    cursor: pointer;
  }

  &__images {
    text-align: start;
    display: flex;
    flex-direction: column;

    @media (max-width: 992px) {
      justify-content: center;
      align-items: center;
    }
  }

  &__information {
    padding: 0 2.5rem;
    text-align: start;
    display: flex;
    flex-direction: column;
  }

  &__seasons {
    padding: 0 2.5rem;
    text-align: start;

    .n-button-group {
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .n-card {
      margin-bottom: 1rem;
    }
  }

  &__episode {
    display: flex;
    gap: 1rem;
  }

  &__episode-information {
    display: flex;
    flex-direction: column;
  }
}
</style>
