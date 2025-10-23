import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Mail, FileText, MessageCircle, Book } from "lucide-react";

export default function Support() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              ← Back to Home
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-4 mb-4">
            <HelpCircle className="w-10 h-10 text-black" />
            <h1 className="text-5xl font-bold text-black">Support & Help</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get the help you need to create amazing proposals and close more deals
          </p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Email Support */}
          <Card className="border-gray-200 hover:border-gray-300 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <Mail className="w-6 h-6 text-black" />
                <CardTitle className="text-xl">Email Support</CardTitle>
              </div>
              <CardDescription>
                Get personalized help from our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <Button asChild className="w-full bg-black hover:bg-gray-800">
                <a href="mailto:support@tempo.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Us
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Documentation */}
          <Card className="border-gray-200 hover:border-gray-300 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <Book className="w-6 h-6 text-black" />
                <CardTitle className="text-xl">Documentation</CardTitle>
              </div>
              <CardDescription>
                Learn how to use PROPOSR with our guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Browse our comprehensive documentation and tutorials.
              </p>
              <Button asChild variant="outline" className="w-full border-gray-200 hover:border-gray-300">
                <Link href="/#how-it-works">
                  <Book className="w-4 h-4 mr-2" />
                  View Guides
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">How do I create my first proposal?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  After signing in, click "Create Proposal" in the navigation bar. You can choose to generate a proposal with AI, use a template, or create one from scratch. Fill in your client's information, add your services and pricing, and customize the design to match your brand.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">How does proposal tracking work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  When you send a proposal via email, we automatically track when your client opens it, which sections they view, how long they spend on each section, and whether they interact with the pricing calculator. You can view all this data in the Analytics dashboard for each proposal.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Can I customize my proposal's appearance?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Yes! Go to Settings → Brand Settings to upload your logo, set your brand colors, choose typography, and add your company name. These settings will be applied to all your proposals automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">How do digital signatures work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  When your client views the proposal, they can sign it directly in their browser using our digital signature tool. Once signed, you'll receive a notification and can view the signed proposal in your dashboard. The signature is legally binding and timestamped.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Can I export proposals to PDF?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Yes! You can export any proposal to PDF from the proposal view or edit page. Click the "Export PDF" button and the proposal will be downloaded with all your branding and styling preserved.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">What happens when a proposal expires?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Proposals have an expiration date that you set when creating them. After this date, clients will see an "expired" notice when viewing the proposal. You can edit the proposal to extend the expiration date if needed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">How do I manage multiple proposals?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Your Dashboard shows all your proposals with their status (draft, published, signed, archived). You can search by client name, filter by status, and quickly access any proposal to view, edit, or check analytics.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Yes. We use industry-standard encryption for all data in transit and at rest. Your proposals and client information are stored securely and are only accessible to you. Read our <Link href="/privacy" className="text-black underline hover:text-gray-700">Privacy Policy</Link> for more details.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-4">Still need help?</h2>
          <p className="text-gray-700 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-black hover:bg-gray-800">
              <a href="mailto:support@tempo.com">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </a>
            </Button>
            <Button asChild variant="outline" className="border-gray-200 hover:border-gray-300">
              <Link href="/dashboard">
                <FileText className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
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

