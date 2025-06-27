import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600">
              We're here to help you succeed with Idynic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  General Support
                </CardTitle>
                <CardDescription>
                  Questions about using Idynic or need help getting started?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Our support team is available Monday-Friday, 9am-5pm EST.
                </p>
                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  support@idynic.com
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Enterprise Sales
                </CardTitle>
                <CardDescription>
                  Interested in Idynic for your team or organization?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Let's discuss custom solutions and enterprise features.
                </p>
                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  sales@idynic.com
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Feedback & Ideas
                </CardTitle>
                <CardDescription>
                  Have suggestions for new features or improvements?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We love hearing from our users about how to make Idynic better.
                </p>
                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  feedback@idynic.com
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community
                </CardTitle>
                <CardDescription>
                  Connect with other Idynic users and share best practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Join our community discussions and user groups.
                </p>
                <Button className="w-full" variant="outline">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">How secure is my data?</h4>
                  <p className="text-sm text-gray-600">
                    Your data is encrypted at rest and in transit. We follow industry-standard security practices and never share your personal information with third parties.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Can I export my data?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, you can export all your evidence, opportunities, and solutions at any time. We believe your data belongs to you.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">What if I need to cancel?</h4>
                  <p className="text-sm text-gray-600">
                    You can cancel anytime from your account settings. Your data will remain accessible for 30 days after cancellation.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Do you offer refunds?</h4>
                  <p className="text-sm text-gray-600">
                    We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact support for a full refund.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}