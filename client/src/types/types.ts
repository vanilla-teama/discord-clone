import { RouterSearch } from '../lib/router';

export type Dispatch<S> = (state: S) => void;

export enum CustomEvents {
  BEFOREROUTERPUSH = 'beforerouterpush',
  AFTERROUTERPUSH = 'afterrouterpush',
}

type RouterPushEventDetails = { controller: string; action: string; params: string[]; search: RouterSearch };
type CreateCustomEvent<T> = { detail: T };

export type CustomEvent = {
  [CustomEvents.BEFOREROUTERPUSH]: CreateCustomEvent<RouterPushEventDetails>;
  [CustomEvents.AFTERROUTERPUSH]: CreateCustomEvent<RouterPushEventDetails>;
};
