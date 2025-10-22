import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { captureError } from "@/lib/sentry";
import * as Sentry from "@sentry/react";

export default function SentryTest() {
  const testClientError = () => {
    throw new Error("Test Client Error - This is a test error from the client");
  };

  const testCaptureError = () => {
    try {
      throw new Error("Test Captured Error - Manually captured error");
    } catch (error) {
      captureError(error as Error, {
        testContext: "Manual error capture test",
        timestamp: new Date().toISOString(),
      });
    }
  };

  const testPerformance = () => {
    Sentry.startSpan(
      {
        op: "test.operation",
        name: "Test Performance Span",
      },
      () => {
        // Simulate some work
        const start = Date.now();
        while (Date.now() - start < 100) {
          // Busy wait for 100ms
        }
        console.log("Performance test completed");
      }
    );
  };

  const testUserContext = () => {
    Sentry.setUser({
      id: "test-user-123",
      email: "test@example.com",
      username: "Test User",
    });
    alert("User context set! Check Sentry dashboard after triggering an error.");
  };

  const testBreadcrumb = () => {
    Sentry.addBreadcrumb({
      category: "test",
      message: "Test breadcrumb added",
      level: "info",
    });
    alert("Breadcrumb added! Trigger an error to see it in Sentry.");
  };

  const testAsyncError = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new Error("Test Async Error - Error thrown in async function");
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Sentry Integration Test</h1>
          <p className="text-gray-600">
            This page is only for testing Sentry integration. Use these buttons to trigger different error scenarios.
          </p>
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Sentry only works in <strong>production mode</strong>. 
              In development, errors will only appear in the console.
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Current mode: <strong>{import.meta.env.MODE}</strong>
            </p>
            <p className="text-sm text-gray-700">
              Production: <strong>{import.meta.env.PROD ? "Yes" : "No"}</strong>
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-black">1. Client Error</CardTitle>
              <CardDescription>Throws an uncaught error</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                onClick={testClientError}
                variant="destructive"
                className="w-full"
              >
                Throw Client Error
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-black">2. Captured Error</CardTitle>
              <CardDescription>Manually captures an error with context</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                onClick={testCaptureError}
                className="w-full bg-black hover:bg-gray-800"
              >
                Capture Error Manually
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-black">3. Performance Span</CardTitle>
              <CardDescription>Creates a performance monitoring span</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                onClick={testPerformance}
                className="w-full bg-black hover:bg-gray-800"
              >
                Test Performance Monitoring
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-black">4. User Context</CardTitle>
              <CardDescription>Sets user context for error tracking</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                onClick={testUserContext}
                className="w-full bg-black hover:bg-gray-800"
              >
                Set User Context
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-black">5. Breadcrumb</CardTitle>
              <CardDescription>Adds a breadcrumb for debugging</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                onClick={testBreadcrumb}
                className="w-full bg-black hover:bg-gray-800"
              >
                Add Breadcrumb
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-black">6. Async Error</CardTitle>
              <CardDescription>Throws an error in async function</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                onClick={() => testAsyncError()}
                variant="destructive"
                className="w-full"
              >
                Throw Async Error
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-black">Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Build the app in production mode: <code className="bg-gray-100 px-2 py-1 rounded">pnpm build</code></li>
              <li>Start the production server: <code className="bg-gray-100 px-2 py-1 rounded">pnpm start</code></li>
              <li>Navigate to this page in your browser</li>
              <li>Click the test buttons to trigger different scenarios</li>
              <li>Check your Sentry dashboard at <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">sentry.io</a></li>
              <li>Verify that errors appear with correct context, user info, and breadcrumbs</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

