"use client";

import { GroupOutlined, PersonOutline } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CldUploadButton } from "next-cloudinary";
import Loader from "@/components/Loader";
import { useParams, useRouter } from "next/navigation";

const GroupInfo = () => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});

  const router = useRouter();

  const { chatId } = useParams();
  const getChatDetils = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      setChat(data);
      setLoading(false);
      reset({
        name: data?.name,
        groupPhoto: data?.groupPhoto,
      });
    } catch (error) {
      console.log("erroor");
    }
  };

  useEffect(() => {
    if (chatId) {
      getChatDetils();
    }
  }, [chatId]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { error },
  } = useForm();

  const uploadPhoto = (result) => {
    setValue("groupPhoto", result?.info?.secure_url);
  };

  const updateGroup = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
      // window.location.reload();

      if (res.ok) {
        router.push(`/chats/${chatId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit Group </h1>

      <form className="edit-profile" onSubmit={handleSubmit(updateGroup)}>
        <div className="input">
          <input
            {...register("name", {
              required: "Group is required",
            })}
            type="text"
            placeholder="Group Name"
            className="input-field"
          />
          <GroupOutlined sx={{ color: "#737373" }} />
        </div>
        {error?.username && (
          <p className="text-red-500">{error.name.message}</p>
        )}

        <div className="flex items-center justify-between">
          <img
            src={watch("groupPhoto") || "/assets/group.png"}
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
        <div className="flex flex-wrap gap-3">
          {chat?.members?.map((member, index) => (
            <p className="selected-contact" key={index}>
              {member.username}
            </p>
          ))}
        </div>
        <button className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default GroupInfo;
