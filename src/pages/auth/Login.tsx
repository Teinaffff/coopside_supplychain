import { IMAGES } from "../../assets";
import Quotes from "../../components/quotes";
import { useAuth } from "../../hooks/use-auth";
import { LoginForm } from "./LoginForm";

const LoginPage = () => {
  const { loading, handleLogin } = useAuth();
  const quote = {
    quote:
      "The key to overcoming poverty lies in the power of cooperation and cooperatives",
    name: "Haile Gebre",
  };

  return (
    <div>
      <section className={`dark:bg-gray-900 ${loading && "opacity-50"}`}>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 shadow">
          <div className="flex w-full items-center justify-center">
            <div className="w-full flex justify-center">
              <div className="w-full bg-gradient-to-r text-white from-blue-500 to-cyan-400 dark:from-gray-00 dark:to-gray-600 hidden md:block rounded-l-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700">
                <div className="flex items-center justify-center p-8">
                  <img src={IMAGES.coopLogoNoBg} alt="logo" width={120} />
                  <div className="flex flex-col text-white font-bold ml-5 text-sm">
                    <span>Baankii Hojii Gamtaa Oromiyaa</span>
                    <span>የኦሮሚያ ኅብረት ሥራ ባንክ</span>
                  </div>
                </div>
                <div className="flex-1 items-center  justify-center text-2xl font-bold px-16 py-3">
                  <span>Cooperative Societies Management System</span>
                </div>
                <div className="px-4 py-6">
                  <Quotes quote={quote} />
                </div>
              </div>
              <div className="w-full rounded-r-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                    Sign in to your account
                  </h1>
                  <LoginForm onSubmit={handleLogin} loading={loading} />
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
