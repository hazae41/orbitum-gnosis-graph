import { Counter } from "../../generated/schema";

export function getOrCreateCounter(): Counter {
  let counter = Counter.load("0")
  if (counter) return counter

  counter = new Counter("0")

  counter.notification = 0
  counter.donation = 0

  return counter
}