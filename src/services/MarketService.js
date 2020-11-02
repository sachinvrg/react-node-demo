import HttpService from './HttpService';
import StorageService from './StorageService';

class MarketService extends HttpService {

    async getStocks(data) {
        return this.request('/market/stocks', 'get', data).then(resp => resp.data);
    }

    async callback(data) {
        return this.request('/market/callback', 'post', data).then(resp => {
            const updatedUser = { ...StorageService.getItem('user', {}), ...resp.data };
            StorageService.setItem('user', updatedUser);
            return resp.data;
        });
    }

    async disconnect() {
        return this.request('/market/disconnect', 'delete', null, false).then(resp => {
            const token = StorageService.getItem('user', {}).token;
            const updatedUser = { ...resp.data, token };
            StorageService.setItem('user', updatedUser);
            return resp.data;
        });
    }

    async addStock(id) {
        return this.request('/user/stock/' + id, 'post').then(resp => resp.data);
    }

    async removeStock(id) {
        return this.request('/user/stock/' + id, 'delete').then(resp => resp.data);
    }

    async favoriteStocks(data) {
        return this.request('/user/stocks', 'get', data).then(resp => resp.data);
    }

    async getQuote(iToken) {
        return this.request('/market/quote/' + iToken, 'get', null, false).then(resp => resp.data);
    }

    async addToScreening(data) {
        return this.request('/screening', 'post', data).then(resp => resp.data);
    }

    async getScreenings(data) {
        return this.request('/screenings', 'get', data).then(resp => resp.data);
    }

    async getResults(id, data) {
        return this.request(`/screening/${id}/results`, 'get', data).then(resp => resp.data);
    }

    async removeScreening(id) {
        return this.request('/screening/' + id, 'delete').then(resp => resp.data);
    }

    async getOrders(data) {
        return this.request('/orders', 'get', data).then(resp => resp.data);
    }

    async getPositions(data) {
        return this.request('/positions', 'get', data).then(resp => resp.data);
    }

    async changeScreeningStatus(data) {
        return this.request('/screening/batch/status', 'put', data).then(resp => resp.data);
    }
}

const marketService = new MarketService();
export { MarketService, marketService };
