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

const formSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LevelFormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
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
      email: "",
      password: "",
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
              <div className="w-full bg-gradient-to-r text-white bg-gray-400 to-cyan-400 from-blue-500 dark:from-gray-00 dark:to-gray-600 hidden md:block rounded-l-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-center p-8">
                  <img src={IMAGES.coopLogoNoBg} alt="logo" width={120} />
                  <div className="flex flex-col text-white font-bold ml-5 text-sm">
                    <span>Baankii Hojii Gamtaa Oromiyaa</span>
                    <span>የኦሮሚያ ኅብረት ሥራ ባንክ</span>
                  </div>
                </div>
                <div className="flex-1 items-center  justify-center text-2xl font-bold px-16 py-3">
                  <span>Cooperative Societies Data Management System</span>
                </div>
                <div className="px-4 py-6">
                  <QuoteSlider
                    quotes={cooperativeQuotes}
                    options={{ loop: true }}
                  />
                </div>
              </div>
              <div className="w-full bg-white rounded-r-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-center">
                  <img src={IMAGES.cmsLogo} alt="logo" width={175} />
                </div>
                <div className="space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                    Sign in to your account
                  </h1>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8 w-full"
                    >
                      <div className="space-y-4 md:space-y-4">
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email:</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    className="ring-1"
                                    // placeholder="johndoe@example.com"
                                    disabled={loading}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
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
                                      className="ring-1"
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <label
                              htmlFor="terms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Remember me
                            </label>
                          </div>
                          <Link
                            to={"/forgotpassword"}
                            className="text-sm font-medium text-picton-blue-500 hover:underline dark:text-picton-blue-500"
                          >
                            Forgot password?
                          </Link>
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

export default LoginPage;
