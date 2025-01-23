"use client";

import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CalculateCompletion } from "../hooks/use-calculate-profile";
import { profileMockData } from "../common/data/data";
import { getInitials } from "../lib/utils";

export default function ProfileAvatarProgress() {
  const profileCompletion = CalculateCompletion(profileMockData);
  return (
    <div className="w-fit flex flex-col justify-center items-center">
      <div className="w-36 aspect-square flex justify-center items-center">
        <CircularProgressbarWithChildren
          value={profileCompletion}
          minValue={0}
          maxValue={100}
          styles={buildStyles({
            pathColor: "#06b6d4",
            trailColor: "rgba(0,0,0,0.05)",
          })}
        >
          <div className="w-28 aspect-square flex justify-center items-center bg-black/5 rounded-full">
            <span className="w-fit text-5xl font-black">
              {getInitials(profileMockData?.fullName!)}
            </span>
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <span className="text-2xl font-bold">
        {profileMockData?.fullName || "John Doe"}
      </span>
      <span>{profileCompletion}% completed</span>
      {/* {progressValue < 100 && <span className='underline underline-offset-4 text-cyan-700 font-semibold text-base cursor-pointer'> Complete Your Profile</span>} */}
    </div>
  );
}
