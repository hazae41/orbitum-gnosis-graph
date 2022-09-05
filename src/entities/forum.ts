import { Forum } from "../../generated/schema"

export function getOrCreateForumFromName(name: string): Forum {
  let forum = Forum.load(name)
  if (forum) return forum

  forum = new Forum(name)

  forum.name = name
  forum.mods = []

  forum.save()

  return forum
}
