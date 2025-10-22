import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

interface CustomizeTemplateDialogProps {
  template: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomizeTemplateDialog({ template, open, onOpenChange }: CustomizeTemplateDialogProps) {
  const [, setLocation] = useLocation();
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [validUntil, setValidUntil] = useState(format(addDays(new Date(), 30), "yyyy-MM-dd"));

  const cloneMutation = trpc.templates.clone.useMutation({
    onSuccess: (data) => {
      toast.success("Proposal created!", {
        description: "Your proposal is ready to customize and send.",
      });
      onOpenChange(false);
      setLocation(`/edit/${data.proposalId}`);
    },
    onError: (error) => {
      toast.error("Failed to create proposal", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !projectName) {
      toast.error("Missing information", {
        description: "Please fill in all required fields",
      });
      return;
    }

    cloneMutation.mutate({
      templateId: template.id,
      clientName,
      projectName,
      validUntil,
    });
  };

  if (!template) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black">Customize Your Proposal</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter your client and project details to get started with the <strong className="text-black">{template.name}</strong> template.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                placeholder="Acme Corporation"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                placeholder="Website Redesign"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
              />
              <p className="text-xs text-muted-foreground">
                Proposal will expire on this date
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={cloneMutation.isPending}
              className="border-gray-200 hover:border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={cloneMutation.isPending}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {cloneMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Proposal"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

