import { defineStore } from "pinia"
import { ref } from "vue"
import Episode from "../types/Episode"

export const useEpisodeStore = defineStore('episode', () => {
  const episodes = ref<Episode[]>();

  function setEpisodes(newEpisodes: Episode[]) {
    episodes.value = newEpisodes;
  }

  function getEpisode(id: number): Episode | undefined {
    return episodes.value?.find(episode => episode.id == id);
  }

  return { episodes, getEpisode, setEpisodes }
})