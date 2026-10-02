import asyncHandler from "../utils/AsyncHandler.js";
import PlaceService from "../services/place.service.js";

class PlaceController {
  static create = async (req, res) => {
    console.log("=== CREATE PLACE ===");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const data = await PlaceService.createPlace(req.body, req.file);
    return res.success(data, "Place created", 201);
  };

  static getAll = async (req, res) => {
    const data = await PlaceService.getAllPlaces();
    return res.success(data, "Places fetched");
  };

  static getById = async (req, res) => {
    const data = await PlaceService.getPlaceById(req.params.id);
    return res.success(data, "Place fetched");
  };

  static update = async (req, res) => {
    console.log("=== UPDATE PLACE ===");
    console.log("body:", req.body);
    console.log("file:", req.file); // 🔥 yahan undefined aaye toh multer issue
    console.log("params:", req.params);
    const data = await PlaceService.updatePlace(
      req.params.id,
      req.body,
      req.file
    );
    return res.success(data, "Place updated");
  };

  static delete = async (req, res) => {
    await PlaceService.deletePlace(req.params.id);
    return res.success(null, "Place deleted");
  };
}

export default PlaceController;
