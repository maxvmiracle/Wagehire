import React, { useState, useEffect } from 'react';
import { Bell, Clock, Settings, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import notificationService from '../services/notificationService';

const NotificationSettings = ({ isOpen, onClose }) => {
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [accessPointInfo, setAccessPointInfo] = useState(null);

  useEffect(() => {
    setIsSupported(notificationService.isSupported());
    setNotificationPermission(notificationService.hasPermission());
    setAccessPointInfo(notificationService.getAccessPointGuidance());
  }, []);

  // Get permission status for display
  const getPermissionStatusText = () => {
    const status = notificationService.getPermissionStatus();
    switch (status) {
      case 'granted':
        return 'You will receive interview reminders';
      case 'denied':
        if (accessPointInfo) {
          return accessPointInfo.message;
        }
        return 'Notifications are blocked. Please enable them in browser settings.';
      case 'default':
        return 'Please allow notifications when prompted';
      case 'unsupported':
        return 'Notifications are not supported in this browser';
      default:
        return 'Unknown permission status';
    }
  }

  const handleRequestPermission = async () => {
    const result = await notificationService.requestPermission();
    setNotificationPermission(result.granted);
    setAccessPointInfo(result.accessPointInfo);
    
    if (result.granted) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleTestNotification = () => {
    if (notificationPermission) {
      notificationService.showInterviewReminder({
        id: 'test',
        company_name: 'Test Company',
        job_title: 'Test Position',
        scheduled_date: new Date(Date.now() + 5 * 60000).toISOString(), // 5 minutes from now
        round: 1
      }, 5);
      toast.success('Test notification sent!');
    } else {
      toast.error('Please enable notifications first.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Access Point Warning */}
          {accessPointInfo && (
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-warning-800 mb-2">Access Point Notice</h3>
                  <p className="text-sm text-warning-700 mb-3">
                    {accessPointInfo.message}
                  </p>
                  <div className="bg-white rounded p-3">
                    <h4 className="font-medium text-warning-800 mb-2 text-sm">To enable notifications:</h4>
                    <ol className="text-xs text-warning-700 space-y-1">
                      {accessPointInfo.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="font-medium mr-2">{index + 1}.</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Browser Support */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              {isSupported ? (
                <CheckCircle className="w-5 h-5 text-success-600" />
              ) : (
                <XCircle className="w-5 h-5 text-danger-600" />
              )}
              <span className="font-medium text-gray-900">Browser Support</span>
            </div>
            <p className="text-sm text-gray-600">
              {isSupported 
                ? 'Your browser supports notifications'
                : 'Your browser does not support notifications'
              }
            </p>
          </div>

          {/* Permission Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              {notificationPermission ? (
                <CheckCircle className="w-5 h-5 text-success-600" />
              ) : (
                <XCircle className="w-5 h-5 text-danger-600" />
              )}
              <span className="font-medium text-gray-900">Permission Status</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {getPermissionStatusText()}
            </p>
            {!notificationPermission && isSupported && (
              <>
                <button
                  onClick={handleRequestPermission}
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 mb-3"
                >
                  <Bell className="w-4 h-4" />
                  <span>Enable Notifications</span>
                </button>
                
                {/* Manual Enable Instructions */}
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                  <h4 className="font-medium text-warning-800 mb-2">If notifications are blocked:</h4>
                  <div className="text-xs text-warning-700 space-y-1">
                    <p><strong>Chrome/Edge:</strong> Click the lock icon in the address bar → Site settings → Notifications → Allow</p>
                    <p><strong>Firefox:</strong> Click the shield icon → Permissions → Notifications → Allow</p>
                    <p><strong>Safari:</strong> Safari → Preferences → Websites → Notifications → Allow for this website</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notification Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Notification Features</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-warning-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3 h-3 text-warning-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Interview Reminders</p>
                  <p className="text-sm text-gray-600">Get notified 30 minutes before your scheduled interviews</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-success-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Status Updates</p>
                  <p className="text-sm text-gray-600">Receive notifications when interview status changes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bell className="w-3 h-3 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Browser & Toast</p>
                  <p className="text-sm text-gray-600">Notifications appear as browser alerts and toast messages</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Notification */}
          {notificationPermission && (
            <div className="bg-primary-50 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900 mb-3">Test Notifications</h3>
              <p className="text-sm text-primary-700 mb-3">
                Send a test notification to verify everything is working correctly.
              </p>
              <button
                onClick={handleTestNotification}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Bell className="w-4 h-4" />
                <span>Send Test Notification</span>
              </button>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">How it works</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Notifications are checked every minute</li>
              <li>• You'll be reminded 30 minutes before interviews</li>
              <li>• Notifications work even when the app is in the background</li>
              <li>• You can dismiss notifications by clicking on them</li>
            </ul>
          </div>

          {/* Access Point Info */}
          {accessPointInfo && (
            <div className="bg-info-50 border border-info-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-info-800 mb-2">Access Point Information</h3>
                  <p className="text-sm text-info-700">
                    You're currently accessing the site via <strong>{window.location.hostname}</strong>. 
                    Notification permissions are specific to each access point (IP address or domain).
                  </p>
                  <p className="text-sm text-info-700 mt-2">
                    If you access the site from a different IP address or domain, you'll need to enable notifications again for that specific access point.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 