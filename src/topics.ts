import { BigInt } from "@graphprotocol/graph-ts"
import { Forum, Post, Profile, Topic } from "../generated/schema"
import { Created, HiddenChanged, LockChanged, Modified, NSFWChanged, PinChanged, Quoted, Renamed, Replied } from "../generated/Topics2/Topics2"
import { getOrCreateForumFromName } from "./entities/forum"
import { createQuoteNotification, createReplyNotification } from "./entities/notification"
import { getOrCreateProfileFromAddress } from "./entities/profile"

export function handleCreated(event: Created): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const topicid = event.params.topic.toString()
  const postid = event.params.post.toString()
  const authorid = event.params.author.toHex()
  const forumid = event.params.forum
  const title = event.params.title
  const text = event.params.text

  if (Topic.load(topicid)) return
  if (Post.load(postid)) return
  const topic = new Topic(topicid)
  const post = new Post(postid)

  const forum = getOrCreateForumFromName(forumid, time)
  const author = getOrCreateProfileFromAddress(authorid, time)

  forum.count = forum.count + 1
  forum.hcount = forum.hcount + 1
  forum.updated = time

  author.count = author.count + 1
  author.hcount = author.hcount + 1
  author.updated = time

  topic.author = authorid
  topic.forum = forumid
  topic.title = title
  topic.first = postid
  topic.last = postid
  topic.count = 0
  topic.hcount = 0
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
  post.count = 0
  post.hcount = 0

  topic.save()
  post.save()
  forum.save()
  author.save()
}

export function handleReplied(event: Replied): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const topicid = event.params.topic.toString()
  const postid = event.params.post.toString()
  const authorid = event.params.author.toHex()
  const text = event.params.text

  if (Post.load(postid)) return
  const post = new Post(postid)

  const topic = Topic.load(topicid)
  if (!topic) return

  const forum = Forum.load(topic.forum)
  if (!forum) return

  const author = getOrCreateProfileFromAddress(authorid, time)
  forum.count = forum.count + 1
  forum.hcount = forum.hcount + 1
  forum.updated = time

  author.count = author.count + 1
  author.hcount = author.hcount + 1
  author.updated = time

  topic.count = topic.count + 1
  topic.hcount = topic.hcount + 1

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
  post.count = 0
  post.hcount = 0

  if (topic.author != post.author) {
    createReplyNotification(topic.author, time, topic, post)
  }

  topic.save()
  post.save()
  forum.save()
  author.save()
}

export function handleQuoted(event: Quoted): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const parentid = event.params.parent.toString()
  const postid = event.params.post.toString()
  const authorid = event.params.author.toHex()
  const text = event.params.text

  if (Post.load(postid)) return
  const post = new Post(postid)

  const parent = Post.load(parentid)
  if (!parent) return

  const topic = Topic.load(parent.topic)
  if (!topic) return

  const forum = Forum.load(topic.forum)
  if (!forum) return

  const author = getOrCreateProfileFromAddress(authorid, time)
  forum.count = forum.count + 1
  forum.hcount = forum.hcount + 1
  forum.updated = time

  author.count = author.count + 1
  author.hcount = author.hcount + 1
  author.updated = time

  topic.count = topic.count + 1
  topic.hcount = topic.hcount + 1

  if (time > topic.updated) {
    topic.last = postid
    topic.updated = time
  }

  parent.count = parent.count + 1
  parent.hcount = parent.hcount + 1

  post.parent = parent.id
  post.topic = topic.id
  post.author = author.id
  post.forum = forum.id
  post.text = text
  post.created = time
  post.hidden = false
  post.count = 0
  post.hcount = 0

  if (topic.author != post.author) {
    createReplyNotification(topic.author, time, topic, post)
  }

  if (topic.author != parent.author && parent.author != post.author) {
    createQuoteNotification(parent.author, time, topic, post)
  }

  topic.save()
  parent.save()
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
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const postid = event.params.post.toString()
  const text = event.params.text

  const post = Post.load(postid)
  if (!post) return

  if (post.modified === null || time > post.modified!) {
    post.text = text
    post.modified = time
  }

  post.save()
}

export function handleHiddenChanged(event: HiddenChanged): void {
  const postid = event.params.post.toString()
  const hidden = event.params.hidden

  const post = Post.load(postid)
  if (!post) return

  const topic = Topic.load(post.topic)
  if (!topic) return

  let parent: Post | null = null

  if (post.parent != null) {
    parent = Post.load(post.parent!)
    if (!parent) return
  }

  if (post.id == topic.first && topic.hidden != hidden) {
    const forum = Forum.load(topic.forum)
    if (!forum) return

    const operator = Profile.load(topic.author)
    if (!operator) return

    if (hidden) {
      topic.hidden = true
      forum.count = forum.count - 1
      operator.count = operator.count - 1
    } else {
      topic.hidden = false
      forum.count = forum.count + 1
      operator.count = operator.count + 1
    }

    forum.save()
    operator.save()
  }

  if (post.hidden != hidden) {
    if (hidden) {
      post.hidden = true
      topic.count = topic.count - 1

      if (parent != null) {
        parent.count = parent.count - 1
      }
    } else {
      post.hidden = false
      topic.count = topic.count + 1

      if (parent != null) {
        parent.count = parent.count + 1
      }
    }
  }

  if (parent != null)
    parent.save()
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