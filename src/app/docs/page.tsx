import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn how to make the most of Idynic's features and capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h3>
              <p className="text-gray-600 text-sm mb-4">
                Learn the basics of building your identity graph and analyzing opportunities.
              </p>
              <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Read guide →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Identity Graph</h3>
              <p className="text-gray-600 text-sm mb-4">
                Understand how evidence submission builds your professional identity.
              </p>
              <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Learn more →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Opportunity Analysis</h3>
              <p className="text-gray-600 text-sm mb-4">
                Discover how our AI analyzes job postings and requirements.
              </p>
              <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Explore →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Solution Generation</h3>
              <p className="text-gray-600 text-sm mb-4">
                Learn how we create tailored solutions for specific opportunities.
              </p>
              <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Get started →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">API Reference</h3>
              <p className="text-gray-600 text-sm mb-4">
                Technical documentation for integrating with Idynic's API.
              </p>
              <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View docs →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Best Practices</h3>
              <p className="text-gray-600 text-sm mb-4">
                Tips and strategies for maximizing your success with Idynic.
              </p>
              <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Learn tips →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}