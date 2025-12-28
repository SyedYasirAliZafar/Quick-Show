import { Inngest } from "inngest";
import {User} from '../models/user.model.js'
import { connectDB } from '../config/connectDB.js'

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest Function to save user data to a database


const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB(); // 🔥 MOST IMPORTANT LINE

    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    await User.create({
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    });

    return { success: true };
  }
);




// Delete Function

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    await User.findByIdAndDelete(event.data.id);

    return { success: true };
  }
);



// Update Function

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    await connectDB();

    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    await User.findByIdAndUpdate(id, {
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    });

    return { success: true };
  }
);



// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];