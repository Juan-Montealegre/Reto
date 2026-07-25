export declare class AppService {
    getHello(): string;
    getGitHubProfile(username: string): Promise<{
        username: any;
        name: any;
        bio: any;
        public_repos: any;
        public_gists: any;
        followers: any;
        following: any;
        avatar_url: any;
        html_url: any;
        location: any;
        company: any;
        blog: any;
        twitter_username: any;
        created_at: any;
        repos: any;
    }>;
}
