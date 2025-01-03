import { Handshake, Quote, Sparkles, Users } from 'lucide-react';

// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

const Quotes = ({ quote }: { quote: { quote: string; name: string } }) => {
  return (
    <section className="mt-4">
      <div className="relative overflow-hidden rounded-xl bg-cyan-400 p-4 shadow-xl dark:bg-gray-950 sm:p-6">
        <Quote className="absolute left-1 top-1 h-8 w-8 text-cyan-300 opacity-30 sm:h-10 sm:w-10" />
        <div className="absolute bottom-0 right-0 h-16 w-16 text-orange-100 sm:h-20 sm:w-20">
          <Sparkles className="h-full w-full" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Handshake
            className="h-4/5 w-4/5 text-cyan-200 opacity-40 dark:text-gray-400"
            strokeWidth={0.5}
          />
        </div>
        <div className="relative z-10">
          <div className="prose font-['Open Sans'] mb-3 text-base text-sm leading-relaxed text-gray-50 dark:text-gray-300 lg:text-lg">
            <span>{quote.quote ?? ''}</span>
          </div>

          <div className="flex justify-end">
            <div className="font-['Open Sans'] inline-block rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-800 shadow-md sm:text-sm">
              {quote.name}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Quotes;
