import { BigInt } from "@graphprotocol/graph-ts"
import { Seen } from "../generated/Notifs/Notifs"
import { AvatarChanged, BadgedChanged, DescriptionChanged, NicknameChanged, RandomChanged } from "../generated/Profiles/Profiles"
import { getOrCreateProfileFromAddress } from "./entities/profile"

export function handleNickname(event: NicknameChanged): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex(), time)
  const nickname = event.params.nickname

  profile.nickname = nickname

  profile.save()
}

export function handleAvatar(event: AvatarChanged): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex(), time)
  const avatar = event.params.avatar

  profile.avatar = avatar

  profile.save()
}

export function handleDescription(event: DescriptionChanged): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex(), time)
  const description = event.params.description

  profile.description = description

  profile.save()
}

export function handleBadged(event: BadgedChanged): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex(), time)
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

export function handleSeen(event: Seen): void {
  const time = event.block.timestamp.times(BigInt.fromU32(1000))
  const profile = getOrCreateProfileFromAddress(event.params.id.toHex(), time)

  profile.seen = time

  profile.save()
}
