import type { CollectionConfig } from 'payload'

export const contactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Contact submission',
    plural: 'Contact submissions',
  },
  admin: {
    group: 'Leads',
    description: 'Messages submitted from the Start the conversation form.',
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'company', 'service', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'service',
      type: 'text',
      required: true,
      admin: {
        description: 'Selected service interest value from the contact form.',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'contact-form',
      admin: {
        readOnly: true,
        description: 'Where this lead was captured from.',
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
