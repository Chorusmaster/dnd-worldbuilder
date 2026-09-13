"use client";
import { logoutAction } from "@/features/auth/auth.actions";
import { useState } from "react";

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
  SidebarGroupLabel
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
} from "lucide-react";

import type { PublicUserRecord } from "@/features/auth/auth.repository";
import { PublicWorldRecord } from "@/features/world/world.repository";

import { useDashboard } from "@/app/dashboard/dashboard-context";

type MainSidebarProps = {
  user: PublicUserRecord;
  worlds: PublicWorldRecord[];
  deleteWorld: (id: string) => void;
};

export default function MainSidebar({ user, worlds, deleteWorld }: MainSidebarProps) {

  const dashboardContext = useDashboard();

  return (
    <div>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <WorldSwitcher worlds={worlds} deleteWorld={deleteWorld} />
          </SidebarHeader>

          {dashboardContext.activeWorld &&
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                World
              </SidebarGroupLabel>

              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Overview"
                    className="h-9 gap-3 px-3 text-sm"
                  >
                    <LayoutDashboard className="size-4" />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Map"
                    className="h-9 gap-3 px-3 text-sm"
                  >
                    <Map className="size-4" />
                    <span>Maps</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Entities
              </SidebarGroupLabel>

              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Characters"
                    className="h-9 gap-3 px-3 text-sm"
                  >
                    <Users className="size-4" />
                    <span>Characters</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Locations"
                    className="h-9 gap-3 px-3 text-sm"
                  >
                    <MapPin className="size-4" />
                    <span>Locations</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Factions"
                    className="h-9 gap-3 px-3 text-sm"
                  >
                    <Shield className="size-4" />
                    <span>Factions</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Items"
                    className="h-9 gap-3 px-3 text-sm"
                  >
                    <Sword className="size-4" />
                    <span>Items</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Creatures"
                    className="h-9 gap-3 px-3 text-sm"
                  >
                    <Bug className="size-4" />
                    <span>Creatures</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Campaign
              </SidebarGroupLabel>

              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Quests"
                    className="h-9 gap-3 px-3 text-sm"
                  >
                    <ScrollText className="size-4" />
                    <span>Quests</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Events"
                    className="h-9 gap-3 px-3 text-sm"
                  >
                    <Calendar className="size-4" />
                    <span>Events</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Notes"
                    className="h-9 gap-3 px-3 text-sm"
                  >
                    <NotebookPen className="size-4" />
                    <span>Notes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>}

          <SidebarFooter>
            <NavUser user={user} />
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

function WorldSwitcher({
  worlds,
  deleteWorld
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
                <img src={dashboardContext.activeWorld.image} className="size-4" />
              ) : (
                <Earth className="size-4" />
              )}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{dashboardContext.activeWorld.name}</span>
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
                        <img
                          src={world.image}
                          className="size-3.5 shrink-0"
                        />
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
              <DropdownMenuItem onClick={logoutAction}>
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
