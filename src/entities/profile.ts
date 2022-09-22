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

  profile.save()

  return profile
}
