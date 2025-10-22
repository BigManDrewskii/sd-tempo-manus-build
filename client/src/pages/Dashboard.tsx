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
import { FileText, Plus, Eye, MoreVertical, Edit, Copy, Trash2, BarChart3, Loader2, Mail, Search, Calendar, AlertCircle, Archive, ArchiveRestore } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Pagination } from "@/components/Pagination";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { SendProposalDialog } from "@/components/SendProposalDialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { differenceInDays } from "date-fns";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [sendDialogProposal, setSendDialogProposal] = useState<{ id: number; title: string; clientName: string } | null>(null);
  const [deleteDialogId, setDeleteDialogId] = useState<number | null>(null);
  
  // Filtering state
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "edited" | "expiring" | "client">("created");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const { data, isLoading, refetch } = trpc.proposals.list.useQuery(
    { page: currentPage, limit: itemsPerPage },
    { enabled: isAuthenticated }
  );
  
  const proposals = data?.proposals;
  const pagination = data?.pagination;

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
  
  const bulkArchiveMutation = trpc.proposals.bulkArchive.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.count} proposal(s) archived`);
      refetch();
      setSelectedIds(new Set());
    },
    onError: (error) => {
      toast.error(`Failed to archive: ${error.message}`);
    },
  });
  
  const bulkRestoreMutation = trpc.proposals.bulkRestore.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.count} proposal(s) restored`);
      refetch();
      setSelectedIds(new Set());
    },
    onError: (error) => {
      toast.error(`Failed to restore: ${error.message}`);
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

  // Filter and sort proposals - MUST be before early returns
  const filteredAndSortedProposals = useMemo(() => {
    if (!proposals || proposals.length === 0) return [];

    let filtered = proposals;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.projectName.toLowerCase().includes(query) ||
        p.clientName.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "edited":
          return new Date(b.lastEditedAt).getTime() - new Date(a.lastEditedAt).getTime();
        case "expiring":
          return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
        case "client":
          return a.clientName.localeCompare(b.clientName);
        default:
          return 0;
      }
    });

    return sorted;
  }, [proposals, statusFilter, searchQuery, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!proposals) return { total: 0, draft: 0, published: 0, archived: 0, expiringSoon: 0 };
    
    const now = new Date();
    return {
      total: proposals.length,
      draft: proposals.filter(p => p.status === "draft").length,
      published: proposals.filter(p => p.status === "published").length,
      archived: proposals.filter(p => p.status === "archived").length,
      expiringSoon: proposals.filter(p => {
        const daysUntilExpiry = differenceInDays(new Date(p.validUntil), now);
        return p.status === "published" && daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
      }).length,
    };
  }, [proposals]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-8">
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Filters skeleton */}
          <div className="space-y-4 mb-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          
          {/* Proposals skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Sign in to continue</CardTitle>
            <CardDescription>Access your proposals and create new ones</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Sign in with Google</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = (id: number) => {
    setDeleteDialogId(id);
  };
  
  const confirmDelete = () => {
    if (deleteDialogId) {
      setDeletingId(deleteDialogId);
      deleteMutation.mutate({ id: deleteDialogId });
      setDeleteDialogId(null);
    }
  };

  const handleDuplicate = (id: number) => {
    duplicateMutation.mutate({ id });
  };

  const toggleSelection = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Delete ${selectedIds.size} selected proposal(s)?`)) {
      selectedIds.forEach(id => deleteMutation.mutate({ id }));
      setSelectedIds(new Set());
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
      published: { label: "Published", className: "bg-green-100 text-green-700" },
      archived: { label: "Archived", className: "bg-gray-100 text-gray-500" },
    }[status] || { label: status, className: "" };

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Proposals</h1>
          <p className="text-gray-500">Manage and track all your proposals</p>
        </div>

        {/* Stats - Minimal Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Total</div>
            <div className="text-3xl font-semibold">{stats.total}</div>
          </div>
          <div 
            className="border border-gray-200 p-4 cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => setStatusFilter("draft")}
          >
            <div className="text-sm text-gray-500 mb-1">Drafts</div>
            <div className="text-3xl font-semibold">{stats.draft}</div>
          </div>
          <div 
            className="border border-gray-200 p-4 cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => setStatusFilter("published")}
          >
            <div className="text-sm text-gray-500 mb-1">Published</div>
            <div className="text-3xl font-semibold">{stats.published}</div>
          </div>
          <div 
            className="border border-gray-200 p-4 cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => setStatusFilter("archived")}
          >
            <div className="text-sm text-gray-500 mb-1">Archived</div>
            <div className="text-3xl font-semibold">{stats.archived}</div>
          </div>
          {stats.expiringSoon > 0 && (
            <div className="border border-orange-300 bg-orange-50 p-4">
              <div className="text-sm text-orange-700 mb-1">Expiring Soon</div>
              <div className="text-3xl font-semibold text-orange-700">{stats.expiringSoon}</div>
            </div>
          )}
        </div>

        {/* Filters - Clean */}
        <div className="mb-8 space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border-gray-300"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-48 h-10 border-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="edited">Last Edited</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="client">Client Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Tabs - Minimal */}
          <Tabs value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <TabsList className="border border-gray-200 bg-white p-1 h-10">
              <TabsTrigger value="all" className="data-[state=active]:bg-black data-[state=active]:text-white">
                All
              </TabsTrigger>
              <TabsTrigger value="draft" className="data-[state=active]:bg-black data-[state=active]:text-white">
                Drafts
              </TabsTrigger>
              <TabsTrigger value="published" className="data-[state=active]:bg-black data-[state=active]:text-white">
                Published
              </TabsTrigger>
              <TabsTrigger value="archived" className="data-[state=active]:bg-black data-[state=active]:text-white">
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
              <span className="text-sm text-gray-700">{selectedIds.size} selected</span>
              <div className="flex gap-2">
                {statusFilter === "archived" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkRestoreMutation.mutate({ ids: Array.from(selectedIds) })}
                  >
                    Restore Selected
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkArchiveMutation.mutate({ ids: Array.from(selectedIds) })}
                  >
                    Archive Selected
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete Selected
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Proposals List - Clean Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : filteredAndSortedProposals.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-300">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter !== "all" ? "No proposals found" : "No proposals yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Create your first proposal to get started"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button onClick={() => setLocation("/create-ai")} className="bg-black hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Create Proposal
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedProposals.map((proposal) => {
              const daysUntilExpiry = differenceInDays(new Date(proposal.validUntil), new Date());
              const isExpiringSoon = proposal.status === "published" && daysUntilExpiry >= 0 && daysUntilExpiry <= 7;

              return (
                <div
                  key={proposal.id}
                  className="border border-gray-200 hover:border-gray-400 transition-all p-5 group"
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="pt-1">
                      <Checkbox
                        checked={selectedIds.has(proposal.id)}
                        onCheckedChange={() => toggleSelection(proposal.id)}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">
                            {proposal.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{proposal.clientName}</span>
                            <span>•</span>
                            <span>{proposal.projectName}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(proposal.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setLocation(`/proposal/${proposal.id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setLocation(`/proposal/${proposal.id}/edit`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setLocation(`/proposal/${proposal.id}/analytics`)}>
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setSendDialogProposal({ id: proposal.id, title: proposal.title, clientName: proposal.clientName })}>
                                <Mail className="w-4 h-4 mr-2" />
                                Send to Client
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDuplicate(proposal.id)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              {proposal.status === "archived" ? (
                                <DropdownMenuItem
                                  onClick={() => bulkRestoreMutation.mutate({ ids: [proposal.id] })}
                                >
                                  <ArchiveRestore className="w-4 h-4 mr-2" />
                                  Restore
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => bulkArchiveMutation.mutate({ ids: [proposal.id] })}
                                >
                                  <Archive className="w-4 h-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDelete(proposal.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created {format(new Date(proposal.createdAt), "MMM d, yyyy")}</span>
                        <span>•</span>
                        <span>Expires {format(new Date(proposal.validUntil), "MMM d, yyyy")}</span>
                        {isExpiringSoon && (
                          <>
                            <span>•</span>
                            <span className="text-orange-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Expires in {daysUntilExpiry} days
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      {/* Send Dialog */}
      {sendDialogProposal && (
        <SendProposalDialog
          proposalId={sendDialogProposal.id}
          proposalTitle={sendDialogProposal.title}
          clientName={sendDialogProposal.clientName}
          open={!!sendDialogProposal}
          onOpenChange={(open) => !open && setSendDialogProposal(null)}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogId !== null}
        onOpenChange={(open) => !open && setDeleteDialogId(null)}
        onConfirm={confirmDelete}
        title="Delete Proposal"
        description="Are you sure you want to delete this proposal? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}

