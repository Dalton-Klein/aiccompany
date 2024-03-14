// ***ELECTRON MAKE "" BLANK STRING IF NOT ELECTRON, "https://www.gangs.gg" IF ELECTRON PROD, "http://localhost:3010" if ELECTRON Serve
const endpointURL = "http://192.168.1.4:3010";

const avatarCloud = `https://api.cloudinary.com/v1_1/kultured-dev/upload`;
/*
	Auth Calls
*/
export const verifyUser = async (email, vKey, name, password, appleId) => {
  let result = await fetch(`${endpointURL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      vKey,
      username: name,
      email,
      appleId,
      password,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("VERIFY USER ERROR", err));
  return result;
};

export const createUser = async (user) => {
  const { username, email, appleId } = user;
  let result = await fetch(`${endpointURL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      appleId,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("CREATE USER ERROR", err));
  return result;
};

export const signInUser = async (user, isAppleSignIn) => {
  const { email, password, appleUserId } = user;
  if (isAppleSignIn) {
    let result = await fetch(`${endpointURL}/try-apple-signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appleUserId,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log("Check if apple account exists error", err));
    return result;
  } else {
    let result = await fetch(`${endpointURL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        isGoogleSignIn,
      }),
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log("SIGN IN USER ERROR", err));
    return result;
  }
};

export const requestPasswordReset = async (email) => {
  let result = await fetch(`${endpointURL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("Password Reset Request ERROR", err));
  return result;
};

export const resetPassword = async (email, vKey, password) => {
  try {
    let httpResult = await fetch(`${endpointURL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vKey,
        email,
        password,
      }),
    });
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log("Password Reset ERROR", error);
  }
};

//USER RELATED REQUESTS
export const fetchUserData = async (userId) => {
  let result = await fetch(`${endpointURL}/getUserDetails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("FETCH USER DATA ERROR", err));
  return result;
};

// EVENT RELATED REQUESTS
export const getAllEventsForUser = async (userId, token) => {
  try {
    const httpResult = await fetch(`${endpointURL}/get-my-events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        token,
      }),
    });

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching events for user`);
  }
};

export const getAllCalendarsForUser = async (userId, token) => {
  try {
    const httpResult = await fetch(`${endpointURL}/get-my-calendars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        token,
      }),
    });

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching calendars for user`);
  }
};

// CREATE ROUTES
export const createCalendar = async (
  userId,
  title,
  description,
  inviteUserIds,
  token
) => {
  try {
    const httpResult = await fetch(`${endpointURL}/create-calendar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        title,
        description,
        inviteUserIds,
        token,
      }),
    });

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating calendar`);
  }
};

export const createEvent = async (userId, event, token) => {
  try {
    const httpResult = await fetch(`${endpointURL}/create-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        event,
        token,
      }),
    });

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};

export const createTask = async (userId, task, token) => {
  try {
    const httpResult = await fetch(`${endpointURL}/create-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        task,
        token,
      }),
    });

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};

export const createEventAssignments = async (
  userId,
  eventId,
  calendarIds,
  token
) => {
  try {
    const httpResult = await fetch(`${endpointURL}/create-event-assignments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        eventId,
        calendarIds,
        token,
      }),
    });

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event assignments`);
  }
};

//Dashboard Routes
export const getMetricData = async (userId, token) => {
  try {
    const httpResult = await fetch(`${endpointURL}/get-metric-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        token,
      }),
    });

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};

//Social Routes
export const searchUserByUsername = async (inputString, token) => {
  try {
    const httpResult = await fetch(`${endpointURL}/search-user-by-username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputString,
        token,
      }),
    });

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};
export const sendFriendRequest = async (fromUserId, forUserId, token) => {
  try {
    const httpResult = await fetch(`${endpointURL}/friend-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromUserId,
        forUserId,
        token,
      }),
    });

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};
