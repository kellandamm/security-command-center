# Security Command Center - Zero Trust E-Commerce Demo

Enhanced Security Command Center with comprehensive historical monitoring and real-time threat visualization.

**🚀 Live Demo**: https://zealous-bush-0e1721e0f.1.azurestaticapps.net  
**📊 Repository**: https://github.com/kellandamm/security-command-center  
**🔄 Deployment**: Automated via GitHub Actions to Azure Static Web Apps
**🔧 Status**: Fresh deployment token generated and updated

## Features

### 🛡️ Security Monitoring
- **Real-time Network Topology**: Live visualization of network infrastructure
- **Security Event Logging**: Comprehensive attack detection and response tracking
- **Threat Metrics Dashboard**: Historical performance analytics and trending
- **Agent Performance Tracking**: Individual security agent monitoring

### 🎯 Demo Capabilities
- **Attack Simulations**: 6 different attack scenarios (DDoS, Data Exfiltration, etc.)
- **Historical Timeline**: Complete security event history with detailed logs
- **Multi-View Dashboard**: Network, Events, and Metrics views
- **Professional UI**: Enterprise-grade interface for stakeholder presentations

### 🔧 Technical Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion animations
- **Icons**: Lucide React
- **Deployment**: Azure Static Web Apps
- **CI/CD**: GitHub Actions

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The application is automatically deployed to Azure Static Web Apps via GitHub Actions when code is pushed to the main branch.

**Live Demo**: https://zealous-bush-0e1721e0f.1.azurestaticapps.net

### Accessing the Admin Dashboard

1. Navigate to the demo site
2. Use the password: `SecureAdmin2024!`
3. Click on "Security Dashboard" in the navigation
4. Explore the different views: Network, Security Events, Threat Metrics

## Usage

### Running Attack Simulations

1. Go to the **Simulation Controls** tab
2. Choose from 6 attack types:
   - DDoS Attack
   - Data Exfiltration  
   - Account Takeover
   - Malware Detection
   - Network Intrusion
   - Privilege Escalation
3. Click "Start Simulation" to begin
4. Monitor real-time changes in the Network Topology
5. View detailed logs in the Security Events tab

### Viewing Historical Data

1. Switch to **Security Events** tab to see:
   - Complete attack timeline
   - Agent responses and actions taken
   - Attack severity and status
   - Source IP addresses and descriptions

2. Switch to **Threat Metrics** tab to see:
   - Real-time threat statistics
   - Historical performance data
   - Agent performance analytics
   - Success rates and response times

## Security Agents

The system includes 6 specialized security agents:

- **Zero-Trust Agent Alpha**: Core zero-trust policy enforcement
- **Firewall Guardian Beta**: Network perimeter protection  
- **Network Sentinel Gamma**: Traffic analysis and monitoring
- **Endpoint Defender Delta**: Device-level threat detection
- **Data Protection Epsilon**: Information security and DLP
- **Access Control Zeta**: Identity and access management

## Architecture

```
├── src/
│   ├── components/
│   │   ├── admin/          # Admin dashboard components
│   │   ├── security/       # Security monitoring components
│   │   └── layout/         # Layout and navigation
│   ├── services/          # API services and utilities
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Helper functions
├── public/                # Static assets
└── dist/                  # Production build output
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
