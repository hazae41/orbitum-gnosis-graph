import { Avatar as AvatarEvent, Description as DescriptionEvent, Nickname as NicknameEvent } from "../generated/Profiles/Profiles"
import { getProfileFromAddress } from "./entities/profile"

export function handleNickname(event: NicknameEvent): void {
  const profile = getProfileFromAddress(event.params.id.toHex())

  profile.nickname = event.params.nickname

  profile.save()
}

export function handleAvatar(event: AvatarEvent): void {
  const profile = getProfileFromAddress(event.params.id.toHex())

  profile.avatar = event.params.avatar

  profile.save()
}

export function handleDescription(event: DescriptionEvent): void {
  const profile = getProfileFromAddress(event.params.id.toHex())

  profile.description = event.params.description

  profile.save()
}
