import { Divider, Link, Button } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/login/actions";

export async function CoinbaseNavbar() {
  const supabase = createClient();
  let authenticated = false;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    authenticated = false;
  } else {
    authenticated = true;
  }

  return (
    <>
      <div className="flex place-content-between items-center">
        <div className="flex h-5 items-center space-x-4 text-small">
          <Link className="text-small" color="foreground" href="#">
            Home
          </Link>
          <Divider orientation="vertical" />
          <Link className="text-small" href="#">
            Coinbase
          </Link>
          <Divider orientation="vertical" />
          <Link className="text-small" color="foreground" href="#">
            About
          </Link>
        </div>
        <div className="space-x-6">
          {!authenticated ? (
            <>
              <Link className="text-small" href="/login">
                Login
              </Link>
              <Button
                className="text-small"
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                isDisabled={true}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <form action={signout}>
              <Button
                className="text-small"
                color="secondary"
                variant="flat"
                type="submit"
              >
                Sign Out
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
