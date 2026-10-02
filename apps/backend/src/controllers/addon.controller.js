import AddonService from "../services/addon.service.js";

class AddonController {
  static handle = async (req, res) => {
    const data = await AddonService.handle(req.body);
    res.success(data, "Success");
  };
}

export default AddonController;
