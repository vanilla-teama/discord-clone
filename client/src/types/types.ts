export type Dispatch<S> = (state: S) => void;

export enum CustomEvents {
  BEFOREROUTERPUSH = 'beforerouterpush',
  AFTERROUTERPUSH = 'afterrouterpush',
}
