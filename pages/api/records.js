import { getRecords } from "../../utils/db.ts";
import createClient from "../../utils/supabase/api.ts";

export default async function handler(req, res) {
  let result = [];

  const supabase = createClient(req, res);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    // throw new Error("User not authenticated");
  } else {
    if (!data?.user?.email || !data?.user?.id) {
      //   throw new Error("User email or id is undefined");
    }
    await getRecords(data.user)
      .then((res) => {
        if (!res.ok) {
          console.error(res.statusText);
        }
        result = res;
      })
      .catch((error) => {
        console.error("Error ", error);
      });

    res.status(200).json({ result });
  }
}
