export const capitalize = (value: string) => value.slice(0, 1).toUpperCase() + value.slice(1);

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string | string[]
): HTMLElementTagNameMap[K] => {
  const $element = document.createElement(tagName);
  if (className) {
    $element.className = [className].flat(Infinity).join(' ');
  }
  return $element;
};

export const $ = createElement;

export const replaceWith = <T extends HTMLElement = HTMLElement>($element: T, $newElement: T): T => {
  if ($element) {
    $element.replaceWith($newElement);
    return $newElement;
  }
  return $newElement;
};

export const isKeyOf = <T extends object>(value: unknown, obj: T): value is keyof typeof obj =>
  (value as string) in obj;
