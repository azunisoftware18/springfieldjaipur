// "use client";

// import { useForm } from "react-hook-form";
// import {
//   MapPin,
//   FileText,
//   Upload,
//   X,
//   ImageIcon,
//   Globe,
//   Plus,
// } from "lucide-react";
// import Button from "../ui/Button";
// import InputField from "../ui/InputField";
// import { useEffect, useState } from "react";
// import TextareaField from "../ui/TextareaField";
// import dynamic from "next/dynamic";

// const MapPicker = dynamic(
//   () => import("@/components/common/MapPicker"),
//   {
//     ssr: false,
//   }
// );
// export default function AddPlaceForm({
//   submitText = "Save Place",
//   defaultValues = {},
//   onSubmit,
//   onCancel,
// }) {
//   const [preview, setPreview] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm({
//     defaultValues: {
//       name: "",
//       location: "",
//       shortDescription: "",
//       description: "",
//       latitude: "",
//       longitude: "",
//       ...defaultValues,
//     },
//   });

//   const selectedImage = watch("image");

//   useEffect(() => {
//     if (selectedImage && selectedImage instanceof File) {
//       const url = URL.createObjectURL(selectedImage);
//       setPreview(url);
//       return () => URL.revokeObjectURL(url);
//     } else if (typeof selectedImage === "string") {
//       setPreview(selectedImage);
//     } else {
//       setPreview(null);
//     }
//   }, [selectedImage]);

//   const handleFormSubmit = async (data) => {
//     await onSubmit?.(data);
//     reset();
//     setPreview(null);
//   };

//   useEffect(() => {
//   if (defaultValues) {
//     reset({
//       name: defaultValues.name || "",
//       location: defaultValues.location || "",
//       latitude: defaultValues.latitude || "",
//       longitude: defaultValues.longitude || "",
//       shortDescription: defaultValues.shortDescription || "",
//       description: defaultValues.description || "",
//     });
//   }
// }, [defaultValues, reset]);

//   return (
//     <div className="w-full bg-white p-6">
//       <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">

//         {/* Name + Location */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <InputField
//             label="Place Name"
//             icon={MapPin}
//             error={errors.name?.message}
//             {...register("name", { required: "Place name is required" })}
//           />

//           <InputField
//             label="Location"
//             icon={Globe}
//             error={errors.location?.message}
//             {...register("location", { required: "Location is required" })}
//           />
//         </div>

//         {/* Latitude + Longitude */}
//         <div className="grid grid-cols-2 gap-4">
//           <InputField
//             label="Latitude"
//             placeholder="e.g. 27.1751"
//             error={errors.latitude?.message}
//             {...register("latitude", {
//               required: "Latitude required",
//               valueAsNumber: true,
//             })}
//           />

//           <InputField
//             label="Longitude"
//             placeholder="e.g. 78.0421"
//             error={errors.longitude?.message}
//             {...register("longitude", {
//               required: "Longitude required",
//               valueAsNumber: true,
//             })}
//           />
//         </div>
//         <div className="space-y-2">
//   <label className="text-sm font-semibold text-slate-700">
//     Select Location on Map
//   </label>

//   <MapPicker
//     setLatitude={(lat) => setValue("latitude", lat)}
//     setLongitude={(lng) => setValue("longitude", lng)}
//   />
// </div>

//         {/* Short Description */}
//         <TextareaField
//           label="Short Description"
//           placeholder="Min 150 characters..."
//           error={errors.shortDescription?.message}
//           {...register("shortDescription", {
//             minLength: {
//               value: 150,
//               message: "Minimum 150 characters",
//             },
//           })}
//         />

//         {/* Full Description */}
//         <TextareaField
//           label="Full Description"
//           placeholder="Min 250 characters..."
//           error={errors.description?.message}
//           {...register("description", {
//             minLength: {
//               value: 250,
//               message: "Minimum 250 characters",
//             },
//           })}
//         />

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 pt-4">
//           <Button
//             type="button"
//             text="Cancel"
//             onClick={onCancel || (() => reset())}
//           />
//           <Button
//           icon={Plus}
//             iconPosition="left"
//             type="submit"
//             text={isSubmitting ? "Saving..." : submitText}
//           />
//         </div>

//       </form>
//     </div>
//   );
// }

"use client";

import { useForm } from "react-hook-form";
import { MapPin, Globe, Plus, ImageIcon, Upload, X } from "lucide-react";
import Button from "../ui/Button";
import InputField from "../ui/InputField";
import { useEffect, useState } from "react";
import TextareaField from "../ui/TextareaField";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/common/MapPicker"), {
  ssr: false,
});

