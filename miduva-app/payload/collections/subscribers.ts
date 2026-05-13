import type { CollectionConfig } from 'payload'

export const subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: {
    singular: 'Subscriber',
    plural: 'Launch list',
  },
  admin: {
    group: 'Leads',
    description:
      'People who left their email on the coming-soon page. They will be notified at launch.',
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'coming-soon',
      admin: {
        description: 'Where the subscription was captured from.',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Captured at submission for spam diagnostics.',
      },
    },
  ],
  timestamps: true,
}
