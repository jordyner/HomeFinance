const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const chartFolderPath = path.join(__dirname, "storage", "chartList");

// Method to read an chart from a file
function get(chartId) {
  try {
    const filePath = path.join(chartFolderPath, `${chartId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadChart", message: error.message };
  }
}

// Method to write an chart to a file
function create(chart) {
  try {
    chart.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(chartFolderPath, `${chart.id}.json`);
    const fileData = JSON.stringify(chart);
    fs.writeFileSync(filePath, fileData, "utf8");
    return chart;
  } catch (error) {
    throw { code: "failedToCreateChart", message: error.message };
  }
}

// Method to update chart in a file
function update(chart) {
  try {
    const currentChart = get(chart.id);
    if (!currentChart) return null;
    const newChart = { ...currentChart, ...chart };
    const filePath = path.join(chartFolderPath, `${chart.id}.json`);
    const fileData = JSON.stringify(newChart);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newChart;
  } catch (error) {
    throw { code: "failedToUpdateChart", message: error.message };
  }
}

// Method to remove an chart from a file
function remove(chartId) {
  try {
    const filePath = path.join(chartFolderPath, `${chartId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveChart", message: error.message };
  }
}

// Method to list charts in a folder
function list() {
  try {
    const files = fs.readdirSync(chartFolderPath);
    const chartList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(chartFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return chartList;
  } catch (error) {
    throw { code: "failedToListCharts", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
