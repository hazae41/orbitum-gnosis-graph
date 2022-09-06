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

  const topic = new Topic(topicid)
  const post = new Post(postid)

  topic.time = time
  topic.author = author
  topic.forum = forum
  topic.title = title
  topic.first = postid
  topic.last = postid

  post.time = time
  post.topic = topicid
  post.author = author
  post.forum = forum
  post.text = text

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

  const post = new Post(postid)

  post.time = time
  post.topic = topicid
  post.author = author
  post.forum = forum
  post.text = text

  getOrCreateForumFromName(forum)
  getOrCreateProfileFromAddress(author)

  post.save()
}


