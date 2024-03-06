const getUserDataByEmailQuery = () => {
  return `
       select u.id,
              u.email,
              u.username,
              u.hashed,
              u.num_of_strikes,
              u.avatar_url, 
              ug.about,
              ug.age,
              ug.gender,
              r.abbreviation as region,
              r.name as region_name,
              ug.languages,
              ug.preferred_platform,
              ug.discord,
              ug.psn,
              ug.xbox,
              ug.last_seen,
              av1.name,
              av2.name,
              ur.roles,
              ur.play_styles
         from public.users u
    left join public.user_general_infos ug
           on ug.user_id = u.id
    left join public.user_rust_infos ur
           on ur.user_id = u.id
    left join public.regions r
           on r.id = ug.region
    left join public.availabilities av1
           on av1.id = ur.weekends
    left join public.availabilities av2
           on av2.id = ur.weekdays
        where u.email = :email
  `;
};

const createUserQuery = () => {
  return `
       insert into public.users (id, email, username, hashed, steam_id, avatar_url, created_at, updated_at)
            values ((select max(id) + 1 from public.users), :email, :username, :hashed, :steam_id, :avatar_url, current_timestamp, current_timestamp)
         returning id, email, hashed, username
       `;
};

module.exports = {
  getUserDataByEmailQuery,
  createUserQuery
};