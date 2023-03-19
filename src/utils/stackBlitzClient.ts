import sdk from "@stackblitz/sdk";
import { EMBED_TARGET_ID, STACK_BLITZ_PROJECT_ID } from "./constants";
export const updateProject = async (embedCode: string) => {
  const iframe = document.getElementById(EMBED_TARGET_ID) as HTMLIFrameElement;
  const vm = await sdk.connect(iframe);
  await vm.applyFsDiff({
    create: {
      "index.html": `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/main.js"></script>
    ${embedCode}
</body>
</html>`,
    },
    destroy: [],
  });
};

export const embedProject = async (embedTargetId: string) => {
    await sdk.embedProjectId(embedTargetId, STACK_BLITZ_PROJECT_ID, {
      openFile: "index.html",
      view: "preview",
    });
}
