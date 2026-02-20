import { NextResponse } from "next/server";

export async function GET() {
  const query = `
    {
      user(login: "${process.env.GITHUB_USERNAME}") {
        repositories(ownerAffiliations: OWNER, isFork: false) {
          totalCount
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              id
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
      throw new Error(json.errors[0]?.message || "GraphQL error");
    }

    return NextResponse.json(json.data.user);
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      {
        repositories: { totalCount: 0 },
        contributionsCollection: {
          contributionCalendar: { totalContributions: 0 },
        },
        pinnedItems: { nodes: [] },
      },
      { status: 500 }
    );
  }
}
