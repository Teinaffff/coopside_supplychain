import React, { useEffect, useState } from "react";
import Loader1 from "../../common/Loader";
import toast from "react-hot-toast";
import { z } from "zod";
import { TOKEN } from "../../constants/general";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { AxiosError } from "axios";
import { Login } from "../../constants/interface/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IMAGES } from "../../assets";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../common/ui/form";
import { Input } from "../../common/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "../../common/ui/checkbox";
import { Button } from "../../common/ui/button";
import { Loader } from "../../common/ui/loader";
import QuoteSlider from "../../components/slider";
import { cooperativeQuotes } from "../../common/data/data";
import { emailRegex } from "../../lib/utils";
import { Textarea } from "../../common/ui/textarea";

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .refine(
        (data) => {
          return emailRegex.test(data);
        },
        { message: "Invalid email" }
      ),
    name: z.string().min(1, { message: "Cooperative name is required" }),
    purpose: z.string().min(1, { message: "Purpose is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~])/, {
        message:
          "Password must contain one lowercase letter, one uppercase letter, one number, and one special character",
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"],
  });

type LevelFormValues = z.infer<typeof formSchema>;

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  // const user = useAppSelector((state) => state.setting.user);
  const redirectPath = location.state?.path ?? "/";

  // useEffect(() => {
  //   const token = localStorage.getItem(TOKEN);
  //   if (token) {
  //     navigate(redirectPath, { replace: true });
  //   }
  // }, [user]);

  const form = useForm<LevelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      purpose: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: Login) => {
    try {
      setLoading(true);
      // await dispatch(authenticate(data));
      setLoading(false);
    } catch (error) {
      const errors = error as AxiosError;
      if (errors.message === "Please check your username and password.") {
        toast.error("Invalid username or password");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="fixed right-1/2 top-1/2 z-[100]">
          <Loader1 />
        </div>
      )}

      <section className={`dark:bg-gray-900 ${loading && "opacity-50"}`}>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 shadow">
          <div className="flex w-full items-center justify-center">
            <div className="w-full flex justify-center">
              
              <div className="w-full bg-white rounded-r-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-center">
                  <img src={IMAGES.cmsLogo} alt="logo" width={175} />
                </div>
                <div className="space-y-4 md:space-y-6 sm:px-8 pb-8 pt-4">
                  <h1 className="text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                    Register your Cooperative
                  </h1>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8 w-full"
                    >
                      <div className="space-y-4 md:space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cooperative Name:</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  {...field}
                                  disabled={loading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="purpose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Purpose:</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={4}
                                  {...field}
                                  disabled={loading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email:</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  disabled={loading}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-2 relative">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password:</FormLabel>
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      {...field}
                                      disabled={loading}
                                    />
                                    <span
                                      className="absolute right-1"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                    >
                                      {showPassword ? (
                                        <EyeOff height={20} />
                                      ) : (
                                        <Eye height={20} />
                                      )}
                                    </span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-2 relative">
                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password:</FormLabel>
                                <FormControl>
                                  <Input
                                    type={"password"}
                                    {...field}
                                    disabled={loading}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          disabled={loading}
                          type="submit"
                          className={`w-full text-white bg-cyan-500 hover:bg-cyan-600 ${
                            loading ? "cursor-not-allowed" : ""
                          }`}
                        >
                          {loading && (
                            <span className="mr-2">
                              {" "}
                              <Loader color="#ffffff" size={15} />
                            </span>
                          )}
                          Sign in
                        </Button>
                        <p className="text-sm font-light">
                          Do you have an account?
                          <Link
                            to={"/login"}
                            className="font-medium ml-2 text-cyan-500 hover:underline dark:text-cyan-500"
                          >
                            Signin
                          </Link>
                        </p>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignupPage;
