import { BigInt } from "@graphprotocol/graph-ts"
import { Post, QuoteNotification, ReplyNotification, Topic } from "../../generated/schema"
import { getOrCreateCounter } from "./counter"

export function createReplyNotification(to: string, time: BigInt, topic: Topic, post: Post): ReplyNotification {
  const counter = getOrCreateCounter()

  counter.notification = counter.notification + 1

  const notification = new ReplyNotification(counter.notification.toString())

  notification.to = to
  notification.time = time
  notification.topic = topic.id
  notification.post = post.id

  notification.save()
  counter.save()

  return notification
}

export function createQuoteNotification(to: string, time: BigInt, topic: Topic, post: Post): QuoteNotification {
  const counter = getOrCreateCounter()

  counter.notification = counter.notification + 1

  const notification = new QuoteNotification(counter.notification.toString())

  notification.to = to
  notification.time = time
  notification.topic = topic.id
  notification.post = post.id

  notification.save()
  counter.save()

  return notification
}