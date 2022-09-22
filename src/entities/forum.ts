import { BigInt } from "@graphprotocol/graph-ts"
import { Forum } from "../../generated/schema"

export function getOrCreateForumFromName(name: string, time: BigInt): Forum {
  let forum = Forum.load(name)
  if (forum) return forum

  forum = new Forum(name)

  forum.name = name
  forum.nsfw = false
  forum.mods = []
  forum.count = 0
  forum.hcount = 0
  forum.created = time
  forum.updated = time

  forum.save()

  return forum
}
