const fs = require("fs");
const phone = require("phone");
const csvOrExcel = require("csv-excel-to-json");
const { convertArrayToCSV } = require("convert-array-to-csv");

const writeJson = async () => {
  try {
    csvOrExcel.convertToJson("./input.csv", "./data.json");

    return true;
  } catch (e) {
    return false;
  }
};

const main = async () => {
  try {
    let data;
    await writeJson();

    await setTimeout(async () => {
      data = require("./data.json");

      const newData = data.map((lead) => {
        const { phone_number } = lead;
        const info = phone(phone_number);
        let cleanedNum;

        if (info[0]) {
          cleanedNum = info[0].replace(/^\+1/g, "");
        }

        return {
          ...lead,
          phone_number: cleanedNum,
          countryCode: info[1],
        };
      });

      const filteredData = newData.filter((lead) => {
        if (!!lead.phone_number === false) {
          return false;
        } else {
          return lead.countryCode === "USA" || lead.countryCode === undefined;
        }
      });

      console.log(`Found ${filteredData.length} out of ${data.length}`);

      const csv = await convertArrayToCSV(filteredData);

      fs.writeFile("./output.csv", csv, (err) => {
        console.log(err || "Done");
      });
    }, 500);
  } catch (e) {
    console.log("Failed");
  }
};

main();
