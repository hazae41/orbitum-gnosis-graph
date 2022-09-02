import { Profile } from "../../generated/schema"

export function getProfileFromAddress(address: string): Profile {
  let profile = Profile.load(address)
  if (profile) return profile

  profile = new Profile(address)

  profile.address = address

  profile.save()

  return profile
}
