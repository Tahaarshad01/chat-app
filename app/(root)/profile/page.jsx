"use client";

import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CldUploadButton } from "next-cloudinary";
import Loader from "@/components/Loader";

// const Profile = () => {
//   const { data: session } = useSession();
//   const user = session?.user;
//   console.log("Session data:", session);

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user) {
//       reset({
//         username: user?.username,
//         profileImage: user?.profileImage,
//       });
//     }
//     setLoading(false);
//   }, [user]);

//   const {
//     register,
//     watch,
//     setValue,
//     reset,
//     handleSubmit,
//     formState: { error },
//   } = useForm();
//   // defaultValues: {
//   //   username: user?.username || "",
//   //   profileImage: user?.profileImage || "",
//   // },

//   const uploadPhoto = (result) => {
//     setValue("profileImage", result?.info?.secure_url);
//   };

//   const updateUser = async (data) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/users/${user._id}/update`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       setLoading(false);
//       // window.location.reload();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return loading ? (
//     <Loader />
//   ) : (
//     <div className="profile-page">
//       <h1 className="text-heading3-bold">Edit Your Profile</h1>
//       <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
//         <div className="input">
//           <input
//             type="text"
//             placeholder="Username"
//             className="input-field"
//             {...register("username", {
//               required: "Username is required",
//               validate: (value) => {
//                 if (value.length < 3) {
//                   return "username must be greater than 3 character";
//                 }
//               },
//             })}
//           />
//           <PersonOutline sx={{ color: "grey" }} />
//         </div>
//         {error?.username && (
//           <p className="text-red-500">{error.username.message}</p>
//         )}
//         <div className="flex items-center justify-between">
//           <img
//             src={
//               watch("profileImage") ||
//               user?.profileImage ||
//               "/assets/person.jpg"
//             }
//             alt="profileImage"
//             className="w-40 h-40 rounded-full"
//           />
//           <CldUploadButton
//             options={{ maxFiles: 1 }}
//             onUpload={uploadPhoto}
//             uploadPreset="zuxr6lam"
//           >
//             <p className="text-body-bold">Upload new Photo</p>
//           </CldUploadButton>
//         </div>
//         <button className="btn" type="submit">
//           Save Changes
//         </button>
//       </form>
//     </div>
//   );
// };

const Profile = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
      });
    }
    setLoading(false);
  }, [user]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { error },
  } = useForm();

  const uploadPhoto = (result) => {
    setValue("profileImage", result?.info?.secure_url);
  };

  const updateUser = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user._id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit Your Profile</h1>

      <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
        <div className="input">
          <input
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "username must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="input-field"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {error?.username && (
          <p className="text-red-500">{error.username.message}</p>
        )}

        <div className="flex items-center justify-between">
          <img
            src={
              watch("profileImage") ||
              user?.profileImage ||
              "/assets/person.jpg"
            }
            alt="profile"
            className="w-40 h-40 rounded-full"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={uploadPhoto}
            uploadPreset="zuxr6lam"
          >
            <p className="text-body-bold">Upload new photo</p>
          </CldUploadButton>
        </div>

        <button className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
