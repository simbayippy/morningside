import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type MemberWithUser } from "../types/types";
import { ApplicationCard } from "./ApplicationCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { format } from "date-fns";

interface ApplicationTabsProps {
  pendingApplications: MemberWithUser[];
  approvedApplications: MemberWithUser[];
  rejectedApplications: MemberWithUser[];
  onApprove: (memberId: string, memberName: string) => void;
  onReject: (memberId: string, memberName: string) => void;
  onViewImage: (image: string) => void;
  isProcessing?: boolean;
}

type ExportType = "pending" | "approved" | "rejected" | "all";

export function ApplicationTabs({
  pendingApplications,
  approvedApplications,
  rejectedApplications,
  onApprove,
  onReject,
  onViewImage,
  isProcessing,
}: ApplicationTabsProps) {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState<ExportType>("all");
  const [isDateRangeEnabled, setIsDateRangeEnabled] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleExport = () => {
    // Get the applications based on export type
    let applicationsToExport: MemberWithUser[] = [];
    switch (exportType) {
      case "pending":
        applicationsToExport = pendingApplications;
        break;
      case "approved":
        applicationsToExport = approvedApplications;
        break;
      case "rejected":
        applicationsToExport = rejectedApplications;
        break;
      case "all":
        applicationsToExport = [...pendingApplications, ...approvedApplications, ...rejectedApplications];
        break;
    }

    // Filter by date range if enabled and both dates are selected
    if (isDateRangeEnabled && startDate && endDate) {
      applicationsToExport = applicationsToExport.filter(app => {
        const appDate = new Date(app.createdAt);
        return appDate >= startDate && appDate <= endDate;
      });
    }

    // Convert to CSV
    const headers = [
      "Name",
      "Email",
      "Faculty",
      "Major",
      "Class",
      "Phone",
      "Membership Type",
      "Applied On",
      "Status",
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const csvData = applicationsToExport.map(app => [
        app.user?.name ?? "",
        app.user?.email ?? "",
        app.faculty ?? "",
        app.major ?? "",
        app.class ?? "",
        app.phoneNumber ?? "",
        app.membershipType,
        format(new Date(app.createdAt), "PPP"),
        exportType === "all" 
            ? (app.status === "APPROVED" ? "Approved" : app.status === "REJECTED" ? "Rejected" : "Pending")
            : exportType.charAt(0).toUpperCase() + exportType.slice(1),
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `membership-applications-${exportType}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    setExportDialogOpen(false);
  };

  const renderApplications = (applications: MemberWithUser[]) => {
    if (!applications.length) {
      return (
        <Card>
          <CardContent className="flex min-h-[200px] items-center justify-center text-gray-500">
            No applications found
          </CardContent>
        </Card>
      );
    }

    const DEFAULT_LEGACY_IMAGE = "https://czrsqvfoxplmypvmfykr.supabase.co/storage/v1/object/public/events/membership-images/360_F_272404412_MD9Qnk52bpTk9BEhpq2ZofYupyF8UWbg.jpg";

    return (
      <div className="space-y-6">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={{
              ...application,
              studentIdImage: application.studentIdImage === "LEGACY" 
                ? DEFAULT_LEGACY_IMAGE 
                : application.studentIdImage
            }}
            onApprove={onApprove}
            onReject={onReject}
            onViewImage={onViewImage}
            isProcessing={isProcessing}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="pending" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingApplications.length > 0 && (
                  <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                    {pendingApplications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                {approvedApplications.length > 0 && (
                  <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                    {approvedApplications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                {rejectedApplications.length > 0 && (
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                    {rejectedApplications.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  Export Data
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Export Membership & Applications Data</DialogTitle>
                  <DialogDescription>
                    Choose which applications to export and optionally filter by date range.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Application Type</Label>
                    <RadioGroup
                      defaultValue={exportType}
                      onValueChange={(value) => setExportType(value as ExportType)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">All Applications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pending" id="pending" />
                        <Label htmlFor="pending">Pending Applications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="approved" id="approved" />
                        <Label htmlFor="approved">Approved Applications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rejected" id="rejected" />
                        <Label htmlFor="rejected">Rejected Applications</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dateRange"
                        checked={isDateRangeEnabled}
                        onCheckedChange={(checked) => setIsDateRangeEnabled(checked as boolean)}
                      />
                      <Label htmlFor="dateRange">Filter by Application Date Range</Label>
                    </div>
                    {isDateRangeEnabled && (
                      <div className="grid gap-2 mt-2">
                        <div>
                          <Label className="text-sm text-muted-foreground">From</Label>
                          <DateTimePicker
                            value={startDate}
                            onChange={setStartDate}
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">To</Label>
                          <DateTimePicker
                            value={endDate}
                            onChange={setEndDate}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleExport}>
                    Download CSV
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="pending" className="mt-6">
            {renderApplications(pendingApplications)}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {renderApplications(approvedApplications)}
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            {renderApplications(rejectedApplications)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}