import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Briefcase, 
  Award, 
  MessageCircle,
  X,
  Check
} from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "message";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationDropdownProps {
  role?: "student" | "teacher" | "company";
}

const NotificationDropdown = ({ role = "student" }: NotificationDropdownProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const baseNotifications: Notification[] = [
      {
        id: "1",
        type: "success",
        title: "Project Approved",
        message: "Your submission was accepted and graded!",
        time: "2 hours ago",
        read: false,
      },
      {
        id: "2",
        type: "warning",
        title: "Deadline Approaching",
        message: "Fintech App Redesign due in 3 days",
        time: "5 hours ago",
        read: false,
      },
      {
        id: "3",
        type: "info",
        title: "New Challenge Available",
        message: "Tesla posted a new UX Design project",
        time: "1 day ago",
        read: true,
      },
      {
        id: "4",
        type: "message",
        title: "Interview Request",
        message: "Stripe wants to schedule an interview",
        time: "2 days ago",
        read: true,
      },
    ];

    if (role === "teacher") {
      return [
        {
          id: "1",
          type: "warning",
          title: "Student Alert",
          message: "Emma Wilson has low progress",
          time: "1 hour ago",
          read: false,
        },
        {
          id: "2",
          type: "info",
          title: "Grade Pending",
          message: "5 submissions waiting for approval",
          time: "3 hours ago",
          read: false,
        },
        {
          id: "3",
          type: "success",
          title: "Exemption Approved",
          message: "Marcus Reed's exemption was processed",
          time: "1 day ago",
          read: true,
        },
      ];
    }

    if (role === "company") {
      return [
        {
          id: "1",
          type: "info",
          title: "New Submission",
          message: "3 students submitted for API Challenge",
          time: "30 mins ago",
          read: false,
        },
        {
          id: "2",
          type: "success",
          title: "Candidate Accepted",
          message: "Alex Chen accepted your offer!",
          time: "2 hours ago",
          read: false,
        },
        {
          id: "3",
          type: "message",
          title: "Talent Match",
          message: "5 new students match your criteria",
          time: "1 day ago",
          read: true,
        },
      ];
    }

    return baseNotifications;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case "info":
        return <Briefcase className="w-4 h-4 text-primary" />;
      case "message":
        return <MessageCircle className="w-4 h-4 text-primary" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-lg">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground hover:text-foreground gap-1"
              onClick={markAllAsRead}
            >
              <Check className="w-3 h-3" />
              Mark all read
            </Button>
          )}
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors cursor-pointer ${
                  !notification.read ? "bg-primary/5" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-border">
            <Button variant="ghost" className="w-full text-sm text-muted-foreground">
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
