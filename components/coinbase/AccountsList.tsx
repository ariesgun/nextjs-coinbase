import { Card, CardBody, Skeleton } from "@nextui-org/react";

interface Account {
  name: string;
  uuid: string;
}

export async function AccountsList() {
  let accounts: Account[] = [];
  await fetch(process.env.URL + "/api/accounts", { method: "GET" })
    .then((res) => res.json())
    .then((data) => {
      accounts = data.result.portfolios;
    });

  return (
    <>
      <h4 className="text-large font-medium">Accounts</h4>
      {accounts.length > 0 ? (
        <div className="flex flex-col gap-3 my-4">
          <div className="grid grid-cols-4 gap-4 w-full">
            {accounts ? (
              accounts.map((account) => {
                return (
                  <Card key={account.uuid} className="py-3" isPressable>
                    <CardBody className="px-4">
                      <p className="text-md">{account.name}</p>
                      <p className="text-bold text-tiny text-default-400">
                        {account.uuid}
                      </p>
                    </CardBody>
                  </Card>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 my-4">
            <Skeleton className="h-40 w-80 rounded-lg" />
          </div>
        </>
      )}
    </>
  );
}
