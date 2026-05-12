import path from 'path'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { landingPage } from './payload/globals/landing-page.ts'

export default buildConfig({
  admin: {
    user: 'users',
  },

  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [],
    },
    {
      slug: 'media',
      upload: {
        staticDir: path.resolve(process.cwd(), 'public/media'),
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          label: 'Alt text',
        },
      ],
    },
  ],

  globals: [landingPage],

  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI ?? 'file:./payload.db',
    },
  }),

  editor: lexicalEditor({}),

  typescript: {
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },

  secret: process.env.PAYLOAD_SECRET ?? '',
})
