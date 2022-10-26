import { BigInt } from "@graphprotocol/graph-ts"
import { Donated } from "../generated/Donations/Donations"
import { Post, Topic } from "../generated/schema"
import { createDonation } from "./entities/donation"
import { createDonateNotification } from "./entities/notification"
import { getOrCreateProfileFromAddress } from "./entities/profile"

export function handleDonated(event: Donated): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const txHash = event.params.txHash
  const postid = event.params.post.toString()
  const donatorid = event.params.donator.toHex()
  const amount = event.params.amount

  const donator = getOrCreateProfileFromAddress(donatorid, time)

  const post = Post.load(postid)
  if (!post) return

  const topic = Topic.load(post.topic)
  if (!topic) return

  const donation = createDonation(txHash, time, post, donator, amount)

  const donations = post.donations
  donations.push(donation.id)

  post.donations = donations

  if (donation.donator != post.author)
    createDonateNotification(post.author, time, topic, donation)

  post.save()
}