export default function AddPlaceForm({
  submitText = "Save Place",
  defaultValues = {},
  onSubmit,
  onCancel,
}) {
  const [preview, setPreview] = useState(null);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      location: "",
      shortDescription: "",
      description: "",
      latitude: "",
      longitude: "",
      image: "",
      ...defaultValues,
    },
  });

  const selectedImage = watch("image");

  // =========================================================
  // IMAGE PREVIEW
  // =========================================================

  useEffect(() => {
    if (!selectedImage) {
      setPreview(null);
      return;
    }

    // Existing image URL / Base64
    if (typeof selectedImage === "string") {
      setPreview(selectedImage);
      return;
    }

    // New uploaded File
    if (selectedImage instanceof File) {
      const url = URL.createObjectURL(selectedImage);

      setPreview(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [selectedImage]);

  // =========================================================
  // EDIT DEFAULT VALUES
  // =========================================================

  useEffect(() => {
    if (!defaultValues) return;

    reset({
      name: defaultValues?.name || "",
      location: defaultValues?.location || "",
      latitude: defaultValues?.latitude ?? "",
      longitude: defaultValues?.longitude ?? "",
      shortDescription: defaultValues?.shortDescription || "",
      description: defaultValues?.description || "",
      image: defaultValues?.image || "",
    });

    if (defaultValues?.image) {
      setPreview(defaultValues.image);
    } else {
      setPreview(null);
    }
  }, [defaultValues, reset]);

  // =========================================================
  // IMAGE VALIDATION
  // =========================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setImageError("");

    if (!file) {
      return;
    }

    // Allow only images
    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    // Put File into react-hook-form
    setValue("image", file, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const removeImage = () => {
    setValue("image", "", {
      shouldDirty: true,
    });

    setPreview(null);
    setImageError("");

    const input = document.getElementById("place-image");

    if (input) {
      input.value = "";
    }
  };

  // =========================================================
  // COMPRESS IMAGE
  // =========================================================

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof File)) {
        resolve(file);
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const MAX_WIDTH = 1400;
          const MAX_HEIGHT = 1400;

          let width = img.width;
          let height = img.height;

          // Resize large images
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const widthRatio = MAX_WIDTH / width;
            const heightRatio = MAX_HEIGHT / height;

            const ratio = Math.min(widthRatio, heightRatio);

            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement("canvas");

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(img, 0, 0, width, height);

          const compressedImage = canvas.toDataURL("image/jpeg", 0.8);

          resolve(compressedImage);
        };

        img.onerror = () => {
          reject(new Error("Unable to process image."));
        };

        img.src = event.target.result;
      };

      reader.onerror = () => {
        reject(new Error("Unable to read image."));
      };

      reader.readAsDataURL(file);
    });
  };

  // =========================================================
  // FORM SUBMIT
  // =========================================================

  // const handleFormSubmit = async (data) => {
  //   try {
  //     let imageValue = data.image;

  //     // New image uploaded
  //     if (data.image instanceof File) {
  //       imageValue = await compressImage(data.image);
  //     }

  //     // Existing image remains unchanged
  //     const payload = {
  //       ...data,
  //       image: imageValue || "",
  //     };

  //     await onSubmit?.(payload);

  //     // Reset only after successful submit
  //     reset();

  //     setPreview(null);
  //     setImageError("");
  //   } catch (error) {
  //     console.error("Place form submit error:", error);
  //   }
  // };

  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        image: data.image || null,
      };

      await onSubmit?.(payload);

      reset();
      setPreview(null);
      setImageError("");
    } catch (error) {
      console.error("Place form submit error:", error);
    }
  };

  return (
    <div className="w-full bg-white p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* =====================================================
            NAME + LOCATION
        ====================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Place Name"
            icon={MapPin}
            error={errors?.name?.message}
            {...register("name", {
              required: "Place name is required",
            })}
          />

          <InputField
            label="Location"
            icon={Globe}
            error={errors?.location?.message}
            {...register("location", {
              required: "Location is required",
            })}
          />
        </div>

        {/* =====================================================
            LATITUDE + LONGITUDE
        ====================================================== */}

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Latitude"
            placeholder="e.g. 27.1751"
            error={errors?.latitude?.message}
            {...register("latitude", {
              required: "Latitude required",
              valueAsNumber: true,
            })}
          />

          <InputField
            label="Longitude"
            placeholder="e.g. 78.0421"
            error={errors?.longitude?.message}
            {...register("longitude", {
              required: "Longitude required",
              valueAsNumber: true,
            })}
          />
        </div>

        {/* =====================================================
            MAP PICKER
        ====================================================== */}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Select Location on Map
          </label>

          {/* <MapPicker
            setLatitude={(lat) =>
              setValue("latitude", lat, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            setLongitude={(lng) =>
              setValue("longitude", lng, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          /> */}

          <MapPicker
            initialLatitude={watch("latitude")}
            initialLongitude={watch("longitude")}
            setLatitude={(lat) =>
              setValue("latitude", lat, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            setLongitude={(lng) =>
              setValue("longitude", lng, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />
        </div>

        {/* =====================================================
            IMAGE UPLOAD
        ====================================================== */}

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">
            Place Image
          </label>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-slate-400 transition-colors">
            {!preview ? (
              <label
                htmlFor="place-image"
                className="flex flex-col items-center justify-center min-h-[180px] cursor-pointer rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <ImageIcon className="w-6 h-6 text-slate-500" />
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  Upload Place Image
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  PNG, JPG, JPEG or WEBP
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Maximum size: 5 MB
                </p>

                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700">
                  <Upload className="w-4 h-4" />
                  Choose Image
                </div>
              </label>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Place preview"
                  className="w-full h-64 object-cover rounded-lg border border-slate-200"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-red-50 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>

                <label
                  htmlFor="place-image"
                  className="absolute bottom-3 right-3 cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Upload className="w-4 h-4" />
                  Change Image
                </label>
              </div>
            )}

            <input
              id="place-image"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {imageError && <p className="text-sm text-red-600">{imageError}</p>}
        </div>

        {/* =====================================================
            SHORT DESCRIPTION
        ====================================================== */}

        <TextareaField
          label="Short Description"
          placeholder="Enter short description..."
          error={errors?.shortDescription?.message}
          {...register("shortDescription")}
        />

        {/* =====================================================
            FULL DESCRIPTION
        ====================================================== */}

        <TextareaField
          label="Full Description"
          placeholder="Enter full description..."
          error={errors?.description?.message}
          {...register("description")}
        />

        {/* =====================================================
            BUTTONS
        ====================================================== */}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            text="Cancel"
            onClick={
              onCancel ||
              (() => {
                reset();
                setPreview(null);
              })
            }
          />

          <Button
            icon={Plus}
            iconPosition="left"
            type="submit"
            text={isSubmitting ? "Saving..." : submitText}
          />
        </div>
      </form>
    </div>
  );
}
