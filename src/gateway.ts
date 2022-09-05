import { Post as PostEvent, Topic as TopicEvent } from "../generated/Gateway/Gateway"
import { Post, Topic } from "../generated/schema"
import { getOrCreateForumFromName } from "./entities/forum"
import { getOrCreateProfileFromAddress } from "./entities/profile"

export function handleTopic(event: TopicEvent): void {
  const topicid = event.params.topic.toString()
  const postid = event.params.post.toString()
  const author = event.params.author.toHex()
  const forum = event.params.forum
  const title = event.params.title
  const text = event.params.text

  const topic = new Topic(topicid)
  const post = new Post(postid)

  topic.forum = forum
  topic.author = author
  topic.title = title
  topic.first = postid
  topic.last = postid

  post.topic = topicid
  post.forum = forum
  post.author = author
  post.text = text

  getOrCreateForumFromName(topic.forum)
  getOrCreateProfileFromAddress(post.author)

  topic.save()
  post.save()
}

export function handlePost(event: PostEvent): void {
  const topicid = event.params.topic.toString()
  const postid = event.params.post.toString()
  const author = event.params.author.toHex()
  const text = event.params.text

  const post = new Post(postid)
  const topic = Topic.load(topicid)
  if (!topic) return

  post.forum = topic.forum
  post.topic = topicid
  post.author = author
  post.text = text

  getOrCreateProfileFromAddress(post.author)

  post.save()
}


