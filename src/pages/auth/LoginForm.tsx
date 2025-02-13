import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UseMutateFunction } from "react-query";
import { Link } from "react-router-dom";
import { Button } from "../../common/ui/button";
import { Checkbox } from "../../common/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../common/ui/form";
import { Input } from "../../common/ui/input";
import { Loader } from "../../common/ui/loader";
import { LoginFormValues, loginSchema } from "../../constants/schema";

type LoginFormProps = {
  onSubmit: UseMutateFunction<
    unknown,
    AxiosError,
    { email: string; password: string },
    unknown
  >;
  loading: boolean;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: LoginFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 w-full">
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
                        {...field}
                        disabled={loading}
                      />
                      <span
                        className="absolute right-1"
                        onClick={() => setShowPassword(!showPassword)}
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
                className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Link
              to={"/forgotpassword"}
              className="text-sm font-medium text-cyan-500 hover:underline dark:text-cyan-500"
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
          <p className="text-sm font-light">
            Want to create Cooperative?
            <Link
              to={"/register"}
              className="font-medium ml-2 text-cyan-500 hover:underline dark:text-cyan-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};
