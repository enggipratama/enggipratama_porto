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

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 0 },
  });

  const json = await res.json();
  return json.data.user;
}
