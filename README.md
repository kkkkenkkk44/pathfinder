# Pathfinder

This repository contains the Pathfinder, a full-stack web server that can create personalized information wall with different keywords and article sources using n8n.


## Usage

### Installation & Running

Clone the repo
```
git clone "https://github.com/kkkkenkkk44/pathfinder.git"
```

Option 1 - Local Setup

1. For the backend, install required packages and run the following command.
```
node server.js
```
2. For the frontend, install required packages and run the following command.
```
npm run dev
```
3. Access the website using your own browser.
```
http://localhost:{PORT}
```

Option 2 - Docker Setup

1. Make sure to stop all services in the container.
```
docker-compose down
```
2. Compile the docker
```
docker-compose up -d --build
```
3. (Optionally) Check logs for debugging.
```
docker-compose logs -f
```

## Code Architecture

### Directory Structure
just list some important files

```shell
.
├── backend
│   └── config
│   │   └── config.json                            # Saves all setting content from frontend
│   ├── Dockerfile
│   ├── schedule.js                                # Handles scheduling task by checking the config.json every fixed time amount
│   ├── server.js                                  # Handles all backend tasks, including GitHub Authentication, config.json storage, and scheduling
├── frontend
│   └── src
│   │   └── components                             # Saves all setting content from frontend
│   │   │   └── dashboard                          # Packages all configs from each panel in one context
│   │   │   │   └── AdPanel.jsx                    # Ad panel design
│   │   │   │   └── LogoutPanel.jsx                # Log out panel design
│   │   │   │   └── NewsPanel.jsx                  # Keywords and sources panel design
│   │   │   │   └── PromptPanel.jsx                # LLM prompt panel design
│   │   │   │   └── SettingsReviewPanel.jsx        # Review panel design
│   │   │   │   └──SocialMediaConfigPanel.jsx      # Social media credentials panel design
│   │   │   └── AppBarHeader.jsx                   # Website header design
│   │   │   └── DrawerSidebar.jsx                  # Handles drawer side bar
│   │   └── context                                # Saves all setting content from frontend
│   │   │   └── AppContext.jsx                     # Packages all configs from each panel in one context
│   │   └── pages
│   │   │   └── Callback.jsx                       # Handles GitHub Authentication callback
│   │   │   └── Dashboard.jsx                      # Configures all panels in dashboard
│   │   │   └── SignIn.jsx                         # Handles GitHub sign in page
│   ├── Dockerfile
├── docker-compose.yml                             # Yaml file for docker
```
