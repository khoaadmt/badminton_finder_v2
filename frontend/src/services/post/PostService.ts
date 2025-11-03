import { FilterOptions } from "../../interface";
import { BASE_URL } from "../../utils/api/apiConfig";
import BaseService from "../BaseService";

const configHeaders = "";
class PostService extends BaseService {
  constructor() {
    super(`${BASE_URL}/posts`, configHeaders);
  }

  getPostByFilter(
    filterOptions: FilterOptions | null,
    pageNumber: number,
    location: string | null,
    token: string | undefined,
    latitude: number,
    longitude: number,
  ) {
    return this.get(
      "/filter",
      {
        params: {
          filter: filterOptions,
          page: pageNumber,
          city: location,
          latitude,
          longitude,
        },
      },
      token,
    );
  }

  getPostById(id: string) {
    return this.get(`${id}`, id);
  }

  getPostByUserName(username: string) {
    return this.get(`by-username/${username}`);
  }

  getPostByStatus(status: string) {
    return this.get(`/status/${status}`);
  }
  updateStatus(postId: number, status: string) {
    return this.put(`/${postId}/status`, { status });
  }

  createPost(values: any, accessToken: string | undefined) {
    return this.post("", values, "", accessToken);
  }

  deletePosst(postId: string, accessToken: string | undefined) {
    return this.delete(`/${postId}`, accessToken);
  }
}
export default PostService;
