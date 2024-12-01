
import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useState } from "react";
import SignIn from "./auth/signin/page";
import { ApolloClient, gql, InMemoryCache, useQuery } from "@apollo/client";
import { GraphqlClient } from "@/graphql/graphql-client.config";
import { USER_LIST_QUERY } from "@/graphql/queries/main.quiries";
import Dashboard from "./dashboard/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Auth from "@/components/Verifiy";


export const metadata: Metadata = {
  title:
    "Oxtel Hostel Booking Application",
  description: "Welcome to the Oxtel Hostel Booking Application..",
};

export default async function Home() {


  return (
    <>
      <Auth />

    </>
  );
}
