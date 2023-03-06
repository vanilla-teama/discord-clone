import { Translation, appStore } from '../store/app-store';

export const translation = (): Translation => appStore.translation(appStore.lang);
