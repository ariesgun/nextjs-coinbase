import { readRecords } from "../db";
import { createClient } from "../supabase/server";

export default async function getRecords() {
  let result = [];

  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    throw new Error("User not authenticated: " + error);
  } else {
    if (!data?.user?.email || !data?.user?.id) {
      //   throw new Error("User email or id is undefined");
    }

    await readRecords(data?.user)
      .then((res) => {
        if (!res.ok) {
          console.error(res.statusText);
        }
        result = res;
      })
      .catch((error) => {
        console.error("Error ", error);
      });

    return result;
  }
}
