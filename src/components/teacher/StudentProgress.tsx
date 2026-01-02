import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useClassStudents } from "@/hooks/useClassStudents";

const StudentProgress = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { students, isLoading } = useClassStudents();

  const getGradeBadge = (grade: string | null) => {
    if (!grade) return <span className="text-xs text-muted-foreground">—</span>;
    const colors: Record<string, string> = {
      "Excellent": "bg-success/10 text-success",
      "Satisfied": "bg-primary/10 text-primary",
      "Average": "bg-warning/10 text-warning",
      "Dissatisfied": "bg-destructive/10 text-destructive",
    };
    return <span className={`status-badge ${colors[grade]}`}>{grade}</span>;
  };

  const getIAStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: JSX.Element }> = {
      "Completed": { color: "bg-success/10 text-success", icon: <CheckCircle className="w-3 h-3" /> },
      "In Progress": { color: "bg-warning/10 text-warning", icon: <Clock className="w-3 h-3" /> },
      "Not Started": { color: "bg-muted text-muted-foreground", icon: <AlertTriangle className="w-3 h-3" /> },
    };
    const { color, icon } = config[status] || config["Not Started"];
    return (
      <span className={`status-badge ${color} flex items-center gap-1`}>
        {icon} {status}
      </span>
    );
  };

  const getExemptionBadge = (status: string) => {
    const colors: Record<string, string> = {
      "Eligible": "bg-primary/10 text-primary",
      "Requested": "bg-warning/10 text-warning",
      "Approved": "bg-success/10 text-success",
      "Not Eligible": "bg-muted text-muted-foreground",
    };
    return <span className={`status-badge ${colors[status]}`}>{status}</span>;
  };

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Student Progress</h2>
          <p className="text-muted-foreground">Monitor all students in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-secondary rounded-2xl text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <Button variant="outline" className="gap-2 rounded-2xl">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="dashboard-card overflow-x-auto">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No students found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                <th className="pb-4 font-medium">Student</th>
                <th className="pb-4 font-medium">Credits</th>
                <th className="pb-4 font-medium">Projects</th>
                <th className="pb-4 font-medium">Company Grade</th>
                <th className="pb-4 font-medium">IA Status</th>
                <th className="pb-4 font-medium">Exam Exemption</th>
                <th className="pb-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="group hover:bg-muted/30">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{student.credits}</span>
                        <span className="text-xs text-muted-foreground">/{student.maxCredits}</span>
                      </div>
                      <Progress value={(student.credits / student.maxCredits) * 100} className="h-1.5" />
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm">
                      <span className="text-foreground font-medium">{student.completedProjects}</span>
                      <span className="text-muted-foreground"> completed</span>
                      {student.activeProjects > 0 && (
                        <span className="text-primary ml-2">+{student.activeProjects} active</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4">{getGradeBadge(student.avgGrade)}</td>
                  <td className="py-4">{getIAStatusBadge(student.iaStatus)}</td>
                  <td className="py-4">{getExemptionBadge(student.examExemption)}</td>
                  <td className="py-4">
                    <Button variant="ghost" size="sm" className="rounded-xl gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <span className="text-sm text-muted-foreground">Showing {filteredStudents.length} students</span>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-xl">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-xl">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
