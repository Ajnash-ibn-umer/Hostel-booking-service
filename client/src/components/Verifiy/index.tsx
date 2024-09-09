"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Auth() {
  const [signed, setSigned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      console.log("it have authToken");
      setSigned(true);
      router.push("/dashboard");
    } else {
      router.push("/auth/signin");
    }
  }, []);

  return <div></div>;
}

export default Auth;
