import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// POST: Upload image file to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type: ${file.type}. Allowed types: jpg, jpeg, png, webp, gif, svg`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size is 5MB, got ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "png";
    const uniqueName = `${nanoid()}.${ext}`;
    const filePath = `uploads/${uniqueName}`;

    const supabase = await createSupabaseServerClient();

    // Delete old file if provided to prevent orphaned files in storage
    const oldUrl = formData.get("oldUrl") as string | null;
    if (oldUrl) {
      try {
        const marker = "/portfolio-images/";
        const index = oldUrl.indexOf(marker);
        if (index !== -1) {
          const oldPath = oldUrl.substring(index + marker.length);
          if (oldPath && !oldPath.startsWith("http")) {
            await supabase.storage.from("portfolio-images").remove([oldPath]);
          }
        }
      } catch (err) {
        console.error("Failed to delete old file from storage:", err);
      }
    }

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("portfolio-images")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { success: false, error: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      data: {
        url: urlData.publicUrl,
        path: filePath,
        filename: uniqueName,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
