import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getGitHubProfile(username: string) {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, {
          headers: {
            'User-Agent': 'NestJS-GitHub-Profile-Viewer',
            'Accept': 'application/vnd.github.v3+json',
          },
        }),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
          headers: {
            'User-Agent': 'NestJS-GitHub-Profile-Viewer',
            'Accept': 'application/vnd.github.v3+json',
          },
        }),
      ]);

      if (!userRes.ok) {
        if (userRes.status === 404) {
          throw new HttpException('GitHub user not found', HttpStatus.NOT_FOUND);
        }
        throw new HttpException(
          `Failed to fetch from GitHub API: ${userRes.statusText}`,
          userRes.status,
        );
      }

      const data = await userRes.json();
      
      let repos = [];
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        repos = reposData.map((repo: any) => ({
          name: repo.name,
          description: repo.description || 'No description available',
          html_url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || 'Mixed',
          updated_at: repo.updated_at,
        }));
      }

      return {
        username: data.login,
        name: data.name || data.login,
        bio: data.bio || 'No bio available',
        public_repos: data.public_repos,
        public_gists: data.public_gists || 0,
        followers: data.followers,
        following: data.following,
        avatar_url: data.avatar_url,
        html_url: data.html_url,
        location: data.location || 'Unknown',
        company: data.company || 'None',
        blog: data.blog || '',
        twitter_username: data.twitter_username || '',
        created_at: data.created_at,
        repos,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
