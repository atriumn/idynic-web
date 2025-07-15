'use client';

import { CustomIcon } from '@/components/ui/custom-icon';

export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Upload Your Experience',
      description: 'Upload resumes, job descriptions, or career stories to build your comprehensive professional evidence base.',
      icon: 'work-activity',
      color: 'from-[#137dc5] to-[#0f6ba3]'
    },
    {
      number: '02',
      title: 'AI Analyzes & Extracts',
      description: 'Advanced AI analyzes your content to extract skills, knowledge, and work patterns, creating a detailed professional identity graph.',
      icon: 'skill',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      number: '03',
      title: 'Match to Opportunities',
      description: 'Analyze job postings to see how your skills align and generate tailored profiles that highlight your perfect fit for specific roles.',
      icon: 'strong-confidence',
      color: 'from-purple-500 to-pink-600'
    },
    {
      number: '04',
      title: 'Share Your Story',
      description: 'Get shareable profile links that showcase your unique value for each opportunity, helping you stand out in competitive job markets.',
      icon: 'knowledge',
      color: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            From Resume to Dream Job
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your experience into compelling job applications in four simple steps
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center gap-8 mb-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <span className={`inline-block px-4 py-2 rounded-full text-white font-bold text-lg bg-gradient-to-r ${step.color}`}>
                    {step.number}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                  {step.description}
                </p>
              </div>

              {/* Visual */}
              <div className="flex-1 flex justify-center">
                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-2xl relative`}>
                  <CustomIcon 
                    name={step.icon}
                    size={48}
                    className="text-white opacity-90"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
                    {step.number}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Process Summary */}
        <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            The Result: Perfect Job Application Every Time
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Every job posting becomes an opportunity to showcase exactly why you're the perfect fit. 
            Your professional identity becomes a living asset that evolves with your career and adapts to any job market.
          </p>
        </div>
      </div>
    </section>
  );
}