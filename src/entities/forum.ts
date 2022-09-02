import { Forum } from "../../generated/schema"

export function getForumFromName(name: string): Forum {
  let forum = Forum.load(name)
  if (forum) return forum

  forum = new Forum(name)

  forum.name = name

  forum.save()

  return forum
}
