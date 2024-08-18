"use client"
import {useRouter}  from "next/navigation";

function Auth() {
  const signed = true;
  const router = useRouter();

  if (signed) {
    router.push("/dashboard");
  } else {
    router.push("/auth/signin");
  }

  return <div></div>;
}

export default Auth;
