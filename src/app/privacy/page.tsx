import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Policy
            </CardTitle>
            <CardDescription>
              Last updated: June 27, 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
                <p className="text-gray-700 mb-3">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Account information (email, name)</li>
                  <li>Professional content (resumes, work stories, certifications)</li>
                  <li>Job opportunity data you analyze</li>
                  <li>Generated solutions and refinements</li>
                  <li>Usage data and analytics</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">How We Use Your Information</h3>
                <p className="text-gray-700 mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Generate identity analysis and solutions</li>
                  <li>Communicate with you about the service</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Information Sharing</h3>
                <p className="text-gray-700 mb-3">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>With your explicit consent</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and safety</li>
                  <li>With service providers who assist in operations (under strict confidentiality)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Data Security</h3>
                <p className="text-gray-700">
                  We implement industry-standard security measures to protect your personal information, including encryption at rest and in transit, secure access controls, and regular security audits.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Data Retention</h3>
                <p className="text-gray-700">
                  We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time through your account settings.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
                <p className="text-gray-700 mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your data</li>
                  <li>Export your data</li>
                  <li>Opt out of communications</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Cookies and Tracking</h3>
                <p className="text-gray-700">
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Changes to Privacy Policy</h3>
                <p className="text-gray-700">
                  We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
                <p className="text-gray-700">
                  If you have questions about this privacy policy or our data practices, please contact us at{' '}
                  <Link href="/contact" className="text-blue-600 hover:text-blue-500">
                    privacy@idynic.com
                  </Link>
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}