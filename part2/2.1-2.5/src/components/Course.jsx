import React from 'react';

const Course = ({ course }) => {
  // Calculating the total number of exercises
  const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <div>
      <h2>{course.name}</h2>
      {course.parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
      <p><strong>Total of {totalExercises} exercises</strong></p>
    </div>
  );
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

export default Course;
