exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // for reference, Github limits usernames to 30 characters
    username: { type: "varchar(30)", notNull: true, unique: true },
    // Why 254 in length? https://stackoverflow.com/a/1199238
    email: { type: "varchar(254)", notNull: true, unique: true },
    // Why 60 in length? https://www.npmjs.com/package/bcrypt
    password: { type: "varchar(60)", notNull: true },
    createdAt: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updatedAt: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
