<img src="logo.png" width="128"/>

# [AppwriteHub](https://hub.appwrite.network)

**Tired of reinventing the wheel?**


AppwriteHub is a centralized community-driven platform for discovering, deploying, and managing  powerful pre-built functionalities for your Appwrite projects - no tedious configuration or complex boilerplate needed.

- **Zero Setup**: Deploy features in minutes, not days or weeks
- **Community Powered**: Leverage the power of the vibrant, global network of Appwrite developers to solve common project needs
- **Easily Maintained**: A centralized way to track and apply updates to your deployed functionalities

## What is a Functionality?

A **Functionality** is a self-contained, versioned archive of a miniature Appwrite project (complete with Databases, Functions, Sites and more) — ready to be installed automatically straight into your linked Appwrite project.

## How it works

Integrating AppwriteHub features into your project is as easy as:

1.  Provide your Appwrite **Endpoint**, **Project ID**, and a dedicated **API Key** to link your project
2.  AppwriteHub automatically installs the essential **AppwriteHub Core** Functionality into your project to enable easy management
3.  That's it! You can now use the AppwriteHub *Dashboard* to easily **install, update, and manage** all your functionalities

##  Project components

### 1. Main webapp (`sites/main`)

This is the central web application where users can **browse**, **discover**, and **manage** available Appwrite functionalities. It serves as the primary user interface for integrating AppwriteHub features into their own projects.    

### 2. Functions (`functions/`)

Internal specialized Appwrite Functions that power the Hub's automation and management features.

- `functions/linker`: responsible for linking a user's Appwrite project to the AppwriteHub. It also installs the *AppwriteHub Core*, enabling future management
-  `functions/installer`: automatically provisions all the resources used by the functionality (Databases, Functions, Sites, and more) into the linked project
- `functions/syncer`: periodically checks and syncs all linked projects (including status, installed functionalities, etc.) with AppwriteHub
- `functions/updater`: periodically checks and updates functionalities in linked projects (opt-in) - **PLANNED**

### 3. Functionalities (`functionalities/`)

Functionalities built and maintained by the AppwriteHub team - including essentials like the *AppwriteHub Core*.

## Technical Setup

This monorepo contains the entire AppwriteHub project. Follow these steps to get a local development environment running.

1. **Prerequisites**
-   Appwrite instance (Cloud or self-hosted)
-   Appwrite CLI

2. **Clone and Configure**
```
git clone https://github.com/limiter121/AppwriteHub.git
cd AppwriteHub
appwrite login
appwrite init project
appwrite push all
```

## 👋 Contributing

Contributions are welcome! As this is a community-driven project, you can shape the future of AppwriteHub - start coding now!

1.  Fork the repository.
2.  Do your magic...
3.  Submit a Pull Request!