import axios, { AxiosInstance, AxiosResponse } from 'axios';
import TVShow from '../types/TVShow';
import Image from '../types/Image';
import Season from '../types/Season';
import Episode from '../types/Episode';

// Show id for "Powerpuff Girls"
const DEFAULT_SHOW_ID = 1955;

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'https://api.tvmaze.com/';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async getShowDetails(showId = DEFAULT_SHOW_ID): Promise<TVShow> {
    const path = `shows/${showId}`;
    try {
      const response: AxiosResponse = await this.api.get(path);
      return response.data;
    } catch (error: any) {
      throw new Error(`GET request to ${path} failed: ${error.message}`);
    }
  }

  public async getShowSeasons(showId = DEFAULT_SHOW_ID): Promise<Season[]> {
    const path = `shows/${showId}/seasons`;
    try {
      const response: AxiosResponse = await this.api.get(path);
      return response.data;
    } catch (error: any) {
      throw new Error(`GET request to ${path} failed: ${error.message}`);
    }
  }

  public async getShowImages(showId = DEFAULT_SHOW_ID): Promise<Image[]> {
    const path = `shows/${showId}/images`;
    try {
      const response: AxiosResponse = await this.api.get(path);
      return response.data;
    } catch (error: any) {
      throw new Error(`GET request to ${path} failed: ${error.message}`);
    }
  }

  public async getSeasonEpisodesList(seasonId: number): Promise<Episode[]> {
    const path = `seasons/${seasonId}/episodes`;
    try {
      const response: AxiosResponse = await this.api.get(path);
      return response.data;
    } catch (error: any) {
      throw new Error(`GET request to ${path} failed: ${error.message}`);
    }
  }
}

export default new ApiService();