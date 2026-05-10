import { Checklist, ChecklistItem, Prisma } from "@prisma/client";
import { checklistsRepository, ChecklistsRepository } from "../repository/checklists.repository";
import { tripsRepository, TripsRepository } from "@/modules/trips/repository/trips.repository";
import { NotFoundError, AuthorizationError } from "@/common/errors";

export class ChecklistsService {
  constructor(
    private readonly repository: ChecklistsRepository = checklistsRepository,
    private readonly tripRepo: TripsRepository = tripsRepository
  ) {}

  private async validateTripAccess(tripId: string, userId: string) {
    const trip = await this.tripRepo.findById(tripId);
    if (!trip) throw new NotFoundError("Trip");

    const isMember = (trip as any).members.some((m: any) => m.userId === userId);
    if (!isMember) throw new AuthorizationError("You are not a member of this trip");
  }

  async getChecklists(tripId: string, userId: string) {
    await this.validateTripAccess(tripId, userId);
    return this.repository.findByTripId(tripId);
  }

  async createChecklist(userId: string, data: any) {
    await this.validateTripAccess(data.tripId, userId);
    return this.repository.create(data);
  }

  async updateChecklist(id: string, userId: string, data: Prisma.ChecklistUpdateInput) {
    const checklist = await this.repository.findById(id);
    if (!checklist) throw new NotFoundError("Checklist");
    await this.validateTripAccess(checklist.tripId, userId);

    return this.repository.update(id, data);
  }

  async deleteChecklist(id: string, userId: string) {
    const checklist = await this.repository.findById(id);
    if (!checklist) throw new NotFoundError("Checklist");
    await this.validateTripAccess(checklist.tripId, userId);

    return this.repository.delete(id);
  }

  // Items
  async createItem(checklistId: string, userId: string, data: any) {
    const checklist = await this.repository.findById(checklistId);
    if (!checklist) throw new NotFoundError("Checklist");
    await this.validateTripAccess(checklist.tripId, userId);

    if (data.position === undefined) {
      data.position = await this.repository.countItemsByChecklistId(checklistId);
    }

    return this.repository.createItem({
      ...data,
      checklistId,
    });
  }

  async updateItem(id: string, userId: string, data: Prisma.ChecklistItemUpdateInput) {
    const item = await this.repository.findItemById(id);
    if (!item) throw new NotFoundError("Checklist Item");
    await this.validateTripAccess((item as any).checklist.tripId, userId);

    return this.repository.updateItem(id, data);
  }

  async deleteItem(id: string, userId: string) {
    const item = await this.repository.findItemById(id);
    if (!item) throw new NotFoundError("Checklist Item");
    await this.validateTripAccess((item as any).checklist.tripId, userId);

    return this.repository.deleteItem(id);
  }

  async reorderItems(checklistId: string, userId: string, items: { id: string; position: number }[]) {
    const checklist = await this.repository.findById(checklistId);
    if (!checklist) throw new NotFoundError("Checklist");
    await this.validateTripAccess(checklist.tripId, userId);

    await this.repository.updateItemPositions(items);
    return this.repository.findById(checklistId);
  }
}

export const checklistsService = new ChecklistsService();
