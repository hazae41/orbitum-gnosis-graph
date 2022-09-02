import { Topic as TopicEvent } from "../../generated/Gateway/Gateway"
import { Topic } from "../../generated/schema"
import { getForumFromName } from "./forum"
import { getProfileFromAddress } from "./profile"

export function getTopicFromEvent(event: TopicEvent): Topic {
  const id = event.params.id.toString()

  let topic = Topic.load(id)
  if (!topic) topic = new Topic(id)

  topic.author = event.params.author.toHex()
  topic.forum = event.params.forum
  topic.title = event.params.title

  getProfileFromAddress(topic.author)
  getForumFromName(topic.forum)

  topic.save()

  return topic
}