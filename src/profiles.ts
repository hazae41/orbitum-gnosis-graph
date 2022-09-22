import { AvatarChanged, DescriptionChanged, NicknameChanged } from "../generated/Profiles/Profiles"
import { getOrCreateProfileFromAddress } from "./entities/profile"

export function handleNickname(event: NicknameChanged): void {
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex(), event.block.timestamp)
  const nickname = event.params.nickname

  profile.nickname = nickname

  profile.save()
}

export function handleAvatar(event: AvatarChanged): void {
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex(), event.block.timestamp)
  const avatar = event.params.avatar

  profile.avatar = avatar

  profile.save()
}

export function handleDescription(event: DescriptionChanged): void {
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex(), event.block.timestamp)
  const description = event.params.description

  profile.description = description

  profile.save()
}
