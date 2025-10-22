import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { FileText, Plus, Eye, MoreVertical, Edit, Copy, Trash2, BarChart3, Loader2, Mail } from "lucide-react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { SendProposalDialog } from "@/components/SendProposalDialog";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [sendDialogProposal, setSendDialogProposal] = useState<{ id: number; title: string; clientName: string } | null>(null);
  
  const { data: proposals, isLoading, refetch } = trpc.proposals.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const deleteMutation = trpc.proposals.delete.useMutation({
    onSuccess: () => {
      toast.success("Proposal deleted successfully");
      refetch();
      setDeletingId(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete proposal: ${error.message}`);
      setDeletingId(null);
    },
  });

  const duplicateMutation = trpc.proposals.duplicate.useMutation({
    onSuccess: (data) => {
      toast.success("Proposal duplicated successfully");
      refetch();
      setLocation(`/proposal/${data.id}/edit`);
    },
    onError: (error) => {
      toast.error(`Failed to duplicate proposal: ${error.message}`);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ffdfb5]">
        <Loader2 className="w-8 h-8 animate-spin text-[#644a40]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  const handleDelete = (id: number, projectName: string) => {
    if (confirm(`Are you sure you want to delete "${projectName}"? This cannot be undone.`)) {
      setDeletingId(id);
      deleteMutation.mutate({ id });
    }
  };

  const handleDuplicate = (id: number) => {
    duplicateMutation.mutate({ id });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      draft: { label: "Draft", className: "bg-gray-200 text-gray-800" },
      published: { label: "Published", className: "bg-green-100 text-green-800" },
      archived: { label: "Archived", className: "bg-orange-100 text-orange-800" },
    };
    
    const config = variants[status] || variants.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#ffdfb5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <FileText className="w-8 h-8 text-[#644a40]" />
              <span className="text-2xl font-bold text-gray-900">Tempo</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.name || user?.email}
            </span>
            <Button
              onClick={() => setLocation("/create-ai")}
              className="bg-[#644a40] hover:bg-[#4a3530] text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              New Proposal
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your Proposals</h1>
          <p className="text-sm md:text-base text-gray-600">Manage and track all your proposals in one place</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow active:scale-98" onClick={() => setLocation("/create-ai")}>
            <CardHeader className="pb-4">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#644a40]" />
                Generate with AI
              </CardTitle>
              <CardDescription>Create proposals in seconds with AI assistance</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow active:scale-98" onClick={() => setLocation("/templates")}>
            <CardHeader className="pb-4">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#644a40]" />
                Browse Templates
              </CardTitle>
              <CardDescription>Start with professional industry templates</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow active:scale-98" onClick={() => setLocation("/create")}>
            <CardHeader className="pb-4">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#644a40]" />
                Create Manually
              </CardTitle>
              <CardDescription>Build a custom proposal from scratch</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Proposals List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#644a40]" />
          </div>
        ) : proposals && proposals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="hover:shadow-lg transition-shadow relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(proposal.status)}
                      </div>
                      <CardTitle className="text-lg mb-1">{proposal.projectName}</CardTitle>
                      <CardDescription>{proposal.clientName}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-10 w-10 md:h-8 md:w-8 p-0">
                          <MoreVertical className="w-5 h-5 md:w-4 md:h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => setLocation(`/proposal/${proposal.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Proposal
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocation(`/proposal/${proposal.id}/edit`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocation(`/proposal/${proposal.id}/analytics`)}>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSendDialogProposal({ id: proposal.id, title: proposal.title, clientName: proposal.clientName })}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send to Client
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(proposal.id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(proposal.id, proposal.projectName)}
                          className="text-red-600 focus:text-red-600"
                          disabled={deletingId === proposal.id}
                        >
                          {deletingId === proposal.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                          )}
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="font-medium">{format(new Date(proposal.createdAt), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valid Until:</span>
                      <span className="font-medium">{format(new Date(proposal.validUntil), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pricing Tiers:</span>
                      <span className="font-medium">{proposal.pricingTiers.length}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setLocation(`/proposal/${proposal.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setLocation(`/proposal/${proposal.id}/edit`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No proposals yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first proposal</p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setLocation("/create-ai")}
                  className="bg-[#644a40] hover:bg-[#4a3530] text-white gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Generate with AI
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/templates")}
                >
                  Browse Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Send Proposal Dialog */}
      {sendDialogProposal && (
        <SendProposalDialog
          open={!!sendDialogProposal}
          onOpenChange={(open) => !open && setSendDialogProposal(null)}
          proposalId={sendDialogProposal.id}
          proposalTitle={sendDialogProposal.title}
          clientName={sendDialogProposal.clientName}
        />
      )}
    </div>
  );
}

