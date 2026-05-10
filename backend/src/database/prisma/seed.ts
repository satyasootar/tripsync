import { PrismaClient, MemberRole, ActivityStatus, ChecklistType, SplitType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean up existing data (optional, but good for a fresh start)
  console.log('Cleaning up existing data...');
  await prisma.expenseParticipant.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.checklist.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.day.deleteMany();
  await prisma.tripMember.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('Creating users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const alice = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: passwordHash,
      avatarUrl: 'https://i.pravatar.cc/150?u=alice',
    },
  });

  const bob = await prisma.user.create({
    data: {
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@example.com',
      password: passwordHash,
      avatarUrl: 'https://i.pravatar.cc/150?u=bob',
    },
  });

  const charlie = await prisma.user.create({
    data: {
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie@example.com',
      password: passwordHash,
      avatarUrl: 'https://i.pravatar.cc/150?u=charlie',
    },
  });

  // Create Trip
  console.log('Creating trip...');
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 10); // 10 days from now
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 5); // 5 days long

  const trip = await prisma.trip.create({
    data: {
      title: 'Paris Getaway',
      description: 'A fun trip to Paris with friends!',
      destination: 'Paris, France',
      startDate,
      endDate,
      ownerId: alice.id,
      visibility: 'SHARED',
    },
  });

  // Create Trip Members
  // Note: Trip creation automatically creates the owner as a member, but we'll add the others
  // Wait, our service creates the owner member, but directly using Prisma here doesn't.
  // So we must manually create all members.
  console.log('Adding members...');
  await prisma.tripMember.createMany({
    data: [
      { tripId: trip.id, userId: alice.id, role: MemberRole.OWNER },
      { tripId: trip.id, userId: bob.id, role: MemberRole.EDITOR },
      { tripId: trip.id, userId: charlie.id, role: MemberRole.VIEWER },
    ],
  });

  // Create Days
  console.log('Creating days...');
  const day1Date = new Date(startDate);
  const day2Date = new Date(startDate);
  day2Date.setDate(day2Date.getDate() + 1);

  const day1 = await prisma.day.create({
    data: { tripId: trip.id, date: day1Date, position: 1 },
  });
  
  const day2 = await prisma.day.create({
    data: { tripId: trip.id, date: day2Date, position: 2 },
  });

  // Create Activities
  console.log('Creating activities...');
  await prisma.activity.create({
    data: {
      dayId: day1.id,
      title: 'Arrival & Check-in',
      description: 'Arrive at CDG and check into the Airbnb in Le Marais.',
      location: 'Le Marais, Paris',
      status: ActivityStatus.CONFIRMED,
      position: 1,
      startTime: new Date(day1Date.setHours(10, 0, 0, 0)),
      endTime: new Date(day1Date.setHours(12, 0, 0, 0)),
    },
  });

  await prisma.activity.create({
    data: {
      dayId: day1.id,
      title: 'Louvre Museum',
      description: 'See the Mona Lisa.',
      location: 'Louvre Museum, Paris',
      status: ActivityStatus.PLANNED,
      position: 2,
      startTime: new Date(day1Date.setHours(14, 0, 0, 0)),
      endTime: new Date(day1Date.setHours(17, 0, 0, 0)),
    },
  });

  await prisma.activity.create({
    data: {
      dayId: day2.id,
      title: 'Eiffel Tower',
      description: 'Climb to the top!',
      location: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
      status: ActivityStatus.PLANNED,
      position: 1,
      startTime: new Date(day2Date.setHours(9, 0, 0, 0)),
      endTime: new Date(day2Date.setHours(12, 0, 0, 0)),
    },
  });

  // Create Checklist
  console.log('Creating checklists...');
  const checklist = await prisma.checklist.create({
    data: {
      tripId: trip.id,
      title: 'Packing List',
      type: ChecklistType.PACKING,
      items: {
        create: [
          { content: 'Passports', isCompleted: false, position: 1, assignedTo: alice.id },
          { content: 'Euros', isCompleted: false, position: 2, assignedTo: bob.id },
          { content: 'Travel Adapters', isCompleted: true, position: 3, assignedTo: charlie.id },
          { content: 'Camera', isCompleted: false, position: 4 },
        ],
      },
    },
  });

  // Create Expense
  console.log('Creating expenses...');
  const expense = await prisma.expense.create({
    data: {
      tripId: trip.id,
      amount: 150.00,
      currency: 'EUR',
      description: 'Dinner at Le Comptoir',
      paidById: alice.id,
      splitType: SplitType.EQUAL,
      participants: {
        create: [
          { userId: alice.id, amount: 50.00 },
          { userId: bob.id, amount: 50.00 },
          { userId: charlie.id, amount: 50.00 },
        ],
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('-------------------------------------------');
  console.log('Test Users (Password for all: password123)');
  console.log(`1. ${alice.email} (Owner)`);
  console.log(`2. ${bob.email} (Editor)`);
  console.log(`3. ${charlie.email} (Viewer)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
