CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    name TEXT,
    date TEXT
);

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE exercise_workouts (
    id SERIAL PRIMARY KEY,
    exercise_id INTEGER,
    workout_id INTEGER
);

SELECT * FROM exercises;

INSERT INTO exercises (name) VALUES ('squat');

-- for creating a new workout
INSERT INTO workouts (name, date) VALUES ($1, $2);

DELETE FROM workouts WHERE id=1;

INSERT INTO exercise_workouts (exercise_id, workout_id) VALUES ($1, $2);

-- for Get Workouts with Specific Exercise with Exercise ID
SELECT exercise_workouts.workout_id, workouts.name AS workout_name FROM exercise_workouts INNER JOIN workouts ON exercise_workouts.workout_id = workouts.id WHERE exercise_workouts.exercise_id=1;
