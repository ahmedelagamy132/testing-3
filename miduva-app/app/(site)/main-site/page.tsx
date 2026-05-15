import { AppWrapper } from '@/components/app-wrapper'
import { getLandingPageData } from '@/payload/utils/get-landing-page-data'

export const revalidate = 60

export default async function MainSitePage() {
  const data = await getLandingPageData()
  return <AppWrapper data={data} />
}
