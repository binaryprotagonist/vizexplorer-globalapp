import { useRef } from "react";

export function useFnDebounce() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function debounce(fn: any, timeout: number) {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fn, timeout);
  }

  return debounce;
}

export function assetUnreachable(_x: never): never {
  throw new Error("Unreachable");
}

/**
 * `navigator.clipboard` is only available in secure contexts (HTTPS)
 * Handle non-secure contexts using deprecated `document.execCommand`
 * @param text Text to be copied
 * @param container Element to contain temporary element for copying text. This element needs to be within focus
 *  (i.e. when using a Dialog, the dialog should be used as the container, otherwise copying will not work)
 */
export async function copyToClipboard(
  text: string,
  container?: HTMLElement
): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return await navigator.clipboard.writeText(text);
  } else {
    return new Promise((resolve, reject) => {
      const appendChildTo = container ?? document.body;
      const textArea = document.createElement("textarea");
      textArea.textContent = text;
      appendChildTo.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy") ? resolve() : reject();
      appendChildTo.removeChild(textArea);
    });
  }
}
