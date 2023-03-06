import Controller from '../lib/controller';
import View from '../lib/view';
import PopupView, { PopupCoords } from '../views/popup-view';

class PopupComponent<
  V extends View,
  C extends Controller<V>,
  R extends new ($root: HTMLElement) => C
> extends Controller<PopupView> {
  RenderedComponentClass: R;

  constructor(coords: PopupCoords, RenderedComponentClass: R) {
    super(new PopupView(coords));
    this.RenderedComponentClass = RenderedComponentClass;
  }

  async init(): Promise<void> {
    this.view.render();
    await new this.RenderedComponentClass(PopupView.getContainer()).init();
    PopupView.show();
  }
}

export default PopupComponent;
