import BaseService from "../BaseService";

const URL = "http://localhost:5000/api/upload";
const configHeaders = {
    headers: {
        "Content-Type": "multipart/form-data",
    },
};
class UpLoadService extends BaseService {
    constructor() {
        super(URL, configHeaders);
    }
    uploadAvatar(formData: FormData) {
        return this.post("avatar", formData, configHeaders);
    }

    uploadLocationImage(formData: FormData) {
        return this.post("location", formData, configHeaders);
    }

    uploadPostImage(formData: FormData) {
        return this.post("post", formData, configHeaders);
    }
}
export default UpLoadService;
