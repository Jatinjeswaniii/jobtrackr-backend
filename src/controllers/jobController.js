import Job from "../models/Job.js";

export const getJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", status } = req.query;

    const query = {
      createdBy: req.user._id,
      ...(status && { status }),
      ...(search && {
        $or: [
          { company: { $regex: search, $options: "i" } },
          { position: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const jobs = await Job.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json({ jobs, total, page: Number(page) });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const { company, position, status } = req.body;

    if (!company || !position) {
      res.status(400);
      throw new Error("Company and Position are required");
    }

    const job = await Job.create({
      company,
      position,
      status,
      createdBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    Object.assign(job, req.body);
    await job.save();

    res.json(job);
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    res.json({ message: "Job deleted" });
  } catch (error) {
    next(error);
  }
};
