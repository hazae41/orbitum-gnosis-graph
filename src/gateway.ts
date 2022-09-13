import { Created, Replied } from "../generated/Gateway/Gateway"
import { Post, Topic } from "../generated/schema"
import { getOrCreateForumFromName } from "./entities/forum"
import { getOrCreateProfileFromAddress } from "./entities/profile"

export function handleCreated(event: Created): void {
  const topicid = event.params.topic.toString()
  const postid = event.params.post.toString()
  const authorid = event.params.author.toHex()
  const forumid = event.params.forum
  const time = event.params.time
  const title = event.params.title
  const text = event.params.text

  if (Topic.load(topicid)) return
  if (Post.load(postid)) return
  const topic = new Topic(topicid)
  const post = new Post(postid)

  const forum = getOrCreateForumFromName(forumid, time)
  const author = getOrCreateProfileFromAddress(authorid, time)

  forum.count = forum.count + 1
  forum.updated = time

  author.count = author.count + 1
  author.updated = time

  topic.author = authorid
  topic.forum = forumid
  topic.title = title
  topic.first = postid
  topic.last = postid
  topic.count = 0
  topic.created = time
  topic.updated = time

  post.topic = topicid
  post.author = authorid
  post.forum = forumid
  post.text = text
  post.created = time

  topic.save()
  post.save()
  forum.save()
  author.save()
}

export function handleReplied(event: Replied): void {
  const topicid = event.params.topic.toString()
  const postid = event.params.post.toString()
  const authorid = event.params.author.toHex()
  const forumid = event.params.forum
  const time = event.params.time
  const text = event.params.text

  if (Post.load(postid)) return
  const post = new Post(postid)

  const topic = Topic.load(topicid)
  if (!topic) return

  const forum = getOrCreateForumFromName(forumid, time)
  const author = getOrCreateProfileFromAddress(authorid, time)

  forum.count = forum.count + 1
  forum.updated = time

  author.count = author.count + 1
  author.updated = time

  topic.count = topic.count + 1
  topic.updated = time

  post.topic = topicid
  post.author = authorid
  post.forum = forumid
  post.text = text
  post.created = time

  topic.save()
  post.save()
  forum.save()
  author.save()
}


