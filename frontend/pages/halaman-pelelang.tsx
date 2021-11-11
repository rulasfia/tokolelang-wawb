import { GetServerSideProps, NextPage } from "next";
import React from "react";
import Head from "next/head";
import nookies from "nookies";

const HalamanPelelang: NextPage = () => {
  return (
    <>
      <Head>
        <title>Halaman Pelelang - TokoLelang</title>
      </Head>

      <div>
        <h2 className="mb-4 text-2xl font-semibold">Halaman Pelelang</h2>
      </div>
    </>
  );
};

export default HalamanPelelang;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = nookies.get(context);

  if (!cookies.token || cookies.token.length < 25) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
