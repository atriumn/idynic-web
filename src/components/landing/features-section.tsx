'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomIcon } from '@/components/ui/custom-icon';
import Link from 'next/link';

export function FeaturesSection() {
  const features = [
    {
      title: 'AI-Powered Skill Analysis',
      description: 'Advanced machine learning algorithms extract and categorize your skills, work activities, and knowledge areas from any professional content or experience.',
      status: 'live',
      icon: 'skill',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Job Opportunity Matching',
      description: 'Analyze job postings and automatically generate tailored profiles that highlight your perfect fit for specific roles and opportunities.',
      status: 'live',
      icon: 'work-activity',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Dynamic Work Style Profiles',
      description: 'Showcase how you work best with AI-generated insights about your professional approach, collaboration style, and work preferences.',
      status: 'live',
      icon: 'work-style',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Knowledge Base Integration',
      description: 'Transform your accumulated knowledge and expertise into searchable, shareable insights that demonstrate your domain authority.',
      status: 'live',
      icon: 'knowledge',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      title: 'Tool & Technology Mapping',
      description: 'Automatically identify and showcase your proficiency with tools, technologies, and platforms based on your experience and projects.',
      status: 'live',
      icon: 'tool',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      title: 'Confidence Scoring',
      description: 'Get transparent confidence levels for each skill and trait, helping you understand your strengths and identify areas for growth.',
      status: 'live',
      icon: 'strong-confidence',
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Features Built for Career Success
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            AI-powered tools that transform your experience into compelling narratives for any job opportunity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <CustomIcon 
                    name={feature.icon}
                    size={20}
                    className="text-white opacity-90"
                  />
                </div>
                <Badge 
                  variant={feature.status === 'live' ? 'default' : 'secondary'}
                  className={feature.status === 'live' ? 'bg-[#137dc5] text-white' : ''}
                >
                  {feature.status === 'live' ? 'Live Now' : 'Coming Soon'}
                </Badge>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {feature.link && (
                <Link href={feature.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    {feature.linkText}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Features Highlight */}
        <div className="mt-16 bg-[#137dc5] rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Perfect for Every Career Stage</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">Job Seekers</div>
              <p className="opacity-90">Generate role-specific profiles tailored to any job posting or opportunity</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Career Changers</div>
              <p className="opacity-90">Highlight transferable skills and position yourself for new industries</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Professionals</div>
              <p className="opacity-90">Showcase expertise and stand out in competitive job markets</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}