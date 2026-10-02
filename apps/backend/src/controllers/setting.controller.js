// src/controllers/setting.controller.js

import prisma from "../db/db.js";
import fs from "fs";

// ================= GET SETTINGS =================

export const getSetting = async (req, res, next) => {
  try {
    const setting = await prisma.setting.findUnique({
      where: {
        id: "global-setting",
      },
    });

    return res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    next(error);
  }
};

// ================= UPDATE SETTINGS =================

export const updateSetting = async (req, res, next) => {
  try {
    const {
      companyName,
      email,
      phone,
      address,
      facebook,
      instagram,
      twitter,
      youtube,
      linkedin,
    } = req.body;

    const existingSetting = await prisma.setting.findUnique({
      where: {
        id: "global-setting",
      },
    });

    let logo = existingSetting?.logo || null;

    // Upload new logo
    if (req.file) {
      // Delete old logo
      if (existingSetting?.logo) {
        const oldFile = existingSetting.logo.replace(/^\/+/, "");

        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
        }
      }

      logo = `/uploads/settings/${req.file.filename}`;
    }

    const socialLinks = {
      facebook,
      instagram,
      twitter,
      youtube,
      linkedin,
    };

    const setting = await prisma.setting.upsert({
      where: {
        id: "global-setting",
      },

      update: {
        companyName,
        email,
        phone,
        address,
        logo,
        socialLinks,
      },

      create: {
        id: "global-setting",
        companyName,
        email,
        phone,
        address,
        logo,
        socialLinks,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      data: setting,
    });
  } catch (error) {
    next(error);
  }
};