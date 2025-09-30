"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  Mail,
  Settings,
  UserPlus,
  Crown,
  Shield
} from "lucide-react";
import { Project } from "../types";

interface ProjectTeamProps {
  project: Project;
}

export const ProjectTeam = ({ project }: ProjectTeamProps) => {
  // Placeholder team data - this would come from your members API
  const teamMembers = [
    {
      id: "1",
      name: "Project Manager",
      email: "pm@example.com",
      role: "owner",
      avatar: "",
      status: "active",
      joinedAt: "2024-01-15"
    },
    {
      id: "2", 
      name: "Team Lead",
      email: "lead@example.com",
      role: "admin",
      avatar: "",
      status: "active",
      joinedAt: "2024-02-01"
    },
    {
      id: "3",
      name: "Developer",
      email: "dev@example.com", 
      role: "member",
      avatar: "",
      status: "active",
      joinedAt: "2024-03-01"
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case "admin":
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-yellow-100 text-yellow-800">Owner</Badge>;
      case "admin":
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      default:
        return <Badge variant="secondary">Member</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Project Team ({teamMembers.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Manage Roles
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage your project team members, roles, and permissions.
          </p>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{member.name}</h4>
                      {getRoleIcon(member.role)}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getRoleBadge(member.role)}
                  
                  <Badge 
                    variant={member.status === 'active' ? 'default' : 'secondary'}
                    className={member.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {member.status}
                  </Badge>
                  
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-medium">Owner</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Full project access</li>
                  <li>• Manage team members</li>
                  <li>• Delete project</li>
                  <li>• Billing & settings</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Admin</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Manage tasks & projects</li>
                  <li>• Invite team members</li>
                  <li>• View all data</li>
                  <li>• Project settings</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-gray-600" />
                  <h4 className="font-medium">Member</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Create & edit tasks</li>
                  <li>• View project data</li>
                  <li>• Comment on tasks</li>
                  <li>• Update task status</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Invitation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite New Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Invite team members to collaborate on this project. They will receive an email invitation with access to the project.
            </p>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Send Invite
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};