import ScanLogService from "../services/scanLog.service.js";

class ScanLogController {

  static getAll = async (req, res) => {

    const data = await ScanLogService.getAll();

    res.success(data, "Scan logs fetched");
  };
}

export default ScanLogController;