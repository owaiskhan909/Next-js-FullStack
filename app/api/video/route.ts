import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import Video, { IVideo } from "../../../models/Video";
import { authOptions } from "../../../lib/auth";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find().sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json({ message: "No videos found" }, { status: 200 });
    }
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const Session = await getServerSession(authOptions);
    if (!Session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body: IVideo = await request.json();

    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
  } catch (error) {}
}
