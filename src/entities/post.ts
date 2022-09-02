import { Post as PostEvent } from "../../generated/Gateway/Gateway"
import { Post } from "../../generated/schema"
import { getProfileFromAddress } from "./profile"

export function getPostFromEvent(event: PostEvent): Post {
  const id = event.params.id.toString()

  let post = Post.load(id)
  if (!post) post = new Post(id)

  post.topic = event.params.topic.toString()
  post.author = event.params.author.toHex()
  post.text = event.params.text

  getProfileFromAddress(post.author)

  post.save()

  return post
}