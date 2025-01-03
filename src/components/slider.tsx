import React from 'react';

import { EmblaOptionsType } from 'embla-carousel';
import Quotes from './quotes';

import Carousel, {
  Slider,
  SliderContainer,
  SliderDotButton,
} from './carousel';

interface QuoteSliderProps {
  quotes: { quote: string; name: string }[];
  options?: EmblaOptionsType;
}

const QuoteSlider: React.FC<QuoteSliderProps> = ({ quotes, options }) => {
  const OPTIONS: EmblaOptionsType = options || { loop: true };

  return (
    <>
      <Carousel options={OPTIONS} isAutoPlay={true}>
        <SliderContainer>
          {quotes.map((quote, index) => (
            <Slider className="w-full" key={index}>
              <Quotes quote={quote} />
            </Slider>
          ))}
        </SliderContainer>
      </Carousel>
    </>
  );
};

export default QuoteSlider;
