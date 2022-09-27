import { BigInt } from "@graphprotocol/graph-ts"
import { Profile } from "../../generated/schema"

export function getOrCreateProfileFromAddress(address: string, time: BigInt): Profile {
  let profile = Profile.load(address)
  if (profile) return profile

  profile = new Profile(address)

  profile.address = address
  profile.count = 0
  profile.hcount = 0
  profile.created = time
  profile.updated = time
  profile.badged = false
  profile.random = false

  profile.save()

  return profile
}

export function notify(profile: Profile, notification: string): void {
  const notifications = profile.notifications

  notifications.push(notification)

  profile.notifications = notifications
  profile.save()
}