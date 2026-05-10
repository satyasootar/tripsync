import { useEffect, useState, useCallback, type FormEvent } from "react";
import api from "@/lib/axios";
import type { TripMember, Invite, ApiResponse } from "@/lib/types";
import { toast } from "sonner";
import { Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roleBadgeVariant: Record<string, string> = {
  OWNER: "default",
  EDITOR: "secondary",
  VIEWER: "outline",
};

interface MembersTabProps {
  tripId: string;
}

const tabCache: Record<string, { members: TripMember[]; invites: Invite[] }> = {};

export function MembersTab({ tripId }: MembersTabProps) {
  const [members, setMembers] = useState<TripMember[]>(tabCache[tripId]?.members || []);
  const [invites, setInvites] = useState<Invite[]>(tabCache[tripId]?.invites || []);
  const [isLoading, setIsLoading] = useState(!tabCache[tripId]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Invite form
  const [invEmail, setInvEmail] = useState("");
  const [invRole, setInvRole] = useState("VIEWER");

  const loadData = useCallback(async () => {
    try {
      const [memRes, invRes] = await Promise.all([
        api.get<ApiResponse<TripMember[]>>(`/members/trip/${tripId}`),
        api.get<ApiResponse<Invite[]>>(`/invites/trip/${tripId}`),
      ]);
      const memData = memRes.data.data;
      const invData = invRes.data.data;
      tabCache[tripId] = { members: memData, invites: invData };
      setMembers(memData);
      setInvites(invData);
    } catch {
      toast.error("Failed to load members");
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const previousInvites = [...invites];
    const newEmail = invEmail;
    const newRole = invRole as any;

    setInvites((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, tripId, email: newEmail, role: newRole, status: "PENDING", token: "", expiresAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), inviterId: "" } as any
    ]);

    setDialogOpen(false);
    setInvEmail("");
    setInvRole("VIEWER");

    try {
      await api.post("/invites", {
        tripId,
        email: newEmail,
        role: newRole,
      });
      toast.success(`Invite sent to ${newEmail}`);
      loadData();
    } catch (error: any) {
      setInvites(previousInvites);
      toast.error(error.response?.data?.message || "Failed to send invite");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Card>
          <CardContent className="flex flex-col gap-1 pt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                {i > 0 && <Separator className="my-1" />}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingInvites = invites.filter((i) => i.status === "PENDING");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Members ({members.length})</h3>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="mr-1 size-3.5" />Invite</Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-1 pt-4">
          {members.map((member, idx) => {
            const name = member.user
              ? `${member.user.firstName} ${member.user.lastName}`
              : "Unknown";
            const initials = member.user
              ? `${member.user.firstName[0]}${member.user.lastName[0]}`
              : "?";

            return (
              <div key={member.id}>
                {idx > 0 && <Separator className="my-1" />}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">{member.user?.email}</p>
                    </div>
                  </div>
                  <Badge variant={roleBadgeVariant[member.role] as any}>
                    {member.role.toLowerCase()}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <>
          <h3 className="font-medium">Pending Invites ({pendingInvites.length})</h3>
          <Card>
            <CardContent className="flex flex-col gap-1 pt-4">
              {pendingInvites.map((invite, idx) => (
                <div key={invite.id}>
                  {idx > 0 && <Separator className="my-1" />}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs"><Mail className="size-3.5" /></AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{invite.email}</p>
                        <p className="text-xs text-muted-foreground">Invite pending</p>
                      </div>
                    </div>
                    <Badge variant="outline">{invite.role.toLowerCase()}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {/* Invite Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite a member</DialogTitle>
            <DialogDescription>Send an invitation by email.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Email address</Label>
              <Input
                type="email"
                value={invEmail}
                onChange={(e) => setInvEmail(e.target.value)}
                placeholder="friend@example.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Select value={invRole} onValueChange={setInvRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="VIEWER">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send Invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
