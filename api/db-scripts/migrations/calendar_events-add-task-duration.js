const { sequelize } = require("../../models");

const schemaName = "public";
const tableName = "calendar_events";
const columnName = "task_duration";
const dataType = "int"; //bit | int | char(5) | varchar(255)
const nullSetting = "not null"; // 'not null' | ''
const defaultValue = 0;

module.exports = {
  up: async ({ context: sequelize }) => {
    await sequelize.query(
      `
			  do $$
				begin
        if not exists (
                      select column_name from information_schema.columns
                       where column_name = N'${columnName}'
                         and table_name = N'${tableName}'
                      )
				then
                 alter table ${schemaName}.${tableName}
                         add column ${columnName} INT default '${defaultValue}';
				end if;
				end;
				$$;
      `
    );
  },

  down: async ({ context: sequelize }) => {
    return "nothing happened cause no function yet!";
  },
};
