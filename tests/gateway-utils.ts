import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { Post, Topic } from "../generated/Gateway/Gateway"

export function createPostEvent(
  id: string,
  topic: string,
  author: Address,
  text: string
): Post {
  let postEvent = changetype<Post>(newMockEvent())

  postEvent.parameters = new Array()

  postEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  postEvent.parameters.push(
    new ethereum.EventParam("topic", ethereum.Value.fromString(topic))
  )
  postEvent.parameters.push(
    new ethereum.EventParam("author", ethereum.Value.fromAddress(author))
  )
  postEvent.parameters.push(
    new ethereum.EventParam("text", ethereum.Value.fromString(text))
  )

  return postEvent
}

export function createTopicEvent(
  id: string,
  forum: string,
  author: Address,
  title: string,
  text: string
): Topic {
  let topicEvent = changetype<Topic>(newMockEvent())

  topicEvent.parameters = new Array()

  topicEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  topicEvent.parameters.push(
    new ethereum.EventParam("forum", ethereum.Value.fromString(forum))
  )
  topicEvent.parameters.push(
    new ethereum.EventParam("author", ethereum.Value.fromAddress(author))
  )
  topicEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  topicEvent.parameters.push(
    new ethereum.EventParam("text", ethereum.Value.fromString(text))
  )

  return topicEvent
}
