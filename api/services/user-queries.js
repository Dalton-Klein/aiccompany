const getUserDataByEmailQuery = () => {
  return `
       select * from public.users u
       where u.email = :email
  `;
};

const getUserDataByIdQuery = () => {
  return `
       select * from public.users u
       where u.id = :userId
  `;
};

const getUserByUsernameQuery = () => {
  return `
       select * from public.users u
       where u.username = :username
  `;
};

const createUserQuery = () => {
  return `
       insert into public.users (id, email, username, apple_id, hashed, avatar_url, last_seen, created_at, updated_at)
            values ((select max(id) + 1 from public.users), :email, :username, :apple_id, :hashed, :avatar_url, current_timestamp, current_timestamp, current_timestamp)
         returning id, email, hashed, username
       `;
};

module.exports = {
  getUserDataByEmailQuery,
  getUserDataByIdQuery,
  getUserByUsernameQuery,
  createUserQuery,
};
