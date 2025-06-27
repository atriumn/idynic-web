import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Idynic</h3>
            <p className="text-sm text-gray-600">
              Strategic Identity & Solution Platform
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  What is Idynic?
                </Link>
              </li>
              <li>
                <Link href="/how-to-use" className="text-sm text-gray-600 hover:text-gray-900">
                  How to Use
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Documentation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Documentation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900">
                  User Guide
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-sm text-gray-600 hover:text-gray-900">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal & Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2025 Idynic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}