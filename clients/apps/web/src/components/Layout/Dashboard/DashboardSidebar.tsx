import { NotificationsPopover } from '@/components/Notifications/NotificationsPopover'
import { CONFIG } from '@/utils/config'
import { Logout, TuneOutlined } from '@mui/icons-material'
import { schemas } from '@polar-sh/client'
import Avatar from '@polar-sh/ui/components/atoms/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@polar-sh/ui/components/atoms/DropdownMenu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@polar-sh/ui/components/atoms/Sidebar'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { BrandingMenu } from '../Public/BrandingMenu'
import {
  AccountNavigation,
  OrganizationNavigation,
} from './DashboardNavigation'

export const DashboardSidebar = ({
  type = 'organization',
  organization,
  organizations,
}: {
  type?: 'organization' | 'account'
  organization: schemas['Organization']
  organizations: schemas['Organization'][]
}) => {
  const router = useRouter()
  const { state } = useSidebar()

  const isCollapsed = state === 'collapsed'

  const navigateToOrganization = (org: schemas['Organization']) => {
    router.push(`/dashboard/${org.slug}`)
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader
        className={twMerge(
          'flex md:pt-3.5',
          CONFIG.IS_SANDBOX ? 'md:pt-10' : '',
          isCollapsed
            ? 'flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start'
            : 'flex-row items-center justify-between',
        )}
      >
        <BrandingMenu size={32} />
        <motion.div
          key={isCollapsed ? 'header-collapsed' : 'header-expanded'}
          className={`flex ${isCollapsed ? 'flex-row md:flex-col-reverse' : 'flex-row'} items-center gap-2`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <NotificationsPopover />
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="gap-4 px-2 py-4">
        <motion.div
          key={isCollapsed ? 'nav-collapsed' : 'nav-expanded'}
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {type === 'account' && <AccountNavigation />}
          {type === 'organization' && (
            <OrganizationNavigation organization={organization} />
          )}
        </motion.div>
      </SidebarContent>
      <SidebarFooter>
        {type === 'organization' && (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Avatar
                      name={organization?.name}
                      avatar_url={organization?.avatar_url}
                      className="h-6 w-6"
                    />
                    {!isCollapsed && (
                      <>
                        <span className="min-w-0 truncate">
                          {organization?.name}
                        </span>
                        <ChevronDown className="ml-auto" />
                      </>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align={isCollapsed ? 'start' : 'center'}
                  className="w-[--radix-popper-anchor-width] min-w-[200px]"
                >
                  <DropdownMenuItem
                    className="group"
                    onClick={() =>
                      router.push(`/dashboard/${organization?.slug}/settings`)
                    }
                  >
                    <TuneOutlined className="h-5 w-5 text-gray-500 group-hover:text-white" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="group"
                    onClick={() =>
                      router.push(`${CONFIG.BASE_URL}/v1/auth/logout`)
                    }
                  >
                    <Logout className="h-5 w-5 text-gray-500 group-hover:text-white" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
