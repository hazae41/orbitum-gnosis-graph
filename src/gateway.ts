import { Post as PostEvent, Topic as TopicEvent } from "../generated/Gateway/Gateway"
import { getPostFromEvent } from "./entities/post"
import { getTopicFromEvent } from "./entities/topic"

export function handlePost(event: PostEvent): void {
  getPostFromEvent(event)
}

export function handleTopic(event: TopicEvent): void {
  getTopicFromEvent(event)
}
