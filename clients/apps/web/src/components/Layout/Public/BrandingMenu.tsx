'use client'

import LogoIcon from '@/components/Brand/LogoIcon'
import LogoType from '@/components/Brand/LogoType'
import { useOutsideClick } from '@/utils/useOutsideClick'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@polar-sh/ui/components/ui/dropdown-menu'
import Link from 'next/link'
import { MouseEventHandler, useCallback, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export const BrandingMenu = ({
  logoVariant = 'icon',
  size,
  className,
  logoClassName,
}: {
  logoVariant?: 'icon' | 'logotype'
  size?: number
  className?: string
  logoClassName?: string
}) => {
  const brandingMenuRef = useRef<HTMLDivElement>(null)

  useOutsideClick([brandingMenuRef], () => setBrandingMenuOpen(false))

  const [brandingMenuOpen, setBrandingMenuOpen] = useState(false)

  const handleTriggerClick: MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setBrandingMenuOpen(true)
    },
    [],
  )

  // const handleCopyLogoToClipboard = useCallback(() => {
  //   navigator.clipboard.writeText(
  //     logoVariant === 'icon' ? PolarIconSVGString : PolarLogoSVGString,
  //   )
  //   setBrandingMenuOpen(false)
  // }, [logoVariant])

  return (
    <div className={twMerge('relative flex flex-row items-center', className)}>
      <DropdownMenu open={brandingMenuOpen}>
        <DropdownMenuTrigger asChild onContextMenu={handleTriggerClick}>
          <Link href="/">
            {logoVariant === 'logotype' ? (
              <LogoType
                className={twMerge(
                  '-ml-2 text-black md:ml-0 dark:text-white',
                  logoClassName,
                )}
                width={size ?? 100}
              />
            ) : (
              <LogoIcon
                className={twMerge('text-black dark:text-white', logoClassName)}
                size={size ?? 42}
              />
            )}
          </Link>
        </DropdownMenuTrigger>
        {/* <DropdownMenuContent ref={brandingMenuRef} align="start">
          <DropdownMenuLabel>Platform</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex flex-row gap-x-3"
            onClick={handleCopyLogoToClipboard}
          >
            <Clipboard className="h-3 w-3" />
            <span>Copy Logo as SVG</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex flex-row gap-x-3"
            onClick={() => setBrandingMenuOpen(false)}
          >
            <ArrowDown className="h-3 w-3" />
            <Link href="/assets/brand/polar_brand.zip">
              Download Branding Assets
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent> */}
      </DropdownMenu>
    </div>
  )
}
