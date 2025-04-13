
import { Course, FailedCourse } from "@/contexts/DataContext";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

interface CourseCardProps {
  course: Course | FailedCourse;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  showExtraInfo?: boolean;
}

const CourseCard = ({ 
  course, 
  selectable = false, 
  isSelected = false, 
  onSelect, 
  showExtraInfo = false 
}: CourseCardProps) => {
  const [selected, setSelected] = useState(isSelected);
  
  const handleChange = (checked: boolean) => {
    setSelected(checked);
    if (onSelect) {
      onSelect(course.id, checked);
    }
  };

  // Check if it's a FailedCourse by looking for the grade property
  const failedCourse = 'grade' in course ? course as FailedCourse : null;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="card-title text-xl">{course.code}</CardTitle>
          {selectable && (
            <Checkbox 
              id={`select-${course.id}`}
              checked={selected}
              onCheckedChange={handleChange}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-2">{course.title}</h3>
        <p className="text-sm text-gray-600">Credit Hours: {course.creditHours}</p>
        
        {showExtraInfo && failedCourse && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm flex justify-between">
              <span>Grade:</span> 
              <span className="font-semibold text-maroon">{failedCourse.grade}</span>
            </p>
            <p className="text-sm flex justify-between">
              <span>Semester:</span> 
              <span>{failedCourse.semester}</span>
            </p>
            <p className="text-sm flex justify-between">
              <span>Academic Year:</span> 
              <span>{failedCourse.academicYear}</span>
            </p>
          </div>
        )}
      </CardContent>
      {selectable && (
        <CardFooter className="pt-0">
          <Label 
            htmlFor={`select-${course.id}`} 
            className="text-sm text-gray-500 cursor-pointer hover:text-maroon"
          >
            {selected ? 'Selected' : 'Select this course'}
          </Label>
        </CardFooter>
      )}
    </Card>
  );
};

export default CourseCard;
