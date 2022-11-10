import { BigInt } from "@graphprotocol/graph-ts"
import { Created, Replied } from "../generated/JVArchive/JVArchive"
import { Forum, Post, Topic } from "../generated/schema"
import { getOrCreateForumFromName } from "./entities/forum"
import { getOrCreateProfileFromAddress } from "./entities/profile"

function getOrCreateForumFromId(id: string, time: BigInt): Forum {
  if (id == "51")
    return getOrCreateForumFromName("blabla", time)
  if (id == "3011927")
    return getOrCreateForumFromName("finance", time)
  return getOrCreateForumFromName("blabla", time)
}

export function handleCreated(event: Created): void {
  const forumid = event.params.forum.toString()
  const topicid = event.params.topic.toString()
  const postid = event.params.post.toString()
  const time = event.params.time
  const title = event.params.title
  const text = event.params.text

  if (Topic.load(topicid)) return
  if (Post.load(postid)) return
  const topic = new Topic(topicid)
  const post = new Post(postid)

  const forum = getOrCreateForumFromId(forumid, time)
  const author = getOrCreateProfileFromAddress("0x80368eDB5b3af9440864dd0dDF8eA43D59e8De2a", time)

  forum.count = forum.count + 1
  forum.hcount = forum.hcount + 1
  forum.updated = time

  author.count = author.count + 1
  author.hcount = author.hcount + 1
  author.updated = time

  topic.author = author.id
  topic.forum = forum.id
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
  post.author = author.id
  post.forum = forum.id
  post.text = text
  post.created = time
  post.hidden = false
  post.count = 0
  post.hcount = 0
  post.donations = []

  topic.save()
  post.save()
  forum.save()
  author.save()
}

export function handleReplied(event: Replied): void {
  const topicid = event.params.topic.toString()
  const postid = event.params.post.toString()
  const time = event.params.time
  const text = event.params.text

  if (Post.load(postid)) return
  const post = new Post(postid)

  const topic = Topic.load(topicid)
  if (!topic) return

  const forum = Forum.load(topic.forum)
  if (!forum) return

  const author = getOrCreateProfileFromAddress("0x80368eDB5b3af9440864dd0dDF8eA43D59e8De2a", time)

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
  post.author = author.id
  post.forum = forum.id
  post.text = text
  post.created = time
  post.hidden = false
  post.count = 0
  post.hcount = 0
  post.donations = []

  topic.save()
  post.save()
  forum.save()
  author.save()
}


