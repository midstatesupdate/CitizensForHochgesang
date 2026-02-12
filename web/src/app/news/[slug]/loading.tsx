import {RouteLoading} from '@/components/route-loading'

export default function Loading() {
  return (
    <RouteLoading
      label="News"
      title="Loading article"
      description="Fetching the full article from campaign content."
    />
  )
}
