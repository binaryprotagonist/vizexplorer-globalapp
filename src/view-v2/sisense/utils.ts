import { produce } from "immer";
import { JaqlUpdate, MetadataItem, SisenseApp } from "./types";

export async function loadSisenseScript(sisenseUrl: string): Promise<SisenseApp> {
  // element required for JS to apply tooltips and such. The element should wrap the application.
  if (!document.getElementById("sisenseApp")) {
    throw Error("Missing element with id 'sisenseApp'");
  }

  const authRes = await checkAuthentication(sisenseUrl);
  if (!authRes.isAuthenticated) {
    await authenticateSilent(authRes.loginUrl);
  }

  return await loadScript(sisenseUrl);
}

async function loadScript(sisenseUrl: string): Promise<SisenseApp> {
  const script = document.createElement("script");
  script.id = "sisense-js-script";
  script.type = "text/javascript";
  script.src = `${sisenseUrl}/js/sisense.v1.js`;
  script.async = true;
  document.body.appendChild(script);

  return await new Promise((res, rej) => {
    script.onload = () => {
      if (!("Sisense" in window)) {
        rej("Failed to load Sisense script");
        return;
      }

      const saveChanges = false;
      window.Sisense.connect(sisenseUrl, saveChanges).then(res).catch(rej);
    };
  });
}

async function authenticateSilent(loginUrl: string): Promise<void> {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  iframe.src = `${loginUrl}?return_to=${window.location.href}`;

  await new Promise((resolve) => {
    iframe.onload = () => {
      resolve(true);
    };
  });

  document.body.removeChild(iframe);
}

async function checkAuthentication(
  sisenseUrl: string
): Promise<{ isAuthenticated: boolean; loginUrl: string }> {
  const fetchUrl = `${sisenseUrl}/api/auth/isauth`;
  const response = await fetch(fetchUrl, {
    headers: { Internal: "true" },
    credentials: "include"
  });

  const result = await response.json();

  if (!result.isAuthenticated) {
    if (!result.ssoEnabled) {
      throw new Error("SSO not enabled");
    }

    if (!result.loginUrl) {
      throw new Error("No SSO Login URL");
    }
  }

  return {
    isAuthenticated: result.isAuthenticated,
    loginUrl: `${result.loginUrl}?return_to=${window.location.href}`
  };
}

export function updateMetadataItemValue(
  filter: MetadataItem,
  value: JaqlUpdate
): MetadataItem {
  return produce({ ...filter }, (draft) => {
    draft.jaql.filter = value.filter;
    if (value.level) {
      draft.jaql.level = value.level;
    }
  });
}
