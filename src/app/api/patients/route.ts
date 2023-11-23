import Patient from "@/models/Patients";
import BloodGroup from "@/models/BloodGroups";
import User from "@/models/Users";

export async function GET(req: Request) {
  try {
    const patients = await Patient.findAll();

    const patientsWithDetails = await Promise.all(
      patients.map(async (patient) => {
        const bloodGroup = await BloodGroup.findOne({
          where: { bloodGroupId: patient.bloodGroupId },
        });

        const user = await User.findOne({
          where: { userId: patient.userId },
          attributes: [
            "userId",
            "firstName",
            "lastName",
            "profileImage",
            "contactNumber",
            "gender",
            "dateOfBirth",
            "address",
            "email",
            "role",
          ],
        });

        return {
          patient,
          bloodGroup,
          user,
        };
      }),
    );

    return new Response(JSON.stringify({ patients: patientsWithDetails }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: "Something went wrong in the get all patients",
      }),
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const bldGroup = data.bloodGroup as string;
    const email = data.patientEmail as string;
    const diagnosis = data.diagnosis as string;

    // Check if a user with the given email exists
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Check if a patient with the same email already exists
    const existingPatient = await Patient.findOne({
      where: { userId: user.userId },
    });
    await user.update({ role: "patient" });

    if (existingPatient) {
      return new Response(
        JSON.stringify({ message: "Patient already exists" }),
        {
          status: 404, // Conflict status code
        },
      );
    }

    // Adding a new blood group to the database
    const bldGrp = await BloodGroup.findOne({
      where: {
        groupName: bldGroup,
      },
    });
    const bloodGroupId = bldGrp?.getDataValue("bloodGroupId");

    // Create a new patient
    const newPatient = await Patient.create({
      userId: user.userId, // Set the user ID explicitly
      diagnosis,
      bloodGroupId,
    });
    await Patient.update(
      { role: "patient" },
      { where: { userId: user.userId } },
    );

    return new Response(
      JSON.stringify({ message: "New patient added successfully", newPatient }),
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Something went wrong", error: error.message }),
      {
        status: 500,
      },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();

    const email = data.patientEmail as string;
    const patientId = data.patientId as string;
    const diagnosis = data.diagnosis as string;
    const bloodGrp = data.bloodGroup as string;

    const patient = await Patient.findOne({ where: { patientId: patientId } });
    if (!patient) {
      return new Response(JSON.stringify({ message: "Patient not found" }), {
        status: 404,
      });
    }
    const { bloodGroupId, userId } = patient.dataValues;
    const bloodGrpTable = await BloodGroup.findOne({
      where: { bloodGroupId: bloodGroupId },
    });
    // if(!bloodGrpTable) {
    //     return new Response(JSON.stringify({message: "BloodGroup not found"}))
    // }
    await BloodGroup.update(
      {
        groupName: bloodGrp,
        bloodGroupId,
      },
      { where: { bloodGroupId: bloodGroupId } },
    );

    await patient.update(
      {
        patientId,
        userId,
        diagnosis,
        bloodGroupId,
      },
      { where: { patientId } },
    );

    // const updatedPatient = await Patient.findOne({ where: { patientId: patientId } });

    return new Response(
      JSON.stringify({ message: "User updated successfully" }),
      {
        status: 202,
      },
    );
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: "Something went wrong in PUT",
        error: error.message,
      }),
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("patientId");
    if (!id) {
      return new Response(JSON.stringify({ message: "Missing id parameter" }), {
        status: 400,
      });
    }
    const patient = await Patient.findOne({ where: { patientId: id } });
    if (!patient) {
      return new Response(JSON.stringify({ message: "Patient not found" }), {
        status: 404,
      });
    }
    await User.update({role:"user"},{where:{userId:patient.getDataValue("userId")}})
    await patient.destroy();
    return new Response(
      JSON.stringify({ message: "patient deleted successfully" }),
      {
        status: 203,
      },
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Something went wrong in DELETE" }),
      {
        status: 500,
      },
    );
  }
}
