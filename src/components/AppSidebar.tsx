import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Bot, Info, Lightbulb } from "lucide-react"

const menuItems = [
  {
    title: "Scarlett AI",
    icon: Bot,
    url: "#",
  },
  {
    title: "About",
    icon: Info,
    url: "#",
  },
  {
    title: "NMA",
    icon: Lightbulb,
    url: "#",
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="bg-gradient-to-b from-orange-900 to-orange-800 border-r border-orange-700">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-200 font-semibold text-lg px-4 py-4">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="text-orange-100 hover:bg-orange-800 hover:text-white transition-colors duration-200 mx-2 rounded-lg"
                  >
                    <a href={item.url} className="flex items-center gap-3 px-4 py-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}