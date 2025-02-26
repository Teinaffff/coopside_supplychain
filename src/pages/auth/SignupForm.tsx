import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../../common/ui/button";
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
import { SignupFormValues, signupSchema } from "../../schema/auth";

interface SignupFormProps {
  onSubmit: (data: SignupFormValues) => void;
  loading: boolean;
}

export const SignupForm: FC<SignupFormProps> = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div className="space-y-4 md:space-y-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cooperative Name:</FormLabel>
                  <FormControl>
                    <Input type="text" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input type="email" disabled={loading} {...field} />
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

          <div className="space-y-2 relative">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password:</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                        disabled={loading}
                      />
                      <span
                        className="absolute right-1"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
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

          <Button
            disabled={loading}
            type="submit"
            className={`w-full text-white bg-cyan-500 hover:bg-cyan-600 ${
              loading ? "cursor-not-allowed" : ""
            }`}
          >
            {loading && (
              <span className="mr-2">
                <Loader color="#ffffff" size={15} />
              </span>
            )}
            Sign up
          </Button>

          <p className="text-sm font-light">
            Already have an account?
            <Link
              to={"/login"}
              className="font-medium ml-2 text-cyan-500 hover:underline dark:text-cyan-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};
