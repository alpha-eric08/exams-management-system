import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pencil,
  Trash2,
  Plus,
  FileUp,
  Download,
  Search,
  CheckCircle,
  Filter,
  ArrowUpDown,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import MobileNavbar from "@/components/layout/MobileNavbar";
import MainLayout from "@/components/layout/MainLayout";

const ManageCourses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [sort, setSort] = useState("code");
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: "",
    title: "",
    department: "",
    level: "",
    eligibleFor: ["resit", "supplementary"],
  });

  // Mock courses data
  const coursesData = [
    {
      id: 1,
      code: "CSC301",
      title: "Data Structures and Algorithms",
      department: "Computer Science",
      level: "300",
      eligibleFor: ["resit", "supplementary"],
    },
    {
      id: 2,
      code: "MAT305",
      title: "Linear Algebra",
      department: "Mathematics",
      level: "300",
      eligibleFor: ["resit"],
    },
    {
      id: 3,
      code: "PHY302",
      title: "Quantum Mechanics",
      department: "Physics",
      level: "300",
      eligibleFor: ["resit", "supplementary"],
    },
    {
      id: 4,
      code: "BIO301",
      title: "Molecular Biology",
      department: "Biology",
      level: "300",
      eligibleFor: ["supplementary"],
    },
    {
      id: 5,
      code: "ENG202",
      title: "Technical Writing",
      department: "English",
      level: "200",
      eligibleFor: ["resit", "supplementary"],
    },
    {
      id: 6,
      code: "CHE305",
      title: "Organic Chemistry",
      department: "Chemistry",
      level: "300",
      eligibleFor: ["resit"],
    },
    {
      id: 7,
      code: "PSY201",
      title: "Introduction to Psychology",
      department: "Psychology",
      level: "200",
      eligibleFor: ["resit", "supplementary"],
    },
    {
      id: 8,
      code: "ECO304",
      title: "Macroeconomics",
      department: "Economics",
      level: "300",
      eligibleFor: ["supplementary"],
    },
  ];

  const [courses, setCourses] = useState(coursesData);
  const [courseToEdit, setCourseToEdit] = useState<
    (typeof coursesData)[0] | null
  >(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter courses based on search and department
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      department === "all" || course.department === department;
    return matchesSearch && matchesDepartment;
  });

  const [isUploading, setIsUploading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  // CSV file
  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a CSV file to upload",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Read the file
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target || typeof event.target.result !== "string") {
          throw new Error("Failed to read file");
        }

        // Parse CSV
        const csvData = event.target.result;
        const rows = csvData.split("\n");
        const headers = rows[0].split(",");

        // Validate headers
        const requiredHeaders = ["code", "title", "credit_hours"];
        const hasAllHeaders = requiredHeaders.every((header) =>
          headers.map((h) => h.trim().toLowerCase()).includes(header)
        );

        if (!hasAllHeaders) {
          throw new Error(
            "CSV must include columns for code, title, and credit_hours"
          );
        }

        // Extract data
        const coursesToAdd = [];
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;

          const values = rows[i].split(",");
          const course = {
            code: values[0].trim(),
            title: values[1].trim(),
            credit_hours: parseInt(values[2].trim(), 10),
          };

          // Validate course data
          if (!course.code || !course.title || isNaN(course.credit_hours)) {
            continue; // Skip invalid rows
          }

          coursesToAdd.push(course);
        }

        if (coursesToAdd.length === 0) {
          throw new Error("No valid course data found in the CSV");
        }

        toast({
          title: "Courses imported",
          description: `Successfully imported ${coursesToAdd.length} courses`,
        });

        setUploadDialogOpen(false);
        setCsvFile(null);

        // Refresh the page to show the new courses
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      };
      reader.readAsText(csvFile);
    } catch (error) {
      console.error("Error uploading courses:", error);
      toast({
        variant: "destructive",
        title: "Failed to import courses",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sort === "code") {
      return a.code.localeCompare(b.code);
    } else if (sort === "title") {
      return a.title.localeCompare(b.title);
    } else if (sort === "department") {
      return a.department.localeCompare(b.department);
    } else if (sort === "level") {
      return a.level.localeCompare(b.level);
    }
    return 0;
  });

  // Get unique departments for filter
  const departments = [
    "all",
    ...new Set(courses.map((course) => course.department)),
  ];

  const handleAddCourse = () => {
    if (
      !newCourse.code ||
      !newCourse.title ||
      !newCourse.department ||
      !newCourse.level
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...courses.map((c) => c.id)) + 1;
    const courseToAdd = {
      ...newCourse,
      id: newId,
    };

    setCourses([...courses, courseToAdd]);
    setIsAddCourseOpen(false);
    setNewCourse({
      code: "",
      title: "",
      department: "",
      level: "",
      eligibleFor: ["resit", "supplementary"],
    });

    toast({
      title: "Course Added",
      description: `${courseToAdd.code}: ${courseToAdd.title} has been added successfully.`,
    });
  };

  const handleEditCourse = () => {
    if (!courseToEdit) return;

    const updatedCourses = courses.map((course) =>
      course.id === courseToEdit.id ? courseToEdit : course
    );

    setCourses(updatedCourses);
    setIsEditDialogOpen(false);

    toast({
      title: "Course Updated",
      description: `${courseToEdit.code}: ${courseToEdit.title} has been updated successfully.`,
    });
  };

  const handleDeleteCourse = (id: number) => {
    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses);

    toast({
      title: "Course Deleted",
      description: "The course has been deleted successfully.",
    });
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <MobileNavbar />
      <MainLayout title="Manage Courses">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-maroon mb-2">
            Course Management
          </h2>
          <p className="text-gray-600">
            Manage courses eligible for resit and supplementary examinations.
          </p>
        </div>
        {/* Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Button
            className="bg-maroon hover:bg-maroon-dark text-white"
            onClick={() => setIsAddCourseOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Course
          </Button>

          <Button
            variant="outline"
            className="border-maroon text-maroon hover:bg-maroon hover:text-white"
            onClick={() => setUploadDialogOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" /> Import from CSV
          </Button>

          <Button
            variant="outline"
            className="border-maroon text-maroon hover:bg-maroon hover:text-white"
            onClick={() => {
              // In a real app, this would trigger a file upload dialog
              toast({
                title: "Upload Functionality",
                description:
                  "This would allow you to upload course data via CSV file in a real application.",
              });
            }}
          >
            <FileUp className="h-4 w-4" />
            Upload Courses
          </Button>

          <Button
            variant="outline"
            className="border-maroon text-maroon hover:bg-maroon hover:text-white"
            onClick={() => {
              toast({
                title: "Download Functionality",
                description:
                  "This would allow you to download course data as CSV file in a real application.",
              });
            }}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code">Sort by Code</SelectItem>
                <SelectItem value="title">Sort by Title</SelectItem>
                <SelectItem value="department">Sort by Department</SelectItem>
                <SelectItem value="level">Sort by Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg mt-5 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-maroon text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Eligible For
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {course.eligibleFor.includes("resit") && (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            Resit
                          </Badge>
                        )}
                        {course.eligibleFor.includes("supplementary") && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            Supplementary
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setCourseToEdit(course);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary-red text-red-500"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedCourses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      No courses found. Try adjusting your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          <div className="text-sm ml-5 border-t text-gray-500">
              Showing {sortedCourses.length} of {courses.length} courses
            </div>
          </div>
        </div>       

        <div className="min-h-screen bg-bg-gray flex flex-col">
          {/* Add Course Dialog */}
          <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogDescription>
                  Add a new course to the system. This will make the course
                  available for students to apply for resit or supplementary
                  exams.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course-code">Course Code</Label>
                    <Input
                      id="course-code"
                      placeholder="e.g. CSC301"
                      value={newCourse.code}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, code: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course-level">Level</Label>
                    <Select
                      value={newCourse.level}
                      onValueChange={(value) =>
                        setNewCourse({ ...newCourse, level: value })
                      }
                    >
                      <SelectTrigger id="course-level">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 Level</SelectItem>
                        <SelectItem value="200">200 Level</SelectItem>
                        <SelectItem value="300">300 Level</SelectItem>
                        <SelectItem value="400">400 Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-title">Course Title</Label>
                  <Input
                    id="course-title"
                    placeholder="e.g. Data Structures and Algorithms"
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-department">Department</Label>
                  <Input
                    id="course-department"
                    placeholder="e.g. Computer Science"
                    value={newCourse.department}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, department: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Eligible For</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="eligible-resit"
                        className="w-4 h-4 rounded border-gray-300 text-maroon hover:text-maroon-dark focus:ring-dark-blue"
                        checked={newCourse.eligibleFor.includes("resit")}
                        onChange={(e) => {
                          const eligibleFor = e.target.checked
                            ? [...newCourse.eligibleFor, "resit"]
                            : newCourse.eligibleFor.filter(
                                (type) => type !== "resit"
                              );
                          setNewCourse({ ...newCourse, eligibleFor });
                        }}
                      />
                      <Label
                        htmlFor="eligible-resit"
                        className="text-sm cursor-pointer"
                      >
                        Resit
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="eligible-supplementary"
                        className="w-4 h-4 rounded border-gray-300 text-maroon hover:text-maroon-dark focus:ring-dark-blue"
                        checked={newCourse.eligibleFor.includes(
                          "supplementary"
                        )}
                        onChange={(e) => {
                          const eligibleFor = e.target.checked
                            ? [...newCourse.eligibleFor, "supplementary"]
                            : newCourse.eligibleFor.filter(
                                (type) => type !== "supplementary"
                              );
                          setNewCourse({ ...newCourse, eligibleFor });
                        }}
                      />
                      <Label
                        htmlFor="eligible-supplementary"
                        className="text-sm cursor-pointer"
                      >
                        Supplementary
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddCourseOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-maroon hover:bg-maroon-dark"
                  onClick={handleAddCourse}
                >
                  Add Course
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Course Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Course</DialogTitle>
                <DialogDescription>
                  Update the course details below.
                </DialogDescription>
              </DialogHeader>
              {courseToEdit && (
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-course-code">Course Code</Label>
                      <Input
                        id="edit-course-code"
                        value={courseToEdit.code}
                        onChange={(e) =>
                          setCourseToEdit({
                            ...courseToEdit,
                            code: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-course-level">Level</Label>
                      <Select
                        value={courseToEdit.level}
                        onValueChange={(value) =>
                          setCourseToEdit({ ...courseToEdit, level: value })
                        }
                      >
                        <SelectTrigger id="edit-course-level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100 Level</SelectItem>
                          <SelectItem value="200">200 Level</SelectItem>
                          <SelectItem value="300">300 Level</SelectItem>
                          <SelectItem value="400">400 Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-course-title">Course Title</Label>
                    <Input
                      id="edit-course-title"
                      value={courseToEdit.title}
                      onChange={(e) =>
                        setCourseToEdit({
                          ...courseToEdit,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-course-department">Department</Label>
                    <Input
                      id="edit-course-department"
                      value={courseToEdit.department}
                      onChange={(e) =>
                        setCourseToEdit({
                          ...courseToEdit,
                          department: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Eligible For</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="edit-eligible-resit"
                          className="w-4 h-4 rounded border-gray-300 text-maroon hover:text-maroon-dark focus:ring-dark-blue"
                          checked={courseToEdit.eligibleFor.includes("resit")}
                          onChange={(e) => {
                            const eligibleFor = e.target.checked
                              ? [...courseToEdit.eligibleFor, "resit"]
                              : courseToEdit.eligibleFor.filter(
                                  (type) => type !== "resit"
                                );
                            setCourseToEdit({ ...courseToEdit, eligibleFor });
                          }}
                        />
                        <Label
                          htmlFor="edit-eligible-resit"
                          className="text-sm cursor-pointer"
                        >
                          Resit
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="edit-eligible-supplementary"
                          className="w-4 h-4 rounded border-gray-300 text-maroon hover:text-maroon-dark focus:ring-dark-blue"
                          checked={courseToEdit.eligibleFor.includes(
                            "supplementary"
                          )}
                          onChange={(e) => {
                            const eligibleFor = e.target.checked
                              ? [...courseToEdit.eligibleFor, "supplementary"]
                              : courseToEdit.eligibleFor.filter(
                                  (type) => type !== "supplementary"
                                );
                            setCourseToEdit({ ...courseToEdit, eligibleFor });
                          }}
                        />
                        <Label
                          htmlFor="edit-eligible-supplementary"
                          className="text-sm cursor-pointer"
                        >
                          Supplementary
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-maroon hover:bg-maroon-dark"
                  onClick={handleEditCourse}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <footer className="bg-dark-blue text-white py-4 mt-10">
            <div className="container mx-auto px-4 text-center">
              <p>
                &copy; {new Date().getFullYear()} University Exam Management
                System
              </p>
            </div>
          </footer>
        </div>

        {/* Upload CSV Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Courses from CSV</DialogTitle>
              <DialogDescription>
                Upload a CSV file with course data. The CSV should include
                columns for code, title, and credit_hours.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCsvUpload} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="csvFile">CSV File</Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={(e) =>
                    e.target.files && setCsvFile(e.target.files[0])
                  }
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-maroon hover:bg-maroon-dark"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload and Import"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </>
  );
};

export default ManageCourses;
