"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteWatch(formData) {
  const watchId = formData.get("id");

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    console.error("User is not authenticated within deleteWatch server action");
    return;
  }

  // Fetch the watch entry first to get the image URL
  const { data: watchData, error: fetchError } = await supabase
    .from("watches")
    .select("image_url")
    .eq("id", watchId)
    .eq("user_id", user.id)
    .single(); // Assuming one watch per ID

  if (fetchError) {
    console.error("Error fetching the watch entry", fetchError);
    return;
  }

  const imageUrl = watchData?.image_url;

  // Log image URL for debugging
  console.log("Original Image URL from DB:", imageUrl);
  

  if (imageUrl) {
    const SUPABASE_URL = "https://emhqhoooqhxbbotkenpq.supabase.co";

    const relativeImagePath = imageUrl.replace(
      `${SUPABASE_URL}/storage/v1/object/public/test/`,
      ""
    ); // Adjust based on your URL

    console.log("Relative Image Path:", relativeImagePath);

    // Delete the image from the bucket
    const { error: deleteImageError } = await supabase.storage
      .from("test") // Assuming 'test' is the bucket name
      .remove([relativeImagePath]);

    if (deleteImageError) {
      console.error(
        "Error deleting image from the bucket:",
        deleteImageError.message
      );
      return;
    } else {
      console.log("Image successfully deleted from the bucket.");
    }
  } else {
    console.log("No image URL found for this watch.");
  }

  // Now delete the watch entry from the "watches" table
  const { error: deleteWatchError } = await supabase
    .from("watches")
    .delete()
    .match({ id: watchId, user_id: user.id });

  if (deleteWatchError) {
    console.error("Error deleting watch", deleteWatchError);
    return;
  }

  // Revalidate the path after the deletion
  revalidatePath("/watch-list");

  return { message: "Success" };
  
}
