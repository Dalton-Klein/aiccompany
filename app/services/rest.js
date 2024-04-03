// ***Coffee make http://192.168.1.4:3010 for local, https://accompany-me-api-911a354ccb4c.herokuapp.com for prod
const endpointURL =
  "https://accompany-me-api-911a354ccb4c.herokuapp.com";

const avatarCloud = `https://api.cloudinary.com/v1_1/kultured-dev/upload`;
/*
	Auth Calls
*/
export const verifyUser = async (
  email,
  vKey,
  name,
  password,
  appleId,
  avatarUrl
) => {
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
      avatarUrl,
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

export const deleteUserAccount = async (userId, token) => {
  let result = await fetch(
    `${endpointURL}/delete-account`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        token,
      }),
    }
  )
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("DELETE USER ERROR", err));
  return result;
};

export const signInUser = async (user, isAppleSignIn) => {
  const { email, password, appleUserId } = user;
  if (isAppleSignIn) {
    let result = await fetch(
      `${endpointURL}/try-apple-signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appleUserId,
        }),
      }
    )
      .then((res) => res.json())
      .catch((err) =>
        console.log(
          "Check if apple account exists error",
          err
        )
      );
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
      .catch((err) =>
        console.log("SIGN IN USER ERROR", err)
      );
    return result;
  }
};

export const requestPasswordReset = async (email) => {
  let result = await fetch(
    `${endpointURL}/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  )
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) =>
      console.log("Password Reset Request ERROR", err)
    );
  return result;
};

export const resetPassword = async (
  email,
  vKey,
  password
) => {
  try {
    let httpResult = await fetch(
      `${endpointURL}/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vKey,
          email,
          password,
        }),
      }
    );
    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log("Password Reset ERROR", error);
  }
};

//USER RELATED REQUESTS
export const fetchUserSearchData = async (token) => {
  let result = await fetch(
    `${endpointURL}/get-user-search-data`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    }
  )
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) =>
      console.log("FETCH USER SEARCH DATA ERROR", err)
    );
  return result;
};

export const fetchUserData = async (userId) => {
  let result = await fetch(
    `${endpointURL}/getUserDetails`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    }
  )
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) =>
      console.log("FETCH USER DATA ERROR", err)
    );
  return result;
};

export const updateUserField = async (id, field, value) => {
  await fetch(`${endpointURL}/updateUserInfoField`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: id,
      field,
      value,
    }),
  })
    .then((res) => res.json())
    .catch((err) =>
      console.log("Fetch Error (avatar)", err)
    );
  return;
};

export const uploadAvatarCloud = async (uri) => {
  const uriParts = uri.split(".");
  const fileType = uriParts[uriParts.length - 1];

  const formData = new FormData();
  formData.append("upload_preset", "ribyujnm");
  formData.append("file", {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });
  let response;
  await fetch(avatarCloud, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((response) => response.json())
    .then((data) => (response = data.url))
    .catch((err) =>
      console.log("Fetch error (CLOUDINARY)", err)
    );
  return response;
};

// EVENT RELATED REQUESTS
export const getAllEventsForUser = async (
  userId,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/get-my-events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching events for user`);
  }
};

export const getAllTasksForUser = async (userId, token) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/get-my-tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while fetching tasks for user`);
  }
};

export const getEventsData = async (
  userId,
  eventId,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/get-event-data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          eventId,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(
      `${error} while fetching calendars for user`
    );
  }
};

export const getAllCalendarsForUser = async (
  userId,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/get-my-calendars`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(
      `${error} while fetching calendars for user`
    );
  }
};

export const getCalendarsData = async (
  calendarId,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/get-calendar-data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calendarId,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(
      `${error} while fetching calendars for user`
    );
  }
};

export const updateCalendarsData = async (
  calendarId,
  changes,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/update-calendar-data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calendarId,
          changes,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(
      `${error} while fetching calendars for user`
    );
  }
};

export const updateEventsData = async (
  eventId,
  changes,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/update-event-data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          changes,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(
      `${error} while fetching calendars for user`
    );
  }
};

// CREATE ROUTES
export const createCalendar = async (
  userId,
  title,
  description,
  calendar_url,
  inviteUserIds,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/create-calendar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title,
          description,
          calendar_url,
          inviteUserIds,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating calendar`);
  }
};

export const createEvent = async (userId, event, token) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/create-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          event,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};

export const createTask = async (userId, task, token) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/create-task`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          task,
          token,
        }),
      }
    );

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
    const httpResult = await fetch(
      `${endpointURL}/create-event-assignments`,
      {
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
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(
      `${error} while creating event assignments`
    );
  }
};

export const deleteEvent = async (
  userId,
  eventId,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/delete-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          eventId,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};

export const deleteSeries = async (
  userId,
  eventId,
  seriesId,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/delete-series`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          eventId,
          seriesId,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};

export const removeEventAssignments = async (
  userId,
  eventId,
  calendarIds,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/remove-event-assignments`,
      {
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
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(
      `${error} while creating event assignments`
    );
  }
};

//Dashboard Routes
export const getMetricData = async (userId, token) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/get-metric-data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};

//Social Routes
export const searchUserByUsername = async (
  inputString,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/search-user-by-username`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputString,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};
export const sendFriendRequest = async (
  fromUserId,
  forUserId,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/friend-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromUserId,
          forUserId,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};

export const acceptFriendRequest = async (
  request,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/accept-friend`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: request.senderId,
          acceptorId: request.receiver,
          pendingId: request.pendingId,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};

export const sendCalendarInvite = async (
  calendarId,
  fromUserId,
  forUserId,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/calendar-invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calendarId,
          fromUserId,
          forUserId,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};

export const acceptCalendarInvite = async (
  calendarId,
  userId,
  pendingId,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/accept-calendar-invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calendarId,
          userId,
          pendingId,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};

export const queryAssistant = async (
  userId,
  queryText,
  token
) => {
  try {
    const httpResult = await fetch(
      `${endpointURL}/query-assistant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          queryText,
          token,
        }),
      }
    );

    const jsonify = httpResult.json();
    return jsonify;
  } catch (error) {
    console.log(`${error} while creating event`);
  }
};
