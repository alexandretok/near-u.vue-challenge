import { defineStore } from "pinia"
import { computed, ref } from "vue"
import Episode from "../types/Episode"
import TVShow from "../types/TVShow";
import Season from "../types/Season";
import Image from "../types/Image";

export const useTVShowStore = defineStore('tv-show', () => {
  const _tvShow = ref<TVShow>();
  const _seasons = ref<Season[]>();
  const _selectedSeason = ref<Season>();
  const _images = ref<Image[]>();
  const _episodes = ref<Episode[]>();

  const episodes = computed(() => _episodes.value);
  function setEpisodes(newEpisodes: Episode[]) {
    _episodes.value = newEpisodes;
  }

  function getEpisodeById(id: number): Episode | undefined {
    return _episodes.value?.find(episode => episode.id == id);
  }

  const tvShow = computed(() => _tvShow.value);
  function setTVShow(newTVShow: TVShow) {
    _tvShow.value = newTVShow;
  }

  const seasons = computed(() => _seasons.value);
  function setSeasons(newSeasons: Season[]) {
    _seasons.value = newSeasons;
  }

  const selectedSeason = computed(() => _selectedSeason.value);
  function setSelectedSeason(newSelectedSeason: Season) {
    _selectedSeason.value = newSelectedSeason;
  }

  const images = computed(() => _images.value);
  function setImages(newImages: Image[]) {
    _images.value = newImages;
  }

  return {
    tvShow,
    episodes,
    seasons,
    selectedSeason,
    images,
    getEpisodeById,
    setEpisodes,
    setTVShow,
    setSeasons,
    setSelectedSeason,
    setImages
  }
})