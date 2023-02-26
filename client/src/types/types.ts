import { RouterSearch } from '../lib/router';
import { User } from './entities';

export type Dispatch<S> = (state: S) => void;

export enum CustomEvents {
  BEFOREROUTERPUSH = 'beforerouterpush',
  AFTERROUTERPUSH = 'afterrouterpush',
  ACCOUNTUPDATED = 'accountupdated',
}

type RouterPushEventDetails = { controller: string; action: string; params: string[]; search: RouterSearch };

type AccountUpdatedEventDetails = { user: User };

export type CustomEventData = {
  [CustomEvents.BEFOREROUTERPUSH]: RouterPushEventDetails;
  [CustomEvents.AFTERROUTERPUSH]: RouterPushEventDetails;
  [CustomEvents.ACCOUNTUPDATED]: AccountUpdatedEventDetails;
};

export interface TypeWithArgs<T, A extends unknown[]> extends Function {
  new (...args: A): T;
}
