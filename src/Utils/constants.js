export const EXCHANGES = ['NSE', 'BSE'];
export const TRANSACTION_TYPES = ['BUY', 'SELL'];
export const ORDER_TYPES = ['MARKET', 'LIMIT'];
export const ORDER_PRODUCTS = ['CNC'];
export const ORDER_VARIETIES = ['regular', 'amo'];
export const ORDER_VALIDITIES = ['DAY', 'IOC'];
export const API_URL = 'https://api-gravity.limsindia.com';
export const WS_URL = 'wss://api-gravity.limsindia.com';
// export const API_URL = 'https://api.zerodha.com';
// export const WS_URL = 'wss://api.zerodha.com';
export const ORDER_STATUSES = [
    'PENDING',
    'OPEN',
    'EXECUTED',
    'PLACED',
    'FAILED',
    'REJECTED',
    'CANCELLED',
    'COMPLETE',
];
export const ORDER_STATUS_COLORS = {
    OPEN: 'yellow',
    PENDING: 'orange',
    EXECUTED: 'blue',
    PLACED: 'purple',
    FAILED: 'red',
    REJECTED: 'volcano',
    CANCELLED: 'pink',
    COMPLETE: 'green',
};
export const TIMEFRAMES = ['minute', '5minute', '15minute', '60minute'];
export const POSITION_STATUSES = ['OPEN', 'CLOSE'];
export const PAGINATION_PER_PAGE = 10;