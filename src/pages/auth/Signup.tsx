import { IMAGES } from "../../assets";
import Loader1 from "../../common/Loader";
import { useAuth } from "../../hooks/use-auth";
import { SignupForm } from "./SignupForm";

const SignupPage = () => {
  const { loading, handleSignup } = useAuth();

  return (
    <div>
      {loading && (
        <div className="fixed right-1/2 top-1/2 z-[100]">
          <Loader1 />
        </div>
      )}

      <section className={`dark:bg-gray-900 ${loading && "opacity-50"}`}>
        <div className="flex min-h-screen items-center justify-center px-6 py-8">
          <div className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 dark:border dark:border-gray-700">
            <div className="flex items-center justify-center pt-6">
              <img 
                src={IMAGES.supLogo} 
                alt="Supply Chain Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <div className="space-y-4 md:space-y-6 sm:px-8 pb-8 pt-4">
              <h1 className="text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                Register your Cooperative
              </h1>
              <SignupForm loading={loading} onSubmit={handleSignup} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignupPage;
