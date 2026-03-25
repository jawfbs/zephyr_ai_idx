'use client'
import { useUser, useClerk } from '@clerk/nextjs'
import { useEffect } from 'react'

// Maps a Clerk user object to the ZephyrAI user shape
export function mapClerkUser(clerkUser) {
  if (!clerkUser) return null
  const meta = clerkUser.publicMetadata || clerkUser.unsafeMetadata || {}
  return {
    id:        clerkUser.id,
    email:     clerkUser.primaryEmailAddress?.emailAddress || '',
    firstName: clerkUser.firstName || '',
    lastName:  clerkUser.lastName  || '',
    level:     meta.level     || 'homebuyer',
    mlsId:     meta.mlsId     || '',
    verified:  meta.verified  || false,
    imageUrl:  clerkUser.imageUrl || null,
  }
}

// Hook — use inside ZephyrPage to get current user
export function useZephyrUser() {
  const { user, isLoaded, isSignedIn } = useUser()
  if (!isLoaded) return { user: null, isLoaded: false, isSignedIn: false }
  return {
    user:       isSignedIn ? mapClerkUser(user) : null,
    isLoaded,
    isSignedIn: !!isSignedIn,
    clerkUser:  user,
  }
}

// Hook — update user level/metadata after registration
export function useSetUserLevel() {
  const { user } = useUser()

  const setLevel = async (level, extraMeta = {}) => {
    if (!user) return
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          level,
          ...extraMeta,
        },
      })
    } catch (err) {
      console.error('Failed to set user level:', err)
    }
  }

  return { setLevel }
}
