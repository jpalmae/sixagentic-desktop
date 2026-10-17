import { cn } from '@/lib/utils'

/* SixAgentic Desktop rebrand — the badge is now a CSS-only SixManager-style mark:
 * sharp square, thin border, electric-blue "SIX" in monospace on the
 * #050713 base. No image asset, theme-independent (the brand palette is
 * dark by definition). Size via className (default size-14). */
export function BrandMark({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn('inline-flex size-14 shrink-0 items-center justify-center', className)}
      style={{
        backgroundColor: '#050713',
        border: '1px solid rgba(255,255,255,0.22)',
        color: '#7FC4FF',
        fontFamily: '"DM Mono", "JetBrains Mono", ui-monospace, monospace',
        fontSize: '0.8em',
        letterSpacing: '0.18em'
      }}
      {...props}
    >
      SIX
    </span>
  )
}
