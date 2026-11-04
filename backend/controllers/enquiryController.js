const Enquiry = require('../models/Enquiry');
const sendEmail = require('../config/mailer');

// @desc    Submit a new contact / enquiry message
// @route   POST /api/enquiries
// @access  Public
const submitEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name, email, and message.',
      });
    }

    // 1. Save enquiry in database
    const enquiry = await Enquiry.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'New Customer Inquiry',
      message,
    });

    // 2. Format HTML email to the administrator / store support
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #2563eb; color: #ffffff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">SHOP SPHERE Support Notification</h2>
          <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">New Customer Inquiry Received</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 120px;">Sender Name:</td>
              <td style="padding: 8px 0; color: #0f172a;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Sender Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Phone Number:</td>
              <td style="padding: 8px 0; color: #0f172a;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Subject:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${subject || 'General Inquiry'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Date & Time:</td>
              <td style="padding: 8px 0; color: #0f172a;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
            </tr>
          </table>

          <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px; color: #0f172a;">Message:</h4>
            <p style="margin: 0; color: #334155; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="text-align: center; margin-top: 25px;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your Inquiry on SHOP SPHERE')}" 
               style="background: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Reply to ${name}
            </a>
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 12px 20px; text-align: center; font-size: 12px; color: #64748b;">
          SHOP SPHERE Marketplace • Customer Relationship & Classifieds System
        </div>
      </div>
    `;

    // 3. Send email asynchronously
    let mailResult = { success: false };
    try {
      mailResult = await sendEmail({
        subject: `[SHOP SPHERE Inquiry] ${subject || 'Customer Message'} from ${name}`,
        html: adminHtml,
        text: `Inquiry from ${name} (${email}):\n\n${message}`,
      });

      if (mailResult.success) {
        enquiry.emailSent = true;
        await enquiry.save();
      }
    } catch (mailErr) {
      console.error('Error sending email:', mailErr.message);
      enquiry.emailError = mailErr.message;
      await enquiry.save();
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted and notification has been dispatched to the administration.',
      enquiryId: enquiry._id,
      previewUrl: mailResult.previewUrl || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/enquiries/admin
// @access  Private (Admin)
const getAllEnquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PUT /api/enquiries/admin/:id/status
// @access  Private (Admin)
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (status) enquiry.status = status;
    await enquiry.save();

    res.status(200).json({
      success: true,
      message: `Inquiry marked as ${status}`,
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/enquiries/admin/:id
// @access  Private (Admin)
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    await enquiry.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Inquiry record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};

