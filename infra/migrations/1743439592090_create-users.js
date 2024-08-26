exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // for reference, Github liits usernames to 30 characters
    username: { type: "varchar(30)", notNull: true, unique: true },
    // Why 254 in length? https://stackoverflow.com/a/1199238
    email: { type: "varchar(254)", notNull: true, unique: true },
    // Why 72 in length? https://stackoverflow.com/q/39849
    password: { type: "varchar(72)", notNull: true },
    createdAt: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updatedAt: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

exports.down = false;
