const nodemailer = require("nodemailer")

  exports.sendMail = async (email, pdffile) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.Email,
            to: email,
            subject: "Contract signed ",
            html: `your contact have been signed`,
            attachments: [
                {
                    filename: 'contract.pdf', // Customize the filename as needed
                    content: pdffile, // Attach the PDF file content
                    encoding: 'base64',
                },
            ],
        };

        const mailSent = await transporter.sendMail(mailOptions);
        if (!mailSent) {
            throw new Error("Problem sending mail");
        }
    } catch (error) {
        console.log({ where: "sending mail", error: error });
    }
};
