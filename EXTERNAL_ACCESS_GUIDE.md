# External Access Setup Guide

This guide will help you configure Wagehire to be accessible from other devices on your network.

## 🚀 Quick Setup

### Step 1: Configure External Access
```bash
cd backend
npm run configure-external
```

This will:
- Detect your local IP address
- Configure email settings
- Set up the correct URLs for external access

### Step 2: Start the Servers

**Backend Server:**
```bash
cd backend
npm start
```

**Frontend Server (with external access):**
```bash
cd frontend
npm start
```

**Or use the batch file:**
```bash
cd frontend
start-external.bat
```

### Step 3: Access from Another Device

Use your computer's IP address to access the application:
```
http://192.168.12.41:3000
```

## 🔧 Manual Configuration

### Backend Configuration

1. **Update .env file:**
```env
# Frontend URL (for email links)
FRONTEND_URL=http://192.168.12.41:3000
```

2. **Start backend with external access:**
```bash
cd backend
npm start
```

### Frontend Configuration

1. **Set environment variables:**
```bash
set HOST=0.0.0.0
set PORT=3000
npm start
```

2. **Or create a .env file in frontend directory:**
```env
HOST=0.0.0.0
PORT=3000
```

## 🌐 Network Configuration

### Find Your IP Address

**Windows:**
```bash
ipconfig
```

**Look for:**
```
IPv4 Address. . . . . . . . . . . : 192.168.12.41
```

### Firewall Settings

You may need to allow the ports through Windows Firewall:

1. **Open Windows Defender Firewall**
2. **Click "Allow an app or feature through Windows Defender Firewall"**
3. **Click "Change settings"**
4. **Click "Allow another app"**
5. **Browse to your Node.js executable**
6. **Allow it on both Private and Public networks**

### Ports to Open

- **Port 3000** - Frontend (React)
- **Port 5000** - Backend (Express)

## 📧 Email Verification with External Access

When configured for external access:

1. **Email verification links** will use your local IP address
2. **Users can verify emails** from any device on your network
3. **Manual verification** will work from any device

### Example Email Link
```
http://192.168.12.41:3000/verify-email?token=abc123...
```

## 🧪 Testing External Access

### Test 1: Local Access
```bash
curl http://localhost:3000
curl http://localhost:5000/api/health
```

### Test 2: External Access
```bash
curl http://192.168.12.41:3000
curl http://192.168.12.41:5000/api/health
```

### Test 3: From Another Device
1. **Connect another device** to the same network
2. **Open browser** and go to `http://192.168.12.41:3000`
3. **Register a new user** to test email verification
4. **Check if verification email** arrives with correct links

## 🔍 Troubleshooting

### Issue 1: Can't Access from Other Devices
**Solutions:**
1. Check Windows Firewall settings
2. Ensure both servers are running
3. Verify IP address is correct
4. Check if antivirus is blocking connections

### Issue 2: Email Links Don't Work
**Solutions:**
1. Verify FRONTEND_URL in .env file
2. Check if email configuration is correct
3. Use manual verification as fallback

### Issue 3: Port Already in Use
**Solutions:**
1. Change ports in configuration
2. Kill processes using the ports
3. Restart the servers

### Issue 4: Network Issues
**Solutions:**
1. Ensure devices are on same network
2. Check router settings
3. Try using mobile hotspot for testing

## 📱 Mobile Testing

### Android
1. **Connect to same WiFi network**
2. **Open Chrome/Safari**
3. **Go to** `http://192.168.12.41:3000`

### iOS
1. **Connect to same WiFi network**
2. **Open Safari**
3. **Go to** `http://192.168.12.41:3000`

## 🔒 Security Considerations

### Development Only
- This configuration is for development/testing only
- Don't use this setup in production
- Consider security implications of external access

### Network Security
- Ensure your local network is secure
- Don't expose to public internet without proper security
- Use HTTPS in production

## 📋 Complete Setup Checklist

- [ ] Run `npm run configure-external`
- [ ] Start backend server: `npm start`
- [ ] Start frontend server: `npm start`
- [ ] Test local access: `http://localhost:3000`
- [ ] Test external access: `http://192.168.12.41:3000`
- [ ] Test from another device
- [ ] Test email verification
- [ ] Test manual verification

## 🆘 Support

If you have issues:
1. Check the console logs for errors
2. Verify network connectivity
3. Test with different devices
4. Check firewall settings
5. Use manual verification if email fails 