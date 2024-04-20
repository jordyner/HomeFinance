const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dashboardFolderPath = path.join(__dirname, "storage", "dashboardList");

// Method to read an dashboard from a file
function get(dashboardId) {
  try {
    const filePath = path.join(dashboardFolderPath, `${dashboardId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadDashboard", message: error.message };
  }
}

// Method to write an dashboard to a file
function create(dashboard) {
  try {
    dashboard.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(dashboardFolderPath, `${dashboard.id}.json`);
    const fileData = JSON.stringify(dashboard);
    fs.writeFileSync(filePath, fileData, "utf8");
    return dashboard;
  } catch (error) {
    throw { code: "failedToCreateDashboard", message: error.message };
  }
}

// Method to update dashboard in a file
function update(dashboard) {
  try {
    const currentDashboard = get(dashboard.id);
    if (!currentDashboard) return null;
    const newDashboard = { ...currentDashboard, ...dashboard };
    const filePath = path.join(dashboardFolderPath, `${dashboard.id}.json`);
    const fileData = JSON.stringify(newDashboard);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newDashboard;
  } catch (error) {
    throw { code: "failedToUpdateDashboard", message: error.message };
  }
}

// Method to remove an dashboard from a file
function remove(dashboardId) {
  try {
    const filePath = path.join(dashboardFolderPath, `${dashboardId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveDashboard", message: error.message };
  }
}

// Method to list dashboards in a folder
function list() {
  try {
    const files = fs.readdirSync(dashboardFolderPath);
    const dashboardList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(dashboardFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return dashboardList;
  } catch (error) {
    throw { code: "failedToListDashboards", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
