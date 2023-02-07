import { RouterSearch } from '../lib/router';

export type Dispatch<S> = (state: S) => void;

export enum CustomEvents {
  BEFOREROUTERPUSH = 'beforerouterpush',
  AFTERROUTERPUSH = 'afterrouterpush',
}

type RouterPushEventDetails = { controller: string; action: string; params: string[]; search: RouterSearch };

export type CustomEventData = {
  [CustomEvents.BEFOREROUTERPUSH]: RouterPushEventDetails;
  [CustomEvents.AFTERROUTERPUSH]: RouterPushEventDetails;
};
