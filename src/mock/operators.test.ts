import { describe, expect, it } from 'vitest'
import { mapOperatorDtoToOperator } from '@entities/operator/api/mappers'
import { mockOperators } from './operators'

describe('mock operator avatars', () => {
  it('keeps inline svg avatars and null-avatar initials fallback data', () => {
    const operatorWithAvatar = mockOperators.find((operator) =>
      operator.avatar_url?.startsWith('data:image/svg+xml;utf8,'),
    )
    const operatorWithoutAvatar = mockOperators.find((operator) => operator.avatar_url === null)

    expect(operatorWithAvatar).toBeDefined()
    expect(operatorWithoutAvatar).toBeDefined()
    expect(decodeURIComponent(operatorWithAvatar?.avatar_url ?? '')).toContain('<svg')

    const mappedOperator = mapOperatorDtoToOperator(operatorWithoutAvatar!)
    expect(mappedOperator.avatarUrl).toBe('')
    expect(mappedOperator.initials).toMatch(/^[A-Z]{2}$/)
  })
})
