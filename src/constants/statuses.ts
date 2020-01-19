export const STATUS_IDLE = 'idle';
export const STATUS_LOADING = 'loading';
export const STATUS_ERROR = 'error';
export const STATUS_SUCCESS = 'success';

export type STATUS = typeof STATUS_IDLE | typeof STATUS_LOADING | typeof STATUS_ERROR | typeof STATUS_SUCCESS;
