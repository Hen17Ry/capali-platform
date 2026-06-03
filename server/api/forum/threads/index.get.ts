import { ForumThread } from '~~/server/models/ForumThread'
import { connectMongo } from '~~/server/utils/mongo'

export default defineEventHandler(async (event) => {
  await connectMongo()

  const query = getQuery(event)
  const category = query.category as string
  const search = query.search as string
  const sort = (query.sort as string) || 'newest'

  let filter: any = {}
  if (category && category !== 'Tous') {
    filter.category = category
  }
  if (search) {
    filter.title = { $regex: search, $options: 'i' }
  }

  let sortOption: any = { isPinned: -1, lastActivityAt: -1 } // Default: pinned first, then newest active
  if (sort === 'popular') {
    sortOption = { isPinned: -1, viewCount: -1, replyCount: -1 }
  }

  const threads = await ForumThread.find(filter)
    .sort(sortOption)
    .limit(50)
    .lean()

  return { data: threads }
})
