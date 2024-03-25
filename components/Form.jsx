"use client";
import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const Form = ({ type }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    if (type === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/");
      }
      if (!res.ok) {
        toast.error("something went error");
      }
    }
    if (type === "login") {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (res.ok) {
        router.push("/chats");
      }
      if (!res.ok) {
        toast.error("invalid email and password");
      }
    }
  };

  return (
    <div className="auth">
      <div className="content">
        <img src="/assets/logo.jpg" alt="logo" style={{borderRadius: "50%"}}/>
        <form action="form" onSubmit={handleSubmit(onSubmit)}>
          {type === "register" && (
            <>
              <div className="input">
                <input
                  defaultValue=""
                  {...register("username", {
                    required: "username is required",
                    validate: (value) => {
                      if (value.length < 3) {
                        return "username must be atleast 3 correcter";
                      }
                    },
                  })}
                  type="text"
                  placeholder="Username"
                  className="input-field"
                />
                <PersonOutline sx={{ color: "#737373" }} />
              </div>
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </>
          )}
          <div>
            <div className="input">
              <input
                defaultValue=""
                {...register("email", {
                  required: "email is required",
                })}
                type="email"
                placeholder="Email"
                className="input-field"
              />
              <EmailOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.email && (
              <p className="text-red-500"> {errors.email.message}</p>
            )}
          </div>
          <div>
            <div className="input">
              <input
                defaultValue=""
                {...register("password", {
                  required: "password is required",
                  validate: (value) => {
                    if (
                      value.length < 8 ||
                      !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                    ) {
                      return "password must be atleast 8 correcter";
                    }
                  },
                })}
                type="password"
                placeholder="Password"
                className="input-field"
              />
              <LockOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button className="button" type="submit">
            {type === "register" ? "join free" : "Lets chat"}
          </button>
        </form>
        {type === "register" ? (
          <Link href="/" className="link">
            <p>already have an account ? Sign in here</p>
          </Link>
        ) : (
          <Link href="/register" className="link">
            <p>dont have an account ? Sign up here</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Form;
