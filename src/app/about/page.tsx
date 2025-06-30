import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Idynic</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Building the future of strategic identity and career solutions through AI-powered insights.
            </p>
          </div>

          <div className="prose prose-lg mx-auto">
            <h2>Our Mission</h2>
            <p>
              Idynic empowers professionals to build authentic, evidence-based identities that unlock 
              meaningful opportunities. We believe that everyone has unique value to offer, and our 
              platform helps surface and articulate that value effectively.
            </p>

            <h2>How It Works</h2>
            <p>
              Our platform uses advanced AI to analyze your professional experiences, skills, and 
              achievements to create a comprehensive identity graph. This foundation enables us to 
              generate highly targeted solutions for specific opportunities, increasing your chances 
              of success.
            </p>

            <h2>Why Idynic?</h2>
            <p>
              Traditional career tools focus on templates and generic advice. Idynic takes a 
              different approach by understanding your unique professional identity and crafting 
              solutions that authentically represent your value proposition.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}