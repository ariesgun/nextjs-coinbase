import { useCoinbase } from "@/lib/coinbase";
import { Card, CardBody } from "@nextui-org/react";

export function AccountsList() {
  const { accounts } = useCoinbase();

  return (
    <div className="flex flex-col gap-3 my-4">
      <h4 className="text-large font-medium">Accounts</h4>
      <div className="grid grid-cols-4 gap-4 w-full">
        {accounts ? (
          accounts.map((account) => {
            return (
              <Card
                key={account.uuid}
                className="py-3"
                isPressable
                onPress={() => console.log("item pressed")}
              >
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
  );
}
