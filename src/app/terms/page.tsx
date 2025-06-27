import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Terms of Service
            </CardTitle>
            <CardDescription>
              Last updated: June 27, 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
                <p className="text-gray-700">
                  By accessing and using Idynic ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">2. Use License</h3>
                <p className="text-gray-700 mb-3">
                  Permission is granted to temporarily access and use the Service for personal, non-commercial purposes subject to the restrictions in these Terms of Service.
                </p>
                <p className="text-gray-700">
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">3. User Data and Privacy</h3>
                <p className="text-gray-700 mb-3">
                  You retain all rights to the content you upload to Idynic, including resumes, work stories, and other professional information.
                </p>
                <p className="text-gray-700">
                  We use your data solely to provide the Service and will not share your personal information with third parties without your consent.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">4. Account Responsibilities</h3>
                <p className="text-gray-700">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">5. Prohibited Uses</h3>
                <p className="text-gray-700 mb-2">You may not use the Service:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">6. Service Availability</h3>
                <p className="text-gray-700">
                  We strive to maintain high availability but do not guarantee that the Service will be available at all times. We reserve the right to modify or discontinue the Service with reasonable notice.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">7. Limitation of Liability</h3>
                <p className="text-gray-700">
                  In no event shall Idynic or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">8. Governing Law</h3>
                <p className="text-gray-700">
                  These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">9. Changes to Terms</h3>
                <p className="text-gray-700">
                  We reserve the right to update these Terms of Service at any time. We will notify users of any material changes via email or through the Service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <p className="text-gray-700">
                  If you have any questions about these Terms of Service, please contact us at{' '}
                  <Link href="/contact" className="text-blue-600 hover:text-blue-500">
                    support@idynic.com
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