import { IMAGES } from "../../assets";

function PageNotFound() {
  return (
    <div className="flex p-[5.5625rem_15.625rem] justify-center items-center font-ubuntu min-h-[780px] h-screen bg-gradient-to-br from-cyan-500 from-50% to-gray-300 to-50%">
      <div>
        <div
          className="flex absolute lg:top-[50%] top-28 left-[50%] translate-x-[-50%] lg:translate-y-[-50%] lg:w-[58.75rem] w-[21.4375rem] h-[auto] lg:p-[17.1px] py-[2rem] px-[1.5rem] bg-white flex-shrink-0 shadow-[0_25px_40px_-20px_rgba(0,0,0,0.10)] rounded-[0.9375rem]"
          style={{ minHeight: "30 rem" }}
        >
          <div className="flex flex-col items-center justify-center mx-auto">
            <div>
              <img className="h-40" src={IMAGES.notFound} alt="icon" />
            </div>
            <h1 className="text-denim lg:text-[2rem] text-2xl font-bold mt-8 mb-[0.87rem] leading-normal">
              404 - Page Not Found
            </h1>
            <h2 className="text-gray text-center text-base leading-[1.5625rem] font-normal mb-[2.19rem]">
              Oops! It looks like you&apos;re lost. The page you are looking for
              might have been removed or doesn&apos;t exist.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
