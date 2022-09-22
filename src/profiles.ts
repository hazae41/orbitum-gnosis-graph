import { AvatarChanged, BadgedChanged, DescriptionChanged, NicknameChanged, RandomChanged } from "../generated/Profiles/Profiles"
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

export function handleBadged(event: BadgedChanged): void {
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex(), event.block.timestamp)
  const badged = event.params.badged

  profile.badged = badged

  profile.save()
}

export function handleRandom(event: RandomChanged): void {
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex(), event.block.timestamp)
  const random = event.params.random

  profile.random = random

  profile.save()
}
