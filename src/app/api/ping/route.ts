import { db } from "@/server/db";
import { NextResponse } from "next/server";

// This is a simple API endpoint that can be called by a cron job
// to keep the Supabase instance active
export async function GET() {
  try {
    // Create a ping record
    const pingRecord = await db.pingRecord.create({
      data: {
        message: "Ping to keep Supabase alive via REST API",
      },
    });

    // Delete the ping record immediately
    await db.pingRecord.delete({
      where: {
        id: pingRecord.id,
      },
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date(),
      message: "Ping successful - created and deleted record to keep Supabase active",
    });
  } catch (error) {
    console.error("Error in ping endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to ping database",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
