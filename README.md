# GitHub Issues Tracker Panel

> ⚠️ **Note:** This is a pre-release plugin and has not yet been officially accepted by Grafana. Use at your own discretion.

A Grafana panel plugin that displays GitHub issues from your repositories using the GitHub REST API. Perfect for tracking open issues, pull requests, and project activity directly in Grafana dashboards.

## Features

- Display a list of GitHub issues with title, labels, and status.
- Filter issues by repository, label, or assignee.
- Live updates from GitHub API.
- Fully customizable panel styling.
- Built with React and TypeScript.
- Includes end-to-end tests using Playwright.
- Ready-to-use Docker development setup.


## Installation

> Since this plugin is not yet officially published, you need to build it locally.

```bash
# Clone your plugin (or copy your project)
git clone https://github.com/<your-username>/kavyalegitimate-githubissues-panel.git
cd kavyalegitimate-githubissues-panel

# Install frontend dependencies
npm install

# Install Playwright browser for E2E tests
npm exec playwright install chromium

# Run development build with hot reload
npm run dev

# Start Grafana development server using Docker
docker compose 
```

- Open http://localhost:3000
 and log in with admin / admin to add your panel to a dashboard.

## Configuration

- Add the GitHub Issues Tracker Panel to your dashboard.

- Enter your GitHub Personal Access Token (recommended for private repos).

- Choose the repository or organization.

- Apply filters such as labels, assignees, or issue state.

- Save the panel settings.

## Development

This plugin uses React, TypeScript, and Grafana Plugin SDK:

- Source code: src folder

- Panel components: src/components

- Tests: e2e folder with Playwright


### Common commands
```
npm run dev          # Build and watch frontend
npm run test:e2e     # Run E2E tests
docker compose up    # Start Grafana dev server
```

## Contribution

Contributions are welcome! You can:

- Add new features

- Fix bugs

- Improve styling or performance

- Add more GitHub API integrations

- Before submitting a PR, make sure all tests pass:


## License

MIT License © Kavya

## Acknowledgements

- Built using Grafana Plugin SDK

- Powered by GitHub REST API

- End-to-end testing using Playwright
