import { Bytes } from "@graphprotocol/graph-ts"
import {
  Avatar, Description, NSFW, Ownership,
  Promoted, Unpromoted
} from "../generated/Forums/Forums"
import { getOrCreateForumFromName } from "./entities/forum"

export function handleAvatar(event: Avatar): void {
  const forum = getOrCreateForumFromName(event.params.name)

  forum.avatar = event.params.avatar
  forum.save()
}

export function handleDescription(event: Description): void {
  const forum = getOrCreateForumFromName(event.params.name)

  forum.description = event.params.description
  forum.save()
}

export function handleNSFW(event: NSFW): void {
  const forum = getOrCreateForumFromName(event.params.name)

  forum.nsfw = event.params.nsfw
  forum.save()
}

export function handleOwnership(event: Ownership): void {
  const forum = getOrCreateForumFromName(event.params.name)

  forum.owner = event.params.owner
  forum.save()
}

export function handlePromoted(event: Promoted): void {
  const forum = getOrCreateForumFromName(event.params.name)

  const mods = forum.mods

  mods.push(event.params.moderator)

  forum.mods = mods
  forum.save()
}

export function handleUnpromoted(event: Unpromoted): void {
  const forum = getOrCreateForumFromName(event.params.name)
  const moderator = event.params.moderator.toHex()

  const mods = forum.mods
  const filtered = new Array<Bytes>()

  for (let i = 0; i < mods.length; i++)
    if (mods[i].toHex() !== moderator)
      filtered.push(mods[i])

  forum.mods = filtered
  forum.save()
}
