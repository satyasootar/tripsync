import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Plane, Settings, LogOut, Mail } from "lucide-react";
import { LogoWithText } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { title: "My Trips", href: "/dashboard", icon: Plane },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [invites, setInvites] = useState<any[]>([]);
  const [isLoadingInvites, setIsLoadingInvites] = useState(true);

  useEffect(() => {
    if (user) {
      api.get("/invites/my")
        .then((res) => {
          setInvites(res.data.data);
          setIsLoadingInvites(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoadingInvites(false);
        });
    } else {
      setIsLoadingInvites(false);
    }
  }, [user]);

  const handleRespond = async (id: string, accept: boolean) => {
    try {
      await api.post(`/invites/${id}/respond`, { accept });
      toast.success(accept ? "Invite accepted!" : "Invite declined");
      setInvites((prev) => prev.filter((i) => i.id !== id));
      if (accept) {
        navigate("/dashboard", { replace: true });
        window.location.reload();
      }
    } catch {
      toast.error("Failed to respond to invite");
    }
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "?";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link to="/dashboard" className="flex items-center gap-2 px-2 py-3">
            <LogoWithText size="sm" />
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.href}
                    >
                      <Link to={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {isLoadingInvites ? (
            <SidebarGroup>
              <SidebarGroupLabel>Pending Invites</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <div className="flex flex-col gap-2 rounded-md border bg-muted/30 p-2 mx-2 my-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="flex items-center gap-2 mt-1">
                        <Skeleton className="h-7 w-full" />
                        <Skeleton className="h-7 w-full" />
                      </div>
                    </div>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : invites.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-orange-500">Pending Invites ({invites.length})</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {invites.map((inv) => (
                    <SidebarMenuItem key={inv.id}>
                      <div className="flex flex-col gap-2 rounded-md border bg-muted/30 p-2 text-sm shadow-sm mx-2 my-1">
                        <div className="font-medium">{inv.trip?.title}</div>
                        <div className="text-xs text-muted-foreground">
                          From: {inv.inviter?.firstName} {inv.inviter?.lastName}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Button size="sm" variant="default" className="h-7 text-xs flex-1" onClick={() => handleRespond(inv.id, true)}>
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs flex-1" onClick={() => handleRespond(inv.id, false)}>
                            Decline
                          </Button>
                        </div>
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-auto py-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left text-xs leading-tight">
                      <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                      <span className="text-muted-foreground">{user?.email}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm text-muted-foreground">
            {navItems.find((n) => location.pathname.startsWith(n.href))?.title || "TripSync"}
          </span>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
