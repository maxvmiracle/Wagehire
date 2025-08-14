import { toast } from 'react-hot-toast';
import { Bell, Clock, Calendar, AlertTriangle } from 'lucide-react';

class NotificationService {
  constructor() {
    this.checkInterval = null;
    this.lastCheckedInterviews = new Set();
    this.notificationPermission = false;
    this.currentDomain = window.location.hostname;
    this.init();
  }

  async init() {
    // Request notification permission
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission === 'granted';
    }
  }

  // Check if user is accessing from a different IP/domain
  isDifferentAccessPoint() {
    const currentHost = window.location.hostname;
    const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
    const isIPAddress = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(currentHost);
    
    // If accessing via IP address, it's likely a different access point
    return isIPAddress || (!isLocalhost && currentHost !== this.currentDomain);
  }

  // Get access point specific guidance
  getAccessPointGuidance() {
    const currentHost = window.location.hostname;
    const isIPAddress = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(currentHost);
    const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Check if it's a production deployment (likely proxied)
    if (isProduction && !isLocalhost) {
      return {
        type: 'production-deployment',
        message: `You're accessing the site via production deployment (${currentHost}). Notifications may be blocked due to proxy/load balancer configuration.`,
        instructions: [
          'Click the lock/shield icon in your browser address bar',
          'Find "Notifications" or "Site permissions"',
          'Change from "Block" to "Allow"',
          'Refresh the page and try enabling notifications again',
          'If notifications still don\'t work, try accessing the site directly without any proxy'
        ],
        additionalInfo: 'Production deployments often use proxies or load balancers that can affect notification permissions.'
      };
    }
    
    if (isIPAddress) {
      return {
        type: 'ip-access',
        message: `You're accessing the site via IP address (${currentHost}). Notifications may be blocked because browsers treat different IP addresses as separate sites.`,
        instructions: [
          'Click the lock/shield icon in your browser address bar',
          'Find "Notifications" or "Site permissions"',
          'Change from "Block" to "Allow"',
          'Refresh the page and try enabling notifications again'
        ]
      };
    } else if (!isLocalhost) {
      return {
        type: 'domain-access',
        message: `You're accessing the site via domain (${currentHost}). Notifications may be blocked for this domain.`,
        instructions: [
          'Click the lock/shield icon in your browser address bar',
          'Find "Notifications" or "Site permissions"',
          'Change from "Block" to "Allow"',
          'Refresh the page and try enabling notifications again'
        ]
      };
    }
    
    return null;
  }

  // Check for upcoming interviews and show notifications
  async checkUpcomingInterviews(interviews) {
    if (!interviews || interviews.length === 0) return;

    const now = new Date();
    const upcomingThreshold = 30; // minutes before interview
    const currentInterviews = new Set();

    interviews.forEach(interview => {
      if (interview.status !== 'scheduled' && interview.status !== 'uncertain') return;
      if (!interview.scheduled_date) return; // Skip interviews without dates

      const interviewTime = new Date(interview.scheduled_date);
      const timeDiff = interviewTime.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));

      currentInterviews.add(interview.id);

      // Check if interview is within the threshold and hasn't been notified
      if (minutesDiff >= 0 && minutesDiff <= upcomingThreshold && !this.lastCheckedInterviews.has(interview.id)) {
        this.showInterviewReminder(interview, minutesDiff);
        this.lastCheckedInterviews.add(interview.id);
      }
    });

    // Clean up old notifications
    this.lastCheckedInterviews.forEach(id => {
      if (!currentInterviews.has(id)) {
        this.lastCheckedInterviews.delete(id);
      }
    });
  }

  // Show interview reminder notification
  showInterviewReminder(interview, minutesUntil) {
    if (!interview.scheduled_date) return; // Don't show reminders for interviews without dates
    
    const interviewTime = new Date(interview.scheduled_date);
    const timeString = interviewTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const message = minutesUntil === 0 
      ? `Your interview with ${interview.company_name} is starting now!`
      : `Your interview with ${interview.company_name} starts in ${minutesUntil} minutes (30-minute reminder)`;

    // Show toast notification
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-warning-600" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Interview Reminder
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {message}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-400">
                <Calendar className="w-3 h-3 mr-1" />
                {interviewTime.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })} at {timeString}
              </div>
              <div className="mt-1 text-xs text-gray-400">
                {interview.job_title} • Round {interview.round}
              </div>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Dismiss
          </button>
        </div>
      </div>
    ), {
      duration: 10000, // 10 seconds
      position: 'top-right',
    });

    // Show browser notification if permission granted
    if (this.notificationPermission) {
      new Notification('Interview Reminder', {
        body: message,
        icon: '/favicon.ico', // You can replace with your app icon
        tag: `interview-${interview.id}`,
        requireInteraction: true,
        data: {
          interviewId: interview.id,
          type: 'interview-reminder'
        }
      });
    }
  }

  // Start checking for upcoming interviews
  startChecking(interviews) {
    // Check immediately
    this.checkUpcomingInterviews(interviews);

    // Check every minute
    this.checkInterval = setInterval(() => {
      this.checkUpcomingInterviews(interviews);
    }, 60000); // 1 minute
  }

  // Stop checking for upcoming interviews
  stopChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Show success notification for scheduled interview
  showInterviewScheduled(interview) {
    const interviewTime = new Date(interview.scheduled_date);
    const timeString = interviewTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    toast.success(
      <div>
        <div className="font-semibold">Interview Scheduled!</div>
        <div className="text-sm mt-1">
          {interview.company_name} • {timeString}
        </div>
      </div>,
      {
        duration: 5000,
        icon: <Calendar className="w-5 h-5" />,
      }
    );
  }

  // Show notification for interview status changes
  showStatusChange(interview, oldStatus, newStatus) {
    const statusMessages = {
      'scheduled': 'Interview scheduled',
      'uncertain': 'Interview marked as uncertain/upcoming',
      'completed': 'Interview completed',
      'cancelled': 'Interview cancelled'
    };

    const statusColors = {
      'scheduled': 'success',
      'uncertain': 'warning',
      'completed': 'success',
      'cancelled': 'error'
    };

    const message = `${statusMessages[newStatus]} for ${interview.company_name}`;
    
    if (statusColors[newStatus] === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }

  // Request notification permission
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission === 'granted';
      
      // Return detailed information about the permission result
      return {
        granted: this.notificationPermission,
        permission: permission,
        message: this.getPermissionMessage(permission),
        accessPointInfo: this.getAccessPointGuidance()
      };
    }
    return {
      granted: false,
      permission: 'unsupported',
      message: 'Notifications are not supported in this browser',
      accessPointInfo: null
    };
  }

  // Get user-friendly message based on permission status
  getPermissionMessage(permission) {
    const accessPointInfo = this.getAccessPointGuidance();
    
    switch (permission) {
      case 'granted':
        return 'Notification permission granted! You\'ll receive interview reminders.';
      case 'denied':
        if (accessPointInfo) {
          return `Notification permission denied. ${accessPointInfo.message}`;
        }
        return 'Notification permission denied. Please enable notifications in your browser settings to receive interview reminders.';
      case 'default':
        return 'Notification permission not set. Please allow notifications when prompted.';
      default:
        return 'Unable to request notification permission.';
    }
  }

  // Check if notifications are supported and enabled
  isSupported() {
    return 'Notification' in window;
  }

  // Check if permission is granted
  hasPermission() {
    if ('Notification' in window) {
      // Update the internal state with current permission
      this.notificationPermission = Notification.permission === 'granted';
      return this.notificationPermission;
    }
    return false;
  }

  // Get current permission status
  getPermissionStatus() {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  }

  // Get current access point information
  getCurrentAccessPoint() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    
    return {
      hostname,
      fullUrl: `${protocol}//${hostname}${port ? ':' + port : ''}`,
      isIPAddress: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname),
      isLocalhost: hostname === 'localhost' || hostname === '127.0.0.1',
      permissionStatus: this.getPermissionStatus()
    };
  }

  // Show access point information to user
  showAccessPointInfo() {
    const accessPoint = this.getCurrentAccessPoint();
    const accessPointInfo = this.getAccessPointGuidance();
    
    if (accessPointInfo) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-warning-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Access Point Notice
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {accessPointInfo.message}
                </p>
                <div className="mt-2 text-xs text-gray-400">
                  Current access: <strong>{accessPoint.fullUrl}</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Got it
            </button>
          </div>
        </div>
      ), {
        duration: 8000, // 8 seconds
        position: 'top-right',
      });
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService; 