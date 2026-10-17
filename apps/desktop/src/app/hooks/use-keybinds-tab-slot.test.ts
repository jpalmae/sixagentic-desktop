import { renderHook } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/themes/context', () => ({
  useTheme: () => ({ resolvedMode: 'dark' as const, setMode: () => undefined })
}))

import { useKeybinds } from '@/app/hooks/use-keybinds'
import { findGroup, group, split } from '@/components/pane-shell/tree/model'
import { $activeTreeGroup, $hoveredTreeGroup, $layoutTree } from '@/components/pane-shell/tree/store'
import { registry } from '@/contrib/registry'
import { isMacPlatform } from '@/lib/platform'

// ⌘1…⌘9 activates the Nth tab of the zone under the pointer (else the focused
// zone, else the workspace's) when that zone is a real tab strip. With no
// eligible strip `view.tabSlot.N` declines and the press is a no-op (#92569).

const wrapper = ({ children }: { children: ReactNode }) => createElement(MemoryRouter, null, children)

let unmountKeybinds: (() => void) | undefined

function press(digit: number) {
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      code: `Digit${digit}`,
      ctrlKey: !isMacPlatform(),
      key: String(digit),
      metaKey: isMacPlatform()
    })
  )
}

function activePane(groupId: string) {
  const tree = $layoutTree.get()

  return tree ? findGroup(tree, groupId)?.active : undefined
}

beforeAll(() => {
  for (const id of ['workspace', 'a', 'b']) {
    registry.register({ area: 'panes', data: { placement: 'main' }, id, render: () => null, title: id })
  }
})

beforeEach(() => {
  unmountKeybinds = renderHook(
    () =>
      useKeybinds({
        archiveSelectedSession: () => undefined,
        openNewSessionTab: () => undefined,
        requestGateway: <T>() => Promise.resolve(undefined as T),
        startFreshSession: () => undefined,
        toggleCommandCenter: () => undefined,
        toggleSelectedPin: () => undefined
      }),
    { wrapper }
  ).unmount
})

afterEach(() => {
  unmountKeybinds?.()
  $layoutTree.set(null)
  $activeTreeGroup.set(null)
  $hoveredTreeGroup.set(null)
})

describe('⌘N over a tab strip is a tab switch, elsewhere a no-op', () => {
  it('activates the Nth tab of the hovered zone', () => {
    $layoutTree.set(
      split('row', [
        group(['workspace', 'a'], { active: 'workspace', id: 'left' }),
        group(['b'], { active: 'b', id: 'right' })
      ])
    )
    $activeTreeGroup.set('right')
    $hoveredTreeGroup.set('left')

    press(2)

    expect(activePane('left')).toBe('a')
  })

  it('does nothing when no zone is a tab strip', () => {
    $layoutTree.set(
      split('row', [
        group(['workspace'], { active: 'workspace', id: 'left' }),
        group(['b'], { active: 'b', id: 'right' })
      ])
    )
    $activeTreeGroup.set('right')
    $hoveredTreeGroup.set('right')

    press(2)

    expect(activePane('left')).toBe('workspace')
    expect(activePane('right')).toBe('b')
  })

  it('does nothing when the strip has no Nth tab', () => {
    $layoutTree.set(split('row', [group(['workspace', 'a'], { active: 'workspace', id: 'left' })]))
    $hoveredTreeGroup.set('left')

    press(3)

    expect(activePane('left')).toBe('workspace')
  })
})
