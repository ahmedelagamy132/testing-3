// Copy this file to the root of studio-hello-world/ after running the CLI.
// It replaces the default sanity.config.ts the CLI generates.

import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./schemas"

export default defineConfig({
  name: "miduva-studio",
  title: "Miduva Studio",

  // Replace with your actual project ID (shown in sanity.io/manage)
  projectId: "YOUR_PROJECT_ID",
  dataset: "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton: only one Landing Page document
            S.listItem()
              .title("Landing Page")
              .id("landingPage")
              .child(
                S.document()
                  .schemaType("landingPage")
                  .documentId("landingPage")
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
