export type AppOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ForcefullyOmit<T, K extends keyof T> = Omit<T, K> & Partial<Record<K, never>>;

export type Construct<T> = new () => T;
