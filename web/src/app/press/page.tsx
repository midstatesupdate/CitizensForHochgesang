import {redirect} from 'next/navigation'
import {assertPageEnabled} from '@/lib/cms/repository'

export default async function PressPage() {
  await assertPageEnabled('media')
  redirect('/media')
}
