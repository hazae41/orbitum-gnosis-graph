import { AddressChanged, AvatarChanged, DescriptionChanged, ModeratorPromoted, ModeratorUnpromoted, NSFWChanged, OwnershipChanged } from "../generated/Forums/Forums"
import { getOrCreateForumFromName } from "./entities/forum"

export function handleAvatar(event: AvatarChanged): void {
  const forum = getOrCreateForumFromName(event.params.name, event.block.timestamp)
  const avatar = event.params.avatar

  forum.avatar = avatar
  forum.save()
}

export function handleDescription(event: DescriptionChanged): void {
  const forum = getOrCreateForumFromName(event.params.name, event.block.timestamp)
  const description = event.params.description

  forum.description = description
  forum.save()
}

export function handleNSFW(event: NSFWChanged): void {
  const forum = getOrCreateForumFromName(event.params.name, event.block.timestamp)
  const nsfw = event.params.nsfw

  forum.nsfw = nsfw
  forum.save()
}

export function handleOwnership(event: OwnershipChanged): void {
  const forum = getOrCreateForumFromName(event.params.name, event.block.timestamp)
  const owner = event.params.owner.toHex()

  forum.owner = owner
  forum.save()
}

export function handleAddress(event: AddressChanged): void {
  const forum = getOrCreateForumFromName(event.params.name, event.block.timestamp)
  const address = event.params.addr.toHex()

  forum.address = address
  forum.save()
}

export function handlePromoted(event: ModeratorPromoted): void {
  const forum = getOrCreateForumFromName(event.params.name, event.block.timestamp)
  const moderator = event.params.moderator.toHex()

  const mods = forum.mods
  mods.push(moderator)

  forum.mods = mods
  forum.save()
}

export function handleUnpromoted(event: ModeratorUnpromoted): void {
  const forum = getOrCreateForumFromName(event.params.name, event.block.timestamp)
  const moderator = event.params.moderator.toHex()

  const mods = forum.mods
  const mods2 = new Array<string>(mods.length)

  for (let i = 0; i < mods.length; i++)
    if (mods[i] !== moderator)
      mods2.push(mods[i])

  forum.mods = mods2
  forum.save()
}
