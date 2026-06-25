import type { LeaderboardEntry, MemberProfile } from '~/types/member'

export function useMember() {
  const { apiFetch } = useApi()

  const fetchMe = () => apiFetch<MemberProfile>('/members/me')
  const fetchProfile = (username: string) => apiFetch<MemberProfile>(`/members/${username}`)
  const fetchLeaderboard = (limit = 20) =>
    apiFetch<LeaderboardEntry[]>('/members/leaderboard', { query: { limit } })

  const updateProfile = (body: {
    nickname?: string
    bio?: string
    avatar?: string
    expertiseTags?: string[]
  }) => apiFetch<MemberProfile>('/members/me', { method: 'PUT', body })

  const uploadAvatar = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiFetch<MemberProfile>('/members/me/avatar', {
      method: 'POST',
      body: formData,
    })
  }

  return { fetchMe, fetchProfile, fetchLeaderboard, updateProfile, uploadAvatar }
}
