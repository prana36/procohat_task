// "use server";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";

// export async function addWatch(formData) {
//   const model = formData.get("model");
//   const brand = formData.get("brand");
//   const referenceNumber = formData.get("referenceNumber");
// //   const image = formData.get("image");

//   const cookieStore = cookies();
//   const supabase = createServerComponentClient({ cookies: () => cookieStore });
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   const user = session?.user;

//   if (!user) {
//     console.error("User is not authenticated within addWatch server action");
//     return;
//   }

//   const { data, error } = await supabase
//     .from("watches")
//     .insert([
//       {
//         model,
//         brand,
//         reference_number: referenceNumber,
//         // image: image,
//         // image: publicUrlData.publicUrl,
//         user_id: user.id,
//       },
//     ])

//   if (error) {
//     console.error("Error inserting data", error);
//     return;
//   }

//   revalidatePath("/watch-list");

//   return { message: "Success" };
// }

"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function addWatch(formData) {
  const model = formData.get("model");
  const brand = formData.get("brand");
  const referenceNumber = formData.get("referenceNumber");
  const image = formData.get("image"); // This should retrieve the uploaded image file from the form

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Get the session and user ID
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    console.error("User is not authenticated within addWatch server action");
    return;
  }

  let imageUrl = null;

  // Ensure that the image is defined and not null
  if (image && image.size > 0) {
    const fileName = `${Date.now()}_${image.name}`; // Create a unique filename with a timestamp
    const { data: storageData, error: uploadError } = await supabase.storage
      .from("test") // Your Supabase bucket name
      .upload(`watches/${fileName}`, image, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading image", uploadError);
      return;
    }

    // Get the public URL for the image
    const { data: imageUrlData } = supabase.storage
      .from("test")
      .getPublicUrl(`watches/${fileName}`);
    imageUrl = imageUrlData.publicUrl;
  }

  console.log(model);
  console.log(brand);
  console.log(referenceNumber);
  console.log(imageUrl);

  // Insert watch data with image URL into the "watches" table
  const { data, error } = await supabase.from("watches").insert([
    {
      model,
      brand,
      reference_number: referenceNumber,
      image_url: imageUrl, // Store the image URL in the database
      user_id: user.id,
    },
  ]);
  

  if (error) {
    console.error("Error inserting data into watches table", error);
    return;
  }

  // Revalidate the watch list page to show the new entry
  revalidatePath("/watch-list");

  return { message: "Success" };
}
