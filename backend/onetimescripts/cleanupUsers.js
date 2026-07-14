const mongoose = require("mongoose");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();


const emailsToDelete = [
  "vaibmah933@gmail.com",
  "vaibhavmaheshwari768@gmail.com",
  "maheshwarivaibhav109@gmail.com",
  "maheshwarivaibhav066@gmail.com"
];

async function deleteUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const usersToDelete = await User.find(
      { email: { $in: emailsToDelete } },
      { email: 1, _id: 0 }
    );

    const deletedEmails = usersToDelete.map(user => user.email);

    const result = await User.deleteMany({
      email: { $in: emailsToDelete },
    });

    console.log(`Deleted ${result.deletedCount} users.`);
    console.log("Deleted emails:", deletedEmails);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error deleting users:", err);
    process.exit(1);
  }
}

deleteUsers();