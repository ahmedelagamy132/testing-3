'use server'

import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './importMap.js'

export const serverFn: ServerFunctionClient = async (args) =>
  handleServerFunctions({ ...args, config, importMap })
