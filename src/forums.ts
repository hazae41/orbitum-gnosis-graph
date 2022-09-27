import { BigInt } from "@graphprotocol/graph-ts"
import { AvatarChanged, DescriptionChanged, ModeratorPromoted, ModeratorUnpromoted, NSFWChanged, OwnershipChanged } from "../generated/Forums/Forums"
import { getOrCreateForumFromName } from "./entities/forum"
import { getOrCreateProfileFromAddress } from "./entities/profile"

export function handleAvatar(event: AvatarChanged): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const forum = getOrCreateForumFromName(event.params.name, time)
  const avatar = event.params.avatar

  forum.avatar = avatar

  forum.save()
}

export function handleDescription(event: DescriptionChanged): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const forum = getOrCreateForumFromName(event.params.name, time)
  const description = event.params.description

  forum.description = description

  forum.save()
}

export function handleNSFW(event: NSFWChanged): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const forum = getOrCreateForumFromName(event.params.name, time)
  const nsfw = event.params.nsfw

  forum.nsfw = nsfw

  forum.save()
}

export function handleOwnership(event: OwnershipChanged): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const forum = getOrCreateForumFromName(event.params.name, time)
  const owner = getOrCreateProfileFromAddress(event.params.owner.toHex(), time)

  forum.owner = owner.address

  forum.save()
}

export function handlePromoted(event: ModeratorPromoted): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const forum = getOrCreateForumFromName(event.params.name, time)
  const moderator = getOrCreateProfileFromAddress(event.params.moderator.toHex(), time)

  const mods = forum.mods
  mods.push(moderator.address)

  forum.mods = mods

  forum.save()
}

export function handleUnpromoted(event: ModeratorUnpromoted): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const forum = getOrCreateForumFromName(event.params.name, time)
  const moderator = getOrCreateProfileFromAddress(event.params.moderator.toHex(), time)

  const mods = forum.mods
  const mods2 = new Array<string>(mods.length)

  for (let i = 0; i < mods.length; i++)
    if (mods[i] != moderator.address)
      mods2.push(mods[i])

  forum.mods = mods2

  forum.save()
}
