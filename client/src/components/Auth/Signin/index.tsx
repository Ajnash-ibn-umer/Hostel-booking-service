"use client";
import Link from "next/link";
import React from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
    <div className="flex justify-center items-center mb-20">
      <h3 style={{fontSize:"50px"}} role="heading" className={"x-el x-el-h3 c1-3a c1-3b c1-2f c1-2g c1-3c c1-26 c1-24 c1-23 c1-25 c1-33 c1-2r c1-3d c1-2m c1-3e c1-3f c1-3g c1-3h c1-3i c1-3j"}>OXTEL</h3>
    </div>
   

      <div>
        <SigninWithPassword />
      </div>

    </>
  );
}
