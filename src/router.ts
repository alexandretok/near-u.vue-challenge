import TVShowDetails from './components/TVShowDetails.vue'
import EpisodeDetails from './components/EpisodeDetails.vue'
import { createWebHistory, createRouter } from 'vue-router';

const routes = [
  { path: '/', component: TVShowDetails },
  { path: '/episode/:episodeId', component: EpisodeDetails },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});