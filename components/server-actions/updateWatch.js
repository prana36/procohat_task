// 'use server'
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
// import { revalidatePath } from "next/cache"
// import { cookies } from "next/headers"

// export async function updateWatch(formData){
//     const id = formData.get('id')
//     const model = formData.get('model')
//     const brand = formData.get('brand')
//     const referenceNumber = formData.get('referenceNumber')
//     // const image = formData.get('image')

//     const cookieStore = cookies();
//     const supabase = createServerComponentClient({cookies: () => cookieStore})
//     const {data: {session}} = await supabase.auth.getSession();
//     const user = session?.user

//     if (!user){
//         console.error('User is not authenticated within updateWatch server action')
//         return;
//     }

//     const {data, error} = await supabase
//         .from('watches')
//         .update(
//             {
//                 model,
//                 brand,
//                 reference_number: referenceNumber,
//                 // image,
//             }
//         ).match({id, user_id: user.id})

//     if (error){
//         console.error('Error updating data', error)
//         return;
//     }

//     revalidatePath('/watch-list')

//     return {message: 'Success'}
// }

// "use server";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";

// export async function updateWatch(formData) {
//   const id = formData.get("id");
//   const model = formData.get("model");
//   const brand = formData.get("brand");
//   const referenceNumber = formData.get("referenceNumber");
//   const image = formData.get("image"); // Get the image from form data

// //   const imagePath = formData.imageUrlData("image")

//   const cookieStore = cookies();
//   const supabase = createServerComponentClient({ cookies: () => cookieStore });
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   const user = session?.user;

//   if (!user) {
//     console.error("User is not authenticated within updateWatch server action");
//     return;
//   }

//   let imageUrl = null;

//   // If there is an image, upload it to Supabase storage
//   if (image && image.size > 0) {
//     const fileName = `${Date.now()}_${image.name}`; // Create unique filename with a timestamp

//     // new

// async function updateImage(imageUrl, newImageFile) {
//   // Step 1: Upload the new image (this will replace the existing one)
//   const { data: uploadData, error: uploadError } = await supabase.storage
//     .from("test")
//     .upload(imagePath, newImageFile, {
//       cacheControl: "3600", // Optional: Cache control headers
//       upsert: true, // Overwrites the existing file if it exists
//     });

//   // Step 2: Handle any upload errors
//   if (uploadError) {
//     console.error("Error updating image:", uploadError.message);
//     return;
//   }

//   console.log(`Image updated successfully at path: ${uploadData.path}`);
// }

//     //end

//     // const { data: storageData, error: uploadError } = await supabase.storage
//     //   .from("test") // Your bucket name
//     //   .upload(`watches/${fileName}`, image, {
//     //     cacheControl: "3600",
//     //     upsert: false,
//     //   });

//     if (uploadError) {
//       console.error("Error uploading image", uploadError);
//       return;
//     }

//     // Get the public URL of the uploaded image
//     const { data: imageUrlData } = supabase.storage
//       .from("test")
//       .getPublicUrl(`watches/${fileName}`);
//     imageUrl = imageUrlData.publicUrl;
//   }

//   // Update the watch data including the image URL if available
//   const { data, error } = await supabase
//     .from("watches")
//     .update({
//       model,
//       brand,
//       reference_number: referenceNumber,
//       ...(imageUrl && { image_url: imageUrl }), // Only update image_url if image was uploaded
//     // imageUrl:imageUrl,
//     })
// .match({ id, user_id: user.id });

//   if (error) {
//     console.error("Error updating data", error);
//     return;
//   }

//   // Revalidate the path to refresh the watch list
//   revalidatePath(" /watch-list");

//   return { message: "Success" };
// }

"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateWatch(formData) {
  const id = formData.get("id");
  const model = formData.get("model");
  const brand = formData.get("brand");
  const referenceNumber = formData.get("referenceNumber");
  const image = formData.get("image"); // Get the image from form data

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    console.error("User is not authenticated within updateWatch server action");
    return;
  }

  let imageUrl = null;

  // Step 1: Fetch the current watch data to get the existing image URL (if any)
  const { data: existingWatch, error: fetchError } = await supabase
    .from("watches")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching watch data", fetchError);
    return;
  }

  const existingImageUrl = existingWatch?.image_url;

  // Step 2: Delete the old image from Supabase storage (if exists)
  if (existingImageUrl) {
    // Extract the file path from the public URL (remove the base URL)
    const oldImagePath = existingImageUrl.split(
      "/storage/v1/object/public/test/"
    )[1];

    if (oldImagePath) {
      const { error: deleteError } = await supabase.storage
        .from("test")
        .remove([oldImagePath]);

      if (deleteError) {
        console.error("Error deleting old image", deleteError);
        return;
      }
    }
  }

  // Step 3: If there is a new image, upload it to Supabase storage
  if (image && image.size > 0) {
    const fileName = `${Date.now()}_${image.name}`; // Create a unique filename with a timestamp

    const { data: storageData, error: uploadError } = await supabase.storage
      .from("test") // Your bucket name
      .upload(`watches/${fileName}`, image, {
        cacheControl: "3600",
        upsert: true, // Ensure that the file is replaced if it already exists
      });

    if (uploadError) {
      console.error("Error uploading image", uploadError);
      return;
    }

    // Get the public URL of the newly uploaded image
    const { data: imageUrlData } = supabase.storage
      .from("test")
      .getPublicUrl(`watches/${fileName}`);
    imageUrl = imageUrlData.publicUrl;
  }

  // Step 4: Update the watch data including the new image URL (if uploaded)
  const { data: updateData, error: updateError } = await supabase
    .from("watches")
    .update({
      model,
      brand,
      reference_number: referenceNumber,
      ...(imageUrl && { image_url: imageUrl }), // Update the image URL only if a new image was uploaded
    })
    .match({ id, user_id: user.id });

  if (updateError) {
    console.error("Error updating watch data", updateError);
    return;
  }

  // Revalidate the path to refresh the watch list
  revalidatePath("/watch-list");

  return { message: "Success" };
}
