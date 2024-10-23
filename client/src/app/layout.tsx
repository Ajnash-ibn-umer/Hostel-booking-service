"use client";
// import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import GraphqlProvider, { GraphqlClient } from "../graphql/graphql-client.config";
import { USER_LIST_QUERY } from "@/graphql/queries/main.quiries";
import { Toaster } from "@/components/ui/toaster"
export default  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  

  return (
    <html lang="en">
      <GraphqlProvider>
      <body suppressHydrationWarning={true}>

        {loading ? <Loader /> : children}

        <Toaster />
      </body>
      </GraphqlProvider>
    </html>
  );
}
