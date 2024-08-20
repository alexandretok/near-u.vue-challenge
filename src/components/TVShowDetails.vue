<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NImage, NH1, NH2, NRate, NText, NButtonGroup, NButton, NCard } from 'naive-ui';
import { Helper } from '../utils/Helper';
import ApiService from '../services/api.service';
import TVShow from '../types/TVShow';
import Image from '../types/Image';
import Status from '../types/Status';
import Season from '../types/Season';
import Episode from '../types/Episode';
import { useTVShowStore } from '../store/tv-show.store'

const tvShowData = ref<TVShow>();
const seasons = ref<Season[]>([]);
const episodes = ref<Episode[]>([]);
const images = ref<Image[]>([]);
const selectedImageUrl = ref<string>();
const selectedSeason = ref<number>();
const tvShowStore = useTVShowStore();

onMounted(async () => {
  [ tvShowData.value, seasons.value, images.value ] = await Promise.all([
    ApiService.getShowDetails(),
    ApiService.getShowSeasons(),
    ApiService.getShowImages()
  ]);

  document.title = tvShowData.value.name;
  selectedImageUrl.value = images.value[0].resolutions.original.url;
  selectSeason(seasons.value[0]);
});

const selectSeason = async (season: Season) => {
  selectedSeason.value = season.number;
  episodes.value = await ApiService.getSeasonEpisodesList(season.id);
  tvShowStore.setEpisodes(episodes.value);
};
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
        {{ $translate('average-rating-colon') }}
        <n-rate
          :allow-half="true"
          :value="tvShowData.rating.average / 2"
          size="small"
          readonly
        />
        ({{ tvShowData.rating.average / 2 }})
      </n-text>
      <n-text v-if="tvShowData.genres.length">
        {{ $translate('genres-colon') }}
        {{ tvShowData.genres.join(', ') }}
      </n-text>
      <n-text>
        {{ $translate('status-colon') }}
        {{ tvShowData.status }}
      </n-text>
      <n-text>
        {{ $translate('premiere-date-colon') }}
        {{ Helper.formatDate(tvShowData.premiered) }}
      </n-text>
      <n-text v-if="tvShowData.status === Status.Ended">
        {{ $translate('end-date-colon') }}
        {{ Helper.formatDate(tvShowData.ended) }}
      </n-text>
    </div>
  </section>

  <section class="tv-show-details__seasons">
    <n-h2>{{ $translate('episodes') }}</n-h2>
    <n-button-group>
      <n-button
        v-for="season in seasons"
        :type="season.number === selectedSeason ? 'primary' : 'default'"
        @click="selectSeason(season)"
        round>
        {{ $translate('season') }} {{ season.number }}
      </n-button>
    </n-button-group>

    <n-card hoverable v-for="episode in episodes">
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
            {{ episode.runtime }}  {{ $translate('minutes-abbreviation') }}
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

  &__thumbnail {
    padding: 0.4rem 0.4rem 0 0;
    cursor: pointer;
  }

  &__images {
    text-align: start;
    display: flex;
    flex-direction: column;
    flex-shrink: 2;

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

  &__seasons {
    padding: 0 2.5rem;
    text-align: start;

    .n-button-group {
      margin-bottom: 1.5rem;
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
