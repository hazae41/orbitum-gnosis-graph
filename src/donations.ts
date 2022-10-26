import { BigInt } from "@graphprotocol/graph-ts"
import { Donated } from "../generated/Donations/Donations"
import { Post } from "../generated/schema"
import { createDonation } from "./entities/donation"
import { getOrCreateProfileFromAddress } from "./entities/profile"

export function handleDonated(event: Donated): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const postid = event.params.post.toString()
  const donator = getOrCreateProfileFromAddress(event.params.donator.toHex(), time)
  const amount = event.params.amount

  const post = Post.load(postid)
  if (!post) return

  const donation = createDonation(time, post, donator, amount)

  const donations = post.donations
  donations.push(donation.id)

  post.donations = donations

  post.save()
}
