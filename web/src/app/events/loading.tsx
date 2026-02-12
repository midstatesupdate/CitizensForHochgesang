import {RouteLoading} from '@/components/route-loading'

export default function Loading() {
  return (
    <RouteLoading
      label="Events"
      title="Loading campaign events"
      description="Fetching upcoming town halls and community meetups."
    />
  )
}
