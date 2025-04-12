import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { type MemberWithUser } from "../types/types";

interface ApplicationCardProps {
  application: MemberWithUser;
  onApprove?: (memberId: string, memberName: string) => void;
  onReject?: (memberId: string, memberName: string) => void;
  onViewImage: (image: string) => void;
  isProcessing?: boolean;
}

export function ApplicationCard({
  application,
  onApprove,
  onReject,
  onViewImage,
  isProcessing,
}: ApplicationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{application.englishName}</span>
          {application.status === "PENDING" && onApprove && onReject && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  onReject(application.id, application.englishName)
                }
                disabled={isProcessing}
                className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
              >
                Reject
              </Button>
              <Button
                onClick={() =>
                  onApprove(application.id, application.englishName)
                }
                disabled={isProcessing}
              >
                Approve
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">
              Personal Information
            </p>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Name: </span>
                {application.salutation} {application.englishName}
              </p>
              <p>
                <span className="font-medium">Gender: </span>
                {application.gender}
              </p>
              <p>
                <span className="font-medium">Email: </span>
                {application.user!.email}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">
              Academic Information
            </p>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Faculty: </span>
                {application.faculty}
              </p>
              <p>
                <span className="font-medium">Major: </span>
                {application.major}
              </p>
              <p>
                <span className="font-medium">Class: </span>
                {application.class}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">
              Application Details
            </p>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Membership Type: </span>
                {application.membershipType}
              </p>
              <p>
                <span className="font-medium">Applied on: </span>
                {formatDate(application.createdAt)}
              </p>
              {application.status === "REJECTED" && application.rejectionReason && (
                <p>
                  <span className="font-medium">Rejection Reason: </span>
                  <span className="text-red-600">
                    {application.rejectionReason}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">
              Contact Information
            </p>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Phone: </span>
                {application.phoneNumber}
              </p>
              {application.address && (
                <p>
                  <span className="font-medium">Address: </span>
                  {application.address}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-500">Student ID Image</p>
          <button
            onClick={() => onViewImage(application.studentIdImage)}
            className="mt-2 overflow-hidden rounded-lg transition-opacity hover:opacity-80"
          >
            <img
              src={application.studentIdImage}
              alt="Student ID"
              className="max-h-[200px] object-cover"
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}