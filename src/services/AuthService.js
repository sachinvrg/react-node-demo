import HttpService from './HttpService';
import StorageService from './StorageService';

class AuthService extends HttpService {

    async login(credentials) {
        return this.request('login', 'post', credentials).then(resp => {
            StorageService.setItem('user', resp.data);
            return resp.data;
        });
    }

    async register(data) {
        return this.request('/register', 'post', data).then(resp => {
            StorageService.setItem('user', resp.data);
            return resp.data;
        });
    }

    async changePassword(data) {
        return this.request('/password/change', 'post', data).then(resp => {
            return resp.data;
        });
    }

    async forgotPassword(data) {
        return this.request('/password/forgot', 'post', data).then(resp => {
            return resp.data;
        });
    }

    async resetPassword(data) {
        return this.request('/password/reset', 'post', data).then(resp => {
            return resp.data;
        });
    }

    async updateProfile(data) {
        return this.request('/profile', 'post', data).then(resp => {
            StorageService.setItem('user', resp.data);
            return resp.data;
        });
    }

    async getProfile() {
        return this.request('/profile', 'get').then(resp => {
            return resp.data;
        });
    }

    logout() {
        StorageService.removeItem('user');
    }
}

const authService = new AuthService();

export { AuthService, authService };
