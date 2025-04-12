import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type MemberWithUser } from "../types/types";
import { ApplicationCard } from "./ApplicationCard";

interface ApplicationTabsProps {
  pendingApplications: MemberWithUser[];
  approvedApplications: MemberWithUser[];
  rejectedApplications: MemberWithUser[];
  onApprove: (memberId: string, memberName: string) => void;
  onReject: (memberId: string, memberName: string) => void;
  onViewImage: (image: string) => void;
  isProcessing?: boolean;
}

export function ApplicationTabs({
  pendingApplications,
  approvedApplications,
  rejectedApplications,
  onApprove,
  onReject,
  onViewImage,
  isProcessing,
}: ApplicationTabsProps) {
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
    <Tabs defaultValue="pending" className="space-y-6">
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
  );
}