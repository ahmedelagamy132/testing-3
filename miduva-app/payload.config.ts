import path from 'path'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { landingPage } from './payload/globals/landing-page'

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
      labels: {
        singular: 'Image',
        plural: 'Media Library',
      },
      admin: {
        group: 'Media',
        description: 'Upload and manage all images used across the site. Give each image a clear title so you can find it easily.',
        useAsTitle: 'title',
      },
      upload: {
        staticDir: path.resolve(process.cwd(), 'public/media'),
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 800,
            height: 600,
            position: 'centre',
          },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Image title',
          required: true,
          admin: {
            description: 'A short name so you can identify this image later (e.g. "Hero background", "Recruitment system card").',
          },
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt text',
          admin: {
            description: 'Describe the image for screen readers and SEO.',
          },
        },
      ],
    },
  ],

  globals: [landingPage],

  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI ?? 'file:./payload.db',
    },
    push: true,
  }),

  editor: lexicalEditor({}),

  typescript: {
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },

  secret: process.env.PAYLOAD_SECRET ?? '',
})
