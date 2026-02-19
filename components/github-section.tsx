import { getGitHubData } from "@/lib/github";
import { Star, GitFork, Code2, Github, Activity } from "lucide-react";
import GithubHeatmap from "@/components/github-heatmap";
interface GitHubRepo {
  id: string;
  name: string;
  description: string | null;
  url: string;
  html_url?: string;
  stargazerCount?: number;
  stargazers_count?: number;
  forkCount?: number;
  forks_count?: number;
  language?: string;
  primaryLanguage?: {
    name: string;
    color: string;
  } | null;
}
interface GitHubDataResponse {
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
    };
  };
  pinnedItems: {
    nodes: GitHubRepo[];
  };
}
export default async function GithubSection() {
  const data: GitHubDataResponse = await getGitHubData();
  const repos = data.pinnedItems.nodes;
  const totalContributions =
    data.contributionsCollection.contributionCalendar.totalContributions;
  const username = process.env.GITHUB_USERNAME || "";
  return (
    <section
      className="py-10 p-10 md:py-16 md:px-20 lg:px-32 scroll-mt-10 flex flex-col items-center"
      id="github"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Github Repositories</h2>

        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-200 dark:border-green-800">
          <Activity size={16} className="animate-pulse" />
          <span className="whitespace-nowrap">
            {totalContributions.toLocaleString()} contributions in the last year
          </span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-6 w-full pt-6">
        <GithubHeatmap username={username} />
        {repos.map((repo: GitHubRepo) => (
          <div
            key={repo.id}
            className="w-full md:w-[calc(50%-24px)] lg:w-[calc(33.333%-24px)] max-w-sm border-2 p-6 rounded-xl hover:shadow-lg transition bg-gray-50 dark:bg-black shadow-sm flex flex-col"
          >
            <h3 className="font-semibold text-sky-500 text-lg">
              <a
                href={repo.url || repo.html_url}
                target="_blank"
                className="hover:underline flex items-center gap-2"
              >
                <Github
                  size={20}
                  className="text-gray-600 dark:text-gray-400"
                />
                <span>{repo.name}</span>
              </a>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 my-3 line-clamp-2">
              {repo.description || "No description."}
            </p>
            <div className="flex items-center gap-4 text-xs mt-auto pt-4">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500" />{" "}
                {repo.stargazerCount || repo.stargazers_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <GitFork size={14} className="text-sky-500" />{" "}
                {repo.forkCount || repo.forks_count || 0}
              </span>
              <span className="ml-auto flex items-center gap-1.5 bg-slate-200 dark:bg-slate-900 px-2 py-1 rounded-md">
                <Code2 size={12} />
                {repo.language ||
                  (repo.primaryLanguage && repo.primaryLanguage.name)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
