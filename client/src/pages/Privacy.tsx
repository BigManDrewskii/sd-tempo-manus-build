import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              ← Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-black" />
            <h1 className="text-4xl font-bold text-black">Privacy Policy</h1>
          </div>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              PROPOSR ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our interactive proposal builder service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-black mt-6 mb-3">2.1 Information You Provide</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Account Information:</strong> Name, email address, and authentication credentials</li>
              <li><strong>Profile Information:</strong> Company name, logo, brand colors, and typography preferences</li>
              <li><strong>Proposal Content:</strong> Text, images, pricing information, and other content you create</li>
              <li><strong>Client Information:</strong> Names, email addresses, and contact details of proposal recipients</li>
              <li><strong>Payment Information:</strong> Billing address and payment method details (processed securely by third-party payment processors)</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mt-6 mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you use our Service, we automatically collect certain information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, and interaction patterns</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
              <li><strong>Analytics Data:</strong> Proposal views, section engagement, pricing interactions, and signature events</li>
              <li><strong>Email Tracking:</strong> Email opens, link clicks, and delivery status</li>
              <li><strong>Cookies and Similar Technologies:</strong> Session identifiers and preference data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide, maintain, and improve our Service</li>
              <li>Create and manage your account</li>
              <li>Process your transactions and send related information</li>
              <li>Send you proposals and track engagement</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Generate analytics and insights about proposal performance</li>
              <li>Send administrative information, updates, and security alerts</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">4. How We Share Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>With Proposal Recipients:</strong> When you send a proposal, we share the content and tracking information with your specified recipients</li>
              <li><strong>With Service Providers:</strong> Third-party vendors who perform services on our behalf (hosting, analytics, email delivery, payment processing)</li>
              <li><strong>For Legal Reasons:</strong> When required by law, legal process, or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security assessments and updates</li>
              <li>Limited access to personal information by employees and contractors</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will delete or anonymize your personal information within 90 days, except where we are required to retain it for legal or regulatory purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">7. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a structured, machine-readable format</li>
              <li><strong>Objection:</strong> Object to our processing of your personal information</li>
              <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us at <a href="mailto:privacy@tempo.com" className="text-black underline hover:text-gray-700">privacy@tempo.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Maintain your session and remember your preferences</li>
              <li>Track proposal views and engagement</li>
              <li>Analyze usage patterns and improve our Service</li>
              <li>Provide personalized experiences</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">9. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our Service, you consent to the transfer of your information to these countries.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">11. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <ul className="list-none space-y-2 text-gray-700 mt-4">
              <li><strong>Email:</strong> <a href="mailto:privacy@tempo.com" className="text-black underline hover:text-gray-700">privacy@tempo.com</a></li>
              <li><strong>Support:</strong> <Link href="/support" className="text-black underline hover:text-gray-700">Visit our Support page</Link></li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/">
            <Button variant="outline" className="border-gray-200 hover:border-gray-300">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

