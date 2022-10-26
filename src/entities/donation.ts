import { BigInt } from "@graphprotocol/graph-ts"
import { Donation, Post, Profile } from "../../generated/schema"

export function createDonation(txHash: string, time: BigInt, post: Post, donator: Profile, amount: BigInt): Donation {
  const donation = new Donation(txHash)

  donation.txHash = txHash
  donation.time = time
  donation.post = post.id
  donation.donator = donator.id
  donation.amount = amount

  donation.save()

  return donation
}