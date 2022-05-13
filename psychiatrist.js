import express from "express";
const app = express();
import mongoose from "mongoose";
import { check, validationResult } from "express-validator";
function connect() {
  mongoose.connect("mongodb://127.0.0.1:27017/", {
    dbName: "Hospital",
  });
}
app.use(express.json());
const psychiatristSchema = mongoose.Schema({
  first_name: { type: String, require: true },
  last_name: { type: String, require: true },
  Hospital_Name: { type: String, require: true },
  phone_number: { type: Number, require: true },
  pincode: { type: Number },
  state: { type: String },
});

const modelpsychiatrist = mongoose.model("psychiatrist", psychiatristSchema);
const patientSchema = mongoose.Schema({
  Name: { type: String, require: true },
  Address: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  Phone_Number: {
    type: String,
    require: true,
  },
  password: { type: String, require: true },
  status: { type: Boolean, default: true },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: modelpsychiatrist,
  },
});
const patient = mongoose.model("patients", patientSchema);
app.post(
  "/psychiatrist",
  [
    check("Name", "firstname_length must be 20 max").isLength({
      max: 20,
    }),
    check("last_name", "lastname_length must be 20 max").isLength({
      max: 20,
    }),
  ],
  async (req, res) => {
    // any occurs or not and return an object
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json(errors);
    } else {
      const mydata = await modelpsychiatrist.create(req.body);
      const data = await mydata;
      res.send(data);
    }
  }
);
app.get("/psychiatrist", async (req, res) => {
  const mydata = await modelpsychiatrist.find().lean().exec();
  res.send(mydata);
});
app.post(
  "/patient",
  [
    check("Name", "Name length must be minimum 3").isLength({
      min: 3,
    }),
    check("Address", "adsress must be minimum 10").isLength({
      min: 10,
    }),
    check("Email", "not a valid email").isEmail(),
    check("Phone_Number", "not valid number").isMobilePhone(),
    check(
      "password",
      "Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character. "
    )
      .isLength({ min: 8, max: 15 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json(errors);
    } else {
      const mydata = await patient.create(req.body);
      res.send(mydata);
    }
  }
);
app.get("/patient", async (req, res) => {
  const mydata = await patient.find().populate("doctor_id").lean().exec();
  res.send(mydata);
});
export default modelpsychiatrist;
//connection
app.listen("3001", async () => {
  await connect();
  console.log("hello!! listen port 3001");
});
//Updating an existing patient
app.patch("/patient/:id", async (req, res) => {
  let id = req.params.id;
  const mydata = await patient.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true }
  );
  res.send(mydata);
});
//Fetching all the patients in an order for a single psychiatrist (without photos).
app.get("/patientlist", async (req, res) => {
  const mydata = await patient;
});

//api
// {
//   hospitaname: {
//     doctor: [ patient - details;]
//
//     }
//   }
// }
