import { Created, Replied } from "../generated/Gateway/Gateway"
import { Post, Topic } from "../generated/schema"
import { getOrCreateForumFromName } from "./entities/forum"
import { getOrCreateProfileFromAddress } from "./entities/profile"

export function handleCreated(event: Created): void {
  const topicid = event.params.topic.toString()
  const postid = event.params.post.toString()
  const author = event.params.author.toHex()
  const time = event.params.time
  const forum = event.params.forum
  const title = event.params.title
  const text = event.params.text

  if (Topic.load(topicid)) return
  if (Post.load(postid)) return
  const topic = new Topic(topicid)
  const post = new Post(postid)

  topic.author = author
  topic.forum = forum
  topic.title = title
  topic.first = postid
  topic.last = postid
  topic.count = 0
  topic.created = time
  topic.replied = time

  post.topic = topicid
  post.author = author
  post.forum = forum
  post.text = text
  post.created = time

  getOrCreateForumFromName(forum)
  getOrCreateProfileFromAddress(author)

  topic.save()
  post.save()
}

export function handleReplied(event: Replied): void {
  const topicid = event.params.topic.toString()
  const postid = event.params.post.toString()
  const author = event.params.author.toHex()
  const time = event.params.time
  const forum = event.params.forum
  const text = event.params.text

  if (Post.load(postid)) return
  const post = new Post(postid)

  const topic = Topic.load(topicid)
  if (!topic) return

  topic.count = topic.count + 1
  topic.replied = time

  post.topic = topicid
  post.author = author
  post.forum = forum
  post.text = text
  post.created = time

  getOrCreateForumFromName(forum)
  getOrCreateProfileFromAddress(author)

  topic.save()
  post.save()
}


