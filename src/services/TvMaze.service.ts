import axios, { AxiosInstance, AxiosResponse } from 'axios';

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

  protected async getShowDetails<T>(showId = DEFAULT_SHOW_ID): Promise<T> {
    const path = `shows/${showId}`;
    try {
      const response: AxiosResponse<T> = await this.api.get(path);
      return response.data;
    } catch (error: any) {
      throw new Error(`GET request to ${path} failed: ${error.message}`);
    }
  }

  protected async getShowSeasons<T>(showId = DEFAULT_SHOW_ID): Promise<T> {
    const path = `shows/${showId}/seasons`;
    try {
      const response: AxiosResponse<T> = await this.api.get(path);
      return response.data;
    } catch (error: any) {
      throw new Error(`GET request to ${path} failed: ${error.message}`);
    }
  }

  protected async getSeasonEpisodesList<T>(seasonId: number): Promise<T> {
    const path = `seasons/${seasonId}/episodes`;
    try {
      const response: AxiosResponse<T> = await this.api.get(path);
      return response.data;
    } catch (error: any) {
      throw new Error(`GET request to ${path} failed: ${error.message}`);
    }
  }

  protected async getEpisodeDetails<T>(episodeId: number): Promise<T> {
    const path = `episodes/${episodeId}`;
    try {
      const response: AxiosResponse<T> = await this.api.get(path);
      return response.data;
    } catch (error: any) {
      throw new Error(`GET request to ${path} failed: ${error.message}`);
    }
  }
}

export default ApiService;