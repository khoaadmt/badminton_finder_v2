import { BASE_URL } from "../../utils/api/apiConfig";
import BaseService from "../BaseService";

const configHeaders = "";
class AuthService extends BaseService {
    constructor() {
        super(`${BASE_URL}/auth`, configHeaders);
    }
    login(data: any) {
        return this.post("login", data);
    }
    register(data: any) {
        return this.post("register", data);
    }
    refreshToken() {
        return this.post("refresh", "");
    }
}
export default AuthService;
