import pg from 'pg';

const { Client } = pg;

// set the way we will connect to the server
const pgConnectionConfigs = {
  user: process.env.USER, // this will make the user the user of the local computer
  host: 'localhost',
  database: 'aljt',
  port: 5432, // Postgres server always runs on this port
};

// create the var we'll use
const client = new Client(pgConnectionConfigs);
// make the connection to the server
client.connect();

let sqlQuery = '';
let values = '';
const [appName, scriptName, cmdName, workoutName, workoutDate, ...workoutExercises] = process.argv;

// create the query done callback
const whenQueryDone = (error, result) => {
  // this error is anything that goes wrong with the query
  if (error) {
    console.log('error', error);
  } else if (cmdName === 'exercises') {
    // rows key has the data
    result.rows.forEach((element) => {
      console.log(`${element.id}. ${element.name}`);
    });

    // close the connection
    client.end();
  } else if (cmdName === 'add-workout') {
    const newWorkoutId = result.rows[0].id;

    workoutExercises.forEach((exerciseId, index) => {
      const secondQueryValues = [exerciseId, newWorkoutId];

      // create the 2nd sql query
      const secondSqlQuery = 'INSERT INTO exercise_workouts (exercise_id, workout_id) VALUES ($1, $2) RETURNING *';

      // callback for 2nd sql query
      const whenSecondQueryDone = (secondError, secondResult) => {
        if (secondError) {
          console.log('2nd error', secondError);
        } else {
          console.log(secondResult.rows);

          if (index === workoutExercises.length - 1) {
            // close the connection
            client.end();
          }
        }
      };

      // run the 2nd SQL query
      client.query(secondSqlQuery, secondQueryValues, whenSecondQueryDone);
    });
  } else if (cmdName === 'get-workouts-by-exercise') {
    // display the workouts by exercise
    console.log(result.rows);

    // close the connection
    client.end();
  }
};

if (cmdName === 'exercises') {
  // write the SQL query
  sqlQuery = 'SELECT * from exercises';
} else if (cmdName === 'add-workout') {
  // write the SQL query
  sqlQuery = 'INSERT INTO workouts (name, date) VALUES ($1, $2) RETURNING *';

  // set the values of the query
  values = [workoutName, workoutDate];
} else if (cmdName === 'get-workouts-by-exercise') {
  // write the SQL Query
  sqlQuery = 'SELECT exercise_workouts.workout_id, workouts.name AS workout_name FROM exercise_workouts INNER JOIN workouts ON exercise_workouts.workout_id = workouts.id WHERE exercise_workouts.exercise_id=$1';

  // set the values of the query
  values = [process.argv[3]];
}

// run the SQL query
client.query(sqlQuery, values, whenQueryDone);
