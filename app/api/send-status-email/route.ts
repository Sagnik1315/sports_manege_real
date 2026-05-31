import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, athleteName, status } = await req.json();

    let subject = "";
    let message = "";

    switch (status) {
      case "Approved":
        subject = "Application Approved";
        message = `
          Dear ${athleteName},

          Congratulations!

          Your athlete registration has been APPROVED.

          You may now proceed with club activities.

          Regards,
          Sports Club Management Team
        `;
        break;

      case "Rejected":
        subject = "Application Status Update";
        message = `
          Dear ${athleteName},

          We regret to inform you that your athlete registration has been REJECTED.

          For more details please contact the administration.

          Regards,
          Sports Club Management Team
        `;
        break;

      case "Under Review":
        subject = "Application Under Review";
        message = `
          Dear ${athleteName},

          Your application is currently UNDER REVIEW.

          We will notify you once a final decision has been made.

          Regards,
          Sports Club Management Team
        `;
        break;

      default:
        subject = "Application Status Updated";
        message = `
          Dear ${athleteName},

          Your application status has been updated to:

          ${status}

          Regards,
          Sports Club Management Team
        `;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text: message,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}