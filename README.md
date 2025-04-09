# OpsFloww Backend API

A robust Node.js backend for the OpsFloww project management system.

## Features

- User authentication and authorization
- Project management
- Task tracking
- Time tracking
- Attendance management
- Team collaboration
- Analytics and reporting
- File management

## Prerequisites

- Node.js 18.x or higher
- MongoDB 4.4 or higher
- Redis (optional, for rate limiting and caching)

## Installation

1. Clone the repository:
  \`\`\`bash
  git clone https://github.com/your-username/opsfloww-backend.git
  cd opsfloww-backend
  \`\`\`

2. Install dependencies:
  \`\`\`bash
  npm install
  \`\`\`

3. Create a `.env` file based on `.env.example`:
  \`\`\`bash
  cp .env.example .env
  \`\`\`

4. Update the `.env` file with your configuration

5. Start the development server:
  \`\`\`bash
  npm run dev
  \`\`\`

## Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server
- `npm test`: Run tests

## API Documentation

API routes are organized by feature areas:

- Authentication: `/api/v1/auth/*`
- User Management: `/api/v1/users/*`
- Projects: `/api/v1/projects/*`
- Tasks: `/api/v1/tasks/*`
- Time Tracking: `/api/v1/time-entries/*`
- Attendance: `/api/v1/attendance/*`
- Dashboard: `/api/v1/dashboard/*`
- Analytics: `/api/v1/analytics/*`
- Calendar: `/api/v1/calendar/*`
- Collaboration: `/api/v1/collaboration/*`
- Notifications: `/api/v1/notifications/*`
- Files: `/api/v1/files/*`

For detailed API documentation, see the [API Documentation](docs/api.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
