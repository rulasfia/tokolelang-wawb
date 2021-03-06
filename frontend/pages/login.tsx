import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useContext, useState } from "react";
import { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { postLogin } from "../lib/mutations/authMutations";
import nookies, { setCookie } from "nookies";
import { useRouter } from "next/router";
import { getAccountDetail } from "../lib/queries/accountQueries";
import { userContext } from "../lib/contexts/userContext";
import type {
  LoginInputs,
  LoginResponse,
} from "../lib/mutations/authMutations";
import { InformationCircleIcon } from "@heroicons/react/outline";

const Login: NextPage = () => {
  const router = useRouter();
  const { setUser } = useContext(userContext);
  const { formState, handleSubmit, register, reset } = useForm<LoginInputs>();
  const { errors } = formState;

  const [reqStatus, setReqStatus] = useState({ loading: false, error: false });

  const loginMutation = useMutation<LoginResponse, AxiosError, LoginInputs>(
    (data) => postLogin(data)
  );

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    setReqStatus({ loading: true, error: false });

    loginMutation.mutate(data, {
      onError: (error) => {
        console.log(error.message);
        setReqStatus({ loading: false, error: true });
      },
      onSuccess: async (data) => {
        const account = await getAccountDetail(data, true);
        const { id, username, user_id, is_master, is_member } = account;

        const cookieValue = `${data.access_token}&${account.id}&${username}`;
        setCookie(null, "token", cookieValue, {
          maxAge: 1 * 24 * 60 * 60,
          path: "/",
        });
        setUser({
          authenticated: true,
          data: { id, username, user_id, is_master, is_member },
        });

        setReqStatus({ loading: false, error: false });
        // redirect
        router.replace("/lelang-terbuka");
      },
    });
  };

  return (
    <>
      <Head>
        <title>Masuk - TokoLelang</title>
      </Head>

      <div className="flex flex-row items-center justify-center min-h-[80vh]">
        <div className="w-1/2 px-12 py-12 border-2 border-gray-300 rounded-lg shadow-md md:w-1/3">
          <h2 className="mb-4 text-2xl font-bold">Masuk</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <div className="">
                <label htmlFor="username" className="form-input-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="username"
                  className="form-input form-input-text"
                  {...register("username", { required: true })}
                />
                {errors.username && (
                  <p className="m-1 text-sm text-danger-d">
                    <span className="font-medium">Oops!</span> Username are
                    empty!
                  </p>
                )}
              </div>

              <div className="">
                <label htmlFor="password" className="form-input-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="password"
                  className="form-input form-input-text"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-danger-d">
                    <span className="font-medium">Oops!</span> Password are
                    empty!
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={reqStatus.loading}
                className="font-bold btn-primary"
              >
                {reqStatus.loading ? "Loading" : "Masuk"}
              </button>

              {/* Error */}
              {reqStatus.error && (
                <div
                  className="flex flex-row items-center p-4 text-sm text-red-700 bg-red-100 rounded-lg"
                  role="alert"
                >
                  <InformationCircleIcon className="w-5 h-5 mr-3" />
                  <span className="font-semibold">
                    Username or password is invalid
                  </span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = nookies.get(context);

  if (cookies.token && cookies.token.length > 25) {
    return {
      redirect: {
        destination: "/lelang-terbuka",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
