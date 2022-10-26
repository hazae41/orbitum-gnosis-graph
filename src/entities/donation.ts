import { BigInt } from "@graphprotocol/graph-ts"
import { Donation, Post, Profile } from "../../generated/schema"
import { getOrCreateCounter } from "./counter"

export function createDonation(time: BigInt, post: Post, donator: Profile, amount: BigInt): Donation {
  const counter = getOrCreateCounter()

  counter.donation = counter.donation + 1

  const donation = new Donation(counter.donation.toString())

  donation.time = time
  donation.post = post.id
  donation.donator = donator.id
  donation.amount = amount

  donation.save()
  counter.save()

  return donation
}