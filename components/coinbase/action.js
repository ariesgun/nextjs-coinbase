"use server";

import { addRecord, deleteRecord, updateRecord } from "@/utils/db";
import { createClient } from "@/utils/supabase/server";

export async function createRecord(prevState, formData) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    throw new Error("User not authenticated");
  } else {
    const record = {
      asset: formData.get("asset"),
      amount: parseFloat(formData.get("amount")),
      timestamp: new Date(formData.get("timestamp")),
      action: formData.get("action").toUpperCase(),
    };

    console.log("Data", record);

    await addRecord(data.user, record);

    return prevState + 1;
  }
}

export async function onDeleteRecord(prevState, formData) {
  console.log("Hello2");
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    throw new Error("User not authenticated");
  } else {
    const recordId = parseInt(formData.get("id"));

    await deleteRecord(data.user, recordId);

    return prevState + 1;
  }
}

export async function onEditRecord(prevState, formData) {
  console.log("Edit");
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    throw new Error("User not authenticated");
  } else {
    const record = {
      id: parseInt(formData.get("id")),
      asset: formData.get("asset"),
      amount: parseFloat(formData.get("amount")),
      timestamp: new Date(formData.get("timestamp")),
      action: formData.get("action").toUpperCase(),
    };

    console.log("Update---", record, prevState);

    await updateRecord(data.user, record);

    return prevState + 1;
  }
}
