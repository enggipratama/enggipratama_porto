import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/admin-activity";

// POST: Scan and delete orphaned/unused files in Supabase Storage
export async function POST() {
  try {
    // 1. Authenticate admin
    await requireAdmin();

    const supabase = await createSupabaseServerClient();

    // 2. Fetch all files currently in Supabase Storage uploads/ folder
    const { data: files, error: storageError } = await supabase.storage
      .from("portfolio-images")
      .list("uploads", { limit: 500 });

    if (storageError) {
      return NextResponse.json(
        { success: false, error: `Storage scan failed: ${storageError.message}` },
        { status: 500 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No files found in storage. Nothing to clean up.",
        deletedCount: 0,
        deletedFiles: [],
      });
    }

    // 3. Fetch all referenced images/documents in site_settings table
    const { data: settings, error: settingsError } = await supabase
      .from("site_settings")
      .select("value");

    if (settingsError) {
      return NextResponse.json(
        { success: false, error: `Database fetch failed: ${settingsError.message}` },
        { status: 500 }
      );
    }

    // 4. Fetch all referenced images in projects table
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("image_url");

    if (projectsError) {
      return NextResponse.json(
        { success: false, error: `Database fetch failed: ${projectsError.message}` },
        { status: 500 }
      );
    }

    // 5. Combine and extract all URLs referenced in the DB
    const dbUrls = new Set<string>();

    function extractUrls(val: unknown) {
      if (typeof val === "string") {
        if (val.startsWith("http")) {
          dbUrls.add(val);
        }
      } else if (Array.isArray(val)) {
        val.forEach(extractUrls);
      } else if (typeof val === "object" && val !== null) {
        Object.values(val).forEach(extractUrls);
      }
    }

    settings?.forEach((row) => extractUrls(row.value));
    projects?.forEach((row) => {
      if (row.image_url) {
        dbUrls.add(row.image_url);
      }
    });

    // 6. Find files in Supabase Storage not referenced in the DB
    const unusedFilesPaths: string[] = [];
    const unusedFilesNames: string[] = [];

    files.forEach((file) => {
      // Ignore placeholder files
      if (file.name === ".emptyFolderPlaceholder") return;

      // Check if this file name is referenced in any database URL
      let isReferenced = false;
      for (const dbUrl of dbUrls) {
        if (dbUrl.includes(file.name)) {
          isReferenced = true;
          break;
        }
      }

      if (!isReferenced) {
        unusedFilesPaths.push(`uploads/${file.name}`);
        unusedFilesNames.push(file.name);
      }
    });

    // 7. Perform deletion if orphaned files are found
    if (unusedFilesPaths.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from("portfolio-images")
        .remove(unusedFilesPaths);

      if (deleteError) {
        return NextResponse.json(
          { success: false, error: `Storage deletion failed: ${deleteError.message}` },
          { status: 500 }
        );
      }

      // Log this cleanup action to the Admin Activity Log
      await logActivity("settings_update", `Storage cleanup: Removed ${unusedFilesPaths.length} orphaned files.`);

      return NextResponse.json({
        success: true,
        message: `Successfully cleaned up ${unusedFilesPaths.length} orphaned files.`,
        deletedCount: unusedFilesPaths.length,
        deletedFiles: unusedFilesNames,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Storage is clean. No orphaned files detected.",
      deletedCount: 0,
      deletedFiles: [],
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
