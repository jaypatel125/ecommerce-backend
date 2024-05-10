import { isValidObjectId } from "mongoose";

function checkId(req, res, next) {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  next();
}

export default checkId;
