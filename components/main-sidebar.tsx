"use client";
import { logoutAction } from "@/features/auth/auth.actions";
import Link from "next/link";

import {
  useSidebar,
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  ChevronsUpDown,
  LogOut,
  Plus,
  Earth,
  Trash2,
  Bug,
  Calendar,
  LayoutDashboard,
  Map,
  MapPin,
  NotebookPen,
  ScrollText,
  Shield,
  Sword,
  Users,
  Circle,
  User,
} from "lucide-react";

import type { PublicUserRecord } from "@/features/auth/auth.repository";
import { PublicWorldRecord } from "@/features/world/world.repository";

import { useDashboard } from "@/app/dashboard/dashboard-context";
import { usePathname } from "next/navigation";
import { createEntityTypeAction } from "@/features/entity/entity.actions";

import { NewEntityTypeDialog } from "./new-entity-type-dialog";
import { entityIcons } from "@/features/entity/entity.icons";

type MainSidebarProps = {
  user: PublicUserRecord;
  worlds: PublicWorldRecord[];
  deleteWorld: (id: string) => void;
};

export default function MainSidebar({
  user,
  worlds,
  deleteWorld,
}: MainSidebarProps) {
  const dashboardContext = useDashboard();

  const newEntityType = async (data: {
    name: string;
    slug: string;
    icon: keyof typeof entityIcons;
  }) => {
    const extendedData = {
      ...data,
      worldId: dashboardContext.activeWorld?._id.toString(),
    };

    const newType = await createEntityTypeAction(extendedData);

    if (newType) {
      dashboardContext.setEntityTypes((prev) => [...prev, newType]);
    }
  };

  return (
    <div>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <WorldSwitcher worlds={worlds} deleteWorld={deleteWorld} />
          </SidebarHeader>

          {dashboardContext.activeWorld ? (
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>World</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarItem
                    tab="overview"
                    tooltip="Overview"
                    icon={LayoutDashboard}
                  >
                    Overview
                  </SidebarItem>
                  <SidebarItem tab="maps" tooltip="Maps" icon={Map}>
                    Maps
                  </SidebarItem>
                </SidebarMenu>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Entities</SidebarGroupLabel>
                <SidebarMenu>
                  {dashboardContext.entityTypes.map((type) => {
                    const Icon =
                      entityIcons[type.icon as keyof typeof entityIcons] ??
                      Circle;
                    return (
                      <SidebarItem
                        key={type._id}
                        tab={type.slug}
                        tooltip={type.name}
                        icon={Icon}
                      >
                        {type.name}
                      </SidebarItem>
                    );
                  })}
                  <NewEntityTypeDialog onSubmit={newEntityType} />
                </SidebarMenu>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Campaign</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarItem tab="characters" tooltip="Characters" icon={User}>
                    Characters
                  </SidebarItem>
                  <SidebarItem tab="quests" tooltip="Quests" icon={ScrollText}>
                    Quests
                  </SidebarItem>
                  <SidebarItem tab="events" tooltip="Events" icon={Calendar}>
                    Events
                  </SidebarItem>
                  <SidebarItem tab="notes" tooltip="Notes" icon={NotebookPen}>
                    Notes
                  </SidebarItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          ) : (
            <SidebarContent />
          )}

          <SidebarFooter>
            <NavUser user={user} />
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

function SidebarItem({
  tab,
  tooltip,
  icon: Icon,
  children,
}: {
  tab: string;
  tooltip: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === `/dashboard/${tab}`;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={
          <Link
            href={`/dashboard/${tab}`}
            className="h-9 w-full gap-2 px-3 text-sm"
          />
        }
        tooltip={tooltip}
        isActive={active}
      >
        <Icon className="size-4" />
        <span>{children}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function WorldSwitcher({
  worlds,
  deleteWorld,
}: {
  worlds: PublicWorldRecord[];
  deleteWorld: (id: string) => void;
}) {
  const { isMobile } = useSidebar();
  const dashboardContext = useDashboard();

  if (!dashboardContext.activeWorld) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {dashboardContext.activeWorld.image ? (
                <img
                  src={dashboardContext.activeWorld.image}
                  className="size-4"
                />
              ) : (
                <Earth className="size-4" />
              )}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {dashboardContext.activeWorld.name}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Worlds
              </DropdownMenuLabel>
              {worlds.map((world, index) => (
                <DropdownMenuItem
                  key={world.name}
                  onClick={() => dashboardContext.setActiveWorld(world)}
                  className="flex justify-between p-2"
                >
                  <div className="flex gap-2">
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      {world.image ? (
                        <img src={world.image} className="size-3.5 shrink-0" />
                      ) : (
                        <Earth className="size-3.5 shrink-0" />
                      )}
                    </div>
                    {world.name}
                  </div>
                  <button
                    type="button"
                    className="active:text-destructive"
                    aria-label={`Delete ${world.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWorld(world._id);
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => dashboardContext.setCreateWorldOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add world
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function NavUser({
  user,
}: {
  user: {
    nickname: string;
    username: string;
    avatar?: string | null;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar ?? undefined} alt={user.nickname} />
              <AvatarFallback className="rounded-lg">
                {user.nickname.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.nickname}</span>
              <span className="truncate text-xs">@{user.username}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user.avatar ?? undefined}
                      alt={user.nickname}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user.nickname.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.nickname}
                    </span>
                    <span className="truncate text-xs">@{user.username}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => logoutAction()}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
