import { fireEvent } from "@testing-library/react";

/**
 * Query and change the value of an input which is a descendent of the provided element
 * @param element element containing input to update
 * @param value value to assign to that input
 */
export function updateInput(element: HTMLElement, value: any) {
  const input = element.tagName === "INPUT" ? element : getInput(element)!;
  fireEvent.change(input, { target: { value } });
}

/**
 * Query an input descendent of the provided element
 */
export function getInput(element: HTMLElement) {
  return element.querySelector("input");
}
