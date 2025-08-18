# 🏙️ Smart City Dashboard

A modern, responsive React application for monitoring and managing smart city infrastructure with real-time traffic, pollution, and weather data visualization.

## ✨ Features

### 🗺️ 3D Map Visualization
- Interactive 3D city map built with Three.js
- Real-time traffic visualization with animated vehicles
- Pollution overlays with color-coded intensity
- Clickable zones showing detailed information
- Dynamic building layouts representing different city areas

### 📊 Live Dashboard
- Real-time charts using Recharts for traffic and pollution trends
- Live weather panel with air quality metrics
- Color-coded alert system (green/yellow/red)
- Statistical overview cards with trend indicators
- Auto-refreshing data every 5 seconds

### ⚙️ Automation Rules
- Create, edit, and delete automation rules
- Condition-based triggers (traffic > 80%, pollution > 60%)
- Multiple action types (alerts, rerouting, notifications)
- Enable/disable rules with status indicators
- Advanced filtering and search capabilities

### 🧪 Scenario Testing
- AI-powered traffic prediction system
- Test different event scenarios (road closures, accidents, etc.)
- Custom traffic and pollution value overrides
- Confidence scoring for predictions
- Historical test results tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm
- Backend API server (optional - mock data included)

### Installation & Setup

1. **Clone and setup:**
   ```bash
   # Make setup script executable (if needed)
   chmod +x setup.sh
   
   # Install dependencies and start development server
   ./setup.sh
   ```

2. **Alternative manual setup:**
   ```bash
   npm install
   npm run dev
   ```

3. **Access the application:**
   - Open http://localhost:3000 in your browser

### Available Commands

```bash
./setup.sh install  # Install dependencies only
./setup.sh dev      # Start development server (default)
./setup.sh build    # Build for production
./setup.sh preview  # Preview production build
./setup.sh help     # Show help information
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_NAME="Smart City Dashboard"
VITE_API_URL=http://localhost:8000
VITE_POLLING_INTERVAL=5000
```

### Backend API Integration

The application expects these backend endpoints:

#### Weather API
- `GET /weather/latest` - Returns current weather data
```json
{
  "temperature": 22.5,
  "humidity": 65,
  "windSpeed": 12,
  "pollution": {
    "pm25": 18,
    "pm10": 28,
    "aqi": 45
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Traffic API
- `GET /traffic/latest` - Returns current traffic data
```json
{
  "zones": [
    {
      "id": "A",
      "name": "Downtown",
      "traffic": 75,
      "pollution": 45,
      "reroute_suggested": true,
      "vehicles": 150,
      "avgSpeed": 25
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### AI Prediction API
- `POST /scenario-bulk` - AI scenario predictions
```json
{
  "ts": "2024-01-15T10:30:00Z",
  "zones": [
    {
      "id": "A",
      "traffic": 80,
      "pollution": 50,
      "event": "road_closure"
    }
  ]
}
```

#### Automation Rules API
- `GET /automation-rules` - List all rules
- `POST /automation-rules` - Create new rule
- `PUT /automation-rules/:id` - Update rule
- `DELETE /automation-rules/:id` - Delete rule

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Dashboard/          # Dashboard widgets and charts
│   ├── Map/               # 3D map components
│   ├── AutomationRules/   # Rule management components
│   └── Layout/            # Navigation and layout
├── pages/                 # Main page components
├── context/               # React context for state management
├── services/              # API service layer
└── styles/                # CSS and styling
```

## 🎨 UI Components

### Dashboard Features
- **Stats Cards**: Real-time metrics with trend indicators
- **Traffic Chart**: Line chart showing traffic trends over time
- **Pollution Chart**: Area chart displaying pollution levels
- **Weather Panel**: Current weather and air quality data
- **Alerts Panel**: Live alerts with color-coded severity

### 3D Map Features
- **Interactive Zones**: Click zones for detailed information
- **Vehicle Animation**: Moving vehicles based on traffic data
- **Pollution Overlays**: Semi-transparent fog indicating pollution
- **Building Layouts**: Different building heights for zone types
- **Camera Controls**: Pan, zoom, and rotate the 3D view

### Automation Features
- **Rule Table**: Sortable table with search and filters
- **Rule Form**: Modal form for creating/editing rules
- **Status Toggles**: Enable/disable rules with visual feedback
- **Condition Builder**: Helper for building rule conditions

### Scenario Testing
- **Event Simulator**: Test various traffic scenarios
- **AI Predictions**: Machine learning-powered forecasts
- **Impact Visualization**: Before/after comparisons
- **History Tracking**: Previous test results

## 🔄 Real-time Updates

The application automatically polls for updates every 5 seconds:
- Weather data refresh
- Traffic data updates
- Alert status changes
- Map visualization updates

## 🎯 Mock Data

When backend APIs are unavailable, the application uses realistic mock data:
- Randomized traffic patterns
- Simulated weather conditions
- Generated pollution levels
- Fake automation rules

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar navigation
- Responsive grid layouts
- Touch-friendly controls
- Optimized for tablets and phones

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite
- **3D Graphics**: Three.js, React Three Fiber
- **Charts**: Recharts
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Routing**: React Router
- **HTTP Client**: Axios

## 🚀 Deployment

### Production Build
```bash
./setup.sh build
```

### Serve Production Build
```bash
./setup.sh preview
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the console for error messages
2. Verify backend API connectivity
3. Ensure all dependencies are installed
4. Check environment variable configuration

## 🔮 Future Enhancements

- WebSocket support for real-time updates
- Historical data analytics
- Advanced AI predictions
- Mobile app companion
- Multi-city support
- Custom dashboard widgets