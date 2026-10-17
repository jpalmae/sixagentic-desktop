import { useStore } from '@nanostores/react'

import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import { $activeGatewayProfile, $profiles, normalizeProfileKey, profileLabel } from '@/store/profile'
import type { ProfileInfo } from '@/types/hermes'

// Settings-chip label: the Bot Mode title the Bots roster shows when set
// (ui_meta['hermes-bots'].title), else the app-wide profileLabel
// (display_name → slug).
export function settingsScopeLabel(profile: Pick<ProfileInfo, 'bot_title' | 'display_name' | 'name'>): string {
  return (profile.bot_title ?? '').trim() || profileLabel(profile)
}

/** Shared "Applies to" profile selector for the config-backed settings pages
 *  (Model, Workspace, Safety, Memory & Context, Voice, Tools & Keys), Custom
 *  Endpoints, and the Messaging overlay.
 *
 *  Hidden: the desktop app runs the default profile only, so there is nothing
 *  to pick. The settings-scope store ($settingsScopeOverride) stays live —
 *  plugin settings deep links still scope edits through it — and every request
 *  keeps its unscoped default shape. */
export function SettingsProfileScope({ className }: { className?: string }) {
  void className

  return null
}

/** Read-only note for Providers pages whose requests carry no settings-scope
 *  override and so always edit the app's ACTIVE profile (Local Models — the
 *  managed llama.cpp runtime is machine-scoped). Same string as the selector's
 *  note above; hidden with fewer than two profiles like the selector itself. */
export function ActiveProfileNote({ className }: { className?: string }) {
  const { t } = useI18n()
  const active = useStore($activeGatewayProfile)
  const profiles = useStore($profiles)

  if (profiles.length < 2) {
    return null
  }

  const key = normalizeProfileKey(active)
  const profile = profiles.find(candidate => normalizeProfileKey(candidate.name) === key)

  return (
    <p
      className={cn(
        'text-[length:var(--conversation-caption-font-size)] leading-(--conversation-caption-line-height) text-(--ui-text-tertiary)',
        className
      )}
      role="status"
    >
      {t.settings.profileScope.editsProfile(profile ? settingsScopeLabel(profile) : key)}
    </p>
  )
}
