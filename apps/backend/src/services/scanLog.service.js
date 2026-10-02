import prisma from "../db/db.js";

class ScanLogService {

  static async getAll() {

    return prisma.scanLog.findMany({

      include: {

        ticket: {
          include: {
            booking: true,
            type: true,
            place: true,
          },
        },
      },

      orderBy: {
        scannedAt: "desc",
      },
    });
  }
}

export default ScanLogService;