import JobApplication from '../models/JobApplication.js';

export const getJobApplications = async (req, res) => {
  const applications = await JobApplication.find({ user: req.user._id }).sort({ appliedAt: -1 });
  res.json(applications);
};

export const createJobApplication = async (req, res) => {
  const { company, role, status, appliedAt } = req.body;

  if (!company || !role) {
    return res.status(400).json({ message: 'Company and role are required' });
  }

  const application = await JobApplication.create({
    user: req.user._id,
    company,
    role,
    status,
    appliedAt,
  });

  res.status(201).json(application);
};

export const updateJobApplication = async (req, res) => {
  const application = await JobApplication.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!application) {
    return res.status(404).json({ message: 'Job application not found' });
  }

  const { company, role, status, appliedAt } = req.body;

  if (company) application.company = company;
  if (role) application.role = role;
  if (status) application.status = status;
  if (appliedAt) application.appliedAt = appliedAt;

  await application.save();
  res.json(application);
};

export const deleteJobApplication = async (req, res) => {
  const application = await JobApplication.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!application) {
    return res.status(404).json({ message: 'Job application not found' });
  }

  res.json({ message: 'Job application removed' });
};
