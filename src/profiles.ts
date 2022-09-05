import { Avatar, Description, Nickname } from "../generated/Profiles/Profiles"
import { getOrCreateProfileFromAddress } from "./entities/profile"

export function handleNickname(event: Nickname): void {
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex())

  profile.nickname = event.params.nickname
  profile.save()
}

export function handleAvatar(event: Avatar): void {
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex())

  profile.avatar = event.params.avatar
  profile.save()
}

export function handleDescription(event: Description): void {
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex())

  profile.description = event.params.description
  profile.save()
}
