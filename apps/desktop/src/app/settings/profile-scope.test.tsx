// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { atom } from 'nanostores'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ProfileInfo } from '@/types/hermes'

// Keep store/profile's side-effecting imports inert — same seam as
// store/profile.test.ts / profile-tag.test.tsx.
vi.mock('@/store/gateway', () => ({
  $gateway: atom<unknown>(null),
  ensureGatewayForAgent: vi.fn(async () => undefined),
  ensureGatewayForProfile: vi.fn(async () => undefined),
  openGatewayForProfile: vi.fn(async () => undefined)
}))
vi.mock('@/hermes', () => ({
  getProfiles: vi.fn(async () => ({ profiles: [] })),
  setApiRequestProfile: vi.fn()
}))
vi.mock('@/lib/query-client', () => ({ invalidateProfileScopedQueries: vi.fn() }))
vi.mock('@/store/starmap', () => ({ reloadOpenStarmapGraph: vi.fn(), resetStarmapGraph: vi.fn() }))

const { $activeGatewayProfile, $profiles } = await import('@/store/profile')
const { $settingsScopeOverride } = await import('@/store/settings-scope')
const { ActiveProfileNote, SettingsProfileScope } = await import('./profile-scope')

const profile = (name: string, isDefault = false, extra: Partial<ProfileInfo> = {}): ProfileInfo =>
  ({ has_env: false, is_default: isDefault, model: null, name, ...extra }) as ProfileInfo

beforeEach(() => {
  $activeGatewayProfile.set('default')
  $settingsScopeOverride.set(null)
  $profiles.set([])
})

afterEach(cleanup)

describe('SettingsProfileScope', () => {
  // The selector is retired: the desktop app edits the default profile only.
  // The settings-scope store stays live for plugin deep links (covered by
  // store/settings-scope.test.ts), but no page may surface a picker.
  it('never renders, even with several profiles', () => {
    $activeGatewayProfile.set('scout')
    $profiles.set([profile('default', true), profile('coder'), profile('scout')])

    const { container } = render(<SettingsProfileScope />)

    expect(container.textContent).toBe('')
    expect($settingsScopeOverride.get()).toBeNull()
  })
})

// Local Models sends unscoped requests, so it always edits the ACTIVE profile;
// the note must say which one — and stay silent for single-profile users, like
// the selector.
describe('ActiveProfileNote', () => {
  it('names the active profile (by its chip label) only with two or more profiles', () => {
    $activeGatewayProfile.set('setup')
    $profiles.set([profile('default', true)])
    const { container, rerender } = render(<ActiveProfileNote />)
    expect(container.textContent).toBe('')

    $profiles.set([profile('default', true), profile('setup', false, { display_name: 'Setup box' })])
    rerender(<ActiveProfileNote />)
    expect(screen.getByRole('status').textContent).toContain('Setup box')
    expect($settingsScopeOverride.get()).toBeNull()
  })
})
