import AchievementBadges from "./AchievementBadges";
import MissionVisionValues from "./MissionVisionValues";
import PlatformImpact from "./PlatformImpact";

const AboutUs = () => {
  return (
    <div id="about">
      <MissionVisionValues />
      <PlatformImpact />
      <AchievementBadges />
    </div>
  );
};

export default AboutUs;
