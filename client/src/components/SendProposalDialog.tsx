import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Mail, Eye, Send } from "lucide-react";

interface SendProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalId: number;
  proposalTitle: string;
  clientName: string;
}

export function SendProposalDialog({
  open,
  onOpenChange,
  proposalId,
  proposalTitle,
  clientName,
}: SendProposalDialogProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState(clientName);
  const [subject, setSubject] = useState(`Proposal: ${proposalTitle}`);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const sendEmailMutation = trpc.proposals.sendEmail.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Proposal sent successfully!", {
          description: `Email sent to ${recipientEmail}`,
        });
        onOpenChange(false);
        // Reset form
        setRecipientEmail("");
        setRecipientName(clientName);
        setSubject(`Proposal: ${proposalTitle}`);
        setMessage("");
      } else {
        toast.error("Failed to send email", {
          description: data.error || "Please try again later",
        });
      }
    },
    onError: (error) => {
      toast.error("Failed to send email", {
        description: error.message,
      });
    },
  });

  const handleSend = () => {
    // Validate email
    if (!recipientEmail || !recipientEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    sendEmailMutation.mutate({
      proposalId,
      recipientEmail,
      recipientName: recipientName || undefined,
      subject: subject || undefined,
      message: message || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Proposal to Client
          </DialogTitle>
          <DialogDescription>
            Send this proposal via email with tracking enabled. You'll be
            notified when the client opens and views it.
          </DialogDescription>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-4 py-4">
            {/* Recipient Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Recipient Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="client@company.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>

            {/* Recipient Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Recipient Name (Optional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>

            {/* Subject Line */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                type="text"
                placeholder={`Proposal: ${proposalTitle}`}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message to your client..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This message will appear at the top of the email before the
                proposal summary.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">To:</p>
                <p className="text-sm">{recipientEmail}</p>
              </div>
              {recipientName && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name:
                  </p>
                  <p className="text-sm">{recipientName}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Subject:
                </p>
                <p className="text-sm">{subject}</p>
              </div>
              {message && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Message:
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{message}</p>
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  The email will include a beautifully formatted proposal
                  summary with a "View Interactive Proposal" button that
                  includes tracking.
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {!showPreview ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
                disabled={!recipientEmail}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                type="button"
                onClick={handleSend}
                disabled={sendEmailMutation.isPending || !recipientEmail}
              >
                {sendEmailMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Proposal
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(false)}
              >
                Back to Edit
              </Button>
              <Button
                type="button"
                onClick={handleSend}
                disabled={sendEmailMutation.isPending}
              >
                {sendEmailMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

