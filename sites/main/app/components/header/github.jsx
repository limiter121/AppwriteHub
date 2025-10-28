"use client";

import GitHubButton from "react-github-btn";

export default function HeaderGithub(props) {
  return (
    <div className="github-btn">
      <GitHubButton
        href="https://github.com/limiter121/AppwriteHub"
        data-color-scheme="no-preference: light; light: light; dark: dark;"
        data-icon="octicon-star"
        data-size="large"
        data-show-count="true"
        aria-label="Star limiter121/AppwriteHub on GitHub"
      >
        Star
      </GitHubButton>
    </div>
  );
}
