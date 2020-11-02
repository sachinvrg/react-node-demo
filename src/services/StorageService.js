class StorageService {

    constructor() {
        this.provider = window.localStorage;
    }

    getItem(key, defaultValue) {
        try {
            return JSON.parse(this.provider.getItem(key)) || defaultValue;
        } catch {
            return defaultValue;
        }
    }

    setItem(key, value) {
        value = typeof value === 'string' ? value : JSON.stringify(value);
        this.provider.setItem(key, value);
    }

    removeItem(key) {
        this.provider.removeItem(key);
    }

    get length() {
        return this.provider.length;
    }

    getAll() {
        Array.from(this.provider);
    }

    clear() {
        this.provider.clear();
    }
}

export default new StorageService();
