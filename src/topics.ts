import { BigInt } from "@graphprotocol/graph-ts"
import { Forum, Post, Topic } from "../generated/schema"
import { Created, LockChanged, Modified, NSFWChanged, PinChanged, Removed, Renamed, Replied } from "../generated/Topics/Topics"
import { getOrCreateForumFromName } from "./entities/forum"
import { getOrCreateProfileFromAddress } from "./entities/profile"

export function handleCreated(event: Created): void {
  const topicid = event.params.topic.toString()
  const postid = event.params.post.toString()
  const authorid = event.params.author.toHex()
  const forumid = event.params.forum
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
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
  topic.hidden = false
  topic.nsfw = false
  topic.locked = false
  topic.pinned = false

  post.topic = topicid
  post.author = authorid
  post.forum = forumid
  post.text = text
  post.created = time
  post.hidden = false

  topic.save()
  post.save()
  forum.save()
  author.save()
}

export function handleReplied(event: Replied): void {
  const topicid = event.params.topic.toString()
  const postid = event.params.post.toString()
  const authorid = event.params.author.toHex()
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const text = event.params.text

  if (Post.load(postid)) return
  const post = new Post(postid)

  const topic = Topic.load(topicid)
  if (!topic) return

  const forum = Forum.load(topic.forum)
  if (!forum) return

  const author = getOrCreateProfileFromAddress(authorid, time)

  forum.count = forum.count + 1
  forum.updated = time

  author.count = author.count + 1
  author.updated = time

  topic.count = topic.count + 1

  if (time > topic.updated) {
    topic.last = postid
    topic.updated = time
  }

  post.topic = topicid
  post.author = authorid
  post.forum = forum.id
  post.text = text
  post.created = time
  post.hidden = false

  topic.save()
  post.save()
  forum.save()
  author.save()
}

export function handleRenamed(event: Renamed): void {
  const topicid = event.params.topic.toString()
  const title = event.params.title

  const topic = Topic.load(topicid)
  if (!topic) return

  topic.title = title

  topic.save()
}

export function handleModified(event: Modified): void {
  const postid = event.params.post.toString()
  const text = event.params.text

  const post = Post.load(postid)
  if (!post) return

  post.text = text

  post.save()
}

export function handleRemoved(event: Removed): void {
  const postid = event.params.post.toString()

  const post = Post.load(postid)
  if (!post) return

  const topic = Topic.load(post.topic)
  if (!topic) return

  if (topic.first == post.id) {
    topic.hidden = true
  }

  post.hidden = true

  post.save()
  topic.save()
}

export function handleNSFWChanged(event: NSFWChanged): void {
  const topicid = event.params.topic.toString()
  const nsfw = event.params.nsfw

  const topic = Topic.load(topicid)
  if (!topic) return

  topic.nsfw = nsfw

  topic.save()
}

export function handleLockChanged(event: LockChanged): void {
  const topicid = event.params.topic.toString()
  const locked = event.params.locked

  const topic = Topic.load(topicid)
  if (!topic) return

  topic.locked = locked

  topic.save()
}

export function handlePinChanged(event: PinChanged): void {
  const topicid = event.params.topic.toString()
  const pinned = event.params.pinned

  const topic = Topic.load(topicid)
  if (!topic) return

  topic.pinned = pinned

  topic.save()
}