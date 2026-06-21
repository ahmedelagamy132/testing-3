import path from 'path'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { landingPage } from './payload/globals/landing-page'
import { subscribers } from './payload/collections/subscribers'
import { contactSubmissions } from './payload/collections/contact-submissions'

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' — Miduva CMS',
    },
    components: {
      providers: ['@/payload/components/tab-watcher-provider#TabWatcherProvider'],
      graphics: {
        Logo: '@/payload/components/admin-logo#AdminLogo',
        Icon: '@/payload/components/admin-logo#AdminIcon',
      },
      views: {
        dashboard: {
          Component: '@/payload/components/admin-dashboard#AdminDashboard',
        },
      },
    },
    livePreview: {
      url: '/preview',
      breakpoints: [
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
      globals: ['landing-page'],
    },
  },

  collections: [
    {
      slug: 'users',
      labels: {
        singular: 'Admin user',
        plural: 'Admin users',
      },
      auth: true,
      admin: {
        group: 'System',
        description: 'People who can sign in to this CMS.',
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
      access: {
        read: () => true,
      },
      admin: {
        group: 'Media',
        description: 'Upload and manage all images used across the site. Give each image a clear title so you can find it easily.',
        useAsTitle: 'title',
      },
      upload: {
        staticDir: path.resolve(process.cwd(), 'public/media'),
        displayPreview: true,
        imageSizes: [
          {
            name: 'thumbnail',
            width: 480,
            height: 360,
            position: 'centre',
          },
          {
            name: 'card',
            width: 1024,
            height: 768,
            position: 'centre',
          },
        ],
        adminThumbnail: 'card',
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
    subscribers,
    contactSubmissions,
  ],

  globals: [landingPage],

  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI ?? 'file:./payload.db',
    },
    push: true,
  }),

  editor: lexicalEditor({}),

  sharp,

  typescript: {
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },

  secret: process.env.PAYLOAD_SECRET ?? '',
})
