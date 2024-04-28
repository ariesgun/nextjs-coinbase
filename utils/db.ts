import { Account, PrismaClient } from "@prisma/client";

export async function get() {
  const prisma = new PrismaClient();

  const allUsers = await prisma.account.findMany();
  const allRecords = await prisma.record.findMany();

  //   console.log(allUsers, allRecords);

  await prisma.$disconnect();
}

export async function addRecord(user, data: any) {
  const account: Account = await findUser(user);

  const prisma = new PrismaClient();

  const record = await prisma.record.create({
    data: {
      ...data,
      accountId: account?.id,
    },
  });

  //   console.log(record);

  await prisma.$disconnect();
}

export async function readRecords(user) {
  const account: Account = await findUser(user);

  const prisma = new PrismaClient();

  //   console.log(account);

  const records = await prisma.record.findMany({
    // where: {
    //   accountId: account.accountId,
    // },
  });

  //   console.log("Records: ", records);

  await prisma.$disconnect();

  return records;
}

export async function updateRecord(user, data: any) {
  const account: Account = await findUser(user);

  const prisma = new PrismaClient();

  const record = await prisma.record.update({
    where: {
      id: data.id,
    },
    data: {
      ...data,
    },
  });

  //   console.log(record);

  await prisma.$disconnect();
}

export async function deleteRecord(user, recordId: any) {
  const account: Account = await findUser(user);

  const prisma = new PrismaClient();

  const deletedRecord = await prisma.record.delete({
    where: {
      id: recordId,
    },
  });

  //   console.log("Deleted: ", deletedRecord);

  await prisma.$disconnect();
}

export async function findUser(user) {
  const prisma = new PrismaClient();
  let result = null;

  const account = await prisma.account.findUnique({
    where: {
      email: user.email,
    },
  });

  if (account === null) {
    const newAccount = await prisma.account.create({
      data: {
        email: user.email,
        accountUId: user.id,
        name: "Account",
      },
    });

    result = newAccount;
  } else {
    result = account;
  }

  await prisma.$disconnect();

  return result;
}
