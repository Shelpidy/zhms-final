// "use server"
// import User from "../models/Users";
// import Patient from "../models/Patients";
// import Specialization from "@/models/Specializations";
// import BloodGroup from "@/models/BloodGroups";
// import Doctor from "@/models/Doctors";
// import Appointment from "@/models/Appointments";
// import bcrypt from "bcrypt";

// export async function GetAllUsers(): Promise<User[]> {
//     try {
//       const users = await User.findAll();
//       return users
//     //   const jsonUsers = users.map(user => user.toJSON()); // Convert each user to JSON
//     //   return jsonUsers;
//     } catch (error) {
//       // Handle the error here, you can log it or throw a custom error
//       console.error('Error fetching users:', error);
//       throw new Error('Unable to fetch users');
//     }
//   }
// export async function AddUser(user:any) : Promise<void> {
//  try {

//     const hashedPassword = await bcrypt.hash(user.password, 10);

//     console.log(user.profileImage)
//     const newUser = await  User.create({
//        firstName: user.firstName,
//        lastName: user.lastName,
//        profileImage: user.profileImage,
//        contactNumber: user.contactNumber,
//        gender: user.gender || 'male',
//        address: user.address,
//        password: hashedPassword,
//        email: user.email,
//        role: user.role || "patient",
//        dateOfBirth: user.dateOfBirth
//     })
//     console.log(newUser)
//  } catch (error) {
//     console.log(error);
//  }
// }
// export async function AddPatient(patient:any) : Promise<void> {
//     try {
//         const bldGrp = await BloodGroup.create({
//             groupName: patient.bloodGroup
//         })
//         console.log("blood group created", bldGrp.toJSON())
//         const { bloodGroupId } = bldGrp.dataValues;
//         const user = await User.findOne({ where: {email: patient?.email}});
//         if (user) {
//           const { userId } = user.dataValues;
//           const newPatient = await Patient.create({
//             userId,
//             diagnosis: patient.diagnosis,
//             bloodGroupId
//           })

//           console.log("new patient created",  newPatient.toJSON());
//         }
//         else{
//             console.log("user not found", patient.email);
//         }
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }

// export async function AddDoctors({ email, specialization}: {
//     email: string,
//     specialization: string
// }): Promise<void> {
//     try {
//         const spec = await Specialization.create({
//             specializationName: specialization
//            })
//            console.log("Specialization added",spec.toJSON());
//         const { specializationId } = spec.dataValues
//         const user = await User.findOne({ where: {email: email }});
//         if(user){
//             const { userId } = user.dataValues
//             const doctor = await Doctor.create({
//             userId,
//             specializationId,
//         })

//         console.log("new Doctor created", doctor.toJSON());
//         }
//         else{
//             console.log("user not found", email)
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

// export async function AddAppointments(appointment: any): Promise<void> {
//     try {
//         const doctorfromUser = await User.findOne({ where: { email: appointment?.doctoremail } });
//         const patientfromUser = await User.findOne({ where: { email: appointment?.patientemail } });

//         if (doctorfromUser && patientfromUser) {
//             const doctorUserId = doctorfromUser.userId;
//             const patientUserId = patientfromUser.userId;

//             const doctor = await Doctor.findOne({ where: { userId: doctorUserId } });
//             const patient = await Patient.findOne({ where: { userId: patientUserId } });

//             if (doctor && patient) {
//                 const { doctorId } = doctor.dataValues;
//                 const { patientId } = patient.dataValues;

//                const appointmentOne = await Appointment.create({
//                     appointmentStatus: "pending",
//                     doctorId,
//                     reason: appointment.reasons,
//                     note: appointment.note,
//                     patientId,
//                     appointmentDate: appointment.date
//                 });

//                 console.log("Appointment added successfully.", appointmentOne);
//             } else {
//                 console.log("Doctor or patient not found.");
//             }
//         } else {
//             console.log("Doctor or patient user not found.");
//         }
//     } catch (error) {
//         console.error("An error occurred:", error);
//     }
// }

// export async function UpdateAppointment(appointment: any): Promise<void> {
//     try {
//         const doctorfromUser = await User.findOne({ where: { email: appointment?.doctoremail } });
//         const patientfromUser = await User.findOne({ where: { email: appointment?.patientemail } });

//         if (doctorfromUser && patientfromUser) {
//             const doctorUserId = doctorfromUser.userId;
//             const patientUserId = patientfromUser.userId;

//             const doctor = await Doctor.findOne({ where: { userId: doctorUserId } });
//             const patient = await Patient.findOne({ where: { userId: patientUserId } });

//             if (doctor && patient) {
//                 const { doctorId } = doctor.dataValues;
//                 const { patientId } = patient.dataValues;

//                 const updatedAppointment = await Appointment.update(
//                     {
//                         appointmentStatus: appointment.appointmentStatus,
//                         reason: appointment.reasons,
//                         note: appointment.note,
//                         appointmentDate: appointment.date
//                     },
//                     {
//                         where: {
//                             doctorId,
//                             patientId,
//                             appointmentDate: appointment.date
//                         }
//                     }
//                 );

//                 if (updatedAppointment[0] === 1) {
//                     console.log("Appointment updated successfully.");
//                 } else {
//                     console.log("No matching appointment found.");
//                 }
//             } else {
//                 console.log("Doctor or patient not found.");
//             }
//         } else {
//             console.log("Doctor or patient user not found.");
//         }
//     } catch (error) {
//         console.error("An error occurred:", error);
//     }
// }
