export async function getGitHubData() {
  const query = `
      {
        user(login: "${process.env.GITHUB_USERNAME}") {
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
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    if (json.errors) {
      throw new Error(`GraphQL error: ${json.errors[0]?.message || "Unknown error"}`);
    }

    if (!json.data?.user) {
      throw new Error("User not found or no data available");
    }

    return json.data.user;
  } catch (error) {
    console.error("Failed to fetch GitHub data:", error);
    return {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 0,
        },
      },
      pinnedItems: {
        nodes: [],
      },
    };
  }
}
