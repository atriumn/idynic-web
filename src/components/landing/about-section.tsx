'use client';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            About Idynic
          </h2>
          <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed space-y-6">
            <p>
              Idynic is your personal AI career architect. We transform your experiences, skills, and stories into dynamic, shareable profiles that position you as the perfect candidate for any job opportunity.
            </p>
            <p>
              Whether you&apos;re actively job hunting, exploring career changes, or building your professional brand, Idynic helps you tell your story with clarity and impact. Our platform synthesizes your unique background into compelling narratives that resonate with hiring managers and employers.
            </p>
            <p>
              Stop settling for generic resumes and one-size-fits-all applications. With Idynic, your professional identity becomes a living, breathing representation of your career potential tailored to every opportunity.
            </p>
          </div>

          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="group text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#137dc5] to-[#0f6ba3] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-white">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#137dc5] transition-colors duration-300">Precision Matching</h3>
                <p className="text-gray-600 dark:text-gray-300">AI-powered analysis creates profiles tailored to specific roles and opportunities</p>
              </div>
            </div>
            <div className="group text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-white">🔗</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors duration-300">Shareable Profiles</h3>
                <p className="text-gray-600 dark:text-gray-300">Generate unique links to showcase your identity for any context or audience</p>
              </div>
            </div>
            <div className="group text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-white">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors duration-300">Continuous Evolution</h3>
                <p className="text-gray-600 dark:text-gray-300">Your profile grows and adapts as your career evolves and new opportunities arise</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}