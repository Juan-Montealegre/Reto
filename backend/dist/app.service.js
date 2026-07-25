"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
    async getGitHubProfile(username) {
        try {
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`, {
                    headers: {
                        'User-Agent': 'NestJS-GitHub-Profile-Viewer',
                    },
                }),
                fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
                    headers: {
                        'User-Agent': 'NestJS-GitHub-Profile-Viewer',
                    },
                }),
            ]);
            if (!userRes.ok) {
                if (userRes.status === 404) {
                    throw new common_1.HttpException('GitHub user not found', common_1.HttpStatus.NOT_FOUND);
                }
                throw new common_1.HttpException(`Failed to fetch from GitHub API: ${userRes.statusText}`, userRes.status);
            }
            const data = await userRes.json();
            let repos = [];
            if (reposRes.ok) {
                const reposData = await reposRes.json();
                repos = reposData.map((repo) => ({
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
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error instanceof Error ? error.message : 'Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map