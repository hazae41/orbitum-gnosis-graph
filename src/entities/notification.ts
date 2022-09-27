import { BigInt } from "@graphprotocol/graph-ts"
import { Notification } from "../../generated/schema"
import { getOrCreateCounter } from "./counter"

export function createNotification(to: string, type: string, time: BigInt, data: string): void {
  const counter = getOrCreateCounter()

  counter.notification = counter.notification + 1

  const notification = new Notification(counter.notification.toString())

  notification.to = to
  notification.type = type
  notification.time = time
  notification.data = data

  notification.save()
  counter.save()
}